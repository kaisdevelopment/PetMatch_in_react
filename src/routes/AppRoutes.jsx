// src/routes/AppRoutes.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '@/components/ProtectedRoute'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import Pets from '@/pages/Pets'          
import PetForm from '@/components/pets/PetForm'    
import NotFound from '@/pages/NotFound'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rota pública — qualquer um acessa */}
        <Route path="/login" element={<Login />} />

        {/* Rota privada — só acessa se estiver logado */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* 👇 Rotas de Pets — protegidas */}
        <Route
          path="/pets"
          element={
            <ProtectedRoute>
              <Pets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pets/novo"
          element={
            <ProtectedRoute>
              <PetForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pets/editar/:id"
          element={
            <ProtectedRoute>
              <PetForm />
            </ProtectedRoute>
          }
        />

        {/* Qualquer rota não mapeada → 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  )
}
