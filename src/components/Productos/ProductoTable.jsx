// src/components/Productos/ProductoTable.jsx
// Tabla de productos para vista tabla

import './ProductoTable.css';

export function ProductoTable({
  productos,
  onEditar,
  onEliminar,
  onToggleEstado,
  onToggleDisponibilidad,
  onDuplicar,
  obtenerColorCategoria,
  obtenerColorEstado,
  obtenerIconoCategoria
}) {
  return (
    <div className="producto-table__wrapper">
      <table className="producto-table" role="grid">
        <thead>
          <tr>
            <th scope="col" className="producto-table__th">Imagen</th>
            <th scope="col" className="producto-table__th">Código</th>
            <th scope="col" className="producto-table__th">Producto</th>
            <th scope="col" className="producto-table__th">Categoría</th>
            <th scope="col" className="producto-table__th">Precio</th>
            <th scope="col" className="producto-table__th">Estado</th>
            <th scope="col" className="producto-table__th">Disponible</th>
            <th scope="col" className="producto-table__th producto-table__th--acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length === 0 ? (
            <tr>
              <td colSpan={8} className="producto-table__vacio">
                <div className="producto-table__vacio-contenido">
                  <span aria-hidden="true">📭</span>
                  <p>No hay productos que mostrar</p>
                </div>
              </td>
            </tr>
          ) : (
            productos.map((producto) => (
              <tr key={producto.id} className={`producto-table__tr ${producto.estado === 'Inactivo' ? 'producto-table__tr--inactivo' : ''} ${!producto.disponible ? 'producto-table__tr--no-disp' : ''}`}>
                <td className="producto-table__td producto-table__td--imagen">
                  {producto.imagen && !producto.imagen.startsWith('http') ? (
                    <span className="producto-table__icono" aria-hidden="true">{producto.imagen}</span>
                  ) : producto.imagen ? (
                    <img
                      className="producto-table__img"
                      src={producto.imagen}
                      alt={producto.nombre}
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'inline-flex'; }}
                    />
                  ) : (
                    <span className="producto-table__icono" aria-hidden="true">{obtenerIconoCategoria(producto.categoriaNombre)}</span>
                  )}
                  {producto.imagen && producto.imagen.startsWith('http') && (
                    <span className="producto-table__icono" aria-hidden="true" style={{ display: 'none' }}>{obtenerIconoCategoria(producto.categoriaNombre)}</span>
                  )}
                </td>

                <td className="producto-table__td producto-table__td--codigo">
                  <code className="producto-table__codigo">{producto.codigo}</code>
                </td>

                <td className="producto-table__td producto-table__td--nombre">
                  <div className="producto-table__nombre-wrap">
                    <strong className="producto-table__nombre">{producto.nombre}</strong>
                    {producto.descripcion && (
                      <span className="producto-table__descripcion">{producto.descripcion}</span>
                    )}
                  </div>
                </td>

                <td className="producto-table__td producto-table__td--categoria">
                  <span
                    className="producto-table__categoria"
                    style={{ background: obtenerColorCategoria(producto.categoriaNombre).bg, color: obtenerColorCategoria(producto.categoriaNombre).text, borderColor: obtenerColorCategoria(producto.categoriaNombre).border }}
                  >
                    {obtenerIconoCategoria(producto.categoriaNombre)} {producto.categoriaNombre}
                  </span>
                </td>

                <td className="producto-table__td producto-table__td--precio">
                  <span className="producto-table__precio">S/ {producto.precioVenta.toFixed(2)}</span>
                </td>

                <td className="producto-table__td producto-table__td--estado">
                  <span
                    className="producto-table__badge"
                    style={{ background: obtenerColorEstado(producto.estado).bg, color: obtenerColorEstado(producto.estado).text, borderColor: obtenerColorEstado(producto.estado).border }}
                  >
                    {producto.estado}
                  </span>
                </td>

                <td className="producto-table__td producto-table__td--disponible">
                  <span
                    className={`producto-table__disp ${producto.disponible ? 'producto-table__disp--on' : 'producto-table__disp--off'}`}
                    aria-label={producto.disponible ? 'Disponible para venta' : 'No disponible para venta'}
                  >
                    {producto.disponible ? '✅ Sí' : '⛔ No'}
                  </span>
                </td>

                <td className="producto-table__td producto-table__td--acciones">
                  <div className="producto-table__acciones">
                    <button
                      className="producto-table__btn"
                      onClick={() => onEditar(producto)}
                      aria-label={`Editar ${producto.nombre}`}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="producto-table__btn"
                      onClick={() => onDuplicar(producto.id)}
                      aria-label={`Duplicar ${producto.nombre}`}
                      title="Duplicar"
                    >
                      📋
                    </button>
                    <button
                      className={`producto-table__btn ${producto.estado === 'Activo' ? 'producto-table__btn--activo' : ''}`}
                      onClick={() => onToggleEstado(producto.id)}
                      aria-label={producto.estado === 'Activo' ? `Desactivar ${producto.nombre}` : `Activar ${producto.nombre}`}
                      title={producto.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                    >
                      {producto.estado === 'Activo' ? '⏸' : '▶️'}
                    </button>
                    <button
                      className={`producto-table__btn ${producto.disponible ? 'producto-table__btn--disp-on' : ''}`}
                      onClick={() => onToggleDisponibilidad(producto.id)}
                      aria-label={producto.disponible ? `Marcar no disponible ${producto.nombre}` : `Marcar disponible ${producto.nombre}`}
                      title={producto.disponible ? 'Disponible' : 'No disponible'}
                    >
                      {producto.disponible ? '✅' : '⛔'}
                    </button>
                    <button
                      className="producto-table__btn producto-table__btn--eliminar"
                      onClick={() => onEliminar(producto)}
                      aria-label={`Eliminar ${producto.nombre}`}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}