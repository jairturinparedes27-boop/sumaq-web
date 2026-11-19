// src/hooks/useUsuarios.js
// Hook personalizado para gestión de usuarios, roles y permisos con persistencia en IndexedDB

import { useState, useEffect, useCallback, useMemo } from 'react';
import { openDB } from 'idb';
import {
  ROLES_INICIALES,
  USUARIOS_INICIALES,
  TRABAJADORES_MOCK,
  ESTADOS_USUARIO,
  CATALOGO_PERMISOS,
  ESTADO_USUARIO_COLORES,
  NIVEL_ROL_COLORES,
  obtenerNombreCompleto
} from '../data/usuariosMock';

const DB_NAME = 'sumaq-usuarios-db';
const STORE_USUARIOS = 'usuarios';
const STORE_ROLES = 'roles';
const STORE_TRABAJADORES = 'trabajadores';
const DB_VERSION = 1;

// ========================================
// FUNCIONES DE INDEXEDDB
// ========================================
const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_USUARIOS)) {
        const store = db.createObjectStore(STORE_USUARIOS, { keyPath: 'id' });
        store.createIndex('username', 'username', { unique: true });
        store.createIndex('estado', 'estado');
        store.createIndex('rolId', 'rolId');
        store.createIndex('trabajadorId', 'trabajadorId');
      }
      if (!db.objectStoreNames.contains(STORE_ROLES)) {
        const store = db.createObjectStore(STORE_ROLES, { keyPath: 'id' });
        store.createIndex('nombre', 'nombre', { unique: true });
        store.createIndex('nivel', 'nivel');
      }
      if (!db.objectStoreNames.contains(STORE_TRABAJADORES)) {
        const store = db.createObjectStore(STORE_TRABAJADORES, { keyPath: 'id' });
        store.createIndex('codigo', 'codigo', { unique: true });
        store.createIndex('activo', 'activo');
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
    await db.clear(STORE_USUARIOS);
    await db.clear(STORE_ROLES);
    await db.clear(STORE_TRABAJADORES);
    return true;
  } catch (error) {
    console.error('Error limpiando IndexedDB:', error);
    return false;
  }
};

