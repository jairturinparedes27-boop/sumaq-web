
import './Header.css'

function Header({ onAbrirMenu }) {
  return (
    <header className="header">

      <div className="header-left">

        <button
          className="header-menu-button"
          type="button"
          onClick={onAbrirMenu}
          aria-label="Abrir menú"
        >
          ☰
        </button>

        <span>Panel principal</span>

      </div>

      <div className="header-right">

        <button
          className="header-notification"
          type="button"
          aria-label="Notificaciones"
        >
          🔔
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
