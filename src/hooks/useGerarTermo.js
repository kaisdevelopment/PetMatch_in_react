// src/hooks/useGerarTermo.js

import { supabase } from '@/lib/supabase'
import { useState } from 'react'

export function useGerarTermo() {
  const [loading, setLoading]   = useState(false)
  const [erro, setErro]         = useState(null)
  const [urlTermo, setUrlTermo] = useState(null)

  async function gerarTermo({ adocao_id, adotante, pet }) {
    setLoading(true)
    setErro(null)
    setUrlTermo(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gerar-termo`,
        {
          method: 'POST',
          headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey':        import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ adocao_id, adotante, pet }),
        }
      )

      const json = await response.json()
      if (!response.ok) throw new Error(json.error || 'Erro ao gerar termo')

      setUrlTermo(json.url_termo)
      return json.url_termo

    } catch (err) {
      setErro(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { gerarTermo, loading, erro, urlTermo }
}
