// src/data/usuariosMock.js
// Datos de prueba para el módulo Usuarios y Permisos

// ========================================
// GENERADOR DE IDs
// ========================================
const generarId = () => Date.now() + Math.random().toString(36).substr(2, 9);

// ========================================
// ROLES INICIALES
// ========================================
// Estructura preparada para permisos granulares futuros
export const ROLES_INICIALES = [
  {
    id: generarId(),
    nombre: 'Administrador',
    descripcion: 'Acceso completo al sistema, gestión de usuarios, configuración y reportes',
    nivel: 100, // Nivel de jerarquía (mayor = más poder)
    activo: true,
    permisos: {
      // Módulos principales
      dashboard: { ver: true, crear: true, editar: true, eliminar: true },
      mesas: { ver: true, crear: true, editar: true, eliminar: true, gestionarEstados: true },
      pedidos: { ver: true, crear: true, editar: true, eliminar: true, anular: true, caja: true },
      cocina: { ver: true, crear: true, editar: true, eliminar: true, gestionarEstados: true },
      productos: { ver: true, crear: true, editar: true, eliminar: true, gestionarCategorias: true },
      insumos: { ver: true, crear: true, editar: true, eliminar: true, movimientos: true, recetas: true, alertas: true },
      trabajadores: { ver: true, crear: true, editar: true, eliminar: true, comisiones: true },
      usuarios: { ver: true, crear: true, editar: true, eliminar: true, roles: true, resetearPassword: true },
      reportes: { ver: true, exportar: true, financieros: true, operativos: true },
      // Configuración
      configuracion: { ver: true, editar: true },
      // Acciones transversales
      anularOperaciones: true,
      verCostos: true,
      gestionarUsuarios: true
    },
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString()
  },
  {
    id: generarId(),
    nombre: 'Cajero',
    descripcion: 'Gestión de caja, pagos, pedidos y facturación',
    nivel: 50,
    activo: true,
    permisos: {
      dashboard: { ver: true },
      mesas: { ver: true, gestionarEstados: true },
      pedidos: { ver: true, crear: true, editar: true, caja: true, anular: false },
      cocina: { ver: false },
      productos: { ver: true },
      insumos: { ver: false },
      trabajadores: { ver: false },
      usuarios: { ver: false },
      reportes: { ver: true, exportar: true, financieros: true, operativos: false },
      configuracion: { ver: false },
      anularOperaciones: false,
      verCostos: false,
      gestionarUsuarios: false
    },
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString()
  },
  {
    id: generarId(),
    nombre: 'Mozo',
    descripcion: 'Atención de mesas, toma de pedidos y servicio al cliente',
    nivel: 30,
    activo: true,
    permisos: {
      dashboard: { ver: true },
      mesas: { ver: true, crear: true, editar: true, gestionarEstados: true },
      pedidos: { ver: true, crear: true, editar: true, caja: false },
      cocina: { ver: false },
      productos: { ver: true },
      insumos: { ver: false },
      trabajadores: { ver: false },
      usuarios: { ver: false },
      reportes: { ver: false },
      configuracion: { ver: false },
      anularOperaciones: false,
      verCostos: false,
      gestionarUsuarios: false
    },
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString()
  },
  {
    id: generarId(),
    nombre: 'Cocina',
    descripcion: 'Visualización y gestión de pedidos en cocina (KDS)',
    nivel: 30,
    activo: true,
    permisos: {
      dashboard: { ver: true },
      mesas: { ver: false },
      pedidos: { ver: true, editar: true }, // Solo cambiar estados
      cocina: { ver: true, crear: true, editar: true, gestionarEstados: true },
      productos: { ver: false },
      insumos: { ver: false },
      trabajadores: { ver: false },
      usuarios: { ver: false },
      reportes: { ver: false },
      configuracion: { ver: false },
      anularOperaciones: false,
      verCostos: false,
      gestionarUsuarios: false
    },
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString()
  }
];

// ========================================
// ESTADOS DE USUARIO
// ========================================
export const ESTADOS_USUARIO = ['Activo', 'Inactivo', 'Bloqueado', 'Pendiente'];

