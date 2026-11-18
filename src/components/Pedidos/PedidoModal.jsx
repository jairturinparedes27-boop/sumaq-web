// src/components/Pedidos/PedidoModal.jsx
// Modal para crear/editar pedidos

import { useState, useEffect, useRef, useMemo } from 'react';
import { MESAS_MOCK, PRODUCTOS_MOCK } from '../../data/pedidosMock';
import './PedidoModal.css';

function generarId() {
  return Date.now() + Math.random().toString(36).substr(2, 9);
}

export function PedidoModalContent({
  abierto,
  onCerrar,
  pedido,
  onGuardar
}) {
  // Estado derivado del pedido prop (se resetea automáticamente con key)
  const [mesaSeleccionada, setMesaSeleccionada] = useState(pedido?.mesaId ?? null);
  const [mozo, setMozo] = useState(pedido?.mozo ?? 'Juan Pérez');
  const [observaciones, setObservaciones] = useState(pedido?.observaciones ?? '');
  const [items, setItems] = useState(() => pedido?.items.map(item => ({
    ...item,
    id: item.id,
    estado: item.estado
  })) ?? []);
  const [productoBusqueda, setProductoBusqueda] = useState('');
  const [mostrarProductos, setMostrarProductos] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [cantidadProducto, setCantidadProducto] = useState(1);
  const [obsProducto, setObsProducto] = useState('');
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const modalRef = useRef(null);
  const primerInputRef = useRef(null);

  // Categorías únicas
  const categorias = useMemo(() => {
    const cats = [...new Set(PRODUCTOS_MOCK.map(p => p.categoria))].sort();
    return ['Todas', ...cats];
  }, []);

  // Productos filtrados
  const productosFiltrados = useMemo(() => PRODUCTOS_MOCK.filter(p => {
    const coincideBusqueda = !productoBusqueda ||
      p.nombre.toLowerCase().includes(productoBusqueda.toLowerCase());
    const coincideCategoria = categoriaFiltro === 'Todas' || p.categoria === categoriaFiltro;
    return coincideBusqueda && coincideCategoria;
  }), [productoBusqueda, categoriaFiltro]);

  // Focus trap y body overflow
  useEffect(() => {
    if (abierto) {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onCerrar();
          return;
        }

        if (e.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (!focusableElements || focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      // Focus inicial
      setTimeout(() => {
        primerInputRef.current?.focus();
      }, 50);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [abierto, onCerrar]);

  // Cerrar al hacer click en overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCerrar();
    }
  };

  // Validación
  const validar = () => {
    const nuevosErrores = {};

    if (!mesaSeleccionada) {
      nuevosErrores.mesa = 'Debe seleccionar una mesa';
    }

    if (!mozo.trim()) {
      nuevosErrores.mozo = 'El nombre del mozo es obligatorio';
    }

    if (items.length === 0) {
      nuevosErrores.items = 'Debe agregar al menos un producto';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Calcular totales
  const subtotal = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  // Handlers
  const manejarAgregarProducto = (producto) => {
    const itemExistente = items.find(i => i.id === producto.id && i.observaciones === obsProducto);

    if (itemExistente) {
      setItems(prev => prev.map(item =>
        item.id === itemExistente.id
          ? { ...item, cantidad: item.cantidad + cantidadProducto }
          : item
      ));
    } else {
      const nuevoItem = {
        ...producto,
        id: generarId(),
        cantidad: cantidadProducto,
        observaciones: obsProducto,
        estado: 'Pendiente'
      };
      setItems(prev => [...prev, nuevoItem]);
    }

    // Reset campos producto
    setProductoBusqueda('');
    setCategoriaFiltro('Todas');
    setCantidadProducto(1);
    setObsProducto('');
    setMostrarProductos(false);
  };

  const manejarCambiarCantidad = (itemId, delta) => {
    setItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const nuevaCantidad = Math.max(1, item.cantidad + delta);
      return { ...item, cantidad: nuevaCantidad };
    }));
  };

  const manejarEliminarItem = (itemId) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const manejarGuardar = async () => {
    if (!validar()) return;

    setGuardando(true);

    try {
      const datos = {
        mesaId: mesaSeleccionada,
        mesaNumero: MESAS_MOCK.find(m => m.id === mesaSeleccionada)?.numero || 0,
        mesaNombre: MESAS_MOCK.find(m => m.id === mesaSeleccionada)?.nombre || '',
        zona: MESAS_MOCK.find(m => m.id === mesaSeleccionada)?.zona || '',
        items,
        observaciones,
        mozo,
        estado: 'Pendiente',
        subtotal: Math.round(subtotal * 100) / 100,
        igv: Math.round(igv * 100) / 100,
        total: Math.round(total * 100) / 100
      };

      await onGuardar(datos);
      onCerrar();
    } catch (err) {
      console.error('Error guardando pedido:', err);
      setErrores({ general: 'Error al guardar el pedido' });
    } finally {
      setGuardando(false);
    }
  };

  if (!abierto) return null;

  return (
    <div className="pedido-modal__overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="pedido-modal-titulo">
      <div className="pedido-modal" ref={modalRef}>
        <header className="pedido-modal__header">
          <h2 id="pedido-modal-titulo" className="pedido-modal__titulo">
            {pedido ? 'Editar pedido' : 'Nuevo pedido'}
          </h2>
          <button
            className="pedido-modal__cerrar"
            onClick={onCerrar}
            aria-label="Cerrar modal"
            type="button"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </header>

        <form className="pedido-modal__form" onSubmit={(e) => { e.preventDefault(); manejarGuardar(); }}>
          {/* Mesa y Mozo */}
          <div className="pedido-modal__grid">
            <div className="pedido-modal__campo">
              <label htmlFor="pedido-mesa" className="pedido-modal__label">
                Mesa <span className="pedido-modal__requerido" aria-hidden="true">*</span>
              </label>
              <select
                id="pedido-mesa"
                className={`pedido-modal__select ${errores.mesa ? 'pedido-modal__select--error' : ''}`}
                value={mesaSeleccionada || ''}
                onChange={(e) => setMesaSeleccionada(e.target.value ? Number(e.target.value) : null)}
                required
                ref={primerInputRef}
              >
                <option value="">Seleccionar mesa</option>
                {MESAS_MOCK.map(mesa => (
                  <option key={mesa.id} value={mesa.id}>
                    Mesa {mesa.numero} — {mesa.nombre} ({mesa.capacidad} pers.) — {mesa.zona}
                  </option>
                ))}
              </select>
              {errores.mesa && <span className="pedido-modal__error">{errores.mesa}</span>}
            </div>

            <div className="pedido-modal__campo">
              <label htmlFor="pedido-mozo" className="pedido-modal__label">
                Mozo <span className="pedido-modal__requerido" aria-hidden="true">*</span>
              </label>
              <input
                id="pedido-mozo"
                type="text"
                className={`pedido-modal__input ${errores.mozo ? 'pedido-modal__input--error' : ''}`}
                value={mozo}
                onChange={(e) => setMozo(e.target.value)}
                placeholder="Nombre del mozo"
                required
              />
              {errores.mozo && <span className="pedido-modal__error">{errores.mozo}</span>}
            </div>
          </div>

          {/* Observaciones */}
          <div className="pedido-modal__campo pedido-modal__campo--completo">
            <label htmlFor="pedido-observaciones" className="pedido-modal__label">
              Observaciones
            </label>
            <textarea
              id="pedido-observaciones"
              className="pedido-modal__textarea"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Notas especiales, alergias, preferencias..."
              rows={2}
            />
          </div>

          {/* Agregar productos */}
          <fieldset className="pedido-modal__productos-fieldset">
            <legend className="pedido-modal__legend">Agregar productos</legend>

            <div className="pedido-modal__productos-busqueda">
              <div className="pedido-modal__input-wrapper">
                <span className="pedido-modal__icon" aria-hidden="true">🔍</span>
                <input
                  type="search"
                  className="pedido-modal__input"
                  placeholder="Buscar producto..."
                  value={productoBusqueda}
                  onChange={(e) => { setProductoBusqueda(e.target.value); setMostrarProductos(true); }}
                  onFocus={() => setMostrarProductos(true)}
                  aria-label="Buscar producto"
                />
              </div>

              <select
                className="pedido-modal__select"
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                aria-label="Filtrar por categoría"
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {mostrarProductos && productosFiltrados.length > 0 && (
              <div className="pedido-modal__productos-lista">
                {productosFiltrados.map(producto => (
                  <button
                    key={producto.id}
                    type="button"
                    className="pedido-modal__producto-item"
                    onClick={() => manejarAgregarProducto(producto)}
                  >
                    <div className="pedido-modal__producto-info">
                      <span className="pedido-modal__producto-nombre">{producto.nombre}</span>
                      <span className="pedido-modal__producto-categoria">{producto.categoria}</span>
                    </div>
                    <span className="pedido-modal__producto-precio">S/ {producto.precio.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            )}

            {mostrarProductos && productosFiltrados.length === 0 && (
              <p className="pedido-modal__sin-resultados">No se encontraron productos</p>
            )}

            {/* Configuración del item a agregar */}
            <div className="pedido-modal__item-config">
              <div className="pedido-modal__campo">
                <label htmlFor="pedido-cantidad" className="pedido-modal__label">Cantidad</label>
                <div className="pedido-modal__cantidad-control">
                  <button
                    type="button"
                    className="pedido-modal__cantidad-btn"
                    onClick={() => setCantidadProducto(Math.max(1, cantidadProducto - 1))}
                    aria-label="Disminuir cantidad"
                  >
                    <span aria-hidden="true">−</span>
                  </button>
                  <input
                    id="pedido-cantidad"
                    type="number"
                    className="pedido-modal__cantidad-input"
                    value={cantidadProducto}
                    onChange={(e) => setCantidadProducto(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max="99"
                  />
                  <button
                    type="button"
                    className="pedido-modal__cantidad-btn"
                    onClick={() => setCantidadProducto(Math.min(99, cantidadProducto + 1))}
                    aria-label="Aumentar cantidad"
                  >
                    <span aria-hidden="true">+</span>
                  </button>
                </div>
              </div>

              <div className="pedido-modal__campo">
                <label htmlFor="pedido-obs-producto" className="pedido-modal__label">Observaciones del item</label>
                <input
                  id="pedido-obs-producto"
                  type="text"
                  className="pedido-modal__input"
                  value={obsProducto}
                  onChange={(e) => setObsProducto(e.target.value)}
                  placeholder="Ej: Sin cebolla, punto medio, sin azúcar..."
                />
              </div>
            </div>
          </fieldset>

          {/* Lista de items agregados */}
          {items.length > 0 && (
            <fieldset className="pedido-modal__items-fieldset">
              <legend className="pedido-modal__legend">
                Items del pedido ({items.length})
              </legend>

              <div className="pedido-modal__items-lista">
                {items.map((item, index) => (
                  <div key={item.id} className="pedido-modal__item">
                    <div className="pedido-modal__item-info">
                      <span className="pedido-modal__item-numero">{index + 1}.</span>
                      <span className="pedido-modal__item-nombre">{item.nombre}</span>
                      {item.observaciones && (
                        <span className="pedido-modal__item-obs">({item.observaciones})</span>
                      )}
                    </div>
                    <div className="pedido-modal__item-cantidad">
                      <button
                        type="button"
                        className="pedido-modal__cantidad-btn-sm"
                        onClick={() => manejarCambiarCantidad(item.id, -1)}
                        aria-label="Disminuir"
                      >
                        −
                      </button>
                      <span className="pedido-modal__cantidad-valor">{item.cantidad}</span>
                      <button
                        type="button"
                        className="pedido-modal__cantidad-btn-sm"
                        onClick={() => manejarCambiarCantidad(item.id, 1)}
                        aria-label="Aumentar"
                      >
                        +
                      </button>
                    </div>
                    <span className="pedido-modal__item-subtotal">
                      S/ {(item.precio * item.cantidad).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      className="pedido-modal__item-eliminar"
                      onClick={() => manejarEliminarItem(item.id)}
                      aria-label={`Eliminar ${item.nombre}`}
                    >
                      <span aria-hidden="true">🗑</span>
                    </button>
                  </div>
                ))}
              </div>
            </fieldset>
          )}

          {items.length === 0 && !mostrarProductos && (
            <p className="pedido-modal__vacio">Agrega productos al pedido usando el buscador de arriba</p>
          )}

          {/* Totales */}
          <div className="pedido-modal__totales">
            <div className="pedido-modal__total-fila">
              <span>Subtotal</span>
              <strong>S/ {subtotal.toFixed(2)}</strong>
            </div>
            <div className="pedido-modal__total-fila">
              <span>IGV (18%)</span>
              <strong>S/ {igv.toFixed(2)}</strong>
            </div>
            <div className="pedido-modal__total-fila pedido-modal__total-fila--final">
              <span>Total</span>
              <strong>S/ {total.toFixed(2)}</strong>
            </div>
          </div>

          {errores.general && (
            <div className="pedido-modal__error-general" role="alert">
              <span aria-hidden="true">⚠</span> {errores.general}
            </div>
          )}

          <footer className="pedido-modal__footer">
            <button
              type="button"
              className="pedido-modal__btn pedido-modal__btn--cancelar"
              onClick={onCerrar}
              disabled={guardando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="pedido-modal__btn pedido-modal__btn--guardar"
              disabled={guardando || items.length === 0 || !mesaSeleccionada || !mozo.trim()}
            >
              {guardando ? 'Guardando...' : (pedido ? 'Actualizar' : 'Crear pedido')}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

// Wrapper que usa key para resetear estado (patrón recomendado por ESLint)
export function PedidoModal({ abierto, onCerrar, pedido, onGuardar }) {
  const key = pedido ? `editar-${pedido.id}` : 'crear';

  return (
    <PedidoModalContent
      key={key}
      abierto={abierto}
      onCerrar={onCerrar}
      pedido={pedido}
      onGuardar={onGuardar}
    />
  );
}