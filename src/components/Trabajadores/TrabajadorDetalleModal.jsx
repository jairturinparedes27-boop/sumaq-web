// src/components/Trabajadores/TrabajadorDetalleModal.jsx
// Modal de solo lectura para ver detalle de trabajador

import { useEffect, useRef } from 'react';
import './TrabajadorDetalleModal.css';

export function TrabajadorDetalleModal({
  isOpen,
  onClose,
  trabajador,
  obtenerColorEstado,
  obtenerColorCargo,
  obtenerNombreCompleto,
  obtenerIniciales,
  cargos
}) {
  const modalRef = useRef(null);
  const prevIsOpen = useRef(isOpen);

  // Focus management
  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        modalRef.current?.focus();
      }, 50);
    } else if (!isOpen && prevIsOpen.current) {
      document.body.style.overflow = '';
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

  if (!isOpen || !trabajador) return null;

  const cargoInfo = cargos?.find(c => c.nombre === trabajador.cargo);
  const colorEstado = obtenerColorEstado(trabajador.estado);
  const colorCargo = obtenerColorCargo(trabajador.cargo);

  const formatearFecha = (fecha) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatearFechaHora = (fecha) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="detalle-titulo">
      <div className="trabajador-detalle-modal" ref={modalRef} tabIndex={-1} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="trabajador-detalle-modal__header">
          <div className="trabajador-detalle-modal__avatar" style={{ backgroundColor: colorCargo.bg }}>
            {obtenerIniciales(trabajador)}
          </div>
          <div className="trabajador-detalle-modal__titulo-wrap">
            <h2 id="detalle-titulo" className="trabajador-detalle-modal__titulo">
              {obtenerNombreCompleto(trabajador)}
            </h2>
            <span
              className="trabajador-detalle-modal__badge"
              style={{
                backgroundColor: colorEstado.bg,
                color: colorEstado.text,
                borderColor: colorEstado.border
              }}
            >
              {colorEstado.icon} {trabajador.estado}
            </span>
          </div>
          <button
            className="trabajador-detalle-modal__close"
            onClick={onClose}
            aria-label="Cerrar detalle"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="trabajador-detalle-modal__content">
          {/* Sección: Información Personal */}
          <section className="trabajador-detalle-modal__section">
            <h3 className="trabajador-detalle-modal__section-titulo">Información Personal</h3>
            <div className="trabajador-detalle-modal__grid">
              <div className="trabajador-detalle-modal__item">
                <span className="trabajador-detalle-modal__label">Código</span>
                <span className="trabajador-detalle-modal__valor trabajador-detalle-modal__valor--codigo">{trabajador.codigo}</span>
              </div>
              <div className="trabajador-detalle-modal__item">
                <span className="trabajador-detalle-modal__label">DNI</span>
                <span className="trabajador-detalle-modal__valor trabajador-detalle-modal__valor--dni">{trabajador.dni}</span>
              </div>
              <div className="trabajador-detalle-modal__item">
                <span className="trabajador-detalle-modal__label">Nombres</span>
                <span className="trabajador-detalle-modal__valor">{trabajador.nombres}</span>
              </div>
              <div className="trabajador-detalle-modal__item">
                <span className="trabajador-detalle-modal__label">Apellidos</span>
                <span className="trabajador-detalle-modal__valor">{trabajador.apellidos}</span>
              </div>
              <div className="trabajador-detalle-modal__item">
                <span className="trabajador-detalle-modal__label">Teléfono</span>
                <span className="trabajador-detalle-modal__valor">{trabajador.telefono || '—'}</span>
              </div>
              <div className="trabajador-detalle-modal__item">
                <span className="trabajador-detalle-modal__label">Email</span>
                <span className="trabajador-detalle-modal__valor">{trabajador.email || '—'}</span>
              </div>
              <div className="trabajador-detalle-modal__item trabajador-detalle-modal__item--full">
                <span className="trabajador-detalle-modal__label">Dirección</span>
                <span className="trabajador-detalle-modal__valor">{trabajador.direccion || '—'}</span>
              </div>
            </div>
          </section>

          {/* Sección: Información Laboral */}
          <section className="trabajador-detalle-modal__section">
            <h3 className="trabajador-detalle-modal__section-titulo">Información Laboral</h3>
            <div className="trabajador-detalle-modal__grid">
              <div className="trabajador-detalle-modal__item">
                <span className="trabajador-detalle-modal__label">Cargo</span>
                <span
                  className="trabajador-detalle-modal__valor trabajador-detalle-modal__valor--cargo"
                  style={{
                    backgroundColor: colorCargo.bg,
                    color: colorCargo.text,
                    borderColor: colorCargo.border
                  }}
                >
                  {trabajador.cargo}
                </span>
              </div>
              <div className="trabajador-detalle-modal__item">
                <span className="trabajador-detalle-modal__label">Fecha Ingreso</span>
                <span className="trabajador-detalle-modal__valor">{formatearFecha(trabajador.fechaIngreso)}</span>
              </div>
              <div className="trabajador-detalle-modal__item">
                <span className="trabajador-detalle-modal__label">Antigüedad</span>
                <span className="trabajador-detalle-modal__valor">
                  {calcularAntiguedad(trabajador.fechaIngreso)}
                </span>
              </div>
            </div>
            {cargoInfo?.descripcion && (
              <div className="trabajador-detalle-modal__descripcion">
                <span className="trabajador-detalle-modal__label">Descripción del cargo:</span>
                <span className="trabajador-detalle-modal__valor">{cargoInfo.descripcion}</span>
              </div>
            )}
          </section>

          {/* Sección: Usuario Asociado */}
          <section className="trabajador-detalle-modal__section">
            <h3 className="trabajador-detalle-modal__section-titulo">Usuario del Sistema</h3>
            {trabajador.usuarioAsociado ? (
              <div className="trabajador-detalle-modal__grid">
                <div className="trabajador-detalle-modal__item">
                  <span className="trabajador-detalle-modal__label">Usuario</span>
                  <span className="trabajador-detalle-modal__valor">{trabajador.usuarioAsociado.username}</span>
                </div>
                <div className="trabajador-detalle-modal__item">
                  <span className="trabajador-detalle-modal__label">Estado</span>
                  <span
                    className="trabajador-detalle-modal__valor trabajador-detalle-modal__valor--estado"
                    style={{
                      backgroundColor: trabajador.usuarioAsociado.estado === 'Activo' ? '#E8F5E9' : '#F5F5F5',
                      color: trabajador.usuarioAsociado.estado === 'Activo' ? '#2E7D32' : '#757575',
                      borderColor: trabajador.usuarioAsociado.estado === 'Activo' ? '#81C784' : '#BDBDBD'
                    }}
                  >
                    {trabajador.usuarioAsociado.estado}
                  </span>
                </div>
                <div className="trabajador-detalle-modal__item">
                  <span className="trabajador-detalle-modal__label">Rol</span>
                  <span className="trabajador-detalle-modal__valor">{trabajador.usuarioAsociado.rolNombre}</span>
                </div>
              </div>
            ) : (
              <div className="trabajador-detalle-modal__sin-usuario">
                <span>👤</span>
                <p>Este trabajador no tiene usuario asignado en el sistema</p>
              </div>
            )}
          </section>

          {/* Sección: Auditoría */}
          <section className="trabajador-detalle-modal__section trabajador-detalle-modal__section--auditoria">
            <h3 className="trabajador-detalle-modal__section-titulo">Auditoría</h3>
            <div className="trabajador-detalle-modal__grid">
              <div className="trabajador-detalle-modal__item">
                <span className="trabajador-detalle-modal__label">Creado</span>
                <span className="trabajador-detalle-modal__valor">{formatearFechaHora(trabajador.creadoEn)}</span>
              </div>
              <div className="trabajador-detalle-modal__item">
                <span className="trabajador-detalle-modal__label">Actualizado</span>
                <span className="trabajador-detalle-modal__valor">{formatearFechaHora(trabajador.actualizadoEn)}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="trabajador-detalle-modal__footer">
          <button
            className="trabajador-detalle-modal__btn"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper para calcular antigüedad
function calcularAntiguedad(fechaIngreso) {
  if (!fechaIngreso) return '—';
  const inicio = new Date(fechaIngreso);
  const hoy = new Date();
  const diffTime = Math.abs(hoy - inicio);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return `${diffDays} día${diffDays !== 1 ? 's' : ''}`;
  } else if (diffDays < 365) {
    const meses = Math.floor(diffDays / 30);
    return `${meses} mes${meses !== 1 ? 'es' : ''}`;
  } else {
    const años = Math.floor(diffDays / 365);
    const mesesRestantes = Math.floor((diffDays % 365) / 30);
    return `${años} año${años !== 1 ? 's' : ''}${mesesRestantes > 0 ? ` y ${mesesRestantes} mes${mesesRestantes !== 1 ? 'es' : ''}` : ''}`;
  }
}