
import { useState } from 'react'
import './Login.css'

function Login() {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    // FUTURO BACKEND:
    // Aquí conectaremos el formulario con Spring Boot.
    // Se enviarán el usuario y la contraseña a la API.
    // Después recibiremos el token y los datos del trabajador.

    alert('El diseño está listo. Falta conectar el backend.')
  }

  return (
    <main className="login-page">

      {/* PANEL IZQUIERDO */}
      <section className="login-brand">

        <div className="brand-content">

          <div className="brand-logo">
            <span className="logo-symbol">S</span>
            <span>SUMAQ ÑAN</span>
          </div>

          <div className="brand-message">
            <span className="brand-subtitle">
              SABOR · TRADICIÓN · CALIDAD
            </span>

            <h1>
              Una experiencia
              <br />
              que comienza
              <br />
              <span>en cada detalle.</span>
            </h1>

            <p>
              Gestiona tu restaurante de manera sencilla,
              organizada y eficiente.
            </p>
          </div>

          <div className="brand-footer">
            SISTEMA DE GESTIÓN RESTAURANTE
          </div>

        </div>

      </section>

      {/* PANEL DERECHO */}
      <section className="login-form-section">

        <div className="login-form-container">

          <div className="mobile-brand">
            <span className="logo-symbol">S</span>
            <span>SUMAQ ÑAN</span>
          </div>

          <div className="login-heading">
            <span className="welcome-label">
              BIENVENIDO DE NUEVO
            </span>

            <h2>Iniciar sesión</h2>

            <p>
              Ingresa tus credenciales para acceder al sistema.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="usuario">Usuario</label>

              <input
                id="usuario"
                type="text"
                placeholder="Ingresa tu usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>

              <div className="password-container">
                <input
                  id="password"
                  type={mostrarPassword ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {mostrarPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            <button type="submit" className="login-button">
              Ingresar al sistema
              <span>→</span>
            </button>

          </form>

          <div className="login-bottom">
            <span>SUMAQ ÑAN</span>
            <p>© 2026 · Sistema de gestión de restaurante</p>
          </div>

        </div>

      </section>

    </main>
  )
}

export default Login
