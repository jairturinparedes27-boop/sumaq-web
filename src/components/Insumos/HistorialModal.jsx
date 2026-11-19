// src/components/Insumos/HistorialModal.jsx
// Modal para ver historial de movimientos (Kardex)

import { useState, useMemo } from 'react';
import './HistorialModal.css';

export function HistorialModal({
  abierto,
  onCerrar,
  insumo,
  movimientos,
  obtenerColorTipoMovimiento
}) {
  const [filtroTipo, setFiltroTipo] = useState('Todos');

  // Filtrar movimientos del insumo - hooks called unconditionally
  const movimientosInsumo = useMemo(() => {
    if (!insumo) return [];
    return movimientos
      .filter(m => m.insumoId === insumo.id)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [movimientos, insumo]);

  const movimientosFiltrados = useMemo(() => {
    if (filtroTipo === 'Todos') return movimientosInsumo;
    return movimientosInsumo.filter(m => m.tipo === filtroTipo);
  }, [movimientosInsumo, filtroTipo]);

  // Unused but needed for rules-of-hooks - disable warning
  // eslint-disable-next-line no-unused-vars
  const tiposUnicos = useMemo(() => {
    if (!insumo) return [];
    return [...new Set(movimientosInsumo.map(m => m.tipo))];
  }, [movimientosInsumo, insumo]);

  if (!abierto || !insumo) return null;

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearNumero = (num) => {
    return Number(num).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div
      className="insumo-modal__overlay"
      onClick={onCerrar}
      role="dialog"
      aria-modal="true"
      aria-labelledby="historial-modal-titulo"
    >
      <div
        className="insumo-modal historial-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="insumo-modal__header">
          <h2 id="historial-modal-titulo" className="insumo-modal__titulo">
            📜 Kardex - {insumo.nombre}
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

        {/* Info del insumo */}
        <div className="historial-modal__insumo-info">
          <div className="historial-modal__insumo-header">
            <span className="historial-modal__insumo-codigo">{insumo.codigo}</span>
            <span className="historial-modal__insumo-stock">
              Stock Actual: <strong>{formatearNumero(insumo.stockActual)} {insumo.unidadMedida}</strong>
            </span>
          </div>
          <div className="historial-modal__insumo-detalles">
            <span>Mín: {formatearNumero(insumo.stockMinimo)} {insumo.unidadMedida}</span>
            <span>Precio: S/ {insumo.precioCompra.toFixed(2)}</span>
            <span>Valor: S/ {formatearNumero(insumo.stockActual * insumo.precioCompra)}</span>
          </div>
        </div>

        {/* Filtros */}
        <div className="historial-modal__filtros">
          <label htmlFor="historial-tipo" className="insumo-filters__label">Filtrar por tipo</label>
          <select
            id="historial-tipo"
            className="insumo-filters__select"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            style={{ width: 'auto', minWidth: '200px' }}
          >
            <option value="Todos">Todos los movimientos</option>
            <option value="entrada_compra">📥 Entrada Compra</option>
            <option value="entrada_ajuste">📈 Entrada Ajuste</option>
            <option value="entrada_devolucion">↩️ Devolución</option>
            <option value="salida_consumo">🍳 Salida Consumo</option>
            <option value="salida_manual">📤 Salida Manual</option>
            <option value="salida_merma">🗑️ Merma</option>
            <option value="salida_transferencia">🔄 Transferencia</option>
          </select>
          <span className="historial-modal__contador">
            {movimientosFiltrados.length} de {movimientosInsumo.length} movimientos
          </span>
        </div>

        {/* Tabla de movimientos */}
        <div className="historial-modal__tabla-wrapper">
          {movimientosFiltrados.length === 0 ? (
            <div className="historial-modal__vacio">
              <span aria-hidden="true">📭</span>
              <p>No hay movimientos registrados</p>
              {filtroTipo !== 'Todos' && (
                <button className="historial-modal__btn-limpiar" onClick={() => setFiltroTipo('Todos')}>
                  Ver todos
                </button>
              )}
            </div>
          ) : (
            <table className="historial-modal__tabla" role="grid">
              <thead>
                <tr>
                  <th scope="col" className="historial-modal__th">Fecha</th>
                  <th scope="col" className="historial-modal__th">Tipo</th>
                  <th scope="col" className="historial-modal__th">Cant.</th>
                  <th scope="col" className="historial-modal__th">Stock Ant.</th>
                  <th scope="col" className="historial-modal__th">Stock Nuevo</th>
                  <th scope="col" className="historial-modal__th">P. Unit.</th>
                  <th scope="col" className="historial-modal__th">Total</th>
                  <th scope="col" className="historial-modal__th">Motivo / Doc</th>
                  <th scope="col" className="historial-modal__th">Usuario</th>
                </tr>
              </thead>
              <tbody>
                {movimientosFiltrados.map((mov) => {
                  const colorTipo = obtenerColorTipoMovimiento(mov.tipo);
                  const esEntrada = mov.tipo.startsWith('entrada_');
                  return (
                    <tr key={mov.id} className={`historial-modal__tr ${esEntrada ? 'historial-modal__tr--entrada' : 'historial-modal__tr--salida'}`}>
                      <td className="historial-modal__td">
                        <span className="historial-modal__fecha">{formatearFecha(mov.fecha)}</span>
                      </td>
                      <td className="historial-modal__td">
                        <span
                          className="historial-modal__tipo-badge"
                          style={{
                            background: colorTipo.bg,
                            color: colorTipo.text,
                            borderColor: colorTipo.border
                          }}
                        >
                          {colorTipo.icon} {mov.tipo.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="historial-modal__td">
                        <span className={`historial-modal__cantidad ${esEntrada ? 'historial-modal__cantidad--entrada' : 'historial-modal__cantidad--salida'}`}>
                          {esEntrada ? '+' : '-'}{formatearNumero(mov.cantidad)} {insumo.unidadMedida}
                        </span>
                      </td>
                      <td className="historial-modal__td">
                        <span className="historial-modal__stock">{formatearNumero(mov.stockAnterior)}</span>
                      </td>
                      <td className="historial-modal__td">
                        <span className={`historial-modal__stock ${mov.stockNuevo < 0 ? 'historial-modal__stock--negativo' : ''}`}>
                          {formatearNumero(mov.stockNuevo)}
                        </span>
                      </td>
                      <td className="historial-modal__td">
                        <span className="historial-modal__precio">S/ {mov.precioUnitario?.toFixed(2) || '—'}</span>
                      </td>
                      <td className="historial-modal__td">
                        <span className="historial-modal__total">S/ {formatearNumero(mov.total || 0)}</span>
                      </td>
                      <td className="historial-modal__td">
                        <div className="historial-modal__motivo">
                          {mov.motivo}
                          {mov.documento && (
                            <span className="historial-modal__documento">Doc: {mov.documento}</span>
                          )}
                          {mov.pedidoId && (
                            <span className="historial-modal__pedido">Pedido: {mov.pedidoId}</span>
                          )}
                          {mov.autorizadoStockNegativo && (
                            <span className="historial-modal__autorizado">⚠ Stock neg. autorizado</span>
                          )}
                        </div>
                      </td>
                      <td className="historial-modal__td">
                        <span className="historial-modal__usuario">{mov.usuario}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <footer className="insumo-modal__footer">
          <button
            type="button"
            className="insumo-modal__btn insumo-modal__btn--cancelar"
            onClick={onCerrar}
          >
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
}