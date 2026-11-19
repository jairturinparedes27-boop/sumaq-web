
import { useNavigate, useLocation } from 'react-router-dom'
import './Sidebar.css'

function Sidebar({ abierto, onCerrar }) {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '▦', to: '/dashboard' },
    { id: 'mesas', label: 'Mesas', icon: '▤', to: '/mesas' },
    { id: 'pedidos', label: 'Pedidos', icon: '🛒', to: '/pedidos' },
    { id: 'cocina', label: 'Cocina', icon: '♨', to: '/cocina' },
    { id: 'productos', label: 'Productos', icon: '▣', to: '/productos' },
    { id: 'insumos', label: 'Insumos', icon: '▧', to: '/insumos' },
    { id: 'trabajadores', label: 'Trabajadores', icon: '♙', to: '/trabajadores' },
    { id: 'reportes', label: 'Reportes', icon: '▥', to: '/reportes' },
    { id: 'usuarios', label: 'Usuarios', icon: '👥', to: '/usuarios' }
  ]

  const manejarClick = (item) => {
    if (item.to) {
      navigate(item.to)
    }
    onCerrar()
  }

  return (
    <>
      <div
        className={`sidebar-overlay ${abierto ? 'overlay-visible' : ''}`}
        onClick={onCerrar}
        aria-hidden="true"
      />

      <aside className={`sidebar ${abierto ? 'sidebar-open' : ''}`}>

        {/* LOGOTIPO */}
        <div className="sidebar-brand">
          <img
            src="/icons/icon-192.png"
            alt="Logo Sumaq Ñan"
          />

          <div className="sidebar-brand-text">
            <h2>SUMAQ ÑAN</h2>
            <span>RESTAURANTE</span>
          </div>
        </div>

        {/* MENÚ */}
        <nav className="sidebar-navigation">
          <span className="sidebar-section-title">
            MENÚ PRINCIPAL
          </span>

          {menuItems.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <button
                key={item.id}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                type="button"
                onClick={() => manejarClick(item)}
                disabled={!item.to} // Deshabilitar los que no tienen ruta aún
              >
                <span className="sidebar-icon">
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* PIE DEL MENÚ */}
        <div className="sidebar-footer">
          <button
            className="sidebar-logout"
            type="button"
          >
            <span>↪</span>
            Cerrar sesión
          </button>
        </div>

      </aside>
    </>
  )
}

export default Sidebar
