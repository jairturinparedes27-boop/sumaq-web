// src/components/Mesas/MesaModal.jsx
// Modal para crear/editar mesas - usa `key` en el padre para resetear estado

import { useState, useEffect, useRef } from 'react';
import { zonasDisponibles, estadosMesa, capacidadesPermitidas } from '../../data/mesasMock';
import './MesaModal.css';

function MesaModalContent({
  abierto,
  onCerrar,
  mesa, // null = crear, objeto = editar
  onGuardar
}) {
  const formRef = useRef(null);
  const primerInputRef = useRef(null);
  const elementoAnteriorRef = useRef(null);

  // Estado del formulario - se reinicia cuando cambia `mesa` (via key en el padre)
  const [formData, setFormData] = useState(() => ({
    numero: mesa?.numero ?? '',
    nombre: mesa?.nombre ?? '',
    capacidad: mesa?.capacidad ?? 4,
    zona: mesa?.zona ?? zonasDisponibles[0],
    estado: mesa?.estado ?? 'Disponible'
  }));

  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  // Focus trap y focus inicial
  useEffect(() => {
    if (!abierto) return;

    // Guardar elemento que tenía el focus antes de abrir
    elementoAnteriorRef.current = document.activeElement;

    // Focus al primer input
    const timeoutId = setTimeout(() => {
      primerInputRef.current?.focus();
    }, 50);

    // Manejar Tab / Shift+Tab para focus trap
    const manejarTab = (e) => {
      if (e.key !== 'Tab') return;

      const elementosEnfocables = formRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!elementosEnfocables?.length) return;

      const primerElemento = elementosEnfocables[0];
      const ultimoElemento = elementosEnfocables[elementosEnfocables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === primerElemento) {
          e.preventDefault();
          ultimoElemento.focus();
        }
      } else {
        if (document.activeElement === ultimoElemento) {
          e.preventDefault();
          primerElemento.focus();
        }
      }
    };

    // ESC para cerrar
    const manejarEscape = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCerrar();
      }
    };

    document.addEventListener('keydown', manejarTab);
    document.addEventListener('keydown', manejarEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('keydown', manejarTab);
      document.removeEventListener('keydown', manejarEscape);
      document.body.style.overflow = '';
      // Restaurar focus al elemento anterior
      elementoAnteriorRef.current?.focus?.();
    };
  }, [abierto, onCerrar]);

  // Validación
  const validar = () => {
    const nuevosErrores = {};

    if (!formData.numero.trim()) {
      nuevosErrores.numero = 'El número es obligatorio';
    } else if (!/^\d+$/.test(formData.numero.trim())) {
      nuevosErrores.numero = 'Solo números enteros';
    }

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.trim().length > 50) {
      nuevosErrores.nombre = 'Máximo 50 caracteres';
    }

    if (!capacidadesPermitidas.includes(Number(formData.capacidad))) {
      nuevosErrores.capacidad = 'Capacidad no válida';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Manejar cambios en inputs
  const manejarCambio = (e) => {
    const { name, value, type } = e.target;
    const nuevoValor = type === 'number' ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: nuevoValor }));
    // Limpiar error al escribir
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: null }));
    }
  };

  // Submit
  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    setEnviando(true);
    try {
      await onGuardar({
        ...formData,
        numero: String(formData.numero).padStart(2, '0'),
        nombre: formData.nombre.trim(),
        capacidad: Number(formData.capacidad)
      });
      onCerrar();
    } catch (err) {
      console.error('Error guardando mesa:', err);
    } finally {
      setEnviando(false);
    }
  };

  const esEdicion = !!mesa;
  const titulo = esEdicion ? `Editar Mesa ${mesa.numero}` : 'Nueva Mesa';

  return (
    <div className="mesa-modal__overlay" onClick={onCerrar} role="presentation" aria-hidden="true">
      <div
        className="mesa-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mesa-modal-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="mesa-modal__header">
          <h2 id="mesa-modal-titulo" className="mesa-modal__titulo">{titulo}</h2>
          <button
            className="mesa-modal__cerrar"
            onClick={onCerrar}
            aria-label="Cerrar modal"
            type="button"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </header>

        {/* Formulario */}
        <form ref={formRef} onSubmit={manejarSubmit} className="mesa-modal__form" noValidate>
          <div className="mesa-modal__body">
            {/* Número */}
            <div className="mesa-modal__campo">
              <label htmlFor="modal-numero" className="mesa-modal__label">
                Número <span className="mesa-modal__requerido" aria-hidden="true">*</span>
              </label>
              <input
                ref={primerInputRef}
                id="modal-numero"
                type="text"
                name="numero"
                className={`mesa-modal__input ${errores.numero ? 'mesa-modal__input--error' : ''}`}
                value={formData.numero}
                onChange={manejarCambio}
                placeholder="Ej: 1, 12, 25..."
                maxLength={3}
                autoComplete="off"
                aria-describedby={errores.numero ? 'error-numero' : undefined}
                aria-invalid={!!errores.numero}
                disabled={esEdicion} // No cambiar número al editar
              />
              {errores.numero && (
                <span id="error-numero" className="mesa-modal__error" role="alert">{errores.numero}</span>
              )}
              <span className="mesa-modal__ayuda">Se formatea automáticamente (01, 12, 25...)</span>
            </div>

            {/* Nombre */}
            <div className="mesa-modal__campo">
              <label htmlFor="modal-nombre" className="mesa-modal__label">
                Nombre <span className="mesa-modal__requerido" aria-hidden="true">*</span>
              </label>
              <input
                id="modal-nombre"
                type="text"
                name="nombre"
                className={`mesa-modal__input ${errores.nombre ? 'mesa-modal__input--error' : ''}`}
                value={formData.nombre}
                onChange={manejarCambio}
                placeholder="Ej: Mesa 01, Terraza VIP, Privado A..."
                maxLength={50}
                autoComplete="off"
                aria-describedby={errores.nombre ? 'error-nombre' : undefined}
                aria-invalid={!!errores.nombre}
              />
              {errores.nombre && (
                <span id="error-nombre" className="mesa-modal__error" role="alert">{errores.nombre}</span>
              )}
            </div>

            {/* Capacidad */}
            <div className="mesa-modal__campo">
              <label htmlFor="modal-capacidad" className="mesa-modal__label">
                Capacidad <span className="mesa-modal__requerido" aria-hidden="true">*</span>
              </label>
              <select
                id="modal-capacidad"
                name="capacidad"
                className={`mesa-modal__select ${errores.capacidad ? 'mesa-modal__input--error' : ''}`}
                value={formData.capacidad}
                onChange={manejarCambio}
                aria-describedby={errores.capacidad ? 'error-capacidad' : undefined}
                aria-invalid={!!errores.capacidad}
              >
                {capacidadesPermitidas.map(cap => (
                  <option key={cap} value={cap}>{cap} personas</option>
                ))}
              </select>
              {errores.capacidad && (
                <span id="error-capacidad" className="mesa-modal__error" role="alert">{errores.capacidad}</span>
              )}
            </div>

            {/* Zona */}
            <div className="mesa-modal__campo">
              <label htmlFor="modal-zona" className="mesa-modal__label">
                Zona
              </label>
              <select
                id="modal-zona"
                name="zona"
                className="mesa-modal__select"
                value={formData.zona}
                onChange={manejarCambio}
              >
                {zonasDisponibles.map(zona => (
                  <option key={zona} value={zona}>{zona}</option>
                ))}
              </select>
            </div>

            {/* Estado (solo en edición) */}
            {esEdicion && (
              <div className="mesa-modal__campo">
                <label htmlFor="modal-estado" className="mesa-modal__label">
                  Estado actual
                </label>
                <select
                  id="modal-estado"
                  name="estado"
                  className="mesa-modal__select"
                  value={formData.estado}
                  onChange={manejarCambio}
                >
                  {estadosMesa.map(est => (
                    <option key={est} value={est}>{est}</option>
                  ))}
                </select>
                <span className="mesa-modal__ayuda">El estado se puede cambiar desde la tarjeta de la mesa</span>
              </div>
            )}
          </div>

          {/* Footer con botones */}
          <footer className="mesa-modal__footer">
            <button
              type="button"
              className="mesa-modal__btn mesa-modal__btn--cancelar"
              onClick={onCerrar}
              disabled={enviando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="mesa-modal__btn mesa-modal__btn--guardar"
              disabled={enviando}
            >
              {enviando ? 'Guardando...' : (esEdicion ? 'Guardar cambios' : 'Crear mesa')}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

// Wrapper que maneja la key para resetear estado automáticamente
export function MesaModal({ abierto, onCerrar, mesa, onGuardar }) {
  if (!abierto) return null;

  // La key cambia cuando: abre/cierra, o cambia entre crear/editar, o cambia la mesa a editar
  const key = mesa ? `editar-${mesa.id}` : 'crear';

  return (
    <MesaModalContent
      key={key}
      abierto={abierto}
      onCerrar={onCerrar}
      mesa={mesa}
      onGuardar={onGuardar}
    />
  );
}