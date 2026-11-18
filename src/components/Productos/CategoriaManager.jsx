// src/components/Productos/CategoriaManager.jsx
// Gestión de categorías (modal lateral o drawer)

import { useState, useEffect, useRef, useCallback } from 'react';
import './CategoriaManager.css';

export function CategoriaManager({
  abierto,
  onCerrar,
  categorias,
  onCrear,
  onEditar,
  onEliminar,
  onReordenar,
  onToggleActiva
}) {
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '', activa: true });
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const modalRef = useRef(null);
  const listaRef = useRef(null);

  const esEdicion = !!categoriaEditando;

  // Clave para resetear formulario al cambiar de edición (evita useEffect con setState)
  const formKey = categoriaEditando?.id ?? 'nuevo';

  // Focus trap
  useEffect(() => {
    if (abierto) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => modalRef.current?.querySelector('input')?.focus(), 100);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [abierto]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      if (categoriaEditando) {
        setCategoriaEditando(null);
      } else {
        onCerrar();
      }
    }
  }, [categoriaEditando, onCerrar]);

  const validar = () => {
    const nuevos = {};
    if (!formData.nombre?.trim()) {
      nuevos.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.trim().length < 2) {
      nuevos.nombre = 'Mínimo 2 caracteres';
    } else if (categorias.some(c =>
      c.nombre.toLowerCase() === formData.nombre.trim().toLowerCase() &&
      c.id !== (categoriaEditando?.id || '')
    )) {
      nuevos.nombre = 'Esta categoría ya existe';
    }
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar() || guardando) return;

    setGuardando(true);
    try {
      if (categoriaEditando) {
        await onEditar(categoriaEditando.id, { ...formData, nombre: formData.nombre.trim() });
      } else {
        await onCrear({ ...formData, nombre: formData.nombre.trim() });
      }
      setCategoriaEditando(null);
    } catch (error) {
      setErrores({ general: error.message });
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (categoria) => {
    if (window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?\nEsta acción no se puede deshacer.`)) {
      try {
        await onEliminar(categoria.id);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const iniciarEdicion = (categoria) => {
    setFormData({
      nombre: categoria.nombre || '',
      descripcion: categoria.descripcion || '',
      activa: categoria.activa !== false
    });
    setErrores({});
    setCategoriaEditando(categoria);
  };

  const cancelarEdicion = () => {
    setFormData({ nombre: '', descripcion: '', activa: true });
    setErrores({});
    setCategoriaEditando(null);
  };

  // Drag and drop para reordenar
  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('categoria-manager__item--arrastrando');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const item = e.target.closest('.categoria-manager__item');
    if (item && !item.classList.contains('categoria-manager__item--arrastrando')) {
      const draggedItem = listaRef.current?.querySelector('.categoria-manager__item--arrastrando');
      if (draggedItem) {
        const rect = item.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        if (e.clientY < midY) {
          item.parentNode.insertBefore(draggedItem, item);
        } else {
          item.parentNode.insertBefore(draggedItem, item.nextSibling);
        }
      }
    }
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('categoria-manager__item--arrastrando');
    const nuevoOrden = [...listaRef.current?.querySelectorAll('.categoria-manager__item') || []]
      .map(el => el.dataset.id)
      .filter(Boolean);
    const categoriasOrdenadas = nuevoOrden.map(id => categorias.find(c => c.id === id)).filter(Boolean);
    onReordenar(categoriasOrdenadas);
  };

  if (!abierto) return null;

  return (
    <div
      className="categoria-manager__overlay"
      onClick={onCerrar}
      role="dialog"
      aria-modal="true"
      aria-labelledby="categoria-manager-titulo"
      onKeyDown={handleKeyDown}
    >
      <div
        className="categoria-manager"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="categoria-manager__header">
          <h2 id="categoria-manager-titulo" className="categoria-manager__titulo">📂 Categorías</h2>
          <button
            className="categoria-manager__cerrar"
            onClick={onCerrar}
            aria-label="Cerrar"
            type="button"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </header>

        {/* Contenido */}
        <div className="categoria-manager__contenido">
          {/* Formulario crear/editar - key remounts form al cambiar categoría editando */}
          <form key={formKey} className="categoria-manager__form" onSubmit={handleSubmit}>
            <div className="categoria-manager__campo">
              <label htmlFor="categoria-nombre" className="categoria-manager__label">
                Nombre <span className="categoria-manager__requerido" aria-hidden="true">*</span>
              </label>
              <input
                id="categoria-nombre"
                type="text"
                className={`categoria-manager__input ${errores.nombre ? 'categoria-manager__input--error' : ''}`}
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Ej: Postres, Entradas..."
                maxLength={50}
                aria-invalid={!!errores.nombre}
              />
              {errores.nombre && <span className="categoria-manager__error" role="alert">{errores.nombre}</span>}
            </div>

            <div className="categoria-manager__campo">
              <label htmlFor="categoria-descripcion" className="categoria-manager__label">Descripción</label>
              <textarea
                id="categoria-descripcion"
                className="categoria-manager__textarea"
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                placeholder="Descripción opcional..."
                rows={2}
                maxLength={200}
              />
            </div>

            <div className="categoria-manager__campo categoria-manager__campo--checkbox">
              <label className="categoria-manager__checkbox-label">
                <input
                  type="checkbox"
                  className="categoria-manager__checkbox"
                  checked={formData.activa}
                  onChange={(e) => setFormData(prev => ({ ...prev, activa: e.target.checked }))}
                />
                <span className="categoria-manager__checkbox-custom"></span>
                <span className="categoria-manager__checkbox-text">Categoría activa (visible en productos)</span>
              </label>
            </div>

            {errores.general && (
              <div className="categoria-manager__error-general" role="alert">
                <span aria-hidden="true">⚠</span> {errores.general}
              </div>
            )}

            <div className="categoria-manager__form-footer">
              <button
                type="button"
                className="categoria-manager__btn categoria-manager__btn--cancelar"
                onClick={cancelarEdicion}
                disabled={guardando}
              >
                {esEdicion ? 'Cancelar' : 'Cerrar'}
              </button>
              <button
                type="submit"
                className="categoria-manager__btn categoria-manager__btn--guardar"
                disabled={guardando}
              >
                {guardando ? (
                  <>
                    <span className="categoria-manager__spinner" aria-hidden="true"></span>
                    Guardando...
                  </>
                ) : (
                  esEdicion ? '💾 Actualizar' : '➕ Crear Categoría'
                )}
              </button>
            </div>
          </form>

          {/* Lista de categorías */}
          <div className="categoria-manager__lista-wrapper">
            <h3 className="categoria-manager__lista-titulo">
              Categorías ({categorias.length})
              <span className="categoria-manager__hint" aria-hidden="true">⋮⋮ Arrastrar para reordenar</span>
            </h3>
            <ul
              ref={listaRef}
              className="categoria-manager__lista"
              role="list"
              aria-label="Lista de categorías"
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              {categorias.length === 0 ? (
                <li className="categoria-manager__vacio">
                  <span aria-hidden="true">📭</span>
                  <p>No hay categorías. Crea la primera arriba.</p>
                </li>
              ) : (
                categorias.map((cat, index) => (
                  <li
                    key={cat.id}
                    className={`categoria-manager__item ${!cat.activa ? 'categoria-manager__item--inactiva' : ''}`}
                    data-id={cat.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, cat)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="categoria-manager__item-info">
                      <span className="categoria-manager__arrastrar" aria-label="Arrastrar para reordenar" aria-hidden="true">⋮⋮</span>
                      <span className="categoria-manager__orden" aria-label={`Orden ${index + 1}`}>{index + 1}</span>
                      <strong className="categoria-manager__nombre">{cat.nombre}</strong>
                      {cat.descripcion && (
                        <span className="categoria-manager__descripcion">{cat.descripcion}</span>
                      )}
                    </div>
                    <div className="categoria-manager__item-acciones">
                      <span
                        className={`categoria-manager__estado ${cat.activa ? 'categoria-manager__estado--activa' : 'categoria-manager__estado--inactiva'}`}
                        onClick={() => onToggleActiva(cat.id)}
                        aria-label={cat.activa ? 'Desactivar' : 'Activar'}
                        title={cat.activa ? 'Activa - click para desactivar' : 'Inactiva - click para activar'}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggleActiva(cat.id); } }}
                      >
                        {cat.activa ? '🟢' : '⚪'}
                      </span>
                      <button
                        className="categoria-manager__btn categoria-manager__btn--editar"
                        onClick={() => iniciarEdicion(cat)}
                        aria-label={`Editar ${cat.nombre}`}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="categoria-manager__btn categoria-manager__btn--eliminar"
                        onClick={() => handleEliminar(cat)}
                        aria-label={`Eliminar ${cat.nombre}`}
                        title="Eliminar"
                        disabled={categorias.length === 1}
                      >
                        🗑️
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}