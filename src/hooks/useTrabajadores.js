// src/hooks/useTrabajadores.js
// Hook personalizado para gestión de trabajadores con persistencia en IndexedDB

import { useState, useEffect, useCallback, useMemo } from 'react';
import { openDB } from 'idb';
import {
  TRABAJADORES_INICIALES,
  CARGOS_INICIALES,
  ESTADOS_TRABAJADOR,
  ESTADO_TRABAJADOR_COLORES,
  CARGO_COLORES,
  obtenerNombreCompleto,
  obtenerIniciales,
  obtenerColorCargo
} from '../data/trabajadoresMock';

const DB_NAME = 'sumaq-trabajadores-db';
const STORE_TRABAJADORES = 'trabajadores';
const STORE_CARGOS = 'cargos';
const DB_VERSION = 1;

// ========================================
// FUNCIONES DE INDEXEDDB
// ========================================
const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_TRABAJADORES)) {
        const store = db.createObjectStore(STORE_TRABAJADORES, { keyPath: 'id' });
        store.createIndex('codigo', 'codigo', { unique: true });
        store.createIndex('dni', 'dni', { unique: true });
        store.createIndex('estado', 'estado');
        store.createIndex('cargo', 'cargo');
        store.createIndex('nombres', 'nombres');
        store.createIndex('apellidos', 'apellidos');
      }
      if (!db.objectStoreNames.contains(STORE_CARGOS)) {
        const store = db.createObjectStore(STORE_CARGOS, { keyPath: 'id' });
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
    await db.clear(STORE_TRABAJADORES);
    await db.clear(STORE_CARGOS);
    return true;
  } catch (error) {
    console.error('Error limpiando IndexedDB:', error);
    return false;
  }
};

