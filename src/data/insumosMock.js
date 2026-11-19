// src/data/insumosMock.js
// Datos de prueba para el módulo Insumos e Inventario

// ========================================
// GENERADOR DE IDs
// ========================================
const generarId = () => Date.now() + Math.random().toString(36).substr(2, 9);

// ========================================
// CATEGORÍAS DE INSUMOS
// ========================================
export const CATEGORIAS_INSUMO = [
  { id: generarId(), nombre: 'Carnes y Pescados', descripcion: 'Proteínas animales frescas y congeladas', orden: 1, activa: true, color: '#BF360C' },
  { id: generarId(), nombre: 'Verduras y Hortalizas', descripcion: 'Vegetales frescos', orden: 2, activa: true, color: '#2E7D32' },
  { id: generarId(), nombre: 'Frutas', descripcion: 'Frutas frescas y congeladas', orden: 3, activa: true, color: '#E65100' },
  { id: generarId(), nombre: 'Lácteos y Huevos', descripcion: 'Productos lácteos y huevos', orden: 4, activa: true, color: '#0D47A1' },
  { id: generarId(), nombre: 'Granos y Cereales', descripcion: 'Arroz, menestras, harinas', orden: 5, activa: true, color: '#F57F17' },
  { id: generarId(), nombre: 'Condimentos y Especias', descripcion: 'Especias, ajíes, aderezos', orden: 6, activa: true, color: '#3E2723' },
  { id: generarId(), nombre: 'Aceites y Grasas', descripcion: 'Aceites vegetales, manteca', orden: 7, activa: true, color: '#F9A825' },
  { id: generarId(), nombre: 'Bebidas', descripcion: 'Refrescos, jugos, aguas, alcoholes', orden: 8, activa: true, color: '#1565C0' },
  { id: generarId(), nombre: 'Limpieza e Higiene', descripcion: 'Detergentes, sanitizantes, papel', orden: 9, activa: true, color: '#455A64' },
  { id: generarId(), nombre: 'Desechables y Empaques', descripcion: 'Servilletas, vasos, cajas, bolsas', orden: 10, activa: true, color: '#616161' }
];

// ========================================
// UNIDADES DE MEDIDA
// ========================================
export const UNIDADES_MEDIDA = [
  { valor: 'kg', etiqueta: 'Kilogramos (kg)', tipo: 'peso' },
  { valor: 'g', etiqueta: 'Gramos (g)', tipo: 'peso' },
  { valor: 'L', etiqueta: 'Litros (L)', tipo: 'volumen' },
  { valor: 'ml', etiqueta: 'Mililitros (ml)', tipo: 'volumen' },
  { valor: 'unidades', etiqueta: 'Unidades (und)', tipo: 'conteo' },
  { valor: 'paquetes', etiqueta: 'Paquetes (paq)', tipo: 'conteo' },
  { valor: 'docenas', etiqueta: 'Docenas (doc)', tipo: 'conteo' },
  { valor: 'cajas', etiqueta: 'Cajas (cja)', tipo: 'conteo' },
  { valor: 'bolsas', etiqueta: 'Bolsas (bol)', tipo: 'conteo' },
  { valor: 'latas', etiqueta: 'Latas (lat)', tipo: 'conteo' }
];

// ========================================
// PROVEEDORES
// ========================================
export const PROVEEDORES_INICIALES = [
  { id: generarId(), nombre: 'Distribuidora Andina SAC', ruc: '20123456789', telefono: '01-4567890', email: 'ventas@andina.com', direccion: 'Av. Industrial 123, Lima', activo: true },
  { id: generarId(), nombre: 'Frigorífico El Porvenir', ruc: '20234567890', telefono: '01-5678901', email: 'pedidos@elporvenir.pe', direccion: 'Jr. Carnes 456, Lima', activo: true },
  { id: generarId(), nombre: 'Granja Santa Rosa', ruc: '20345678901', telefono: '01-6789012', email: 'contacto@santarosa.pe', direccion: 'Carretera Central Km 25', activo: true },
  { id: generarId(), nombre: 'Mayorista La Economía', ruc: '20456789012', telefono: '01-7890123', email: 'ventas@laeconomia.pe', direccion: 'Mercado Central, Piso 2', activo: true },
  { id: generarId(), nombre: 'Bebidas del Sur SAC', ruc: '20567890123', telefono: '01-8901234', email: 'pedidos@bebidassur.pe', direccion: 'Av. Bebidas 789, Lima', activo: true },
  { id: generarId(), nombre: 'Limpieza Total EIRL', ruc: '20678901234', telefono: '01-9012345', email: 'ventas@limpiezatotal.pe', direccion: 'Jr. Aseo 321, Lima', activo: true },
  { id: generarId(), nombre: 'Empaques Perú SAC', ruc: '20789012345', telefono: '01-0123456', email: 'contacto@empaquesperu.pe', direccion: 'Av. Packaging 654, Lima', activo: true }
];

