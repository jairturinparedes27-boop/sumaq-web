// src/pages/Cocina/Cocina.jsx
import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import './Cocina.css';

export default function Cocina() {
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
              <div className="modulo-placeholder__icon" aria-hidden="true">♨</div>
              <h1 className="modulo-placeholder__titulo">Módulo Cocina</h1>
              <p className="modulo-placeholder__descripcion">
                En desarrollo. Aquí se visualizarán los pedidos para preparar en cocina.
              </p>
              <ul className="modulo-placeholder__funciones">
                <li>Pantalla de comandas (KDS - Kitchen Display System)</li>
                <li>Filtrar por estación: Frío, Caliente, Barra, Postres</li>
                <li>Marcar: Pendiente → Preparando → Listo</li>
                <li>Tiempos de preparación por plato</li>
                <li>Alertas de pedidos demorados</li>
                <li>Imprimir ticket de comanda</li>
              </ul>
              <span className="modulo-placeholder__badge">Próximamente</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}