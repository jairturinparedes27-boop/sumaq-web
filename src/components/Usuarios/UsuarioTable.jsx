// src/components/Usuarios/UsuarioTable.jsx
// Tabla de usuarios para vista tabla

import './UsuarioTable.css';

export function UsuarioTable({
  usuarios,
  onEditar,
  onEliminar,
  onToggleEstado,
  onCambiarPassword,
  onResetearPassword,
  onDesbloquear,
  onVincularTrabajador,
  onDesvincularTrabajador,
  trabajadoresSinUsuario,
  obtenerColorEstado,
  obtenerColorNivelRol,
  obtenerRol,
  ESTADOS_USUARIO
}) {
  const formatearFecha = (fecha) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const obtenerProximoEstado = (estadoActual) => {
    const idx = ESTADOS_USUARIO.indexOf(estadoActual);
    return ESTADOS_USUARIO[(idx + 1) % ESTADOS_USUARIO.length];
  };

  return (
    <div className="usuario-table__wrapper">
      <table className="usuario-table" role="grid">
        <thead>
          <tr>
            <th scope="col" className="usuario-table__th">Código</th>
            <th scope="col" className="usuario-table__th">Usuario</th>
            <th scope="col" className="usuario-table__th">Trabajador</th>
            <th scope="col" className="usuario-table__th">Rol</th>
            <th scope="col" className="usuario-table__th">Estado</th>
            <th scope="col" className="usuario-table__th">Último Acceso</th>
            <th scope="col" className="usuario-table__th">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan={7} className="usuario-table__vacio">
                <div className="usuario-table__vacio-contenido">
                  <span aria-hidden="true">👥</span>
                  <p>No hay usuarios que mostrar</p>
                </div>
              </td>
            </tr>
          ) : (
            usuarios.map((usuario) => {
              const colorEstado = obtenerColorEstado(usuario.estado);
              const rol = obtenerRol(usuario.rolId);
              const colorNivel = rol ? obtenerColorNivelRol(rol.nivel) : { bg: '#F5F5F5', text: '#333', border: '#DDD', label: '—' };
              const proximoEstado = obtenerProximoEstado(usuario.estado);
              const tieneTrabajador = !!usuario.trabajadorId;

              return (
                <tr
                  key={usuario.id}
                  className={`usuario-table__tr ${usuario.estado === 'Inactivo' ? 'usuario-table__tr--inactivo' : ''} ${usuario.estado === 'Bloqueado' ? 'usuario-table__tr--bloqueado' : ''} ${usuario.estado === 'Pendiente' ? 'usuario-table__tr--pendiente' : ''}`}
                >
                  <td className="usuario-table__td usuario-table__td--codigo">
                    <code className="usuario-table__codigo">{usuario.codigo}</code>
                  </td>

                  <td className="usuario-table__td usuario-table__td--username">
                    <div className="usuario-table__username-wrap">
                      <strong className="usuario-table__username">{usuario.username}</strong>
                      {usuario.debeCambiarPassword && (
                        <span className="usuario-table__badge-pass" title="Debe cambiar contraseña en próximo ingreso">🔑</span>
                      )}
                    </div>
                  </td>

                  <td className="usuario-table__td usuario-table__td--trabajador">
                    {tieneTrabajador ? (
                      <div className="usuario-table__trabajador-info">
                        <span className="usuario-table__trabajador-nombre">{usuario.trabajadorNombre}</span>
                        <span className="usuario-table__trabajador-codigo">{usuario.trabajadorCodigo}</span>
                      </div>
                    ) : (
                      <span className="usuario-table__sin-trabajador">Sin asignar</span>
                    )}
                  </td>

                  <td className="usuario-table__td usuario-table__td--rol">
                    <span
                      className="usuario-table__rol-badge"
                      style={{
                        background: colorNivel.bg,
                        color: colorNivel.text,
                        borderColor: colorNivel.border
                      }}
                    >
                      {rol ? `${colorNivel.label} · ${rol.nombre}` : usuario.rolNombre}
                    </span>
                  </td>

                  <td className="usuario-table__td usuario-table__td--estado">
                    <span
                      className="usuario-table__estado-badge"
                      style={{ background: colorEstado.bg, color: colorEstado.text, borderColor: colorEstado.border }}
                    >
                      {colorEstado.icon} {usuario.estado}
                    </span>
                  </td>

                  <td className="usuario-table__td usuario-table__td--ultimo-acceso">
                    <span className="usuario-table__fecha">{formatearFecha(usuario.ultimoAcceso)}</span>
                  </td>

                  <td className="usuario-table__td usuario-table__td--acciones">
                    <div className="usuario-table__acciones">
                      <button
                        className="usuario-table__btn"
                        onClick={() => onEditar(usuario)}
                        aria-label={`Editar ${usuario.username}`}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="usuario-table__btn"
                        onClick={() => onCambiarPassword(usuario)}
                        aria-label={`Cambiar contraseña ${usuario.username}`}
                        title="Cambiar contraseña"
                      >
                        🔑
                      </button>
                      <button
                        className="usuario-table__btn"
                        onClick={() => onResetearPassword(usuario)}
                        aria-label={`Restablecer contraseña ${usuario.username}`}
                        title="Restablecer contraseña (admin)"
                      >
                        🔄
                      </button>
                      {usuario.estado === 'Bloqueado' && (
                        <button
                          className="usuario-table__btn usuario-table__btn--desbloquear"
                          onClick={() => onDesbloquear(usuario)}
                          aria-label={`Desbloquear ${usuario.username}`}
                          title="Desbloquear usuario"
                        >
                          🔓
                        </button>
                      )}
                      {!tieneTrabajador && trabajadoresSinUsuario.length > 0 && (
                        <button
                          className="usuario-table__btn"
                          onClick={() => onVincularTrabajador(usuario, trabajadoresSinUsuario[0].id)}
                          aria-label={`Vincular trabajador ${usuario.username}`}
                          title="Vincular trabajador"
                        >
                          🔗
                        </button>
                      )}
                      {tieneTrabajador && (
                        <button
                          className="usuario-table__btn"
                          onClick={() => onDesvincularTrabajador(usuario)}
                          aria-label={`Desvincular trabajador ${usuario.username}`}
                          title="Desvincular trabajador"
                        >
                          🔗✕
                        </button>
                      )}
                      <button
                        className={`usuario-table__btn ${usuario.estado === 'Activo' ? 'usuario-table__btn--activo' : ''}`}
                        onClick={() => onToggleEstado(usuario.id)}
                        aria-label={`${usuario.estado === 'Activo' ? 'Desactivar' : 'Activar'} ${usuario.username}`}
                        title={`${usuario.estado === 'Activo' ? 'Desactivar' : 'Siguiente: ' + proximoEstado}`}
                      >
                        {usuario.estado === 'Activo' ? '⏸' : '▶️'}
                      </button>
                      <button
                        className="usuario-table__btn usuario-table__btn--eliminar"
                        onClick={() => onEliminar(usuario)}
                        aria-label={`Eliminar ${usuario.username}`}
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