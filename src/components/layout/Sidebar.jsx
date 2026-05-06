// src/components/layout/Sidebar.jsx

import { NavLink } from 'react-router-dom'
import {
  Home,
  PawPrint,
  Heart,
  Map,
  Calendar,
  Settings
} from 'lucide-react'

// ─────────────────────────────────────────────
// Cada item do menu tem:
//  - icon  → componente do lucide-react
//  - label → texto exibido
//  - to    → rota de destino
// ─────────────────────────────────────────────
const menuItems = [
  { icon: Home,      label: 'Início',       to: '/'          },
  { icon: PawPrint,  label: 'Pets',         to: '/pets'      },
  { icon: Heart,     label: 'Adoções',      to: '/adocoes'   },
  { icon: Map,       label: 'Mapa',         to: '/mapa'      },
  { icon: Calendar,  label: 'Passeios',     to: '/passeios'  },
  { icon: Settings,  label: 'Configurações',to: '/settings'  },
]

export default function Sidebar() {
  return (
    <aside className="w-60 bg-white border-r border-gray-100 flex flex-col py-6 px-3 shrink-0">

      {/* Logo */}
      <div className="flex items-center gap-2 px-3 mb-8">
        <span className="text-2xl">🐾</span>
        <span className="font-bold text-gray-800 text-lg">PetMatch</span>
      </div>

      {/* Menu de navegação */}
      <nav className="flex flex-col gap-1 flex-1">
        {menuItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            // ✅ CORRETO — comentário dentro de {} separado
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-violet-50 text-violet-700'   // estilo ativo
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800' // estilo inativo
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Versão no rodapé da sidebar */}
      <p className="text-xs text-gray-300 px-3">v0.1.0 · PetMatch</p>

    </aside>
  )
}
