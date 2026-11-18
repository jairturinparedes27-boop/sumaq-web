// src/pages/Productos/Productos.jsx
// Página principal del módulo Productos

import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import { ProductoCard } from '../../components/Productos/ProductoCard';
import { ProductoTable } from '../../components/Productos/ProductoTable';
import { ProductoFilters } from '../../components/Productos/ProductoFilters';
import { ProductoModal } from '../../components/Productos/ProductoModal';
import { CategoriaManager } from '../../components/Productos/CategoriaManager';
import { useProductos } from '../../hooks/useProductos';
import './Productos.css';

export default function Productos() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [productoEliminando, setProductoEliminando] = useState(null);
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);
  const [categoriaManagerAbierto, setCategoriaManagerAbierto] = useState(false);

  const {
    productos,
    categorias,
    categoriasActivas,
    cargando,
    error,
    resumen,
    vista,
    setVista,
    filtroBusqueda,
    setFiltroBusqueda,
    filtroCategoria,
    setFiltroCategoria,
    filtroEstado,
    setFiltroEstado,
    filtroDisponibilidad,
    setFiltroDisponibilidad,
    crearProducto,
    editarProducto,
    eliminarProducto,
    toggleEstadoProducto,
    toggleDisponibilidadProducto,
    duplicarProducto,
    resetearDatos,
    limpiarFiltros,
    obtenerColorCategoria,
    obtenerColorEstado,
    obtenerIconoCategoria,
    // Acciones de categorías
    crearCategoria,
    editarCategoria,
    eliminarCategoria,
    reordenarCategorias,
    toggleCategoriaActiva
  } = useProductos();

  // Handlers
  const manejarNuevoProducto = () => {
    setProductoEditando(null);
  };

  const manejarEditarProducto = (producto) => {
    setProductoEditando(producto);
  };

  const manejarEliminarProducto = (producto) => {
    setProductoEliminando(producto);
    setMostrarConfirmacionEliminar(true);
  };

  const manejarConfirmarEliminar = async () => {
    if (productoEliminando) {
      await eliminarProducto(productoEliminando.id);
      setMostrarConfirmacionEliminar(false);
      setProductoEliminando(null);
    }
  };

  const manejarGuardarProducto = async (datos) => {
    if (productoEditando) {
      await editarProducto(productoEditando.id, datos);
    } else {
      await crearProducto(datos);
    }
    setProductoEditando(null);
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
    setCategoriaManagerAbierto(true);
  };

  // Loading
  if (cargando) {
    return (
      <div className="productos-layout">
        <Sidebar abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />
        <main className="productos-content">
          <Header onAbrirMenu={() => setMenuAbierto(true)} />
          <div className="productos-page">
            <div className="productos-page__loading" role="status" aria-label="Cargando productos">
              <div className="productos-page__spinner" aria-hidden="true"></div>
              <p>Cargando productos...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="productos-layout">
      <Sidebar
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
      />

      <main className="productos-content">
        <Header onAbrirMenu={() => setMenuAbierto(true)} />

        <div className="productos-page">
          {/* ===== HEADER ===== */}
          <header className="productos-page__header">
            <div className="productos-page__header-main">
              <div className="productos-page__titulos">
                <h1 className="productos-page__titulo">Productos</h1>
                <p className="productos-page__subtitulo">Administra el menú del restaurante</p>
              </div>

              <div className="productos-page__acciones">
                <button
                  className="productos-page__btn productos-page__btn--secundaria"
                  onClick={manejarResetearDatos}
                  title="Restablecer datos de prueba"
                  aria-label="Restablecer datos de prueba"
                >
                  <span aria-hidden="true">↻</span>
                </button>
                <button
                  className="productos-page__btn productos-page__btn--secundaria"
                  onClick={manejarAbrirCategorias}
                  aria-label="Gestionar categorías"
                >
                  <span aria-hidden="true">📂</span> Categorías
                </button>
                <button
                  className="productos-page__btn productos-page__btn--primaria"
                  onClick={manejarNuevoProducto}
                  aria-label="Crear nuevo producto"
                >
                  <span aria-hidden="true">+</span> Nuevo producto
                </button>
              </div>
            </div>

            {/* Resumen */}
            <div className="productos-page__resumen" role="region" aria-label="Resumen de productos">
              <div className="productos-page__resumen-item">
                <span className="productos-page__resumen-icon" aria-hidden="true">📦</span>
                <div>
                  <span className="productos-page__resumen-valor">{resumen.total}</span>
                  <span className="productos-page__resumen-label">Total</span>
                </div>
              </div>
              <div className="productos-page__resumen-item productos-page__resumen--activos">
                <span className="productos-page__resumen-icon" aria-hidden="true">✅</span>
                <div>
                  <span className="productos-page__resumen-valor">{resumen.activos}</span>
                  <span className="productos-page__resumen-label">Activos</span>
                </div>
              </div>
              <div className="productos-page__resumen-item productos-page__resumen--inactivos">
                <span className="productos-page__resumen-icon" aria-hidden="true">⏸</span>
                <div>
                  <span className="productos-page__resumen-valor">{resumen.inactivos}</span>
                  <span className="productos-page__resumen-label">Inactivos</span>
                </div>
              </div>
              <div className="productos-page__resumen-item productos-page__resumen--disp">
                <span className="productos-page__resumen-icon" aria-hidden="true">🟢</span>
                <div>
                  <span className="productos-page__resumen-valor">{resumen.disponibles}</span>
                  <span className="productos-page__resumen-label">Disponibles</span>
                </div>
              </div>
              <div className="productos-page__resumen-item">
                <span className="productos-page__resumen-icon" aria-hidden="true">📂</span>
                <div>
                  <span className="productos-page__resumen-valor">{categoriasActivas.length}</span>
                  <span className="productos-page__resumen-label">Categorías</span>
                </div>
              </div>
            </div>
          </header>

          {/* ===== FILTROS ===== */}
          <ProductoFilters
            filtroBusqueda={filtroBusqueda}
            onChangeBusqueda={setFiltroBusqueda}
            filtroCategoria={filtroCategoria}
            onChangeCategoria={setFiltroCategoria}
            filtroEstado={filtroEstado}
            onChangeEstado={setFiltroEstado}
            filtroDisponibilidad={filtroDisponibilidad}
            onChangeDisponibilidad={setFiltroDisponibilidad}
            categorias={categoriasActivas}
            resumen={resumen}
            productosCount={productos.length}
            onLimpiarFiltros={manejarLimpiarFiltros}
            vista={vista}
            onChangeVista={setVista}
          />

          {/* ===== ERROR ===== */}
          {error && (
            <div className="productos-page__error" role="alert">
              <span aria-hidden="true">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* ===== VISTA GRID / TABLA ===== */}
          <section className="productos-page__vista" aria-label="Listado de productos">
            {vista === 'grid' ? (
              <div className="productos-page__grid" role="list">
                {productos.length === 0 ? (
                  <div className="productos-page__vacio" role="listitem">
                    <div className="productos-page__vacio-icon" aria-hidden="true">📭</div>
                    <h3>No hay productos</h3>
                    <p>
                      {filtroBusqueda || filtroCategoria !== 'Todas' || filtroEstado !== 'Todos' || filtroDisponibilidad !== 'Todas'
                        ? 'Intenta cambiar los filtros o limpiarlos.'
                        : 'Crea tu primer producto para empezar.'}
                    </p>
                    {(!filtroBusqueda && filtroCategoria === 'Todas' && filtroEstado === 'Todos' && filtroDisponibilidad === 'Todas') && (
                      <button className="productos-page__btn productos-page__btn--primaria" onClick={manejarNuevoProducto}>
                        <span aria-hidden="true">+</span> Crear primer producto
                      </button>
                    )}
                  </div>
                ) : (
                  productos.map((producto) => (
                    <ProductoCard
                      key={producto.id}
                      producto={producto}
                      onEditar={manejarEditarProducto}
                      onEliminar={manejarEliminarProducto}
                      onToggleEstado={toggleEstadoProducto}
                      onToggleDisponibilidad={toggleDisponibilidadProducto}
                      onDuplicar={duplicarProducto}
                      obtenerColorCategoria={obtenerColorCategoria}
                      obtenerColorEstado={obtenerColorEstado}
                      obtenerIconoCategoria={obtenerIconoCategoria}
                    />
                  ))
                )}
              </div>
            ) : (
              <ProductoTable
                productos={productos}
                onEditar={manejarEditarProducto}
                onEliminar={manejarEliminarProducto}
                onToggleEstado={toggleEstadoProducto}
                onToggleDisponibilidad={toggleDisponibilidadProducto}
                onDuplicar={duplicarProducto}
                obtenerColorCategoria={obtenerColorCategoria}
                obtenerColorEstado={obtenerColorEstado}
                obtenerIconoCategoria={obtenerIconoCategoria}
              />
            )}
          </section>

          {/* ===== MODAL PRODUCTO ===== */}
          <ProductoModal
            abierto={!!productoEditando}
            onCerrar={() => setProductoEditando(null)}
            producto={productoEditando}
            categorias={categoriasActivas}
            onGuardar={manejarGuardarProducto}
            obtenerIconoCategoria={obtenerIconoCategoria}
          />

          {/* ===== MODAL CONFIRMACIÓN ELIMINAR ===== */}
          {mostrarConfirmacionEliminar && (
            <div className="producto-modal__overlay" onClick={() => setMostrarConfirmacionEliminar(false)} role="dialog" aria-modal="true" aria-labelledby="confirmar-eliminar-titulo">
              <div className="producto-modal producto-modal--confirmar" onClick={(e) => e.stopPropagation()}>
                <header className="producto-modal__header">
                  <h2 id="confirmar-eliminar-titulo" className="producto-modal__titulo">Eliminar producto</h2>
                </header>
                <div className="producto-modal__form" style={{ padding: '24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }} aria-hidden="true">🗑️</div>
                  <h3 style={{ margin: '12px 0 8px', color: '#44271D' }}>
                    ¿Eliminar <strong>{productoEliminando?.nombre}</strong>?
                  </h3>
                  <p style={{ color: '#8B6B5A', margin: 0 }}>
                    Código: {productoEliminando?.codigo} · {productoEliminando?.categoriaNombre}
                  </p>
                  <p style={{ color: '#8B6B5A', margin: '8px 0 0', fontSize: '0.85rem' }}>
                    Esta acción no se puede deshacer.
                  </p>
                </div>
                <footer className="producto-modal__footer">
                  <button
                    className="producto-modal__btn producto-modal__btn--cancelar"
                    onClick={() => setMostrarConfirmacionEliminar(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="producto-modal__btn producto-modal__btn--eliminar"
                    onClick={manejarConfirmarEliminar}
                  >
                    <span aria-hidden="true">🗑️</span> Eliminar
                  </button>
                </footer>
              </div>
            </div>
          )}

          {/* ===== CATEGORÍA MANAGER ===== */}
          <CategoriaManager
            abierto={categoriaManagerAbierto}
            onCerrar={() => setCategoriaManagerAbierto(false)}
            categorias={categorias}
            onCrear={crearCategoria}
            onEditar={editarCategoria}
            onEliminar={eliminarCategoria}
            onReordenar={reordenarCategorias}
            onToggleActiva={toggleCategoriaActiva}
          />
        </div>
      </main>
    </div>
  );
}