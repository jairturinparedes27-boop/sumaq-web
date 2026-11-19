// src/hooks/useInsumos.js
// Hook personalizado para gestión de insumos, inventario y recetas con persistencia en IndexedDB

import { useState, useEffect, useCallback, useMemo } from 'react';
import { openDB } from 'idb';
import {
  CATEGORIAS_INSUMO,
  UNIDADES_MEDIDA,
  PROVEEDORES_INICIALES,
  INSUMOS_INICIALES,
  RECETAS_INICIALES,
  MOVIMIENTOS_INICIALES,
  ESTADOS_INSUMO,
  TIPOS_MOVIMIENTO,
  MOTIVOS_MERMA,
  ESTADO_INSUMO_COLORES,
  TIPO_MOVIMIENTO_COLORES
} from '../data/insumosMock';

const DB_NAME = 'sumaq-insumos-db';
const STORE_INSUMOS = 'insumos';
const STORE_CATEGORIAS = 'categorias';
const STORE_PROVEEDORES = 'proveedores';
const STORE_MOVIMIENTOS = 'movimientos';
const STORE_RECETAS = 'recetas';
const DB_VERSION = 1;

// ========================================
// FUNCIONES DE INDEXEDDB
// ========================================
const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_INSUMOS)) {
        const store = db.createObjectStore(STORE_INSUMOS, { keyPath: 'id' });
        store.createIndex('categoriaId', 'categoriaId');
        store.createIndex('estado', 'estado');
        store.createIndex('codigo', 'codigo', { unique: true });
        store.createIndex('proveedorId', 'proveedorId');
      }
      if (!db.objectStoreNames.contains(STORE_CATEGORIAS)) {
        const store = db.createObjectStore(STORE_CATEGORIAS, { keyPath: 'id' });
        store.createIndex('nombre', 'nombre', { unique: true });
        store.createIndex('orden', 'orden');
      }
      if (!db.objectStoreNames.contains(STORE_PROVEEDORES)) {
        const store = db.createObjectStore(STORE_PROVEEDORES, { keyPath: 'id' });
        store.createIndex('nombre', 'nombre', { unique: true });
      }
      if (!db.objectStoreNames.contains(STORE_MOVIMIENTOS)) {
        const store = db.createObjectStore(STORE_MOVIMIENTOS, { keyPath: 'id' });
        store.createIndex('insumoId', 'insumoId');
        store.createIndex('fecha', 'fecha');
        store.createIndex('tipo', 'tipo');
      }
      if (!db.objectStoreNames.contains(STORE_RECETAS)) {
        const store = db.createObjectStore(STORE_RECETAS, { keyPath: 'id' });
        store.createIndex('productoCodigo', 'productoCodigo');
        store.createIndex('insumoCodigo', 'insumoCodigo');
      }
    }
  });
};

const cargarDesdeIndexedDB = async (storeName) => {
  try {
    const db = await initDB();
    const datos = await db.getAll(storeName);
    return datos.length > 0 ? datos : null;
  } catch (error) {
    console.warn(`Error cargando ${storeName} de IndexedDB:`, error);
    return null;
  }
};

const guardarEnIndexedDB = async (storeName, datos) => {
  try {
    const db = await initDB();
    const tx = db.transaction(storeName, 'readwrite');
    await Promise.all([
      ...datos.map(item => tx.store.put(item)),
      tx.done
    ]);
    return true;
  } catch (error) {
    console.error(`Error guardando ${storeName} en IndexedDB:`, error);
    return false;
  }
};

const limpiarIndexedDB = async () => {
  try {
    const db = await initDB();
    await db.clear(STORE_INSUMOS);
    await db.clear(STORE_CATEGORIAS);
    await db.clear(STORE_PROVEEDORES);
    await db.clear(STORE_MOVIMIENTOS);
    await db.clear(STORE_RECETAS);
    return true;
  } catch (error) {
    console.error('Error limpiando IndexedDB:', error);
    return false;
  }
};

