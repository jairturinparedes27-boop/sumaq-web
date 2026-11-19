// src/pages/Trabajadores/Trabajadores.jsx
// Página principal del módulo Trabajadores

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import { useTrabajadores } from '../../hooks/useTrabajadores';
import { useUsuarios } from '../../hooks/useUsuarios';
import { TrabajadorTable } from '../../components/Trabajadores/TrabajadorTable';
import { TrabajadorFilters } from '../../components/Trabajadores/TrabajadorFilters';
import { TrabajadorModal } from '../../components/Trabajadores/TrabajadorModal';
import { TrabajadorDetalleModal } from '../../components/Trabajadores/TrabajadorDetalleModal';
import './Trabajadores.css';

export function Trabajadores() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const {
    trabajadores,
    cargos,
    cargosActivos,
    cargando,
    error,
    resumen,
    vista,
    setVista,
    filtroBusqueda,
    setFiltroBusqueda,
    filtroCargo,
    setFiltroCargo,
    filtroEstado,
    setFiltroEstado,
    filtroTieneUsuario,
    setFiltroTieneUsuario,
    crearTrabajador,
    editarTrabajador,
    eliminarTrabajador,
    toggleEstadoTrabajador,
    obtenerColorEstado,
    obtenerColorCargo,
    obtenerNombreCompleto,
    obtenerIniciales,
    limpiarFiltros
  } = useTrabajadores();

  const { usuarios } = useUsuarios();

  // Sincronizar usuarios asociados cuando cambien los usuarios
  const { actualizarUsuariosAsociados } = useTrabajadores();
  useEffect(() => {
    if (usuarios.length > 0) {
      actualizarUsuariosAsociados(usuarios);
    }
  }, [usuarios, actualizarUsuariosAsociados]);

  // Estado local para modales
  const [modalAbierto, setModalAbierto] = useState(false);
  const [trabajadorEditando, setTrabajadorEditando] = useState(null);
  const [trabajadorDetalle, setTrabajadorDetalle] = useState(null);
  const [trabajadorEliminando, setTrabajadorEliminando] = useState(null);
  const [modalCargando, setModalCargando] = useState(false);

  // Handlers
  const handleNuevoTrabajador = useCallback(() => {
    setTrabajadorEditando(null);
    setModalAbierto(true);
  }, []);

  const handleEditarTrabajador = useCallback((trabajador) => {
    setTrabajadorEditando(trabajador);
    setModalAbierto(true);
  }, []);

  const handleVerDetalle = useCallback((trabajador) => {
    setTrabajadorDetalle(trabajador);
  }, []);

  const handleToggleEstado = useCallback(async (id) => {
    try {
      await toggleEstadoTrabajador(id);
    } catch (err) {
      console.error('Error al cambiar estado:', err);
    }
  }, [toggleEstadoTrabajador]);

  const handleEliminar = useCallback((trabajador) => {
    setTrabajadorEliminando(trabajador);
  }, []);

  const confirmarEliminar = useCallback(async () => {
    if (!trabajadorEliminando) return;
    try {
      setModalCargando(true);
      await eliminarTrabajador(trabajadorEliminando.id);
      setTrabajadorEliminando(null);
    } catch (err) {
      console.error('Error al eliminar:', err);
    } finally {
      setModalCargando(false);
    }
  }, [trabajadorEliminando, eliminarTrabajador]);

  const handleSubmitModal = useCallback(async (datos) => {
    try {
      setModalCargando(true);
      if (trabajadorEditando) {
        await editarTrabajador(trabajadorEditando.id, datos);
      } else {
        await crearTrabajador(datos);
      }
      setModalAbierto(false);
      setTrabajadorEditando(null);
    } catch (err) {
      // Error manejado en el modal (validation errors)
      console.error('Error en submit:', err);
    } finally {
      setModalCargando(false);
    }
  }, [trabajadorEditando, crearTrabajador, editarTrabajador]);

  const handleCerrarModal = useCallback(() => {
    setModalAbierto(false);
    setTrabajadorEditando(null);
  }, []);

  const handleCerrarDetalle = useCallback(() => {
    setTrabajadorDetalle(null);
  }, []);

  const handleCancelarEliminar = useCallback(() => {
    setTrabajadorEliminando(null);
  }, []);

  if (cargando) {
    return (
      <div className="trabajadores-layout">
        <Sidebar
          abierto={menuAbierto}
          onCerrar={() => setMenuAbierto(false)}
        />

        <main className="trabajadores-content">
          <Header onAbrirMenu={() => setMenuAbierto(true)} />

          <div className="trabajadores-page">
            <div className="trabajadores-page__loading">
              <div className="trabajadores-page__spinner"></div>
              <p>Cargando trabajadores...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="trabajadores-layout">
      <Sidebar
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
      />

      <main className="trabajadores-content">
        <Header onAbrirMenu={() => setMenuAbierto(true)} />

        <div className="trabajadores-page">
          {/* Error */}
          {error && (
            <div className="trabajadores-page__error">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Header */}
          <header className="trabajadores-page__header">
            <div className="trabajadores-page__header-main">
              <div className="trabajadores-page__titulos">
                <h1 className="trabajadores-page__titulo">Trabajadores</h1>
                <p className="trabajadores-page__subtitulo">
                  Gestión de personal del restaurante
                </p>
              </div>
              <div className="trabajadores-page__acciones">
                <button
                  className="trabajadores-page__btn trabajadores-page__btn--primaria"
                  onClick={handleNuevoTrabajador}
                  disabled={cargando}
                >
                  <span>➕</span> Nuevo Trabajador
                </button>
              </div>
            </div>

            {/* Resumen */}
            <div className="trabajadores-page__resumen">
              <div className="trabajadores-page__resumen-item">
                <span className="trabajadores-page__resumen-icon">👥</span>
                <div>
                  <span className="trabajadores-page__resumen-valor">{resumen.total}</span>
                  <span className="trabajadores-page__resumen-label">Total</span>
                </div>
              </div>
              <div className="trabajadores-page__resumen-item trabajadores-page__resumen--activos">
                <span className="trabajadores-page__resumen-icon">✅</span>
                <div>
                  <span className="trabajadores-page__resumen-valor">{resumen.activos}</span>
                  <span className="trabajadores-page__resumen-label">Activos</span>
                </div>
              </div>
              <div className="trabajadores-page__resumen-item trabajadores-page__resumen--inactivos">
                <span className="trabajadores-page__resumen-icon">⏸</span>
                <div>
                  <span className="trabajadores-page__resumen-valor">{resumen.inactivos}</span>
                  <span className="trabajadores-page__resumen-label">Inactivos</span>
                </div>
              </div>
              <div className="trabajadores-page__resumen-item trabajadores-page__resumen--con-trab">
                <span className="trabajadores-page__resumen-icon">👤</span>
                <div>
                  <span className="trabajadores-page__resumen-valor">{resumen.conUsuario}</span>
                  <span className="trabajadores-page__resumen-label">Con Usuario</span>
                </div>
              </div>
              <div className="trabajadores-page__resumen-item trabajadores-page__resumen--sin-trab">
                <span className="trabajadores-page__resumen-icon">➖</span>
                <div>
                  <span className="trabajadores-page__resumen-valor">{resumen.sinUsuario}</span>
                  <span className="trabajadores-page__resumen-label">Sin Usuario</span>
                </div>
              </div>
              <div className="trabajadores-page__resumen-item">
                <span className="trabajadores-page__resumen-icon">📋</span>
                <div>
                  <span className="trabajadores-page__resumen-valor">{resumen.mostrados}</span>
                  <span className="trabajadores-page__resumen-label">Mostrados</span>
                </div>
              </div>
            </div>
          </header>

          {/* Filtros */}
          <TrabajadorFilters
            filtroBusqueda={filtroBusqueda}
            setFiltroBusqueda={setFiltroBusqueda}
            filtroCargo={filtroCargo}
            setFiltroCargo={setFiltroCargo}
            filtroEstado={filtroEstado}
            setFiltroEstado={setFiltroEstado}
            filtroTieneUsuario={filtroTieneUsuario}
            setFiltroTieneUsuario={setFiltroTieneUsuario}
            vista={vista}
            setVista={setVista}
            cargosActivos={cargosActivos}
            resumen={resumen}
            onLimpiarFiltros={limpiarFiltros}
            cargando={cargando}
          />

          {/* Tabla */}
          <div className="trabajadores-page__table-container">
            <TrabajadorTable
              trabajadores={trabajadores}
              onEditar={handleEditarTrabajador}
              onEliminar={handleEliminar}
              onVerDetalle={handleVerDetalle}
              onToggleEstado={handleToggleEstado}
              obtenerColorEstado={obtenerColorEstado}
              obtenerColorCargo={obtenerColorCargo}
              obtenerNombreCompleto={obtenerNombreCompleto}
              obtenerIniciales={obtenerIniciales}
              cargando={cargando}
            />
          </div>
        </div>
      </main>

      {/* Modal Crear/Editar */}
      <TrabajadorModal
        isOpen={modalAbierto}
        onClose={handleCerrarModal}
        onSubmit={handleSubmitModal}
        initialData={trabajadorEditando}
        cargosActivos={cargosActivos}
        cargando={modalCargando}
        titulo={trabajadorEditando ? 'Editar Trabajador' : 'Nuevo Trabajador'}
      />

      {/* Modal Detalle */}
      <TrabajadorDetalleModal
        isOpen={!!trabajadorDetalle}
        onClose={handleCerrarDetalle}
        trabajador={trabajadorDetalle}
        obtenerColorEstado={obtenerColorEstado}
        obtenerColorCargo={obtenerColorCargo}
        obtenerNombreCompleto={obtenerNombreCompleto}
        obtenerIniciales={obtenerIniciales}
        cargos={cargos}
      />

      {/* Modal Confirmar Eliminar */}
      {trabajadorEliminando && (
        <div className="modal-overlay" onClick={handleCancelarEliminar} role="dialog" aria-modal="true" aria-labelledby="eliminar-titulo">
          <div className="trabajador-modal" onClick={e => e.stopPropagation()}>
            <div className="trabajador-modal__header">
              <h2 id="eliminar-titulo" className="trabajador-modal__titulo">Confirmar Eliminación</h2>
              <button
                className="trabajador-modal__close"
                onClick={handleCancelarEliminar}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            <div className="trabajador-modal__form" style="padding: 24px; text-align: center;">
              <p style="margin: 0 0 16px 0; color: #44271D; font-size: 1rem;">
                ¿Está seguro de eliminar a <strong>{obtenerNombreCompleto(trabajadorEliminando)}</strong>?
              </p>
              <p style="margin: 0 0 24px 0; color: #8B6B5A; font-size: 0.85rem;">
                Código: {trabajadorEliminando.codigo} • DNI: {trabajadorEliminando.dni}
                {trabajadorEliminando.usuarioAsociado && (
                  <>
                    <br />
                    <span style={{ color: '#F57F17', fontWeight: 600 }}>
                      ADVERTENCIA: Tiene usuario asociado: {trabajadorEliminando.usuarioAsociado.username}
                    </span>
                  </>
                )}
              </p>
              <div className="trabajador-modal__actions">
                <button
                  className="trabajador-modal__btn trabajador-modal__btn--cancelar"
                  onClick={handleCancelarEliminar}
                  disabled={modalCargando}
                >
                  Cancelar
                </button>
                <button
                  className="trabajador-modal__btn trabajador-modal__btn--guardar trabajador-modal__btn--eliminar"
                  onClick={confirmarEliminar}
                  disabled={modalCargando}
                  style="background: #C62828;"
                >
                  {modalCargando ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Trabajadores