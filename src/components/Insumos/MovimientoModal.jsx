// src/components/Insumos/MovimientoModal.jsx
// Modal para registrar movimientos de inventario (entradas, salidas, mermas)

import { useState, useEffect, useRef, useCallback } from 'react';
import './MovimientoModal.css';

export function MovimientoModal({
  abierto,
  onCerrar,
  datos,
  proveedores,
  tiposMovimiento,
  motivosMerma,
  onGuardar
}) {
  const [formData, setFormData] = useState({
    cantidad: '',
    precioCompra: '',
    proveedorId: '',
    documento: '',
    motivo: '',
    motivoMerma: '',
    autorizadoStockNegativo: false
  });
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [tocado, setTocado] = useState({});
  const [mostrarConfirmacionStockNegativo, setMostrarConfirmacionStockNegativo] = useState(false);
  const modalRef = useRef(null);
  const primerInputRef = useRef(null);

  const { tipo, insumo } = datos || {};
  const tipoInfo = tiposMovimiento[tipo];
  const esEntrada = tipoInfo?.signo === '+';
  const esMerma = tipo === 'salida_merma';
  const esCompra = tipo === 'entrada_compra';

  // Focus - always call useEffect
  useEffect(() => {
    if (!abierto) return;
    if (!datos) return;
    setTimeout(() => primerInputRef.current?.focus(), 100);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [abierto, datos]);

  // Reset form cuando cambia el insumo o tipo
  const formKey = `${insumo?.id}-${tipo}`;

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onCerrar();
    }
  }, [onCerrar]);

  // Early return after all hooks
  if (!abierto || !datos) return null;

  const validarCampo = (nombre, valor) => {
    const nuevosErrores = { ...errores };

    switch (nombre) {
      case 'cantidad': {
        const cant = Number(valor);
        if (valor === '' || isNaN(cant)) {
          nuevosErrores.cantidad = 'Ingrese una cantidad válida';
        } else if (cant <= 0) {
          nuevosErrores.cantidad = 'La cantidad debe ser mayor a 0';
        }
        break;
      }
      case 'precioCompra': {
        if (esCompra) {
          const precio = Number(valor);
          if (valor === '' || isNaN(precio)) {
            nuevosErrores.precioCompra = 'Ingrese un precio válido';
          } else if (precio < 0) {
            nuevosErrores.precioCompra = 'El precio no puede ser negativo';
          }
        }
        break;
      }
      case 'proveedorId': {
        if (esCompra && !valor) {
          nuevosErrores.proveedorId = 'Seleccione un proveedor';
        }
        break;
      }
      case 'motivoMerma': {
        if (esMerma && !valor) {
          nuevosErrores.motivoMerma = 'Seleccione un motivo de merma';
        }
        break;
      }
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

    const campos = ['cantidad'];
    if (esCompra) campos.push('precioCompra', 'proveedorId');
    if (esMerma) campos.push('motivoMerma');

    let valido = true;
    campos.forEach(campo => {
      if (!validarCampo(campo, formData[campo])) {
        valido = false;
      }
    });
    setTocado(campos.reduce((acc, c) => ({ ...acc, [c]: true }), {}));

    if (!valido || guardando) return;

    // Preparar datos finales
    const datosGuardar = {
      cantidad: Number(formData.cantidad),
      motivo: formData.motivo || tipoInfo?.label,
      autorizadoStockNegativo: formData.autorizadoStockNegativo
    };

    if (esCompra) {
      datosGuardar.precioCompra = Number(formData.precioCompra);
      datosGuardar.proveedorId = formData.proveedorId;
      datosGuardar.documento = formData.documento;
    }

    if (esMerma) {
      datosGuardar.motivoMerma = formData.motivoMerma;
    }

    setGuardando(true);
    try {
      await onGuardar(datosGuardar);
      onCerrar();
    } catch (error) {
      if (error.message === 'STOCK_NEGATIVO_NO_AUTORIZADO') {
        setMostrarConfirmacionStockNegativo(true);
      } else {
        try {
          const errObj = JSON.parse(error.message);
          setErrores(errObj);
        } catch {
          setErrores({ general: error.message || 'Error al guardar' });
        }
      }
    } finally {
      setGuardando(false);
    }
  };

  const handleConfirmarStockNegativo = async () => {
    setMostrarConfirmacionStockNegativo(false);
    setFormData(prev => ({ ...prev, autorizadoStockNegativo: true }));
    // Reintentar guardado
    const datosGuardar = {
      cantidad: Number(formData.cantidad),
      motivo: formData.motivo || tipoInfo?.label,
      autorizadoStockNegativo: true
    };
    if (esCompra) {
      datosGuardar.precioCompra = Number(formData.precioCompra);
      datosGuardar.proveedorId = formData.proveedorId;
      datosGuardar.documento = formData.documento;
    }
    if (esMerma) {
      datosGuardar.motivoMerma = formData.motivoMerma;
    }
    try {
      await onGuardar(datosGuardar);
      onCerrar();
    } catch (error) {
      setErrores({ general: error.message || 'Error al autorizar' });
    }
  };

  const stockProyectado = insumo.stockActual + (esEntrada ? Number(formData.cantidad) : -Number(formData.cantidad));
  const tendraStockNegativo = stockProyectado < 0 && !insumo.permiteStockNegativo && !formData.autorizadoStockNegativo;

  return (
    <div
      className="insumo-modal__overlay"
      onClick={onCerrar}
      role="dialog"
      aria-modal="true"
      aria-labelledby="movimiento-modal-titulo"
      onKeyDown={handleKeyDown}
    >
      <div
        className="insumo-modal movimiento-modal"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="insumo-modal__header">
          <h2 id="movimiento-modal-titulo" className="insumo-modal__titulo">
            {tipoInfo?.icon || '📦'} {tipoInfo?.label || 'Movimiento'}
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
        <div className="movimiento-modal__insumo-info">
          <div className="movimiento-modal__insumo-codigo">{insumo.codigo}</div>
          <div className="movimiento-modal__insumo-nombre">{insumo.nombre}</div>
          <div className="movimiento-modal__insumo-stock">
            Stock actual: <strong>{insumo.stockActual.toLocaleString()}</strong> {insumo.unidadMedida}
            {insumo.stockMinimo > 0 && (
              <>
                {' | '}
                Mín: <strong>{insumo.stockMinimo}</strong>
              </>
            )}
          </div>
          {tendraStockNegativo && (
            <div className="movimiento-modal__alerta-stock-negativo">
              ⚠ <strong>¡Atención!</strong> Esta operación dejará stock negativo ({stockProyectado.toLocaleString()})
              {insumo.permiteStockNegativo ? ' (insumo permite stock negativo)' : ' (requiere autorización)'}
            </div>
          )}
        </div>

        {/* Form */}
        <form key={formKey} className="insumo-modal__form" onSubmit={handleSubmit}>
          <div className="insumo-modal__grid">
            {/* Cantidad */}
            <div className="insumo-modal__campo">
              <label htmlFor="mov-cantidad" className="insumo-modal__label">
                Cantidad <span className="insumo-modal__requerido" aria-hidden="true">*</span>
              </label>
              <input
                ref={primerInputRef}
                id="mov-cantidad"
                type="number"
                name="cantidad"
                className={`insumo-modal__input ${errores.cantidad ? 'insumo-modal__input--error' : ''}`}
                value={formData.cantidad}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                aria-invalid={!!errores.cantidad}
                aria-describedby={errores.cantidad ? 'error-cantidad' : undefined}
              />
              {errores.cantidad && (
                <span id="error-cantidad" className="insumo-modal__error" role="alert">{errores.cantidad}</span>
              )}
              <p className="insumo-modal__ayuda">
                {esEntrada ? 'Cantidad a ingresar' : 'Cantidad a descontar'}
                {' '}<strong>{tipoInfo?.signo}{Number(formData.cantidad || 0).toLocaleString()}</strong>
                {' '}→ Stock proyectado: <strong>{stockProyectado.toLocaleString()}</strong>
              </p>
            </div>

            {/* Precio Compra (solo entrada compra) */}
            {esCompra && (
              <div className="insumo-modal__campo">
                <label htmlFor="mov-precio" className="insumo-modal__label">
                  Precio Compra (S/) <span className="insumo-modal__requerido" aria-hidden="true">*</span>
                </label>
                <div className="insumo-modal__input-precio">
                  <span className="insumo-modal__precio-simbolo" aria-hidden="true">S/</span>
                  <input
                    id="mov-precio"
                    type="number"
                    name="precioCompra"
                    className={`insumo-modal__input ${errores.precioCompra ? 'insumo-modal__input--error' : ''}`}
                    value={formData.precioCompra}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={insumo.precioCompra.toFixed(2)}
                    step="0.01"
                    min="0"
                    aria-invalid={!!errores.precioCompra}
                    aria-describedby={errores.precioCompra ? 'error-precio' : undefined}
                  />
                </div>
                {errores.precioCompra && (
                  <span id="error-precio" className="insumo-modal__error" role="alert">{errores.precioCompra}</span>
                )}
                <p className="insumo-modal__ayuda">Precio actual: S/ {insumo.precioCompra.toFixed(2)}</p>
              </div>
            )}

            {/* Proveedor (solo entrada compra) */}
            {esCompra && (
              <div className="insumo-modal__campo">
                <label htmlFor="mov-proveedor" className="insumo-modal__label">
                  Proveedor <span className="insumo-modal__requerido" aria-hidden="true">*</span>
                </label>
                <select
                  id="mov-proveedor"
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
            )}

            {/* Documento (entrada compra) */}
            {esCompra && (
              <div className="insumo-modal__campo">
                <label htmlFor="mov-documento" className="insumo-modal__label">
                  Documento (Factura/Guía)
                </label>
                <input
                  id="mov-documento"
                  type="text"
                  name="documento"
                  className="insumo-modal__input"
                  value={formData.documento}
                  onChange={handleChange}
                  placeholder="Ej: FC-00123, GR-0456"
                  maxLength={30}
                />
                <p className="insumo-modal__ayuda">Número de factura, guía de remisión, etc.</p>
              </div>
            )}

            {/* Motivo Merma */}
            {esMerma && (
              <div className="insumo-modal__campo">
                <label htmlFor="mov-motivo-merma" className="insumo-modal__label">
                  Motivo de Merma <span className="insumo-modal__requerido" aria-hidden="true">*</span>
                </label>
                <select
                  id="mov-motivo-merma"
                  name="motivoMerma"
                  className={`insumo-modal__select ${errores.motivoMerma ? 'insumo-modal__input--error' : ''}`}
                  value={formData.motivoMerma}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!errores.motivoMerma}
                  aria-describedby={errores.motivoMerma ? 'error-motivo-merma' : undefined}
                >
                  <option value="">Seleccionar motivo...</option>
                  {motivosMerma.map(motivo => (
                    <option key={motivo} value={motivo}>
                      {motivo}
                    </option>
                  ))}
                </select>
                {errores.motivoMerma && (
                  <span id="error-motivo-merma" className="insumo-modal__error" role="alert">{errores.motivoMerma}</span>
                )}
              </div>
            )}

            {/* Motivo general */}
            <div className="insumo-modal__campo insumo-modal__campo--full">
              <label htmlFor="mov-motivo" className="insumo-modal__label">
                Motivo / Observaciones
              </label>
              <textarea
                id="mov-motivo"
                name="motivo"
                className="insumo-modal__textarea"
                value={formData.motivo}
                onChange={handleChange}
                placeholder="Detalle del movimiento..."
                rows={3}
                maxLength={500}
              />
              <p className="insumo-modal__ayuda">{formData.motivo.length}/500 caracteres</p>
            </div>

            {/* Autorizar stock negativo */}
            {(!esEntrada || (esEntrada && Number(formData.cantidad) < 0)) && !insumo.permiteStockNegativo && (
              <div className="insumo-modal__campo insumo-modal__campo--full">
                <label className="insumo-modal__checkbox-label">
                  <input
                    type="checkbox"
                    name="autorizadoStockNegativo"
                    className="insumo-modal__checkbox"
                    checked={formData.autorizadoStockNegativo}
                    onChange={handleChange}
                  />
                  <span className="insumo-modal__checkbox-custom"></span>
                  <span className="insumo-modal__checkbox-text">
                    <strong>Autorizar salida con stock insuficiente</strong> - Confirmo que deseo proceder aunque el stock quede negativo
                  </span>
                </label>
                <p className="insumo-modal__ayuda" style={{ color: '#C62828' }}>
                  ⚠ Requiere autorización de jefe de almacén / administrador
                </p>
              </div>
            )}
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
              className={`insumo-modal__btn insumo-modal__btn--guardar ${esEntrada ? '' : 'insumo-modal__btn--salida'}`}
              disabled={guardando}
            >
              {guardando ? (
                <>
                  <span className="insumo-modal__spinner" aria-hidden="true"></span>
                  Guardando...
                </>
              ) : (
                `${esEntrada ? '📥 Registrar Entrada' : '📤 Registrar Salida'}`
              )}
            </button>
          </footer>
        </form>

        {/* Confirmación Stock Negativo */}
        {mostrarConfirmacionStockNegativo && (
          <div className="insumo-modal__overlay" onClick={() => setMostrarConfirmacionStockNegativo(false)} role="dialog" aria-modal="true" aria-labelledby="confirmar-stock-negativo-titulo">
            <div className="insumo-modal insumo-modal--confirmar" onClick={(e) => e.stopPropagation()}>
              <header className="insumo-modal__header">
                <h2 id="confirmar-stock-negativo-titulo" className="insumo-modal__titulo">⚠ Autorizar Stock Negativo</h2>
              </header>
              <div className="insumo-modal__form" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }} aria-hidden="true">⚠️</div>
                <h3 style={{ margin: '12px 0 8px', color: '#44271D' }}>
                  Stock resultante: <strong style={{ color: '#C62828' }}>{stockProyectado.toLocaleString()}</strong> {insumo.unidadMedida}
                </h3>
                <p style={{ color: '#8B6B5A', margin: 0 }}>
                  El insumo <strong>{insumo.nombre}</strong> quedará con stock negativo.
                </p>
                <p style={{ color: '#C62828', margin: '8px 0 0', fontSize: '0.85rem', fontWeight: 600 }}>
                  Esta acción requiere autorización expresa.
                </p>
                <p style={{ color: '#8B6B5A', margin: '8px 0 0', fontSize: '0.85rem' }}>
                  ¿Confirmas que deseas proceder?
                </p>
              </div>
              <footer className="insumo-modal__footer">
                <button
                  className="insumo-modal__btn insumo-modal__btn--cancelar"
                  onClick={() => setMostrarConfirmacionStockNegativo(false)}
                >
                  Cancelar
                </button>
                <button
                  className="insumo-modal__btn insumo-modal__btn--eliminar"
                  onClick={handleConfirmarStockNegativo}
                >
                  <span aria-hidden="true">⚠</span> Sí, Autorizar
                </button>
              </footer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}