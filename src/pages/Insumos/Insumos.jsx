// src/pages/Insumos/Insumos.jsx
// Página principal del módulo Insumos e Inventario

import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import { InsumoTable } from '../../components/Insumos/InsumoTable';
import { InsumoFilters } from '../../components/Insumos/InsumoFilters';
import { InsumoModal } from '../../components/Insumos/InsumoModal';
import { MovimientoModal } from '../../components/Insumos/MovimientoModal';
import { HistorialModal } from '../../components/Insumos/HistorialModal';
import { RecetaManager } from '../../components/Insumos/RecetaManager';
import { AlertaStock } from '../../components/Insumos/AlertaStock';
import { useInsumos } from '../../hooks/useInsumos';
import './Insumos.css';

export default function Insumos() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [insumoEditando, setInsumoEditando] = useState(null);
  const [insumoEliminando, setInsumoEliminando] = useState(null);
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);
  const [movimientoAbierto, setMovimientoAbierto] = useState(null); // { tipo, insumo }
  const [historialAbierto, setHistorialAbierto] = useState(null);
  const [recetaManagerAbierto, setRecetaManagerAbierto] = useState(false);
  const [alertaStockAbierta, setAlertaStockAbierta] = useState(false);

  const {
    insumos,
    categoriasActivas,
    proveedoresActivos,
    movimientos,
    recetas,
    cargando,
    error,
    resumen,
    alertasStock,
    vista,
    setVista,
    filtroBusqueda,
    setFiltroBusqueda,
    filtroCategoria,
    setFiltroCategoria,
    filtroEstado,
    setFiltroEstado,
    filtroStock,
    setFiltroStock,
    filtroProveedor,
    setFiltroProveedor,
    crearInsumo,
    editarInsumo,
    eliminarInsumo,
    toggleEstadoInsumo,
    registrarEntradaCompra,
    registrarEntradaAjuste,
    registrarSalidaManual,
    registrarMerma,
    resetearDatos,
    limpiarFiltros,
    obtenerColorEstado,
    obtenerUnidadMedida,
    obtenerCategoria,
    obtenerProveedor,
    ESTADOS_INSUMO,
    UNIDADES_MEDIDA,
    TIPOS_MOVIMIENTO,
    MOTIVOS_MERMA
  } = useInsumos();

  // Handlers
  const manejarNuevoInsumo = () => {
    setInsumoEditando(null);
  };

  const manejarEditarInsumo = (insumo) => {
    setInsumoEditando(insumo);
  };

  const manejarEliminarInsumo = (insumo) => {
    setInsumoEliminando(insumo);
    setMostrarConfirmacionEliminar(true);
  };

  const manejarConfirmarEliminar = async () => {
    if (insumoEliminando) {
      try {
        await eliminarInsumo(insumoEliminando.id);
        setMostrarConfirmacionEliminar(false);
        setInsumoEliminando(null);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const manejarGuardarInsumo = async (datos) => {
    if (insumoEditando) {
      await editarInsumo(insumoEditando.id, datos);
    } else {
      await crearInsumo(datos);
    }
    setInsumoEditando(null);
  };

  const manejarResetearDatos = async () => {
    if (window.confirm('¿Restablecer datos de prueba? Se perderán todos los cambios.')) {
      await resetearDatos();
    }
  };

  const manejarLimpiarFiltros = () => {
    limpiarFiltros();
  };

  const manejarAbrirCategorias = () => {
    setRecetaManagerAbierto(true); // Reutilizamos el modal para categorías también
  };

  const manejarMovimiento = (tipo, insumo) => {
    setMovimientoAbierto({ tipo, insumo });
  };

  const manejarCerrarMovimiento = () => {
    setMovimientoAbierto(null);
  };

  const manejarGuardarMovimiento = async (datos) => {
    if (!movimientoAbierto) return;
    const { tipo, insumo } = movimientoAbierto;
    try {
      switch (tipo) {
        case 'entrada_compra':
          await registrarEntradaCompra(insumo.id, datos.cantidad, datos.precioCompra, datos.proveedorId, datos.documento, datos.motivo);
          break;
        case 'entrada_ajuste':
          await registrarEntradaAjuste(insumo.id, datos.cantidad, datos.motivo);
          break;
        case 'salida_manual':
          await registrarSalidaManual(insumo.id, datos.cantidad, datos.motivo, datos.autorizadoStockNegativo);
          break;
        case 'salida_merma':
          await registrarMerma(insumo.id, datos.cantidad, datos.motivoMerma, datos.autorizadoStockNegativo);
          break;
      }
      setMovimientoAbierto(null);
    } catch (error) {
      if (error.message === 'STOCK_NEGATIVO_NO_AUTORIZADO') {
        // El modal maneja esto internamente
        throw error;
      }
      throw error;
    }
  };

  const manejarVerHistorial = (insumo) => {
    setHistorialAbierto(insumo);
  };

  const manejarAbrirRecetas = () => {
    setRecetaManagerAbierto(true);
  };

  const manejarVerAlertas = () => {
    setAlertaStockAbierta(true);
  };

  // Loading
  if (cargando) {
    return (
      <div className="insumos-layout">
        <Sidebar abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />
        <main className="insumos-content">
          <Header onAbrirMenu={() => setMenuAbierto(true)} />
          <div className="insumos-page">
            <div className="insumos-page__loading" role="status" aria-label="Cargando insumos">
              <div className="insumos-page__spinner" aria-hidden="true"></div>
              <p>Cargando inventario...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="insumos-layout">
      <Sidebar
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
      />

      <main className="insumos-content">
        <Header onAbrirMenu={() => setMenuAbierto(true)} />

        <div className="insumos-page">
          {/* ===== HEADER ===== */}
          <header className="insumos-page__header">
            <div className="insumos-page__header-main">
              <div className="insumos-page__titulos">
                <h1 className="insumos-page__titulo">Insumos e Inventario</h1>
                <p className="insumos-page__subtitulo">Administra materias primas, stock y recetas</p>
              </div>

              <div className="insumos-page__acciones">
                <button
                  className="insumos-page__btn insumos-page__btn--secundaria"
                  onClick={manejarResetearDatos}
                  title="Restablecer datos de prueba"
                  aria-label="Restablecer datos de prueba"
                >
                  <span aria-hidden="true">↻</span>
                </button>
                <button
                  className="insumos-page__btn insumos-page__btn--secundaria"
                  onClick={manejarAbrirCategorias}
                  aria-label="Gestionar categorías"
                >
                  <span aria-hidden="true">📂</span> Categorías
                </button>
                <button
                  className="insumos-page__btn insumos-page__btn--secundaria"
                  onClick={manejarAbrirRecetas}
                  aria-label="Gestionar recetas"
                >
                  <span aria-hidden="true">📋</span> Recetas
                </button>
                {alertasStock.length > 0 && (
                  <button
                    className="insumos-page__btn insumos-page__btn--alerta"
                    onClick={manejarVerAlertas}
                    aria-label={`Ver alertas de stock (${alertasStock.length})`}
                  >
                    <span aria-hidden="true">⚠️</span> Alertas ({alertasStock.length})
                  </button>
                )}
                <button
                  className="insumos-page__btn insumos-page__btn--primaria"
                  onClick={manejarNuevoInsumo}
                  aria-label="Crear nuevo insumo"
                >
                  <span aria-hidden="true">+</span> Nuevo insumo
                </button>
              </div>
            </div>

            {/* Resumen */}
            <div className="insumos-page__resumen" role="region" aria-label="Resumen de inventario">
              <div className="insumos-page__resumen-item">
                <span className="insumos-page__resumen-icon" aria-hidden="true">📦</span>
                <div>
                  <span className="insumos-page__resumen-valor">{resumen.total}</span>
                  <span className="insumos-page__resumen-label">Total Insumos</span>
                </div>
              </div>
              <div className="insumos-page__resumen-item insumos-page__resumen--activos">
                <span className="insumos-page__resumen-icon" aria-hidden="true">✅</span>
                <div>
                  <span className="insumos-page__resumen-valor">{resumen.activos}</span>
                  <span className="insumos-page__resumen-label">Activos</span>
                </div>
              </div>
              <div className="insumos-page__resumen-item insumos-page__resumen--criticos">
                <span className="insumos-page__resumen-icon" aria-hidden="true">🔴</span>
                <div>
                  <span className="insumos-page__resumen-valor">{resumen.criticos}</span>
                  <span className="insumos-page__resumen-label">Críticos</span>
                </div>
              </div>
              <div className="insumos-page__resumen-item insumos-page__resumen--bajos">
                <span className="insumos-page__resumen-icon" aria-hidden="true">🟡</span>
                <div>
                  <span className="insumos-page__resumen-valor">{resumen.bajos}</span>
                  <span className="insumos-page__resumen-label">Bajos</span>
                </div>
              </div>
              <div className="insumos-page__resumen-item insumos-page__resumen--valor">
                <span className="insumos-page__resumen-icon" aria-hidden="true">💰</span>
                <div>
                  <span className="insumos-page__resumen-valor">S/ {resumen.valorTotal.toFixed(2)}</span>
                  <span className="insumos-page__resumen-label">Valor Inventario</span>
                </div>
              </div>
              <div className="insumos-page__resumen-item">
                <span className="insumos-page__resumen-icon" aria-hidden="true">📂</span>
                <div>
                  <span className="insumos-page__resumen-valor">{categoriasActivas.length}</span>
                  <span className="insumos-page__resumen-label">Categorías</span>
                </div>
              </div>
            </div>
          </header>

          {/* ===== FILTROS ===== */}
          <InsumoFilters
            filtroBusqueda={filtroBusqueda}
            onChangeBusqueda={setFiltroBusqueda}
            filtroCategoria={filtroCategoria}
            onChangeCategoria={setFiltroCategoria}
            filtroEstado={filtroEstado}
            onChangeEstado={setFiltroEstado}
            filtroStock={filtroStock}
            onChangeStock={setFiltroStock}
            filtroProveedor={filtroProveedor}
            onChangeProveedor={setFiltroProveedor}
            categorias={categoriasActivas}
            proveedores={proveedoresActivos}
            resumen={resumen}
            insumosCount={insumos.length}
            onLimpiarFiltros={manejarLimpiarFiltros}
            vista={vista}
            onChangeVista={setVista}
          />

          {/* ===== ERROR ===== */}
          {error && (
            <div className="insumos-page__error" role="alert">
              <span aria-hidden="true">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* ===== VISTA TABLA ===== */}
          <section className="insumos-page__vista" aria-label="Listado de insumos">
            <InsumoTable
              insumos={insumos}
              onEditar={manejarEditarInsumo}
              onEliminar={manejarEliminarInsumo}
              onToggleEstado={toggleEstadoInsumo}
              onEntradaCompra={(insumo) => manejarMovimiento('entrada_compra', insumo)}
              onEntradaAjuste={(insumo) => manejarMovimiento('entrada_ajuste', insumo)}
              onSalidaManual={(insumo) => manejarMovimiento('salida_manual', insumo)}
              onMerma={(insumo) => manejarMovimiento('salida_merma', insumo)}
              onHistorial={manejarVerHistorial}
              obtenerColorEstado={obtenerColorEstado}
              obtenerUnidadMedida={obtenerUnidadMedida}
              obtenerCategoria={obtenerCategoria}
              obtenerProveedor={obtenerProveedor}
            />
          </section>

          {/* ===== MODAL INSUMO ===== */}
          <InsumoModal
            abierto={!!insumoEditando}
            onCerrar={() => setInsumoEditando(null)}
            insumo={insumoEditando}
            categorias={categoriasActivas}
            proveedores={proveedoresActivos}
            unidadesMedida={UNIDADES_MEDIDA}
            estados={ESTADOS_INSUMO}
            onGuardar={manejarGuardarInsumo}
            obtenerCategoria={obtenerCategoria}
            obtenerProveedor={obtenerProveedor}
          />

          {/* ===== MODAL CONFIRMACIÓN ELIMINAR ===== */}
          {mostrarConfirmacionEliminar && (
            <div className="insumo-modal__overlay" onClick={() => setMostrarConfirmacionEliminar(false)} role="dialog" aria-modal="true" aria-labelledby="confirmar-eliminar-titulo">
              <div className="insumo-modal insumo-modal--confirmar" onClick={(e) => e.stopPropagation()}>
                <header className="insumo-modal__header">
                  <h2 id="confirmar-eliminar-titulo" className="insumo-modal__titulo">Eliminar insumo</h2>
                </header>
                <div className="insumo-modal__form" style={{ padding: '24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }} aria-hidden="true">🗑️</div>
                  <h3 style={{ margin: '12px 0 8px', color: '#44271D' }}>
                    ¿Eliminar <strong>{insumoEliminando?.nombre}</strong>?
                  </h3>
                  <p style={{ color: '#8B6B5A', margin: 0 }}>
                    Código: {insumoEliminando?.codigo} · {insumoEliminando?.categoriaNombre}
                  </p>
                  <p style={{ color: '#C62828', margin: '8px 0 0', fontSize: '0.85rem', fontWeight: 600 }}>
                    ⚠ No se puede eliminar si tiene movimientos o está en recetas
                  </p>
                  <p style={{ color: '#8B6B5A', margin: '8px 0 0', fontSize: '0.85rem' }}>
                    Esta acción no se puede deshacer.
                  </p>
                </div>
                <footer className="insumo-modal__footer">
                  <button
                    className="insumo-modal__btn insumo-modal__btn--cancelar"
                    onClick={() => setMostrarConfirmacionEliminar(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="insumo-modal__btn insumo-modal__btn--eliminar"
                    onClick={manejarConfirmarEliminar}
                  >
                    <span aria-hidden="true">🗑️</span> Eliminar
                  </button>
                </footer>
              </div>
            </div>
          )}

          {/* ===== MODAL MOVIMIENTO ===== */}
          <MovimientoModal
            abierto={!!movimientoAbierto}
            onCerrar={manejarCerrarMovimiento}
            datos={movimientoAbierto}
            proveedores={proveedoresActivos}
            tiposMovimiento={TIPOS_MOVIMIENTO}
            motivosMerma={MOTIVOS_MERMA}
            onGuardar={manejarGuardarMovimiento}
          />

          {/* ===== MODAL HISTORIAL ===== */}
          <HistorialModal
            abierto={!!historialAbierto}
            onCerrar={() => setHistorialAbierto(null)}
            insumo={historialAbierto}
            movimientos={movimientos}
            obtenerColorTipoMovimiento={(tipo) => {
              const colores = {
                'entrada_compra': { bg: '#E8F5E9', text: '#2E7D32', border: '#81C784', icon: '📥' },
                'entrada_ajuste': { bg: '#E3F2FD', text: '#1565C0', border: '#64B5F6', icon: '📈' },
                'entrada_devolucion': { bg: '#E1F5FE', text: '#0288D1', border: '#4FC3F7', icon: '↩️' },
                'salida_consumo': { bg: '#FBE9E7', text: '#C62828', border: '#EF9A9A', icon: '🍳' },
                'salida_manual': { bg: '#FFF3E0', text: '#D84315', border: '#FFB74D', icon: '📤' },
                'salida_merma': { bg: '#FBE9E7', text: '#BF360C', border: '#FF8A65', icon: '🗑️' },
                'salida_transferencia': { bg: '#F3E5F5', text: '#6A1B9A', border: '#BA68C8', icon: '🔄' }
              };
              return colores[tipo] || { bg: '#F5F5F5', text: '#333', border: '#DDD', icon: '📦' };
            }}
          />

          {/* ===== RECETA MANAGER ===== */}
          <RecetaManager
            abierto={recetaManagerAbierto}
            onCerrar={() => setRecetaManagerAbierto(false)}
            recetas={recetas}
            insumos={insumos}
            categorias={categoriasActivas}
          />

          {/* ===== ALERTA STOCK ===== */}
          <AlertaStock
            abierto={alertaStockAbierta}
            onCerrar={() => setAlertaStockAbierta(false)}
            alertas={alertasStock}
          />
        </div>
      </main>
    </div>
  );
}