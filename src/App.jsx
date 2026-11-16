import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login/Login'
import Sidebar from './components/Sidebar/Sidebar'
import Header from './components/Header/Header'

import './App.css'

function Dashboard() {
  return (
    <div className="dashboard-layout">

    <Sidebar />

    <main className="dashboard-content">

      <Header />

      <section className="dashboard-body">
        <h1>Bienvenido a Sumaq Ñan</h1>

        <p>
          Panel principal del sistema de restaurante.
        </p>
      </section>

    </main>

    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