// ========================================
// HOOK PRINCIPAL
// ========================================
export function useTrabajadores() {
  // Estado principal
  const [trabajadores, setTrabajadores] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [filtroCargo, setFiltroCargo] = useState('Todos');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroTieneUsuario, setFiltroTieneUsuario] = useState('Todos');
  const [vista, setVista] = useState('table'); // 'table' | 'grid'

  // ========================================
  // INICIALIZACIÓN
  // ========================================
  useEffect(() => {
    const inicializar = async () => {
      setCargando(true);
      try {
        // Cargar cargos
        const cargosGuardados = await cargarDesdeIndexedDB(STORE_CARGOS);
        if (cargosGuardados) {
          setCargos(cargosGuardados);
        } else {
          setCargos(CARGOS_INICIALES);
          await guardarEnIndexedDB(STORE_CARGOS, CARGOS_INICIALES);
        }

        // Cargar trabajadores
        const trabajadoresGuardados = await cargarDesdeIndexedDB(STORE_TRABAJADORES);
        if (trabajadoresGuardados) {
          setTrabajadores(trabajadoresGuardados);
        } else {
          setTrabajadores(TRABAJADORES_INICIALES);
          await guardarEnIndexedDB(STORE_TRABAJADORES, TRABAJADORES_INICIALES);
        }
        setError(null);
      } catch (err) {
        setError('Error al cargar datos: ' + err.message);
      } finally {
        setCargando(false);
      }
    };
    inicializar();
  }, []);

  // ========================================
  // PERSISTENCIA AUTOMÁTICA
  // ========================================
  useEffect(() => {
    if (!cargando) {
      guardarEnIndexedDB(STORE_TRABAJADORES, trabajadores);
    }
  }, [trabajadores, cargando]);

  useEffect(() => {
    if (!cargando) {
      guardarEnIndexedDB(STORE_CARGOS, cargos);
    }
  }, [cargos, cargando]);

  // ========================================
  // FILTRADO DE TRABAJADORES
  // ========================================
  const trabajadoresFiltrados = useMemo(() => {
    return trabajadores.filter(t => {
      // Búsqueda por DNI, nombres, apellidos, código, email
      const coincideBusqueda = !filtroBusqueda ||
        t.dni?.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
        t.nombres?.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
        t.apellidos?.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
        t.codigo?.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
        t.email?.toLowerCase().includes(filtroBusqueda.toLowerCase());

      // Filtro por cargo
      const coincideCargo = filtroCargo === 'Todos' || t.cargo === filtroCargo;

      // Filtro por estado
      const coincideEstado = filtroEstado === 'Todos' || t.estado === filtroEstado;

      // Filtro por si tiene usuario asociado
      const tieneUsuario = !!t.usuarioAsociado;
      const coincideUsuario = filtroTieneUsuario === 'Todos' ||
        (filtroTieneUsuario === 'Si' && tieneUsuario) ||
        (filtroTieneUsuario === 'No' && !tieneUsuario);

      return coincideBusqueda && coincideCargo && coincideEstado && coincideUsuario;
    });
  }, [trabajadores, filtroBusqueda, filtroCargo, filtroEstado, filtroTieneUsuario]);

  // ========================================
  // RESUMEN ESTADÍSTICO
  // ========================================
  const resumen = useMemo(() => ({
    total: trabajadores.length,
    activos: trabajadores.filter(t => t.estado === 'Activo').length,
    inactivos: trabajadores.filter(t => t.estado === 'Inactivo').length,
    conUsuario: trabajadores.filter(t => !!t.usuarioAsociado).length,
    sinUsuario: trabajadores.filter(t => !t.usuarioAsociado).length,
    mostrados: trabajadoresFiltrados.length
  }), [trabajadores, trabajadoresFiltrados]);

  // ========================================
  // CARGOS ACTIVOS
  // ========================================
  const cargosActivos = useMemo(() =>
    cargos.filter(c => c.activo !== false).sort((a, b) => a.orden - b.orden),
    [cargos]
  );

  // ========================================
  // VALIDACIONES
  // ========================================
  const validarTrabajador = useCallback((datos, excluirId = null) => {
    const errores = {};

    if (!datos.dni?.trim()) {
      errores.dni = 'El DNI es obligatorio';
    } else if (!/^\d{8}$/.test(datos.dni.trim())) {
      errores.dni = 'El DNI debe tener 8 dígitos';
    } else {
      const dniExistente = trabajadores.find(t =>
        t.id !== excluirId && t.dni === datos.dni.trim()
      );
      if (dniExistente) {
        errores.dni = 'Ya existe un trabajador con este DNI';
      }
    }

    if (!datos.nombres?.trim()) {
      errores.nombres = 'Los nombres son obligatorios';
    } else if (datos.nombres.trim().length < 2) {
      errores.nombres = 'Mínimo 2 caracteres';
    }

    if (!datos.apellidos?.trim()) {
      errores.apellidos = 'Los apellidos son obligatorios';
    } else if (datos.apellidos.trim().length < 2) {
      errores.apellidos = 'Mínimo 2 caracteres';
    }

    if (datos.telefono && !/^\d{9}$/.test(datos.telefono.trim())) {
      errores.telefono = 'El teléfono debe tener 9 dígitos';
    }

    if (datos.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email.trim())) {
      errores.email = 'Formato de email inválido';
    }

    if (!datos.cargo) {
      errores.cargo = 'Seleccione un cargo';
    }

    if (!datos.fechaIngreso) {
      errores.fechaIngreso = 'La fecha de ingreso es obligatoria';
    }

    return errores;
  }, [trabajadores]);

  // ========================================
  // CRUD TRABAJADORES
  // ========================================
  const crearTrabajador = useCallback(async (datos) => {
    const errores = validarTrabajador(datos);
    if (Object.keys(errores).length > 0) {
      throw new Error(JSON.stringify(errores));
    }

    // Generar código automático
    const ultimos = trabajadores
      .map(t => parseInt(t.codigo?.replace('TRA', '') || '0'))
      .filter(n => !isNaN(n))
      .sort((a, b) => b - a);
    const siguienteNumero = (ultimos[0] || 0) + 1;
    const codigo = `TRA${String(siguienteNumero).padStart(3, '0')}`;

    const nuevoTrabajador = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      codigo,
      dni: datos.dni.trim(),
      nombres: datos.nombres.trim(),
      apellidos: datos.apellidos.trim(),
      telefono: datos.telefono?.trim() || '',
      email: datos.email?.trim().toLowerCase() || '',
      direccion: datos.direccion?.trim() || '',
      cargo: datos.cargo,
      fechaIngreso: datos.fechaIngreso,
      estado: datos.estado || 'Activo',
      usuarioAsociado: null,
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString()
    };

    setTrabajadores(prev => [...prev, nuevoTrabajador]);
    return nuevoTrabajador;
  }, [trabajadores, validarTrabajador]);

  const editarTrabajador = useCallback(async (id, datos) => {
    const errores = validarTrabajador(datos, id);
    if (Object.keys(errores).length > 0) {
      throw new Error(JSON.stringify(errores));
    }

    setTrabajadores(prev => prev.map(t =>
      t.id === id
        ? {
            ...t,
            dni: datos.dni.trim(),
            nombres: datos.nombres.trim(),
            apellidos: datos.apellidos.trim(),
            telefono: datos.telefono?.trim() || '',
            email: datos.email?.trim().toLowerCase() || '',
            direccion: datos.direccion?.trim() || '',
            cargo: datos.cargo,
            fechaIngreso: datos.fechaIngreso,
            estado: datos.estado,
            actualizadoEn: new Date().toISOString()
          }
        : t
    ));
  }, [validarTrabajador]);

  const eliminarTrabajador = useCallback(async (id) => {
    setTrabajadores(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleEstadoTrabajador = useCallback(async (id) => {
    setTrabajadores(prev => prev.map(t =>
      t.id === id
        ? {
            ...t,
            estado: t.estado === 'Activo' ? 'Inactivo' : 'Activo',
            actualizadoEn: new Date().toISOString()
          }
        : t
    ));
  }, []);

  // ========================================
  // SINCRONIZACIÓN CON USUARIOS
  // ========================================
  // Esta función se llama desde useUsuarios cuando cambian los usuarios
  const actualizarUsuariosAsociados = useCallback((usuarios) => {
    setTrabajadores(prev => prev.map(t => {
      const usuarioAsociado = usuarios.find(u => u.trabajadorId === t.id);
      return {
        ...t,
        usuarioAsociado: usuarioAsociado ? {
          id: usuarioAsociado.id,
          username: usuarioAsociado.username,
          estado: usuarioAsociado.estado,
          rolNombre: usuarioAsociado.rolNombre
        } : null
      };
    }));
  }, []);

  // ========================================
  // CRUD CARGOS
  // ========================================
  const crearCargo = useCallback(async (datos) => {
    if (!datos.nombre?.trim()) throw new Error('El nombre del cargo es obligatorio');

    const duplicado = cargos.find(c =>
      c.nombre.toLowerCase() === datos.nombre.trim().toLowerCase()
    );
    if (duplicado) throw new Error('Ya existe un cargo con ese nombre');

    const maxOrden = Math.max(...cargos.map(c => c.orden || 0), 0);
    const nuevoCargo = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion?.trim() || '',
      orden: maxOrden + 1,
      activo: true,
      creadoEn: new Date().toISOString()
    };
    setCargos(prev => [...prev, nuevoCargo]);
    return nuevoCargo;
  }, [cargos]);

  const editarCargo = useCallback(async (id, datos) => {
    if (!datos.nombre?.trim()) throw new Error('El nombre del cargo es obligatorio');

    const duplicado = cargos.find(c =>
      c.id !== id && c.nombre.toLowerCase() === datos.nombre.trim().toLowerCase()
    );
    if (duplicado) throw new Error('Ya existe un cargo con ese nombre');

    setCargos(prev => prev.map(c =>
      c.id === id
        ? { ...c, nombre: datos.nombre.trim(), descripcion: datos.descripcion?.trim() || '', activo: datos.activo }
        : c
    ));
  }, [cargos]);

  const eliminarCargo = useCallback(async (id) => {
    const cargo = cargos.find(c => c.id === id);
    if (cargo && trabajadores.some(t => t.cargo === cargo.nombre)) {
      throw new Error('No se puede eliminar: hay trabajadores con este cargo');
    }
    setCargos(prev => prev.filter(c => c.id !== id));
  }, [cargos, trabajadores]);

  const reordenarCargos = useCallback(async (cargosOrdenados) => {
    setCargos(cargosOrdenados.map((c, i) => ({ ...c, orden: i + 1 })));
  }, []);

  const toggleCargoActivo = useCallback(async (id) => {
    setCargos(prev => prev.map(c =>
      c.id === id ? { ...c, activo: !c.activo } : c
    ));
  }, []);

  // ========================================
  // UTILIDADES
  // ========================================
  const obtenerTrabajador = useCallback((id) => {
    return trabajadores.find(t => t.id === id);
  }, [trabajadores]);

  const obtenerTrabajadorPorDni = useCallback((dni) => {
    return trabajadores.find(t => t.dni === dni);
  }, [trabajadores]);

  const obtenerCargo = useCallback((id) => {
    return cargos.find(c => c.id === id);
  }, [cargos]);

  const obtenerColorEstado = useCallback((estado) => {
    return ESTADO_TRABAJADOR_COLORES[estado] || { bg: '#F5F5F5', text: '#333', border: '#DDD', icon: '❓' };
  }, []);

  const obtenerColorCargoFn = useCallback((cargo) => {
    return obtenerColorCargo(cargo);
  }, []);

  const resetearDatos = useCallback(async () => {
    await limpiarIndexedDB();
    setTrabajadores(TRABAJADORES_INICIALES);
    setCargos(CARGOS_INICIALES);
    await Promise.all([
      guardarEnIndexedDB(STORE_TRABAJADORES, TRABAJADORES_INICIALES),
      guardarEnIndexedDB(STORE_CARGOS, CARGOS_INICIALES)
    ]);
  }, []);

  const limpiarFiltros = useCallback(() => {
    setFiltroBusqueda('');
    setFiltroCargo('Todos');
    setFiltroEstado('Todos');
    setFiltroTieneUsuario('Todos');
  }, []);

  return {
    // Estado
    trabajadores: trabajadoresFiltrados,
    todosLosTrabajadores: trabajadores,
    cargos,
    cargosActivos,
    cargando,
    error,
    resumen,
    vista,
    setVista,

    // Filtros
    filtroBusqueda,
    setFiltroBusqueda,
    filtroCargo,
    setFiltroCargo,
    filtroEstado,
    setFiltroEstado,
    filtroTieneUsuario,
    setFiltroTieneUsuario,

    // Acciones - Trabajadores
    crearTrabajador,
    editarTrabajador,
    eliminarTrabajador,
    toggleEstadoTrabajador,

    // Acciones - Cargos
    crearCargo,
    editarCargo,
    eliminarCargo,
    reordenarCargos,
    toggleCargoActivo,

    // Sincronización con Usuarios
    actualizarUsuariosAsociados,

    // Utilidades
    obtenerTrabajador,
    obtenerTrabajadorPorDni,
    obtenerCargo,
    obtenerColorEstado,
    obtenerColorCargo: obtenerColorCargoFn,
    obtenerNombreCompleto,
    obtenerIniciales,
    resetearDatos,
    limpiarFiltros,

    // Constantes
    ESTADOS_TRABAJADOR,
    CARGOS_INICIALES,
    ESTADO_TRABAJADOR_COLORES,
    CARGO_COLORES
  };
}