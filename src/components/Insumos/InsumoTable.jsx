// src/components/Insumos/InsumoTable.jsx
// Tabla de insumos para vista tabla

import './InsumoTable.css';

export function InsumoTable({
  insumos,
  onEditar,
  onEliminar,
  onToggleEstado,
  onEntradaCompra,
  onEntradaAjuste,
  onSalidaManual,
  onMerma,
  onHistorial,
  obtenerColorEstado,
  obtenerUnidadMedida,
  obtenerCategoria,
  obtenerProveedor
}) {
  const formatearNumero = (num, unidad) => {
    if (unidad && (unidad.valor === 'kg' || unidad.valor === 'L')) {
      return num.toFixed(2);
    }
    if (unidad && (unidad.valor === 'g' || unidad.valor === 'ml')) {
      return num.toFixed(0);
    }
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
  };

  const obtenerEstadoStock = (insumo) => {
    if (insumo.stockActual <= 0) return { label: 'Agotado', clase: 'stock-critico' };
    if (insumo.stockMinimo <= 0) return { label: 'Sin mínimo', clase: 'stock-ok' };
    const ratio = insumo.stockActual / insumo.stockMinimo;
    if (ratio <= 0.5) return { label: 'Crítico', clase: 'stock-critico' };
    if (ratio <= 1) return { label: 'Bajo', clase: 'stock-bajo' };
    return { label: 'OK', clase: 'stock-ok' };
  };

  return (
    <div className="insumo-table__wrapper">
      <table className="insumo-table" role="grid">
        <thead>
          <tr>
            <th scope="col" className="insumo-table__th">Código</th>
            <th scope="col" className="insumo-table__th">Insumo</th>
            <th scope="col" className="insumo-table__th">Categoría</th>
            <th scope="col" className="insumo-table__th">Stock Actual</th>
            <th scope="col" className="insumo-table__th">Stock Mín</th>
            <th scope="col" className="insumo-table__th">Estado Stock</th>
            <th scope="col" className="insumo-table__th">Precio Compra</th>
            <th scope="col" className="insumo-table__th">Proveedor</th>
            <th scope="col" className="insumo-table__th">Estado</th>
            <th scope="col" className="insumo-table__th insumo-table__th--acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {insumos.length === 0 ? (
            <tr>
              <td colSpan={10} className="insumo-table__vacio">
                <div className="insumo-table__vacio-contenido">
                  <span aria-hidden="true">📭</span>
                  <p>No hay insumos que mostrar</p>
                </div>
              </td>
            </tr>
          ) : (
            insumos.map((insumo) => {
              const categoria = obtenerCategoria(insumo.categoriaId);
              const proveedor = obtenerProveedor(insumo.proveedorId);
              const unidad = obtenerUnidadMedida(insumo.unidadMedida);
              const colorEstado = obtenerColorEstado(insumo.estado);
              const estadoStock = obtenerEstadoStock(insumo);

              return (
                <tr
                  key={insumo.id}
                  className={`insumo-table__tr ${insumo.estado === 'Inactivo' ? 'insumo-table__tr--inactivo' : ''} ${insumo.estado === 'Agotado' ? 'insumo-table__tr--agotado' : ''}`}
                >
                  <td className="insumo-table__td insumo-table__td--codigo">
                    <code className="insumo-table__codigo">{insumo.codigo}</code>
                  </td>

                  <td className="insumo-table__td insumo-table__td--nombre">
                    <div className="insumo-table__nombre-wrap">
                      <strong className="insumo-table__nombre">{insumo.nombre}</strong>
                      <span className="insumo-table__unidad">{unidad.etiqueta}</span>
                    </div>
                  </td>

                  <td className="insumo-table__td insumo-table__td--categoria">
                    {categoria && (
                      <span
                        className="insumo-table__categoria"
                        style={{
                          background: `${categoria.color}15`,
                          color: categoria.color,
                          borderColor: `${categoria.color}40`
                        }}
                      >
                        {categoria.nombre}
                      </span>
                    )}
                  </td>

                  <td className="insumo-table__td insumo-table__td--stock">
                    <span className={`insumo-table__stock ${insumo.stockActual <= insumo.stockMinimo && insumo.stockMinimo > 0 ? 'insumo-table__stock--alerta' : ''}`}>
                      {formatearNumero(insumo.stockActual, unidad)} {unidad.valor}
                    </span>
                  </td>

                  <td className="insumo-table__td insumo-table__td--stock-min">
                    <span className="insumo-table__stock-min">{formatearNumero(insumo.stockMinimo, unidad)} {unidad.valor}</span>
                  </td>

                  <td className="insumo-table__td insumo-table__td--estado-stock">
                    <span className={`insumo-table__badge ${estadoStock.clase}`}>
                      {estadoStock.label}
                    </span>
                  </td>

                  <td className="insumo-table__td insumo-table__td--precio">
                    <span className="insumo-table__precio">S/ {insumo.precioCompra.toFixed(2)}</span>
                  </td>

                  <td className="insumo-table__td insumo-table__td--proveedor">
                    <span className="insumo-table__proveedor" title={proveedor?.direccion}>
                      {proveedor?.nombre || '—'}
                    </span>
                  </td>

                  <td className="insumo-table__td insumo-table__td--estado">
                    <span
                      className="insumo-table__badge"
                      style={{ background: colorEstado.bg, color: colorEstado.text, borderColor: colorEstado.border }}
                    >
                      {insumo.estado}
                    </span>
                  </td>

                  <td className="insumo-table__td insumo-table__td--acciones">
                    <div className="insumo-table__acciones">
                      <button
                        className="insumo-table__btn"
                        onClick={() => onEditar(insumo)}
                        aria-label={`Editar ${insumo.nombre}`}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="insumo-table__btn"
                        onClick={() => onEntradaCompra(insumo)}
                        aria-label={`Entrada por compra ${insumo.nombre}`}
                        title="Entrada compra"
                      >
                        📥
                      </button>
                      <button
                        className="insumo-table__btn"
                        onClick={() => onEntradaAjuste(insumo)}
                        aria-label={`Entrada por ajuste ${insumo.nombre}`}
                        title="Entrada ajuste"
                      >
                        📈
                      </button>
                      <button
                        className="insumo-table__btn"
                        onClick={() => onSalidaManual(insumo)}
                        aria-label={`Salida manual ${insumo.nombre}`}
                        title="Salida manual"
                      >
                        📤
                      </button>
                      <button
                        className="insumo-table__btn"
                        onClick={() => onMerma(insumo)}
                        aria-label={`Registrar merma ${insumo.nombre}`}
                        title="Merma"
                      >
                        🗑️
                      </button>
                      <button
                        className="insumo-table__btn"
                        onClick={() => onHistorial(insumo)}
                        aria-label={`Ver historial ${insumo.nombre}`}
                        title="Historial (Kardex)"
                      >
                        📜
                      </button>
                      <button
                        className={`insumo-table__btn ${insumo.estado === 'Activo' ? 'insumo-table__btn--activo' : ''}`}
                        onClick={() => onToggleEstado(insumo.id)}
                        aria-label={insumo.estado === 'Activo' ? `Desactivar ${insumo.nombre}` : `Activar ${insumo.nombre}`}
                        title={insumo.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                      >
                        {insumo.estado === 'Activo' ? '⏸' : '▶️'}
                      </button>
                      <button
                        className="insumo-table__btn insumo-table__btn--eliminar"
                        onClick={() => onEliminar(insumo)}
                        aria-label={`Eliminar ${insumo.nombre}`}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}