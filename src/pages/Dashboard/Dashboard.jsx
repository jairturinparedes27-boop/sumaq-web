
import { useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Header from '../../components/Header/Header'
import './Dashboard.css'

function Dashboard() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  const estadisticas = [
    { id: 1, titulo: 'Ventas del día', valor: 'S/ 1,250.00', detalle: 'Ingresos registrados' },
    { id: 2, titulo: 'Pedidos', valor: '28', detalle: 'Pedidos del día' },
    { id: 3, titulo: 'Mesas ocupadas', valor: '8 / 15', detalle: 'Mesas en uso' },
    { id: 4, titulo: 'Productos', valor: '45', detalle: 'Productos registrados' }
  ]

  return (
    <div className="dashboard-layout">

      <Sidebar
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
      />

      <main className="dashboard-content">

        <Header
          onAbrirMenu={() => setMenuAbierto(true)}
        />

        <div className="dashboard-page">

          <div className="dashboard-welcome">
            <h1>Resumen general</h1>
            <p>Bienvenido al panel de administración de Sumaq Ñan.</p>
          </div>

          <section className="dashboard-stats">
            {estadisticas.map((item) => (
              <article className="stat-card" key={item.id}>
                <span className="stat-title">{item.titulo}</span>
                <h2>{item.valor}</h2>
                <p>{item.detalle}</p>
              </article>
            ))}
          </section>

          <section className="dashboard-bottom">

            <div className="dashboard-panel">
              <h3>Actividad reciente</h3>
              <p>Aquí mostraremos los últimos pedidos.</p>
            </div>

            <div className="dashboard-panel">
              <h3>Estado de mesas</h3>
              <p>Aquí mostraremos las mesas disponibles y ocupadas.</p>
            </div>

          </section>

        </div>

      </main>

    </div>
  )
}

export default Dashboard
