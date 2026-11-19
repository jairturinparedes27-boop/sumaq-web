// src/data/trabajadoresMock.js
// Datos de prueba para el módulo Trabajadores

// ========================================
// GENERADOR DE IDs
// ========================================
const generarId = () => Date.now() + Math.random().toString(36).substr(2, 9);

// ========================================
// CARGOS INICIALES
// ========================================
export const CARGOS_INICIALES = [
  { id: generarId(), nombre: 'Administrador', descripcion: 'Gestión total del restaurante', orden: 1 },
  { id: generarId(), nombre: 'Cajero', descripcion: 'Caja, pagos y facturación', orden: 2 },
  { id: generarId(), nombre: 'Mozo', descripcion: 'Atención de mesas y pedidos', orden: 3 },
  { id: generarId(), nombre: 'Personal de cocina', descripcion: 'Preparación de alimentos', orden: 4 },
  { id: generarId(), nombre: 'Encargado de almacén', descripcion: 'Gestión de insumos e inventario', orden: 5 },
  { id: generarId(), nombre: 'Otros', descripcion: 'Otros cargos no listados', orden: 6 }
];

// Función para obtener cargos activos
export const obtenerCargosActivos = () => CARGOS_INICIALES.filter(c => c.activo !== false).sort((a, b) => a.orden - b.orden);

// ========================================
// ESTADOS DE TRABAJADOR
// ========================================
export const ESTADOS_TRABAJADOR = ['Activo', 'Inactivo'];

// ========================================
// TRABAJADORES INICIALES (MOCK)
// ========================================
export const TRABAJADORES_INICIALES = [
  {
    id: generarId(),
    codigo: 'TRA001',
    dni: '12345678',
    nombres: 'Carlos Alberto',
    apellidos: 'Mendoza Ruiz',
    telefono: '987654321',
    email: 'carlos.mendoza@sumaqnan.pe',
    direccion: 'Av. Los Incas 123, San Isidro, Lima',
    cargo: 'Administrador',
    fechaIngreso: '2023-01-15',
    estado: 'Activo',
    usuarioAsociado: null, // Se llena desde useTrabajadores con data de Usuarios
    creadoEn: '2023-01-15T08:00:00.000Z',
    actualizadoEn: '2023-01-15T08:00:00.000Z'
  },
  {
    id: generarId(),
    codigo: 'TRA002',
    dni: '23456789',
    nombres: 'María Elena',
    apellidos: 'González Pérez',
    telefono: '987654322',
    email: 'maria.gonzalez@sumaqnan.pe',
    direccion: 'Jr. Las Flores 456, Miraflores, Lima',
    cargo: 'Cajero',
    fechaIngreso: '2023-02-20',
    estado: 'Activo',
    usuarioAsociado: null,
    creadoEn: '2023-02-20T08:00:00.000Z',
    actualizadoEn: '2023-02-20T08:00:00.000Z'
  },
  {
    id: generarId(),
    codigo: 'TRA003',
    dni: '34567890',
    nombres: 'Juan Carlos',
    apellidos: 'Pérez López',
    telefono: '987654323',
    email: 'juan.perez@sumaqnan.pe',
    direccion: 'Av. Arequipa 789, Cercado, Lima',
    cargo: 'Mozo',
    fechaIngreso: '2023-03-10',
    estado: 'Activo',
    usuarioAsociado: null,
    creadoEn: '2023-03-10T08:00:00.000Z',
    actualizadoEn: '2023-03-10T08:00:00.000Z'
  },
  {
    id: generarId(),
    codigo: 'TRA004',
    dni: '45678901',
    nombres: 'Ana Lucía',
    apellidos: 'Rodríguez Silva',
    telefono: '987654324',
    email: 'ana.rodriguez@sumaqnan.pe',
    direccion: 'Calle Los Pinos 321, Surco, Lima',
    cargo: 'Mozo',
    fechaIngreso: '2023-03-15',
    estado: 'Activo',
    usuarioAsociado: null,
    creadoEn: '2023-03-15T08:00:00.000Z',
    actualizadoEn: '2023-03-15T08:00:00.000Z'
  },
  {
    id: generarId(),
    codigo: 'TRA005',
    dni: '56789012',
    nombres: 'Luis Fernando',
    apellidos: 'Torres Vargas',
    telefono: '987654325',
    email: 'luis.torres@sumaqnan.pe',
    direccion: 'Av. Javier Prado 654, San Borja, Lima',
    cargo: 'Personal de cocina',
    fechaIngreso: '2023-04-01',
    estado: 'Activo',
    usuarioAsociado: null,
    creadoEn: '2023-04-01T08:00:00.000Z',
    actualizadoEn: '2023-04-01T08:00:00.000Z'
  },
  {
    id: generarId(),
    codigo: 'TRA006',
    dni: '67890123',
    nombres: 'Sofia Isabel',
    apellidos: 'Vargas Castillo',
    telefono: '987654326',
    email: 'sofia.vargas@sumaqnan.pe',
    direccion: 'Jr. Los Cedros 987, La Molina, Lima',
    cargo: 'Personal de cocina',
    fechaIngreso: '2023-04-10',
    estado: 'Activo',
    usuarioAsociado: null,
    creadoEn: '2023-04-10T08:00:00.000Z',
    actualizadoEn: '2023-04-10T08:00:00.000Z'
  },
  {
    id: generarId(),
    codigo: 'TRA007',
    dni: '78901234',
    nombres: 'Pedro Pablo',
    apellidos: 'Castillo Flores',
    telefono: '987654327',
    email: 'pedro.castillo@sumaqnan.pe',
    direccion: 'Av. Primavera 147, San Borja, Lima',
    cargo: 'Personal de cocina',
    fechaIngreso: '2023-05-01',
    estado: 'Activo',
    usuarioAsociado: null,
    creadoEn: '2023-05-01T08:00:00.000Z',
    actualizadoEn: '2023-05-01T08:00:00.000Z'
  },
  {
    id: generarId(),
    codigo: 'TRA008',
    dni: '89012345',
    nombres: 'Laura Patricia',
    apellidos: 'Flores Rojas',
    telefono: '987654328',
    email: 'laura.flores@sumaqnan.pe',
    direccion: 'Calle Las Gardenias 258, Surco, Lima',
    cargo: 'Cajero',
    fechaIngreso: '2023-05-15',
    estado: 'Activo',
    usuarioAsociado: null,
    creadoEn: '2023-05-15T08:00:00.000Z',
    actualizadoEn: '2023-05-15T08:00:00.000Z'
  },
  {
    id: generarId(),
    codigo: 'TRA009',
    dni: '90123456',
    nombres: 'Miguel Ángel',
    apellidos: 'Rojas Silva',
    telefono: '987654329',
    email: 'miguel.rojas@sumaqnan.pe',
    direccion: 'Av. El Derby 369, La Molina, Lima',
    cargo: 'Mozo',
    fechaIngreso: '2023-06-01',
    estado: 'Activo',
    usuarioAsociado: null,
    creadoEn: '2023-06-01T08:00:00.000Z',
    actualizadoEn: '2023-06-01T08:00:00.000Z'
  },
  {
    id: generarId(),
    codigo: 'TRA010',
    dni: '01234567',
    nombres: 'Carmen Rosa',
    apellidos: 'Silva Torres',
    telefono: '987654330',
    email: 'carmen.silva@sumaqnan.pe',
    direccion: 'Jr. Los Alamos 741, Miraflores, Lima',
    cargo: 'Encargado de almacén',
    fechaIngreso: '2023-06-15',
    estado: 'Inactivo',
    usuarioAsociado: null,
    creadoEn: '2023-06-15T08:00:00.000Z',
    actualizadoEn: '2023-06-15T08:00:00.000Z'
  }
];

