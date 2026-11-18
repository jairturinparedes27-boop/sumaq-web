// src/hooks/useProductos.js
// Hook personalizado para gestión de productos y categorías con persistencia en IndexedDB

import { useState, useEffect, useCallback, useMemo } from 'react';
import { openDB } from 'idb';
import {
  CATEGORIAS_INICIALES,
  PRODUCTOS_INICIALES,
  ESTADOS_PRODUCTO,
  CATEGORIA_COLORES,
  ESTADO_COLORES,
  ICONOS_CATEGORIA
} from '../data/productosMock';

const DB_NAME = 'sumaq-productos-db';
const STORE_PRODUCTOS = 'productos';
const STORE_CATEGORIAS = 'categorias';
const DB_VERSION = 1;

// ========================================
// FUNCIONES DE INDEXEDDB
// ========================================

const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_PRODUCTOS)) {
        const store = db.createObjectStore(STORE_PRODUCTOS, { keyPath: 'id' });
        store.createIndex('categoriaId', 'categoriaId');
        store.createIndex('estado', 'estado');
        store.createIndex('codigo', 'codigo', { unique: true });
      }
      if (!db.objectStoreNames.contains(STORE_CATEGORIAS)) {
        const store = db.createObjectStore(STORE_CATEGORIAS, { keyPath: 'id' });
        store.createIndex('nombre', 'nombre', { unique: true });
        store.createIndex('orden', 'orden');
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
    await db.clear(STORE_PRODUCTOS);
    await db.clear(STORE_CATEGORIAS);
    return true;
  } catch (error) {
    console.error('Error limpiando IndexedDB:', error);
    return false;
  }
};

// ========================================
// HOOK PRINCIPAL
// ========================================

