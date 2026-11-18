// src/hooks/useMesas.js
// Hook personalizado para gestionar el estado de mesas con persistencia en IndexedDB

import { useState, useEffect, useCallback } from 'react';
import { openDB } from 'idb';
import { mesasMock } from '../data/mesasMock';

const DB_NAME = 'sumaq-web-db';
const STORE_NAME = 'mesas';
const DB_VERSION = 1;

// Inicializar IndexedDB
const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('estado', 'estado');
        store.createIndex('zona', 'zona');
      }
    }
  });
};

// Guardar todas las mesas en IndexedDB
const saveAllMesas = async (mesas) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await Promise.all([
    ...mesas.map(mesa => tx.store.put(mesa)),
    tx.done
  ]);
};

// Cargar todas las mesas desde IndexedDB
const loadAllMesas = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

// Limpiar store (útil para reset)
const clearAllMesas = async () => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.clear();
  await tx.done;
};

export function useMesas() {
  const [mesas, setMesas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroZona, setFiltroZona] = useState('Todas');

  // Cargar mesas al montar: IndexedDB → mock → IndexedDB
  useEffect(() => {
    let mounted = true;

    const cargarMesas = async () => {
      try {
        setCargando(true);
        const stored = await loadAllMesas();

        if (stored.length > 0) {
          // Hay datos en IndexedDB, usarlos
          if (mounted) setMesas(stored.sort((a, b) => a.numero.localeCompare(b.numero, undefined, { numeric: true })));
        } else {
          // Primera carga: guardar mock en IndexedDB y usarlo
          await saveAllMesas(mesasMock);
          if (mounted) setMesas([...mesasMock].sort((a, b) => a.numero.localeCompare(b.numero, undefined, { numeric: true })));
        }
      } catch (err) {
        console.error('Error cargando mesas:', err);
        // Fallback a mock si falla IndexedDB
        if (mounted) setMesas([...mesasMock].sort((a, b) => a.numero.localeCompare(b.numero, undefined, { numeric: true })));
        if (mounted) setError('No se pudieron cargar los datos guardados. Usando datos de ejemplo.');
      } finally {
        if (mounted) setCargando(false);
      }
    };

    cargarMesas();

    return () => { mounted = false; };
  }, []);

  // Persistir cambios en IndexedDB cada vez que cambie el array mesas
  useEffect(() => {
    if (!cargando && mesas.length > 0) {
      saveAllMesas(mesas).catch(err => console.error('Error guardando mesas:', err));
    }
  }, [mesas, cargando]);

  // Generar nuevo ID único
  const generarId = useCallback(() => {
    return mesas.length > 0 ? Math.max(...mesas.map(m => m.id)) + 1 : 1;
  }, [mesas]);

  // Crear nueva mesa
  const crearMesa = useCallback(async (datosMesa) => {
    const nuevaMesa = {
      id: generarId(),
      numero: String(datosMesa.numero).padStart(2, '0'),
      nombre: datosMesa.nombre || `Mesa ${String(datosMesa.numero).padStart(2, '0')}`,
      capacidad: Number(datosMesa.capacidad),
      zona: datosMesa.zona,
      estado: datosMesa.estado || 'Disponible',
      posicion: datosMesa.posicion || { x: 0, y: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setMesas(prev => [...prev, nuevaMesa].sort((a, b) => a.numero.localeCompare(b.numero, undefined, { numeric: true })));
    return nuevaMesa;
  }, [generarId]);

  // Editar mesa existente
  const editarMesa = useCallback(async (id, datosActualizados) => {
    setMesas(prev => prev.map(mesa =>
      mesa.id === id
        ? { ...mesa, ...datosActualizados, updatedAt: new Date().toISOString() }
        : mesa
    ).sort((a, b) => a.numero.localeCompare(b.numero, undefined, { numeric: true })));
  }, []);

  // Eliminar mesa
  const eliminarMesa = useCallback(async (id) => {
    setMesas(prev => prev.filter(mesa => mesa.id !== id));
  }, []);

  // Cambiar estado rápido (para botones de acción en la tarjeta)
  const cambiarEstado = useCallback(async (id, nuevoEstado) => {
    setMesas(prev => prev.map(mesa =>
      mesa.id === id
        ? { ...mesa, estado: nuevoEstado, updatedAt: new Date().toISOString() }
        : mesa
    ));
  }, []);

  // Obtener mesa por ID
  const obtenerMesa = useCallback((id) => {
    return mesas.find(m => m.id === id);
  }, [mesas]);

  // Mesas filtradas según búsqueda y filtros
  const mesasFiltradas = mesas.filter(mesa => {
    const coincideBusqueda = filtroBusqueda === '' ||
      mesa.numero.includes(filtroBusqueda) ||
      mesa.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      mesa.zona.toLowerCase().includes(filtroBusqueda.toLowerCase());

    const coincideEstado = filtroEstado === 'Todos' || mesa.estado === filtroEstado;
    const coincideZona = filtroZona === 'Todas' || mesa.zona === filtroZona;

    return coincideBusqueda && coincideEstado && coincideZona;
  });

  // Resumen por estado
  const resumen = {
    total: mesas.length,
    disponibles: mesas.filter(m => m.estado === 'Disponible').length,
    ocupadas: mesas.filter(m => m.estado === 'Ocupada').length,
    reservadas: mesas.filter(m => m.estado === 'Reservada').length
  };

  // Zonas únicas para el filtro
  const zonasUnicas = [...new Set(mesas.map(m => m.zona))].sort();

  // Resetear a datos de fábrica (útil para testing)
  const resetearDatos = useCallback(async () => {
    await clearAllMesas();
    await saveAllMesas(mesasMock);
    setMesas([...mesasMock].sort((a, b) => a.numero.localeCompare(b.numero, undefined, { numeric: true })));
  }, []);

  return {
    // Estado
    mesas: mesasFiltradas,
    todasLasMesas: mesas,
    cargando,
    error,
    resumen,
    zonasUnicas,

    // Filtros
    filtroBusqueda,
    setFiltroBusqueda,
    filtroEstado,
    setFiltroEstado,
    filtroZona,
    setFiltroZona,

    // Acciones
    crearMesa,
    editarMesa,
    eliminarMesa,
    cambiarEstado,
    obtenerMesa,
    resetearDatos
  };
}