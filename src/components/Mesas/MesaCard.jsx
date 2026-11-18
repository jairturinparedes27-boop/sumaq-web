// src/components/Mesas/MesaCard.jsx
// Componente reutilizable: Tarjeta individual de mesa

import './MesaCard.css';

export function MesaCard({
  mesa,
  onClick,
  onEditar,
  onEliminar,
  onCambiarEstado,
  seleccionada = false
}) {
  const estadosConfig = {
    Disponible: { clase: 'estado-disponible', label: 'Disponible', icono: '✓' },
    Ocupada: { clase: 'estado-ocupada', label: 'Ocupada', icono: '●' },
    Reservada: { clase: 'estado-reservada', label: 'Reservada', icono: '⏰' }
  };

  const config = estadosConfig[mesa.estado] || estadosConfig.Disponible;

  const manejarClick = (e) => {
    // No propagar si se hizo click en botones de acción
    if (e.target.closest('.mesa-card__accion')) return;
    onClick?.(mesa);
  };

  const manejarTeclado = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(mesa);
    }
  };

  return (
    <article
      className={`mesa-card ${config.clase} ${seleccionada ? 'mesa-card--seleccionada' : ''}`}
      onClick={manejarClick}
      onKeyDown={manejarTeclado}
      tabIndex={0}
      role="button"
      aria-label={`Mesa ${mesa.numero}, ${mesa.estado}, capacidad ${mesa.capacidad} personas`}
      data-estado={mesa.estado}
      data-id={mesa.id}
    >
      {/* Badge de estado - esquina superior derecha */}
      <div className={`mesa-card__badge ${config.clase}`}>
        <span className="mesa-card__badge-icon" aria-hidden="true">{config.icono}</span>
        <span className="mesa-card__badge-text">{config.label}</span>
      </div>

      {/* Número/Nombre de la mesa */}
      <div className="mesa-card__header">
        <div className="mesa-card__identificacion">
          <span className="mesa-card__numero">{mesa.numero}</span>
          <h3 className="mesa-card__nombre">{mesa.nombre}</h3>
        </div>

        {/* Menú de acciones (tres puntos) */}
        <div className="mesa-card__menu">
          <button
            className="mesa-card__accion mesa-card__menu-trigger"
            aria-label="Más opciones"
            aria-expanded="false"
            aria-haspopup="true"
            onClick={(e) => {
              e.stopPropagation();
              // Toggle dropdown simple (se maneja con CSS :focus-within)
            }}
          >
            <span aria-hidden="true">⋮</span>
          </button>

          <div className="mesa-card__dropdown" role="menu">
            <button
              className="mesa-card__accion mesa-card__dropdown-item"
              role="menuitem"
              onClick={(e) => { e.stopPropagation(); onCambiarEstado?.(mesa.id, 'Disponible'); }}
              disabled={mesa.estado === 'Disponible'}
            >
              <span aria-hidden="true">✓</span> Marcar disponible
            </button>
            <button
              className="mesa-card__accion mesa-card__dropdown-item"
              role="menuitem"
              onClick={(e) => { e.stopPropagation(); onCambiarEstado?.(mesa.id, 'Ocupada'); }}
              disabled={mesa.estado === 'Ocupada'}
            >
              <span aria-hidden="true">●</span> Marcar ocupada
            </button>
            <button
              className="mesa-card__accion mesa-card__dropdown-item"
              role="menuitem"
              onClick={(e) => { e.stopPropagation(); onCambiarEstado?.(mesa.id, 'Reservada'); }}
              disabled={mesa.estado === 'Reservada'}
            >
              <span aria-hidden="true">⏰</span> Marcar reservada
            </button>
            <hr className="mesa-card__divider" />
            <button
              className="mesa-card__accion mesa-card__dropdown-item mesa-card__dropdown-item--editar"
              role="menuitem"
              onClick={(e) => { e.stopPropagation(); onEditar?.(mesa); }}
            >
              <span aria-hidden="true">✎</span> Editar
            </button>
            <button
              className="mesa-card__accion mesa-card__dropdown-item mesa-card__dropdown-item--eliminar"
              role="menuitem"
              onClick={(e) => { e.stopPropagation(); onEliminar?.(mesa); }}
            >
              <span aria-hidden="true">🗑</span> Eliminar
            </button>
          </div>
        </div>
      </div>

      {/* Información de la mesa */}
      <div className="mesa-card__info">
        <div className="mesa-card__capacidad">
          <span className="mesa-card__icono" aria-hidden="true">👥</span>
          <span className="mesa-card__valor">{mesa.capacidad} personas</span>
        </div>

        <div className="mesa-card__zona">
          <span className="mesa-card__icono" aria-hidden="true">📍</span>
          <span className="mesa-card__valor">{mesa.zona}</span>
        </div>
      </div>

      {/* Botón principal de acción según estado */}
      <div className="mesa-card__accion-principal">
        {mesa.estado === 'Disponible' && (
          <button
            className="mesa-card__btn mesa-card__btn--primaria"
            onClick={(e) => { e.stopPropagation(); onClick?.(mesa); }}
            aria-label={`Comenzar pedido en Mesa ${mesa.numero}`}
          >
            <span aria-hidden="true">🛒</span> Comenzar pedido
          </button>
        )}

        {mesa.estado === 'Ocupada' && (
          <button
            className="mesa-card__btn mesa-card__btn--secundaria"
            onClick={(e) => { e.stopPropagation(); onClick?.(mesa); }}
            aria-label={`Ver pedido de Mesa ${mesa.numero}`}
          >
            <span aria-hidden="true">👁</span> Ver pedido
          </button>
        )}

        {mesa.estado === 'Reservada' && (
          <button
            className="mesa-card__btn mesa-card__btn--terciaria"
            onClick={(e) => { e.stopPropagation(); onClick?.(mesa); }}
            aria-label={`Gestionar reserva de Mesa ${mesa.numero}`}
          >
            <span aria-hidden="true">📋</span> Gestionar reserva
          </button>
        )}
      </div>
    </article>
  );
}