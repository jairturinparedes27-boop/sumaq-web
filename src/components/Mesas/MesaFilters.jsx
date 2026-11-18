// src/components/Mesas/MesaFilters.jsx
// Barra de búsqueda y filtros para el módulo Mesas

import { useEffect, useRef } from 'react';
import './MesaFilters.css';

export function MesaFilters({
  filtroBusqueda,
  onChangeBusqueda,
  filtroEstado,
  onChangeEstado,
  filtroZona,
  onChangeZona,
  zonasDisponibles,
  totalMesas,
  mesasFiltradasCount,
  onLimpiarFiltros
}) {
  const inputRef = useRef(null);

  // Focus automático al montar (accesibilidad)
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounce para búsqueda
  const timeoutRef = useRef(null);
  const manejarBusqueda = (e) => {
    const valor = e.target.value;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onChangeBusqueda(valor);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const hayFiltrosActivos = filtroBusqueda !== '' || filtroEstado !== 'Todos' || filtroZona !== 'Todas';

  return (
    <div className="mesa-filters" role="search" aria-label="Filtros de mesas">
      {/* Búsqueda */}
      <div className="mesa-filters__busqueda">
        <label htmlFor="busqueda-mesas" className="mesa-filters__label" aria-hidden="true">
          Buscar mesa
        </label>
        <div className="mesa-filters__input-wrapper">
          <span className="mesa-filters__icon" aria-hidden="true">🔍</span>
          <input
            ref={inputRef}
            id="busqueda-mesas"
            type="search"
            className="mesa-filters__input"
            placeholder="Buscar por número, nombre o zona..."
            value={filtroBusqueda}
            onChange={manejarBusqueda}
            aria-label="Buscar mesa por número, nombre o zona"
            autoComplete="off"
          />
          {filtroBusqueda && (
            <button
              className="mesa-filters__clear"
              onClick={() => onChangeBusqueda('')}
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filtros desplegables */}
      <div className="mesa-filters__selects">
        {/* Filtro Estado */}
        <div className="mesa-filters__select-wrapper">
          <label htmlFor="filtro-estado" className="mesa-filters__label" aria-hidden="true">
            Filtrar por estado
          </label>
          <select
            id="filtro-estado"
            className="mesa-filters__select"
            value={filtroEstado}
            onChange={(e) => onChangeEstado(e.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Disponible">🟢 Disponible</option>
            <option value="Ocupada">🔴 Ocupada</option>
            <option value="Reservada">🟡 Reservada</option>
          </select>
          <span className="mesa-filters__select-icon" aria-hidden="true">▼</span>
        </div>

        {/* Filtro Zona */}
        <div className="mesa-filters__select-wrapper">
          <label htmlFor="filtro-zona" className="mesa-filters__label" aria-hidden="true">
            Filtrar por zona
          </label>
          <select
            id="filtro-zona"
            className="mesa-filters__select"
            value={filtroZona}
            onChange={(e) => onChangeZona(e.target.value)}
            aria-label="Filtrar por zona"
          >
            <option value="Todas">Todas las zonas</option>
            {zonasDisponibles.map(zona => (
              <option key={zona} value={zona}>{zona}</option>
            ))}
          </select>
          <span className="mesa-filters__select-icon" aria-hidden="true">▼</span>
        </div>
      </div>

      {/* Contador + Limpiar */}
      <div className="mesa-filters__footer">
        <span className="mesa-filters__contador" aria-live="polite">
          {mesasFiltradasCount} de {totalMesas} mesa{totalMesas !== 1 ? 's' : ''}
        </span>

        {hayFiltrosActivos && (
          <button
            className="mesa-filters__btn-limpiar"
            onClick={onLimpiarFiltros}
            aria-label="Limpiar todos los filtros"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}