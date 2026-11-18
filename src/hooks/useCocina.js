// src/hooks/useCocina.js
// Hook personalizado para el módulo Cocina (KDS)
// Lee los pedidos de IndexedDB y añade funcionalidades específicas de cocina

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { openDB } from 'idb';
import { PEDIDOS_INICIALES, PEDIDOS_ESTADOS, ESTADO_ORDEN, SIGUIENTE_ESTADO, ESTADO_COLORES, ESTADO_ICONOS } from '../data/pedidosMock';

const DB_NAME = 'sumaq-pedidos-db';
const STORE_NAME = 'pedidos';
const DB_VERSION = 1;

// ========================================
// FUNCIONES DE INDEXEDDB (compartidas con usePedidos)
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

// ========================================
// ESTACIONES DE COCINA
// ========================================

export const ESTACIONES = [
  { id: 'todas', nombre: 'Todas', icono: '🍽️' },
  { id: 'caliente', nombre: 'Caliente', icono: '🔥', categorias: ['Principales'] },
  { id: 'frio', nombre: 'Frío', icono: '❄️', categorias: ['Entrantes', 'Postres'] },
  { id: 'barra', nombre: 'Barra', icono: '🍺', categorias: ['Bebidas'] }
];

// Mapear producto a estación
const obtenerEstacionProducto = (categoria) => {
  if (['Principales'].includes(categoria)) return 'caliente';
  if (['Entrantes', 'Postres'].includes(categoria)) return 'frio';
  if (['Bebidas'].includes(categoria)) return 'barra';
  return 'caliente';
};

// ========================================
// HOOK PRINCIPAL
// ========================================

