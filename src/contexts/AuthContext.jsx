// src/contexts/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// ─────────────────────────────────────────────
// 1. Criamos o "recipiente" do contexto
//    É como criar uma variável global, mas do jeito React
// ─────────────────────────────────────────────
const AuthContext = createContext(null)

// ─────────────────────────────────────────────
// 2. O Provider é o componente que VAI ENVOLVER
//    toda a aplicação e disponibilizar os dados
// ─────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)      // usuário logado ou null
  const [loading, setLoading] = useState(true) // ainda verificando sessão?

  useEffect(() => {
    // ── Ao carregar o app, verifica se já existe sessão salva ──
    // O Supabase salva o token JWT no localStorage automaticamente
    // Então quando o usuário recarrega a página, ele continua logado
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // ── Listener: fica "escutando" mudanças de autenticação ──
    // Dispara quando: login, logout, token renovado, etc.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    // ── Cleanup: remove o listener quando o componente desmonta ──
    // Evita memory leak
    return () => subscription.unsubscribe()
  }, [])

  // ── O que vamos disponibilizar para todos os componentes ──
  const value = {
    user,      // objeto do usuário (id, email, metadata...) ou null
    loading,   // boolean: true enquanto verifica a sessão inicial
    signOut: () => supabase.auth.signOut(), // função de logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ─────────────────────────────────────────────
// 3. Hook customizado para consumir o contexto
//    Uso: const { user, loading, signOut } = useAuth()
// ─────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext)

  // Proteção: garante que useAuth só seja usado dentro do AuthProvider
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  }

  return context
}
