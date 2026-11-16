
import { useState } from 'react'

import Sidebar from '../../components/Sidebar/Sidebar'
import Header from '../../components/Header/Header'

import './Dashboard.css'

function Dashboard() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  const estadisticas = [
    {
      id: 1,
      titulo: 'Ventas del día',
      valor: 'S/ 1,250.00',
      detalle: 'Ingresos registrados',
      icono: '💰'
    },
    {
      id: 2,
      titulo: 'Pedidos',
      valor: '28',
      detalle: 'Pedidos del día',
      icono: '🛒'
    },
    {
      id: 3,
      titulo: 'Mesas ocupadas',
      valor: '8 / 15',
      detalle: 'Mesas actualmente en uso',
      icono: '🪑'
    },
    {
      id: 4,
      titulo: 'Productos',
      valor: '45',
      detalle: 'Productos registrados',
      icono: '🍽️'
    }
  ]

  const mesas = [
    { id: 1, nombre: 'Mesa 01', estado: 'Ocupada' },
    { id: 2, nombre: 'Mesa 02', estado: 'Disponible' },
    { id: 3, nombre: 'Mesa 03', estado: 'Ocupada' },
    { id: 4, nombre: 'Mesa 04', estado: 'Disponible' },
    { id: 5, nombre: 'Mesa 05', estado: 'Ocupada' },
    { id: 6, nombre: 'Mesa 06', estado: 'Disponible' }
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

          {/* BIENVENIDA */}

          <section className="dashboard-welcome">
            <div>
              <span className="dashboard-subtitle">
                PANEL DE ADMINISTRACIÓN
              </span>

              <h1>Resumen general</h1>

              <p>
                Bienvenido al panel de administración de Sumaq Ñan.
              </p>
            </div>

            <div className="dashboard-date">
              <span>Estado del sistema</span>
              <strong>
                <i></i> Sistema activo
              </strong>
            </div>
          </section>

          {/* ESTADÍSTICAS */}

          <section className="dashboard-stats">

            {estadisticas.map((item) => (
              <article className="stat-card" key={item.id}>

                <div className="stat-card-top">
                  <span className="stat-title">
                    {item.titulo}
                  </span>

                  <div className="stat-icon">
                    {item.icono}
                  </div>
                </div>

                <h2>{item.valor}</h2>

                <p>{item.detalle}</p>

              </article>
            ))}

          </section>

          {/* PANELES INFERIORES */}

          <section className="dashboard-bottom">

            <article className="dashboard-panel activity-panel">

              <div className="panel-heading">
                <div>
                  <h3>Actividad reciente</h3>
                  <p>Últimos movimientos del restaurante</p>
                </div>

                <span className="panel-heading-icon">↗</span>
              </div>

              <div className="activity-list">

                <div className="activity-item">
                  <div className="activity-icon">🛒</div>
                  <div className="activity-info">
                    <strong>Nuevo pedido registrado</strong>
                    <span>Pedido de Mesa 01</span>
                  </div>
                  <span className="activity-time">10:30 AM</span>
                </div>

                <div className="activity-item">
                  <div className="activity-icon">💰</div>
                  <div className="activity-info">
                    <strong>Venta registrada</strong>
                    <span>Pago recibido correctamente</span>
                  </div>
                  <span className="activity-time">10:15 AM</span>
                </div>

                <div className="activity-item">
                  <div className="activity-icon">🍽️</div>
                  <div className="activity-info">
                    <strong>Producto actualizado</strong>
                    <span>Se actualizó el menú</span>
                  </div>
                  <span className="activity-time">09:45 AM</span>
                </div>

              </div>

            </article>

            <article className="dashboard-panel tables-panel">

              <div className="panel-heading">
                <div>
                  <h3>Estado de mesas</h3>
                  <p>Disponibilidad del restaurante</p>
                </div>
              </div>

              <div className="table-summary">
                <div>
                  <span className="table-dot occupied"></span>
                  Ocupadas
                </div>

                <div>
                  <span className="table-dot available"></span>
                  Disponibles
                </div>
              </div>

              <div className="tables-grid">

                {mesas.map((mesa) => (
                  <div
                    className={`table-item ${
                      mesa.estado === 'Ocupada'
                        ? 'table-occupied'
                        : 'table-available'
                    }`}
                    key={mesa.id}
                  >
                    <span>{mesa.nombre}</span>
                    <strong>{mesa.estado}</strong>
                  </div>
                ))}

              </div>

            </article>

          </section>

        </div>

      </main>

    </div>
  )
}

export default Dashboard
