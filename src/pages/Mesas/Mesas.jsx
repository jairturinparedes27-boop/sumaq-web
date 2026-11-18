// src/pages/Mesas/Mesas.jsx
// Página principal del módulo Mesas

import { useState } from 'react';
import { useMesas } from '../../hooks/useMesas';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import { MesaCard } from '../../components/Mesas/MesaCard';
import { MesaFilters } from '../../components/Mesas/MesaFilters';
import { MesaModal } from '../../components/Mesas/MesaModal';
import './Mesas.css';

export default function Mesas() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const {
    mesas,
    cargando,
    error,
    resumen,
    zonasUnicas,
    filtroBusqueda,
    setFiltroBusqueda,
    filtroEstado,
    setFiltroEstado,
    filtroZona,
    setFiltroZona,
    crearMesa,
    editarMesa,
    eliminarMesa,
    cambiarEstado,
    resetearDatos
  } = useMesas();

  // Estado local para modales
  const [mesaEditando, setMesaEditando] = useState(null);
  const [mesaEliminando, setMesaEliminando] = useState(null);
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);

  // Handlers
  const manejarNuevaMesa = () => {
    setMesaEditando(null); // null = crear nueva
  };

  const manejarEditarMesa = (mesa) => {
    setMesaEditando(mesa);
  };

  const manejarEliminarMesa = (mesa) => {
    setMesaEliminando(mesa);
    setMostrarConfirmacionEliminar(true);
  };

  const manejarConfirmarEliminar = async () => {
    if (mesaEliminando) {
      await eliminarMesa(mesaEliminando.id);
      setMostrarConfirmacionEliminar(false);
      setMesaEliminando(null);
    }
  };

  const manejarGuardarMesa = async (datos) => {
    if (mesaEditando) {
      await editarMesa(mesaEditando.id, datos);
    } else {
      await crearMesa(datos);
    }
    setMesaEditando(null);
  };

  const manejarClickMesa = (mesa) => {
    // Aquí se conectará con el módulo Pedidos en el futuro
    console.log('Comenzar pedido / Ver mesa:', mesa);
    // TODO: Navegar a /pedidos/nuevo?mesa=${mesa.id}
  };

  const manejarCambiarEstado = async (id, nuevoEstado) => {
    await cambiarEstado(id, nuevoEstado);
  };

  const manejarLimpiarFiltros = () => {
    setFiltroBusqueda('');
    setFiltroEstado('Todos');
    setFiltroZona('Todas');
  };

  const manejarResetearDatos = async () => {
    if (window.confirm('¿Seguro que quieres restablecer los datos de fábrica? Se perderán todos los cambios.')) {
      await resetearDatos();
    }
  };

  // Si está cargando
  if (cargando) {
    return (
      <div className="mesas-layout">
        <Sidebar
          abierto={menuAbierto}
          onCerrar={() => setMenuAbierto(false)}
        />
        <main className="mesas-content">
          <Header onAbrirMenu={() => setMenuAbierto(true)} />
          <div className="mesas-page">
            <div className="mesas-page__loading" role="status" aria-label="Cargando mesas">
              <div className="mesas-page__spinner" aria-hidden="true"></div>
              <p>Cargando mesas...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="mesas-layout">
      <Sidebar
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
      />

      <main className="mesas-content">
        <Header onAbrirMenu={() => setMenuAbierto(true)} />

        <div className="mesas-page">
          {/* ===== HEADER DEL MÓDULO ===== */}
          <header className="mesas-page__header">
            <div className="mesas-page__header-main">
              <div className="mesas-page__titulos">
                <h1 className="mesas-page__titulo">Mesas</h1>
                <p className="mesas-page__subtitulo">Administra las mesas del restaurante</p>
              </div>

              <div className="mesas-page__acciones">
                <button
                  className="mesas-page__btn mesas-page__btn--secundaria"
                  onClick={manejarResetearDatos}
                  title="Restablecer datos de prueba"
                >
                  <span aria-hidden="true">↻</span>
                </button>
                <button
                  className="mesas-page__btn mesas-page__btn--primaria"
                  onClick={manejarNuevaMesa}
                  aria-label="Crear nueva mesa"
                >
                  <span aria-hidden="true">+</span> Nueva mesa
                </button>
              </div>
            </div>

            {/* Resumen de estados */}
            <div className="mesas-page__resumen" role="region" aria-label="Resumen de mesas por estado">
              <div className="mesas-page__resumen-item mesas-page__resumen--disponible">
                <span className="mesas-page__resumen-icon" aria-hidden="true">🟢</span>
                <div>
                  <span className="mesas-page__resumen-valor">{resumen.disponibles}</span>
                  <span className="mesas-page__resumen-label">Disponibles</span>
                </div>
              </div>
              <div className="mesas-page__resumen-item mesas-page__resumen--ocupada">
                <span className="mesas-page__resumen-icon" aria-hidden="true">🔴</span>
                <div>
                  <span className="mesas-page__resumen-valor">{resumen.ocupadas}</span>
                  <span className="mesas-page__resumen-label">Ocupadas</span>
                </div>
              </div>
              <div className="mesas-page__resumen-item mesas-page__resumen--reservada">
                <span className="mesas-page__resumen-icon" aria-hidden="true">🟡</span>
                <div>
                  <span className="mesas-page__resumen-valor">{resumen.reservadas}</span>
                  <span className="mesas-page__resumen-label">Reservadas</span>
                </div>
              </div>
              <div className="mesas-page__resumen-item mesas-page__resumen--total">
                <span className="mesas-page__resumen-icon" aria-hidden="true">▦</span>
                <div>
                  <span className="mesas-page__resumen-valor">{resumen.total}</span>
                  <span className="mesas-page__resumen-label">Total</span>
                </div>
              </div>
            </div>
          </header>

          {/* ===== FILTROS ===== */}
          <MesaFilters
            filtroBusqueda={filtroBusqueda}
            onChangeBusqueda={setFiltroBusqueda}
            filtroEstado={filtroEstado}
            onChangeEstado={setFiltroEstado}
            filtroZona={filtroZona}
            onChangeZona={setFiltroZona}
            zonasDisponibles={zonasUnicas}
            totalMesas={resumen.total}
            mesasFiltradasCount={mesas.length}
            onLimpiarFiltros={manejarLimpiarFiltros}
          />

          {/* ===== MENSAJE DE ERROR ===== */}
          {error && (
            <div className="mesas-page__error" role="alert">
              <span aria-hidden="true">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* ===== GRID DE MESAS ===== */}
          <section className="mesas-page__grid" aria-label="Listado de mesas">
            {mesas.length === 0 ? (
              <div className="mesas-page__vacio">
                <div className="mesas-page__vacio-icon" aria-hidden="true">▦</div>
                <h3>No hay mesas</h3>
                <p>
                  {filtroBusqueda || filtroEstado !== 'Todos' || filtroZona !== 'Todas'
                    ? 'Intenta cambiar los filtros o limpiarlos.'
                    : 'Crea tu primera mesa para empezar.'}
                </p>
                {(!filtroBusqueda && filtroEstado === 'Todos' && filtroZona === 'Todas') && (
                  <button className="mesas-page__btn mesas-page__btn--primaria" onClick={manejarNuevaMesa}>
                    <span aria-hidden="true">+</span> Crear primera mesa
                  </button>
                )}
              </div>
            ) : (
              mesas.map((mesa) => (
                <MesaCard
                  key={mesa.id}
                  mesa={mesa}
                  onClick={manejarClickMesa}
                  onEditar={manejarEditarMesa}
                  onEliminar={manejarEliminarMesa}
                  onCambiarEstado={manejarCambiarEstado}
                />
              ))
            )}
          </section>

          {/* ===== MODAL CREAR/EDITAR ===== */}
          <MesaModal
            abierto={!!mesaEditando}
            onCerrar={() => setMesaEditando(null)}
            mesa={mesaEditando}
            onGuardar={manejarGuardarMesa}
          />

          {/* ===== MODAL CONFIRMACIÓN ELIMINAR ===== */}
          {mostrarConfirmacionEliminar && (
            <div className="mesa-modal__overlay" onClick={() => setMostrarConfirmacionEliminar(false)}>
              <div className="mesa-modal mesa-modal--confirmar" onClick={(e) => e.stopPropagation()}>
                <header className="mesa-modal__header">
                  <h2 className="mesa-modal__titulo">Eliminar mesa</h2>
                </header>
                <div className="mesas-page__vacio" style={{ padding: '24px', textAlign: 'center', background: 'transparent', border: 'none', boxShadow: 'none' }}>
                  <div className="mesa-modal__confirmar-icon" aria-hidden="true">🗑</div>
                  <h3 style={{ margin: '16px 0 8px', color: '#44271D' }}>
                    ¿Eliminar <strong>{mesaEliminando?.nombre}</strong>?
                  </h3>
                  <p style={{ color: '#8B6B5A', margin: 0 }}>
                    Esta acción no se puede deshacer. La mesa y su historial se eliminarán permanentemente.
                  </p>
                </div>
                <footer className="mesa-modal__footer">
                  <button
                    className="mesa-modal__btn mesa-modal__btn--cancelar"
                    onClick={() => setMostrarConfirmacionEliminar(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="mesa-modal__btn mesa-modal__btn--eliminar"
                    onClick={manejarConfirmarEliminar}
                  >
                    <span aria-hidden="true">🗑</span> Eliminar
                  </button>
                </footer>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}