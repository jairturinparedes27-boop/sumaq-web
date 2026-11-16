
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

      {/* PANEL IZQUIERDO: SOLO FOTOGRAFÍA */}
      <section className="login-brand">
      </section>

      {/* PANEL DERECHO: FORMULARIO */}
      <section className="login-form-section">

        <div className="login-form-container">

          {/* LOGOTIPO DE SUMAQ ÑAN */}
          <div className="login-brand-logo">

            <img
              src="/icons/icon-512.png"
              alt="Logotipo de Sumaq Ñan"
            />


          </div>

          {/* ENCABEZADO */}
          <div className="login-heading">

            <span className="welcome-label">
              BIENVENIDO DE NUEVO
            </span>

            <h2>Iniciar sesión</h2>

          </div>

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit}>

            {/* USUARIO */}
            <div className="form-group">

              <label htmlFor="usuario">
                Usuario
              </label>

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

            {/* CONTRASEÑA */}
            <div className="form-group">

              <label htmlFor="password">
                Contraseña
              </label>

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
                  aria-label={
                    mostrarPassword
                      ? 'Ocultar contraseña'
                      : 'Mostrar contraseña'
                  }
                >
                  {mostrarPassword ? 'Ocultar' : 'Mostrar'}
                </button>

              </div>

            </div>

            {/* BOTÓN INGRESAR */}
            <button
              type="submit"
              className="login-button"
            >
              Ingresar al sistema
              <span>→</span>
            </button>

          </form>

          {/* PIE DEL FORMULARIO */}
          <div className="login-bottom">

            <p>
              © 2026 · Sistema de gestión
            </p>

          </div>

        </div>

      </section>

    </main>
  )
}

export default Login
