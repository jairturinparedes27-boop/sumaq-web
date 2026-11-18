// src/pages/Productos/Productos.jsx
import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import './Productos.css';

export default function Productos() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="modulo-layout">
      <Sidebar
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
      />

      <main className="modulo-content">
        <Header onAbrirMenu={() => setMenuAbierto(true)} />

        <div className="modulo-page modulo-page--centered">
          <div className="modulo-placeholder">
            <div className="modulo-placeholder__card">
              <div className="modulo-placeholder__icon" aria-hidden="true">▣</div>
              <h1 className="modulo-placeholder__titulo">Módulo Productos</h1>
              <p className="modulo-placeholder__descripcion">
                En desarrollo. Gestión de la carta del restaurante.
              </p>
              <ul className="modulo-placeholder__funciones">
                <li>CRUD productos: platos, bebidas, postres</li>
                <li>Categorías: Entradas, Principales, Postres, Bebidas...</li>
                <li>Precios, impuestos, márgenes</li>
                <li>Fotos, descripciones, alérgenos</li>
                <li>Control de stock por producto</li>
                <li>Productos compuestos (recetas)</li>
              </ul>
              <span className="modulo-placeholder__badge">Próximamente</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}