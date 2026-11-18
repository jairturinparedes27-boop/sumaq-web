// src/data/productosMock.js
// Datos de prueba para el módulo Productos

// ========================================
// CATEGORÍAS INICIALES
// ========================================

const generarId = () => Date.now() + Math.random().toString(36).substr(2, 9);

export const CATEGORIAS_INICIALES = [
  { id: generarId(), nombre: 'Anticuchos', descripcion: 'Anticuchos tradicionales', orden: 1, activa: true },
  { id: generarId(), nombre: 'Brochetas de pollo', descripcion: 'Brochetas de pollo a la parrilla', orden: 2, activa: true },
  { id: generarId(), nombre: 'Chorizos', descripcion: 'Chorizos artesanales', orden: 3, activa: true },
  { id: generarId(), nombre: 'Carnes', descripcion: 'Cortes de carne a la parrilla', orden: 4, activa: true },
  { id: generarId(), nombre: 'Acompañamientos', descripcion: 'Guarniciones y acompañamientos', orden: 5, activa: true },
  { id: generarId(), nombre: 'Bebidas', descripcion: 'Bebidas frías y calientes', orden: 6, activa: true }
];

// ========================================
// PRODUCTOS INICIALES
// ========================================

const crearProducto = (categoriaNombre, overrides = {}) => {
  const categoria = CATEGORIAS_INICIALES.find(c => c.nombre === categoriaNombre);
  return {
    id: generarId(),
    codigo: overrides.codigo || `PRD-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    nombre: overrides.nombre || 'Producto',
    categoriaId: categoria?.id || '',
    categoriaNombre: categoriaNombre,
    descripcion: overrides.descripcion || '',
    precioVenta: overrides.precioVenta || 0,
    imagen: overrides.imagen || '',
    estado: overrides.estado || 'Activo', // 'Activo' | 'Inactivo'
    disponible: overrides.disponible !== false, // boolean
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString()
  };
};

export const PRODUCTOS_INICIALES = [
  // Anticuchos
  crearProducto('Anticuchos', { codigo: 'ANT001', nombre: 'Anticucho Clásico', descripcion: 'Corazón de res marinado en ají panca, vinagre y especias, acompañado de papa sancochada y choclo', precioVenta: 18.00, imagen: '🍢' }),
  crearProducto('Anticuchos', { codigo: 'ANT002', nombre: 'Anticucho de Pollo', descripcion: 'Pechuga de pollo marinada en ají panca, acompañada de papa y choclo', precioVenta: 15.00, imagen: '🍗' }),
  crearProducto('Anticuchos', { codigo: 'ANT003', nombre: 'Anticucho Mixto', descripcion: 'Combinación de corazón de res y pollo, con papa dorada y choclo', precioVenta: 20.00, imagen: '🍢🍗' }),

  // Brochetas de pollo
  crearProducto('Brochetas de pollo', { codigo: 'BRP001', nombre: 'Brocheta de Pollo Clásica', descripcion: 'Cubos de pollo marinados en especias peruanas, pimiento, cebolla y tomate cherry', precioVenta: 16.00, imagen: '🍡' }),
  crearProducto('Brochetas de pollo', { codigo: 'BRP002', nombre: 'Brocheta de Pollo con Piña', descripcion: 'Pollo marinado con trozos de piña caramelizada, pimiento y cebolla', precioVenta: 17.00, imagen: '🍡🍍' }),
  crearProducto('Brochetas de pollo', { codigo: 'BRP003', nombre: 'Brocheta Especial', descripcion: 'Pollo, chorizo, pimiento, cebolla, tomate y champiñones', precioVenta: 19.00, imagen: '🍡🌭' }),

  // Chorizos
  crearProducto('Chorizos', { codigo: 'CHO001', nombre: 'Chorizo Artesanal', descripcion: 'Chorizo de cerdo artesanal a la parrilla, servido con papa dorada', precioVenta: 14.00, imagen: '🌭' }),
  crearProducto('Chorizos', { codigo: 'CHO002', nombre: 'Chorizo con Chimichurri', descripcion: 'Chorizo a la parrilla con salsa chimichurri casera y papa', precioVenta: 15.50, imagen: '🌭🌿' }),
  crearProducto('Chorizos', { codigo: 'CHO003', nombre: 'Choripan Completo', descripcion: 'Chorizo en pan francés con chimichurri, salsa criolla y papas fritas', precioVenta: 18.00, imagen: '🌭🥖' }),

  // Carnes
  crearProducto('Carnes', { codigo: 'CAR001', nombre: 'Bife de Chorizo', descripcion: 'Corte premium de 300g a la parrilla, punto al gusto, con papas fritas', precioVenta: 35.00, imagen: '🥩' }),
  crearProducto('Carnes', { codigo: 'CAR002', nombre: 'Lomo Saltado', descripcion: 'Tiras de lomo fino salteado con cebolla, tomate, ají amarillo, papas fritas y arroz', precioVenta: 28.00, imagen: '🥘' }),
  crearProducto('Carnes', { codigo: 'CAR003', nombre: 'Churrasco a lo Pobre', descripcion: 'Bistec a la plancha con huevo frito, plátano, papas fritas y arroz', precioVenta: 32.00, imagen: '🥩🍳' }),
  crearProducto('Carnes', { codigo: 'CAR004', nombre: 'Parrillada para 2', descripcion: 'Bife, chorizo, anticucho, morcilla, papas, choclo, yuca y ensalada', precioVenta: 65.00, imagen: '🥩🌭🍢' }),

  // Acompañamientos
  crearProducto('Acompañamientos', { codigo: 'ACO001', nombre: 'Papas Fritas', descripcion: 'Papas fritas caseras crujientes', precioVenta: 8.00, imagen: '🍟' }),
  crearProducto('Acompañamientos', { codigo: 'ACO002', nombre: 'Yuca Frita', descripcion: 'Yuca dorada crocante con salsa huancaína', precioVenta: 10.00, imagen: '🍠' }),
  crearProducto('Acompañamientos', { codigo: 'ACO003', nombre: 'Ensalada Criolla', descripcion: 'Cebolla roja, tomate, ají, limón y culantro', precioVenta: 7.00, imagen: '🥗' }),
  crearProducto('Acompañamientos', { codigo: 'ACO004', nombre: 'Choclo con Queso', descripcion: 'Choclo tierno con queso fresco', precioVenta: 9.00, imagen: '🌽🧀' }),
  crearProducto('Acompañamientos', { codigo: 'ACO005', nombre: 'Arroz Blanco', descripcion: 'Arroz graneado tradicional', precioVenta: 5.00, imagen: '🍚' }),

  // Bebidas
  crearProducto('Bebidas', { codigo: 'BEB001', nombre: 'Chicha Morada', descripcion: 'Bebida tradicional de maíz morado con piña y canela', precioVenta: 6.00, imagen: '🍷' }),
  crearProducto('Bebidas', { codigo: 'BEB002', nombre: 'Inca Kola', descripcion: 'Gaseosa sabor a hierba luisa', precioVenta: 5.00, imagen: '🥤' }),
  crearProducto('Bebidas', { codigo: 'BEB003', nombre: 'Cerveza Cusqueña', descripcion: 'Cerveza rubia peruana 330ml', precioVenta: 8.00, imagen: '🍺' }),
  crearProducto('Bebidas', { codigo: 'BEB004', nombre: 'Limonada', descripcion: 'Limonada natural con hierbabuena', precioVenta: 5.00, imagen: '🍋' }),
  crearProducto('Bebidas', { codigo: 'BEB005', nombre: 'Agua Mineral', descripcion: 'Agua mineral sin gas 500ml', precioVenta: 3.00, imagen: '💧' }),
  crearProducto('Bebidas', { codigo: 'BEB006', nombre: 'Pisco Sour', descripcion: 'Cóctel de pisco, limón, jarabe de goma y clara de huevo', precioVenta: 15.00, imagen: '🍸' })
];

// ========================================
// CONSTANTES
// ========================================

export const ESTADOS_PRODUCTO = ['Activo', 'Inactivo'];
export const UNIDADES_MEDIDA = ['kg', 'g', 'L', 'ml', 'unidades', 'paquetes', 'docenas'];

export const CATEGORIA_COLORES = {
  'Anticuchos': { bg: '#FFF3E0', text: '#E65100', border: '#FFB74D' },
  'Brochetas de pollo': { bg: '#F3E5F5', text: '#6A1B9A', border: '#BA68C8' },
  'Chorizos': { bg: '#FBE9E7', text: '#BF360C', border: '#FF8A65' },
  'Carnes': { bg: '#EFEBE9', text: '#3E2723', border: '#A1887F' },
  'Acompañamientos': { bg: '#E8F5E9', text: '#1B5E20', border: '#81C784' },
  'Bebidas': { bg: '#E3F2FD', text: '#0D47A1', border: '#64B5F6' }
};

export const ESTADO_COLORES = {
  'Activo': { bg: '#E8F5E9', text: '#2E7D32', border: '#81C784' },
  'Inactivo': { bg: '#FBE9E7', text: '#C62828', border: '#EF9A9A' }
};

export const ICONOS_CATEGORIA = {
  'Anticuchos': '🍢',
  'Brochetas de pollo': '🍡',
  'Chorizos': '🌭',
  'Carnes': '🥩',
  'Acompañamientos': '🍟',
  'Bebidas': '🥤'
};