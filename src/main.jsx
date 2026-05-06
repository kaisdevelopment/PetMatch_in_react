// src/main.jsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from '@/contexts/AuthContext'
import App from './App.jsx'
import './index.css'

// AuthProvider envolve tudo → qualquer componente pode usar useAuth()
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
)
