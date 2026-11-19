// src/components/Usuarios/UsuarioFilters.jsx
// Filtros para el módulo Usuarios

import { useState, useEffect, useRef } from 'react';
import './UsuarioFilters.css';

export function UsuarioFilters({
  filtroBusqueda,
  onChangeBusqueda,
  filtroEstado,
  onChangeEstado,
  filtroRol,
  onChangeRol,
  filtroTieneTrabajador,
  onChangeTieneTrabajador,
  roles,
  resumen,
  usuariosCount,
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

  const hayFiltrosActivos = filtroEstado !== 'Todos' ||
    filtroRol !== 'Todos' ||
    filtroTieneTrabajador !== 'Todos' ||
    busquedaDebounced;

  return (
    <section className="usuario-filters" aria-label="Filtros de usuarios">
      {/* ===== FILA PRINCIPAL ===== */}
      <div className="usuario-filters__row">
        {/* Búsqueda */}
        <div className="usuario-filters__busqueda">
          <label htmlFor="usuario-busqueda" className="usuario-filters__label" aria-hidden="true">
            Buscar
          </label>
          <div className="usuario-filters__input-wrapper">
            <span className="usuario-filters__input-icon" aria-hidden="true">🔍</span>
            <input
              id="usuario-busqueda"
              type="search"
              className="usuario-filters__input"
              placeholder="Buscar por usuario, nombre, código..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              aria-label="Buscar usuarios"
            />
            {busqueda && (
              <button
                className="usuario-filters__clear"
                onClick={() => setBusqueda('')}
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Estado */}
        <div className="usuario-filters__select-group">
          <label htmlFor="usuario-estado" className="usuario-filters__label">Estado</label>
          <select
            id="usuario-estado"
            className="usuario-filters__select"
            value={filtroEstado}
            onChange={(e) => onChangeEstado(e.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Activo">✅ Activo</option>
            <option value="Inactivo">⏸ Inactivo</option>
            <option value="Bloqueado">🔒 Bloqueado</option>
            <option value="Pendiente">⏳ Pendiente</option>
          </select>
        </div>

        {/* Rol */}
        <div className="usuario-filters__select-group">
          <label htmlFor="usuario-rol" className="usuario-filters__label">Rol</label>
          <select
            id="usuario-rol"
            className="usuario-filters__select"
            value={filtroRol}
            onChange={(e) => onChangeRol(e.target.value)}
            aria-label="Filtrar por rol"
          >
            <option value="Todos">Todos los roles</option>
            {roles.map(rol => (
              <option key={rol.id} value={rol.id}>{rol.nombre}</option>
            ))}
          </select>
        </div>

        {/* Trabajador */}
        <div className="usuario-filters__select-group">
          <label htmlFor="usuario-trabajador" className="usuario-filters__label">Trabajador</label>
          <select
            id="usuario-trabajador"
            className="usuario-filters__select"
            value={filtroTieneTrabajador}
            onChange={(e) => onChangeTieneTrabajador(e.target.value)}
            aria-label="Filtrar por trabajador asignado"
          >
            <option value="Todos">Todos</option>
            <option value="Si">Con trabajador</option>
            <option value="No">Sin trabajador</option>
          </select>
        </div>

        {/* Vista */}
        <div className="usuario-filters__vista-group">
          <label className="usuario-filters__label" aria-hidden="true">Vista</label>
          <div className="usuario-filters__vista-toggle" role="group" aria-label="Cambiar vista">
            <button
              className={`usuario-filters__vista-btn ${vista === 'grid' ? 'usuario-filters__vista-btn--active' : ''}`}
              onClick={() => onChangeVista('grid')}
              aria-pressed={vista === 'grid'}
              aria-label="Vista en cuadrícula"
              title="Cuadrícula"
            >
              <span aria-hidden="true">⊞</span>
            </button>
            <button
              className={`usuario-filters__vista-btn ${vista === 'table' ? 'usuario-filters__vista-btn--active' : ''}`}
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
      <div className="usuario-filters__resumen">
        <div className="usuario-filters__contadores">
          <span className="usuario-filters__contador" aria-label={`Total usuarios: ${resumen.total}`}>
            <span className="usuario-filters__contador-valor">{resumen.total}</span>
            <span className="usuario-filters__contador-label">Total</span>
          </span>
          <span className="usuario-filters__contador usuario-filters__contador--activos" aria-label={`Activos: ${resumen.activos}`}>
            <span className="usuario-filters__contador-valor">{resumen.activos}</span>
            <span className="usuario-filters__contador-label">Activos</span>
          </span>
          <span className="usuario-filters__contador usuario-filters__contador--inactivos" aria-label={`Inactivos: ${resumen.inactivos}`}>
            <span className="usuario-filters__contador-valor">{resumen.inactivos}</span>
            <span className="usuario-filters__contador-label">Inactivos</span>
          </span>
          <span className="usuario-filters__contador usuario-filters__contador--bloqueados" aria-label={`Bloqueados: ${resumen.bloqueados}`}>
            <span className="usuario-filters__contador-valor">{resumen.bloqueados}</span>
            <span className="usuario-filters__contador-label">Bloqueados</span>
          </span>
          <span className="usuario-filters__contador usuario-filters__contador--pendientes" aria-label={`Pendientes: ${resumen.pendientes}`}>
            <span className="usuario-filters__contador-valor">{resumen.pendientes}</span>
            <span className="usuario-filters__contador-label">Pendientes</span>
          </span>
          <span className="usuario-filters__contador usuario-filters__contador--con-trab" aria-label={`Con trabajador: ${resumen.conTrabajador}`}>
            <span className="usuario-filters__contador-valor">{resumen.conTrabajador}</span>
            <span className="usuario-filters__contador-label">Con Trab.</span>
          </span>
          <span className="usuario-filters__contador usuario-filters__contador--sin-trab" aria-label={`Sin trabajador: ${resumen.sinTrabajador}`}>
            <span className="usuario-filters__contador-valor">{resumen.sinTrabajador}</span>
            <span className="usuario-filters__contador-label">Sin Trab.</span>
          </span>
          <span className="usuario-filters__contador usuario-filters__contador--mostrados" aria-label={`Mostrando: ${usuariosCount}`}>
            <span className="usuario-filters__contador-valor">{usuariosCount}</span>
            <span className="usuario-filters__contador-label">Mostrando</span>
          </span>
        </div>

        {hayFiltrosActivos && (
          <button
            className="usuario-filters__btn-limpiar"
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