// ========================================
// HELPERS
// ========================================
export const obtenerNombreCompleto = (trabajador) => {
  if (!trabajador) return '—';
  return `${trabajador.nombres} ${trabajador.apellidos}`.trim();
};

export const obtenerIniciales = (trabajador) => {
  if (!trabajador) return '?';
  const n = (trabajador.nombres || '').charAt(0);
  const a = (trabajador.apellidos || '').charAt(0);
  return (n + a).toUpperCase();
};

// ========================================
// COLORES PARA ESTADOS
// ========================================
export const ESTADO_TRABAJADOR_COLORES = {
  'Activo': { bg: '#E8F5E9', text: '#2E7D32', border: '#81C784', icon: '✅' },
  'Inactivo': { bg: '#F5F5F5', text: '#757575', border: '#BDBDBD', icon: '⏸' }
};

// ========================================
// COLORES PARA CARGOS (para badges)
// ========================================
export const CARGO_COLORES = {
  'Administrador': { bg: '#FBE9E7', text: '#BF360C', border: '#FF8A65' },
  'Cajero': { bg: '#E3F2FD', text: '#1565C0', border: '#64B5F6' },
  'Mozo': { bg: '#E8F5E9', text: '#2E7D32', border: '#81C784' },
  'Personal de cocina': { bg: '#FFF3E0', text: '#E65100', border: '#FFB74D' },
  'Encargado de almacén': { bg: '#F3E5F5', text: '#6A1B9A', border: '#BA68C8' },
  'Otros': { bg: '#F5F5F5', text: '#757575', border: '#BDBDBD' }
};

// Función para obtener color de cargo
export const obtenerColorCargo = (cargo) => {
  return CARGO_COLORES[cargo] || CARGO_COLORES['Otros'];
};