// src/components/Productos/ProductoCard.jsx
// Tarjeta de producto para vista grid

import './ProductoCard.css';

export function ProductoCard({
  producto,
  onEditar,
  onEliminar,
  onToggleEstado,
  onToggleDisponibilidad,
  onDuplicar,
  obtenerColorCategoria,
  obtenerColorEstado,
  obtenerIconoCategoria
}) {
  const coloresCat = obtenerColorCategoria(producto.categoriaNombre);
  const coloresEst = obtenerColorEstado(producto.estado);
  const iconoCat = obtenerIconoCategoria(producto.categoriaNombre);

  return (
    <article
      className={`producto-card ${producto.estado === 'Inactivo' ? 'producto-card--inactivo' : ''} ${!producto.disponible ? 'producto-card--no-disponible' : ''}`}
      style={{
        '--cat-bg': coloresCat.bg,
        '--cat-text': coloresCat.text,
        '--cat-border': coloresCat.border,
        '--est-bg': coloresEst.bg,
        '--est-text': coloresEst.text,
        '--est-border': coloresEst.border
      }}
      data-producto-id={producto.id}
    >
      {/* ===== IMAGEN / ICONO ===== */}
      <div className="producto-card__imagen" style={{ background: coloresCat.bg }}>
        {producto.imagen && !producto.imagen.startsWith('http') ? (
          <span className="producto-card__icono" aria-hidden="true">{producto.imagen}</span>
        ) : producto.imagen ? (
          <img
            className="producto-card__img"
            src={producto.imagen}
            alt={producto.nombre}
            onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }}
          />
        ) : (
          <span className="producto-card__icono" aria-hidden="true">{iconoCat}</span>
        )}
        {producto.imagen && producto.imagen.startsWith('http') && (
          <span className="producto-card__icono" aria-hidden="true" style={{ display: 'none' }}>{iconoCat}</span>
        )}

        {/* Badges de estado */}
        <div className="producto-card__badges">
          <span
            className="producto-card__badge producto-card__badge--estado"
            style={{ background: coloresEst.bg, color: coloresEst.text, borderColor: coloresEst.border }}
            aria-label={`Estado: ${producto.estado}`}
          >
            {producto.estado}
          </span>
          {!producto.disponible && (
            <span
              className="producto-card__badge producto-card__badge--no-disp"
              aria-label="No disponible para venta"
              title="No disponible para venta"
            >
              ⛔
            </span>
          )}
        </div>
      </div>

      {/* ===== CONTENIDO ===== */}
      <div className="producto-card__contenido">
        <div className="producto-card__header">
          <span
            className="producto-card__categoria"
            style={{ background: coloresCat.bg, color: coloresCat.text, borderColor: coloresCat.border }}
          >
            {iconoCat} {producto.categoriaNombre}
          </span>
          <span className="producto-card__codigo" aria-label={`Código: ${producto.codigo}`}>
            {producto.codigo}
          </span>
        </div>

        <h3 className="producto-card__nombre" title={producto.nombre}>
          {producto.nombre}
        </h3>

        {producto.descripcion && (
          <p className="producto-card__descripcion" title={producto.descripcion}>
            {producto.descripcion}
          </p>
        )}

        <div className="producto-card__precio">
          <span className="producto-card__precio-valor">
            S/ {producto.precioVenta.toFixed(2)}
          </span>
        </div>
      </div>

      {/* ===== ACCIONES ===== */}
      <footer className="producto-card__acciones">
        <button
          className="producto-card__btn producto-card__btn--editar"
          onClick={() => onEditar(producto)}
          aria-label={`Editar ${producto.nombre}`}
          title="Editar"
        >
          ✏️
        </button>
        <button
          className="producto-card__btn producto-card__btn--duplicar"
          onClick={() => onDuplicar(producto.id)}
          aria-label={`Duplicar ${producto.nombre}`}
          title="Duplicar"
        >
          📋
        </button>
        <button
          className={`producto-card__btn producto-card__btn--estado ${producto.estado === 'Activo' ? 'producto-card__btn--activo' : ''}`}
          onClick={() => onToggleEstado(producto.id)}
          aria-label={producto.estado === 'Activo' ? `Desactivar ${producto.nombre}` : `Activar ${producto.nombre}`}
          title={producto.estado === 'Activo' ? 'Desactivar' : 'Activar'}
        >
          {producto.estado === 'Activo' ? '⏸' : '▶️'}
        </button>
        <button
          className={`producto-card__btn producto-card__btn--disp ${producto.disponible ? 'producto-card__btn--disp-on' : ''}`}
          onClick={() => onToggleDisponibilidad(producto.id)}
          aria-label={producto.disponible ? `Marcar no disponible ${producto.nombre}` : `Marcar disponible ${producto.nombre}`}
          title={producto.disponible ? 'Disponible' : 'No disponible'}
        >
          {producto.disponible ? '✅' : '⛔'}
        </button>
        <button
          className="producto-card__btn producto-card__btn--eliminar"
          onClick={() => onEliminar(producto)}
          aria-label={`Eliminar ${producto.nombre}`}
          title="Eliminar"
        >
          🗑️
        </button>
      </footer>
    </article>
  );
}