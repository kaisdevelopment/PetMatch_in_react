// src/hooks/usePetsProximos.ts

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

// ============================================================
// Tipagem do retorno da RPC pets_proximos()
// ============================================================
export interface PetProximo {
  id: string
  nome: string
  especie: string
  genero: string
  porte: string
  idade_anos: number
  descricao: string | null
  status: string
  foto_url: string | null
  cidade: string | null
  lat: number
  lng: number
  distancia_metros: number
}

interface UsePetsProximosParams {
  lat: number | null
  lng: number | null
  raioMetros?: number
  enabled?: boolean
}

// ============================================================
// Hook: usePetsProximos
// ============================================================
export function usePetsProximos({
  lat,
  lng,
  raioMetros = 10000,
  enabled = true,
}: UsePetsProximosParams) {
  return useQuery<PetProximo[]>({
    queryKey: ['pets-proximos', lat, lng, raioMetros],

    queryFn: async () => {
      if (!lat || !lng) return []

      const { data, error } = await supabase.rpc('pets_proximos', {
        user_lat: lat,
        user_lng: lng,
        raio_metros: raioMetros,
      })

      if (error) throw new Error(error.message)

      return data as PetProximo[]
    },

    enabled: enabled && !!lat && !!lng,
    staleTime: 1000 * 60 * 5,    // 5min — dado considerado fresco
    gcTime: 1000 * 60 * 10,      // 10min — permanece no cache
    refetchOnWindowFocus: false,  // mapa não precisa refetch ao focar
  })
}
