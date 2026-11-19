// src/components/Insumos/AlertaStock.jsx
// Componente para mostrar alertas de stock bajo/crítico

import './AlertaStock.css';

export function AlertaStock({ abierto, onCerrar, alertas }) {
  if (!abierto || !alertas.length) return null;

  const alertasCriticas = alertas.filter(a => a.nivel === 'critico');
  const alertasBajas = alertas.filter(a => a.nivel === 'bajo');

  const obtenerClaseNivel = (nivel) => {
    switch (nivel) {
      case 'critico': return 'alerta-stock__item--critico';
      case 'bajo': return 'alerta-stock__item--bajo';
      default: return '';
    }
  };

  const obtenerIconoNivel = (nivel) => {
    switch (nivel) {
      case 'critico': return '🔴';
      case 'bajo': return '🟡';
      default: return '🟢';
    }
  };

  const obtenerTextoNivel = (nivel) => {
    switch (nivel) {
      case 'critico': return 'Crítico';
      case 'bajo': return 'Bajo';
      default: return 'OK';
    }
  };

  const formatearNumero = (num, unidad) => {
    if (unidad && (unidad.valor === 'kg' || unidad.valor === 'L')) {
      return num.toFixed(2);
    }
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
  };

  return (
    <div
      className="insumo-modal__overlay"
      onClick={onCerrar}
      role="dialog"
      aria-modal="true"
      aria-labelledby="alerta-stock-titulo"
    >
      <div
        className="insumo-modal alerta-stock-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="insumo-modal__header">
          <h2 id="alerta-stock-titulo" className="insumo-modal__titulo">
            ⚠️ Alertas de Stock ({alertas.length})
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

        <div className="alerta-stock-modal__resumen">
          <div className="alerta-stock-modal__stat alerta-stock-modal__stat--critico">
            <span className="alerta-stock-modal__stat-valor">{alertasCriticas.length}</span>
            <span className="alerta-stock-modal__stat-label">Críticos</span>
          </div>
          <div className="alerta-stock-modal__stat alerta-stock-modal__stat--bajo">
            <span className="alerta-stock-modal__stat-valor">{alertasBajas.length}</span>
            <span className="alerta-stock-modal__stat-label">Bajos</span>
          </div>
        </div>

        <div className="alerta-stock-modal__lista">
          {alertasCriticas.length > 0 && (
            <section className="alerta-stock-modal__seccion">
              <h3 className="alerta-stock-modal__seccion-titulo">
                <span aria-hidden="true">🔴</span> Stock Crítico (≤ 50% del mínimo)
              </h3>
              <ul className="alerta-stock-modal__items" role="list">
                {alertasCriticas.map(alerta => (
                  <li key={alerta.id} className={`alerta-stock__item ${obtenerClaseNivel(alerta.nivel)}`}>
                    <div className="alerta-stock__item-header">
                      <code className="alerta-stock__codigo">{alerta.codigo}</code>
                      <strong className="alerta-stock__nombre">{alerta.nombre}</strong>
                    </div>
                    <div className="alerta-stock__item-detalles">
                      <span className="alerta-stock__categoria">{alerta.categoriaNombre}</span>
                      <div className="alerta-stock__stock-info">
                        <span className="alerta-stock__actual">
                          Actual: <strong>{formatearNumero(alerta.stockActual, alerta)} {alerta.unidadMedida}</strong>
                        </span>
                        <span className="alerta-stock__minimo">
                          Mín: {formatearNumero(alerta.stockMinimo, alerta)} {alerta.unidadMedida}
                        </span>
                        <span className="alerta-stock__deficit">
                          Déficit: <strong>{formatearNumero(alerta.stockMinimo - alerta.stockActual, alerta)} {alerta.unidadMedida}</strong>
                        </span>
                      </div>
                      <span className="alerta-stock__nivel-badge">{obtenerIconoNivel(alerta.nivel)} {obtenerTextoNivel(alerta.nivel)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {alertasBajas.length > 0 && (
            <section className="alerta-stock-modal__seccion">
              <h3 className="alerta-stock-modal__seccion-titulo">
                <span aria-hidden="true">🟡</span> Stock Bajo (≤ 100% del mínimo)
              </h3>
              <ul className="alerta-stock-modal__items" role="list">
                {alertasBajas.map(alerta => (
                  <li key={alerta.id} className={`alerta-stock__item ${obtenerClaseNivel(alerta.nivel)}`}>
                    <div className="alerta-stock__item-header">
                      <code className="alerta-stock__codigo">{alerta.codigo}</code>
                      <strong className="alerta-stock__nombre">{alerta.nombre}</strong>
                    </div>
                    <div className="alerta-stock__item-detalles">
                      <span className="alerta-stock__categoria">{alerta.categoriaNombre}</span>
                      <div className="alerta-stock__stock-info">
                        <span className="alerta-stock__actual">
                          Actual: <strong>{formatearNumero(alerta.stockActual, alerta)} {alerta.unidadMedida}</strong>
                        </span>
                        <span className="alerta-stock__minimo">
                          Mín: {formatearNumero(alerta.stockMinimo, alerta)} {alerta.unidadMedida}
                        </span>
                        {alerta.stockActual < alerta.stockMinimo && (
                          <span className="alerta-stock__deficit">
                            Déficit: <strong>{formatearNumero(alerta.stockMinimo - alerta.stockActual, alerta)} {alerta.unidadMedida}</strong>
                          </span>
                        )}
                      </div>
                      <span className="alerta-stock__nivel-badge">{obtenerIconoNivel(alerta.nivel)} {obtenerTextoNivel(alerta.nivel)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {alertas.length === 0 && (
            <div className="alerta-stock-modal__vacio">
              <span aria-hidden="true">✅</span>
              <h3>¡Todo en orden!</h3>
              <p>No hay alertas de stock en este momento.</p>
            </div>
          )}
        </div>

        <footer className="insumo-modal__footer">
          <button
            type="button"
            className="insumo-modal__btn insumo-modal__btn--primaria"
            onClick={onCerrar}
          >
            Entendido
          </button>
        </footer>
      </div>
    </div>
  );
}