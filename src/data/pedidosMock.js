// src/data/pedidosMock.js
// Datos de prueba para el módulo Pedidos

export const PEDIDOS_ESTADOS = [
  'Pendiente',
  'En preparación',
  'Listo',
  'Entregado',
  'Cancelado'
];

export const PEDIDO_ITEM_ESTADOS = [
  'Pendiente',
  'En preparación',
  'Listo',
  'Entregado'
];

export const ZONAS = [
  'Terraza',
  'Salón Principal',
  'Bar',
  'Privado',
  'Exterior'
];

export const MESAS_MOCK = [
  { id: 1, numero: 1, nombre: 'Mesa 1', capacidad: 2, zona: 'Terraza' },
  { id: 2, numero: 2, nombre: 'Mesa 2', capacidad: 4, zona: 'Terraza' },
  { id: 3, numero: 3, nombre: 'Mesa 3', capacidad: 4, zona: 'Salón Principal' },
  { id: 4, numero: 4, nombre: 'Mesa 4', capacidad: 6, zona: 'Salón Principal' },
  { id: 5, numero: 5, nombre: 'Mesa 5', capacidad: 2, zona: 'Bar' },
  { id: 6, numero: 6, nombre: 'Mesa 6', capacidad: 4, zona: 'Bar' },
  { id: 7, numero: 7, nombre: 'Mesa 7', capacidad: 8, zona: 'Privado' },
  { id: 8, numero: 8, nombre: 'Mesa 8', capacidad: 4, zona: 'Privado' },
  { id: 9, numero: 9, nombre: 'Mesa 9', capacidad: 2, zona: 'Exterior' },
  { id: 10, numero: 10, nombre: 'Mesa 10', capacidad: 4, zona: 'Exterior' },
  { id: 11, numero: 11, nombre: 'Mesa 11', capacidad: 6, zona: 'Salón Principal' },
  { id: 12, numero: 12, nombre: 'Mesa 12', capacidad: 4, zona: 'Terraza' },
  { id: 13, numero: 13, nombre: 'Mesa 14', capacidad: 2, zona: 'Bar' },
  { id: 14, numero: 14, nombre: 'Mesa 14', capacidad: 4, zona: 'Salón Principal' },
  { id: 15, numero: 15, nombre: 'Mesa 15', capacidad: 8, zona: 'Privado' }
];

export const PRODUCTOS_MOCK = [
  { id: 1, nombre: 'Ceviche Clásico', categoria: 'Entrantes', precio: 18.50, tiempoPreparacion: 15 },
  { id: 2, nombre: 'Tiradito de Pescado', categoria: 'Entrantes', precio: 20.00, tiempoPreparacion: 12 },
  { id: 3, nombre: 'Causa Limeña', categoria: 'Entrantes', precio: 14.00, tiempoPreparacion: 10 },
  { id: 4, nombre: 'Papa a la Huancaína', categoria: 'Entrantes', precio: 12.00, tiempoPreparacion: 8 },
  { id: 5, nombre: 'Arroz con Mariscos', categoria: 'Principales', precio: 28.00, tiempoPreparacion: 25 },
  { id: 6, nombre: 'Lomo Saltado', categoria: 'Principales', precio: 26.00, tiempoPreparacion: 20 },
  { id: 7, nombre: 'Ají de Gallina', categoria: 'Principales', precio: 22.00, tiempoPreparacion: 18 },
  { id: 8, nombre: 'Seco de Cabrito', categoria: 'Principales', precio: 30.00, tiempoPreparacion: 30 },
  { id: 9, nombre: 'Arroz Chaufa', categoria: 'Principales', precio: 24.00, tiempoPreparacion: 15 },
  { id: 10, nombre: 'Tallarin Saltado', categoria: 'Principales', precio: 23.00, tiempoPreparacion: 15 },
  { id: 11, nombre: 'Chicha Morada', categoria: 'Bebidas', precio: 5.00, tiempoPreparacion: 2 },
  { id: 12, nombre: 'Inca Kola', categoria: 'Bebidas', precio: 4.50, tiempoPreparacion: 1 },
  { id: 13, nombre: 'Cerveza Cusqueña', categoria: 'Bebidas', precio: 6.00, tiempoPreparacion: 1 },
  { id: 14, nombre: 'Pisco Sour', categoria: 'Bebidas', precio: 12.00, tiempoPreparacion: 5 },
  { id: 15, nombre: 'Suspiro Limeño', categoria: 'Postres', precio: 8.00, tiempoPreparacion: 5 },
  { id: 16, nombre: 'Mazamorra Morada', categoria: 'Postres', precio: 7.00, tiempoPreparacion: 3 },
  { id: 17, nombre: 'Arroz con Leche', categoria: 'Postres', precio: 6.50, tiempoPreparacion: 3 },
  { id: 18, nombre: 'Helado de Lucuma', categoria: 'Postres', precio: 7.50, tiempoPreparacion: 2 }
];

const generarId = () => Date.now() + Math.random().toString(36).substr(2, 9);