// ========================================
// TRABAJADORES MOCK (para vincular)
// En producción esto vendría del módulo Trabajadores
// ========================================
export const TRABAJADORES_MOCK = [
  { id: generarId(), codigo: 'TRA001', nombre: 'Carlos', apellido: 'Mendoza', dni: '12345678', cargo: 'Administrador', email: 'carlos.mendoza@sumaqnan.pe', telefono: '987654321', activo: true },
  { id: generarId(), codigo: 'TRA002', nombre: 'María', apellido: 'González', dni: '23456789', cargo: 'Cajera', email: 'maria.gonzalez@sumaqnan.pe', telefono: '987654322', activo: true },
  { id: generarId(), codigo: 'TRA003', nombre: 'Juan', apellido: 'Pérez', dni: '34567890', cargo: 'Mozo', email: 'juan.perez@sumaqnan.pe', telefono: '987654323', activo: true },
  { id: generarId(), codigo: 'TRA004', nombre: 'Ana', apellido: 'Rodríguez', dni: '45678901', cargo: 'Mozo', email: 'ana.rodriguez@sumaqnan.pe', telefono: '987654324', activo: true },
  { id: generarId(), codigo: 'TRA005', nombre: 'Luis', apellido: 'Torres', dni: '56789012', cargo: 'Cocinero', email: 'luis.torres@sumaqnan.pe', telefono: '987654325', activo: true },
  { id: generarId(), codigo: 'TRA006', nombre: 'Sofia', apellido: 'Vargas', dni: '67890123', cargo: 'Cocinero', email: 'sofia.vargas@sumaqnan.pe', telefono: '987654326', activo: true },
  { id: generarId(), codigo: 'TRA007', nombre: 'Pedro', apellido: 'Castillo', dni: '78901234', cargo: 'Auxiliar Cocina', email: 'pedro.castillo@sumaqnan.pe', telefono: '987654327', activo: true },
  { id: generarId(), codigo: 'TRA008', nombre: 'Laura', apellido: 'Flores', dni: '89012345', cargo: 'Cajera', email: 'laura.flores@sumaqnan.pe', telefono: '987654328', activo: true },
  { id: generarId(), codigo: 'TRA009', nombre: 'Miguel', apellido: 'Rojas', dni: '90123456', cargo: 'Mozo', email: 'miguel.rojas@sumaqnan.pe', telefono: '987654329', activo: true },
  { id: generarId(), codigo: 'TRA010', nombre: 'Carmen', apellido: 'Silva', dni: '01234567', cargo: 'Recepcionista', email: 'carmen.silva@sumaqnan.pe', telefono: '987654330', activo: false }
];

// Función helper para obtener nombre completo
export const obtenerNombreCompleto = (trabajador) => {
  if (!trabajador) return '—';
  return `${trabajador.nombre} ${trabajador.apellido}`.trim();
};

