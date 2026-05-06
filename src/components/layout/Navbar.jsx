// src/components/layout/Navbar.jsx

import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LogOut, Bell } from 'lucide-react'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  // Pega as iniciais do nome para o avatar placeholder
  // Ex: "Wiliam Castilhos" → "WC"
  const initials = user?.user_metadata?.full_name
    ?.split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?'

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between shrink-0">

      {/* Lado esquerdo — título da página atual (pode evoluir depois) */}
      <h1 className="text-sm font-medium text-gray-400">
        Bem-vindo de volta 👋
      </h1>

      {/* Lado direito — notificações + perfil */}
      <div className="flex items-center gap-3">

        {/* Botão de notificações (sem função por enquanto) */}
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <Bell size={18} />
        </button>

        {/* Avatar com iniciais */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center">
            {initials}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {user?.user_metadata?.full_name?.split(' ')[0] || 'Usuário'}
          </span>
        </div>

        {/* Botão de logout */}
        <button
          onClick={handleLogout}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Sair"
        >
          <LogOut size={18} />
        </button>

      </div>
    </header>
  )
}
