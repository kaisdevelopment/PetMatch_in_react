// src/components/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

// ─────────────────────────────────────────────
// Este componente funciona como um "porteiro":
//
//  - Ainda carregando?     → mostra spinner (evita flash de redirect)
//  - Usuário logado?       → libera a passagem (renderiza a página)
//  - Usuário NÃO logado?   → redireciona para /login
// ─────────────────────────────────────────────
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  // Enquanto o Supabase verifica a sessão salva no localStorage,
  // não fazemos nada — evita redirecionar indevidamente
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <span className="text-4xl animate-bounce">🐾</span>
          <p className="text-gray-400 mt-3 text-sm">Verificando sessão...</p>
        </div>
      </div>
    )
  }

  // Se não há usuário após verificar → redireciona para login
  // "replace" evita que o /login entre no histórico de navegação
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Tudo certo → renderiza a página normalmente
  return children
}
