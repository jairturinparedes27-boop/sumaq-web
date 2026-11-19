// src/components/Trabajadores/TrabajadorModal.jsx
// Modal para crear/editar trabajadores

import { useState, useEffect, useRef, useCallback } from 'react';
import './TrabajadorModal.css';

export function TrabajadorModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  cargosActivos,
  cargando = false,
  titulo = 'Nuevo Trabajador'
}) {
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  const prevIsOpen = useRef(isOpen);
  const focusRestored = useRef(false);

  // Form state
  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    email: '',
    direccion: '',
    cargo: '',
    fechaIngreso: '',
    estado: 'Activo'
  });

  const [errores, setErrores] = useState({});
  const [touched, setTouched] = useState({});

  // Sincronizar initialData con formData
  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        dni: initialData.dni || '',
        nombres: initialData.nombres || '',
        apellidos: initialData.apellidos || '',
        telefono: initialData.telefono || '',
        email: initialData.email || '',
        direccion: initialData.direccion || '',
        cargo: initialData.cargo || '',
        fechaIngreso: initialData.fechaIngreso || '',
        estado: initialData.estado || 'Activo'
      });
      setErrores({});
      setTouched({});
      focusRestored.current = false;
    } else {
      setFormData({
        dni: '',
        nombres: '',
        apellidos: '',
        telefono: '',
        email: '',
        direccion: '',
        cargo: '',
        fechaIngreso: new Date().toISOString().split('T')[0],
        estado: 'Activo'
      });
      setErrores({});
      setTouched({});
      focusRestored.current = false;
    }
  }, [initialData, isOpen]);

  // Focus management y trap
  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
      // Modal se abre
      document.body.style.overflow = 'hidden';
      // Enfocar primer input después del render
      setTimeout(() => {
        firstInputRef.current?.focus();
        focusRestored.current = true;
      }, 50);
    } else if (!isOpen && prevIsOpen.current) {
      // Modal se cierra
      document.body.style.overflow = '';
      focusRestored.current = false;
    }
    prevIsOpen.current = isOpen;

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Cerrar con ESC
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Validación en tiempo real
  const validarCampo = useCallback((name, value) => {
    const erroresNuevos = { ...errores };

    switch (name) {
      case 'dni':
        if (!value?.trim()) {
          erroresNuevos.dni = 'El DNI es obligatorio';
        } else if (!/^\d{8}$/.test(value.trim())) {
          erroresNuevos.dni = 'El DNI debe tener 8 dígitos';
        } else {
          delete erroresNuevos.dni;
        }
        break;

      case 'nombres':
        if (!value?.trim()) {
          erroresNuevos.nombres = 'Los nombres son obligatorios';
        } else if (value.trim().length < 2) {
          erroresNuevos.nombres = 'Mínimo 2 caracteres';
        } else {
          delete erroresNuevos.nombres;
        }
        break;

      case 'apellidos':
        if (!value?.trim()) {
          erroresNuevos.apellidos = 'Los apellidos son obligatorios';
        } else if (value.trim().length < 2) {
          erroresNuevos.apellidos = 'Mínimo 2 caracteres';
        } else {
          delete erroresNuevos.apellidos;
        }
        break;

      case 'telefono':
        if (value && !/^\d{9}$/.test(value.trim())) {
          erroresNuevos.telefono = 'El teléfono debe tener 9 dígitos';
        } else {
          delete erroresNuevos.telefono;
        }
        break;

      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          erroresNuevos.email = 'Formato de email inválido';
        } else {
          delete erroresNuevos.email;
        }
        break;

      case 'cargo':
        if (!value?.trim()) {
          erroresNuevos.cargo = 'Seleccione un cargo';
        } else {
          delete erroresNuevos.cargo;
        }
        break;

      case 'fechaIngreso':
        if (!value?.trim()) {
          erroresNuevos.fechaIngreso = 'La fecha de ingreso es obligatoria';
        } else {
          delete erroresNuevos.fechaIngreso;
        }
        break;

      default:
        break;
    }

    setErrores(erroresNuevos);
  }, [errores]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validarCampo(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validarCampo(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Marcar todos como touched
    const allTouched = {
      dni: true, nombres: true, apellidos: true,
      telefono: true, email: true, direccion: true,
      cargo: true, fechaIngreso: true, estado: true
    };
    setTouched(allTouched);

    // Validar todos
    Object.keys(formData).forEach(key => {
      validarCampo(key, formData[key]);
    });

    // Esperar a que se actualicen los errores
    setTimeout(() => {
      setErrores(prev => {
        if (Object.keys(prev).length === 0) {
          onSubmit(formData);
        }
        return prev;
      });
    }, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
      <div className="trabajador-modal" ref={modalRef} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="trabajador-modal__header">
          <h2 id="modal-titulo" className="trabajador-modal__titulo">{titulo}</h2>
          <button
            className="trabajador-modal__close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form className="trabajador-modal__form" onSubmit={handleSubmit}>
          <div className="trabajador-modal__grid">
            {/* DNI */}
            <div className="trabajador-modal__field">
              <label htmlFor="modal-dni" className="trabajador-modal__label">
                DNI <span className="trabajador-modal__required">*</span>
              </label>
              <input
                ref={firstInputRef}
                id="modal-dni"
                type="text"
                name="dni"
                className={`trabajador-modal__input ${touched.dni && errores.dni ? 'trabajador-modal__input--error' : ''}`}
                value={formData.dni}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={8}
                placeholder="12345678"
                disabled={cargando}
                autoComplete="off"
                aria-invalid={touched.dni && !!errores.dni}
                aria-describedby={touched.dni && errores.dni ? 'error-dni' : undefined}
              />
              {touched.dni && errores.dni && (
                <span id="error-dni" className="trabajador-modal__error">{errores.dni}</span>
              )}
            </div>

            {/* Nombres */}
            <div className="trabajador-modal__field">
              <label htmlFor="modal-nombres" className="trabajador-modal__label">
                Nombres <span className="trabajador-modal__required">*</span>
              </label>
              <input
                id="modal-nombres"
                type="text"
                name="nombres"
                className={`trabajador-modal__input ${touched.nombres && errores.nombres ? 'trabajador-modal__input--error' : ''}`}
                value={formData.nombres}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Carlos Alberto"
                disabled={cargando}
                autoComplete="given-name"
                aria-invalid={touched.nombres && !!errores.nombres}
                aria-describedby={touched.nombres && errores.nombres ? 'error-nombres' : undefined}
              />
              {touched.nombres && errores.nombres && (
                <span id="error-nombres" className="trabajador-modal__error">{errores.nombres}</span>
              )}
            </div>

            {/* Apellidos */}
            <div className="trabajador-modal__field">
              <label htmlFor="modal-apellidos" className="trabajador-modal__label">
                Apellidos <span className="trabajador-modal__required">*</span>
              </label>
              <input
                id="modal-apellidos"
                type="text"
                name="apellidos"
                className={`trabajador-modal__input ${touched.apellidos && errores.apellidos ? 'trabajador-modal__input--error' : ''}`}
                value={formData.apellidos}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Mendoza Ruiz"
                disabled={cargando}
                autoComplete="family-name"
                aria-invalid={touched.apellidos && !!errores.apellidos}
                aria-describedby={touched.apellidos && errores.apellidos ? 'error-apellidos' : undefined}
              />
              {touched.apellidos && errores.apellidos && (
                <span id="error-apellidos" className="trabajador-modal__error">{errores.apellidos}</span>
              )}
            </div>

            {/* Teléfono */}
            <div className="trabajador-modal__field">
              <label htmlFor="modal-telefono" className="trabajador-modal__label">
                Teléfono
              </label>
              <input
                id="modal-telefono"
                type="text"
                name="telefono"
                className={`trabajador-modal__input ${touched.telefono && errores.telefono ? 'trabajador-modal__input--error' : ''}`}
                value={formData.telefono}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={9}
                placeholder="987654321"
                disabled={cargando}
                autoComplete="tel"
                aria-invalid={touched.telefono && !!errores.telefono}
                aria-describedby={touched.telefono && errores.telefono ? 'error-telefono' : undefined}
              />
              {touched.telefono && errores.telefono && (
                <span id="error-telefono" className="trabajador-modal__error">{errores.telefono}</span>
              )}
            </div>

            {/* Email */}
            <div className="trabajador-modal__field">
              <label htmlFor="modal-email" className="trabajador-modal__label">
                Email
              </label>
              <input
                id="modal-email"
                type="email"
                name="email"
                className={`trabajador-modal__input ${touched.email && errores.email ? 'trabajador-modal__input--error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="correo@ejemplo.com"
                disabled={cargando}
                autoComplete="email"
                aria-invalid={touched.email && !!errores.email}
                aria-describedby={touched.email && errores.email ? 'error-email' : undefined}
              />
              {touched.email && errores.email && (
                <span id="error-email" className="trabajador-modal__error">{errores.email}</span>
              )}
            </div>

            {/* Dirección */}
            <div className="trabajador-modal__field trabajador-modal__field--full">
              <label htmlFor="modal-direccion" className="trabajador-modal__label">
                Dirección
              </label>
              <input
                id="modal-direccion"
                type="text"
                name="direccion"
                className="trabajador-modal__input"
                value={formData.direccion}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Av. Los Incas 123, San Isidro, Lima"
                disabled={cargando}
                autoComplete="street-address"
              />
            </div>

            {/* Cargo */}
            <div className="trabajador-modal__field">
              <label htmlFor="modal-cargo" className="trabajador-modal__label">
                Cargo <span className="trabajador-modal__required">*</span>
              </label>
              <select
                id="modal-cargo"
                name="cargo"
                className={`trabajador-modal__select ${touched.cargo && errores.cargo ? 'trabajador-modal__select--error' : ''}`}
                value={formData.cargo}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={cargando}
                aria-invalid={touched.cargo && !!errores.cargo}
                aria-describedby={touched.cargo && errores.cargo ? 'error-cargo' : undefined}
              >
                <option value="">Seleccione un cargo</option>
                {cargosActivos.map((cargo) => (
                  <option key={cargo.id} value={cargo.nombre}>
                    {cargo.nombre}
                  </option>
                ))}
              </select>
              {touched.cargo && errores.cargo && (
                <span id="error-cargo" className="trabajador-modal__error">{errores.cargo}</span>
              )}
            </div>

            {/* Fecha Ingreso */}
            <div className="trabajador-modal__field">
              <label htmlFor="modal-fechaIngreso" className="trabajador-modal__label">
                Fecha Ingreso <span className="trabajador-modal__required">*</span>
              </label>
              <input
                id="modal-fechaIngreso"
                type="date"
                name="fechaIngreso"
                className={`trabajador-modal__input ${touched.fechaIngreso && errores.fechaIngreso ? 'trabajador-modal__input--error' : ''}`}
                value={formData.fechaIngreso}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={cargando}
                max={new Date().toISOString().split('T')[0]}
                aria-invalid={touched.fechaIngreso && !!errores.fechaIngreso}
                aria-describedby={touched.fechaIngreso && errores.fechaIngreso ? 'error-fechaIngreso' : undefined}
              />
              {touched.fechaIngreso && errores.fechaIngreso && (
                <span id="error-fechaIngreso" className="trabajador-modal__error">{errores.fechaIngreso}</span>
              )}
            </div>

            {/* Estado */}
            <div className="trabajador-modal__field">
              <label htmlFor="modal-estado" className="trabajador-modal__label">
                Estado
              </label>
              <select
                id="modal-estado"
                name="estado"
                className="trabajador-modal__select"
                value={formData.estado}
                onChange={handleChange}
                disabled={cargando}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Acciones */}
          <div className="trabajador-modal__actions">
            <button
              type="button"
              className="trabajador-modal__btn trabajador-modal__btn--cancelar"
              onClick={onClose}
              disabled={cargando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="trabajador-modal__btn trabajador-modal__btn--guardar"
              disabled={cargando}
            >
              {cargando ? 'Guardando...' : (initialData ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

