// src/components/Trabajadores/TrabajadorFilters.jsx
// Filtros para la tabla de trabajadores

import { useRef, useEffect } from 'react';
import './TrabajadorFilters.css';

export function TrabajadorFilters({
  filtroBusqueda,
  setFiltroBusqueda,
  filtroCargo,
  setFiltroCargo,
  filtroEstado,
  setFiltroEstado,
  filtroTieneUsuario,
  setFiltroTieneUsuario,
  vista,
  setVista,
  cargosActivos,
  resumen,
  onLimpiarFiltros,
  cargando = false
}) {
  const busquedaInputRef = useRef(null);
  const prevFiltroBusqueda = useRef(filtroBusqueda);

  // Sincronizar ref con prop (patrón para debounce externo)
  useEffect(() => {
    if (busquedaInputRef.current && prevFiltroBusqueda.current !== filtroBusqueda) {
      busquedaInputRef.current.value = filtroBusqueda;
      prevFiltroBusqueda.current = filtroBusqueda;
    }
  }, [filtroBusqueda]);

  const handleBusquedaChange = (e) => {
    const valor = e.target.value;
    prevFiltroBusqueda.current = valor;
    setFiltroBusqueda(valor);
  };

  const handleLimpiarBusqueda = () => {
    prevFiltroBusqueda.current = '';
    setFiltroBusqueda('');
    busquedaInputRef.current?.focus();
  };

  return (
    <div className="trabajador-filters">
      {/* Fila principal de filtros */}
      <div className="trabajador-filters__row">
        {/* Búsqueda */}
        <div className="trabajador-filters__busqueda">
          <label className="trabajador-filters__label" htmlFor="trabajador-busqueda">
            Buscar
          </label>
          <div className="trabajador-filters__input-wrapper">
            <span className="trabajador-filters__input-icon">🔍</span>
            <input
              ref={busquedaInputRef}
              id="trabajador-busqueda"
              type="text"
              className="trabajador-filters__input"
              placeholder="DNI, nombres, código, email..."
              value={filtroBusqueda}
              onChange={handleBusquedaChange}
              disabled={cargando}
              aria-label="Buscar trabajadores"
            />
            {filtroBusqueda && (
              <button
                className="trabajador-filters__clear"
                onClick={handleLimpiarBusqueda}
                aria-label="Limpiar búsqueda"
                disabled={cargando}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Cargo */}
        <div className="trabajador-filters__select-group">
          <label className="trabajador-filters__label" htmlFor="trabajador-cargo">
            Cargo
          </label>
          <select
            id="trabajador-cargo"
            className="trabajador-filters__select"
            value={filtroCargo}
            onChange={(e) => setFiltroCargo(e.target.value)}
            disabled={cargando}
            aria-label="Filtrar por cargo"
          >
            <option value="Todos">Todos los cargos</option>
            {cargosActivos.map((cargo) => (
              <option key={cargo.id} value={cargo.nombre}>
                {cargo.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div className="trabajador-filters__select-group">
          <label className="trabajador-filters__label" htmlFor="trabajador-estado">
            Estado
          </label>
          <select
            id="trabajador-estado"
            className="trabajador-filters__select"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            disabled={cargando}
            aria-label="Filtrar por estado"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        {/* Usuario Asociado */}
        <div className="trabajador-filters__select-group">
          <label className="trabajador-filters__label" htmlFor="trabajador-usuario">
            Usuario
          </label>
          <select
            id="trabajador-usuario"
            className="trabajador-filters__select"
            value={filtroTieneUsuario}
            onChange={(e) => setFiltroTieneUsuario(e.target.value)}
            disabled={cargando}
            aria-label="Filtrar por usuario asociado"
          >
            <option value="Todos">Todos</option>
            <option value="Si">Con usuario</option>
            <option value="No">Sin usuario</option>
          </select>
        </div>

        {/* Vista Toggle */}
        <div className="trabajador-filters__vista-group">
          <label className="trabajador-filters__label">Vista</label>
          <div className="trabajador-filters__vista-toggle" role="group" aria-label="Cambiar vista">
            <button
              className={`trabajador-filters__vista-btn ${vista === 'table' ? 'trabajador-filters__vista-btn--active' : ''}`}
              onClick={() => setVista('table')}
              title="Vista tabla"
              aria-label="Vista tabla"
              aria-pressed={vista === 'table'}
              disabled={cargando}
            >
              📋
            </button>
            <button
              className={`trabajador-filters__vista-btn ${vista === 'grid' ? 'trabajador-filters__vista-btn--active' : ''}`}
              onClick={() => setVista('grid')}
              title="Vista cuadrícula"
              aria-label="Vista cuadrícula"
              aria-pressed={vista === 'grid'}
              disabled={cargando}
            >
              ⊞
            </button>
          </div>
        </div>
      </div>

      {/* Resumen y contadores */}
      <div className="trabajador-filters__resumen">
        <div className="trabajador-filters__contadores">
          <div className="trabajador-filters__contador">
            <span className="trabajador-filters__contador-valor">{resumen.total}</span>
            <span className="trabajador-filters__contador-label">Total</span>
          </div>
          <div className="trabajador-filters__contador trabajador-filters__contador--activos">
            <span className="trabajador-filters__contador-valor">{resumen.activos}</span>
            <span className="trabajador-filters__contador-label">Activos</span>
          </div>
          <div className="trabajador-filters__contador trabajador-filters__contador--inactivos">
            <span className="trabajador-filters__contador-valor">{resumen.inactivos}</span>
            <span className="trabajador-filters__contador-label">Inactivos</span>
          </div>
          <div className="trabajador-filters__contador trabajador-filters__contador--con-trab">
            <span className="trabajador-filters__contador-valor">{resumen.conUsuario}</span>
            <span className="trabajador-filters__contador-label">Con Usuario</span>
          </div>
          <div className="trabajador-filters__contador trabajador-filters__contador--sin-trab">
            <span className="trabajador-filters__contador-valor">{resumen.sinUsuario}</span>
            <span className="trabajador-filters__contador-label">Sin Usuario</span>
          </div>
          <div className="trabajador-filters__contador trabajador-filters__contador--mostrados">
            <span className="trabajador-filters__contador-valor">{resumen.mostrados}</span>
            <span className="trabajador-filters__contador-label">Mostrados</span>
          </div>
        </div>

        {(() => {
          const hayFiltrosActivos = filtroBusqueda || filtroCargo !== 'Todos' || filtroEstado !== 'Todos' || filtroTieneUsuario !== 'Todos';
          return hayFiltrosActivos && (
            <button
              className="trabajador-filters__btn-limpiar"
              onClick={onLimpiarFiltros}
              disabled={cargando}
            >
              🔄 Limpiar filtros
            </button>
          );
        })()}
      </div>
    </div>
  );
}