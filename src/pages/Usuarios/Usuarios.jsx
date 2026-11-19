// src/pages/Usuarios/Usuarios.jsx
// Página principal del módulo Usuarios y Permisos

import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import { UsuarioTable } from '../../components/Usuarios/UsuarioTable';
import { UsuarioFilters } from '../../components/Usuarios/UsuarioFilters';
import { UsuarioModal } from '../../components/Usuarios/UsuarioModal';
import { PasswordModal } from '../../components/Usuarios/PasswordModal';
import { RolManager } from '../../components/Usuarios/RolManager';
import { useUsuarios } from '../../hooks/useUsuarios';
import './Usuarios.css';

export default function Usuarios() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [usuarioEliminando, setUsuarioEliminando] = useState(null);
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);
  const [passwordAbierto, setPasswordAbierto] = useState(null); // { tipo, usuario }
  const [rolManagerAbierto, setRolManagerAbierto] = useState(false);

  const {
    usuarios,
    roles,
    rolesActivos,
    trabajadoresSinUsuario,
    cargando,
    error,
    resumen,
    vista,
    setVista,
    filtroBusqueda,
    setFiltroBusqueda,
    filtroEstado,
    setFiltroEstado,
    filtroRol,
    setFiltroRol,
    filtroTieneTrabajador,
    setFiltroTieneTrabajador,
    crearUsuario,
    editarUsuario,
    eliminarUsuario,
    toggleEstadoUsuario,
    cambiarPassword,
    resetearPassword,
    desbloquearUsuario,
    vincularTrabajador,
    desvincularTrabajador,
    crearRol,
    editarRol,
    eliminarRol,
    toggleRolActivo,
    resetearDatos,
    limpiarFiltros,
    obtenerColorEstado,
    obtenerColorNivelRol,
    obtenerRol,
    CATALOGO_PERMISOS,
    ESTADOS_USUARIO
  } = useUsuarios();

  // Handlers
  const manejarNuevoUsuario = () => {
    setUsuarioEditando(null);
  };

  const manejarEditarUsuario = (usuario) => {
    setUsuarioEditando(usuario);
  };

  const manejarEliminarUsuario = (usuario) => {
    setUsuarioEliminando(usuario);
    setMostrarConfirmacionEliminar(true);
  };

  const manejarConfirmarEliminar = async () => {
    if (usuarioEliminando) {
      try {
        await eliminarUsuario(usuarioEliminando.id);
        setMostrarConfirmacionEliminar(false);
        setUsuarioEliminando(null);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const manejarGuardarUsuario = async (datos) => {
    if (usuarioEditando) {
      await editarUsuario(usuarioEditando.id, datos);
    } else {
      await crearUsuario(datos);
    }
    setUsuarioEditando(null);
  };

  const manejarResetearDatos = async () => {
    if (window.confirm('¿Restablecer datos de prueba? Se perderán todos los cambios.')) {
      await resetearDatos();
    }
  };

  const manejarLimpiarFiltros = () => {
    limpiarFiltros();
  };

  const manejarCambiarPassword = (usuario) => {
    setPasswordAbierto({ tipo: 'cambiar', usuario });
  };

  const manejarResetearPassword = (usuario) => {
    setPasswordAbierto({ tipo: 'resetear', usuario });
  };

  const manejarDesbloquear = async (usuario) => {
    if (window.confirm(`¿Desbloquear a ${usuario.username}?`)) {
      await desbloquearUsuario(usuario.id);
    }
  };

  const manejarVincularTrabajador = async (usuario, trabajadorId) => {
    try {
      await vincularTrabajador(usuario.id, trabajadorId);
    } catch (error) {
      alert(error.message);
    }
  };

  const manejarDesvincularTrabajador = async (usuario) => {
    if (window.confirm(`¿Desvincular trabajador de ${usuario.username}? El usuario quedará en estado "Pendiente".`)) {
      await desvincularTrabajador(usuario.id);
    }
  };

  const manejarGuardarPassword = async (datos) => {
    if (!passwordAbierto) return;
    const { tipo, usuario } = passwordAbierto;
    if (tipo === 'cambiar') {
      await cambiarPassword(usuario.id, datos.passwordActual, datos.passwordNueva, datos.confirmarPassword);
    } else {
      await resetearPassword(usuario.id, datos.passwordNueva, datos.confirmarPassword);
    }
    setPasswordAbierto(null);
  };

  const manejarAbrirRoles = () => {
    setRolManagerAbierto(true);
  };

  // Loading
  if (cargando) {
    return (
      <div className="usuarios-layout">
        <Sidebar abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />
        <main className="usuarios-content">
          <Header onAbrirMenu={() => setMenuAbierto(true)} />
          <div className="usuarios-page">
            <div className="usuarios-page__loading" role="status" aria-label="Cargando usuarios">
              <div className="usuarios-page__spinner" aria-hidden="true"></div>
              <p>Cargando usuarios y permisos...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="usuarios-layout">
      <Sidebar
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
      />

      <main className="usuarios-content">
        <Header onAbrirMenu={() => setMenuAbierto(true)} />

        <div className="usuarios-page">
          {/* ===== HEADER ===== */}
          <header className="usuarios-page__header">
            <div className="usuarios-page__header-main">
              <div className="usuarios-page__titulos">
                <h1 className="usuarios-page__titulo">Usuarios y Permisos</h1>
                <p className="usuarios-page__subtitulo">Administra cuentas de acceso y roles del sistema</p>
              </div>

              <div className="usuarios-page__acciones">
                <button
                  className="usuarios-page__btn usuarios-page__btn--secundaria"
                  onClick={manejarResetearDatos}
                  title="Restablecer datos de prueba"
                  aria-label="Restablecer datos de prueba"
                >
                  <span aria-hidden="true">↻</span>
                </button>
                <button
                  className="usuarios-page__btn usuarios-page__btn--secundaria"
                  onClick={manejarAbrirRoles}
                  aria-label="Gestionar roles y permisos"
                >
                  <span aria-hidden="true">🛡️</span> Roles
                </button>
                {resumen.bloqueados > 0 && (
                  <button
                    className="usuarios-page__btn usuarios-page__btn--alerta"
                    aria-label={`${resumen.bloqueados} usuario(s) bloqueado(s)`}
                  >
                    <span aria-hidden="true">🔒</span> Bloqueados ({resumen.bloqueados})
                  </button>
                )}
                {resumen.debenCambiarPass > 0 && (
                  <button
                    className="usuarios-page__btn usuarios-page__btn--alerta"
                    aria-label={`${resumen.debenCambiarPass} usuario(s) deben cambiar contraseña`}
                  >
                    <span aria-hidden="true">🔑</span> Cambiar pass ({resumen.debenCambiarPass})
                  </button>
                )}
                <button
                  className="usuarios-page__btn usuarios-page__btn--primaria"
                  onClick={manejarNuevoUsuario}
                  aria-label="Crear nuevo usuario"
                >
                  <span aria-hidden="true">+</span> Nuevo usuario
                </button>
              </div>
            </div>

            {/* Resumen */}
            <div className="usuarios-page__resumen" role="region" aria-label="Resumen de usuarios">
              <div className="usuarios-page__resumen-item">
                <span className="usuarios-page__resumen-icon" aria-hidden="true">👥</span>
                <div>
                  <span className="usuarios-page__resumen-valor">{resumen.total}</span>
                  <span className="usuarios-page__resumen-label">Total Usuarios</span>
                </div>
              </div>
              <div className="usuarios-page__resumen-item usuarios-page__resumen--activos">
                <span className="usuarios-page__resumen-icon" aria-hidden="true">✅</span>
                <div>
                  <span className="usuarios-page__resumen-valor">{resumen.activos}</span>
                  <span className="usuarios-page__resumen-label">Activos</span>
                </div>
              </div>
              <div className="usuarios-page__resumen-item usuarios-page__resumen--inactivos">
                <span className="usuarios-page__resumen-icon" aria-hidden="true">⏸</span>
                <div>
                  <span className="usuarios-page__resumen-valor">{resumen.inactivos}</span>
                  <span className="usuarios-page__resumen-label">Inactivos</span>
                </div>
              </div>
              <div className="usuarios-page__resumen-item usuarios-page__resumen--bloqueados">
                <span className="usuarios-page__resumen-icon" aria-hidden="true">🔒</span>
                <div>
                  <span className="usuarios-page__resumen-valor">{resumen.bloqueados}</span>
                  <span className="usuarios-page__resumen-label">Bloqueados</span>
                </div>
              </div>
              <div className="usuarios-page__resumen-item usuarios-page__resumen--pendientes">
                <span className="usuarios-page__resumen-icon" aria-hidden="true">⏳</span>
                <div>
                  <span className="usuarios-page__resumen-valor">{resumen.pendientes}</span>
                  <span className="usuarios-page__resumen-label">Pendientes</span>
                </div>
              </div>
              <div className="usuarios-page__resumen-item">
                <span className="usuarios-page__resumen-icon" aria-hidden="true">🔗</span>
                <div>
                  <span className="usuarios-page__resumen-valor">{resumen.conTrabajador}</span>
                  <span className="usuarios-page__resumen-label">Con Trabajador</span>
                </div>
              </div>
              <div className="usuarios-page__resumen-item usuarios-page__resumen--sin-trabajador">
                <span className="usuarios-page__resumen-icon" aria-hidden="true">⚠</span>
                <div>
                  <span className="usuarios-page__resumen-valor">{resumen.sinTrabajador}</span>
                  <span className="usuarios-page__resumen-label">Sin Trabajador</span>
                </div>
              </div>
            </div>
          </header>

          {/* ===== FILTROS ===== */}
          <UsuarioFilters
            filtroBusqueda={filtroBusqueda}
            onChangeBusqueda={setFiltroBusqueda}
            filtroEstado={filtroEstado}
            onChangeEstado={setFiltroEstado}
            filtroRol={filtroRol}
            onChangeRol={setFiltroRol}
            filtroTieneTrabajador={filtroTieneTrabajador}
            onChangeTieneTrabajador={setFiltroTieneTrabajador}
            roles={rolesActivos}
            resumen={resumen}
            usuariosCount={usuarios.length}
            onLimpiarFiltros={manejarLimpiarFiltros}
            vista={vista}
            onChangeVista={setVista}
          />

          {/* ===== ERROR ===== */}
          {error && (
            <div className="usuarios-page__error" role="alert">
              <span aria-hidden="true">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* ===== VISTA TABLA ===== */}
          <section className="usuarios-page__vista" aria-label="Listado de usuarios">
            <UsuarioTable
              usuarios={usuarios}
              onEditar={manejarEditarUsuario}
              onEliminar={manejarEliminarUsuario}
              onToggleEstado={toggleEstadoUsuario}
              onCambiarPassword={manejarCambiarPassword}
              onResetearPassword={manejarResetearPassword}
              onDesbloquear={manejarDesbloquear}
              onVincularTrabajador={manejarVincularTrabajador}
              onDesvincularTrabajador={manejarDesvincularTrabajador}
              trabajadoresSinUsuario={trabajadoresSinUsuario}
              obtenerColorEstado={obtenerColorEstado}
              obtenerColorNivelRol={obtenerColorNivelRol}
              obtenerRol={obtenerRol}
              ESTADOS_USUARIO={ESTADOS_USUARIO}
            />
          </section>

          {/* ===== MODAL USUARIO ===== */}
          <UsuarioModal
            abierto={!!usuarioEditando}
            onCerrar={() => setUsuarioEditando(null)}
            usuario={usuarioEditando}
            roles={rolesActivos}
            trabajadores={trabajadoresSinUsuario}
            estados={ESTADOS_USUARIO}
            onGuardar={manejarGuardarUsuario}
            obtenerRol={obtenerRol}
          />

          {/* ===== MODAL CONFIRMACIÓN ELIMINAR ===== */}
          {mostrarConfirmacionEliminar && (
            <div className="usuario-modal__overlay" onClick={() => setMostrarConfirmacionEliminar(false)} role="dialog" aria-modal="true" aria-labelledby="confirmar-eliminar-titulo">
              <div className="usuario-modal usuario-modal--confirmar" onClick={(e) => e.stopPropagation()}>
                <header className="usuario-modal__header">
                  <h2 id="confirmar-eliminar-titulo" className="usuario-modal__titulo">Eliminar usuario</h2>
                </header>
                <div className="usuario-modal__form" style={{ padding: '24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }} aria-hidden="true">🗑️</div>
                  <h3 style={{ margin: '12px 0 8px', color: '#44271D' }}>
                    ¿Eliminar <strong>{usuarioEliminando?.username}</strong>?
                  </h3>
                  <p style={{ color: '#8B6B5A', margin: 0 }}>
                    Trabajador: {usuarioEliminando?.trabajadorNombre} · Rol: {usuarioEliminando?.rolNombre}
                  </p>
                  <p style={{ color: '#C62828', margin: '8px 0 0', fontSize: '0.85rem', fontWeight: 600 }}>
                    ⚠ No se puede eliminar el último administrador activo
                  </p>
                  <p style={{ color: '#8B6B5A', margin: '8px 0 0', fontSize: '0.85rem' }}>
                    Esta acción no se puede deshacer.
                  </p>
                </div>
                <footer className="usuario-modal__footer">
                  <button
                    className="usuario-modal__btn usuario-modal__btn--cancelar"
                    onClick={() => setMostrarConfirmacionEliminar(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="usuario-modal__btn usuario-modal__btn--eliminar"
                    onClick={manejarConfirmarEliminar}
                  >
                    <span aria-hidden="true">🗑️</span> Eliminar
                  </button>
                </footer>
              </div>
            </div>
          )}

          {/* ===== MODAL PASSWORD ===== */}
          <PasswordModal
            abierto={!!passwordAbierto}
            onCerrar={() => setPasswordAbierto(null)}
            datos={passwordAbierto}
            onGuardar={manejarGuardarPassword}
          />

          {/* ===== ROL MANAGER ===== */}
          <RolManager
            abierto={rolManagerAbierto}
            onCerrar={() => setRolManagerAbierto(false)}
            roles={roles}
            onCrear={crearRol}
            onEditar={editarRol}
            onEliminar={eliminarRol}
            onToggleActivo={toggleRolActivo}
            CATALOGO_PERMISOS={CATALOGO_PERMISOS}
            obtenerColorNivelRol={obtenerColorNivelRol}
          />
        </div>
      </main>
    </div>
  );
}