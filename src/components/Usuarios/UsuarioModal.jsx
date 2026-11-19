// src/components/Usuarios/UsuarioModal.jsx
// Modal para crear/editar usuario

import { useState, useEffect, useRef } from 'react';
import './UsuarioModal.css';

const initialFormData = {
  username: '',
  password: '',
  confirmarPassword: '',
  rolId: '',
  trabajadorId: '',
  estado: 'Pendiente',
  debeCambiarPassword: true
};

export function UsuarioModal({
  abierto,
  onCerrar,
  usuario,
  roles,
  trabajadores,
  estados,
  onGuardar
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const modalRef = useRef(null);
  const esEdicion = !!usuario;

  // Inicializar formulario cuando cambia usuario
  useEffect(() => {
    if (usuario) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        username: usuario.username,
        password: '',
        confirmarPassword: '',
        rolId: usuario.rolId,
        trabajadorId: usuario.trabajadorId || '',
        estado: usuario.estado,
        debeCambiarPassword: usuario.debeCambiarPassword
      });
    } else {
      setFormData(initialFormData);
    }
    setErrores({});
  }, [usuario]);

  // Focus trap y accesibilidad
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

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && abierto) onCerrar();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [abierto, onCerrar]);

  // Prevenir scroll del body
  useEffect(() => {
    if (abierto) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [abierto]);

  if (!abierto) return null;

  const validar = () => {
    const nuevosErrores = {};

    if (!formData.username.trim()) {
      nuevosErrores.username = 'El nombre de usuario es obligatorio';
    } else if (formData.username.length < 3) {
      nuevosErrores.username = 'Mínimo 3 caracteres';
    } else if (!/^[a-zA-Z0-9_.-]+$/.test(formData.username)) {
      nuevosErrores.username = 'Solo letras, números, punto, guion y guion bajo';
    }

    if (!esEdicion) {
      if (!formData.password) {
        nuevosErrores.password = 'La contraseña es obligatoria';
      } else if (formData.password.length < 6) {
        nuevosErrores.password = 'Mínimo 6 caracteres';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        nuevosErrores.password = 'Debe tener mayúscula, minúscula y número';
      }

      if (formData.password !== formData.confirmarPassword) {
        nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden';
      }
    }

    if (!formData.rolId) {
      nuevosErrores.rolId = 'Seleccione un rol';
    }

    if (!formData.trabajadorId && formData.estado !== 'Pendiente') {
      nuevosErrores.trabajadorId = 'Requerido para estados distintos a Pendiente';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    setEnviando(true);
    try {
      const datos = {
        username: formData.username.trim(),
        rolId: formData.rolId,
        trabajadorId: formData.trabajadorId || null,
        estado: formData.estado,
        debeCambiarPassword: formData.debeCambiarPassword
      };

      if (!esEdicion) {
        datos.password = formData.password;
      }

      await onGuardar(datos);
      onCerrar();
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
  };

  const rolesOrdenados = [...roles].sort((a, b) => b.nivel - a.nivel);

  return (
    <div
      className="usuario-modal__overlay"
      onClick={onCerrar}
      role="dialog"
      aria-modal="true"
      aria-labelledby="usuario-modal-titulo"
    >
      <div className="usuario-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <header className="usuario-modal__header">
          <h2 id="usuario-modal-titulo" className="usuario-modal__titulo">
            {esEdicion ? 'Editar usuario' : 'Nuevo usuario'}
          </h2>
          <button
            className="usuario-modal__cerrar"
            onClick={onCerrar}
            aria-label="Cerrar modal"
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
            {/* Username */}
            <div className="usuario-modal__field">
              <label htmlFor="usuario-username" className="usuario-modal__label">
                Nombre de usuario <span aria-hidden="true">*</span>
              </label>
              <input
                id="usuario-username"
                type="text"
                name="username"
                className={`usuario-modal__input ${errores.username ? 'usuario-modal__input--error' : ''}`}
                value={formData.username}
                onChange={manejarChange}
                disabled={esEdicion}
                aria-invalid={!!errores.username}
                aria-describedby={errores.username ? 'error-username' : undefined}
                autoComplete="username"
                placeholder="ej. juan.perez"
              />
              {errores.username && (
                <span id="error-username" className="usuario-modal__error" role="alert">{errores.username}</span>
              )}
              {esEdicion && <p className="usuario-modal__ayuda">No editable en edición</p>}
            </div>

            {/* Password */}
            <div className="usuario-modal__field">
              <label htmlFor="usuario-password" className="usuario-modal__label">
                Contraseña {esEdicion ? '(dejar vacío para no cambiar)' : '<span aria-hidden="true">*</span>'}
              </label>
              <div className="usuario-modal__password-wrapper">
                <input
                  id="usuario-password"
                  type={formData.mostrarPassword ? 'text' : 'password'}
                  name="password"
                  className={`usuario-modal__input ${errores.password ? 'usuario-modal__input--error' : ''}`}
                  value={formData.password}
                  onChange={manejarChange}
                  aria-invalid={!!errores.password}
                  aria-describedby={errores.password ? 'error-password' : undefined}
                  autoComplete={esEdicion ? 'off' : 'new-password'}
                  placeholder={esEdicion ? '••••••••' : 'Mín. 6 caracteres, mayúscula, minúscula y número'}
                />
                <button
                  type="button"
                  className="usuario-modal__toggle-password"
                  onClick={() => setFormData(p => ({ ...p, mostrarPassword: !p.mostrarPassword }))}
                  aria-label={formData.mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  aria-pressed={formData.mostrarPassword}
                >
                  {formData.mostrarPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errores.password && (
                <span id="error-password" className="usuario-modal__error" role="alert">{errores.password}</span>
              )}
              {!esEdicion && (
                <p className="usuario-modal__ayuda">Mín. 6 caracteres, mayúscula, minúscula y número</p>
              )}
            </div>

            {/* Confirmar Password */}
            <div className="usuario-modal__field">
              <label htmlFor="usuario-confirmar" className="usuario-modal__label">
                Confirmar contraseña {esEdicion ? '(si cambia la anterior)' : '<span aria-hidden="true">*</span>'}
              </label>
              <input
                id="usuario-confirmar"
                type={formData.mostrarPassword ? 'text' : 'password'}
                name="confirmarPassword"
                className={`usuario-modal__input ${errores.confirmarPassword ? 'usuario-modal__input--error' : ''}`}
                value={formData.confirmarPassword}
                onChange={manejarChange}
                aria-invalid={!!errores.confirmarPassword}
                aria-describedby={errores.confirmarPassword ? 'error-confirmar' : undefined}
                autoComplete={esEdicion ? 'off' : 'new-password'}
                placeholder="Repetir contraseña"
              />
              {errores.confirmarPassword && (
                <span id="error-confirmar" className="usuario-modal__error" role="alert">{errores.confirmarPassword}</span>
              )}
            </div>

            {/* Rol */}
            <div className="usuario-modal__field">
              <label htmlFor="usuario-rol" className="usuario-modal__label">
                Rol <span aria-hidden="true">*</span>
              </label>
              <select
                id="usuario-rol"
                name="rolId"
                className={`usuario-modal__select ${errores.rolId ? 'usuario-modal__input--error' : ''}`}
                value={formData.rolId}
                onChange={manejarChange}
                aria-invalid={!!errores.rolId}
                aria-describedby={errores.rolId ? 'error-rol' : undefined}
              >
                <option value="">Seleccione un rol</option>
                {rolesOrdenados.map(rol => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nivel === 1 ? '🔴 ' : rol.nivel === 2 ? '🟡 ' : '🟢 '}{rol.nombre} (Nivel {rol.nivel})
                  </option>
                ))}
              </select>
              {errores.rolId && (
                <span id="error-rol" className="usuario-modal__error" role="alert">{errores.rolId}</span>
              )}
            </div>

            {/* Trabajador */}
            <div className="usuario-modal__field">
              <label htmlFor="usuario-trabajador" className="usuario-modal__label">
                Trabajador {formData.estado !== 'Pendiente' ? '<span aria-hidden="true">*</span>' : ''}
              </label>
              <select
                id="usuario-trabajador"
                name="trabajadorId"
                className={`usuario-modal__select ${errores.trabajadorId ? 'usuario-modal__input--error' : ''}`}
                value={formData.trabajadorId}
                onChange={manejarChange}
                aria-invalid={!!errores.trabajadorId}
                aria-describedby={errores.trabajadorId ? 'error-trabajador' : undefined}
              >
                <option value="">Sin asignar (estado: Pendiente)</option>
                {trabajadores.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.nombreCompleto} — {t.codigo} ({t.puesto})
                  </option>
                ))}
              </select>
              {errores.trabajadorId && (
                <span id="error-trabajador" className="usuario-modal__error" role="alert">{errores.trabajadorId}</span>
              )}
              <p className="usuario-modal__ayuda">Solo trabajadores sin cuenta de usuario</p>
            </div>

            {/* Estado */}
            <div className="usuario-modal__field">
              <label htmlFor="usuario-estado" className="usuario-modal__label">
                Estado
              </label>
              <select
                id="usuario-estado"
                name="estado"
                className="usuario-modal__select"
                value={formData.estado}
                onChange={manejarChange}
              >
                {estados.map(e => (
                  <option key={e} value={e}>
                    {e === 'Activo' && '✅ '}{e === 'Inactivo' && '⏸ '}{e === 'Bloqueado' && '🔒 '}{e === 'Pendiente' && '⏳ '}{e}
                  </option>
                ))}
              </select>
            </div>

            {/* Debe cambiar password */}
            <div className="usuario-modal__field usuario-modal__field--checkbox">
              <label className="usuario-modal__checkbox">
                <input
                  type="checkbox"
                  name="debeCambiarPassword"
                  checked={formData.debeCambiarPassword}
                  onChange={manejarChange}
                />
                <span className="usuario-modal__checkbox-text">
                  Requerir cambio de contraseña en próximo ingreso
                </span>
              </label>
            </div>
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
                  <span aria-hidden="true">{esEdicion ? '💾' : '➕'}</span> {esEdicion ? 'Actualizar' : 'Crear'}
                </>
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}