// src/hooks/usePedidos.js
// Hook personalizado para gestión de pedidos con persistencia en IndexedDB

import { useState, useEffect, useCallback, useMemo } from 'react';
import { openDB } from 'idb';
import { PEDIDOS_INICIALES, PEDIDOS_ESTADOS, ESTADO_ORDEN, SIGUIENTE_ESTADO, ESTADOS_ITEM_SIGUIENTE } from '../data/pedidosMock';

const DB_NAME = 'sumaq-pedidos-db';
const STORE_NAME = 'pedidos';
const DB_VERSION = 1;

// ========================================
// FUNCIONES DE INDEXEDDB
// ========================================

const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('mesaId', 'mesaId');
        store.createIndex('estado', 'estado');
        store.createIndex('creadoEn', 'creadoEn');
      }
    }
  });
};

const cargarDesdeIndexedDB = async () => {
  try {
    const db = await initDB();
    const pedidos = await db.getAll(STORE_NAME);
    return pedidos.length > 0 ? pedidos : null;
  } catch (error) {
    console.warn('Error cargando pedidos de IndexedDB:', error);
    return null;
  }
};

const guardarEnIndexedDB = async (pedidos) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await Promise.all([
      ...pedidos.map(pedido => tx.store.put(pedido)),
      tx.done
    ]);
    return true;
  } catch (error) {
    console.error('Error guardando pedidos en IndexedDB:', error);
    return false;
  }
};

const limpiarIndexedDB = async () => {
  try {
    const db = await initDB();
    await db.clear(STORE_NAME);
    return true;
  } catch (error) {
    console.error('Error limpiando IndexedDB:', error);
    return false;
  }
};

// ========================================
// HOOK PRINCIPAL
// ========================================