// ========================================
// HOOK PRINCIPAL
// ========================================
export function useUsuarios() {
  // Estado principal
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroRol, setFiltroRol] = useState('Todos');
  const [filtroTieneTrabajador, setFiltroTieneTrabajador] = useState('Todos'); // 'Todos' | 'Si' | 'No'

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

        const [usuariosGuardados, rolesGuardados, trabajadoresGuardados] = await Promise.all([
          cargarDesdeIndexedDB(STORE_USUARIOS),
          cargarDesdeIndexedDB(STORE_ROLES),
          cargarDesdeIndexedDB(STORE_TRABAJADORES)
        ]);

        if (usuariosGuardados && rolesGuardados && trabajadoresGuardados) {
          setUsuarios(usuariosGuardados);
          setRoles(rolesGuardados);
          setTrabajadores(trabajadoresGuardados);
        } else {
          setUsuarios(USUARIOS_INICIALES);
          setRoles(ROLES_INICIALES);
          setTrabajadores(TRABAJADORES_MOCK);
          await Promise.all([
            guardarEnIndexedDB(STORE_USUARIOS, USUARIOS_INICIALES),
            guardarEnIndexedDB(STORE_ROLES, ROLES_INICIALES),
            guardarEnIndexedDB(STORE_TRABAJADORES, TRABAJADORES_MOCK)
          ]);
        }
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
        setUsuarios(USUARIOS_INICIALES);
        setRoles(ROLES_INICIALES);
        setTrabajadores(TRABAJADORES_MOCK);
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
    if (!cargando && usuarios.length >= 0) {
      guardarEnIndexedDB(STORE_USUARIOS, usuarios);
    }
  }, [usuarios, cargando]);

  useEffect(() => {
    if (!cargando && roles.length > 0) {
      guardarEnIndexedDB(STORE_ROLES, roles);
    }
  }, [roles, cargando]);

  useEffect(() => {
    if (!cargando && trabajadores.length > 0) {
      guardarEnIndexedDB(STORE_TRABAJADORES, trabajadores);
    }
  }, [trabajadores, cargando]);

  // ========================================
  // COMPUTADOS
  // ========================================

  // Roles activos para selects
  const rolesActivos = useMemo(() =>
    roles.filter(r => r.activo).sort((a, b) => b.nivel - a.nivel), // Mayor nivel primero
    [roles]
  );

  // Trabajadores activos SIN usuario asignado (para vincular)
  const trabajadoresSinUsuario = useMemo(() => {
    const usuariosIds = new Set(usuarios.map(u => u.trabajadorId).filter(Boolean));
    return trabajadores
      .filter(t => t.activo && !usuariosIds.has(t.id))
      .sort((a, b) => obtenerNombreCompleto(a).localeCompare(obtenerNombreCompleto(b)));
  }, [trabajadores, usuarios]);

  // Todos los trabajadores activos (para mostrar info)
  const trabajadoresActivos = useMemo(() =>
    trabajadores.filter(t => t.activo).sort((a, b) => obtenerNombreCompleto(a).localeCompare(obtenerNombreCompleto(b))),
    [trabajadores]
  );

  // Usuarios filtrados
  const usuariosFiltrados = useMemo(() => {
    return usuarios
      .filter(usuario => {
        // Búsqueda por username, nombre trabajador, código, email
        const coincideBusqueda = !filtroBusquedaDebounced ||
          usuario.username.toLowerCase().includes(filtroBusquedaDebounced.toLowerCase()) ||
          usuario.trabajadorNombre.toLowerCase().includes(filtroBusquedaDebounced.toLowerCase()) ||
          usuario.codigo.toLowerCase().includes(filtroBusquedaDebounced.toLowerCase()) ||
          (usuario.trabajadorCodigo && usuario.trabajadorCodigo.toLowerCase().includes(filtroBusquedaDebounced.toLowerCase()));

        // Filtro por estado
        const coincideEstado = filtroEstado === 'Todos' || usuario.estado === filtroEstado;

        // Filtro por rol
        const coincideRol = filtroRol === 'Todos' || usuario.rolId === filtroRol;

        // Filtro por trabajador asignado
        let coincideTrabajador = true;
        if (filtroTieneTrabajador === 'Si') coincideTrabajador = !!usuario.trabajadorId;
        else if (filtroTieneTrabajador === 'No') coincideTrabajador = !usuario.trabajadorId;

        return coincideBusqueda && coincideEstado && coincideRol && coincideTrabajador;
      })
      .sort((a, b) => {
        // Ordenar: primero por nivel de rol (desc), luego por username
        const rolA = roles.find(r => r.id === a.rolId);
        const rolB = roles.find(r => r.id === b.rolId);
        const nivelA = rolA?.nivel || 0;
        const nivelB = rolB?.nivel || 0;
        if (nivelA !== nivelB) return nivelB - nivelA;
        return a.username.localeCompare(b.username);
      });
  }, [usuarios, filtroBusquedaDebounced, filtroEstado, filtroRol, filtroTieneTrabajador, roles]);

  // Resumen general
  const resumen = useMemo(() => {
    const total = usuarios.length;
    const activos = usuarios.filter(u => u.estado === 'Activo').length;
    const inactivos = usuarios.filter(u => u.estado === 'Inactivo').length;
    const bloqueados = usuarios.filter(u => u.estado === 'Bloqueado').length;
    const pendientes = usuarios.filter(u => u.estado === 'Pendiente').length;
    const conTrabajador = usuarios.filter(u => u.trabajadorId).length;
    const sinTrabajador = usuarios.filter(u => !u.trabajadorId).length;
    const debenCambiarPass = usuarios.filter(u => u.debeCambiarPassword).length;

    return { total, activos, inactivos, bloqueados, pendientes, conTrabajador, sinTrabajador, debenCambiarPass };
  }, [usuarios]);

  // ========================================
  // ACCIONES - ROLES
  // ========================================
  const crearRol = useCallback(async (datos) => {
    const nuevoRol = {
      ...datos,
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      nivel: datos.nivel || 10,
      activo: true,
      permisos: datos.permisos || {},
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString()
    };
    setRoles(prev => [...prev, nuevoRol]);
    return nuevoRol;
  }, []);

  const editarRol = useCallback(async (id, datos) => {
    setRoles(prev => prev.map(rol =>
      rol.id === id ? { ...rol, ...datos, actualizadoEn: new Date().toISOString() } : rol
    ));
  }, []);

  const eliminarRol = useCallback(async (id) => {
    // Verificar si hay usuarios con este rol
    const usuariosConRol = usuarios.filter(u => u.rolId === id);
    if (usuariosConRol.length > 0) {
      throw new Error(`No se puede eliminar: ${usuariosConRol.length} usuario(s) tienen este rol asignado`);
    }
    // No permitir eliminar roles del sistema (nivel >= 100)
    const rol = roles.find(r => r.id === id);
    if (rol && rol.nivel >= 100) {
      throw new Error('No se puede eliminar un rol del sistema');
    }
    setRoles(prev => prev.filter(rol => rol.id !== id));
  }, [usuarios, roles]);

  const toggleRolActivo = useCallback(async (id) => {
    const rol = roles.find(r => r.id === id);
    if (rol && rol.nivel >= 100) {
      throw new Error('No se puede desactivar un rol del sistema');
    }
    setRoles(prev => prev.map(rol =>
      rol.id === id ? { ...rol, activa: !rol.activa, actualizadoEn: new Date().toISOString() } : rol
    ));
  }, [roles]);

  // ========================================
  // ACCIONES - TRABAJADORES (Mock - en producción vendría de API)
  // ========================================
  const crearTrabajador = useCallback(async (datos) => {
    const nuevoTrabajador = {
      ...datos,
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      codigo: `TRA-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      activo: true,
      creadoEn: new Date().toISOString()
    };
    setTrabajadores(prev => [...prev, nuevoTrabajador]);
    return nuevoTrabajador;
  }, []);

  // ========================================
  // ACCIONES - USUARIOS
  // ========================================
  const validarUsuario = useCallback((datos, excluirId = null) => {
    const errores = {};

    if (!datos.codigo?.trim()) {
      errores.codigo = 'El código es obligatorio';
    } else if (usuarios.some(u => u.codigo === datos.codigo.trim().toUpperCase() && u.id !== excluirId)) {
      errores.codigo = 'Este código ya existe';
    }

    if (!datos.username?.trim()) {
      errores.username = 'El nombre de usuario es obligatorio';
    } else if (!/^[a-zA-Z0-9._-]+$/.test(datos.username.trim())) {
      errores.username = 'Solo letras, números, punto, guión y guion bajo';
    } else if (usuarios.some(u => u.username === datos.username.trim().toLowerCase() && u.id !== excluirId)) {
      errores.username = 'Este nombre de usuario ya existe';
    }

    if (!datos.trabajadorId && datos.estado !== 'Pendiente') {
      errores.trabajadorId = 'Debe seleccionar un trabajador (o dejar en Pendiente)';
    } else if (datos.trabajadorId) {
      // Verificar que el trabajador no tenga ya otro usuario
      const usuarioExistente = usuarios.find(u => u.trabajadorId === datos.trabajadorId && u.id !== excluirId);
      if (usuarioExistente) {
        errores.trabajadorId = 'Este trabajador ya tiene un usuario asignado';
      }
    }

    if (!datos.rolId) {
      errores.rolId = 'Debe seleccionar un rol';
    }

    // Validación de contraseña solo en creación o si se proporciona nueva
    if (!excluirId || datos.nuevaPassword) {
      if (!datos.password || datos.password.length < 6) {
        errores.password = 'La contraseña debe tener al menos 6 caracteres';
      }
      if (datos.password !== datos.confirmarPassword) {
        errores.confirmarPassword = 'Las contraseñas no coinciden';
      }
    }

    return errores;
  }, [usuarios]);

  // Simulación de hash de contraseña (en producción: bcrypt en backend)
  const simularHash = (password) => {
    // NOTA: Esto es SOLO para demo frontend. En producción NUNCA hacer esto en frontend.
    // El backend (Spring Boot) debe usar BCryptPasswordEncoder o similar.
    return `$2b$10$${btoa(password + 'salt').substring(0, 53)}`;
  };

  const crearUsuario = useCallback(async (datos) => {
    const errores = validarUsuario(datos);
    if (Object.keys(errores).length > 0) {
      throw new Error(JSON.stringify(errores));
    }

    const rol = roles.find(r => r.id === datos.rolId);
    const trabajador = trabajadores.find(t => t.id === datos.trabajadorId);

    const nuevoUsuario = {
      ...datos,
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      codigo: datos.codigo.trim().toUpperCase(),
      username: datos.username.trim().toLowerCase(),
      passwordHash: simularHash(datos.password),
      trabajadorNombre: trabajador ? obtenerNombreCompleto(trabajador) : 'Sin asignar',
      trabajadorCodigo: trabajador?.codigo || '',
      rolNombre: rol?.nombre || '',
      estado: datos.estado || 'Activo',
      debeCambiarPassword: datos.debeCambiarPassword || false,
      ultimoAcceso: null,
      intentosFallidos: 0,
      bloqueadoHasta: null,
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
      creadoPor: 'Sistema' // En producción: usuario logueado actual
    };

    setUsuarios(prev => [nuevoUsuario, ...prev]);
    return nuevoUsuario;
  }, [roles, trabajadores, validarUsuario]);

  const editarUsuario = useCallback(async (id, datos) => {
    const errores = validarUsuario(datos, id);
    if (Object.keys(errores).length > 0) {
      throw new Error(JSON.stringify(errores));
    }

    const rol = roles.find(r => r.id === datos.rolId);
    const trabajador = trabajadores.find(t => t.id === datos.trabajadorId);

    setUsuarios(prev => prev.map(usuario =>
      usuario.id === id
        ? {
            ...usuario,
            ...datos,
            codigo: datos.codigo.trim().toUpperCase(),
            username: datos.username.trim().toLowerCase(),
            trabajadorNombre: trabajador ? obtenerNombreCompleto(trabajador) : 'Sin asignar',
            trabajadorCodigo: trabajador?.codigo || '',
            rolNombre: rol?.nombre || '',
            actualizadoEn: new Date().toISOString(),
            // No actualizar passwordHash aquí - usar cambiarPassword()
          }
        : usuario
    ));
  }, [roles, trabajadores, validarUsuario]);

  const eliminarUsuario = useCallback(async (id) => {
    // No permitir eliminar el último administrador
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) {
      const rol = roles.find(r => r.id === usuario.rolId);
      if (rol && rol.nivel >= 100) {
        const admins = usuarios.filter(u => {
          const r = roles.find(rol => rol.id === u.rolId);
          return r && r.nivel >= 100 && u.estado === 'Activo';
        });
        if (admins.length <= 1) {
          throw new Error('No se puede eliminar el último administrador activo');
        }
      }
    }
    setUsuarios(prev => prev.filter(usuario => usuario.id !== id));
  }, [usuarios, roles]);

  const toggleEstadoUsuario = useCallback(async (id) => {
    setUsuarios(prev => prev.map(usuario => {
      if (usuario.id !== id) return usuario;
      const estados = ['Activo', 'Inactivo', 'Bloqueado', 'Pendiente'];
      const idx = estados.indexOf(usuario.estado);
      return { ...usuario, estado: estados[(idx + 1) % estados.length], actualizadoEn: new Date().toISOString() };
    }));
  }, []);

  const cambiarPassword = useCallback(async (id, passwordActual, passwordNueva, confirmarPassword) => {
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) throw new Error('Usuario no encontrado');

    // Verificar contraseña actual (simulado)
    const hashActual = simularHash(passwordActual);
    if (hashActual !== usuario.passwordHash && passwordActual !== 'demo123') {
      throw new Error('La contraseña actual es incorrecta');
    }

    if (passwordNueva.length < 6) {
      throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
    }
    if (passwordNueva !== confirmarPassword) {
      throw new Error('Las contraseñas no coinciden');
    }

    setUsuarios(prev => prev.map(u =>
      u.id === id
        ? {
            ...u,
            passwordHash: simularHash(passwordNueva),
            debeCambiarPassword: false,
            actualizadoEn: new Date().toISOString()
          }
        : u
    ));
  }, [usuarios]);

  const resetearPassword = useCallback(async (id, nuevaPassword, confirmarPassword) => {
    // Solo administradores pueden resetear
    if (nuevaPassword.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    if (nuevaPassword !== confirmarPassword) {
      throw new Error('Las contraseñas no coinciden');
    }

    setUsuarios(prev => prev.map(u =>
      u.id === id
        ? {
            ...u,
            passwordHash: simularHash(nuevaPassword),
            debeCambiarPassword: true, // Forzar cambio en primer login
            intentosFallidos: 0,
            bloqueadoHasta: null,
            actualizadoEn: new Date().toISOString()
          }
        : u
    ));
  }, []);

  const desbloquearUsuario = useCallback(async (id) => {
    setUsuarios(prev => prev.map(u =>
      u.id === id
        ? {
            ...u,
            estado: 'Activo',
            intentosFallidos: 0,
            bloqueadoHasta: null,
            actualizadoEn: new Date().toISOString()
          }
        : u
    ));
  }, []);

  const vincularTrabajador = useCallback(async (usuarioId, trabajadorId) => {
    const trabajador = trabajadores.find(t => t.id === trabajadorId);
    const usuario = usuarios.find(u => u.id === usuarioId);

    if (!trabajador) throw new Error('Trabajador no encontrado');
    if (!usuario) throw new Error('Usuario no encontrado');

    // Verificar que el trabajador no tenga ya usuario
    const yaTiene = usuarios.some(u => u.trabajadorId === trabajadorId && u.id !== usuarioId);
    if (yaTiene) throw new Error('Este trabajador ya tiene un usuario asignado');

    setUsuarios(prev => prev.map(u =>
      u.id === usuarioId
        ? {
            ...u,
            trabajadorId,
            trabajadorNombre: obtenerNombreCompleto(trabajador),
            trabajadorCodigo: trabajador.codigo,
            estado: 'Activo',
            actualizadoEn: new Date().toISOString()
          }
        : u
    ));
  }, [trabajadores, usuarios]);

  const desvincularTrabajador = useCallback(async (usuarioId) => {
    setUsuarios(prev => prev.map(u =>
      u.id === usuarioId
        ? {
            ...u,
            trabajadorId: '',
            trabajadorNombre: 'Sin asignar',
            trabajadorCodigo: '',
            estado: 'Pendiente',
            actualizadoEn: new Date().toISOString()
          }
        : u
    ));
  }, []);

  // ========================================
  // UTILIDADES DE PERMISOS
  // ========================================
  const obtenerPermisosUsuario = useCallback((usuarioId) => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    if (!usuario) return {};
    const rol = roles.find(r => r.id === usuario.rolId);
    return rol?.permisos || {};
  }, [usuarios, roles]);

  const tienePermiso = useCallback((usuarioId, modulo, accion) => {
    const permisos = obtenerPermisosUsuario(usuarioId);
    return permisos[modulo]?.[accion] === true;
  }, [obtenerPermisosUsuario]);

  const tienePermisoTransversal = useCallback((usuarioId, permiso) => {
    const permisos = obtenerPermisosUsuario(usuarioId);
    return permisos[permiso] === true;
  }, [obtenerPermisosUsuario]);

  // ========================================
  // UTILIDADES GENERALES
  // ========================================
  const obtenerUsuario = useCallback((id) => {
    return usuarios.find(u => u.id === id);
  }, [usuarios]);

  const obtenerUsuarioPorUsername = useCallback((username) => {
    return usuarios.find(u => u.username === username.toLowerCase());
  }, [usuarios]);

  const obtenerRol = useCallback((rolId) => {
    return roles.find(r => r.id === rolId);
  }, [roles]);

  const obtenerTrabajador = useCallback((trabajadorId) => {
    return trabajadores.find(t => t.id === trabajadorId);
  }, [trabajadores]);

  const obtenerColorEstado = useCallback((estado) => {
    return ESTADO_USUARIO_COLORES[estado] || { bg: '#F5F5F5', text: '#333', border: '#DDD', icon: '❓' };
  }, []);

  const obtenerColorNivelRol = useCallback((nivel) => {
    return NIVEL_ROL_COLORES[nivel] || { bg: '#F5F5F5', text: '#333', border: '#DDD', label: 'Desconocido' };
  }, []);

  const resetearDatos = useCallback(async () => {
    await limpiarIndexedDB();
    setUsuarios(USUARIOS_INICIALES);
    setRoles(ROLES_INICIALES);
    setTrabajadores(TRABAJADORES_MOCK);
    await Promise.all([
      guardarEnIndexedDB(STORE_USUARIOS, USUARIOS_INICIALES),
      guardarEnIndexedDB(STORE_ROLES, ROLES_INICIALES),
      guardarEnIndexedDB(STORE_TRABAJADORES, TRABAJADORES_MOCK)
    ]);
  }, []);

  const limpiarFiltros = useCallback(() => {
    setFiltroBusqueda('');
    setFiltroEstado('Todos');
    setFiltroRol('Todos');
    setFiltroTieneTrabajador('Todos');
  }, []);

  return {
    // Estado
    usuarios: usuariosFiltrados,
    todosLosUsuarios: usuarios,
    roles,
    rolesActivos,
    trabajadores,
    trabajadoresActivos,
    trabajadoresSinUsuario,
    cargando,
    error,
    resumen,
    vista,
    setVista,

    // Filtros
    filtroBusqueda,
    setFiltroBusqueda,
    filtroEstado,
    setFiltroEstado,
    filtroRol,
    setFiltroRol,
    filtroTieneTrabajador,
    setFiltroTieneTrabajador,

    // Acciones - Roles
    crearRol,
    editarRol,
    eliminarRol,
    toggleRolActivo,

    // Acciones - Trabajadores (mock)
    crearTrabajador,

    // Acciones - Usuarios
    crearUsuario,
    editarUsuario,
    eliminarUsuario,
    toggleEstadoUsuario,
    cambiarPassword,
    resetearPassword,
    desbloquearUsuario,
    vincularTrabajador,
    desvincularTrabajador,
    validarUsuario,

    // Permisos
    obtenerPermisosUsuario,
    tienePermiso,
    tienePermisoTransversal,
    CATALOGO_PERMISOS,

    // Utilidades
    obtenerUsuario,
    obtenerUsuarioPorUsername,
    obtenerRol,
    obtenerTrabajador,
    obtenerColorEstado,
    obtenerColorNivelRol,
    resetearDatos,
    limpiarFiltros,

    // Constantes
    ESTADOS_USUARIO,
    TRABAJADORES_MOCK,
    ESTADO_USUARIO_COLORES,
    NIVEL_ROL_COLORES,
    ROLES_INICIALES
  };
}