const crearPedido = (mesaId, items, observaciones = '', mozo = 'Juan Pérez') => {
  const mesa = MESAS_MOCK.find(m => m.id === mesaId);
  const subtotal = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const igv = subtotal * 0.18;
  const total = subtotal + igv;
  const ahora = new Date();

  return {
    id: generarId(),
    numero: `PED-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    mesaId,
    mesaNumero: mesa?.numero || 0,
    mesaNombre: mesa?.nombre || 'Sin mesa',
    zona: mesa?.zona || 'Sin zona',
    items: items.map(item => ({
      ...item,
      id: generarId(),
      estado: 'Pendiente',
      observaciones: item.observaciones || '',
      tiempoPreparacion: item.tiempoPreparacion || 15
    })),
    observaciones,
    mozo,
    estado: 'Pendiente',
    subtotal: Math.round(subtotal * 100) / 100,
    igv: Math.round(igv * 100) / 100,
    total: Math.round(total * 100) / 100,
    creadoEn: ahora.toISOString(),
    actualizadoEn: ahora.toISOString(),
    horaInicio: ahora.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
    tiempoTranscurrido: 0
  };
};

// Pedidos de prueba
export const PEDIDOS_INICIALES = [
  crearPedido(1, [
    { ...PRODUCTOS_MOCK[0], cantidad: 2, observaciones: 'Sin cebolla' },
    { ...PRODUCTOS_MOCK[10], cantidad: 2 }
  ], 'Cliente alérgico a mariscos', 'María González'),

  crearPedido(3, [
    { ...PRODUCTOS_MOCK[4], cantidad: 1 },
    { ...PRODUCTOS_MOCK[5], cantidad: 1 },
    { ...PRODUCTOS_MOCK[11], cantidad: 2 }
  ], '', 'Carlos Ruiz'),

  crearPedido(7, [
    { ...PRODUCTOS_MOCK[7], cantidad: 1, observaciones: 'Poco picante' },
    { ...PRODUCTOS_MOCK[13], cantidad: 1 },
    { ...PRODUCTOS_MOCK[16], cantidad: 1 }
  ], 'Mesa VIP', 'Ana Torres'),

  crearPedido(5, [
    { ...PRODUCTOS_MOCK[2], cantidad: 1 },
    { ...PRODUCTOS_MOCK[6], cantidad: 2 },
    { ...PRODUCTOS_MOCK[12], cantidad: 1 },
    { ...PRODUCTOS_MOCK[17], cantidad: 1 }
  ], '', 'Pedro López'),

  crearPedido(10, [
    { ...PRODUCTOS_MOCK[8], cantidad: 1 },
    { ...PRODUCTOS_MOCK[14], cantidad: 2 }
  ], 'Sin azúcar en postres', 'Luis Herrera')
];

// Actualizar estados de algunos pedidos para tener variedad
PEDIDOS_INICIALES[0].estado = 'En preparación';
PEDIDOS_INICIALES[0].items[0].estado = 'En preparación';
PEDIDOS_INICIALES[0].items[1].estado = 'Pendiente';
PEDIDOS_INICIALES[0].actualizadoEn = new Date(Date.now() - 15 * 60 * 1000).toISOString();

PEDIDOS_INICIALES[1].estado = 'Listo';
PEDIDOS_INICIALES[1].items.forEach(item => item.estado = 'Listo');
PEDIDOS_INICIALES[1].actualizadoEn = new Date(Date.now() - 5 * 60 * 1000).toISOString();

PEDIDOS_INICIALES[2].estado = 'Entregado';
PEDIDOS_INICIALES[2].items.forEach(item => item.estado = 'Entregado');
PEDIDOS_INICIALES[2].actualizadoEn = new Date(Date.now() - 60 * 60 * 1000).toISOString();

PEDIDOS_INICIALES[3].estado = 'Pendiente';
PEDIDOS_INICIALES[3].items.forEach(item => item.estado = 'Pendiente');

PEDIDOS_INICIALES[4].estado = 'Cancelado';
PEDIDOS_INICIALES[4].items.forEach(item => item.estado = 'Cancelado');
PEDIDOS_INICIALES[4].actualizadoEn = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

export const ESTADO_COLORES = {
  'Pendiente': { bg: '#FFF3E0', text: '#E65100', border: '#FFB74D' },
  'En preparación': { bg: '#E3F2FD', text: '#1565C0', border: '#64B5F6' },
  'Listo': { bg: '#E8F5E9', text: '#2E7D32', border: '#81C784' },
  'Entregado': { bg: '#F3E5F5', text: '#6A1B9A', border: '#BA68C8' },
  'Cancelado': { bg: '#FBE9E7', text: '#C62828', border: '#EF9A9A' }
};

export const ESTADO_ICONOS = {
  'Pendiente': '⏳',
  'En preparación': '👨‍🍳',
  'Listo': '✅',
  'Entregado': '📦',
  'Cancelado': '❌'
};

export const ESTADO_ORDEN = {
  'Pendiente': 1,
  'En preparación': 2,
  'Listo': 3,
  'Entregado': 4,
  'Cancelado': 5
};

export const SIGUIENTE_ESTADO = {
  'Pendiente': 'En preparación',
  'En preparación': 'Listo',
  'Listo': 'Entregado',
  'Entregado': 'Entregado',
  'Cancelado': 'Cancelado'
};

export const ESTADOS_ITEM_SIGUIENTE = {
  'Pendiente': 'En preparación',
  'En preparación': 'Listo',
  'Listo': 'Entregado',
  'Entregado': 'Entregado',
  'Cancelado': 'Cancelado'
};