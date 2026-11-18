// src/components/Pedidos/PedidoCard.jsx
// Tarjeta individual de pedido

import { useState, useRef, useEffect } from 'react';
import { ESTADO_COLORES, ESTADO_ICONOS, SIGUIENTE_ESTADO } from '../../data/pedidosMock';
import './PedidoCard.css';

export function PedidoCard({
  pedido,
  onClick,
  onCambiarEstado,
  onCambiarEstadoItem,
  onEditar,
  onEliminar,
  onDuplicar,
  onImprimir,
  onVerDetalle,
  onEliminarItem,
  onCobrar
}) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [itemExpandido, setItemExpandido] = useState(null);
  const menuRef = useRef(null);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const colores = ESTADO_COLORES[pedido.estado] || ESTADO_COLORES['Pendiente'];
  const iconoEstado = ESTADO_ICONOS[pedido.estado] || '⏳';
  const siguienteEstado = pedido.estado !== 'Entregado' && pedido.estado !== 'Cancelado';

  const itemsListos = pedido.items.filter(i => i.estado === 'Listo' || i.estado === 'Entregado').length;
  const itemsPendientes = pedido.items.filter(i => i.estado === 'Pendiente').length;
  const itemsEnPreparacion = pedido.items.filter(i => i.estado === 'En preparación').length;

  const manejarClickTarjeta = () => {
    if (onClick) onClick(pedido);
  };

  const toggleItemExpandido = (itemId) => {
    setItemExpandido(prev => prev === itemId ? null : itemId);
  };

  const siguienteEstadoPedido = SIGUIENTE_ESTADO[pedido.estado] || pedido.estado;

  const manejarCambiarEstadoItem = (itemId, nuevoEstado, e) => {
    e.stopPropagation();
    onCambiarEstadoItem(pedido.id, itemId, nuevoEstado);
  };

  return (
    <article
      className="pedido-card"
      style={{ '--estado-color': colores.text, '--estado-bg': colores.bg, '--estado-border': colores.border }}
      onClick={manejarClickTarjeta}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); manejarClickTarjeta(); }}}
      role="button"
      aria-label={`Pedido ${pedido.numero}, Mesa ${pedido.mesaNumero}, ${pedido.estado}`}
    >
      {/* Header del pedido */}
      <header className="pedido-card__header">
        <div className="pedido-card__identificacion">
          <span className="pedido-card__numero">{pedido.numero}</span>
          <span className="pedido-card__mesa">
            <span aria-hidden="true">▦</span> Mesa {pedido.mesaNumero}
          </span>
          <span className="pedido-card__zona">{pedido.zona}</span>
        </div>

        <div className="pedido-card__estado-contenedor">
          <span
            className="pedido-card__estado"
            style={{ background: colores.bg, color: colores.text, borderColor: colores.border }}
          >
            <span aria-hidden="true">{iconoEstado}</span> {pedido.estado}
          </span>

          {/* Menú de acciones */}
          <div className="pedido-card__menu" ref={menuRef}>
            <button
              className="pedido-card__menu-btn"
              onClick={(e) => { e.stopPropagation(); setMenuAbierto(!menuAbierto); }}
              aria-label="Más opciones"
              aria-expanded={menuAbierto}
              aria-haspopup="true"
            >
              <span aria-hidden="true">⋮</span>
            </button>

            {menuAbierto && (
              <div className="pedido-card__dropdown" role="menu">
                <button
                  className="pedido-card__dropdown-item"
                  role="menuitem"
                  onClick={(e) => { e.stopPropagation(); onVerDetalle?.(pedido); setMenuAbierto(false); }}
                >
                  <span aria-hidden="true">👁</span> Ver detalle
                </button>
                <button
                  className="pedido-card__dropdown-item"
                  role="menuitem"
                  onClick={(e) => { e.stopPropagation(); onDuplicar?.(pedido.id); setMenuAbierto(false); }}
                >
                  <span aria-hidden="true">📋</span> Duplicar
                </button>
                <button
                  className="pedido-card__dropdown-item"
                  role="menuitem"
                  onClick={(e) => { e.stopPropagation(); onImprimir?.(pedido); setMenuAbierto(false); }}
                >
                  <span aria-hidden="true">🖨</span> Imprimir comanda
                </button>
                <button
                  className="pedido-card__dropdown-item"
                  role="menuitem"
                  onClick={(e) => { e.stopPropagation(); onEditar?.(pedido); setMenuAbierto(false); }}
                >
                  <span aria-hidden="true">✎</span> Editar
                </button>
                <button
                  className="pedido-card__dropdown-item pedido-card__dropdown-item--danger"
                  role="menuitem"
                  onClick={(e) => { e.stopPropagation(); onEliminar?.(pedido); setMenuAbierto(false); }}
                >
                  <span aria-hidden="true">🗑</span> Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Info del pedido */}
      <div className="pedido-card__info">
        <div className="pedido-card__mozo">
          <span aria-hidden="true">👤</span> {pedido.mozo}
        </div>
        <div className="pedido-card__hora">
          <span aria-hidden="true">🕐</span> {pedido.horaInicio} · {pedido.calcularTiempoTranscurrido ? pedido.calcularTiempoTranscurrido(pedido.creadoEn) : ''}
        </div>
        {pedido.observaciones && (
          <div className="pedido-card__observaciones">
            <span aria-hidden="true">📝</span> {pedido.observaciones}
          </div>
        )}
      </div>

      {/* Items del pedido */}
      <div className="pedido-card__items">
        {pedido.items.map((item) => (
          <div
            key={item.id}
            className={`pedido-card__item ${item.estado === 'Cancelado' ? 'pedido-card__item--cancelado' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleItemExpandido(item.id); }}
          >
            <div className="pedido-card__item-main">
              <div className="pedido-card__item-info">
                <span className="pedido-card__item-cantidad">{item.cantidad}x</span>
                <span className="pedido-card__item-nombre">{item.nombre}</span>
                <span className="pedido-card__item-precio">S/ {(item.precio * item.cantidad).toFixed(2)}</span>
              </div>

              <div className="pedido-card__item-estado-contenedor">
                <select
                  className="pedido-card__item-estado-select"
                  value={item.estado}
                  onChange={(e) => manejarCambiarEstadoItem(item.id, e.target.value, e)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Estado de ${item.nombre}`}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En preparación">En preparación</option>
                  <option value="Listo">Listo</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            {/* Detalle expandido del item */}
            {itemExpandido === item.id && (
              <div className="pedido-card__item-detalle">
                {item.observaciones && (
                  <div className="pedido-card__item-obs">
                    <span aria-hidden="true">📝</span> {item.observaciones}
                  </div>
                )}
                <div className="pedido-card__item-tiempo">
                  <span aria-hidden="true">⏱</span> Tiempo estimado: {item.tiempoPreparacion} min
                </div>
                <div className="pedido-card__item-acciones">
                  <button
                    className="pedido-card__btn-sm"
                    onClick={(e) => { e.stopPropagation(); onEliminarItem?.(pedido.id, item.id); }}
                  >
                    <span aria-hidden="true">🗑</span> Quitar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Resumen de items por estado */}
        <div className="pedido-card__resumen-items">
          {itemsPendientes > 0 && (
            <span className="pedido-card__badge pedido-card__badge--pendiente">
              ⏳ {itemsPendientes}
            </span>
          )}
          {itemsEnPreparacion > 0 && (
            <span className="pedido-card__badge pedido-card__badge--preparacion">
              👨‍🍳 {itemsEnPreparacion}
            </span>
          )}
          {itemsListos > 0 && (
            <span className="pedido-card__badge pedido-card__badge--listo">
              ✅ {itemsListos}
            </span>
          )}
        </div>
      </div>

      {/* Footer con total y acción principal */}
      <footer className="pedido-card__footer">
        <div className="pedido-card__totales">
          <div className="pedido-card__subtotal">
            <span>Subtotal</span>
            <strong>S/ {pedido.subtotal.toFixed(2)}</strong>
          </div>
          <div className="pedido-card__total">
            <span>Total</span>
            <strong>S/ {pedido.total.toFixed(2)}</strong>
          </div>
        </div>

        <div className="pedido-card__acciones-principales">
          {siguienteEstado && (
            <button
              className="pedido-card__btn-accion"
              onClick={(e) => { e.stopPropagation(); onCambiarEstado(pedido.id, siguienteEstadoPedido); }}
              aria-label={`Marcar como ${siguienteEstadoPedido}`}
            >
              <span aria-hidden="true">{ESTADO_ICONOS[siguienteEstadoPedido] || '▶'}</span>
              {siguienteEstadoPedido}
            </button>
          )}
          {pedido.estado === 'Entregado' && (
            <button
              className="pedido-card__btn-accion pedido-card__btn-accion--cobrar"
              onClick={(e) => { e.stopPropagation(); onCobrar?.(pedido); }}
            >
              <span aria-hidden="true">💰</span> Cobrar
            </button>
          )}
        </div>
      </footer>
    </article>
  );
}