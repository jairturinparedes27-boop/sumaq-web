// src/components/Cocina/CocinaCard.jsx
// Tarjeta de pedido para la pantalla de cocina (KDS)

import './CocinaCard.css';

export function CocinaCard({
  pedido,
  onCambiarEstado,
  onCambiarEstadoItem,
  siguienteEstadoPedido,
  siguienteEstadoItem,
  puedeAvanzarEstado,
  calcularTiempoTranscurrido,
  esDemorado,
  esUrgente,
  agruparItemsPorEstacion,
  ESTADO_COLORES,
  ESTADO_ICONOS,
  filtroEstacion
}) {
  const tiempoTranscurrido = calcularTiempoTranscurrido(pedido.creadoEn);
  const demorado = esDemorado(pedido);
  const urgente = esUrgente(pedido);
  const grupos = agruparItemsPorEstacion(pedido.items);
  const proximoEstado = siguienteEstadoPedido(pedido.estado);
  const colores = ESTADO_COLORES[pedido.estado] || ESTADO_COLORES.Pendiente;
  const iconoEstado = ESTADO_ICONOS[pedido.estado] || '⏳';

  // Filtrar grupos según la estación seleccionada
  const estacionesVisibles = filtroEstacion === 'todas'
    ? Object.entries(grupos).filter(([, items]) => items.length > 0)
    : [[filtroEstacion, grupos[filtroEstacion]]].filter(([, items]) => items && items.length > 0);

  return (
    <article
      className={`cocina-card ${pedido.estado.toLowerCase().replace(' ', '-')} ${demorado ? 'cocina-card--demorado' : ''} ${urgente ? 'cocina-card--urgente' : ''}`}
      style={{
        '--estado-bg': colores.bg,
        '--estado-text': colores.text,
        '--estado-border': colores.border
      }}
      data-pedido-id={pedido.id}
      data-estado={pedido.estado}
    >
      {/* ===== HEADER DE LA TARJETA ===== */}
      <header className="cocina-card__header">
        <div className="cocina-card__identificacion">
          <span className="cocina-card__numero" aria-label="Número de pedido">{pedido.numero}</span>
          <span className="cocina-card__mesa" aria-label={`Mesa ${pedido.mesaNumero}`}>
            <span aria-hidden="true">▦</span> Mesa {pedido.mesaNumero}
          </span>
          <span className="cocina-card__zona" aria-label={`Zona: ${pedido.zona}`}>{pedido.zona}</span>
        </div>

        <div className="cocina-card__estado-info">
          <div
            className="cocina-card__badge"
            style={{ background: colores.bg, color: colores.text, borderColor: colores.border }}
            aria-label={`Estado: ${pedido.estado}`}
          >
            <span className="cocina-card__badge-icon" aria-hidden="true">{iconoEstado}</span>
            <span className="cocina-card__badge-text">{pedido.estado}</span>
          </div>

          <div className="cocina-card__tiempo" aria-label={`Tiempo transcurrido: ${tiempoTranscurrido}`}>
            <span className="cocina-card__tiempo-icon" aria-hidden="true">⏱</span>
            <span className={`cocina-card__tiempo-valor ${urgente ? 'cocina-card__tiempo-valor--urgente' : demorado ? 'cocina-card__tiempo-valor--demorado' : ''}`}>
              {tiempoTranscurrido}
            </span>
          </div>
        </div>
      </header>

      {/* ===== ITEMS AGRUPADOS POR ESTACIÓN ===== */}
      <div className="cocina-card__items">
        {estacionesVisibles.map(([estacionId, items]) => (
          <div key={estacionId} className="cocina-card__estacion">
            <div className="cocina-card__estacion-header">
              <span className="cocina-card__estacion-icon" aria-hidden="true">
                {ESTACIONES_ICONOS[estacionId] || '🍽️'}
              </span>
              <span className="cocina-card__estacion-nombre">
                {ESTACIONES_NOMBRES[estacionId] || estacionId}
              </span>
              <span className="cocina-card__estacion-count" aria-label={`${items.length} productos`}>
                {items.length}
              </span>
            </div>

            <ul className="cocina-card__items-lista" role="list" aria-label={`Productos en ${ESTACIONES_NOMBRES[estacionId] || estacionId}`}>
              {items.map((item, index) => (
                <li key={item.id} className="cocina-card__item" data-estado={item.estado}>
                  <div className="cocina-card__item-info">
                    <span className="cocina-card__item-numero" aria-hidden="true">{index + 1}.</span>
                    <span className="cocina-card__item-nombre">{item.nombre}</span>
                    {item.observaciones && (
                      <span className="cocina-card__item-obs" aria-label={`Observación: ${item.observaciones}`}>
                        ({item.observaciones})
                      </span>
                    )}
                  </div>

                  <div className="cocina-card__item-cantidad">
                    <span className="cocina-card__cantidad-valor" aria-label={`${item.cantidad} unidades`}>
                      {item.cantidad}x
                    </span>
                  </div>

                  <div className="cocina-card__item-estado-wrapper">
                    <select
                      className="cocina-card__item-estado-select"
                      value={item.estado}
                      onChange={(e) => onCambiarEstadoItem(pedido.id, item.id, e.target.value)}
                      aria-label={`Estado de ${item.nombre}`}
                      disabled={item.estado === 'Entregado' || item.estado === 'Cancelado'}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En preparación">En preparación</option>
                      <option value="Listo">Listo</option>
                      <option value="Entregado">Entregado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>

                    {/* Botón rápido para siguiente estado */}
                    {puedeAvanzarEstado(item.estado) && (
                      <button
                        className="cocina-card__item-avanzar"
                        onClick={() => onCambiarEstadoItem(pedido.id, item.id, siguienteEstadoItem(item.estado))}
                        aria-label={`Marcar ${item.nombre} como ${siguienteEstadoItem(item.estado)}`}
                        title={`→ ${siguienteEstadoItem(item.estado)}`}
                      >
                        →
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ===== ACCIONES DEL PEDIDO ===== */}
      <footer className="cocina-card__footer">
        {pedido.observaciones && (
          <div className="cocina-card__observaciones" aria-label={`Observaciones del pedido: ${pedido.observaciones}`}>
            <span className="cocina-card__obs-icon" aria-hidden="true">📝</span>
            <span className="cocina-card__obs-texto">{pedido.observaciones}</span>
          </div>
        )}

        <div className="cocina-card__acciones">
          {puedeAvanzarEstado(pedido.estado) && (
            <button
              className="cocina-card__btn cocina-card__btn--primaria"
              onClick={() => onCambiarEstado(pedido.id, proximoEstado)}
              aria-label={`Marcar pedido completo como ${proximoEstado}`}
              style={{ background: colores.text, borderColor: colores.text }}
            >
              <span aria-hidden="true">{iconoEstado}</span>
              <span>{proximoEstado}</span>
            </button>
          )}

          {pedido.estado === 'Listo' && (
            <button
              className="cocina-card__btn cocina-card__btn--entregar"
              onClick={() => onCambiarEstado(pedido.id, 'Entregado')}
              aria-label="Marcar pedido como entregado"
            >
              <span aria-hidden="true">📦</span>
              <span>Entregar</span>
            </button>
          )}

          {pedido.estado === 'Pendiente' && (
            <button
              className="cocina-card__btn cocina-card__btn--cancelar"
              onClick={() => onCambiarEstado(pedido.id, 'Cancelado')}
              aria-label="Cancelar pedido"
            >
              <span aria-hidden="true">❌</span>
              <span>Cancelar</span>
            </button>
          )}
        </div>

        <div className="cocina-card__mozo" aria-label={`Mozo: ${pedido.mozo}`}>
          <span aria-hidden="true">👤</span> {pedido.mozo}
        </div>
      </footer>
    </article>
  );
}

// Constantes para estaciones
const ESTACIONES_NOMBRES = {
  caliente: 'Caliente',
  frio: 'Frío',
  barra: 'Barra'
};

const ESTACIONES_ICONOS = {
  caliente: '🔥',
  frio: '❄️',
  barra: '🍺'
};