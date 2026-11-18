// src/pages/Pedidos/Pedidos.jsx
// Página principal del módulo Pedidos

import { useState } from 'react';
import { usePedidos } from '../../hooks/usePedidos';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import { PedidoCard } from '../../components/Pedidos/PedidoCard';
import { PedidoFilters } from '../../components/Pedidos/PedidoFilters';
import { PedidoModal } from '../../components/Pedidos/PedidoModal';
import './Pedidos.css';

export default function Pedidos() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [pedidoEditando, setPedidoEditando] = useState(null);
  const [pedidoEliminando, setPedidoEliminando] = useState(null);
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);
  const [pedidoVerDetalle, setPedidoVerDetalle] = useState(null);

  const {
    pedidos,
    cargando,
    error,
    resumen,
    mesasUnicas,
    zonasUnicas,
    filtroBusqueda,
    setFiltroBusqueda,
    filtroEstado,
    setFiltroEstado,
    filtroMesa,
    setFiltroMesa,
    filtroZona,
    setFiltroZona,
    filtroFecha,
    setFiltroFecha,
    crearPedido,
    editarPedido,
    eliminarPedido,
    cambiarEstadoPedido,
    cambiarEstadoItem,
    eliminarItem,
    duplicarPedido,
    resetearDatos,
    limpiarFiltros,
    estadosDisponibles
  } = usePedidos();

  // Handlers
  const manejarNuevoPedido = () => {
    setPedidoEditando(null);
  };

  const manejarEditarPedido = (pedido) => {
    setPedidoEditando(pedido);
  };

  const manejarEliminarPedido = (pedido) => {
    setPedidoEliminando(pedido);
    setMostrarConfirmacionEliminar(true);
  };

  const manejarConfirmarEliminar = async () => {
    if (pedidoEliminando) {
      await eliminarPedido(pedidoEliminando.id);
      setMostrarConfirmacionEliminar(false);
      setPedidoEliminando(null);
    }
  };

  const manejarGuardarPedido = async (datos) => {
    if (pedidoEditando) {
      await editarPedido(pedidoEditando.id, datos);
    } else {
      await crearPedido(datos);
    }
    setPedidoEditando(null);
  };

  const manejarCambiarEstado = async (pedidoId, nuevoEstado) => {
    await cambiarEstadoPedido(pedidoId, nuevoEstado);
  };

  const manejarCambiarEstadoItem = async (pedidoId, itemId, nuevoEstado) => {
    await cambiarEstadoItem(pedidoId, itemId, nuevoEstado);
  };

  const manejarDuplicarPedido = async (pedidoId) => {
    await duplicarPedido(pedidoId);
  };

  const manejarVerDetalle = (pedido) => {
    setPedidoVerDetalle(pedido);
  };

  const manejarImprimir = (pedido) => {
    // TODO: Implementar impresión de comanda
    console.log('Imprimir comanda:', pedido);
    alert(`Imprimir comanda para ${pedido.numero} - Mesa ${pedido.mesaNumero}`);
  };

  const manejarResetearDatos = async () => {
    if (window.confirm('¿Seguro que quieres restablecer los datos de fábrica? Se perderán todos los cambios.')) {
      await resetearDatos();
    }
  };

  const manejarLimpiarFiltros = () => {
    limpiarFiltros();
  };

  // Si está cargando
  if (cargando) {
    return (
      <div className="pedidos-layout">
        <Sidebar
          abierto={menuAbierto}
          onCerrar={() => setMenuAbierto(false)}
        />
        <main className="pedidos-content">
          <Header onAbrirMenu={() => setMenuAbierto(true)} />
          <div className="pedidos-page">
            <div className="pedidos-page__loading" role="status" aria-label="Cargando pedidos">
              <div className="pedidos-page__spinner" aria-hidden="true"></div>
              <p>Cargando pedidos...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="pedidos-layout">
      <Sidebar
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
      />

      <main className="pedidos-content">
        <Header onAbrirMenu={() => setMenuAbierto(true)} />

        <div className="pedidos-page">
          {/* ===== HEADER DEL MÓDULO ===== */}
          <header className="pedidos-page__header">
            <div className="pedidos-page__header-main">
              <div className="pedidos-page__titulos">
                <h1 className="pedidos-page__titulo">Pedidos</h1>
                <p className="pedidos-page__subtitulo">Administra los pedidos del restaurante</p>
              </div>

              <div className="pedidos-page__acciones">
                <button
                  className="pedidos-page__btn pedidos-page__btn--secundaria"
                  onClick={manejarResetearDatos}
                  title="Restablecer datos de prueba"
                >
                  <span aria-hidden="true">↻</span>
                </button>
                <button
                  className="pedidos-page__btn pedidos-page__btn--primaria"
                  onClick={manejarNuevoPedido}
                  aria-label="Crear nuevo pedido"
                >
                  <span aria-hidden="true">+</span> Nuevo pedido
                </button>
              </div>
            </div>

            {/* Resumen de estados */}
            <div className="pedidos-page__resumen" role="region" aria-label="Resumen de pedidos por estado">
              <div className="pedidos-page__resumen-item pedidos-page__resumen--pendiente">
                <span className="pedidos-page__resumen-icon" aria-hidden="true">⏳</span>
                <div>
                  <span className="pedidos-page__resumen-valor">{resumen.Pendiente || 0}</span>
                  <span className="pedidos-page__resumen-label">Pendientes</span>
                </div>
              </div>
              <div className="pedidos-page__resumen-item pedidos-page__resumen--preparacion">
                <span className="pedidos-page__resumen-icon" aria-hidden="true">👨‍🍳</span>
                <div>
                  <span className="pedidos-page__resumen-valor">{resumen['En preparación'] || 0}</span>
                  <span className="pedidos-page__resumen-label">En preparación</span>
                </div>
              </div>
              <div className="pedidos-page__resumen-item pedidos-page__resumen--listo">
                <span className="pedidos-page__resumen-icon" aria-hidden="true">✅</span>
                <div>
                  <span className="pedidos-page__resumen-valor">{resumen.Listo || 0}</span>
                  <span className="pedidos-page__resumen-label">Listos</span>
                </div>
              </div>
              <div className="pedidos-page__resumen-item pedidos-page__resumen--entregado">
                <span className="pedidos-page__resumen-icon" aria-hidden="true">📦</span>
                <div>
                  <span className="pedidos-page__resumen-valor">{resumen.Entregado || 0}</span>
                  <span className="pedidos-page__resumen-label">Entregados</span>
                </div>
              </div>
              <div className="pedidos-page__resumen-item pedidos-page__resumen--total">
                <span className="pedidos-page__resumen-icon" aria-hidden="true">▦</span>
                <div>
                  <span className="pedidos-page__resumen-valor">{resumen.total}</span>
                  <span className="pedidos-page__resumen-label">Total</span>
                </div>
              </div>
              <div className="pedidos-page__resumen-item pedidos-page__resumen--ingresos">
                <span className="pedidos-page__resumen-icon" aria-hidden="true">💰</span>
                <div>
                  <span className="pedidos-page__resumen-valor">S/ {resumen.totalIngresos.toFixed(2)}</span>
                  <span className="pedidos-page__resumen-label">Ingresos hoy</span>
                </div>
              </div>
            </div>
          </header>

          {/* ===== FILTROS ===== */}
          <PedidoFilters
            filtroBusqueda={filtroBusqueda}
            onChangeBusqueda={setFiltroBusqueda}
            filtroEstado={filtroEstado}
            onChangeEstado={setFiltroEstado}
            filtroMesa={filtroMesa}
            onChangeMesa={setFiltroMesa}
            filtroZona={filtroZona}
            onChangeZona={setFiltroZona}
            filtroFecha={filtroFecha}
            onChangeFecha={setFiltroFecha}
            mesasDisponibles={mesasUnicas}
            zonasDisponibles={zonasUnicas}
            estadosDisponibles={estadosDisponibles}
            totalPedidos={resumen.total}
            pedidosFiltradosCount={pedidos.length}
            onLimpiarFiltros={manejarLimpiarFiltros}
          />

          {/* ===== MENSAJE DE ERROR ===== */}
          {error && (
            <div className="pedidos-page__error" role="alert">
              <span aria-hidden="true">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* ===== GRID DE PEDIDOS ===== */}
          <section className="pedidos-page__grid" aria-label="Listado de pedidos">
            {pedidos.length === 0 ? (
              <div className="pedidos-page__vacio">
                <div className="pedidos-page__vacio-icon" aria-hidden="true">🛒</div>
                <h3>No hay pedidos</h3>
                <p>
                  {filtroBusqueda || filtroEstado !== 'Todos' || filtroMesa !== 'Todas' || filtroZona !== 'Todas' || filtroFecha
                    ? 'Intenta cambiar los filtros o limpiarlos.'
                    : 'Crea tu primer pedido para empezar.'}
                </p>
                {(!filtroBusqueda && filtroEstado === 'Todos' && filtroMesa === 'Todas' && filtroZona === 'Todas' && !filtroFecha) && (
                  <button className="pedidos-page__btn pedidos-page__btn--primaria" onClick={manejarNuevoPedido}>
                    <span aria-hidden="true">+</span> Crear primer pedido
                  </button>
                )}
              </div>
            ) : (
              pedidos.map((pedido) => (
                <PedidoCard
                  key={pedido.id}
                  pedido={pedido}
                  onClick={manejarVerDetalle}
                  onCambiarEstado={manejarCambiarEstado}
                  onCambiarEstadoItem={manejarCambiarEstadoItem}
                  onEditar={manejarEditarPedido}
                  onEliminar={manejarEliminarPedido}
                  onDuplicar={manejarDuplicarPedido}
                  onImprimir={manejarImprimir}
                  onVerDetalle={manejarVerDetalle}
                  onEliminarItem={eliminarItem}
                  onCobrar={() => {}}
                />
              ))
            )}
          </section>

          {/* ===== MODAL CREAR/EDITAR ===== */}
          <PedidoModal
            abierto={!!pedidoEditando}
            onCerrar={() => setPedidoEditando(null)}
            pedido={pedidoEditando}
            onGuardar={manejarGuardarPedido}
          />

          {/* ===== MODAL CONFIRMACIÓN ELIMINAR ===== */}
          {mostrarConfirmacionEliminar && (
            <div className="pedido-modal__overlay" onClick={() => setMostrarConfirmacionEliminar(false)} role="dialog" aria-modal="true" aria-labelledby="confirmar-eliminar-titulo">
              <div className="pedido-modal pedido-modal--confirmar" onClick={(e) => e.stopPropagation()}>
                <header className="pedido-modal__header">
                  <h2 id="confirmar-eliminar-titulo" className="pedido-modal__titulo">Eliminar pedido</h2>
                </header>
                <div className="pedidos-page__vacio" style={{ padding: '24px', textAlign: 'center', background: 'transparent', border: 'none', boxShadow: 'none' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '8px' }} aria-hidden="true">🗑</div>
                  <h3 style={{ margin: '16px 0 8px', color: '#44271D' }}>
                    ¿Eliminar <strong>{pedidoEliminando?.numero}</strong>?
                  </h3>
                  <p style={{ color: '#8B6B5A', margin: 0 }}>
                    Mesa {pedidoEliminando?.mesaNumero} - {pedidoEliminando?.mozo}
                  </p>
                  <p style={{ color: '#8B6B5A', margin: '8px 0 0', fontSize: '0.85rem' }}>
                    Esta acción no se puede deshacer. El pedido y sus items se eliminarán permanentemente.
                  </p>
                </div>
                <footer className="pedido-modal__footer">
                  <button
                    className="pedido-modal__btn pedido-modal__btn--cancelar"
                    onClick={() => setMostrarConfirmacionEliminar(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="pedido-modal__btn pedido-modal__btn--eliminar"
                    onClick={manejarConfirmarEliminar}
                  >
                    <span aria-hidden="true">🗑</span> Eliminar
                  </button>
                </footer>
              </div>
            </div>
          )}

          {/* ===== MODAL VER DETALLE ===== */}
          {pedidoVerDetalle && (
            <div className="pedido-modal__overlay" onClick={() => setPedidoVerDetalle(null)} role="dialog" aria-modal="true" aria-labelledby="detalle-pedido-titulo">
              <div className="pedido-modal pedido-modal--detalle" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                <header className="pedido-modal__header">
                  <h2 id="detalle-pedido-titulo" className="pedido-modal__titulo">{pedidoVerDetalle.numero}</h2>
                  <button
                    className="pedido-modal__cerrar"
                    onClick={() => setPedidoVerDetalle(null)}
                    aria-label="Cerrar"
                    type="button"
                  >
                    <span aria-hidden="true">✕</span>
                  </button>
                </header>
                <div className="pedido-modal__form" style={{ padding: '0 24px 24px', overflowY: 'auto', maxHeight: '70vh' }}>
                  <div className="pedido-modal__detalle-header">
                    <div className="pedido-modal__detalle-info">
                      <div className="pedido-modal__detalle-fila">
                        <span className="pedido-modal__detalle-label">Mesa</span>
                        <span className="pedido-modal__detalle-valor">
                          <span aria-hidden="true">▦</span> {pedidoVerDetalle.mesaNombre} (Nº {pedidoVerDetalle.mesaNumero})
                        </span>
                      </div>
                      <div className="pedido-modal__detalle-fila">
                        <span className="pedido-modal__detalle-label">Zona</span>
                        <span className="pedido-modal__detalle-valor">{pedidoVerDetalle.zona}</span>
                      </div>
                      <div className="pedido-modal__detalle-fila">
                        <span className="pedido-modal__detalle-label">Mozo</span>
                        <span className="pedido-modal__detalle-valor">{pedidoVerDetalle.mozo}</span>
                      </div>
                      <div className="pedido-modal__detalle-fila">
                        <span className="pedido-modal__detalle-label">Hora</span>
                        <span className="pedido-modal__detalle-valor">{pedidoVerDetalle.horaInicio}</span>
                      </div>
                      {pedidoVerDetalle.observaciones && (
                        <div className="pedido-modal__detalle-fila">
                          <span className="pedido-modal__detalle-label">Observaciones</span>
                          <span className="pedido-modal__detalle-valor">{pedidoVerDetalle.observaciones}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pedido-modal__items-lista" style={{ marginTop: '16px' }}>
                    {pedidoVerDetalle.items.map((item, index) => (
                      <div key={item.id} className="pedido-modal__item" style={{ borderBottom: '1px solid #F0E8E1', padding: '12px 0' }}>
                        <div className="pedido-modal__item-info" style={{ gridColumn: '1 / -1' }}>
                          <span className="pedido-modal__item-numero">{index + 1}.</span>
                          <span className="pedido-modal__item-nombre">{item.nombre}</span>
                          {item.observaciones && (
                            <span className="pedido-modal__item-obs">({item.observaciones})</span>
                          )}
                        </div>
                        <div className="pedido-modal__item-cantidad">
                          <span className="pedido-modal__cantidad-valor">{item.cantidad}x</span>
                        </div>
                        <span className="pedido-modal__item-subtotal">
                          S/ {(item.precio * item.cantidad).toFixed(2)}
                        </span>
                        <span className="pedido-modal__item-estado" style={{
                          padding: '2px 8px',
                          borderRadius: '20px',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          background: '#F8EFE5',
                          color: '#8B6B5A'
                        }}>
                          {item.estado}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pedido-modal__totales" style={{ marginTop: '16px' }}>
                    <div className="pedido-modal__total-fila">
                      <span>Subtotal</span>
                      <strong>S/ {pedidoVerDetalle.subtotal.toFixed(2)}</strong>
                    </div>
                    <div className="pedido-modal__total-fila">
                      <span>IGV (18%)</span>
                      <strong>S/ {pedidoVerDetalle.igv.toFixed(2)}</strong>
                    </div>
                    <div className="pedido-modal__total-fila pedido-modal__total-fila--final">
                      <span>Total</span>
                      <strong>S/ {pedidoVerDetalle.total.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}