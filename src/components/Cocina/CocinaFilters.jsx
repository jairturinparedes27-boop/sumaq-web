// src/components/Cocina/CocinaFilters.jsx
// Filtros para la pantalla de cocina (KDS)

import { useState, useEffect } from 'react';
import './CocinaFilters.css';

export function CocinaFilters({
  filtroEstacion,
  onChangeEstacion,
  filtroEstado,
  onChangeEstado,
  mostrarEntregados,
  onChangeMostrarEntregados,
  estaciones,
  estadosDisponibles,
  resumen,
  pedidosCount,
  onLimpiarFiltros,
  alertaSonido
}) {
  const [busqueda, setBusqueda] = useState('');
  const [busquedaDebounced, setBusquedaDebounced] = useState('');

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => setBusquedaDebounced(busqueda), 300);
    return () => clearTimeout(timer);
  }, [busqueda]);

  const hayFiltrosActivos = filtroEstacion !== 'todas' ||
    filtroEstado !== 'activos' ||
    mostrarEntregados ||
    busquedaDebounced;

  return (
    <section className="cocina-filters" aria-label="Filtros de cocina">
      <div className="cocina-filters__row cocina-filters__row--principal">
        {/* Búsqueda */}
        <div className="cocina-filters__busqueda">
          <label htmlFor="cocina-busqueda" className="cocina-filters__label" aria-hidden="true">
            Buscar
          </label>
          <div className="cocina-filters__input-wrapper">
            <span className="cocina-filters__input-icon" aria-hidden="true">🔍</span>
            <input
              id="cocina-busqueda"
              type="search"
              className="cocina-filters__input"
              placeholder="Buscar por nº pedido, mesa, mozo, producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              aria-label="Buscar pedidos"
            />
            {busqueda && (
              <button
                className="cocina-filters__clear"
                onClick={() => setBusqueda('')}
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Estación */}
        <div className="cocina-filters__select-group">
          <label htmlFor="cocina-estacion" className="cocina-filters__label">Estación</label>
          <select
            id="cocina-estacion"
            className="cocina-filters__select"
            value={filtroEstacion}
            onChange={(e) => onChangeEstacion(e.target.value)}
            aria-label="Filtrar por estación de cocina"
          >
            {estaciones.map(estacion => (
              <option key={estacion.id} value={estacion.id}>
                {estacion.icono} {estacion.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div className="cocina-filters__select-group">
          <label htmlFor="cocina-estado" className="cocina-filters__label">Estado</label>
          <select
            id="cocina-estado"
            className="cocina-filters__select"
            value={filtroEstado}
            onChange={(e) => onChangeEstado(e.target.value)}
            aria-label="Filtrar por estado del pedido"
          >
            <option value="activos">Solo activos (Pendiente - Listo)</option>
            <option value="todos">Todos los estados</option>
            {estadosDisponibles.map(estado => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>

        {/* Checkbox entregados */}
        <div className="cocina-filters__checkbox-group">
          <label className="cocina-filters__checkbox-label">
            <input
              type="checkbox"
              className="cocina-filters__checkbox"
              checked={mostrarEntregados}
              onChange={(e) => onChangeMostrarEntregados(e.target.checked)}
              aria-label="Mostrar pedidos entregados y cancelados"
            />
            <span className="cocina-filters__checkbox-custom" aria-hidden="true"></span>
            <span className="cocina-filters__checkbox-text">Ver entregados/cancelados</span>
          </label>
        </div>
      </div>

      {/* ===== RESUMEN Y CONTADORES ===== */}
      <div className="cocina-filters__resumen">
        <div className="cocina-filters__contadores">
          <span className="cocina-filters__contador cocina-filters__contador--total" aria-label={`Total pedidos: ${resumen.total}`}>
            <span className="cocina-filters__contador-valor">{resumen.total}</span>
            <span className="cocina-filters__contador-label">Total</span>
          </span>
          <span className="cocina-filters__contador cocina-filters__contador--activos" aria-label={`Pedidos activos: ${resumen.activos}`}>
            <span className="cocina-filters__contador-valor">{resumen.activos}</span>
            <span className="cocina-filters__contador-label">Activos</span>
          </span>
          {resumen.demorados > 0 && (
            <span className="cocina-filters__contador cocina-filters__contador--demorados" aria-label={`Pedidos demorados: ${resumen.demorados}`}>
              <span className="cocina-filters__contador-valor">{resumen.demorados}</span>
              <span className="cocina-filters__contador-label">Demorados</span>
            </span>
          )}
          {resumen.urgentes > 0 && (
            <span className="cocina-filters__contador cocina-filters__contador--urgentes" aria-label={`Pedidos urgentes: ${resumen.urgentes}`}>
              <span className="cocina-filters__contador-valor">{resumen.urgentes}</span>
              <span className="cocina-filters__contador-label">Urgentes</span>
            </span>
          )}
          <span className="cocina-filters__contador cocina-filters__contador--mostrados" aria-label={`Pedidos mostrados: ${pedidosCount}`}>
            <span className="cocina-filters__contador-valor">{pedidosCount}</span>
            <span className="cocina-filters__contador-label">Mostrando</span>
          </span>
        </div>

        {hayFiltrosActivos && (
          <button
            className="cocina-filters__btn-limpiar"
            onClick={onLimpiarFiltros}
            aria-label="Limpiar todos los filtros"
          >
            <span aria-hidden="true">✕</span> Limpiar filtros
          </button>
        )}

        {/* Indicador de alerta sonora */}
        {alertaSonido && (
          <div className="cocina-filters__alerta" role="status" aria-live="polite">
            <span className="cocina-filters__alerta-icon" aria-hidden="true">🔔</span>
            <span>¡Nuevo pedido recibido!</span>
          </div>
        )}
      </div>
    </section>
  );
}