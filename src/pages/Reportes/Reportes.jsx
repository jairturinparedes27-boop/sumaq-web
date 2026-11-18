// src/pages/Reportes/Reportes.jsx
import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import './Reportes.css';

export default function Reportes() {
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
              <div className="modulo-placeholder__icon" aria-hidden="true">▥</div>
              <h1 className="modulo-placeholder__titulo">Módulo Reportes</h1>
              <p className="modulo-placeholder__descripcion">
                En desarrollo. Análisis y métricas del restaurante.
              </p>
              <ul className="modulo-placeholder__funciones">
                <li>Ventas: diarias, semanales, mensuales, por hora</li>
                <li>Top productos más/menos vendidos</li>
                <li>Rentabilidad por plato (costo vs precio)</li>
                <li>Ocupación de mesas y rotación</li>
                <li>Desempeño de meseros (ventas, propinas)</li>
                <li>Control de mermas y costos</li>
                <li>Exportar a PDF / Excel</li>
              </ul>
              <span className="modulo-placeholder__badge">Próximamente</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}