// ========================================
// ESTADOS DE INSUMO
// ========================================
export const ESTADOS_INSUMO = ['Activo', 'Inactivo', 'Agotado', 'Descontinuado'];

// ========================================
// TIPOS DE MOVIMIENTO
// ========================================
export const TIPOS_MOVIMIENTO = {
  ENTRADA_COMPRA: { clave: 'entrada_compra', label: '📥 Entrada por Compra', signo: '+', color: '#2E7D32' },
  ENTRADA_AJUSTE: { clave: 'entrada_ajuste', label: '📈 Entrada por Ajuste', signo: '+', color: '#1565C0' },
  ENTRADA_DEVOLUCION: { clave: 'entrada_devolucion', label: '↩️ Devolución', signo: '+', color: '#0288D1' },
  SALIDA_CONSUMO: { clave: 'salida_consumo', label: '🍳 Salida por Consumo (Receta)', signo: '-', color: '#C62828' },
  SALIDA_MANUAL: { clave: 'salida_manual', label: '📤 Salida Manual', signo: '-', color: '#D84315' },
  SALIDA_MERMA: { clave: 'salida_merma', label: '🗑️ Merma / Pérdida', signo: '-', color: '#BF360C' },
  SALIDA_TRANSFERENCIA: { clave: 'salida_transferencia', label: '🔄 Transferencia', signo: '-', color: '#6A1B9A' }
};

// ========================================
// MOTIVOS DE MERMA
// ========================================
export const MOTIVOS_MERMA = [
  'Caducado / Vencido',
  'Dañado / Golpeado',
  'Descompuesto / Podrido',
  'Quemado / Sobrecocido',
  'Derrame / Fuga',
  'Contaminado',
  'Robo / Hurto',
  'Error de preparación',
  'Muestra / Degustación',
  'Otro'
];

