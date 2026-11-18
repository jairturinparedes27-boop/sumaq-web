// src/components/Productos/ProductoModal.jsx
// Modal para crear/editar productos

import { useState, useEffect, useRef, useCallback } from 'react';
import './ProductoModal.css';

export function ProductoModal({
  abierto,
  onCerrar,
  producto,
  categorias,
  onGuardar,
  obtenerIconoCategoria
}) {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    categoriaId: '',
    descripcion: '',
    precioVenta: '',
    imagen: '',
    estado: 'Activo',
    disponible: true
  });
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [tocado, setTocado] = useState({});
  const modalRef = useRef(null);
  const primerInputRef = useRef(null);

  const esEdicion = !!producto;

  // Clave para resetear formulario al cambiar de producto (evita useEffect con setState)
  const formKey = producto?.id ?? 'nuevo';

  // Focus trap y primer input
  useEffect(() => {
    if (abierto) {
      setTimeout(() => primerInputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [abierto]);

  // Focus trap y primer input
  useEffect(() => {
    if (abierto) {
      setTimeout(() => primerInputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [abierto]);

  // Manejar teclas (ESC para cerrar)
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onCerrar();
    }
    if (e.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }, [onCerrar]);

  const validarCampo = (nombre, valor) => {
    const nuevosErrores = { ...errores };

    switch (nombre) {
      case 'codigo':
        if (!valor?.trim()) {
          nuevosErrores.codigo = 'El código es obligatorio';
        } else if (!/^[A-Z0-9-]+$/i.test(valor.trim())) {
          nuevosErrores.codigo = 'Solo letras, números y guiones';
        }
        break;
      case 'nombre':
        if (!valor?.trim()) {
          nuevosErrores.nombre = 'El nombre es obligatorio';
        } else if (valor.trim().length < 2) {
          nuevosErrores.nombre = 'Mínimo 2 caracteres';
        }
        break;
      case 'categoriaId':
        if (!valor) {
          nuevosErrores.categoriaId = 'Seleccione una categoría';
        }
        break;
      case 'precioVenta': {
        const precio = Number(valor);
        if (valor === '' || isNaN(precio)) {
          nuevosErrores.precioVenta = 'Ingrese un precio válido';
        } else if (precio < 0) {
          nuevosErrores.precioVenta = 'El precio no puede ser negativo';
        }
        break;
      }
    }

    if (!nuevosErrores[nombre]) {
      delete nuevosErrores[nombre];
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nuevoValor = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: nuevoValor }));

    // Validar al perder foco (onBlur) o al escribir si ya fue tocado
    if (tocado[name]) {
      validarCampo(name, nuevoValor);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTocado(prev => ({ ...prev, [name]: true }));
    validarCampo(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos
    const campos = ['codigo', 'nombre', 'categoriaId', 'precioVenta'];
    let valido = true;
    campos.forEach(campo => {
      if (!validarCampo(campo, formData[campo])) {
        valido = false;
      }
    });
    setTocado(campos.reduce((acc, c) => ({ ...acc, [c]: true }), {}));

    if (!valido || guardando) return;

    setGuardando(true);
    try {
      await onGuardar(formData);
      onCerrar();
    } catch (error) {
      // Errores de validación del hook (código duplicado, etc.)
      try {
        const errObj = JSON.parse(error.message);
        setErrores(errObj);
      } catch {
        setErrores({ general: error.message || 'Error al guardar' });
      }
    } finally {
      setGuardando(false);
    }
  };

  if (!abierto) return null;

  const categoriaSeleccionada = categorias.find(c => c.id === formData.categoriaId);
  const iconoSugerido = categoriaSeleccionada ? obtenerIconoCategoria(categoriaSeleccionada.nombre) : '📦';

  return (
    <div
      className="producto-modal__overlay"
      onClick={onCerrar}
      role="dialog"
      aria-modal="true"
      aria-labelledby="producto-modal-titulo"
      onKeyDown={handleKeyDown}
    >
      <div
        className="producto-modal"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="producto-modal__header">
          <h2 id="producto-modal-titulo" className="producto-modal__titulo">
            {esEdicion ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
          </h2>
          <button
            className="producto-modal__cerrar"
            onClick={onCerrar}
            aria-label="Cerrar"
            type="button"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </header>

        {/* Form - key prop remounts form when product changes, resetting state */}
        <form key={formKey} className="producto-modal__form" onSubmit={handleSubmit}>
          <div className="producto-modal__grid">
            {/* Código */}
            <div className="producto-modal__campo">
              <label htmlFor="producto-codigo" className="producto-modal__label">
                Código <span className="producto-modal__requerido" aria-hidden="true">*</span>
              </label>
              <input
                ref={primerInputRef}
                id="producto-codigo"
                type="text"
                name="codigo"
                className={`producto-modal__input ${errores.codigo ? 'producto-modal__input--error' : ''}`}
                value={formData.codigo}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: ANT001, BRP001..."
                autoComplete="off"
                maxLength={20}
                disabled={esEdicion}
                aria-invalid={!!errores.codigo}
                aria-describedby={errores.codigo ? 'error-codigo' : undefined}
              />
              {errores.codigo && (
                <span id="error-codigo" className="producto-modal__error" role="alert">{errores.codigo}</span>
              )}
              <p className="producto-modal__ayuda">Solo letras, números y guiones. Único.</p>
            </div>

            {/* Nombre */}
            <div className="producto-modal__campo">
              <label htmlFor="producto-nombre" className="producto-modal__label">
                Nombre <span className="producto-modal__requerido" aria-hidden="true">*</span>
              </label>
              <input
                id="producto-nombre"
                type="text"
                name="nombre"
                className={`producto-modal__input ${errores.nombre ? 'producto-modal__input--error' : ''}`}
                value={formData.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: Anticucho Clásico"
                maxLength={100}
                aria-invalid={!!errores.nombre}
                aria-describedby={errores.nombre ? 'error-nombre' : undefined}
              />
              {errores.nombre && (
                <span id="error-nombre" className="producto-modal__error" role="alert">{errores.nombre}</span>
              )}
            </div>

            {/* Categoría */}
            <div className="producto-modal__campo">
              <label htmlFor="producto-categoria" className="producto-modal__label">
                Categoría <span className="producto-modal__requerido" aria-hidden="true">*</span>
              </label>
              <select
                id="producto-categoria"
                name="categoriaId"
                className={`producto-modal__select ${errores.categoriaId ? 'producto-modal__input--error' : ''}`}
                value={formData.categoriaId}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errores.categoriaId}
                aria-describedby={errores.categoriaId ? 'error-categoria' : undefined}
              >
                <option value="">Seleccionar categoría...</option>
                {categorias.filter(c => c.activa).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
              {errores.categoriaId && (
                <span id="error-categoria" className="producto-modal__error" role="alert">{errores.categoriaId}</span>
              )}
            </div>

            {/* Precio */}
            <div className="producto-modal__campo">
              <label htmlFor="producto-precio" className="producto-modal__label">
                Precio de Venta (S/) <span className="producto-modal__requerido" aria-hidden="true">*</span>
              </label>
              <div className="producto-modal__input-precio">
                <span className="producto-modal__precio-simbolo" aria-hidden="true">S/</span>
                <input
                  id="producto-precio"
                  type="number"
                  name="precioVenta"
                  className={`producto-modal__input ${errores.precioVenta ? 'producto-modal__input--error' : ''}`}
                  value={formData.precioVenta}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="0.00"
                  step="0.10"
                  min="0"
                  aria-invalid={!!errores.precioVenta}
                  aria-describedby={errores.precioVenta ? 'error-precio' : undefined}
                />
              </div>
              {errores.precioVenta && (
                <span id="error-precio" className="producto-modal__error" role="alert">{errores.precioVenta}</span>
              )}
            </div>

            {/* Descripción (ancho completo) */}
            <div className="producto-modal__campo producto-modal__campo--full">
              <label htmlFor="producto-descripcion" className="producto-modal__label">
                Descripción
              </label>
              <textarea
                id="producto-descripcion"
                name="descripcion"
                className="producto-modal__textarea"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Descripción del producto, ingredientes, preparación..."
                rows={3}
                maxLength={500}
              />
              <p className="producto-modal__ayuda">{formData.descripcion.length}/500 caracteres</p>
            </div>

            {/* Imagen */}
            <div className="producto-modal__campo producto-modal__campo--full">
              <label htmlFor="producto-imagen" className="producto-modal__label">
                Imagen (URL o emoji)
              </label>
              <input
                id="producto-imagen"
                type="text"
                name="imagen"
                className="producto-modal__input"
                value={formData.imagen}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg o 🍢"
                maxLength={500}
              />
              <p className="producto-modal__ayuda">
                URL de imagen o emoji. Sugerido: {iconoSugerido}
              </p>
              {formData.imagen && (
                <div className="producto-modal__preview">
                  {formData.imagen.startsWith('http') ? (
                    <img src={formData.imagen} alt="Vista previa" onError={(e) => e.target.style.display = 'none'} />
                  ) : (
                    <span className="producto-modal__preview-emoji">{formData.imagen}</span>
                  )}
                </div>
              )}
            </div>

            {/* Estado y Disponibilidad */}
            <div className="producto-modal__campo">
              <fieldset className="producto-modal__fieldset">
                <legend className="producto-modal__legend">Estado</legend>
                <div className="producto-modal__radio-group">
                  <label className="producto-modal__radio">
                    <input
                      type="radio"
                      name="estado"
                      value="Activo"
                      checked={formData.estado === 'Activo'}
                      onChange={handleChange}
                    />
                    <span className="producto-modal__radio-custom"></span>
                    <span className="producto-modal__radio-text">Activo</span>
                  </label>
                  <label className="producto-modal__radio">
                    <input
                      type="radio"
                      name="estado"
                      value="Inactivo"
                      checked={formData.estado === 'Inactivo'}
                      onChange={handleChange}
                    />
                    <span className="producto-modal__radio-custom"></span>
                    <span className="producto-modal__radio-text">Inactivo</span>
                  </label>
                </div>
              </fieldset>
            </div>

            <div className="producto-modal__campo">
              <fieldset className="producto-modal__fieldset">
                <legend className="producto-modal__legend">Disponibilidad</legend>
                <div className="producto-modal__radio-group">
                  <label className="producto-modal__radio">
                    <input
                      type="radio"
                      name="disponible"
                      value={true}
                      checked={formData.disponible}
                      onChange={handleChange}
                    />
                    <span className="producto-modal__radio-custom"></span>
                    <span className="producto-modal__radio-text">Disponible para venta</span>
                  </label>
                  <label className="producto-modal__radio">
                    <input
                      type="radio"
                      name="disponible"
                      value={false}
                      checked={!formData.disponible}
                      onChange={handleChange}
                    />
                    <span className="producto-modal__radio-custom"></span>
                    <span className="producto-modal__radio-text">No disponible</span>
                  </label>
                </div>
              </fieldset>
            </div>
          </div>

          {/* Error general */}
          {errores.general && (
            <div className="producto-modal__error-general" role="alert">
              <span aria-hidden="true">⚠</span> {errores.general}
            </div>
          )}

          {/* Footer */}
          <footer className="producto-modal__footer">
            <button
              type="button"
              className="producto-modal__btn producto-modal__btn--cancelar"
              onClick={onCerrar}
              disabled={guardando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="producto-modal__btn producto-modal__btn--guardar"
              disabled={guardando}
            >
              {guardando ? (
                <>
                  <span className="producto-modal__spinner" aria-hidden="true"></span>
                  Guardando...
                </>
              ) : (
                `${esEdicion ? '💾 Actualizar' : '➕ Crear'} Producto`
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}