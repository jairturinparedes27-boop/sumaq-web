// src/data/mesasMock.js
// Datos iniciales de prueba para el módulo Mesas
// Se usan como semilla la primera vez que se carga la app (luego persisten en IndexedDB)

export const mesasMock = [
  {
    id: 1,
    numero: '01',
    nombre: 'Mesa 01',
    capacidad: 4,
    zona: 'Salón Principal',
    estado: 'Disponible',
    posicion: { x: 1, y: 1 },
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 2,
    numero: '02',
    nombre: 'Mesa 02',
    capacidad: 2,
    zona: 'Salón Principal',
    estado: 'Ocupada',
    posicion: { x: 2, y: 1 },
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T12:30:00.000Z'
  },
  {
    id: 3,
    numero: '03',
    nombre: 'Mesa 03',
    capacidad: 4,
    zona: 'Salón Principal',
    estado: 'Disponible',
    posicion: { x: 3, y: 1 },
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 4,
    numero: '04',
    nombre: 'Mesa 04',
    capacidad: 6,
    zona: 'Salón Principal',
    estado: 'Reservada',
    posicion: { x: 4, y: 1 },
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T11:15:00.000Z'
  },
  {
    id: 5,
    numero: '05',
    nombre: 'Mesa 05',
    capacidad: 2,
    zona: 'Terraza',
    estado: 'Disponible',
    posicion: { x: 1, y: 2 },
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 6,
    numero: '06',
    nombre: 'Mesa 06',
    capacidad: 4,
    zona: 'Terraza',
    estado: 'Ocupada',
    posicion: { x: 2, y: 2 },
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T13:00:00.000Z'
  },
  {
    id: 7,
    numero: '07',
    nombre: 'Mesa 07',
    capacidad: 4,
    zona: 'Terraza',
    estado: 'Disponible',
    posicion: { x: 3, y: 2 },
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 8,
    numero: '08',
    nombre: 'Mesa 08',
    capacidad: 8,
    zona: 'Terraza',
    estado: 'Disponible',
    posicion: { x: 4, y: 2 },
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 9,
    numero: '09',
    nombre: 'Mesa 09',
    capacidad: 2,
    zona: 'Privado',
    estado: 'Reservada',
    posicion: { x: 1, y: 3 },
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T09:45:00.000Z'
  },
  {
    id: 10,
    numero: '10',
    nombre: 'Mesa 10',
    capacidad: 6,
    zona: 'Privado',
    estado: 'Disponible',
    posicion: { x: 2, y: 3 },
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 11,
    numero: '11',
    nombre: 'Mesa 11',
    capacidad: 10,
    zona: 'Privado',
    estado: 'Disponible',
    posicion: { x: 3, y: 3 },
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 12,
    numero: '12',
    nombre: 'Mesa 12',
    capacidad: 4,
    zona: 'Barra',
    estado: 'Ocupada',
    posicion: { x: 1, y: 4 },
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T13:30:00.000Z'
  },
  {
    id: 13,
    numero: '13',
    nombre: 'Mesa 13',
    capacidad: 2,
    zona: 'Barra',
    estado: 'Disponible',
    posicion: { x: 2, y: 4 },
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 14,
    numero: '14',
    nombre: 'Mesa 14',
    capacidad: 4,
    zona: 'Barra',
    estado: 'Disponible',
    posicion: { x: 3, y: 4 },
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 15,
    numero: '15',
    nombre: 'Mesa 15',
    capacidad: 2,
    zona: 'Barra',
    estado: 'Disponible',
    posicion: { x: 4, y: 4 },
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z'
  }
];

export const zonasDisponibles = [
  'Salón Principal',
  'Terraza',
  'Privado',
  'Barra'
];

export const estadosMesa = [
  'Disponible',
  'Ocupada',
  'Reservada'
];

export const capacidadesPermitidas = [2, 4, 6, 8, 10, 12];