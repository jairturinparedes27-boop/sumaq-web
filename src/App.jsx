// src/App.jsx
// Rutas principales de la aplicación Sumaq Ñan

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Páginas públicas
import Login from './pages/Login/Login'

// Módulos privados (requieren autenticación)
import Dashboard from './pages/Dashboard/Dashboard'
import Mesas from './pages/Mesas/Mesas'
import Pedidos from './pages/Pedidos/Pedidos'
import Cocina from './pages/Cocina/Cocina'
import Productos from './pages/Productos/Productos'
import Insumos from './pages/Insumos/Insumos'
import Trabajadores from './pages/Trabajadores/Trabajadores'
import Reportes from './pages/Reportes/Reportes'
import Usuarios from './pages/Usuarios/Usuarios'

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pública */}
        <Route path="/" element={<Login />} />

        {/* Módulos del sistema */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mesas" element={<Mesas />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/cocina" element={<Cocina />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/insumos" element={<Insumos />} />
        <Route path="/trabajadores" element={<Trabajadores />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/usuarios" element={<Usuarios />} />

        {/* Catch-all: redirigir a login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App