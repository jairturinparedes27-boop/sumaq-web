// src/components/Insumos/RecetaManager.jsx
// Modal para gestionar recetas (relación Producto - Insumos)

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './RecetaManager.css';

export function RecetaManager({
  abierto,
  onCerrar,
  recetas,
  insumos,
  onGuardar
}) {
  const [recetaEditando, setRecetaEditando] = useState(null);
  const [recetaEliminando, setRecetaEliminando] = useState(null);
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [nuevaRecetaProducto, setNuevaRecetaProducto] = useState({ codigo: '', nombre: '' });
  const [ingredientes, setIngredientes] = useState([]);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const modalRef = useRef(null);

  // Categorías para el select del insumo en receta
  const insumosPorCategoria = useMemo(() => {
    const grouped = {};
    insumos.filter(i => i.estado === 'Activo').forEach(insumo => {
      const cat = insumo.categoriaNombre || 'Sin categoría';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(insumo);
    });
    return grouped;
  }, [insumos]);

  const categoriasConInsumos = useMemo(() => Object.keys(insumosPorCategoria).sort(), [insumosPorCategoria]);

  // Focus trap
  useEffect(() => {
    if (abierto) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [abierto]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      if (recetaEditando) {
        setRecetaEditando(null);
      } else {
        onCerrar();
      }
    }
  }, [onCerrar, recetaEditando]);

  // Handlers para lista de recetas
  const manejarNuevaReceta = () => {
    setNuevaRecetaProducto({ codigo: '', nombre: '' });
    setIngredientes([{ insumoId: '', cantidad: '', unidadMedida: '' }]);
    setRecetaEditando({ id: 'nuevo', productoCodigo: '', productoNombre: '', insumos: [] });
  };

  const manejarEditarReceta = (receta) => {
    setRecetaEditando(receta);
    setIngredientes(receta.insumos.map(i => ({
      insumoId: i.insumoId,
      insumoCodigo: i.insumoCodigo,
      insumoNombre: i.insumoNombre,
      cantidad: i.cantidad,
      unidadMedida: i.unidadMedida
    })));
  };

  const manejarEliminarReceta = (receta) => {
    setRecetaEliminando(receta);
    setMostrarConfirmacionEliminar(true);
  };

  const manejarConfirmarEliminar = async () => {
    if (recetaEliminando) {
      // La eliminación se maneja en el padre via hook
      setMostrarConfirmacionEliminar(false);
      setRecetaEliminando(null);
    }
  };

  // Handlers para formulario de receta
  const agregarIngrediente = () => {
    setIngredientes(prev => [...prev, { insumoId: '', cantidad: '', unidadMedida: '' }]);
  };

  const eliminarIngrediente = (index) => {
    setIngredientes(prev => prev.filter((_, i) => i !== index));
  };

  const actualizarIngrediente = (index, campo, valor) => {
    setIngredientes(prev => prev.map((ing, i) =>
      i === index ? { ...ing, [campo]: valor } : ing
    ));
  };

  const handleInsumoChange = (index, insumoId) => {
    const insumo = insumos.find(i => i.id === insumoId);
    if (insumo) {
      actualizarIngrediente(index, 'insumoId', insumoId);
      actualizarIngrediente(index, 'insumoCodigo', insumo.codigo);
      actualizarIngrediente(index, 'insumoNombre', insumo.nombre);
      actualizarIngrediente(index, 'unidadMedida', insumo.unidadMedida);
    }
  };

  const validarReceta = () => {
    const nuevosErrores = {};

    if (!nuevaRecetaProducto.codigo?.trim() && recetaEditando?.id === 'nuevo') {
      nuevosErrores.productoCodigo = 'Código de producto requerido';
    }
    if (!nuevaRecetaProducto.nombre?.trim() && recetaEditando?.id === 'nuevo') {
      nuevosErrores.productoNombre = 'Nombre de producto requerido';
    }

    const ingredientesValidos = ingredientes.filter(i => i.insumoId && i.cantidad);
    if (ingredientesValidos.length === 0) {
      nuevosErrores.ingredientes = 'Agregue al menos un ingrediente';
    }

    ingredientes.forEach((ing, i) => {
      if (ing.insumoId && (!ing.cantidad || Number(ing.cantidad) <= 0)) {
        nuevosErrores[`cantidad_${i}`] = 'Cantidad requerida';
      }
    });

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleGuardarReceta = async () => {
    if (!validarReceta() || guardando) return;

    const datos = {
      productoId: recetaEditando?.id !== 'nuevo' ? recetaEditando.productoId : '',
      productoCodigo: recetaEditando?.id !== 'nuevo' ? recetaEditando.productoCodigo : nuevaRecetaProducto.codigo.trim().toUpperCase(),
      productoNombre: recetaEditando?.id !== 'nuevo' ? recetaEditando.productoNombre : nuevaRecetaProducto.nombre.trim(),
      insumos: ingredientes
        .filter(i => i.insumoId && i.cantidad && Number(i.cantidad) > 0)
        .map(i => ({
          insumoId: i.insumoId,
          insumoCodigo: i.insumoCodigo,
          insumoNombre: i.insumoNombre,
          cantidad: Number(i.cantidad),
          unidadMedida: i.unidadMedida
        }))
    };

    setGuardando(true);
    try {
      await onGuardar(datos);
      setRecetaEditando(null);
      setErrores({});
    } catch (error) {
      setErrores({ general: error.message });
    } finally {
      setGuardando(false);
    }
  };

  if (!abierto) return null;

  // Filtrar recetas para mostrar
  const recetasFiltradas = recetas
    .filter(r => {
      const coincideBusqueda = !filtroBusqueda ||
        r.productoCodigo.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
        r.productoNombre.toLowerCase().includes(filtroBusqueda.toLowerCase());
      const coincideCategoria = filtroCategoria === 'Todas' ||
        r.insumos.some(ing => {
          const insumo = insumos.find(item => item.id === ing.insumoId || item.codigo === ing.insumoCodigo);
          return insumo?.categoriaNombre === filtroCategoria;
        });
      return coincideBusqueda && coincideCategoria;
    })
    .sort((a, b) => a.productoNombre.localeCompare(b.productoNombre));

  return (
    <div
      className="insumo-modal__overlay"
      onClick={() => recetaEditando ? null : onCerrar()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="receta-manager-titulo"
      onKeyDown={handleKeyDown}
    >
      <div
        className="insumo-modal receta-manager"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {recetaEditando ? (
          // ===== FORMULARIO DE RECETA =====
          <>
            <header className="insumo-modal__header">
              <h2 id="receta-manager-titulo" className="insumo-modal__titulo">
                {recetaEditando.id === 'nuevo' ? '➕ Nueva Receta' : '✏️ Editar Receta'}
              </h2>
              <button
                className="insumo-modal__cerrar"
                onClick={() => setRecetaEditando(null)}
                aria-label="Volver"
                type="button"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </header>

            <form className="insumo-modal__form" onSubmit={(e) => { e.preventDefault(); handleGuardarReceta(); }}>
              <div className="insumo-modal__grid">
                {recetaEditando.id === 'nuevo' && (
                  <>
                    <div className="insumo-modal__campo">
                      <label htmlFor="receta-prod-codigo" className="insumo-modal__label">
                        Código Producto <span className="insumo-modal__requerido" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="receta-prod-codigo"
                        type="text"
                        className={`insumo-modal__input ${errores.productoCodigo ? 'insumo-modal__input--error' : ''}`}
                        value={nuevaRecetaProducto.codigo}
                        onChange={(e) => setNuevaRecetaProducto(prev => ({ ...prev, codigo: e.target.value.toUpperCase() }))}
                        placeholder="Ej: ANT001"
                        maxLength={20}
                        aria-invalid={!!errores.productoCodigo}
                      />
                      {errores.productoCodigo && <span className="insumo-modal__error">{errores.productoCodigo}</span>}
                    </div>
                    <div className="insumo-modal__campo">
                      <label htmlFor="receta-prod-nombre" className="insumo-modal__label">
                        Nombre Producto <span className="insumo-modal__requerido" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="receta-prod-nombre"
                        type="text"
                        className={`insumo-modal__input ${errores.productoNombre ? 'insumo-modal__input--error' : ''}`}
                        value={nuevaRecetaProducto.nombre}
                        onChange={(e) => setNuevaRecetaProducto(prev => ({ ...prev, nombre: e.target.value }))}
                        placeholder="Ej: Anticucho Clásico"
                        maxLength={100}
                        aria-invalid={!!errores.productoNombre}
                      />
                      {errores.productoNombre && <span className="insumo-modal__error">{errores.productoNombre}</span>}
                    </div>
                  </>
                )}

                {recetaEditando.id !== 'nuevo' && (
                  <div className="insumo-modal__campo insumo-modal__campo--full">
                    <label className="insumo-modal__label">Producto</label>
                    <div className="insumo-modal__producto-info">
                      <code>{recetaEditando.productoCodigo}</code>
                      <span>{recetaEditando.productoNombre}</span>
                    </div>
                  </div>
                )}

                <div className="insumo-modal__campo insumo-modal__campo--full">
                  <div className="insumo-modal__ingredientes-header">
                    <legend className="insumo-modal__legend">Ingredientes</legend>
                    <button
                      type="button"
                      className="insumo-modal__btn insumo-modal__btn--secundaria insumo-modal__btn--sm"
                      onClick={agregarIngrediente}
                    >
                      <span aria-hidden="true">+</span> Agregar
                    </button>
                  </div>

                  {ingredientes.length === 0 ? (
                    <div className="insumo-modal__vacio-ingredientes">
                      <p>No hay ingredientes agregados</p>
                      <button
                        type="button"
                        className="insumo-modal__btn insumo-modal__btn--primaria insumo-modal__btn--sm"
                        onClick={agregarIngrediente}
                      >
                        Agregar primer ingrediente
                      </button>
                    </div>
                  ) : (
                    <div className="insumo-modal__ingredientes-lista">
                      {ingredientes.map((ing, index) => (
                        <div key={index} className="insumo-modal__ingrediente-fila">
                          <div className="insumo-modal__ingrediente-select">
                            <label htmlFor={`receta-insumo-${index}`} className="insumo-modal__label">Insumo</label>
                            <select
                              id={`receta-insumo-${index}`}
                              className="insumo-modal__select"
                              value={ing.insumoId}
                              onChange={(e) => handleInsumoChange(index, e.target.value)}
                            >
                              <option value="">Seleccionar insumo...</option>
                              {categoriasConInsumos.map(cat => (
                                <optgroup key={cat} label={cat}>
                                  {insumosPorCategoria[cat].map(insumo => (
                                    <option key={insumo.id} value={insumo.id}>
                                      {insumo.codigo} - {insumo.nombre} ({insumo.unidadMedida})
                                    </option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>
                          </div>
                          <div className="insumo-modal__ingrediente-cantidad">
                            <label htmlFor={`receta-cant-${index}`} className="insumo-modal__label">
                              Cantidad {ing.unidadMedida && `(${ing.unidadMedida})`}
                            </label>
                            <input
                              id={`receta-cant-${index}`}
                              type="number"
                              className={`insumo-modal__input ${errores[`cantidad_${index}`] ? 'insumo-modal__input--error' : ''}`}
                              value={ing.cantidad}
                              onChange={(e) => actualizarIngrediente(index, 'cantidad', e.target.value)}
                              placeholder="0.00"
                              step="0.01"
                              min="0.01"
                            />
                            {errores[`cantidad_${index}`] && <span className="insumo-modal__error">{errores[`cantidad_${index}`]}</span>}
                          </div>
                          <button
                            type="button"
                            className="insumo-modal__btn-eliminar"
                            onClick={() => eliminarIngrediente(index)}
                            aria-label="Eliminar ingrediente"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {errores.ingredientes && <div className="insumo-modal__error-general">{errores.ingredientes}</div>}
                </div>
              </div>

              {errores.general && (
                <div className="insumo-modal__error-general" role="alert">
                  <span aria-hidden="true">⚠</span> {errores.general}
                </div>
              )}

              <footer className="insumo-modal__footer">
                <button
                  type="button"
                  className="insumo-modal__btn insumo-modal__btn--cancelar"
                  onClick={() => setRecetaEditando(null)}
                  disabled={guardando}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="insumo-modal__btn insumo-modal__btn--guardar"
                  disabled={guardando}
                >
                  {guardando ? (
                    <> <span className="insumo-modal__spinner" aria-hidden="true"></span> Guardando... </>
                  ) : (
                    `${recetaEditando.id === 'nuevo' ? '➕ Crear' : '💾 Actualizar'} Receta`
                  )}
                </button>
              </footer>
            </form>
          </>
        ) : (
          // ===== LISTA DE RECETAS =====
          <>
            <header className="insumo-modal__header">
              <h2 id="receta-manager-titulo" className="insumo-modal__titulo">📋 Gestión de Recetas</h2>
              <button
                className="insumo-modal__cerrar"
                onClick={onCerrar}
                aria-label="Cerrar"
                type="button"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </header>

            <div className="receta-manager__lista">
              {/* Filtros */}
              <div className="receta-manager__filtros">
                <div className="receta-manager__busqueda">
                  <label htmlFor="receta-busqueda" className="insumo-filters__label" aria-hidden="true">Buscar</label>
                  <div className="insumo-filters__input-wrapper">
                    <span className="insumo-filters__input-icon" aria-hidden="true">🔍</span>
                    <input
                      id="receta-busqueda"
                      type="search"
                      className="insumo-filters__input"
                      placeholder="Buscar por código o nombre de producto..."
                      value={filtroBusqueda}
                      onChange={(e) => setFiltroBusqueda(e.target.value)}
                    />
                  </div>
                </div>
                <div className="receta-manager__categoria">
                  <label htmlFor="receta-categoria" className="insumo-filters__label">Categoría insumo</label>
                  <select
                    id="receta-categoria"
                    className="insumo-filters__select"
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    style={{ width: 'auto' }}
                  >
                    <option value="Todas">Todas</option>
                    {categoriasConInsumos.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lista */}
              <div className="receta-manager__tabla-wrapper">
                {recetasFiltradas.length === 0 ? (
                  <div className="receta-manager__vacio">
                    <span aria-hidden="true">📭</span>
                    <p>{recetas.length === 0 ? 'No hay recetas definidas' : 'No coinciden con los filtros'}</p>
                    <button
                      className="insumo-modal__btn insumo-modal__btn--primaria"
                      onClick={manejarNuevaReceta}
                    >
                      <span aria-hidden="true">+</span> Crear primera receta
                    </button>
                  </div>
                ) : (
                  <table className="receta-manager__tabla" role="grid">
                    <thead>
                      <tr>
                        <th scope="col">Código</th>
                        <th scope="col">Producto</th>
                        <th scope="col">Ingredientes</th>
                        <th scope="col" style={{ width: '120px' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recetasFiltradas.map(receta => (
                        <tr key={receta.id}>
                          <td><code>{receta.productoCodigo}</code></td>
                          <td><strong>{receta.productoNombre}</strong></td>
                          <td>
                            <div className="receta-manager__ingredientes-preview">
                              {receta.insumos.slice(0, 3).map((ing, i) => (
                                <span key={i} className="receta-manager__ing-tag">
                                  {ing.insumoNombre}: {ing.cantidad} {ing.unidadMedida}
                                </span>
                              ))}
                              {receta.insumos.length > 3 && (
                                <span className="receta-manager__ing-tag receta-manager__ing-tag--mas">
                                  +{receta.insumos.length - 3} más
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="receta-manager__acciones">
                              <button
                                className="receta-manager__btn"
                                onClick={() => manejarEditarReceta(receta)}
                                title="Editar"
                              >
                                ✏️
                              </button>
                              <button
                                className="receta-manager__btn receta-manager__btn--eliminar"
                                onClick={() => manejarEliminarReceta(receta)}
                                title="Eliminar"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Botón nueva receta */}
              <div className="receta-manager__footer-acciones">
                <button
                  className="insumo-modal__btn insumo-modal__btn--primaria"
                  onClick={manejarNuevaReceta}
                >
                  <span aria-hidden="true">+</span> Nueva Receta
                </button>
              </div>
            </div>

            {/* Confirmar eliminar */}
            {mostrarConfirmacionEliminar && (
              <div className="insumo-modal__overlay" onClick={() => setMostrarConfirmacionEliminar(false)} role="dialog" aria-modal="true">
                <div className="insumo-modal insumo-modal--confirmar" onClick={(e) => e.stopPropagation()}>
                  <header className="insumo-modal__header">
                    <h2 className="insumo-modal__titulo">Eliminar receta</h2>
                  </header>
                  <div className="insumo-modal__form" style={{ padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }} aria-hidden="true">🗑️</div>
                    <h3 style={{ margin: '12px 0 8px', color: '#44271D' }}>
                      ¿Eliminar receta de <strong>{recetaEliminando?.productoNombre}</strong>?
                    </h3>
                    <p style={{ color: '#8B6B5A', margin: 0 }}>
                      Código: {recetaEliminando?.productoCodigo} · {recetaEliminando?.insumos.length} ingredientes
                    </p>
                  </div>
                  <footer className="insumo-modal__footer">
                    <button className="insumo-modal__btn insumo-modal__btn--cancelar" onClick={() => setMostrarConfirmacionEliminar(false)}>
                      Cancelar
                    </button>
                    <button className="insumo-modal__btn insumo-modal__btn--eliminar" onClick={manejarConfirmarEliminar}>
                      <span aria-hidden="true">🗑️</span> Eliminar
                    </button>
                  </footer>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}