export function useProductos() {
  // Estado
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState('Todas');

  // Debounce para búsqueda
  const [filtroBusquedaDebounced, setFiltroBusquedaDebounced] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setFiltroBusquedaDebounced(filtroBusqueda), 300);
    return () => clearTimeout(timer);
  }, [filtroBusqueda]);

  // Vista: 'grid' | 'table'
  const [vista, setVista] = useState('grid');

  // ========================================
  // CARGA INICIAL
  // ========================================

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);

        const [productosGuardados, categoriasGuardadas] = await Promise.all([
          cargarDesdeIndexedDB(STORE_PRODUCTOS),
          cargarDesdeIndexedDB(STORE_CATEGORIAS)
        ]);

        if (productosGuardados && categoriasGuardadas) {
          setProductos(productosGuardados);
          setCategorias(categoriasGuardadas);
        } else {
          setProductos(PRODUCTOS_INICIALES);
          setCategorias(CATEGORIAS_INICIALES);
          await Promise.all([
            guardarEnIndexedDB(STORE_PRODUCTOS, PRODUCTOS_INICIALES),
            guardarEnIndexedDB(STORE_CATEGORIAS, CATEGORIAS_INICIALES)
          ]);
        }
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
        setProductos(PRODUCTOS_INICIALES);
        setCategorias(CATEGORIAS_INICIALES);
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
    if (!cargando && productos.length >= 0) {
      guardarEnIndexedDB(STORE_PRODUCTOS, productos);
    }
  }, [productos, cargando]);

  useEffect(() => {
    if (!cargando && categorias.length > 0) {
      guardarEnIndexedDB(STORE_CATEGORIAS, categorias);
    }
  }, [categorias, cargando]);

  // ========================================
  // COMPUTADOS
  // ========================================

  // Categorías activas para selects
  const categoriasActivas = useMemo(() =>
    categorias.filter(c => c.activa).sort((a, b) => a.orden - b.orden),
    [categorias]
  );

  // Productos filtrados
  const productosFiltrados = useMemo(() => {
    return productos
      .filter(producto => {
        // Búsqueda por código, nombre, descripción
        const coincideBusqueda = !filtroBusquedaDebounced ||
          producto.codigo.toLowerCase().includes(filtroBusquedaDebounced.toLowerCase()) ||
          producto.nombre.toLowerCase().includes(filtroBusquedaDebounced.toLowerCase()) ||
          (producto.descripcion && producto.descripcion.toLowerCase().includes(filtroBusquedaDebounced.toLowerCase()));

        // Filtro por categoría
        const coincideCategoria = filtroCategoria === 'Todas' || producto.categoriaId === filtroCategoria;

        // Filtro por estado
        const coincideEstado = filtroEstado === 'Todos' || producto.estado === filtroEstado;

        // Filtro por disponibilidad
        const coincideDisponibilidad = filtroDisponibilidad === 'Todas' ||
          (filtroDisponibilidad === 'Disponibles' && producto.disponible) ||
          (filtroDisponibilidad === 'No disponibles' && !producto.disponible);

        return coincideBusqueda && coincideCategoria && coincideEstado && coincideDisponibilidad;
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
  }, [productos, filtroBusquedaDebounced, filtroCategoria, filtroEstado, filtroDisponibilidad, categorias]);

  // Resumen
  const resumen = useMemo(() => {
    const total = productos.length;
    const activos = productos.filter(p => p.estado === 'Activo').length;
    const inactivos = productos.filter(p => p.estado === 'Inactivo').length;
    const disponibles = productos.filter(p => p.disponible).length;
    const noDisponibles = productos.filter(p => !p.disponible).length;
    const porCategoria = {};

    categoriasActivas.forEach(cat => {
      porCategoria[cat.id] = {
        nombre: cat.nombre,
        total: productos.filter(p => p.categoriaId === cat.id).length,
        activos: productos.filter(p => p.categoriaId === cat.id && p.estado === 'Activo').length
      };
    });

    return { total, activos, inactivos, disponibles, noDisponibles, porCategoria };
  }, [productos, categoriasActivas]);

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
    // Verificar si hay productos en esta categoría
    const productosEnCategoria = productos.filter(p => p.categoriaId === id);
    if (productosEnCategoria.length > 0) {
      throw new Error(`No se puede eliminar: ${productosEnCategoria.length} producto(s) usan esta categoría`);
    }
    setCategorias(prev => prev.filter(cat => cat.id !== id));
  }, [productos]);

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
  // ACCIONES - PRODUCTOS
  // ========================================

  const validarProducto = useCallback((datos, excluirId = null) => {
    const errores = {};

    if (!datos.codigo?.trim()) {
      errores.codigo = 'El código es obligatorio';
    } else if (productos.some(p => p.codigo === datos.codigo && p.id !== excluirId)) {
      errores.codigo = 'Este código ya existe';
    }

    if (!datos.nombre?.trim()) {
      errores.nombre = 'El nombre es obligatorio';
    }

    if (!datos.categoriaId) {
      errores.categoriaId = 'Debe seleccionar una categoría';
    }

    const precio = Number(datos.precioVenta);
    if (isNaN(precio) || precio < 0) {
      errores.precioVenta = 'El precio debe ser un número positivo';
    }

    return errores;
  }, [productos]);

  const crearProducto = useCallback(async (datos) => {
    const errores = validarProducto(datos);
    if (Object.keys(errores).length > 0) {
      throw new Error(JSON.stringify(errores));
    }

    const categoria = categorias.find(c => c.id === datos.categoriaId);

    const nuevoProducto = {
      ...datos,
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      codigo: datos.codigo.trim().toUpperCase(),
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion?.trim() || '',
      precioVenta: Number(datos.precioVenta),
      imagen: datos.imagen?.trim() || ICONOS_CATEGORIA[categoria?.nombre] || '📦',
      estado: datos.estado || 'Activo',
      disponible: datos.disponible !== false,
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString()
    };

    setProductos(prev => [nuevoProducto, ...prev]);
    return nuevoProducto;
  }, [categorias, validarProducto]);

  const editarProducto = useCallback(async (id, datos) => {
    const errores = validarProducto(datos, id);
    if (Object.keys(errores).length > 0) {
      throw new Error(JSON.stringify(errores));
    }

    const categoria = categorias.find(c => c.id === datos.categoriaId);

    setProductos(prev => prev.map(producto =>
      producto.id === id
        ? {
            ...producto,
            ...datos,
            codigo: datos.codigo.trim().toUpperCase(),
            nombre: datos.nombre.trim(),
            descripcion: datos.descripcion?.trim() || '',
            precioVenta: Number(datos.precioVenta),
            imagen: datos.imagen?.trim() || ICONOS_CATEGORIA[categoria?.nombre] || '📦',
            actualizadoEn: new Date().toISOString()
          }
        : producto
    ));
  }, [categorias, validarProducto]);

  const eliminarProducto = useCallback(async (id) => {
    setProductos(prev => prev.filter(producto => producto.id !== id));
  }, []);

  const toggleEstadoProducto = useCallback(async (id) => {
    setProductos(prev => prev.map(producto =>
      producto.id === id
        ? { ...producto, estado: producto.estado === 'Activo' ? 'Inactivo' : 'Activo', actualizadoEn: new Date().toISOString() }
        : producto
    ));
  }, []);

  const toggleDisponibilidadProducto = useCallback(async (id) => {
    setProductos(prev => prev.map(producto =>
      producto.id === id
        ? { ...producto, disponible: !producto.disponible, actualizadoEn: new Date().toISOString() }
        : producto
    ));
  }, []);

  const duplicarProducto = useCallback(async (id) => {
    const original = productos.find(p => p.id === id);
    if (!original) return null;

    const duplicado = {
      ...original,
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      codigo: `COP-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      nombre: `${original.nombre} (Copia)`,
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString()
    };

    setProductos(prev => [duplicado, ...prev]);
    return duplicado;
  }, [productos]);

  const resetearDatos = useCallback(async () => {
    await limpiarIndexedDB();
    setProductos(PRODUCTOS_INICIALES);
    setCategorias(CATEGORIAS_INICIALES);
    await Promise.all([
      guardarEnIndexedDB(STORE_PRODUCTOS, PRODUCTOS_INICIALES),
      guardarEnIndexedDB(STORE_CATEGORIAS, CATEGORIAS_INICIALES)
    ]);
  }, []);

  const limpiarFiltros = useCallback(() => {
    setFiltroBusqueda('');
    setFiltroCategoria('Todas');
    setFiltroEstado('Todos');
    setFiltroDisponibilidad('Todas');
  }, []);

  // ========================================
  // UTILIDADES
  // ========================================

  const obtenerCategoria = useCallback((categoriaId) => {
    return categorias.find(c => c.id === categoriaId);
  }, [categorias]);

  const obtenerColorCategoria = useCallback((categoriaNombre) => {
    return CATEGORIA_COLORES[categoriaNombre] || { bg: '#F5F5F5', text: '#333', border: '#DDD' };
  }, []);

  const obtenerColorEstado = useCallback((estado) => {
    return ESTADO_COLORES[estado] || { bg: '#F5F5F5', text: '#333', border: '#DDD' };
  }, []);

  const obtenerIconoCategoria = useCallback((categoriaNombre) => {
    return ICONOS_CATEGORIA[categoriaNombre] || '📦';
  }, []);

  return {
    // Estado
    productos: productosFiltrados,
    todosLosProductos: productos,
    categorias,
    categoriasActivas,
    cargando,
    error,
    resumen,
    vista,
    setVista,

    // Filtros
    filtroBusqueda,
    setFiltroBusqueda,
    filtroCategoria,
    setFiltroCategoria,
    filtroEstado,
    setFiltroEstado,
    filtroDisponibilidad,
    setFiltroDisponibilidad,

    // Acciones - Categorías
    crearCategoria,
    editarCategoria,
    eliminarCategoria,
    reordenarCategorias,
    toggleCategoriaActiva,

    // Acciones - Productos
    crearProducto,
    editarProducto,
    eliminarProducto,
    toggleEstadoProducto,
    toggleDisponibilidadProducto,
    duplicarProducto,
    resetearDatos,
    limpiarFiltros,

    // Utilidades
    obtenerCategoria,
    obtenerColorCategoria,
    obtenerColorEstado,
    obtenerIconoCategoria,
    validarProducto,
    ESTADOS_PRODUCTO,
    CATEGORIA_COLORES,
    ESTADO_COLORES,
    ICONOS_CATEGORIA
  };
}