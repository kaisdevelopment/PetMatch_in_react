// src/pages/TesteTermo.jsx

import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { useGerarTermo } from '@/hooks/useGerarTermo'
import { useAuth } from '@/contexts/AuthContext'

export default function TesteTermo() {
  const { user } = useAuth()
  const { gerarTermo, loading, erro, urlTermo } = useGerarTermo()

  const [resultado, setResultado] = useState(null)

  async function handleTestar() {
    const url = await gerarTermo({
      adocao_id: `adocao_${Date.now()}`,
      adotante: {
        nome:     user?.user_metadata?.name || 'Wiliam Teste',
        cpf:      '123.456.789-00',
        email:    user?.email || 'wiliam@teste.com',
        telefone: '(54) 99999-0000',
      },
      pet: {
        nome:    'Mel',
        especie: 'Cachorro',
        raca:    'Vira-lata',
        idade:   '5 anos',
      },
    })

    if (url) setResultado(url)
  }

  return (
    <AppLayout>
      <div className="max-w-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🧪 Teste — Edge Function
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Chama a função <code className="bg-gray-100 px-1 rounded">gerar-termo</code> via React e exibe o resultado.
        </p>

        <button
          onClick={handleTestar}
          disabled={loading}
          className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? '⏳ Gerando termo...' : '📄 Gerar Termo de Teste'}
        </button>

        {/* Erro */}
        {erro && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600 font-medium">❌ Erro:</p>
            <p className="text-sm text-red-500 mt-1">{erro}</p>
          </div>
        )}

        {/* Sucesso */}
        {resultado && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
            <p className="text-sm text-green-700 font-medium">
              ✅ Termo gerado com sucesso!
            </p>
            <p className="text-xs text-gray-500 break-all">{resultado}</p>
            <a
              href={resultado}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-violet-600 underline hover:text-violet-800"
            >
              📎 Abrir termo no navegador
            </a>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
