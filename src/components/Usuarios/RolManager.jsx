// src/components/Usuarios/RolManager.jsx
// Gestor de roles y permisos con matriz de permisos

import { useState, useEffect, useRef } from 'react';
import './RolManager.css';

export function RolManager({
  abierto,
  onCerrar,
  roles,
  onCrear,
  onEditar,
  onEliminar,
  onToggleActivo,
  CATALOGO_PERMISOS,
  obtenerColorNivelRol
}) {
  const [rolEditando, setRolEditando] = useState(null);
  const [rolEliminando, setRolEliminando] = useState(null);
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);
  const [permisosTemporales, setPermisosTemporales] = useState(() => rolEditando ? { ...rolEditando.permisos } : {});
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const modalRef = useRef(null);
  const formRef = useRef(null);

  // Categorías de permisos para la matriz
  const categoriasPermisos = Object.entries(CATALOGO_PERMISOS).reduce((acc, [key, value]) => {
    if (!acc[value.categoria]) acc[value.categoria] = [];
    acc[value.categoria].push({ key, ...value });
    return acc;
  }, {});

  const categoriasOrden = ['Sistema', 'Dashboard', 'Mesas', 'Pedidos', 'Cocina', 'Productos', 'Insumos', 'Usuarios', 'Reportes'];

  // Reset permisos when rolEditando changes (using key pattern on parent would be better)
  // We use a ref to track previous rolEditando id
  const prevRolIdRef = useRef(rolEditando?.id);
  if (prevRolIdRef.current !== rolEditando?.id) {
    prevRolIdRef.current = rolEditando?.id;
    setPermisosTemporales(rolEditando ? { ...rolEditando.permisos } : {});
    setErrores({});
  }

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

  // ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && abierto) {
        if (rolEditando) {
          setRolEditando(null);
        } else if (mostrarConfirmacionEliminar) {
          setMostrarConfirmacionEliminar(false);
          setRolEliminando(null);
        } else {
          onCerrar();
        }
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [abierto, rolEditando, mostrarConfirmacionEliminar, onCerrar]);

  // Scroll
  useEffect(() => {
    if (abierto) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [abierto]);

  if (!abierto) return null;

  const validarRol = () => {
    const nuevosErrores = {};

    if (!rolEditando.nombre?.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    } else if (rolEditando.nombre.trim().length < 2) {
      nuevosErrores.nombre = 'Mínimo 2 caracteres';
    }

    if (!rolEditando.nivel || rolEditando.nivel < 1 || rolEditando.nivel > 4) {
      nuevosErrores.nivel = 'Nivel debe ser 1-4';
    }

    // Verificar nombre duplicado (excepto el actual)
    const duplicado = roles.find(r =>
      r.id !== rolEditando.id &&
      r.nombre.toLowerCase() === rolEditando.nombre.trim().toLowerCase()
    );
    if (duplicado) {
      nuevosErrores.nombre = 'Ya existe un rol con ese nombre';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!validarRol()) return;

    setEnviando(true);
    try {
      const datos = {
        nombre: rolEditando.nombre.trim(),
        nivel: parseInt(rolEditando.nivel),
        descripcion: rolEditando.descripcion.trim(),
        permisos: permisosTemporales,
        activo: rolEditando.activo
      };

      if (rolEditando.id.startsWith('temp-')) {
        await onCrear(datos);
      } else {
        await onEditar(rolEditando.id, datos);
      }
      setRolEditando(null);
    } catch (error) {
      setErrores({ submit: error.message });
    } finally {
      setEnviando(false);
    }
  };

  const manejarChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRolEditando(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: null }));
    }
  };

  const manejarPermisoChange = (permisoKey, checked) => {
    setPermisosTemporales(prev => ({ ...prev, [permisoKey]: checked }));
  };

  const manejarNuevoRol = () => {
    setRolEditando({
      id: `temp-${Date.now()}`,
      nombre: '',
      nivel: 3,
      descripcion: '',
      permisos: {},
      activo: true
    });
  };

  const manejarEditarRol = (rol) => {
    setRolEditando({ ...rol });
  };

  const manejarEliminarRol = (rol) => {
    if (!rol.eliminable) {
      alert('Este rol es del sistema y no se puede eliminar');
      return;
    }
    setRolEliminando(rol);
    setMostrarConfirmacionEliminar(true);
  };

  const manejarConfirmarEliminar = async () => {
    if (rolEliminando) {
      try {
        await onEliminar(rolEliminando.id);
        setMostrarConfirmacionEliminar(false);
        setRolEliminando(null);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const manejarToggleActivoRol = async (rol) => {
    if (!rol.editable) {
      alert('Los roles del sistema no se pueden desactivar');
      return;
    }
    await onToggleActivo(rol.id);
  };

  const toggleTodosPermisosCategoria = (categoria, checked) => {
    const nuevosPermisos = { ...permisosTemporales };
    CATALOGO_PERMISOS && Object.entries(CATALOGO_PERMISOS).forEach(([key, value]) => {
      if (value.categoria === categoria) {
        nuevosPermisos[key] = checked;
      }
    });
    setPermisosTemporales(nuevosPermisos);
  };

  const todosPermisosCategoria = (categoria) => {
    const permisosCat = CATALOGO_PERMISOS ? Object.entries(CATALOGO_PERMISOS).filter(([, v]) => v.categoria === categoria) : [];
    return permisosCat.every(([key]) => permisosTemporales[key] === true);
  };

  const algunosPermisosCategoria = (categoria) => {
    const permisosCat = CATALOGO_PERMISOS ? Object.entries(CATALOGO_PERMISOS).filter(([, v]) => v.categoria === categoria) : [];
    const valores = permisosCat.map(([key]) => permisosTemporales[key]);
    return valores.some(v => v === true) && !valores.every(v => v === true);
  };

  // Renderizado condicional: lista de roles o formulario de edición
  if (rolEditando) {
    return (
      <div
        className="usuario-modal__overlay"
        onClick={() => setRolEditando(null)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rol-modal-titulo"
      >
        <div className="usuario-modal rol-manager-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
          <header className="usuario-modal__header">
            <h2 id="rol-modal-titulo" className="usuario-modal__titulo">
              {rolEditando.id.startsWith('temp-') ? 'Crear rol' : 'Editar rol'}
            </h2>
            <button
              className="usuario-modal__cerrar"
              onClick={() => setRolEditando(null)}
              aria-label="Cerrar"
              disabled={enviando}
            >
              ✕
            </button>
          </header>

          <form ref={formRef} className="usuario-modal__form" onSubmit={manejarSubmit}>
            {errores.submit && (
              <div className="usuario-modal__error-global" role="alert">
                <span aria-hidden="true">⚠</span> {errores.submit}
              </div>
            )}

            <div className="usuario-modal__grid">
              <div className="usuario-modal__field usuario-modal__field--full">
                <label htmlFor="rol-nombre" className="usuario-modal__label">
                  Nombre <span aria-hidden="true">*</span>
                </label>
                <input
                  id="rol-nombre"
                  type="text"
                  name="nombre"
                  className={`usuario-modal__input ${errores.nombre ? 'usuario-modal__input--error' : ''}`}
                  value={rolEditando.nombre}
                  onChange={manejarChange}
                  aria-invalid={!!errores.nombre}
                  aria-describedby={errores.nombre ? 'error-nombre' : undefined}
                  placeholder="ej. Supervisor"
                  maxLength={50}
                />
                {errores.nombre && (
                  <span id="error-nombre" className="usuario-modal__error" role="alert">{errores.nombre}</span>
                )}
              </div>

              <div className="usuario-modal__field">
                <label htmlFor="rol-nivel" className="usuario-modal__label">
                  Nivel <span aria-hidden="true">*</span>
                </label>
                <select
                  id="rol-nivel"
                  name="nivel"
                  className={`usuario-modal__select ${errores.nivel ? 'usuario-modal__input--error' : ''}`}
                  value={rolEditando.nivel}
                  onChange={manejarChange}
                  aria-invalid={!!errores.nivel}
                  aria-describedby={errores.nivel ? 'error-nivel' : undefined}
                >
                  <option value="1">1 - Administrador (Acceso total)</option>
                  <option value="2">2 - Gerente (Gestión completa)</option>
                  <option value="3">3 - Operativo (Operaciones diarias)</option>
                  <option value="4">4 - Básico (Solo lectura/acción básica)</option>
                </select>
                {errores.nivel && (
                  <span id="error-nivel" className="usuario-modal__error" role="alert">{errores.nivel}</span>
                )}
              </div>

              <div className="usuario-modal__field usuario-modal__field--full">
                <label htmlFor="rol-descripcion" className="usuario-modal__label">
                  Descripción
                </label>
                <textarea
                  id="rol-descripcion"
                  name="descripcion"
                  className="usuario-modal__input"
                  value={rolEditando.descripcion}
                  onChange={manejarChange}
                  rows={3}
                  placeholder="Descripción del rol y sus responsabilidades"
                  maxLength={200}
                />
              </div>

              <div className="usuario-modal__field usuario-modal__field--checkbox usuario-modal__field--full">
                <label className="usuario-modal__checkbox">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={rolEditando.activo}
                    onChange={manejarChange}
                  />
                  <span className="usuario-modal__checkbox-text">
                    Rol activo (disponible para asignar)
                  </span>
                </label>
              </div>
            </div>

            {/* Matriz de permisos */}
            <div className="rol-manager__permisos">
              <h3 className="rol-manager__permisos-titulo">Permisos</h3>
              <p className="rol-manager__permisos-ayuda">
                Los permisos definen qué acciones puede realizar este rol. Nivel 1 tiene todos los permisos por defecto.
              </p>

              {categoriasOrden.map(categoria => {
                const permisos = categoriasPermisos[categoria];
                if (!permisos || permisos.length === 0) return null;
                const todos = todosPermisosCategoria(categoria);
                const algunos = algunosPermisosCategoria(categoria);

                return (
                  <details key={categoria} className="rol-manager__categoria" defaultOpen>
                    <summary className="rol-manager__categoria-header">
                      <span className="rol-manager__categoria-nombre">{categoria}</span>
                      <label className="rol-manager__categoria-toggle">
                        <input
                          type="checkbox"
                          checked={todos}
                          indeterminate={algunos}
                          onChange={(e) => toggleTodosPermisosCategoria(categoria, e.target.checked)}
                          aria-label={`Seleccionar todos los permisos de ${categoria}`}
                        />
                        <span className="rol-manager__toggle-slider"></span>
                      </label>
                    </summary>
                    <div className="rol-manager__permisos-grid">
                      {permisos.map(({ key, nombre, descripcion }) => (
                        <label key={key} className="rol-manager__permiso">
                          <input
                            type="checkbox"
                            checked={!!permisosTemporales[key]}
                            onChange={(e) => manejarPermisoChange(key, e.target.checked)}
                            aria-label={nombre}
                          />
                          <div className="rol-manager__permiso-info">
                            <span className="rol-manager__permiso-nombre">{nombre}</span>
                            <span className="rol-manager__permiso-desc">{descripcion}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </details>
                );
              })}
            </div>

            <footer className="usuario-modal__footer">
              <button
                type="button"
                className="usuario-modal__btn usuario-modal__btn--cancelar"
                onClick={() => setRolEditando(null)}
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
                    <span aria-hidden="true">{rolEditando.id.startsWith('temp-') ? '➕' : '💾'}</span>
                    {rolEditando.id.startsWith('temp-') ? 'Crear' : 'Actualizar'}
                  </>
                )}
              </button>
            </footer>
          </form>
        </div>
      </div>
    );
  }

  // Vista de lista de roles
  return (
    <div
      className="usuario-modal__overlay rol-manager-overlay"
      onClick={onCerrar}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rol-manager-titulo"
    >
      <div className="usuario-modal rol-manager-modal rol-manager--lista" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <header className="usuario-modal__header">
          <h2 id="rol-manager-titulo" className="usuario-modal__titulo">Gestión de Roles y Permisos</h2>
          <button
            className="usuario-modal__cerrar"
            onClick={onCerrar}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </header>

        <div className="rol-manager__lista">
          {roles.map(rol => {
            const colorNivel = obtenerColorNivelRol(rol.nivel);
            const totalPermisos = Object.values(rol.permisos || {}).filter(Boolean).length;
            const totalPosibles = Object.keys(CATALOGO_PERMISOS || {}).length;

            return (
              <article
                key={rol.id}
                className={`rol-manager__rol-card ${!rol.activo ? 'rol-manager__rol-card--inactivo' : ''} ${!rol.eliminable ? 'rol-manager__rol-card--sistema' : ''}`}
              >
                <div className="rol-manager__rol-header">
                  <div className="rol-manager__rol-info">
                    <div className="rol-manager__rol-nombre-row">
                      <h3 className="rol-manager__rol-nombre">{rol.nombre}</h3>
                      <span
                        className="rol-manager__rol-nivel"
                        style={{
                          background: colorNivel.bg,
                          color: colorNivel.text,
                          borderColor: colorNivel.border
                        }}
                      >
                        Nivel {rol.nivel}
                      </span>
                      {!rol.eliminable && (
                        <span className="rol-manager__badge-sistema" title="Rol del sistema (no editable)">
                          🔧 Sistema
                        </span>
                      )}
                      {!rol.activo && (
                        <span className="rol-manager__badge-inactivo">Inactivo</span>
                      )}
                    </div>
                    <p className="rol-manager__rol-descripcion">{rol.descripcion || 'Sin descripción'}</p>
                    <div className="rol-manager__rol-meta">
                      <span className="rol-manager__rol-permisos">
                        <span aria-hidden="true">🔐</span> {totalPermisos}/{totalPosibles} permisos
                      </span>
                      <span className="rol-manager__rol-codigo">ID: {rol.id}</span>
                    </div>
                  </div>
                  <div className="rol-manager__rol-acciones">
                    <button
                      className="rol-manager__btn"
                      onClick={() => manejarEditarRol(rol)}
                      aria-label={`Editar ${rol.nombre}`}
                      title="Editar"
                      disabled={!rol.editable}
                    >
                      ✏️
                    </button>
                    {rol.editable && (
                      <>
                        <button
                          className={`rol-manager__btn ${rol.activo ? '' : 'rol-manager__btn--activar'}`}
                          onClick={() => manejarToggleActivoRol(rol)}
                          aria-label={rol.activo ? `Desactivar ${rol.nombre}` : `Activar ${rol.nombre}`}
                          title={rol.activo ? 'Desactivar' : 'Activar'}
                        >
                          {rol.activo ? '⏸️' : '▶️'}
                        </button>
                        <button
                          className="rol-manager__btn rol-manager__btn--eliminar"
                          onClick={() => manejarEliminarRol(rol)}
                          aria-label={`Eliminar ${rol.nombre}`}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Vista previa de permisos por categoría */}
                <details className="rol-manager__rol-permisos-preview">
                  <summary className="rol-manager__rol-permisos-summary">
                    Ver permisos por categoría
                  </summary>
                  <div className="rol-manager__rol-permisos-grid">
                    {categoriasOrden.map(categoria => {
                      const permisos = categoriasPermisos[categoria];
                      if (!permisos || permisos.length === 0) return null;
                      const concedidos = permisos.filter(p => rol.permisos?.[p.key]).length;
                      const total = permisos.length;
                      if (concedidos === 0) return null;

                      return (
                        <div key={categoria} className="rol-manager__rol-categoria-mini">
                          <span className="rol-manager__rol-categoria-nombre">{categoria}</span>
                          <span className="rol-manager__rol-categoria-count">{concedidos}/{total}</span>
                        </div>
                      );
                    })}
                  </div>
                </details>
              </article>
            );
          })}
        </div>

        <footer className="rol-manager__footer">
          <button
            className="rol-manager__btn-nuevo"
            onClick={manejarNuevoRol}
            aria-label="Crear nuevo rol"
          >
            <span aria-hidden="true">+</span> Nuevo rol personalizado
          </button>
          <button
            className="usuario-modal__btn usuario-modal__btn--cancelar"
            onClick={onCerrar}
          >
            Cerrar
          </button>
        </footer>

        {/* Modal confirmar eliminar */}
        {mostrarConfirmacionEliminar && (
          <div className="rol-manager__confirm-overlay" onClick={() => { setMostrarConfirmacionEliminar(false); setRolEliminando(null); }}>
            <div className="usuario-modal usuario-modal--confirmar" onClick={(e) => e.stopPropagation()}>
              <header className="usuario-modal__header">
                <h3 className="usuario-modal__titulo">Eliminar rol</h3>
              </header>
              <div className="usuario-modal__form" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }} aria-hidden="true">🗑️</div>
                <h4 style={{ margin: '12px 0 8px', color: '#44271D' }}>
                  ¿Eliminar <strong>{rolEliminando?.nombre}</strong>?
                </h4>
                <p style={{ color: '#8B6B5A', margin: 0 }}>
                  Nivel {rolEliminando?.nivel} · {Object.values(rolEliminando?.permisos || {}).filter(Boolean).length} permisos
                </p>
                <p style={{ color: '#C62828', margin: '8px 0 0', fontSize: '0.85rem', fontWeight: 600 }}>
                  ⚠ Los usuarios con este rol quedarán sin rol asignado
                </p>
                <p style={{ color: '#8B6B5A', margin: '8px 0 0', fontSize: '0.85rem' }}>
                  Esta acción no se puede deshacer.
                </p>
              </div>
              <footer className="usuario-modal__footer">
                <button
                  className="usuario-modal__btn usuario-modal__btn--cancelar"
                  onClick={() => { setMostrarConfirmacionEliminar(false); setRolEliminando(null); }}
                >
                  Cancelar
                </button>
                <button
                  className="usuario-modal__btn usuario-modal__btn--eliminar"
                  onClick={manejarConfirmarEliminar}
                >
                  <span aria-hidden="true">🗑️</span> Eliminar
                </button>
              </footer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}