// src/components/Productos/ProductoFilters.jsx
// Filtros para el módulo Productos

import { useState, useEffect, useRef } from 'react';
import './ProductoFilters.css';

export function ProductoFilters({
  filtroBusqueda,
  onChangeBusqueda,
  filtroCategoria,
  onChangeCategoria,
  filtroEstado,
  onChangeEstado,
  filtroDisponibilidad,
  onChangeDisponibilidad,
  categorias,
  resumen,
  productosCount,
  onLimpiarFiltros,
  vista,
  onChangeVista
}) {
  const [busqueda, setBusqueda] = useState(filtroBusqueda);
  const [busquedaDebounced, setBusquedaDebounced] = useState(filtroBusqueda);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBusquedaDebounced(busqueda);
      onChangeBusqueda(busqueda);
    }, 300);
    return () => clearTimeout(timer);
  }, [busqueda, onChangeBusqueda]);

  // Sincronizar con props cuando cambian externamente (reset, etc.)
  // Usamos una ref para evitar bucle infinito
  const filtroBusquedaRef = useRef(filtroBusqueda);
  useEffect(() => {
    filtroBusquedaRef.current = filtroBusqueda;
  }, [filtroBusqueda]);

  useEffect(() => {
    if (busqueda !== filtroBusquedaRef.current) {
      setBusqueda(filtroBusquedaRef.current);
      setBusquedaDebounced(filtroBusquedaRef.current);
    }
  }, [filtroBusqueda, busqueda]);

  const hayFiltrosActivos = filtroCategoria !== 'Todas' ||
    filtroEstado !== 'Todos' ||
    filtroDisponibilidad !== 'Todas' ||
    busquedaDebounced;

  return (
    <section className="producto-filters" aria-label="Filtros de productos">
      {/* ===== FILA PRINCIPAL ===== */}
      <div className="producto-filters__row">
        {/* Búsqueda */}
        <div className="producto-filters__busqueda">
          <label htmlFor="producto-busqueda" className="producto-filters__label" aria-hidden="true">
            Buscar
          </label>
          <div className="producto-filters__input-wrapper">
            <span className="producto-filters__input-icon" aria-hidden="true">🔍</span>
            <input
              id="producto-busqueda"
              type="search"
              className="producto-filters__input"
              placeholder="Buscar por código, nombre, descripción..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              aria-label="Buscar productos"
            />
            {busqueda && (
              <button
                className="producto-filters__clear"
                onClick={() => setBusqueda('')}
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Categoría */}
        <div className="producto-filters__select-group">
          <label htmlFor="producto-categoria" className="producto-filters__label">Categoría</label>
          <select
            id="producto-categoria"
            className="producto-filters__select"
            value={filtroCategoria}
            onChange={(e) => onChangeCategoria(e.target.value)}
            aria-label="Filtrar por categoría"
          >
            <option value="Todas">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div className="producto-filters__select-group">
          <label htmlFor="producto-estado" className="producto-filters__label">Estado</label>
          <select
            id="producto-estado"
            className="producto-filters__select"
            value={filtroEstado}
            onChange={(e) => onChangeEstado(e.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        {/* Disponibilidad */}
        <div className="producto-filters__select-group">
          <label htmlFor="producto-disponibilidad" className="producto-filters__label">Disponibilidad</label>
          <select
            id="producto-disponibilidad"
            className="producto-filters__select"
            value={filtroDisponibilidad}
            onChange={(e) => onChangeDisponibilidad(e.target.value)}
            aria-label="Filtrar por disponibilidad"
          >
            <option value="Todas">Todas</option>
            <option value="Disponibles">Disponibles</option>
            <option value="No disponibles">No disponibles</option>
          </select>
        </div>

        {/* Vista */}
        <div className="producto-filters__vista-group">
          <label className="producto-filters__label" aria-hidden="true">Vista</label>
          <div className="producto-filters__vista-toggle" role="group" aria-label="Cambiar vista">
            <button
              className={`producto-filters__vista-btn ${vista === 'grid' ? 'producto-filters__vista-btn--active' : ''}`}
              onClick={() => onChangeVista('grid')}
              aria-pressed={vista === 'grid'}
              aria-label="Vista en cuadrícula"
              title="Cuadrícula"
            >
              <span aria-hidden="true">⊞</span>
            </button>
            <button
              className={`producto-filters__vista-btn ${vista === 'table' ? 'producto-filters__vista-btn--active' : ''}`}
              onClick={() => onChangeVista('table')}
              aria-pressed={vista === 'table'}
              aria-label="Vista en tabla"
              title="Tabla"
            >
              <span aria-hidden="true">☰</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===== RESUMEN Y CONTADORES ===== */}
      <div className="producto-filters__resumen">
        <div className="producto-filters__contadores">
          <span className="producto-filters__contador" aria-label={`Total productos: ${resumen.total}`}>
            <span className="producto-filters__contador-valor">{resumen.total}</span>
            <span className="producto-filters__contador-label">Total</span>
          </span>
          <span className="producto-filters__contador producto-filters__contador--activos" aria-label={`Activos: ${resumen.activos}`}>
            <span className="producto-filters__contador-valor">{resumen.activos}</span>
            <span className="producto-filters__contador-label">Activos</span>
          </span>
          <span className="producto-filters__contador producto-filters__contador--inactivos" aria-label={`Inactivos: ${resumen.inactivos}`}>
            <span className="producto-filters__contador-valor">{resumen.inactivos}</span>
            <span className="producto-filters__contador-label">Inactivos</span>
          </span>
          <span className="producto-filters__contador producto-filters__contador--disp" aria-label={`Disponibles: ${resumen.disponibles}`}>
            <span className="producto-filters__contador-valor">{resumen.disponibles}</span>
            <span className="producto-filters__contador-label">Disponibles</span>
          </span>
          <span className="producto-filters__contador producto-filters__contador--mostrados" aria-label={`Mostrando: ${productosCount}`}>
            <span className="producto-filters__contador-valor">{productosCount}</span>
            <span className="producto-filters__contador-label">Mostrando</span>
          </span>
        </div>

        {hayFiltrosActivos && (
          <button
            className="producto-filters__btn-limpiar"
            onClick={onLimpiarFiltros}
            aria-label="Limpiar todos los filtros"
          >
            <span aria-hidden="true">✕</span> Limpiar filtros
          </button>
        )}
      </div>
    </section>
  );
}