export function usePedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroMesa, setFiltroMesa] = useState('Todas');
  const [filtroZona, setFiltroZona] = useState('Todas');
  const [filtroFecha, setFiltroFecha] = useState('');

  // Debounce para búsqueda
  const [filtroBusquedaDebounced, setFiltroBusquedaDebounced] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setFiltroBusquedaDebounced(filtroBusqueda);
    }, 300);
    return () => clearTimeout(timer);
  }, [filtroBusqueda]);

  // Carga inicial
  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        setCargando(true);
        const datosGuardados = await cargarDesdeIndexedDB();

        if (datosGuardados) {
          setPedidos(datosGuardados);
        } else {
          setPedidos(PEDIDOS_INICIALES);
          await guardarEnIndexedDB(PEDIDOS_INICIALES);
        }
        setError(null);
      } catch (err) {
        setError('Error al cargar los pedidos');
        console.error(err);
        // Fallback a datos mock
        setPedidos(PEDIDOS_INICIALES);
      } finally {
        setCargando(false);
      }
    };

    cargarPedidos();
  }, []);

  // Persistencia automática
  useEffect(() => {
    if (!cargando && pedidos.length > 0) {
      guardarEnIndexedDB(pedidos);
    }
  }, [pedidos, cargando]);

  // ========================================
  // COMPUTADOS
  // ========================================

  const resumen = useMemo(() => {
    const estados = PEDIDOS_ESTADOS.reduce((acc, estado) => {
      acc[estado] = 0;
      return acc;
    }, {});

    let totalIngresos = 0;
    let pedidosHoy = 0;
    const hoy = new Date().toDateString();

    pedidos.forEach(pedido => {
      if (Object.hasOwn(estados, pedido.estado)) {
        estados[pedido.estado]++;
      }
      if (pedido.estado !== 'Cancelado') {
        totalIngresos += pedido.total;
      }
      if (new Date(pedido.creadoEn).toDateString() === hoy) {
        pedidosHoy++;
      }
    });

    return {
      ...estados,
      total: pedidos.length,
      totalIngresos: Math.round(totalIngresos * 100) / 100,
      pedidosHoy
    };
  }, [pedidos]);

  const mesasUnicas = useMemo(() => {
    const mesas = [...new Set(pedidos.map(p => p.mesaNumero))].sort((a, b) => a - b);
    return mesas;
  }, [pedidos]);

  const zonasUnicas = useMemo(() => {
    const zonas = [...new Set(pedidos.map(p => p.zona))].sort();
    return zonas;
  }, [pedidos]);

  // Pedidos filtrados
  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter(pedido => {
      // Búsqueda por número de pedido, mesa, mozo
      const coincideBusqueda = !filtroBusquedaDebounced ||
        pedido.numero.toLowerCase().includes(filtroBusquedaDebounced.toLowerCase()) ||
        pedido.mesaNombre.toLowerCase().includes(filtroBusquedaDebounced.toLowerCase()) ||
        pedido.mozo.toLowerCase().includes(filtroBusquedaDebounced.toLowerCase()) ||
        pedido.items.some(item => item.nombre.toLowerCase().includes(filtroBusquedaDebounced.toLowerCase()));

      // Filtro por estado
      const coincideEstado = filtroEstado === 'Todos' || pedido.estado === filtroEstado;

      // Filtro por mesa
      const coincideMesa = filtroMesa === 'Todas' || String(pedido.mesaNumero) === filtroMesa;

      // Filtro por zona
      const coincideZona = filtroZona === 'Todas' || pedido.zona === filtroZona;

      // Filtro por fecha
      const coincideFecha = !filtroFecha ||
        new Date(pedido.creadoEn).toISOString().split('T')[0] === filtroFecha;

      return coincideBusqueda && coincideEstado && coincideMesa && coincideZona && coincideFecha;
    }).sort((a, b) => {
      // Ordenar: primero por estado (orden de flujo), luego por fecha descendente
      const ordenA = ESTADO_ORDEN[a.estado] || 99;
      const ordenB = ESTADO_ORDEN[b.estado] || 99;
      if (ordenA !== ordenB) return ordenA - ordenB;
      return new Date(b.creadoEn) - new Date(a.creadoEn);
    });
  }, [pedidos, filtroBusquedaDebounced, filtroEstado, filtroMesa, filtroZona, filtroFecha]);

  // ========================================
  // ACCIONES CRUD
  // ========================================

  const crearPedido = useCallback(async (datos) => {
    const nuevoPedido = {
      ...datos,
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      numero: `PED-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      estado: 'Pendiente',
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
      horaInicio: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      tiempoTranscurrido: 0
    };

    setPedidos(prev => [nuevoPedido, ...prev]);
    return nuevoPedido;
  }, []);

  const editarPedido = useCallback(async (id, datos) => {
    setPedidos(prev => prev.map(pedido =>
      pedido.id === id
        ? { ...pedido, ...datos, actualizadoEn: new Date().toISOString() }
        : pedido
    ));
  }, []);

  const eliminarPedido = useCallback(async (id) => {
    setPedidos(prev => prev.filter(pedido => pedido.id !== id));
  }, []);

  const cambiarEstadoPedido = useCallback(async (id, nuevoEstado) => {
    setPedidos(prev => prev.map(pedido => {
      if (pedido.id !== id) return pedido;

      const nuevoPedido = {
        ...pedido,
        estado: nuevoEstado,
        actualizadoEn: new Date().toISOString()
      };

      // Si pasa a "En preparación", actualizar items pendientes
      if (nuevoEstado === 'En preparación') {
        nuevoPedido.items = nuevoPedido.items.map(item =>
          item.estado === 'Pendiente' ? { ...item, estado: 'En preparación' } : item
        );
      }

      // Si pasa a "Listo" o "Entregado", actualizar todos los items
      if (nuevoEstado === 'Listo' || nuevoEstado === 'Entregado') {
        nuevoPedido.items = nuevoPedido.items.map(item =>
          item.estado !== 'Cancelado' ? { ...item, estado: nuevoEstado } : item
        );
      }

      return nuevoPedido;
    }));
  }, []);

  const cambiarEstadoItem = useCallback(async (pedidoId, itemId, nuevoEstado) => {
    setPedidos(prev => prev.map(pedido => {
      if (pedido.id !== pedidoId) return pedido;

      const nuevoPedido = {
        ...pedido,
        items: pedido.items.map(item =>
          item.id === itemId ? { ...item, estado: nuevoEstado } : item
        ),
        actualizadoEn: new Date().toISOString()
      };

      // Actualizar estado del pedido basado en items
      const estadosItems = nuevoPedido.items.map(i => i.estado);
      if (estadosItems.every(e => e === 'Entregado')) {
        nuevoPedido.estado = 'Entregado';
      } else if (estadosItems.every(e => e === 'Cancelado')) {
        nuevoPedido.estado = 'Cancelado';
      } else if (estadosItems.some(e => e === 'En preparación')) {
        nuevoPedido.estado = 'En preparación';
      } else if (estadosItems.some(e => e === 'Listo') && estadosItems.every(e => e === 'Listo' || e === 'Entregado' || e === 'Cancelado')) {
        nuevoPedido.estado = 'Listo';
      } else if (estadosItems.every(e => e === 'Pendiente' || e === 'Cancelado')) {
        nuevoPedido.estado = 'Pendiente';
      }

      return nuevoPedido;
    }));
  }, []);

  const agregarItem = useCallback(async (pedidoId, item) => {
    setPedidos(prev => prev.map(pedido => {
      if (pedido.id !== pedidoId) return pedido;

      const nuevoItem = {
        ...item,
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        estado: 'Pendiente'
      };

      const nuevoPedido = {
        ...pedido,
        items: [...pedido.items, nuevoItem],
        subtotal: Math.round((pedido.subtotal + item.precio * item.cantidad) * 100) / 100,
        igv: Math.round((pedido.subtotal + item.precio * item.cantidad) * 0.18 * 100) / 100,
        total: Math.round((pedido.subtotal + item.precio * item.cantidad) * 1.18 * 100) / 100,
        actualizadoEn: new Date().toISOString()
      };

      return nuevoPedido;
    }));
  }, []);

  const eliminarItem = useCallback(async (pedidoId, itemId) => {
    setPedidos(prev => prev.map(pedido => {
      if (pedido.id !== pedidoId) return pedido;

      const itemAEliminar = pedido.items.find(i => i.id === itemId);
      if (!itemAEliminar) return pedido;

      const nuevoPedido = {
        ...pedido,
        items: pedido.items.filter(i => i.id !== itemId),
        subtotal: Math.round((pedido.subtotal - itemAEliminar.precio * itemAEliminar.cantidad) * 100) / 100,
        igv: Math.round((pedido.subtotal - itemAEliminar.precio * itemAEliminar.cantidad) * 0.18 * 100) / 100,
        total: Math.round((pedido.subtotal - itemAEliminar.precio * itemAEliminar.cantidad) * 1.18 * 100) / 100,
        actualizadoEn: new Date().toISOString()
      };

      return nuevoPedido;
    }));
  }, []);

  const duplicarPedido = useCallback(async (id) => {
    const pedidoOriginal = pedidos.find(p => p.id === id);
    if (!pedidoOriginal) return null;

    const nuevoPedido = {
      ...pedidoOriginal,
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      numero: `PED-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      estado: 'Pendiente',
      items: pedidoOriginal.items.map(item => ({
        ...item,
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        estado: 'Pendiente'
      })),
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
      horaInicio: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      tiempoTranscurrido: 0
    };

    setPedidos(prev => [nuevoPedido, ...prev]);
    return nuevoPedido;
  }, [pedidos]);

  const resetearDatos = useCallback(async () => {
    await limpiarIndexedDB();
    setPedidos(PEDIDOS_INICIALES);
    await guardarEnIndexedDB(PEDIDOS_INICIALES);
  }, []);

  const limpiarFiltros = useCallback(() => {
    setFiltroBusqueda('');
    setFiltroEstado('Todos');
    setFiltroMesa('Todas');
    setFiltroZona('Todas');
    setFiltroFecha('');
  }, []);

  // ========================================
  // UTILIDADES
  // ========================================

  const obtenerSiguienteEstado = (estadoActual) => {
    return SIGUIENTE_ESTADO[estadoActual] || estadoActual;
  };

  const obtenerSiguienteEstadoItem = (estadoActual) => {
    return ESTADOS_ITEM_SIGUIENTE[estadoActual] || estadoActual;
  };

  const calcularTiempoTranscurrido = (creadoEn) => {
    const diff = Date.now() - new Date(creadoEn).getTime();
    const minutos = Math.floor(diff / 60000);
    if (minutos < 60) return `${minutos} min`;
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}min`;
  };

  return {
    // Estado
    pedidos: pedidosFiltrados,
    todosLosPedidos: pedidos,
    cargando,
    error,
    resumen,
    mesasUnicas,
    zonasUnicas,

    // Filtros
    filtroBusqueda,
    setFiltroBusqueda,
    filtroEstado,
    setFiltroEstado,
    filtroMesa,
    setFiltroMesa,
    filtroZona,
    setFiltroZona,
    filtroFecha,
    setFiltroFecha,

    // Acciones
    crearPedido,
    editarPedido,
    eliminarPedido,
    cambiarEstadoPedido,
    cambiarEstadoItem,
    agregarItem,
    eliminarItem,
    duplicarPedido,
    resetearDatos,
    limpiarFiltros,

    // Utilidades
    obtenerSiguienteEstado,
    obtenerSiguienteEstadoItem,
    calcularTiempoTranscurrido,
    estadosDisponibles: PEDIDOS_ESTADOS
  };
}