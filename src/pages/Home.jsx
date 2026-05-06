// src/pages/Home.jsx

import AppLayout from '@/components/layout/AppLayout'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <AppLayout>
      <div className="max-w-2xl">

        <h2 className="text-2xl font-bold text-gray-800">
          Olá, {user?.user_metadata?.full_name?.split(' ')[0]}! 🐾
        </h2>
        <p className="text-gray-400 mt-1 text-sm">
          Aqui está um resumo da sua atividade.
        </p>

        {/* Cards de resumo — placeholder por enquanto */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { label: 'Pets cadastrados', value: '0', emoji: '🐶' },
            { label: 'Adoções realizadas', value: '0', emoji: '🏠' },
            { label: 'Apadrinhamentos', value: '0', emoji: '💜' },
          ].map(card => (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
            >
              <span className="text-2xl">{card.emoji}</span>
              <p className="text-2xl font-bold text-gray-800 mt-2">{card.value}</p>
              <p className="text-xs text-gray-400 mt-1">{card.label}</p>
            </div>
          ))}
        </div>

      </div>
    </AppLayout>
  )
}
