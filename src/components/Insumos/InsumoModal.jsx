// src/components/Insumos/InsumoModal.jsx
// Modal para crear/editar insumos

import { useState, useEffect, useRef, useCallback } from 'react';
import './InsumoModal.css';

export function InsumoModal({
  abierto,
  onCerrar,
  insumo,
  categorias,
  proveedores,
  unidadesMedida,
  estados,
  onGuardar
}) {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    categoriaId: '',
    unidadMedida: 'kg',
    stockActual: '',
    stockMinimo: '',
    precioCompra: '',
    proveedorId: '',
    estado: 'Activo',
    permiteStockNegativo: false
  });
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [tocado, setTocado] = useState({});
  const modalRef = useRef(null);
  const primerInputRef = useRef(null);

  const esEdicion = !!insumo;

  // Clave para resetear formulario al cambiar de insumo
  const formKey = insumo?.id ?? 'nuevo';

  // Focus trap
  useEffect(() => {
    if (abierto) {
      setTimeout(() => primerInputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [abierto]);

  // Manejar teclas
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
      case 'unidadMedida':
        if (!valor) {
          nuevosErrores.unidadMedida = 'Seleccione una unidad';
        }
        break;
      case 'stockActual': {
        const stock = Number(valor);
        if (valor === '' || isNaN(stock)) {
          nuevosErrores.stockActual = 'Ingrese un stock válido';
        } else if (stock < 0) {
          nuevosErrores.stockActual = 'El stock no puede ser negativo';
        }
        break;
      }
      case 'stockMinimo': {
        const stock = Number(valor);
        if (valor === '' || isNaN(stock)) {
          nuevosErrores.stockMinimo = 'Ingrese un stock mínimo válido';
        } else if (stock < 0) {
          nuevosErrores.stockMinimo = 'El stock mínimo no puede ser negativo';
        }
        break;
      }
      case 'precioCompra': {
        const precio = Number(valor);
        if (valor === '' || isNaN(precio)) {
          nuevosErrores.precioCompra = 'Ingrese un precio válido';
        } else if (precio < 0) {
          nuevosErrores.precioCompra = 'El precio no puede ser negativo';
        }
        break;
      }
      case 'proveedorId':
        if (!valor) {
          nuevosErrores.proveedorId = 'Seleccione un proveedor';
        }
        break;
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

    const campos = ['codigo', 'nombre', 'categoriaId', 'unidadMedida', 'stockActual', 'stockMinimo', 'precioCompra', 'proveedorId'];
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

  return (
    <div
      className="insumo-modal__overlay"
      onClick={onCerrar}
      role="dialog"
      aria-modal="true"
      aria-labelledby="insumo-modal-titulo"
      onKeyDown={handleKeyDown}
    >
      <div
        className="insumo-modal"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="insumo-modal__header">
          <h2 id="insumo-modal-titulo" className="insumo-modal__titulo">
            {esEdicion ? '✏️ Editar Insumo' : '➕ Nuevo Insumo'}
          </h2>
          <button
            className="insumo-modal__cerrar"
            onClick={onCerrar}
            aria-label="Cerrar"
            type="button"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </header>

        {/* Form */}
        <form key={formKey} className="insumo-modal__form" onSubmit={handleSubmit}>
          <div className="insumo-modal__grid">
            {/* Código */}
            <div className="insumo-modal__campo">
              <label htmlFor="insumo-codigo" className="insumo-modal__label">
                Código <span className="insumo-modal__requerido" aria-hidden="true">*</span>
              </label>
              <input
                ref={primerInputRef}
                id="insumo-codigo"
                type="text"
                name="codigo"
                className={`insumo-modal__input ${errores.codigo ? 'insumo-modal__input--error' : ''}`}
                value={formData.codigo}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: CAR001, VER001..."
                autoComplete="off"
                maxLength={20}
                disabled={esEdicion}
                aria-invalid={!!errores.codigo}
                aria-describedby={errores.codigo ? 'error-codigo' : undefined}
              />
              {errores.codigo && (
                <span id="error-codigo" className="insumo-modal__error" role="alert">{errores.codigo}</span>
              )}
              <p className="insumo-modal__ayuda">Solo letras, números y guiones. Único.</p>
            </div>

            {/* Nombre */}
            <div className="insumo-modal__campo">
              <label htmlFor="insumo-nombre" className="insumo-modal__label">
                Nombre <span className="insumo-modal__requerido" aria-hidden="true">*</span>
              </label>
              <input
                id="insumo-nombre"
                type="text"
                name="nombre"
                className={`insumo-modal__input ${errores.nombre ? 'insumo-modal__input--error' : ''}`}
                value={formData.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: Corazón de Res"
                maxLength={100}
                aria-invalid={!!errores.nombre}
                aria-describedby={errores.nombre ? 'error-nombre' : undefined}
              />
              {errores.nombre && (
                <span id="error-nombre" className="insumo-modal__error" role="alert">{errores.nombre}</span>
              )}
            </div>

            {/* Categoría */}
            <div className="insumo-modal__campo">
              <label htmlFor="insumo-categoria" className="insumo-modal__label">
                Categoría <span className="insumo-modal__requerido" aria-hidden="true">*</span>
              </label>
              <select
                id="insumo-categoria"
                name="categoriaId"
                className={`insumo-modal__select ${errores.categoriaId ? 'insumo-modal__input--error' : ''}`}
                value={formData.categoriaId}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errores.categoriaId}
                aria-describedby={errores.categoriaId ? 'error-categoria' : undefined}
              >
                <option value="">Seleccionar categoría...</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
              {errores.categoriaId && (
                <span id="error-categoria" className="insumo-modal__error" role="alert">{errores.categoriaId}</span>
              )}
            </div>

            {/* Unidad de Medida */}
            <div className="insumo-modal__campo">
              <label htmlFor="insumo-unidad" className="insumo-modal__label">
                Unidad <span className="insumo-modal__requerido" aria-hidden="true">*</span>
              </label>
              <select
                id="insumo-unidad"
                name="unidadMedida"
                className={`insumo-modal__select ${errores.unidadMedida ? 'insumo-modal__input--error' : ''}`}
                value={formData.unidadMedida}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errores.unidadMedida}
                aria-describedby={errores.unidadMedida ? 'error-unidad' : undefined}
              >
                <option value="">Seleccionar unidad...</option>
                {unidadesMedida.map(um => (
                  <option key={um.valor} value={um.valor}>
                    {um.etiqueta}
                  </option>
                ))}
              </select>
              {errores.unidadMedida && (
                <span id="error-unidad" className="insumo-modal__error" role="alert">{errores.unidadMedida}</span>
              )}
            </div>

            {/* Stock Actual */}
            <div className="insumo-modal__campo">
              <label htmlFor="insumo-stock-actual" className="insumo-modal__label">
                Stock Actual <span className="insumo-modal__requerido" aria-hidden="true">*</span>
              </label>
              <input
                id="insumo-stock-actual"
                type="number"
                name="stockActual"
                className={`insumo-modal__input ${errores.stockActual ? 'insumo-modal__input--error' : ''}`}
                value={formData.stockActual}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="0.00"
                step="0.01"
                min="0"
                aria-invalid={!!errores.stockActual}
                aria-describedby={errores.stockActual ? 'error-stock-actual' : undefined}
              />
              {errores.stockActual && (
                <span id="error-stock-actual" className="insumo-modal__error" role="alert">{errores.stockActual}</span>
              )}
              <p className="insumo-modal__ayuda">Stock disponible al momento</p>
            </div>

            {/* Stock Mínimo */}
            <div className="insumo-modal__campo">
              <label htmlFor="insumo-stock-minimo" className="insumo-modal__label">
                Stock Mínimo <span className="insumo-modal__requerido" aria-hidden="true">*</span>
              </label>
              <input
                id="insumo-stock-minimo"
                type="number"
                name="stockMinimo"
                className={`insumo-modal__input ${errores.stockMinimo ? 'insumo-modal__input--error' : ''}`}
                value={formData.stockMinimo}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="0.00"
                step="0.01"
                min="0"
                aria-invalid={!!errores.stockMinimo}
                aria-describedby={errores.stockMinimo ? 'error-stock-minimo' : undefined}
              />
              {errores.stockMinimo && (
                <span id="error-stock-minimo" className="insumo-modal__error" role="alert">{errores.stockMinimo}</span>
              )}
              <p className="insumo-modal__ayuda">Alerta cuando stock ≤ este valor</p>
            </div>

            {/* Precio Compra */}
            <div className="insumo-modal__campo">
              <label htmlFor="insumo-precio" className="insumo-modal__label">
                Precio Compra (S/) <span className="insumo-modal__requerido" aria-hidden="true">*</span>
              </label>
              <div className="insumo-modal__input-precio">
                <span className="insumo-modal__precio-simbolo" aria-hidden="true">S/</span>
                <input
                  id="insumo-precio"
                  type="number"
                  name="precioCompra"
                  className={`insumo-modal__input ${errores.precioCompra ? 'insumo-modal__input--error' : ''}`}
                  value={formData.precioCompra}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="0.00"
                  step="0.10"
                  min="0"
                  aria-invalid={!!errores.precioCompra}
                  aria-describedby={errores.precioCompra ? 'error-precio' : undefined}
                />
              </div>
              {errores.precioCompra && (
                <span id="error-precio" className="insumo-modal__error" role="alert">{errores.precioCompra}</span>
              )}
            </div>

            {/* Proveedor */}
            <div className="insumo-modal__campo">
              <label htmlFor="insumo-proveedor" className="insumo-modal__label">
                Proveedor <span className="insumo-modal__requerido" aria-hidden="true">*</span>
              </label>
              <select
                id="insumo-proveedor"
                name="proveedorId"
                className={`insumo-modal__select ${errores.proveedorId ? 'insumo-modal__input--error' : ''}`}
                value={formData.proveedorId}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errores.proveedorId}
                aria-describedby={errores.proveedorId ? 'error-proveedor' : undefined}
              >
                <option value="">Seleccionar proveedor...</option>
                {proveedores.map(prov => (
                  <option key={prov.id} value={prov.id}>
                    {prov.nombre}
                  </option>
                ))}
              </select>
              {errores.proveedorId && (
                <span id="error-proveedor" className="insumo-modal__error" role="alert">{errores.proveedorId}</span>
              )}
            </div>

            {/* Estado */}
            <div className="insumo-modal__campo">
              <fieldset className="insumo-modal__fieldset">
                <legend className="insumo-modal__legend">Estado</legend>
                <div className="insumo-modal__radio-group">
                  {estados.map(est => (
                    <label key={est} className="insumo-modal__radio">
                      <input
                        type="radio"
                        name="estado"
                        value={est}
                        checked={formData.estado === est}
                        onChange={handleChange}
                      />
                      <span className="insumo-modal__radio-custom"></span>
                      <span className="insumo-modal__radio-text">{est}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            {/* Permitir Stock Negativo */}
            <div className="insumo-modal__campo">
              <label className="insumo-modal__checkbox-label">
                <input
                  type="checkbox"
                  name="permiteStockNegativo"
                  className="insumo-modal__checkbox"
                  checked={formData.permiteStockNegativo}
                  onChange={handleChange}
                />
                <span className="insumo-modal__checkbox-custom"></span>
                <span className="insumo-modal__checkbox-text">
                  Permitir stock negativo (para insumos de uso continuo)
                </span>
              </label>
              <p className="insumo-modal__ayuda">Requiere autorización al registrar salidas que dejen stock negativo</p>
            </div>
          </div>

          {/* Error general */}
          {errores.general && (
            <div className="insumo-modal__error-general" role="alert">
              <span aria-hidden="true">⚠</span> {errores.general}
            </div>
          )}

          {/* Footer */}
          <footer className="insumo-modal__footer">
            <button
              type="button"
              className="insumo-modal__btn insumo-modal__btn--cancelar"
              onClick={onCerrar}
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
                <>
                  <span className="insumo-modal__spinner" aria-hidden="true"></span>
                  Guardando...
                </>
              ) : (
                `${esEdicion ? '💾 Actualizar' : '➕ Crear'} Insumo`
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}