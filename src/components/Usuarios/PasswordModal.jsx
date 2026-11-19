// src/components/Usuarios/PasswordModal.jsx
// Modal para cambiar/restablecer contraseña

import { useState, useEffect, useRef } from 'react';
import './PasswordModal.css';

const initialFormData = {
  passwordActual: '',
  passwordNueva: '',
  confirmarPassword: '',
  mostrarActual: false,
  mostrarNueva: false,
  mostrarConfirmar: false
};

export function PasswordModal({
  abierto,
  onCerrar,
  datos,
  onGuardar
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const modalRef = useRef(null);
  const esReset = datos?.tipo === 'resetear';
  const usuario = datos?.usuario;

  // Reset form when modal opens - use effect with proper deps
  // This is intentional for modal open/close behavior
  useEffect(() => {
    if (abierto) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(initialFormData);
      setErrores({});
    }
  }, [abierto]);

  // Focus trap
  useEffect(() => {
    if (!abierto || !modalRef.current) return;

    const modal = modalRef.current;
    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleTab);
    firstFocusable?.focus();

    return () => modal.removeEventListener('keydown', handleTab);
  }, [abierto]);

  // ESC para cerrar
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && abierto) onCerrar();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [abierto, onCerrar]);

  // Prevenir scroll
  useEffect(() => {
    if (abierto) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [abierto]);

  if (!abierto) return null;

  const validar = () => {
    const nuevosErrores = {};

    if (!esReset) {
      if (!formData.passwordActual) {
        nuevosErrores.passwordActual = 'Ingrese su contraseña actual';
      }
    }

    if (!formData.passwordNueva) {
      nuevosErrores.passwordNueva = 'La nueva contraseña es obligatoria';
    } else if (formData.passwordNueva.length < 6) {
      nuevosErrores.passwordNueva = 'Mínimo 6 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.passwordNueva)) {
      nuevosErrores.passwordNueva = 'Debe tener mayúscula, minúscula y número';
    }

    if (formData.passwordNueva !== formData.confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden';
    }

    if (!esReset && formData.passwordActual === formData.passwordNueva) {
      nuevosErrores.passwordNueva = 'La nueva contraseña debe ser diferente a la actual';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    setEnviando(true);
    try {
      const datosEnvio = {
        passwordActual: esReset ? undefined : formData.passwordActual,
        passwordNueva: formData.passwordNueva,
        confirmarPassword: formData.confirmarPassword
      };
      await onGuardar(datosEnvio);
    } catch (error) {
      setErrores({ submit: error.message });
    } finally {
      setEnviando(false);
    }
  };

  const manejarChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: null }));
    }
    if (errores.submit) {
      setErrores(prev => ({ ...prev, submit: null }));
    }
  };

  const toggleMostrar = (campo) => {
    setFormData(prev => ({ ...prev, [campo]: !prev[campo] }));
  };

  return (
    <div
      className="usuario-modal__overlay"
      onClick={onCerrar}
      role="dialog"
      aria-modal="true"
      aria-labelledby="password-modal-titulo"
    >
      <div className="usuario-modal password-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <header className="usuario-modal__header">
          <h2 id="password-modal-titulo" className="usuario-modal__titulo">
            {esReset ? 'Restablecer contraseña (Admin)' : 'Cambiar contraseña'}
          </h2>
          <button
            className="usuario-modal__cerrar"
            onClick={onCerrar}
            aria-label="Cerrar modal"
            disabled={enviando}
          >
            ✕
          </button>
        </header>

        <form className="usuario-modal__form" onSubmit={manejarSubmit}>
          {errores.submit && (
            <div className="usuario-modal__error-global" role="alert">
              <span aria-hidden="true">⚠</span> {errores.submit}
            </div>
          )}

          <div className="usuario-modal__grid">
            {!esReset && (
              <div className="usuario-modal__field usuario-modal__field--full">
                <label htmlFor="password-actual" className="usuario-modal__label">
                  Contraseña actual <span aria-hidden="true">*</span>
                </label>
                <div className="usuario-modal__password-wrapper">
                  <input
                    id="password-actual"
                    type={formData.mostrarActual ? 'text' : 'password'}
                    name="passwordActual"
                    className={`usuario-modal__input ${errores.passwordActual ? 'usuario-modal__input--error' : ''}`}
                    value={formData.passwordActual}
                    onChange={manejarChange}
                    aria-invalid={!!errores.passwordActual}
                    aria-describedby={errores.passwordActual ? 'error-actual' : undefined}
                    autoComplete="current-password"
                    placeholder="Contraseña actual"
                  />
                  <button
                    type="button"
                    className="usuario-modal__toggle-password"
                    onClick={() => toggleMostrar('mostrarActual')}
                    aria-label={formData.mostrarActual ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    aria-pressed={formData.mostrarActual}
                  >
                    {formData.mostrarActual ? '🙈' : '👁️'}
                  </button>
                </div>
                {errores.passwordActual && (
                  <span id="error-actual" className="usuario-modal__error" role="alert">{errores.passwordActual}</span>
                )}
              </div>
            )}

            <div className="usuario-modal__field usuario-modal__field--full">
              <label htmlFor="password-nueva" className="usuario-modal__label">
                Nueva contraseña <span aria-hidden="true">*</span>
              </label>
              <div className="usuario-modal__password-wrapper">
                <input
                  id="password-nueva"
                  type={formData.mostrarNueva ? 'text' : 'password'}
                  name="passwordNueva"
                  className={`usuario-modal__input ${errores.passwordNueva ? 'usuario-modal__input--error' : ''}`}
                  value={formData.passwordNueva}
                  onChange={manejarChange}
                  aria-invalid={!!errores.passwordNueva}
                  aria-describedby={errores.passwordNueva ? 'error-nueva' : 'ayuda-nueva'}
                  autoComplete={esReset ? 'new-password' : 'new-password'}
                  placeholder="Mín. 6 caracteres, mayúscula, minúscula y número"
                />
                <button
                  type="button"
                  className="usuario-modal__toggle-password"
                  onClick={() => toggleMostrar('mostrarNueva')}
                  aria-label={formData.mostrarNueva ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  aria-pressed={formData.mostrarNueva}
                >
                  {formData.mostrarNueva ? '🙈' : '👁️'}
                </button>
              </div>
              {errores.passwordNueva && (
                <span id="error-nueva" className="usuario-modal__error" role="alert">{errores.passwordNueva}</span>
              )}
              <p id="ayuda-nueva" className="usuario-modal__ayuda">Mín. 6 caracteres, mayúscula, minúscula y número</p>
            </div>

            <div className="usuario-modal__field usuario-modal__field--full">
              <label htmlFor="password-confirmar" className="usuario-modal__label">
                Confirmar nueva contraseña <span aria-hidden="true">*</span>
              </label>
              <div className="usuario-modal__password-wrapper">
                <input
                  id="password-confirmar"
                  type={formData.mostrarConfirmar ? 'text' : 'password'}
                  name="confirmarPassword"
                  className={`usuario-modal__input ${errores.confirmarPassword ? 'usuario-modal__input--error' : ''}`}
                  value={formData.confirmarPassword}
                  onChange={manejarChange}
                  aria-invalid={!!errores.confirmarPassword}
                  aria-describedby={errores.confirmarPassword ? 'error-confirmar' : undefined}
                  autoComplete={esReset ? 'new-password' : 'new-password'}
                  placeholder="Repetir nueva contraseña"
                />
                <button
                  type="button"
                  className="usuario-modal__toggle-password"
                  onClick={() => toggleMostrar('mostrarConfirmar')}
                  aria-label={formData.mostrarConfirmar ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  aria-pressed={formData.mostrarConfirmar}
                >
                  {formData.mostrarConfirmar ? '🙈' : '👁️'}
                </button>
              </div>
              {errores.confirmarPassword && (
                <span id="error-confirmar" className="usuario-modal__error" role="alert">{errores.confirmarPassword}</span>
              )}
            </div>

            {esReset && (
              <div className="usuario-modal__field usuario-modal__field--full usuario-modal__field--info">
                <div className="usuario-modal__info-box">
                  <span className="usuario-modal__info-icon" aria-hidden="true">ℹ️</span>
                  <div>
                    <strong>Restablecimiento administrativo</strong>
                    <p>El usuario {usuario?.username} deberá cambiar su contraseña en el próximo ingreso.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <footer className="usuario-modal__footer">
            <button
              type="button"
              className="usuario-modal__btn usuario-modal__btn--cancelar"
              onClick={onCerrar}
              disabled={enviando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="usuario-modal__btn usuario-modal__btn--primaria"
              disabled={enviando}
            >
              {enviando ? (
                <>
                  <span className="usuario-modal__spinner" aria-hidden="true"></span> Guardando...
                </>
              ) : (
                <>
                  <span aria-hidden="true">{esReset ? '🔄' : '🔑'}</span> {esReset ? 'Restablecer' : 'Cambiar'}
                </>
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}