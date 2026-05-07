// src/components/pets/PetForm.jsx

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

// Fix ícone padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Componente interno que captura clique no mapa
function LocationPicker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

export default function PetForm({ pet = null, onSuccess }) {
  const { user } = useAuth()
  const isEditing = !!pet

  const [form, setForm] = useState({
    nome:        pet?.nome        || '',
    especie:     pet?.especie     || 'cachorro',
    genero:      pet?.genero      || 'macho',
    porte:       pet?.porte       || 'pequeno',
    idade_anos:  pet?.idade_anos  || '',
    cidade:      pet?.cidade      || '',
    descricao:   pet?.descricao   || '',
  })

  const [coords, setCoords]       = useState(
    pet?.lat && pet?.lng ? { lat: pet.lat, lng: pet.lng } : null
  )
  const [mapCenter, setMapCenter] = useState([-29.168, -51.179]) // Caxias do Sul
  const [fotoFile, setFotoFile]   = useState(null)
  const [preview, setPreview]     = useState(pet?.foto_url || null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  // Se tem coordenadas do pet, centraliza no ponto dele
  useEffect(() => {
    if (pet?.lat && pet?.lng) {
      setMapCenter([pet.lat, pet.lng])
    } else {
      // Tenta usar geolocalização do browser
      navigator.geolocation?.getCurrentPosition(
        (pos) => setMapCenter([pos.coords.latitude, pos.coords.longitude]),
        () => {} // silencia erro, mantém Caxias
      )
    }
  }, [])

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleFoto(e) {
    const file = e.target.files[0]
    if (!file) return
    setFotoFile(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let foto_url = pet?.foto_url || null

      // Upload de foto
      if (fotoFile) {
        const ext  = fotoFile.name.split('.').pop()
        const path = `${user.id}/${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('pets').upload(path, fotoFile, { upsert: true })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage.from('pets').getPublicUrl(path)
        foto_url = urlData.publicUrl
      }

      const payload = {
        ...form,
        idade_anos: form.idade_anos ? Number(form.idade_anos) : null,
        foto_url,
        owner_id: user.id,
        // Coordenadas
        lat:      coords?.lat ?? null,
        lng:      coords?.lng ?? null,
        // PostGIS point (para buscas espaciais futuras)
        location: coords
          ? `POINT(${coords.lng} ${coords.lat})`
          : null,
      }

      if (isEditing) {
        const { error } = await supabase.from('pets').update(payload).eq('id', pet.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('pets').insert(payload)
        if (error) throw error
      }

      onSuccess?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Foto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Foto do pet</label>
        {preview && (
          <img src={preview} alt="preview"
            className="w-24 h-24 object-cover rounded-lg mb-2 border border-gray-200" />
        )}
        <input type="file" accept="image/*" onChange={handleFoto}
          className="text-sm text-gray-500" />
      </div>

      {/* Nome */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do pet</label>
        <input name="nome" value={form.nome} onChange={handleChange} required
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
      </div>

      {/* Espécie + Gênero */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Espécie</label>
          <select name="especie" value={form.especie} onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
            <option value="cachorro">cachorro</option>
            <option value="gato">gato</option>
            <option value="outro">outro</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
          <select name="genero" value={form.genero} onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
            <option value="macho">macho</option>
            <option value="femea">femea</option>
          </select>
        </div>
      </div>

      {/* Porte + Idade */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Porte</label>
          <select name="porte" value={form.porte} onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
            <option value="pequeno">pequeno</option>
            <option value="medio">medio</option>
            <option value="grande">grande</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Idade (anos)</label>
          <input name="idade_anos" type="number" min="0" value={form.idade_anos} onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
        </div>
      </div>

      {/* Cidade */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
        <input name="cidade" value={form.cidade} onChange={handleChange}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea name="descricao" rows={3} value={form.descricao} onChange={handleChange}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
      </div>

      {/* 📍 Mini-mapa de localização */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          📍 Localização do pet
          <span className="text-xs text-gray-400 ml-2 font-normal">
            {coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : 'Clique no mapa para marcar'}
          </span>
        </label>

        <div className="rounded-xl overflow-hidden border border-gray-200 h-52">
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            key={mapCenter.toString()}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap"
            />
            <LocationPicker onSelect={setCoords} />
            {coords && <Marker position={[coords.lat, coords.lng]} />}
          </MapContainer>
        </div>

        {coords && (
          <button type="button" onClick={() => setCoords(null)}
            className="text-xs text-red-400 hover:text-red-600 mt-1">
            ✕ Remover localização
          </button>
        )}
      </div>
    {error && <p className="text-sm text-red-500">{error}</p>}

        <button type="submit" disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50">
            {loading ? 'Salvando...' : isEditing ? '✏️ Salvar Alterações' : '🐾 Cadastrar Pet'}
        </button>

        </form>
    )
    }
