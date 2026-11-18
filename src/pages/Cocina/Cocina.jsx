// src/pages/Cocina/Cocina.jsx
// Página principal del módulo Cocina (KDS - Kitchen Display System)

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import { CocinaHeader } from '../../components/Cocina/CocinaHeader';
import { CocinaFilters } from '../../components/Cocina/CocinaFilters';
import { CocinaCard } from '../../components/Cocina/CocinaCard';
import { useCocina } from '../../hooks/useCocina';
import './Cocina.css';

export default function Cocina() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [sonidoActivado, setSonidoActivado] = useState(true);

  const {
    pedidos,
    cargando,
    error,
    resumen,
    tiempoActual,
    filtroEstacion,
    setFiltroEstacion,
    filtroEstado,
    setFiltroEstado,
    mostrarEntregados,
    setMostrarEntregados,
    estaciones,
    alertaSonido,
    cambiarEstadoPedido,
    cambiarEstadoItem,
    siguienteEstadoPedido,
    siguienteEstadoItem,
    puedeAvanzarEstado,
    resetearDatos,
    calcularTiempoTranscurrido,
    esDemorado,
    esUrgente,
    agruparItemsPorEstacion,
    ESTADO_COLORES,
    ESTADO_ICONOS
  } = useCocina();

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      // El hook ya actualiza tiempoActual cada 30s, esto fuerza re-render
      setAutoRefresh(prev => prev);
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Manejar limpiar filtros
  const manejarLimpiarFiltros = useCallback(() => {
    setFiltroEstacion('todas');
    setFiltroEstado('activos');
    setMostrarEntregados(false);
  }, [setFiltroEstacion, setFiltroEstado, setMostrarEntregados]);

  // Confirmar reset
  const manejarResetearDatos = useCallback(() => {
    if (window.confirm('¿Restablecer datos de prueba? Se perderán todos los cambios en pedidos.')) {
      resetearDatos();
    }
  }, [resetearDatos]);

  // Si está cargando
  if (cargando) {
    return (
      <div className="cocina-layout">
        <Sidebar
          abierto={menuAbierto}
          onCerrar={() => setMenuAbierto(false)}
        />
        <main className="cocina-content">
          <Header onAbrirMenu={() => setMenuAbierto(true)} />
          <div className="cocina-page">
            <div className="cocina-page__loading" role="status" aria-label="Cargando pedidos">
              <div className="cocina-page__spinner" aria-hidden="true"></div>
              <p>Cargando pedidos de cocina...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="cocina-layout">
      <Sidebar
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
      />

      <main className="cocina-content">
        <Header onAbrirMenu={() => setMenuAbierto(true)} />

        <div className="cocina-page">
          {/* ===== HEADER COCINA ===== */}
          <CocinaHeader
            resumen={resumen}
            onResetearDatos={manejarResetearDatos}
            tiempoActual={tiempoActual}
          />

          {/* ===== FILTROS ===== */}
          <CocinaFilters
            filtroEstacion={filtroEstacion}
            onChangeEstacion={setFiltroEstacion}
            filtroEstado={filtroEstado}
            onChangeEstado={setFiltroEstado}
            mostrarEntregados={mostrarEntregados}
            onChangeMostrarEntregados={setMostrarEntregados}
            estaciones={estaciones}
            estadosDisponibles={['Pendiente', 'En preparación', 'Listo', 'Entregado', 'Cancelado']}
            resumen={resumen}
            pedidosCount={pedidos.length}
            onLimpiarFiltros={manejarLimpiarFiltros}
            alertaSonido={alertaSonido}
          />

          {/* ===== MENSAJE DE ERROR ===== */}
          {error && (
            <div className="cocina-page__error" role="alert">
              <span aria-hidden="true">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* ===== GRID DE PEDIDOS ===== */}
          <section className="cocina-page__grid" aria-label="Pedidos en cocina">
            {pedidos.length === 0 ? (
              <div className="cocina-page__vacio">
                <div className="cocina-page__vacio-icon" aria-hidden="true">
                  {filtroEstado === 'activos' ? '🎉' : '📭'}
                </div>
                <h3>
                  {filtroEstado === 'activos'
                    ? '¡No hay pedidos activos!'
                    : 'No hay pedidos que mostrar'}
                </h3>
                <p>
                  {filtroEstado === 'activos'
                    ? 'Todos los pedidos están listos o entregados. ¡Buen trabajo!'
                    : 'Intenta cambiar los filtros o limpiarlos.'}
                </p>
                {(filtroEstacion !== 'todas' || filtroEstado !== 'activos' || mostrarEntregados) && (
                  <button
                    className="cocina-page__btn-limpiar"
                    onClick={manejarLimpiarFiltros}
                  >
                    <span aria-hidden="true">✕</span> Limpiar filtros
                  </button>
                )}
              </div>
            ) : (
              pedidos.map((pedido) => (
                <CocinaCard
                  key={pedido.id}
                  pedido={pedido}
                  onCambiarEstado={cambiarEstadoPedido}
                  onCambiarEstadoItem={cambiarEstadoItem}
                  siguienteEstadoPedido={siguienteEstadoPedido}
                  siguienteEstadoItem={siguienteEstadoItem}
                  puedeAvanzarEstado={puedeAvanzarEstado}
                  calcularTiempoTranscurrido={calcularTiempoTranscurrido}
                  esDemorado={esDemorado}
                  esUrgente={esUrgente}
                  agruparItemsPorEstacion={agruparItemsPorEstacion}
                  ESTADO_COLORES={ESTADO_COLORES}
                  ESTADO_ICONOS={ESTADO_ICONOS}
                  filtroEstacion={filtroEstacion}
                />
              ))
            )}
          </section>

          {/* ===== BARRA DE CONTROL INFERIOR (Mobile) ===== */}
          <div className="cocina-page__control-bar" role="region" aria-label="Controles de cocina">
            <div className="cocina-page__control-grupo">
              <label className="cocina-page__control-label">
                <input
                  type="checkbox"
                  className="cocina-page__control-checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  aria-label="Actualización automática"
                />
                <span className="cocina-page__control-texto">Auto-refresh (30s)</span>
              </label>
            </div>
            <div className="cocina-page__control-grupo">
              <label className="cocina-page__control-label">
                <input
                  type="checkbox"
                  className="cocina-page__control-checkbox"
                  checked={sonidoActivado}
                  onChange={(e) => setSonidoActivado(e.target.checked)}
                  aria-label="Sonido de alertas"
                />
                <span className="cocina-page__control-texto">Sonido alertas</span>
              </label>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}