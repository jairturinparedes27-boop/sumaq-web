import { useState } from 'react'

import './Sidebar.css'

function Sidebar({ abierto, onCerrar }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '▦' },
    { id: 'mesas', label: 'Mesas', icon: '▤' },
    { id: 'pedidos', label: 'Pedidos', icon: '🛒' },
    { id: 'cocina', label: 'Cocina', icon: '♨' },
    { id: 'productos', label: 'Productos', icon: '▣' },
    { id: 'insumos', label: 'Insumos', icon: '▧' },
    { id: 'trabajadores', label: 'Trabajadores', icon: '♙' },
    { id: 'reportes', label: 'Reportes', icon: '▥' }
  ]

  return (
    <>
      {abierto && (
        <div
          className="sidebar-overlay"
          onClick={onCerrar}
        />
      )}

      <aside className={`sidebar ${abierto ? 'sidebar-open' : ''}`}>

        <div className="sidebar-brand">
          <img src="/icons/icon-192.png" alt="Logo Sumaq Ñan" />

          <div className="sidebar-brand-text">
            <h2>SUMAQ ÑAN</h2>
            <span>RESTAURANTE</span>
          </div>
        </div>

        <nav className="sidebar-navigation">
          <span className="sidebar-section-title">
            MENÚ PRINCIPAL
          </span>

          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-link ${
                item.id === 'dashboard' ? 'active' : ''
              }`}
              type="button"
              onClick={onCerrar}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

      </aside>
    </>
  )
}

export default Sidebar