// ========================================
// HOOK PRINCIPAL
// ========================================
export function useInsumos() {
  // Estado principal
  const [insumos, setInsumos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [recetas, setRecetas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroStock, setFiltroStock] = useState('Todos'); // 'Todos' | 'Bajo' | 'Critico' | 'OK'
  const [filtroProveedor, setFiltroProveedor] = useState('Todos');

  // Debounce para búsqueda
  const [filtroBusquedaDebounced, setFiltroBusquedaDebounced] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setFiltroBusquedaDebounced(filtroBusqueda), 300);
    return () => clearTimeout(timer);
  }, [filtroBusqueda]);

  // Vista: 'grid' | 'table'
  const [vista, setVista] = useState('table');

  // ========================================
  // CARGA INICIAL
  // ========================================
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);

        const [insumosGuardados, categoriasGuardadas, proveedoresGuardados, movimientosGuardados, recetasGuardadas] = await Promise.all([
          cargarDesdeIndexedDB(STORE_INSUMOS),
          cargarDesdeIndexedDB(STORE_CATEGORIAS),
          cargarDesdeIndexedDB(STORE_PROVEEDORES),
          cargarDesdeIndexedDB(STORE_MOVIMIENTOS),
          cargarDesdeIndexedDB(STORE_RECETAS)
        ]);

        if (insumosGuardados && categoriasGuardadas && proveedoresGuardados && movimientosGuardados && recetasGuardadas) {
          setInsumos(insumosGuardados);
          setCategorias(categoriasGuardadas);
          setProveedores(proveedoresGuardados);
          setMovimientos(movimientosGuardados);
          setRecetas(recetasGuardadas);
        } else {
          // Primera carga - poblar con datos iniciales
          setInsumos(INSUMOS_INICIALES);
          setCategorias(CATEGORIAS_INSUMO);
          setProveedores(PROVEEDORES_INICIALES);
          setMovimientos(MOVIMIENTOS_INICIALES);
          setRecetas(RECETAS_INICIALES);
          await Promise.all([
            guardarEnIndexedDB(STORE_INSUMOS, INSUMOS_INICIALES),
            guardarEnIndexedDB(STORE_CATEGORIAS, CATEGORIAS_INSUMO),
            guardarEnIndexedDB(STORE_PROVEEDORES, PROVEEDORES_INICIALES),
            guardarEnIndexedDB(STORE_MOVIMIENTOS, MOVIMIENTOS_INICIALES),
            guardarEnIndexedDB(STORE_RECETAS, RECETAS_INICIALES)
          ]);
        }
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
        setInsumos(INSUMOS_INICIALES);
        setCategorias(CATEGORIAS_INSUMO);
        setProveedores(PROVEEDORES_INICIALES);
        setMovimientos(MOVIMIENTOS_INICIALES);
        setRecetas(RECETAS_INICIALES);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  // ========================================
  // PERSISTENCIA AUTOMÁTICA
  // ========================================
  useEffect(() => {
    if (!cargando && insumos.length >= 0) {
      guardarEnIndexedDB(STORE_INSUMOS, insumos);
    }
  }, [insumos, cargando]);

  useEffect(() => {
    if (!cargando && categorias.length > 0) {
      guardarEnIndexedDB(STORE_CATEGORIAS, categorias);
    }
  }, [categorias, cargando]);

  useEffect(() => {
    if (!cargando && proveedores.length > 0) {
      guardarEnIndexedDB(STORE_PROVEEDORES, proveedores);
    }
  }, [proveedores, cargando]);

  useEffect(() => {
    if (!cargando && movimientos.length >= 0) {
      guardarEnIndexedDB(STORE_MOVIMIENTOS, movimientos);
    }
  }, [movimientos, cargando]);

  useEffect(() => {
    if (!cargando && recetas.length >= 0) {
      guardarEnIndexedDB(STORE_RECETAS, recetas);
    }
  }, [recetas, cargando]);

  // ========================================
  // COMPUTADOS
  // ========================================

  // Categorías activas para selects
  const categoriasActivas = useMemo(() =>
    categorias.filter(c => c.activa).sort((a, b) => a.orden - b.orden),
    [categorias]
  );

  // Proveedores activos
  const proveedoresActivos = useMemo(() =>
    proveedores.filter(p => p.activo).sort((a, b) => a.nombre.localeCompare(b.nombre)),
    [proveedores]
  );

  // Insumos filtrados
  const insumosFiltrados = useMemo(() => {
    return insumos
      .filter(insumo => {
        // Búsqueda por código, nombre, descripción
        const coincideBusqueda = !filtroBusquedaDebounced ||
          insumo.codigo.toLowerCase().includes(filtroBusquedaDebounced.toLowerCase()) ||
          insumo.nombre.toLowerCase().includes(filtroBusquedaDebounced.toLowerCase());

        // Filtro por categoría
        const coincideCategoria = filtroCategoria === 'Todas' || insumo.categoriaId === filtroCategoria;

        // Filtro por estado
        const coincideEstado = filtroEstado === 'Todos' || insumo.estado === filtroEstado;

        // Filtro por stock
        let coincideStock = true;
        if (filtroStock !== 'Todos') {
          const ratio = insumo.stockMinimo > 0 ? insumo.stockActual / insumo.stockMinimo : 999;
          if (filtroStock === 'Critico') coincideStock = insumo.stockActual <= 0;
          else if (filtroStock === 'Bajo') coincideStock = insumo.stockActual > 0 && ratio <= 1;
          else if (filtroStock === 'OK') coincideStock = ratio > 1;
        }

        // Filtro por proveedor
        const coincideProveedor = filtroProveedor === 'Todos' || insumo.proveedorId === filtroProveedor;

        return coincideBusqueda && coincideCategoria && coincideEstado && coincideStock && coincideProveedor;
      })
      .sort((a, b) => {
        // Ordenar: primero por categoría (orden), luego por nombre
        const catA = categorias.find(c => c.id === a.categoriaId);
        const catB = categorias.find(c => c.id === b.categoriaId);
        const ordenA = catA?.orden || 99;
        const ordenB = catB?.orden || 99;
        if (ordenA !== ordenB) return ordenA - ordenB;
        return a.nombre.localeCompare(b.nombre);
      });
  }, [insumos, filtroBusquedaDebounced, filtroCategoria, filtroEstado, filtroStock, filtroProveedor, categorias]);

  // Alertas de stock bajo
  const alertasStock = useMemo(() => {
    return insumos
      .filter(insumo => {
        if (insumo.estado !== 'Activo') return false;
        if (insumo.stockMinimo <= 0) return false;
        const ratio = insumo.stockActual / insumo.stockMinimo;
        return ratio <= 1; // Stock actual <= stock mínimo
      })
      .map(insumo => {
        const ratio = insumo.stockActual / insumo.stockMinimo;
        return {
          ...insumo,
          ratio,
          nivel: insumo.stockActual <= 0 ? 'critico' : ratio <= 0.5 ? 'critico' : ratio <= 1 ? 'bajo' : 'ok'
        };
      })
      .sort((a, b) => a.ratio - b.ratio);
  }, [insumos]);

  // Resumen general
  const resumen = useMemo(() => {
    const total = insumos.length;
    const activos = insumos.filter(i => i.estado === 'Activo').length;
    const inactivos = insumos.filter(i => i.estado === 'Inactivo').length;
    const agotados = insumos.filter(i => i.estado === 'Agotado').length;
    const criticos = alertasStock.filter(a => a.nivel === 'critico').length;
    const bajos = alertasStock.filter(a => a.nivel === 'bajo').length;
    const valorTotal = insumos.reduce((sum, i) => sum + (i.stockActual * i.precioCompra), 0);

    return { total, activos, inactivos, agotados, criticos, bajos, valorTotal };
  }, [insumos, alertasStock]);

  // ========================================
  // ACCIONES - CATEGORÍAS
  // ========================================
  const crearCategoria = useCallback(async (datos) => {
    const nuevaCategoria = {
      ...datos,
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      orden: categorias.length + 1,
      activa: true
    };
    setCategorias(prev => [...prev, nuevaCategoria]);
    return nuevaCategoria;
  }, [categorias.length]);

  const editarCategoria = useCallback(async (id, datos) => {
    setCategorias(prev => prev.map(cat =>
      cat.id === id ? { ...cat, ...datos } : cat
    ));
  }, []);

  const eliminarCategoria = useCallback(async (id) => {
    const insumosEnCategoria = insumos.filter(i => i.categoriaId === id);
    if (insumosEnCategoria.length > 0) {
      throw new Error(`No se puede eliminar: ${insumosEnCategoria.length} insumo(s) usan esta categoría`);
    }
    setCategorias(prev => prev.filter(cat => cat.id !== id));
  }, [insumos]);

  const reordenarCategorias = useCallback(async (categoriasOrdenadas) => {
    setCategorias(() => categoriasOrdenadas.map((cat, index) => ({
      ...cat,
      orden: index + 1
    })));
  }, []);

  const toggleCategoriaActiva = useCallback(async (id) => {
    setCategorias(prev => prev.map(cat =>
      cat.id === id ? { ...cat, activa: !cat.activa } : cat
    ));
  }, []);

  // ========================================
  // ACCIONES - PROVEEDORES
  // ========================================
  const crearProveedor = useCallback(async (datos) => {
    const nuevoProveedor = {
      ...datos,
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      activo: true
    };
    setProveedores(prev => [...prev, nuevoProveedor]);
    return nuevoProveedor;
  }, []);

  const editarProveedor = useCallback(async (id, datos) => {
    setProveedores(prev => prev.map(p =>
      p.id === id ? { ...p, ...datos } : p
    ));
  }, []);

  const eliminarProveedor = useCallback(async (id) => {
    const insumosDelProveedor = insumos.filter(i => i.proveedorId === id);
    if (insumosDelProveedor.length > 0) {
      throw new Error(`No se puede eliminar: ${insumosDelProveedor.length} insumo(s) usan este proveedor`);
    }
    setProveedores(prev => prev.filter(p => p.id !== id));
  }, [insumos]);

  const toggleProveedorActivo = useCallback(async (id) => {
    setProveedores(prev => prev.map(p =>
      p.id === id ? { ...p, activo: !p.activo } : p
    ));
  }, []);

  // ========================================
  // ACCIONES - INSUMOS
  // ========================================
  const validarInsumo = useCallback((datos, excluirId = null) => {
    const errores = {};

    if (!datos.codigo?.trim()) {
      errores.codigo = 'El código es obligatorio';
    } else if (insumos.some(i => i.codigo === datos.codigo.trim().toUpperCase() && i.id !== excluirId)) {
      errores.codigo = 'Este código ya existe';
    }

    if (!datos.nombre?.trim()) {
      errores.nombre = 'El nombre es obligatorio';
    }

    if (!datos.categoriaId) {
      errores.categoriaId = 'Debe seleccionar una categoría';
    }

    if (!datos.unidadMedida) {
      errores.unidadMedida = 'Debe seleccionar una unidad de medida';
    }

    const stockActual = Number(datos.stockActual);
    if (isNaN(stockActual) || stockActual < 0) {
      errores.stockActual = 'El stock actual debe ser un número positivo';
    }

    const stockMinimo = Number(datos.stockMinimo);
    if (isNaN(stockMinimo) || stockMinimo < 0) {
      errores.stockMinimo = 'El stock mínimo debe ser un número positivo';
    }

    const precioCompra = Number(datos.precioCompra);
    if (isNaN(precioCompra) || precioCompra < 0) {
      errores.precioCompra = 'El precio de compra debe ser un número positivo';
    }

    if (!datos.proveedorId) {
      errores.proveedorId = 'Debe seleccionar un proveedor';
    }

    return errores;
  }, [insumos]);

  const crearInsumo = useCallback(async (datos) => {
    const errores = validarInsumo(datos);
    if (Object.keys(errores).length > 0) {
      throw new Error(JSON.stringify(errores));
    }

    const categoria = categorias.find(c => c.id === datos.categoriaId);
    const proveedor = proveedores.find(p => p.id === datos.proveedorId);

    const nuevoInsumo = {
      ...datos,
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      codigo: datos.codigo.trim().toUpperCase(),
      nombre: datos.nombre.trim(),
      categoriaNombre: categoria?.nombre || '',
      unidadMedida: datos.unidadMedida,
      stockActual: Number(datos.stockActual),
      stockMinimo: Number(datos.stockMinimo),
      precioCompra: Number(datos.precioCompra),
      proveedorNombre: proveedor?.nombre || '',
      estado: datos.estado || 'Activo',
      fechaRegistro: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
      permiteStockNegativo: datos.permiteStockNegativo || false
    };

    setInsumos(prev => [nuevoInsumo, ...prev]);

    // Registrar movimiento inicial si hay stock
    if (nuevoInsumo.stockActual > 0) {
      const movimiento = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        insumoId: nuevoInsumo.id,
        insumoCodigo: nuevoInsumo.codigo,
        insumoNombre: nuevoInsumo.nombre,
        tipo: 'entrada_ajuste',
        cantidad: nuevoInsumo.stockActual,
        stockAnterior: 0,
        stockNuevo: nuevoInsumo.stockActual,
        precioUnitario: nuevoInsumo.precioCompra,
        total: nuevoInsumo.stockActual * nuevoInsumo.precioCompra,
        motivo: 'Stock inicial al crear insumo',
        proveedorId: nuevoInsumo.proveedorId,
        proveedorNombre: nuevoInsumo.proveedorNombre,
        usuario: 'Sistema',
        fecha: new Date().toISOString(),
        documento: 'INICIAL'
      };
      setMovimientos(prev => [movimiento, ...prev]);
    }

    return nuevoInsumo;
  }, [categorias, proveedores, validarInsumo]);

  const editarInsumo = useCallback(async (id, datos) => {
    const errores = validarInsumo(datos, id);
    if (Object.keys(errores).length > 0) {
      throw new Error(JSON.stringify(errores));
    }

    const categoria = categorias.find(c => c.id === datos.categoriaId);
    const proveedor = proveedores.find(p => p.id === datos.proveedorId);

    setInsumos(prev => prev.map(insumo =>
      insumo.id === id
        ? {
            ...insumo,
            ...datos,
            codigo: datos.codigo.trim().toUpperCase(),
            nombre: datos.nombre.trim(),
            categoriaNombre: categoria?.nombre || '',
            stockActual: Number(datos.stockActual),
            stockMinimo: Number(datos.stockMinimo),
            precioCompra: Number(datos.precioCompra),
            proveedorNombre: proveedor?.nombre || '',
            actualizadoEn: new Date().toISOString()
          }
        : insumo
    ));
  }, [categorias, proveedores, validarInsumo]);

  const eliminarInsumo = useCallback(async (id) => {
    // Verificar si tiene movimientos
    const tieneMovimientos = movimientos.some(m => m.insumoId === id);
    if (tieneMovimientos) {
      throw new Error('No se puede eliminar: el insumo tiene historial de movimientos');
    }
    // Verificar si está en recetas
    const enRecetas = recetas.some(r => r.insumos.some(i => i.insumoId === id));
    if (enRecetas) {
      throw new Error('No se puede eliminar: el insumo forma parte de recetas');
    }
    setInsumos(prev => prev.filter(insumo => insumo.id !== id));
  }, [movimientos, recetas]);

  const toggleEstadoInsumo = useCallback(async (id) => {
    setInsumos(prev => prev.map(insumo => {
      if (insumo.id !== id) return insumo;
      const estados = ['Activo', 'Inactivo', 'Agotado', 'Descontinuado'];
      const idx = estados.indexOf(insumo.estado);
      return { ...insumo, estado: estados[(idx + 1) % estados.length], actualizadoEn: new Date().toISOString() };
    }));
  }, []);

  // ========================================
  // ACCIONES - MOVIMIENTOS (ENTRADAS/SALIDAS/MERMAS)
  // ========================================
  const registrarMovimiento = useCallback(async (datos) => {
    const { insumoId, tipo, cantidad, motivo, proveedorId, proveedorNombre, usuario, documento, pedidoId, autorizadoStockNegativo } = datos;

    const insumo = insumos.find(i => i.id === insumoId);
    if (!insumo) throw new Error('Insumo no encontrado');

    const tipoInfo = TIPOS_MOVIMIENTO[tipo];
    if (!tipoInfo) throw new Error('Tipo de movimiento inválido');

    const esEntrada = tipoInfo.signo === '+';
    const stockAnterior = insumo.stockActual;
    let stockNuevo = esEntrada ? stockAnterior + cantidad : stockAnterior - cantidad;

    // Validar stock negativo
    if (stockNuevo < 0 && !insumo.permiteStockNegativo && !autorizadoStockNegativo) {
      throw new Error('STOCK_NEGATIVO_NO_AUTORIZADO');
    }

    // Si stock llega a 0 o menos, actualizar estado a Agotado
    let nuevoEstado = insumo.estado;
    if (stockNuevo <= 0 && insumo.estado === 'Activo') {
      nuevoEstado = 'Agotado';
    } else if (stockNuevo > 0 && insumo.estado === 'Agotado') {
      nuevoEstado = 'Activo';
    }

    const precioUnitario = insumo.precioCompra;
    const total = cantidad * precioUnitario;

    const movimiento = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      insumoId,
      insumoCodigo: insumo.codigo,
      insumoNombre: insumo.nombre,
      tipo,
      cantidad,
      stockAnterior,
      stockNuevo,
      precioUnitario,
      total,
      motivo: motivo || tipoInfo.label,
      proveedorId: proveedorId || insumo.proveedorId,
      proveedorNombre: proveedorNombre || insumo.proveedorNombre,
      usuario: usuario || 'Sistema',
      fecha: new Date().toISOString(),
      documento: documento || '',
      pedidoId: pedidoId || '',
      autorizadoStockNegativo: !!autorizadoStockNegativo
    };

    // Actualizar insumo
    setInsumos(prev => prev.map(i =>
      i.id === insumoId ? { ...i, stockActual: stockNuevo, estado: nuevoEstado, actualizadoEn: new Date().toISOString() } : i
    ));

    // Agregar movimiento
    setMovimientos(prev => [movimiento, ...prev]);

    return movimiento;
  }, [insumos]);

  // Entrada por compra
  const registrarEntradaCompra = useCallback(async (insumoId, cantidad, precioCompra, proveedorId, documento, motivo) => {
    const proveedor = proveedores.find(p => p.id === proveedorId);
    // Actualizar precio de compra si es diferente
    if (precioCompra) {
      setInsumos(prev => prev.map(i => i.id === insumoId ? { ...i, precioCompra: Number(precioCompra), actualizadoEn: new Date().toISOString() } : i));
    }
    return registrarMovimiento({
      insumoId,
      tipo: 'entrada_compra',
      cantidad,
      motivo: motivo || 'Entrada por compra',
      proveedorId,
      proveedorNombre: proveedor?.nombre,
      documento
    });
  }, [proveedores, registrarMovimiento]);

  // Entrada por ajuste
  const registrarEntradaAjuste = useCallback(async (insumoId, cantidad, motivo) => {
    return registrarMovimiento({
      insumoId,
      tipo: 'entrada_ajuste',
      cantidad,
      motivo: motivo || 'Ajuste de inventario'
    });
  }, [registrarMovimiento]);

  // Salida manual
  const registrarSalidaManual = useCallback(async (insumoId, cantidad, motivo, autorizadoStockNegativo = false) => {
    return registrarMovimiento({
      insumoId,
      tipo: 'salida_manual',
      cantidad,
      motivo: motivo || 'Salida manual',
      autorizadoStockNegativo
    });
  }, [registrarMovimiento]);

  // Merma
  const registrarMerma = useCallback(async (insumoId, cantidad, motivoMerma, autorizadoStockNegativo = false) => {
    return registrarMovimiento({
      insumoId,
      tipo: 'salida_merma',
      cantidad,
      motivo: `Merma: ${motivoMerma}`,
      autorizadoStockNegativo
    });
  }, [registrarMovimiento]);

  // Descuento por consumo (receta) - usado al confirmar pedido
  const descontarPorReceta = useCallback(async (insumoId, cantidad, pedidoId, autorizadoStockNegativo = false) => {
    return registrarMovimiento({
      insumoId,
      tipo: 'salida_consumo',
      cantidad,
      motivo: `Consumo por pedido ${pedidoId}`,
      pedidoId,
      autorizadoStockNegativo
    });
  }, [registrarMovimiento]);

  // ========================================
  // ACCIONES - RECETAS
  // ========================================
  const crearReceta = useCallback(async (datos) => {
    const { productoId, productoCodigo, productoNombre, insumos: insumosReceta } = datos;

    // Verificar si ya existe receta para este producto
    const existe = recetas.some(r => r.productoCodigo === productoCodigo);
    if (existe) {
      throw new Error('Ya existe una receta para este producto');
    }

    // Enriquecer insumos con IDs y nombres actuales
    const insumosEnriquecidos = insumosReceta.map(item => {
      const insumo = insumos.find(i => i.codigo === item.insumoCodigo || i.id === item.insumoId);
      return {
        ...item,
        insumoId: insumo?.id || item.insumoId,
        insumoCodigo: insumo?.codigo || item.insumoCodigo,
        insumoNombre: insumo?.nombre || item.insumoNombre,
        unidadMedida: insumo?.unidadMedida || item.unidadMedida
      };
    });

    const nuevaReceta = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      productoId,
      productoCodigo,
      productoNombre,
      insumos: insumosEnriquecidos,
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString()
    };

    setRecetas(prev => [...prev, nuevaReceta]);
    return nuevaReceta;
  }, [recetas, insumos]);

  const editarReceta = useCallback(async (id, datos) => {
    const { insumos: insumosReceta } = datos;

    // Enriquecer insumos
    const insumosEnriquecidos = insumosReceta.map(item => {
      const insumo = insumos.find(i => i.codigo === item.insumoCodigo || i.id === item.insumoId);
      return {
        ...item,
        insumoId: insumo?.id || item.insumoId,
        insumoCodigo: insumo?.codigo || item.insumoCodigo,
        insumoNombre: insumo?.nombre || item.insumoNombre,
        unidadMedida: insumo?.unidadMedida || item.unidadMedida
      };
    });

    setRecetas(prev => prev.map(r =>
      r.id === id ? { ...r, ...datos, insumos: insumosEnriquecidos, actualizadoEn: new Date().toISOString() } : r
    ));
  }, [insumos]);

  const eliminarReceta = useCallback(async (id) => {
    setRecetas(prev => prev.filter(r => r.id !== id));
  }, []);

  const obtenerRecetaPorProducto = useCallback((productoCodigo) => {
    return recetas.find(r => r.productoCodigo === productoCodigo);
  }, [recetas]);

  // ========================================
  // FUNCIONES PARA DESCUENTO DE INVENTARIO POR PEDIDOS
  // ========================================
  const verificarStockParaPedido = useCallback((productoCodigo, cantidad = 1) => {
    const receta = recetas.find(r => r.productoCodigo === productoCodigo);
    if (!receta) return { ok: true, advertencias: [], mensaje: 'Producto sin receta definida' };

    const advertencias = [];
    const faltantes = [];

    for (const item of receta.insumos) {
      const insumo = insumos.find(i => i.id === item.insumoId || i.codigo === item.insumoCodigo);
      if (!insumo) {
        advertencias.push(`Insumo ${item.insumoNombre} no encontrado en inventario`);
        continue;
      }
      const necesario = item.cantidad * cantidad;
      if (insumo.stockActual < necesario) {
        faltantes.push({
          insumoId: insumo.id,
          insumoNombre: insumo.nombre,
          necesario,
          disponible: insumo.stockActual,
          faltante: necesario - insumo.stockActual,
          unidadMedida: insumo.unidadMedida,
          permiteStockNegativo: insumo.permiteStockNegativo
        });
      }
    }

    return {
      ok: faltantes.length === 0,
      advertencias,
      faltantes,
      receta
    };
  }, [recetas, insumos]);

  const descontarInventarioPedido = useCallback(async (productoCodigo, cantidad, pedidoId, forzarInclusoSiFalta = false) => {
    const verificacion = verificarStockParaPedido(productoCodigo, cantidad);

    if (!verificacion.ok && !forzarInclusoSiFalta) {
      throw new Error(JSON.stringify({ tipo: 'STOCK_INSUFICIENTE', faltantes: verificacion.faltantes }));
    }

    const resultados = [];
    for (const item of verificacion.receta.insumos) {
      const insumo = insumos.find(i => i.id === item.insumoId || i.codigo === item.insumoCodigo);
      if (!insumo) continue;

      const cantidadDescontar = item.cantidad * cantidad;
      const permitirNegativo = insumo.permiteStockNegativo || forzarInclusoSiFalta;

      try {
        const movimiento = await descontarPorReceta(insumo.id, cantidadDescontar, pedidoId, permitirNegativo);
        resultados.push({ insumoId: insumo.id, insumoNombre: insumo.nombre, cantidad: cantidadDescontar, movimiento });
      } catch (error) {
        if (error.message === 'STOCK_NEGATIVO_NO_AUTORIZADO') {
          const newError = new Error(JSON.stringify({ tipo: 'STOCK_NEGATIVO_NO_AUTORIZADO', insumoId: insumo.id, insumoNombre: insumo.nombre }));
          newError.cause = error;
          throw newError;
        }
        throw error;
      }
    }

    return resultados;
  }, [insumos, verificarStockParaPedido, descontarPorReceta]);

  // ========================================
  // UTILIDADES
  // ========================================
  const obtenerInsumo = useCallback((id) => {
    return insumos.find(i => i.id === id);
  }, [insumos]);

  const obtenerInsumoPorCodigo = useCallback((codigo) => {
    return insumos.find(i => i.codigo === codigo);
  }, [insumos]);

  const obtenerCategoria = useCallback((categoriaId) => {
    return categorias.find(c => c.id === categoriaId);
  }, [categorias]);

  const obtenerProveedor = useCallback((proveedorId) => {
    return proveedores.find(p => p.id === proveedorId);
  }, [proveedores]);

  const obtenerMovimientosInsumo = useCallback((insumoId, limite = 50) => {
    return movimientos
      .filter(m => m.insumoId === insumoId)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, limite);
  }, [movimientos]);

  const obtenerColorEstado = useCallback((estado) => {
    return ESTADO_INSUMO_COLORES[estado] || { bg: '#F5F5F5', text: '#333', border: '#DDD' };
  }, []);

  const obtenerColorTipoMovimiento = useCallback((tipo) => {
    return TIPO_MOVIMIENTO_COLORES[tipo] || { bg: '#F5F5F5', text: '#333', border: '#DDD', icon: '📦' };
  }, []);

  const obtenerUnidadMedida = useCallback((valor) => {
    return UNIDADES_MEDIDA.find(u => u.valor === valor) || { valor, etiqueta: valor, tipo: 'otro' };
  }, []);

  const resetearDatos = useCallback(async () => {
    await limpiarIndexedDB();
    setInsumos(INSUMOS_INICIALES);
    setCategorias(CATEGORIAS_INSUMO);
    setProveedores(PROVEEDORES_INICIALES);
    setMovimientos(MOVIMIENTOS_INICIALES);
    setRecetas(RECETAS_INICIALES);
    await Promise.all([
      guardarEnIndexedDB(STORE_INSUMOS, INSUMOS_INICIALES),
      guardarEnIndexedDB(STORE_CATEGORIAS, CATEGORIAS_INSUMO),
      guardarEnIndexedDB(STORE_PROVEEDORES, PROVEEDORES_INICIALES),
      guardarEnIndexedDB(STORE_MOVIMIENTOS, MOVIMIENTOS_INICIALES),
      guardarEnIndexedDB(STORE_RECETAS, RECETAS_INICIALES)
    ]);
  }, []);

  const limpiarFiltros = useCallback(() => {
    setFiltroBusqueda('');
    setFiltroCategoria('Todas');
    setFiltroEstado('Todos');
    setFiltroStock('Todos');
    setFiltroProveedor('Todos');
  }, []);

  return {
    // Estado
    insumos: insumosFiltrados,
    todosLosInsumos: insumos,
    categorias,
    categoriasActivas,
    proveedores,
    proveedoresActivos,
    movimientos,
    recetas,
    cargando,
    error,
    resumen,
    alertasStock,
    vista,
    setVista,

    // Filtros
    filtroBusqueda,
    setFiltroBusqueda,
    filtroCategoria,
    setFiltroCategoria,
    filtroEstado,
    setFiltroEstado,
    filtroStock,
    setFiltroStock,
    filtroProveedor,
    setFiltroProveedor,

    // Acciones - Categorías
    crearCategoria,
    editarCategoria,
    eliminarCategoria,
    reordenarCategorias,
    toggleCategoriaActiva,

    // Acciones - Proveedores
    crearProveedor,
    editarProveedor,
    eliminarProveedor,
    toggleProveedorActivo,

    // Acciones - Insumos
    crearInsumo,
    editarInsumo,
    eliminarInsumo,
    toggleEstadoInsumo,
    validarInsumo,

    // Acciones - Movimientos
    registrarMovimiento,
    registrarEntradaCompra,
    registrarEntradaAjuste,
    registrarSalidaManual,
    registrarMerma,
    descontarPorReceta,
    descontarInventarioPedido,
    verificarStockParaPedido,

    // Acciones - Recetas
    crearReceta,
    editarReceta,
    eliminarReceta,
    obtenerRecetaPorProducto,

    // Utilidades
    obtenerInsumo,
    obtenerInsumoPorCodigo,
    obtenerCategoria,
    obtenerProveedor,
    obtenerMovimientosInsumo,
    obtenerColorEstado,
    obtenerColorTipoMovimiento,
    obtenerUnidadMedida,
    resetearDatos,
    limpiarFiltros,

    // Constantes
    ESTADOS_INSUMO,
    UNIDADES_MEDIDA,
    TIPOS_MOVIMIENTO,
    MOTIVOS_MERMA,
    ESTADO_INSUMO_COLORES,
    TIPO_MOVIMIENTO_COLORES
  };
}