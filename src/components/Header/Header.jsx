// src/components/Header/Header.jsx
// Header superior con nombre del módulo actual, notificaciones y perfil

import { useLocation } from 'react-router-dom'
import './Header.css'

// Mapeo de rutas a nombres de módulos
const MODULOS = {
  '/dashboard': { nombre: 'Dashboard', icono: '▦' },
  '/mesas': { nombre: 'Mesas', icono: '▤' },
  '/pedidos': { nombre: 'Pedidos', icono: '🛒' },
  '/cocina': { nombre: 'Cocina', icono: '♨' },
  '/productos': { nombre: 'Productos', icono: '▣' },
  '/insumos': { nombre: 'Insumos', icono: '▧' },
  '/trabajadores': { nombre: 'Trabajadores', icono: '♙' },
  '/reportes': { nombre: 'Reportes', icono: '▥' }
}

function Header({ onAbrirMenu }) {
  const location = useLocation()
  const moduloActual = MODULOS[location.pathname] || { nombre: 'Sumaq Ñan', icono: '▦' }

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="header-menu-button"
          type="button"
          onClick={onAbrirMenu}
          aria-label="Abrir menú"
          aria-expanded="false"
        >
          <span aria-hidden="true">☰</span>
        </button>

        <div className="header-modulo">
          <span className="header-modulo-icon" aria-hidden="true">{moduloActual.icono}</span>
          <span className="header-modulo-nombre">{moduloActual.nombre}</span>
        </div>
      </div>

      <div className="header-right">
        <button
          className="header-notification"
          type="button"
          aria-label="Notificaciones"
        >
          <span aria-hidden="true">🔔</span>
          <span className="notification-badge"></span>
        </button>

        <div className="header-profile">
          <div className="header-avatar">A</div>

          <div className="header-profile-info">
            <strong>Administrador</strong>
            <span>Administrador general</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header