export function useCocina() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [tiempoActual, setTiempoActual] = useState(() => Date.now());
  const [filtroEstacion, setFiltroEstacion] = useState('todas');
  const [filtroEstado, setFiltroEstado] = useState('activos'); // 'activos' | 'todos' | estado específico
  const [mostrarEntregados, setMostrarEntregados] = useState(false);
  const [alertaSonido, setAlertaSonido] = useState(false);
  const idsNotificadosRef = useRef(new Set());

  // Timer para actualizar tiempo transcurrido cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => setTiempoActual(() => Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

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

  // Detectar nuevos pedidos para alerta sonora
  useEffect(() => {
    if (cargando || pedidos.length === 0) return;

    const ahora = tiempoActual; // Usar el estado en lugar de Date.now()
    const nuevosIds = [];

    pedidos.forEach(p => {
      if (
        p.estado === 'Pendiente' &&
        !idsNotificadosRef.current.has(p.id) &&
        ahora - new Date(p.creadoEn).getTime() < 60000
      ) {
        nuevosIds.push(p.id);
      }
    });

    if (nuevosIds.length > 0) {
      // Marcar como notificados usando ref (no dispara re-render)
      nuevosIds.forEach(id => idsNotificadosRef.current.add(id));

      // Disparar alerta y sonido en el siguiente tick (evita setState sincrónico en effect)
      setTimeout(() => {
        setAlertaSonido(true);
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
          audio.volume = 0.3;
          audio.play().catch(() => {});
        } catch {
          // Silencioso si falla
        }
        setTimeout(() => setAlertaSonido(false), 3000);
      }, 0);
    }
  }, [pedidos, cargando, tiempoActual]);

  // ========================================
  // COMPUTADOS
  // ========================================

  // Calcular tiempo transcurrido formateado
  const calcularTiempoTranscurrido = useCallback((creadoEn) => {
    const diff = tiempoActual - new Date(creadoEn).getTime();
    const minutos = Math.floor(diff / 60000);
    const segundos = Math.floor((diff % 60000) / 1000);
    if (minutos < 1) return `${segundos}s`;
    if (minutos < 60) return `${minutos} min`;
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}min`;
  }, [tiempoActual]);

  // Ver si un pedido está demorado (más de 20 min en Pendiente/En preparación)
  const esDemorado = useCallback((pedido) => {
    if (['Entregado', 'Cancelado'].includes(pedido.estado)) return false;
    const diff = tiempoActual - new Date(pedido.creadoEn).getTime();
    return diff > 20 * 60 * 1000; // 20 minutos
  }, [tiempoActual]);

  // Ver si un pedido es urgente (más de 30 min)
  const esUrgente = useCallback((pedido) => {
    if (['Entregado', 'Cancelado'].includes(pedido.estado)) return false;
    const diff = tiempoActual - new Date(pedido.creadoEn).getTime();
    return diff > 30 * 60 * 1000; // 30 minutos
  }, [tiempoActual]);

  // Agrupar items por estación
  const agruparItemsPorEstacion = useCallback((items) => {
    const grupos = {
      caliente: [],
      frio: [],
      barra: []
    };
    items.forEach(item => {
      const estacion = obtenerEstacionProducto(item.categoria);
      grupos[estacion].push(item);
    });
    return grupos;
  }, []);

  // Filtrar pedidos según estación y estado
  const pedidosFiltrados = useMemo(() => {
    return pedidos
      .filter(pedido => {
        // Filtro por estado
        if (filtroEstado === 'activos') {
          if (['Entregado', 'Cancelado'].includes(pedido.estado)) return false;
        } else if (filtroEstado !== 'todos' && filtroEstado !== 'Todos') {
          if (pedido.estado !== filtroEstado) return false;
        }

        // Filtro por estación
        if (filtroEstacion !== 'todas') {
          const itemsEstacion = pedido.items.filter(item =>
            obtenerEstacionProducto(item.categoria) === filtroEstacion
          );
          if (itemsEstacion.length === 0) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Orden: primero por estado (Pendiente > En preparación > Listo > Entregado > Cancelado)
        const ordenA = ESTADO_ORDEN[a.estado] || 99;
        const ordenB = ESTADO_ORDEN[b.estado] || 99;
        if (ordenA !== ordenB) return ordenA - ordenB;
        // Luego por tiempo: más antiguos primero
        return new Date(a.creadoEn) - new Date(b.creadoEn);
      });
  }, [pedidos, filtroEstado, filtroEstacion]);

  // Resumen por estado
  const resumen = useMemo(() => {
    const estados = PEDIDOS_ESTADOS.reduce((acc, estado) => {
      acc[estado] = 0;
      return acc;
    }, {});

    pedidos.forEach(pedido => {
      if (Object.hasOwn(estados, pedido.estado)) {
        estados[pedido.estado]++;
      }
    });

    return {
      ...estados,
      total: pedidos.length,
      activos: pedidos.filter(p => !['Entregado', 'Cancelado'].includes(p.estado)).length,
      demorados: pedidos.filter(p => esDemorado(p)).length,
      urgentes: pedidos.filter(p => esUrgente(p)).length
    };
  }, [pedidos, esDemorado, esUrgente]);

  // ========================================
  // ACCIONES DE COCINA
  // ========================================

  const cambiarEstadoPedido = useCallback(async (id, nuevoEstado) => {
    setPedidos(prev => prev.map(pedido => {
      if (pedido.id !== id) return pedido;

      const nuevoPedido = {
        ...pedido,
        estado: nuevoEstado,
        actualizadoEn: new Date().toISOString()
      };

      // Actualizar items según el nuevo estado del pedido
      if (nuevoEstado === 'En preparación') {
        nuevoPedido.items = nuevoPedido.items.map(item =>
          item.estado === 'Pendiente' ? { ...item, estado: 'En preparación' } : item
        );
      } else if (nuevoEstado === 'Listo' || nuevoEstado === 'Entregado') {
        nuevoPedido.items = nuevoPedido.items.map(item =>
          item.estado !== 'Cancelado' ? { ...item, estado: nuevoEstado } : item
        );
      } else if (nuevoEstado === 'Cancelado') {
        nuevoPedido.items = nuevoPedido.items.map(item =>
          ({ ...item, estado: 'Cancelado' })
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

  const siguienteEstadoPedido = useCallback((estadoActual) => {
    return SIGUIENTE_ESTADO[estadoActual] || estadoActual;
  }, []);

  const siguienteEstadoItem = useCallback((estadoActual) => {
    const siguientes = {
      'Pendiente': 'En preparación',
      'En preparación': 'Listo',
      'Listo': 'Entregado',
      'Entregado': 'Entregado',
      'Cancelado': 'Cancelado'
    };
    return siguientes[estadoActual] || estadoActual;
  }, []);

  const puedeAvanzarEstado = useCallback((estado) => {
    return ['Pendiente', 'En preparación', 'Listo'].includes(estado);
  }, []);

  const resetearDatos = useCallback(async () => {
    const db = await initDB();
    await db.clear(STORE_NAME);
    setPedidos(PEDIDOS_INICIALES);
    await guardarEnIndexedDB(PEDIDOS_INICIALES);
  }, []);

  return {
    // Estado
    pedidos: pedidosFiltrados,
    todosLosPedidos: pedidos,
    cargando,
    error,
    resumen,
    tiempoActual,

    // Filtros
    filtroEstacion,
    setFiltroEstacion,
    filtroEstado,
    setFiltroEstado,
    mostrarEntregados,
    setMostrarEntregados,
    estaciones: ESTACIONES,
    alertaSonido,

    // Acciones
    cambiarEstadoPedido,
    cambiarEstadoItem,
    siguienteEstadoPedido,
    siguienteEstadoItem,
    puedeAvanzarEstado,
    resetearDatos,

    // Utilidades
    calcularTiempoTranscurrido,
    esDemorado,
    esUrgente,
    agruparItemsPorEstacion,
    obtenerEstacionProducto,
    ESTADO_COLORES,
    ESTADO_ICONOS,
    ESTADO_ORDEN
  };
}