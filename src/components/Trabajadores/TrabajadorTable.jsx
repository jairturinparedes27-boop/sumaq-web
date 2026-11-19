// src/components/Trabajadores/TrabajadorTable.jsx
// Tabla de trabajadores con acciones y estados visuales

import './TrabajadorTable.css';

export function TrabajadorTable({
  trabajadores,
  onEditar,
  onEliminar,
  onVerDetalle,
  onToggleEstado,
  obtenerColorEstado,
  obtenerColorCargo,
  obtenerNombreCompleto,
  obtenerIniciales,
  cargando = false
}) {
  if (cargando) {
    return (
      <div className="trabajador-table__wrapper">
        <div className="trabajador-table__loading">
          <div className="trabajador-table__spinner"></div>
          <p>Cargando trabajadores...</p>
        </div>
      </div>
    );
  }

  if (trabajadores.length === 0) {
    return (
      <div className="trabajador-table__wrapper">
        <table className="trabajador-table">
          <thead>
            <tr>
              <th className="trabajador-table__th">Código</th>
              <th className="trabajador-table__th">DNI</th>
              <th className="trabajador-table__th">Nombre</th>
              <th className="trabajador-table__th">Cargo</th>
              <th className="trabajador-table__th">Fecha Ingreso</th>
              <th className="trabajador-table__th">Estado</th>
              <th className="trabajador-table__th">Usuario</th>
              <th className="trabajador-table__th trabajador-table__th--acciones">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="trabajador-table__vacio" colSpan={8}>
                <div className="trabajador-table__vacio-contenido">
                  <span>👥</span>
                  <p>No hay trabajadores que coincidan con los filtros</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="trabajador-table__wrapper">
      <table className="trabajador-table">
        <thead>
          <tr>
            <th className="trabajador-table__th">Código</th>
            <th className="trabajador-table__th">DNI</th>
            <th className="trabajador-table__th">Nombre</th>
            <th className="trabajador-table__th">Cargo</th>
            <th className="trabajador-table__th">Fecha Ingreso</th>
            <th className="trabajador-table__th">Estado</th>
            <th className="trabajador-table__th">Usuario</th>
            <th className="trabajador-table__th trabajador-table__th--acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {trabajadores.map((trabajador) => (
            <tr
              key={trabajador.id}
              className={`trabajador-table__tr ${trabajador.estado === 'Inactivo' ? 'trabajador-table__tr--inactivo' : ''}`}
            >
              {/* Código */}
              <td className="trabajador-table__td">
                <span className="trabajador-table__codigo">{trabajador.codigo}</span>
              </td>

              {/* DNI */}
              <td className="trabajador-table__td">
                <span className="trabajador-table__dni">{trabajador.dni}</span>
              </td>

              {/* Nombre */}
              <td className="trabajador-table__td">
                <div className="trabajador-table__nombre-wrap">
                  <div className="trabajador-table__avatar" style={{ backgroundColor: obtenerColorCargo(trabajador.cargo).bg }}>
                    {obtenerIniciales(trabajador)}
                  </div>
                  <div className="trabajador-table__nombre-info">
                    <span className="trabajador-table__nombre">{obtenerNombreCompleto(trabajador)}</span>
                    {trabajador.email && (
                      <span className="trabajador-table__email">{trabajador.email}</span>
                    )}
                  </div>
                </div>
              </td>

              {/* Cargo */}
              <td className="trabajador-table__td">
                <span
                  className="trabajador-table__cargo-badge"
                  style={{
                    backgroundColor: obtenerColorCargo(trabajador.cargo).bg,
                    color: obtenerColorCargo(trabajador.cargo).text,
                    borderColor: obtenerColorCargo(trabajador.cargo).border
                  }}
                >
                  {trabajador.cargo}
                </span>
              </td>

              {/* Fecha Ingreso */}
              <td className="trabajador-table__td">
                <span className="trabajador-table__fecha">
                  {new Date(trabajador.fechaIngreso).toLocaleDateString('es-PE')}
                </span>
              </td>

              {/* Estado */}
              <td className="trabajador-table__td">
                <span
                  className="trabajador-table__estado-badge"
                  style={{
                    backgroundColor: obtenerColorEstado(trabajador.estado).bg,
                    color: obtenerColorEstado(trabajador.estado).text,
                    borderColor: obtenerColorEstado(trabajador.estado).border
                  }}
                >
                  {obtenerColorEstado(trabajador.estado).icon} {trabajador.estado}
                </span>
              </td>

              {/* Usuario Asociado */}
              <td className="trabajador-table__td">
                {trabajador.usuarioAsociado ? (
                  <div className="trabajador-table__usuario-info">
                    <span className="trabajador-table__usuario-username">{trabajador.usuarioAsociado.username}</span>
                    <span
                      className="trabajador-table__usuario-estado"
                      style={{
                        backgroundColor: trabajador.usuarioAsociado.estado === 'Activo' ? '#E8F5E9' : '#F5F5F5',
                        color: trabajador.usuarioAsociado.estado === 'Activo' ? '#2E7D32' : '#757575',
                        borderColor: trabajador.usuarioAsociado.estado === 'Activo' ? '#81C784' : '#BDBDBD'
                      }}
                    >
                      {trabajador.usuarioAsociado.estado}
                    </span>
                    <span className="trabajador-table__usuario-rol">{trabajador.usuarioAsociado.rolNombre}</span>
                  </div>
                ) : (
                  <span className="trabajador-table__sin-usuario">Sin usuario asignado</span>
                )}
              </td>

              {/* Acciones */}
              <td className="trabajador-table__td trabajador-table__td--acciones">
                <div className="trabajador-table__acciones">
                  <button
                    className="trabajador-table__btn trabajador-table__btn--ver"
                    onClick={() => onVerDetalle(trabajador)}
                    title="Ver detalle"
                    aria-label={`Ver detalle de ${obtenerNombreCompleto(trabajador)}`}
                  >
                    👁
                  </button>
                  <button
                    className="trabajador-table__btn trabajador-table__btn--editar"
                    onClick={() => onEditar(trabajador)}
                    title="Editar"
                    aria-label={`Editar ${obtenerNombreCompleto(trabajador)}`}
                  >
                    ✏️
                  </button>
                  <button
                    className={`trabajador-table__btn trabajador-table__btn--estado ${trabajador.estado === 'Activo' ? 'trabajador-table__btn--desactivar' : 'trabajador-table__btn--activar'}`}
                    onClick={() => onToggleEstado(trabajador.id)}
                    title={trabajador.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                    aria-label={`${trabajador.estado === 'Activo' ? 'Desactivar' : 'Activar'} ${obtenerNombreCompleto(trabajador)}`}
                  >
                    {trabajador.estado === 'Activo' ? '⏸' : '▶️'}
                  </button>
                  <button
                    className="trabajador-table__btn trabajador-table__btn--eliminar"
                    onClick={() => onEliminar(trabajador)}
                    title="Eliminar"
                    aria-label={`Eliminar ${obtenerNombreCompleto(trabajador)}`}
                  >
                    🗑
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}