// ========================================
// USUARIOS INICIALES
// ========================================
// NOTA: En producción las contraseñas NUNCA se guardan en texto plano.
// Aquí usamos "passwordHash" simulado para estructura realista.
const crearUsuario = (trabajador, username, rolNombre, overrides = {}) => {
  const rol = ROLES_INICIALES.find(r => r.nombre === rolNombre);
  return {
    id: generarId(),
    codigo: overrides.codigo || `USR-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    username: username.toLowerCase(),
    passwordHash: overrides.passwordHash || '$2b$10$simulatedHashForDemoPurposesOnly', // bcrypt simulado
    trabajadorId: trabajador?.id || '',
    trabajadorCodigo: trabajador?.codigo || '',
    trabajadorNombre: obtenerNombreCompleto(trabajador),
    rolId: rol?.id || '',
    rolNombre: rolNombre,
    estado: overrides.estado || 'Activo',
    debeCambiarPassword: overrides.debeCambiarPassword || false,
    ultimoAcceso: overrides.ultimoAcceso || null,
    intentosFallidos: 0,
    bloqueadoHasta: null,
    creadoEn: overrides.creadoEn || new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
    creadoPor: 'Sistema'
  };
};

export const USUARIOS_INICIALES = [
  // Admin principal
  crearUsuario(TRABAJADORES_MOCK[0], 'admin', 'Administrador', { codigo: 'USR001', estado: 'Activo' }),
  // Cajeros
  crearUsuario(TRABAJADORES_MOCK[1], 'maria.caja', 'Cajero', { codigo: 'USR002', estado: 'Activo' }),
  crearUsuario(TRABAJADORES_MOCK[7], 'laura.caja', 'Cajero', { codigo: 'USR003', estado: 'Activo' }),
  // Mozos
  crearUsuario(TRABAJADORES_MOCK[2], 'juan.mozo', 'Mozo', { codigo: 'USR004', estado: 'Activo' }),
  crearUsuario(TRABAJADORES_MOCK[3], 'ana.mozo', 'Mozo', { codigo: 'USR005', estado: 'Activo' }),
  crearUsuario(TRABAJADORES_MOCK[8], 'miguel.mozo', 'Mozo', { codigo: 'USR006', estado: 'Activo' }),
  // Cocina
  crearUsuario(TRABAJADORES_MOCK[4], 'luis.cocina', 'Cocina', { codigo: 'USR007', estado: 'Activo' }),
  crearUsuario(TRABAJADORES_MOCK[5], 'sofia.cocina', 'Cocina', { codigo: 'USR008', estado: 'Activo' }),
  crearUsuario(TRABAJADORES_MOCK[6], 'pedro.cocina', 'Cocina', { codigo: 'USR009', estado: 'Inactivo' }),
  // Usuario pendiente (sin trabajador asignado aún)
  {
    id: generarId(),
    codigo: 'USR010',
    username: 'nuevo.usuario',
    passwordHash: '$2b$10$simulatedHashForDemoPurposesOnly',
    trabajadorId: '',
    trabajadorCodigo: '',
    trabajadorNombre: 'Sin asignar',
    rolId: ROLES_INICIALES[1].id, // Cajero por defecto
    rolNombre: 'Cajero',
    estado: 'Pendiente',
    debeCambiarPassword: true,
    ultimoAcceso: null,
    intentosFallidos: 0,
    bloqueadoHasta: null,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
    creadoPor: 'admin'
  }
];

// ========================================
// PERMISOS DISPONIBLES (Catálogo para UI)
// ========================================
export const CATALOGO_PERMISOS = {
  // Módulos
  dashboard: { label: 'Dashboard', acc: ['ver'] },
  mesas: { label: 'Mesas', acc: ['ver', 'crear', 'editar', 'eliminar', 'gestionarEstados'] },
  pedidos: { label: 'Pedidos', acc: ['ver', 'crear', 'editar', 'eliminar', 'anular', 'caja'] },
  cocina: { label: 'Cocina (KDS)', acc: ['ver', 'crear', 'editar', 'eliminar', 'gestionarEstados'] },
  productos: { label: 'Productos', acc: ['ver', 'crear', 'editar', 'eliminar', 'gestionarCategorias'] },
  insumos: { label: 'Insumos', acc: ['ver', 'crear', 'editar', 'eliminar', 'movimientos', 'recetas', 'alertas'] },
  trabajadores: { label: 'Trabajadores', acc: ['ver', 'crear', 'editar', 'eliminar', 'comisiones'] },
  usuarios: { label: 'Usuarios', acc: ['ver', 'crear', 'editar', 'eliminar', 'roles', 'resetearPassword'] },
  reportes: { label: 'Reportes', acc: ['ver', 'exportar', 'financieros', 'operativos'] },
  configuracion: { label: 'Configuración', acc: ['ver', 'editar'] },
  // Acciones transversales
  transversales: {
    label: 'Acciones Transversales',
    acc: [
      { key: 'anularOperaciones', label: 'Anular operaciones' },
      { key: 'verCostos', label: 'Ver costos y márgenes' },
      { key: 'gestionarUsuarios', label: 'Gestionar usuarios y roles' }
    ]
  }
};

// ========================================
// COLORES PARA ESTADOS Y ROLES
// ========================================
export const ESTADO_USUARIO_COLORES = {
  'Activo': { bg: '#E8F5E9', text: '#2E7D32', border: '#81C784', icon: '✅' },
  'Inactivo': { bg: '#F5F5F5', text: '#757575', border: '#BDBDBD', icon: '⏸' },
  'Bloqueado': { bg: '#FBE9E7', text: '#C62828', border: '#EF9A9A', icon: '🔒' },
  'Pendiente': { bg: '#FFF8E1', text: '#F57F17', border: '#FFD54F', icon: '⏳' }
};

export const NIVEL_ROL_COLORES = {
  100: { bg: '#FBE9E7', text: '#BF360C', border: '#FF8A65', label: 'Sistema' },    // Admin
  50:  { bg: '#E3F2FD', text: '#1565C0', border: '#64B5F6', label: 'Gestión' },     // Cajero
  30:  { bg: '#E8F5E9', text: '#2E7D32', border: '#81C784', label: 'Operativo' },   // Mozo, Cocina
  10:  { bg: '#F3E5F5', text: '#6A1B9A', border: '#BA68C8', label: 'Básico' }
};