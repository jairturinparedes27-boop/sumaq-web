// src/pages/Trabajadores/Trabajadores.jsx
import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import './Trabajadores.css';

export default function Trabajadores() {
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
              <div className="modulo-placeholder__icon" aria-hidden="true">♙</div>
              <h1 className="modulo-placeholder__titulo">Módulo Trabajadores</h1>
              <p className="modulo-placeholder__descripcion">
                En desarrollo. Gestión del personal del restaurante.
              </p>
              <ul className="modulo-placeholder__funciones">
                <li>CRUD empleados: meseros, cocineros, admin, caja...</li>
                <li>Roles y permisos por módulo</li>
                <li>Horarios, turnos, asistencia</li>
                <li>Comisiones por ventas</li>
                <li>Evaluaciones y capacitaciones</li>
                <li>Contratos y documentación</li>
              </ul>
              <span className="modulo-placeholder__badge">Próximamente</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}