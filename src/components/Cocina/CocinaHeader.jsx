// src/components/Cocina/CocinaHeader.jsx
// Header del módulo Cocina con título, estadísticas rápidas y acciones

import { useState, useEffect } from 'react';
import './CocinaHeader.css';

export function CocinaHeader({
  resumen,
  onResetearDatos
}) {
  const [horaActual, setHoraActual] = useState(new Date());

  // Actualizar hora cada segundo
  useEffect(() => {
    const interval = setInterval(() => setHoraActual(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatearHora = (date) => {
    return date.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatearFecha = (date) => {
    return date.toLocaleDateString('es-PE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <header className="cocina-header" role="banner">
      <div className="cocina-header__izquierda">
        <div className="cocina-header__titulos">
          <h1 className="cocina-header__titulo">Cocina</h1>
          <p className="cocina-header__subtitulo">Sistema de visualización de pedidos (KDS)</p>
        </div>

        {/* Stats rápidas en el header */}
        <div className="cocina-header__stats" aria-label="Estadísticas rápidas">
          <div className="cocina-header__stat cocina-header__stat--pendientes" aria-label={`Pendientes: ${resumen.Pendiente || 0}`}>
            <span className="cocina-header__stat-icon" aria-hidden="true">⏳</span>
            <div className="cocina-header__stat-info">
              <span className="cocina-header__stat-valor">{resumen.Pendiente || 0}</span>
              <span className="cocina-header__stat-label">Pendientes</span>
            </div>
          </div>
          <div className="cocina-header__stat cocina-header__stat--preparacion" aria-label={`En preparación: ${resumen['En preparación'] || 0}`}>
            <span className="cocina-header__stat-icon" aria-hidden="true">👨‍🍳</span>
            <div className="cocina-header__stat-info">
              <span className="cocina-header__stat-valor">{resumen['En preparación'] || 0}</span>
              <span className="cocina-header__stat-label">Preparando</span>
            </div>
          </div>
          <div className="cocina-header__stat cocina-header__stat--listos" aria-label={`Listos: ${resumen.Listo || 0}`}>
            <span className="cocina-header__stat-icon" aria-hidden="true">✅</span>
            <div className="cocina-header__stat-info">
              <span className="cocina-header__stat-valor">{resumen.Listo || 0}</span>
              <span className="cocina-header__stat-label">Listos</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cocina-header__derecha">
        {/* Reloj en tiempo real */}
        <div className="cocina-header__reloj" aria-label={`Hora actual: ${formatearHora(horaActual)}`}>
          <div className="cocina-header__fecha">{formatearFecha(horaActual)}</div>
          <div className="cocina-header__hora">{formatearHora(horaActual)}</div>
        </div>

        {/* Botón resetear (solo desarrollo) */}
        <button
          className="cocina-header__btn-reset"
          onClick={onResetearDatos}
          aria-label="Restablecer datos de prueba"
          title="Restablecer datos de prueba (solo desarrollo)"
        >
          <span aria-hidden="true">↻</span>
        </button>
      </div>
    </header>
  );
}