// src/pages/Insumos/Insumos.jsx
import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import './Insumos.css';

export default function Insumos() {
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
              <div className="modulo-placeholder__icon" aria-hidden="true">▧</div>
              <h1 className="modulo-placeholder__titulo">Módulo Insumos</h1>
              <p className="modulo-placeholder__descripcion">
                En desarrollo. Control de inventario y materias primas.
              </p>
              <ul className="modulo-placeholder__funciones">
                <li>CRUD insumos: materia prima, bebidas, limpieza...</li>
                <li>Unidades de medida: kg, g, L, ml, unidades</li>
                <li>Stock mínimo, máximo, punto de pedido</li>
                <li>Entradas: compras, recepciones, ajustes</li>
                <li>Salidas: consumo, merma, transferencias</li>
                <li>Kardex y valorización de inventario</li>
                <li>Proveedores y órdenes de compra</li>
              </ul>
              <span className="modulo-placeholder__badge">Próximamente</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}