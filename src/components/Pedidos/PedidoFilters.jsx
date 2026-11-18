// src/components/Pedidos/PedidoFilters.jsx
// Filtros para el módulo Pedidos

import { useState, useEffect, useRef } from 'react';
import './PedidoFilters.css';

export function PedidoFilters({
  filtroBusqueda,
  onChangeBusqueda,
  filtroEstado,
  onChangeEstado,
  filtroMesa,
  onChangeMesa,
  filtroZona,
  onChangeZona,
  filtroFecha,
  onChangeFecha,
  mesasDisponibles,
  zonasDisponibles,
  estadosDisponibles,
  totalPedidos,
  pedidosFiltradosCount,
  onLimpiarFiltros
}) {
  const [busquedaLocal, setBusquedaLocal] = useState(filtroBusqueda);
  const inputRef = useRef(null);

  // Debounce local para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      onChangeBusqueda(busquedaLocal);
    }, 300);
    return () => clearTimeout(timer);
  }, [busquedaLocal, onChangeBusqueda]);

  const tieneFiltrosActivos = filtroBusqueda || filtroEstado !== 'Todos' || filtroMesa !== 'Todas' || filtroZona !== 'Todas' || filtroFecha;

  const manejarLimpiar = () => {
    setBusquedaLocal('');
    onChangeBusqueda('');
    onChangeEstado('Todos');
    onChangeMesa('Todas');
    onChangeZona('Todas');
    onChangeFecha('');
    onLimpiarFiltros?.();
    inputRef.current?.focus();
  };

  return (
    <section className="pedido-filters" aria-label="Filtros de pedidos">
      <div className="pedido-filters__row">
        {/* Búsqueda */}
        <div className="pedido-filters__busqueda">
          <label htmlFor="filtro-busqueda-pedidos" className="visually-hidden">Buscar pedidos</label>
          <div className="pedido-filters__input-wrapper">
            <span className="pedido-filters__icon" aria-hidden="true">🔍</span>
            <input
              ref={inputRef}
              id="filtro-busqueda-pedidos"
              type="search"
              className="pedido-filters__input"
              placeholder="Buscar por Nº pedido, mesa, mozo, producto..."
              value={busquedaLocal}
              onChange={(e) => setBusquedaLocal(e.target.value)}
              aria-describedby="busqueda-ayuda"
            />
            {busquedaLocal && (
              <button
                className="pedido-filters__clear-btn"
                onClick={() => { setBusquedaLocal(''); onChangeBusqueda(''); inputRef.current?.focus(); }}
                aria-label="Limpiar búsqueda"
              >
                <span aria-hidden="true">✕</span>
              </button>
            )}
          </div>
          <span id="busqueda-ayuda" className="visually-hidden">
            Escribe para filtrar por número de pedido, número de mesa, nombre del mozo o producto
          </span>
        </div>

        {/* Filtro Estado */}
        <div className="pedido-filters__select-wrapper">
          <label htmlFor="filtro-estado-pedidos" className="visually-hidden">Filtrar por estado</label>
          <select
            id="filtro-estado-pedidos"
            className="pedido-filters__select"
            value={filtroEstado}
            onChange={(e) => onChangeEstado(e.target.value)}
            aria-label="Filtrar por estado del pedido"
          >
            <option value="Todos">Todos los estados</option>
            {estadosDisponibles.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
          <span className="pedido-filters__select-icon" aria-hidden="true">▼</span>
        </div>

        {/* Filtro Mesa */}
        <div className="pedido-filters__select-wrapper">
          <label htmlFor="filtro-mesa-pedidos" className="visually-hidden">Filtrar por mesa</label>
          <select
            id="filtro-mesa-pedidos"
            className="pedido-filters__select"
            value={filtroMesa}
            onChange={(e) => onChangeMesa(e.target.value)}
            aria-label="Filtrar por número de mesa"
          >
            <option value="Todas">Todas las mesas</option>
            {mesasDisponibles.map(mesa => (
              <option key={mesa} value={String(mesa)}>Mesa {mesa}</option>
            ))}
          </select>
          <span className="pedido-filters__select-icon" aria-hidden="true">▼</span>
        </div>

        {/* Filtro Zona */}
        <div className="pedido-filters__select-wrapper">
          <label htmlFor="filtro-zona-pedidos" className="visually-hidden">Filtrar por zona</label>
          <select
            id="filtro-zona-pedidos"
            className="pedido-filters__select"
            value={filtroZona}
            onChange={(e) => onChangeZona(e.target.value)}
            aria-label="Filtrar por zona del restaurante"
          >
            <option value="Todas">Todas las zonas</option>
            {zonasDisponibles.map(zona => (
              <option key={zona} value={zona}>{zona}</option>
            ))}
          </select>
          <span className="pedido-filters__select-icon" aria-hidden="true">▼</span>
        </div>

        {/* Filtro Fecha */}
        <div className="pedido-filters__select-wrapper">
          <label htmlFor="filtro-fecha-pedidos" className="visually-hidden">Filtrar por fecha</label>
          <input
            id="filtro-fecha-pedidos"
            type="date"
            className="pedido-filters__select pedido-filters__select--date"
            value={filtroFecha}
            onChange={(e) => onChangeFecha(e.target.value)}
            aria-label="Filtrar por fecha de creación"
          />
          <span className="pedido-filters__select-icon" aria-hidden="true">📅</span>
        </div>
      </div>

      {/* Fila inferior: contador + botón limpiar */}
      <div className="pedido-filters__bottom">
        <div className="pedido-filters__contador">
          <span className="pedido-filters__contador-texto">
            {pedidosFiltradosCount} de {totalPedidos} pedidos
          </span>
          {tieneFiltrosActivos && (
            <span className="pedido-filters__contador-filtros" aria-live="polite">
              (filtrados)
            </span>
          )}
        </div>

        {tieneFiltrosActivos && (
          <button
            className="pedido-filters__btn-limpiar"
            onClick={manejarLimpiar}
            type="button"
          >
            <span aria-hidden="true">✕</span> Limpiar filtros
          </button>
        )}
      </div>
    </section>
  );
}