// ========================================
// INSUMOS INICIALES
// ========================================
const crearInsumo = (categoriaNombre, overrides = {}) => {
  const categoria = CATEGORIAS_INSUMO.find(c => c.nombre === categoriaNombre);
  const proveedor = PROVEEDORES_INICIALES[Math.floor(Math.random() * PROVEEDORES_INICIALES.length)];
  return {
    id: generarId(),
    codigo: overrides.codigo || `INS-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    nombre: overrides.nombre || 'Insumo',
    categoriaId: categoria?.id || '',
    categoriaNombre: categoriaNombre,
    unidadMedida: overrides.unidadMedida || 'kg',
    stockActual: overrides.stockActual || 0,
    stockMinimo: overrides.stockMinimo || 0,
    precioCompra: overrides.precioCompra || 0,
    proveedorId: overrides.proveedorId || proveedor?.id || '',
    proveedorNombre: proveedor?.nombre || '',
    estado: overrides.estado || 'Activo',
    fechaRegistro: overrides.fechaRegistro || new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
    // Campos para control de recetas
    permiteStockNegativo: overrides.permiteStockNegativo || false
  };
};

export const INSUMOS_INICIALES = [
  // Carnes y Pescados
  crearInsumo('Carnes y Pescados', { codigo: 'CAR001', nombre: 'Corazón de Res', unidadMedida: 'kg', stockActual: 25.5, stockMinimo: 5, precioCompra: 32.00, proveedorId: PROVEEDORES_INICIALES[1].id, proveedorNombre: PROVEEDORES_INICIALES[1].nombre }),
  crearInsumo('Carnes y Pescados', { codigo: 'CAR002', nombre: 'Pechuga de Pollo', unidadMedida: 'kg', stockActual: 40.0, stockMinimo: 8, precioCompra: 18.50, proveedorId: PROVEEDORES_INICIALES[2].id, proveedorNombre: PROVEEDORES_INICIALES[2].nombre }),
  crearInsumo('Carnes y Pescados', { codigo: 'CAR003', nombre: 'Chorizo Artesanal', unidadMedida: 'kg', stockActual: 15.0, stockMinimo: 3, precioCompra: 22.00, proveedorId: PROVEEDORES_INICIALES[1].id, proveedorNombre: PROVEEDORES_INICIALES[1].nombre }),
  crearInsumo('Carnes y Pescados', { codigo: 'CAR004', nombre: 'Lomo Fino', unidadMedida: 'kg', stockActual: 12.0, stockMinimo: 2, precioCompra: 55.00, proveedorId: PROVEEDORES_INICIALES[1].id, proveedorNombre: PROVEEDORES_INICIALES[1].nombre }),
  crearInsumo('Carnes y Pescados', { codigo: 'CAR005', nombre: 'Pescado Fresco (Corvina)', unidadMedida: 'kg', stockActual: 8.0, stockMinimo: 3, precioCompra: 45.00, proveedorId: PROVEEDORES_INICIALES[0].id, proveedorNombre: PROVEEDORES_INICIALES[0].nombre }),

  // Verduras y Hortalizas
  crearInsumo('Verduras y Hortalizas', { codigo: 'VER001', nombre: 'Papa Amarilla', unidadMedida: 'kg', stockActual: 50.0, stockMinimo: 15, precioCompra: 3.50, proveedorId: PROVEEDORES_INICIALES[3].id, proveedorNombre: PROVEEDORES_INICIALES[3].nombre }),
  crearInsumo('Verduras y Hortalizas', { codigo: 'VER002', nombre: 'Cebolla Roja', unidadMedida: 'kg', stockActual: 30.0, stockMinimo: 8, precioCompra: 4.00, proveedorId: PROVEEDORES_INICIALES[3].id, proveedorNombre: PROVEEDORES_INICIALES[3].nombre }),
  crearInsumo('Verduras y Hortalizas', { codigo: 'VER003', nombre: 'Tomate', unidadMedida: 'kg', stockActual: 20.0, stockMinimo: 5, precioCompra: 5.50, proveedorId: PROVEEDORES_INICIALES[3].id, proveedorNombre: PROVEEDORES_INICIALES[3].nombre }),
  crearInsumo('Verduras y Hortalizas', { codigo: 'VER004', nombre: 'Ají Amarillo', unidadMedida: 'kg', stockActual: 5.0, stockMinimo: 2, precioCompra: 12.00, proveedorId: PROVEEDORES_INICIALES[0].id, proveedorNombre: PROVEEDORES_INICIALES[0].nombre }),
  crearInsumo('Verduras y Hortalizas', { codigo: 'VER005', nombre: 'Ají Panca', unidadMedida: 'kg', stockActual: 4.0, stockMinimo: 1, precioCompra: 15.00, proveedorId: PROVEEDORES_INICIALES[0].id, proveedorNombre: PROVEEDORES_INICIALES[0].nombre }),
  crearInsumo('Verduras y Hortalizas', { codigo: 'VER006', nombre: 'Choclo', unidadMedida: 'unidades', stockActual: 60, stockMinimo: 20, precioCompra: 1.20, proveedorId: PROVEEDORES_INICIALES[3].id, proveedorNombre: PROVEEDORES_INICIALES[3].nombre }),
  crearInsumo('Verduras y Hortalizas', { codigo: 'VER007', nombre: 'Pimiento Rojo', unidadMedida: 'kg', stockActual: 10.0, stockMinimo: 3, precioCompra: 8.00, proveedorId: PROVEEDORES_INICIALES[3].id, proveedorNombre: PROVEEDORES_INICIALES[3].nombre }),
  crearInsumo('Verduras y Hortalizas', { codigo: 'VER008', nombre: 'Culantro Fresco', unidadMedida: 'paquetes', stockActual: 15, stockMinimo: 5, precioCompra: 2.50, proveedorId: PROVEEDORES_INICIALES[3].id, proveedorNombre: PROVEEDORES_INICIALES[3].nombre }),

  // Frutas
  crearInsumo('Frutas', { codigo: 'FRU001', nombre: 'Limón Sutil', unidadMedida: 'kg', stockActual: 15.0, stockMinimo: 5, precioCompra: 6.00, proveedorId: PROVEEDORES_INICIALES[3].id, proveedorNombre: PROVEEDORES_INICIALES[3].nombre }),
  crearInsumo('Frutas', { codigo: 'FRU002', nombre: 'Piña Golden', unidadMedida: 'unidades', stockActual: 20, stockMinimo: 5, precioCompra: 4.50, proveedorId: PROVEEDORES_INICIALES[3].id, proveedorNombre: PROVEEDORES_INICIALES[3].nombre }),

  // Lácteos y Huevos
  crearInsumo('Lácteos y Huevos', { codigo: 'LAC001', nombre: 'Huevos', unidadMedida: 'docenas', stockActual: 30, stockMinimo: 10, precioCompra: 8.00, proveedorId: PROVEEDORES_INICIALES[2].id, proveedorNombre: PROVEEDORES_INICIALES[2].nombre }),
  crearInsumo('Lácteos y Huevos', { codigo: 'LAC002', nombre: 'Leche Evaporada', unidadMedida: 'latas', stockActual: 48, stockMinimo: 12, precioCompra: 3.50, proveedorId: PROVEEDORES_INICIALES[0].id, proveedorNombre: PROVEEDORES_INICIALES[0].nombre }),
  crearInsumo('Lácteos y Huevos', { codigo: 'LAC003', nombre: 'Queso Fresco', unidadMedida: 'kg', stockActual: 8.0, stockMinimo: 2, precioCompra: 28.00, proveedorId: PROVEEDORES_INICIALES[2].id, proveedorNombre: PROVEEDORES_INICIALES[2].nombre }),

  // Granos y Cereales
  crearInsumo('Granos y Cereales', { codigo: 'GRA001', nombre: 'Arroz Blanco', unidadMedida: 'kg', stockActual: 100.0, stockMinimo: 25, precioCompra: 3.80, proveedorId: PROVEEDORES_INICIALES[3].id, proveedorNombre: PROVEEDORES_INICIALES[3].nombre }),
  crearInsumo('Granos y Cereales', { codigo: 'GRA002', nombre: 'Frijol Canario', unidadMedida: 'kg', stockActual: 20.0, stockMinimo: 5, precioCompra: 7.50, proveedorId: PROVEEDORES_INICIALES[3].id, proveedorNombre: PROVEEDORES_INICIALES[3].nombre }),
  crearInsumo('Granos y Cereales', { codigo: 'GRA003', nombre: 'Harina de Trigo', unidadMedida: 'kg', stockActual: 25.0, stockMinimo: 5, precioCompra: 2.80, proveedorId: PROVEEDORES_INICIALES[3].id, proveedorNombre: PROVEEDORES_INICIALES[3].nombre }),
  crearInsumo('Granos y Cereales', { codigo: 'GRA004', nombre: 'Fideo Cabello de Ángel', unidadMedida: 'paquetes', stockActual: 40, stockMinimo: 10, precioCompra: 2.50, proveedorId: PROVEEDORES_INICIALES[0].id, proveedorNombre: PROVEEDORES_INICIALES[0].nombre }),

  // Condimentos y Especias
  crearInsumo('Condimentos y Especias', { codigo: 'CON001', nombre: 'Sal', unidadMedida: 'kg', stockActual: 10.0, stockMinimo: 2, precioCompra: 1.50, proveedorId: PROVEEDORES_INICIALES[0].id, proveedorNombre: PROVEEDORES_INICIALES[0].nombre }),
  crearInsumo('Condimentos y Especias', { codigo: 'CON002', nombre: 'Pimienta Negra', unidadMedida: 'kg', stockActual: 2.0, stockMinimo: 0.5, precioCompra: 45.00, proveedorId: PROVEEDORES_INICIALES[0].id, proveedorNombre: PROVEEDORES_INICIALES[0].nombre }),
  crearInsumo('Condimentos y Especias', { codigo: 'CON003', nombre: 'Comino', unidadMedida: 'kg', stockActual: 1.5, stockMinimo: 0.3, precioCompra: 35.00, proveedorId: PROVEEDORES_INICIALES[0].id, proveedorNombre: PROVEEDORES_INICIALES[0].nombre }),
  crearInsumo('Condimentos y Especias', { codigo: 'CON004', nombre: 'Vinagre de Vino', unidadMedida: 'L', stockActual: 5.0, stockMinimo: 1, precioCompra: 8.00, proveedorId: PROVEEDORES_INICIALES[0].id, proveedorNombre: PROVEEDORES_INICIALES[0].nombre }),
  crearInsumo('Condimentos y Especias', { codigo: 'CON005', nombre: 'Salsa de Soya', unidadMedida: 'L', stockActual: 3.0, stockMinimo: 1, precioCompra: 12.00, proveedorId: PROVEEDORES_INICIALES[0].id, proveedorNombre: PROVEEDORES_INICIALES[0].nombre }),

  // Aceites y Grasas
  crearInsumo('Aceites y Grasas', { codigo: 'ACE001', nombre: 'Aceite Vegetal', unidadMedida: 'L', stockActual: 20.0, stockMinimo: 5, precioCompra: 14.00, proveedorId: PROVEEDORES_INICIALES[0].id, proveedorNombre: PROVEEDORES_INICIALES[0].nombre }),
  crearInsumo('Aceites y Grasas', { codigo: 'ACE002', nombre: 'Manteca', unidadMedida: 'kg', stockActual: 5.0, stockMinimo: 1, precioCompra: 18.00, proveedorId: PROVEEDORES_INICIALES[2].id, proveedorNombre: PROVEEDORES_INICIALES[2].nombre }),

  // Bebidas
  crearInsumo('Bebidas', { codigo: 'BEB001', nombre: 'Chicha Morada Concentrada', unidadMedida: 'L', stockActual: 10.0, stockMinimo: 3, precioCompra: 12.00, proveedorId: PROVEEDORES_INICIALES[4].id, proveedorNombre: PROVEEDORES_INICIALES[4].nombre }),
  crearInsumo('Bebidas', { codigo: 'BEB002', nombre: 'Inca Kola 2L', unidadMedida: 'unidades', stockActual: 48, stockMinimo: 12, precioCompra: 5.50, proveedorId: PROVEEDORES_INICIALES[4].id, proveedorNombre: PROVEEDORES_INICIALES[4].nombre }),
  crearInsumo('Bebidas', { codigo: 'BEB003', nombre: 'Cerveza Cusqueña 330ml', unidadMedida: 'unidades', stockActual: 96, stockMinimo: 24, precioCompra: 4.00, proveedorId: PROVEEDORES_INICIALES[4].id, proveedorNombre: PROVEEDORES_INICIALES[4].nombre }),
  crearInsumo('Bebidas', { codigo: 'BEB004', nombre: 'Agua Mineral 500ml', unidadMedida: 'unidades', stockActual: 100, stockMinimo: 30, precioCompra: 1.20, proveedorId: PROVEEDORES_INICIALES[4].id, proveedorNombre: PROVEEDORES_INICIALES[4].nombre }),

  // Limpieza e Higiene
  crearInsumo('Limpieza e Higiene', { codigo: 'LIM001', nombre: 'Detergente Líquido 5L', unidadMedida: 'unidades', stockActual: 8, stockMinimo: 2, precioCompra: 25.00, proveedorId: PROVEEDORES_INICIALES[5].id, proveedorNombre: PROVEEDORES_INICIALES[5].nombre }),
  crearInsumo('Limpieza e Higiene', { codigo: 'LIM002', nombre: 'Sanitizante Superficies 1L', unidadMedida: 'unidades', stockActual: 12, stockMinimo: 3, precioCompra: 18.00, proveedorId: PROVEEDORES_INICIALES[5].id, proveedorNombre: PROVEEDORES_INICIALES[5].nombre }),
  crearInsumo('Limpieza e Higiene', { codigo: 'LIM003', nombre: 'Papel Higiénico (Pack 4)', unidadMedida: 'paquetes', stockActual: 20, stockMinimo: 5, precioCompra: 12.00, proveedorId: PROVEEDORES_INICIALES[5].id, proveedorNombre: PROVEEDORES_INICIALES[5].nombre }),

  // Desechables y Empaques
  crearInsumo('Desechables y Empaques', { codigo: 'DES001', nombre: 'Servilletas Dispensador (Pack 250)', unidadMedida: 'paquetes', stockActual: 30, stockMinimo: 8, precioCompra: 8.00, proveedorId: PROVEEDORES_INICIALES[6].id, proveedorNombre: PROVEEDORES_INICIALES[6].nombre }),
  crearInsumo('Desechables y Empaques', { codigo: 'DES002', nombre: 'Vasos Desechables 350ml (Pack 50)', unidadMedida: 'paquetes', stockActual: 25, stockMinimo: 6, precioCompra: 15.00, proveedorId: PROVEEDORES_INICIALES[6].id, proveedorNombre: PROVEEDORES_INICIALES[6].nombre }),
  crearInsumo('Desechables y Empaques', { codigo: 'DES003', nombre: 'Cajas Para Llevar Medianas (Pack 25)', unidadMedida: 'paquetes', stockActual: 15, stockMinimo: 4, precioCompra: 22.00, proveedorId: PROVEEDORES_INICIALES[6].id, proveedorNombre: PROVEEDORES_INICIALES[6].nombre }),
  crearInsumo('Desechables y Empaques', { codigo: 'DES004', nombre: 'Bolsas Plásticas (Pack 100)', unidadMedida: 'paquetes', stockActual: 20, stockMinimo: 5, precioCompra: 10.00, proveedorId: PROVEEDORES_INICIALES[6].id, proveedorNombre: PROVEEDORES_INICIALES[6].nombre })
];

// ========================================
// RECETAS INICIALES (Relación Producto - Insumo)
// ========================================
// Estructura: cada receta vincula un producto del menú con insumos y cantidades
export const RECETAS_INICIALES = [
  // Anticucho Clásico (ANT001)
  { id: generarId(), productoId: '', productoCodigo: 'ANT001', productoNombre: 'Anticucho Clásico', insumos: [
    { insumoId: '', insumoCodigo: 'CAR001', insumoNombre: 'Corazón de Res', cantidad: 0.25, unidadMedida: 'kg' },
    { insumoId: '', insumoCodigo: 'VER006', insumoNombre: 'Choclo', cantidad: 1, unidadMedida: 'unidades' },
    { insumoId: '', insumoCodigo: 'VER001', insumoNombre: 'Papa Amarilla', cantidad: 0.15, unidadMedida: 'kg' },
    { insumoId: '', insumoCodigo: 'CON004', insumoNombre: 'Vinagre de Vino', cantidad: 0.03, unidadMedida: 'L' },
    { insumoId: '', insumoCodigo: 'CON005', insumoNombre: 'Salsa de Soya', cantidad: 0.03, unidadMedida: 'L' },
    { insumoId: '', insumoCodigo: 'ACE001', insumoNombre: 'Aceite Vegetal', cantidad: 0.02, unidadMedida: 'L' },
    { insumoId: '', insumoCodigo: 'CON001', insumoNombre: 'Sal', cantidad: 0.005, unidadMedida: 'kg' },
    { insumoId: '', insumoCodigo: 'CON002', insumoNombre: 'Pimienta Negra', cantidad: 0.001, unidadMedida: 'kg' },
    { insumoId: '', insumoCodigo: 'VER005', insumoNombre: 'Ají Panca', cantidad: 0.03, unidadMedida: 'kg' }
  ]},
  // Anticucho de Pollo (ANT002)
  { id: generarId(), productoId: '', productoCodigo: 'ANT002', productoNombre: 'Anticucho de Pollo', insumos: [
    { insumoId: '', insumoCodigo: 'CAR002', insumoNombre: 'Pechuga de Pollo', cantidad: 0.20, unidadMedida: 'kg' },
    { insumoId: '', insumoCodigo: 'VER006', insumoNombre: 'Choclo', cantidad: 1, unidadMedida: 'unidades' },
    { insumoId: '', insumoCodigo: 'VER001', insumoNombre: 'Papa Amarilla', cantidad: 0.15, unidadMedida: 'kg' },
    { insumoId: '', insumoCodigo: 'CON004', insumoNombre: 'Vinagre de Vino', cantidad: 0.03, unidadMedida: 'L' },
    { insumoId: '', insumoCodigo: 'ACE001', insumoNombre: 'Aceite Vegetal', cantidad: 0.02, unidadMedida: 'L' },
    { insumoId: '', insumoCodigo: 'VER005', insumoNombre: 'Ají Panca', cantidad: 0.03, unidadMedida: 'kg' }
  ]},
  // Brocheta de Pollo Clásica (BRP001)
  { id: generarId(), productoId: '', productoCodigo: 'BRP001', productoNombre: 'Brocheta de Pollo Clásica', insumos: [
    { insumoId: '', insumoCodigo: 'CAR002', insumoNombre: 'Pechuga de Pollo', cantidad: 0.20, unidadMedida: 'kg' },
    { insumoId: '', insumoCodigo: 'VER007', insumoNombre: 'Pimiento Rojo', cantidad: 0.05, unidadMedida: 'kg' },
    { insumoId: '', insumoCodigo: 'VER002', insumoNombre: 'Cebolla Roja', cantidad: 0.05, unidadMedida: 'kg' },
    { insumoId: '', insumoCodigo: 'VER003', insumoNombre: 'Tomate', cantidad: 0.03, unidadMedida: 'kg' },
    { insumoId: '', insumoCodigo: 'ACE001', insumoNombre: 'Aceite Vegetal', cantidad: 0.015, unidadMedida: 'L' },
    { insumoId: '', insumoCodigo: 'CON001', insumoNombre: 'Sal', cantidad: 0.005, unidadMedida: 'kg' }
  ]},
  // Chorizo Artesanal (CHO001)
  { id: generarId(), productoId: '', productoCodigo: 'CHO001', productoNombre: 'Chorizo Artesanal', insumos: [
    { insumoId: '', insumoCodigo: 'CAR003', insumoNombre: 'Chorizo Artesanal', cantidad: 0.20, unidadMedida: 'kg' },
    { insumoId: '', insumoCodigo: 'VER001', insumoNombre: 'Papa Amarilla', cantidad: 0.15, unidadMedida: 'kg' }
  ]},
  // Bife de Chorizo (CAR001)
  { id: generarId(), productoId: '', productoCodigo: 'CAR001', productoNombre: 'Bife de Chorizo', insumos: [
    { insumoId: '', insumoCodigo: 'CAR004', insumoNombre: 'Lomo Fino', cantidad: 0.30, unidadMedida: 'kg' },
    { insumoId: '', insumoCodigo: 'VER001', insumoNombre: 'Papa Amarilla', cantidad: 0.20, unidadMedida: 'kg' },
    { insumoId: '', insumoCodigo: 'ACE001', insumoNombre: 'Aceite Vegetal', cantidad: 0.02, unidadMedida: 'L' },
    { insumoId: '', insumoCodigo: 'CON001', insumoNombre: 'Sal', cantidad: 0.005, unidadMedida: 'kg' }
  ]},
  // Lomo Saltado (CAR002)
  { id: generarId(), productoId: '', productoCodigo: 'CAR002', productoNombre: 'Lomo Saltado', insumos: [
    { insumoId: '', insumoCodigo: 'CAR004', insumoNombre: 'Lomo Fino', cantidad: 0.20, unidadMedida: 'kg' },
    { insumoId: '', insumoCodigo: 'VER002', insumoNombre: 'Cebolla Roja', cantidad: 0.08, unidadMedida: 'kg' },
    { insumoId: '', insumoCodigo: 'VER003', insumoNombre: 'Tomate', cantidad: 0.05, unidadMedida: 'kg' },
    { insumoId: '', insumoCodigo: 'VER004', insumoNombre: 'Ají Amarillo', cantidad: 0.02, unidadMedida: 'kg' },
    { insumoId: '', insumoCodigo: 'VER001', insumoNombre: 'Papa Amarilla', cantidad: 0.15, unidadMedida: 'kg' },
    { insumoId: '', insumoCodigo: 'GRA001', insumoNombre: 'Arroz Blanco', cantidad: 0.10, unidadMedida: 'kg' },
    { insumoId: '', insumoCodigo: 'ACE001', insumoNombre: 'Aceite Vegetal', cantidad: 0.03, unidadMedida: 'L' },
    { insumoId: '', insumoCodigo: 'CON005', insumoNombre: 'Salsa de Soya', cantidad: 0.02, unidadMedida: 'L' },
    { insumoId: '', insumoCodigo: 'CON001', insumoNombre: 'Sal', cantidad: 0.005, unidadMedida: 'kg' }
  ]},
  // Papas Fritas (ACO001)
  { id: generarId(), productoId: '', productoCodigo: 'ACO001', productoNombre: 'Papas Fritas', insumos: [
    { insumoId: '', insumoCodigo: 'VER001', insumoNombre: 'Papa Amarilla', cantidad: 0.20, unidadMedida: 'kg' },
    { insumoId: '', insumoCodigo: 'ACE001', insumoNombre: 'Aceite Vegetal', cantidad: 0.10, unidadMedida: 'L' },
    { insumoId: '', insumoCodigo: 'CON001', insumoNombre: 'Sal', cantidad: 0.005, unidadMedida: 'kg' }
  ]},
  // Yuca Frita (ACO002)
  { id: generarId(), productoId: '', productoCodigo: 'ACO002', productoNombre: 'Yuca Frita', insumos: [
    { insumoId: '', insumoCodigo: 'VER001', insumoNombre: 'Papa Amarilla', cantidad: 0.20, unidadMedida: 'kg' }, // Placeholder - debería ser yuca
    { insumoId: '', insumoCodigo: 'ACE001', insumoNombre: 'Aceite Vegetal', cantidad: 0.10, unidadMedida: 'L' },
    { insumoId: '', insumoCodigo: 'CON001', insumoNombre: 'Sal', cantidad: 0.005, unidadMedida: 'kg' }
  ]},
  // Choclo con Queso (ACO004)
  { id: generarId(), productoId: '', productoCodigo: 'ACO004', productoNombre: 'Choclo con Queso', insumos: [
    { insumoId: '', insumoCodigo: 'VER006', insumoNombre: 'Choclo', cantidad: 1, unidadMedida: 'unidades' },
    { insumoId: '', insumoCodigo: 'LAC003', insumoNombre: 'Queso Fresco', cantidad: 0.05, unidadMedida: 'kg' }
  ]},
  // Arroz Blanco (ACO005)
  { id: generarId(), productoId: '', productoCodigo: 'ACO005', productoNombre: 'Arroz Blanco', insumos: [
    { insumoId: '', insumoCodigo: 'GRA001', insumoNombre: 'Arroz Blanco', cantidad: 0.15, unidadMedida: 'kg' },
    { insumoId: '', insumoCodigo: 'ACE001', insumoNombre: 'Aceite Vegetal', cantidad: 0.01, unidadMedida: 'L' },
    { insumoId: '', insumoCodigo: 'CON001', insumoNombre: 'Sal', cantidad: 0.002, unidadMedida: 'kg' }
  ]}
];

// ========================================
// MOVIMIENTOS INICIALES (KARDEX)
// ========================================
export const MOVIMIENTOS_INICIALES = [
  // Ejemplos de movimientos históricos
  { id: generarId(), insumoId: '', insumoCodigo: 'CAR001', insumoNombre: 'Corazón de Res', tipo: 'entrada_compra', cantidad: 30, stockAnterior: 0, stockNuevo: 30, precioUnitario: 32.00, total: 960.00, motivo: 'Compra inicial', proveedorId: PROVEEDORES_INICIALES[1].id, proveedorNombre: PROVEEDORES_INICIALES[1].nombre, usuario: 'Sistema', fecha: new Date(Date.now() - 86400000 * 10).toISOString(), documento: 'FC-001' },
  { id: generarId(), insumoId: '', insumoCodigo: 'CAR001', insumoNombre: 'Corazón de Res', tipo: 'salida_consumo', cantidad: 4.5, stockAnterior: 30, stockNuevo: 25.5, precioUnitario: 32.00, total: 144.00, motivo: 'Consumo pedidos día', usuario: 'Cocina', fecha: new Date(Date.now() - 86400000 * 2).toISOString(), pedidoId: 'PED-105' },
  { id: generarId(), insumoId: '', insumoCodigo: 'VER001', insumoNombre: 'Papa Amarilla', tipo: 'entrada_compra', cantidad: 60, stockAnterior: 0, stockNuevo: 60, precioUnitario: 3.50, total: 210.00, motivo: 'Compra semanal', proveedorId: PROVEEDORES_INICIALES[3].id, proveedorNombre: PROVEEDORES_INICIALES[3].nombre, usuario: 'Almacén', fecha: new Date(Date.now() - 86400000 * 5).toISOString(), documento: 'FC-045' },
  { id: generarId(), insumoId: '', insumoCodigo: 'VER001', insumoNombre: 'Papa Amarilla', tipo: 'salida_consumo', cantidad: 10, stockAnterior: 60, stockNuevo: 50, precioUnitario: 3.50, total: 35.00, motivo: 'Consumo pedidos día', usuario: 'Cocina', fecha: new Date().toISOString(), pedidoId: 'PED-112' }
];

// ========================================
// CONSTANTES DE COLORES
// ========================================
export const ESTADO_INSUMO_COLORES = {
  'Activo': { bg: '#E8F5E9', text: '#2E7D32', border: '#81C784' },
  'Inactivo': { bg: '#F5F5F5', text: '#757575', border: '#BDBDBD' },
  'Agotado': { bg: '#FBE9E7', text: '#C62828', border: '#EF9A9A' },
  'Descontinuado': { bg: '#EFEBE9', text: '#5D4037', border: '#BCAAA4' }
};

export const TIPO_MOVIMIENTO_COLORES = {
  'entrada_compra': { bg: '#E8F5E9', text: '#2E7D32', border: '#81C784', icon: '📥' },
  'entrada_ajuste': { bg: '#E3F2FD', text: '#1565C0', border: '#64B5F6', icon: '📈' },
  'entrada_devolucion': { bg: '#E1F5FE', text: '#0288D1', border: '#4FC3F7', icon: '↩️' },
  'salida_consumo': { bg: '#FBE9E7', text: '#C62828', border: '#EF9A9A', icon: '🍳' },
  'salida_manual': { bg: '#FFF3E0', text: '#D84315', border: '#FFB74D', icon: '📤' },
  'salida_merma': { bg: '#FBE9E7', text: '#BF360C', border: '#FF8A65', icon: '🗑️' },
  'salida_transferencia': { bg: '#F3E5F5', text: '#6A1B9A', border: '#BA68C8', icon: '🔄' }
};