// src/components/layout/AppLayout.jsx

import Sidebar from './Sidebar'
import Navbar from './Navbar'

// ─────────────────────────────────────────────
// AppLayout é o "molde" de toda página autenticada
// Qualquer página dentro do ProtectedRoute usa isso
//
// Estrutura visual:
// ┌─────────┬────────────────────────┐
// │         │       Navbar           │
// │ Sidebar ├────────────────────────┤
// │         │                        │
// │         │     {children}         │
// │         │   (conteúdo da página) │
// └─────────┴────────────────────────┘
// ─────────────────────────────────────────────
export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Coluna esquerda — fixa, não scrolla */}
      <Sidebar />

      {/* Coluna direita — ocupa o resto da tela */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Barra superior */}
        <Navbar />

        {/* Área de conteúdo — só essa parte scrolla */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>
    </div>
  )
}
