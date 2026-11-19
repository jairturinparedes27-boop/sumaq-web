// src/components/Insumos/InsumoFilters.jsx
// Filtros para el módulo Insumos

import { useState, useEffect, useRef } from 'react';
import './InsumoFilters.css';

export function InsumoFilters({
  filtroBusqueda,
  onChangeBusqueda,
  filtroCategoria,
  onChangeCategoria,
  filtroEstado,
  onChangeEstado,
  filtroStock,
  onChangeStock,
  filtroProveedor,
  onChangeProveedor,
  categorias,
  proveedores,
  resumen,
  insumosCount,
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
    filtroStock !== 'Todos' ||
    filtroProveedor !== 'Todos' ||
    busquedaDebounced;

  return (
    <section className="insumo-filters" aria-label="Filtros de insumos">
      {/* ===== FILA PRINCIPAL ===== */}
      <div className="insumo-filters__row">
        {/* Búsqueda */}
        <div className="insumo-filters__busqueda">
          <label htmlFor="insumo-busqueda" className="insumo-filters__label" aria-hidden="true">
            Buscar
          </label>
          <div className="insumo-filters__input-wrapper">
            <span className="insumo-filters__input-icon" aria-hidden="true">🔍</span>
            <input
              id="insumo-busqueda"
              type="search"
              className="insumo-filters__input"
              placeholder="Buscar por código, nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              aria-label="Buscar insumos"
            />
            {busqueda && (
              <button
                className="insumo-filters__clear"
                onClick={() => setBusqueda('')}
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Categoría */}
        <div className="insumo-filters__select-group">
          <label htmlFor="insumo-categoria" className="insumo-filters__label">Categoría</label>
          <select
            id="insumo-categoria"
            className="insumo-filters__select"
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
        <div className="insumo-filters__select-group">
          <label htmlFor="insumo-estado" className="insumo-filters__label">Estado</label>
          <select
            id="insumo-estado"
            className="insumo-filters__select"
            value={filtroEstado}
            onChange={(e) => onChangeEstado(e.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Agotado">Agotado</option>
            <option value="Descontinuado">Descontinuado</option>
          </select>
        </div>

        {/* Stock */}
        <div className="insumo-filters__select-group">
          <label htmlFor="insumo-stock" className="insumo-filters__label">Stock</label>
          <select
            id="insumo-stock"
            className="insumo-filters__select"
            value={filtroStock}
            onChange={(e) => onChangeStock(e.target.value)}
            aria-label="Filtrar por nivel de stock"
          >
            <option value="Todos">Todos</option>
            <option value="Critico">🔴 Crítico (&le;50%)</option>
            <option value="Bajo">🟡 Bajo (&le;100%)</option>
            <option value="OK">🟢 OK (mayor 100%)</option>
          </select>
        </div>

        {/* Proveedor */}
        <div className="insumo-filters__select-group">
          <label htmlFor="insumo-proveedor" className="insumo-filters__label">Proveedor</label>
          <select
            id="insumo-proveedor"
            className="insumo-filters__select"
            value={filtroProveedor}
            onChange={(e) => onChangeProveedor(e.target.value)}
            aria-label="Filtrar por proveedor"
          >
            <option value="Todos">Todos los proveedores</option>
            {proveedores.map(prov => (
              <option key={prov.id} value={prov.id}>{prov.nombre}</option>
            ))}
          </select>
        </div>

        {/* Vista */}
        <div className="insumo-filters__vista-group">
          <label className="insumo-filters__label" aria-hidden="true">Vista</label>
          <div className="insumo-filters__vista-toggle" role="group" aria-label="Cambiar vista">
            <button
              className={`insumo-filters__vista-btn ${vista === 'grid' ? 'insumo-filters__vista-btn--active' : ''}`}
              onClick={() => onChangeVista('grid')}
              aria-pressed={vista === 'grid'}
              aria-label="Vista en cuadrícula"
              title="Cuadrícula"
            >
              <span aria-hidden="true">⊞</span>
            </button>
            <button
              className={`insumo-filters__vista-btn ${vista === 'table' ? 'insumo-filters__vista-btn--active' : ''}`}
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
      <div className="insumo-filters__resumen">
        <div className="insumo-filters__contadores">
          <span className="insumo-filters__contador" aria-label={`Total insumos: ${resumen.total}`}>
            <span className="insumo-filters__contador-valor">{resumen.total}</span>
            <span className="insumo-filters__contador-label">Total</span>
          </span>
          <span className="insumo-filters__contador insumo-filters__contador--activos" aria-label={`Activos: ${resumen.activos}`}>
            <span className="insumo-filters__contador-valor">{resumen.activos}</span>
            <span className="insumo-filters__contador-label">Activos</span>
          </span>
          <span className="insumo-filters__contador insumo-filters__contador--criticos" aria-label={`Críticos: ${resumen.criticos}`}>
            <span className="insumo-filters__contador-valor">{resumen.criticos}</span>
            <span className="insumo-filters__contador-label">Críticos</span>
          </span>
          <span className="insumo-filters__contador insumo-filters__contador--bajos" aria-label={`Bajos: ${resumen.bajos}`}>
            <span className="insumo-filters__contador-valor">{resumen.bajos}</span>
            <span className="insumo-filters__contador-label">Bajos</span>
          </span>
          <span className="insumo-filters__contador insumo-filters__contador--valor" aria-label={`Valor inventario: S/ ${resumen.valorTotal.toFixed(2)}`}>
            <span className="insumo-filters__contador-valor">S/ {resumen.valorTotal.toFixed(0)}</span>
            <span className="insumo-filters__contador-label">Valor</span>
          </span>
          <span className="insumo-filters__contador insumo-filters__contador--mostrados" aria-label={`Mostrando: ${insumosCount}`}>
            <span className="insumo-filters__contador-valor">{insumosCount}</span>
            <span className="insumo-filters__contador-label">Mostrando</span>
          </span>
        </div>

        {hayFiltrosActivos && (
          <button
            className="insumo-filters__btn-limpiar"
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