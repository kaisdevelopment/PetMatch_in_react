// src/pages/MapaPets.jsx

import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import AppLayout from '@/components/layout/AppLayout'
import { usePetsProximos } from '@/hooks/usePetsProximos'

// ─────────────────────────────────────────────────────────────
// Corrige o bug clássico do Leaflet com Vite (ícones quebrados)
// ─────────────────────────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// ─────────────────────────────────────────────────────────────
// Ícone customizado por espécie — estilo Airbnb pill
// ─────────────────────────────────────────────────────────────
function criarIconePet(especie) {
  const emoji = especie === 'cachorro' ? '🐶' : especie === 'gato' ? '🐱' : '🐾'
  return L.divIcon({
    className: '',
    html: `
      <div style="
        background: white;
        border: 2px solid #7c3aed;
        border-radius: 20px;
        padding: 4px 8px;
        font-size: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        white-space: nowrap;
        font-weight: bold;
        color: #7c3aed;
        display: flex;
        align-items: center;
        gap: 4px;
      ">
        ${emoji}
      </div>
    `,
    iconAnchor: [20, 20],
  })
}

// ─────────────────────────────────────────────────────────────
// Componente auxiliar — recentraliza o mapa quando coords mudam
// ─────────────────────────────────────────────────────────────
function RecenterMap({ lat, lng }) {
  const map = useMap()
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], map.getZoom())
  }, [lat, lng, map])
  return null
}

// ─────────────────────────────────────────────────────────────
// Ícone do usuário no mapa
// ─────────────────────────────────────────────────────────────
const iconeUsuario = L.divIcon({
  className: '',
  html: `
    <div style="
      background: #7c3aed;
      border: 3px solid white;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      box-shadow: 0 0 0 3px rgba(124,58,237,0.3);
    "></div>
  `,
  iconAnchor: [8, 8],
})

// ─────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────
export default function MapaPets() {
  const [coords, setCoords]         = useState(null)
  const [geoErro, setGeoErro]       = useState(false)
  const [raio, setRaio]             = useState(10000)
  const [petSelecionado, setPetSelecionado] = useState(null)

  // Pede a geolocalização ao navegador
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoErro(true)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      ()    => setGeoErro(true)
    )
  }, [])

  const { data: pets = [], isLoading, isError } = usePetsProximos({
    lat: coords?.lat ?? null,
    lng: coords?.lng ?? null,
    raioMetros: raio,
  })

  // ── Status badge ──────────────────────────────────────────
  const statusConfig = {
    disponivel:  { label: 'Disponível',  cor: 'bg-green-100 text-green-700'  },
    em_processo: { label: 'Em processo', cor: 'bg-yellow-100 text-yellow-700' },
    adotado:     { label: 'Adotado',     cor: 'bg-blue-100 text-blue-700'    },
    apadrinhado: { label: 'Apadrinhado', cor: 'bg-violet-100 text-violet-700' },
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-full gap-4">

        {/* ── Header ────────────────────────────────────────── */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Mapa de Pets 🗺️</h2>
            <p className="text-sm text-gray-400 mt-1">
              {isLoading
                ? 'Buscando pets próximos...'
                : `${pets.length} pet${pets.length !== 1 ? 's' : ''} encontrado${pets.length !== 1 ? 's' : ''} em até ${raio / 1000}km`}
            </p>
          </div>

          {/* Slider de raio */}
          <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
            <span className="text-sm text-gray-500 whitespace-nowrap">Raio:</span>
            <input
              type="range"
              min={1000}
              max={50000}
              step={1000}
              value={raio}
              onChange={(e) => setRaio(Number(e.target.value))}
              className="w-32 accent-violet-600"
            />
            <span className="text-sm font-semibold text-violet-700 w-12">
              {raio / 1000}km
            </span>
          </div>
        </div>

        {/* ── Layout mapa + sidebar ─────────────────────────── */}
        <div className="flex gap-4 flex-1 min-h-0">

          {/* Mapa */}
          <div className="flex-1 rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative">

            {/* Estado: sem geolocalização */}
            {geoErro && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <span className="text-4xl">📍</span>
                  <p className="text-gray-600 font-medium mt-2">Localização não disponível</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Permita o acesso à localização no navegador para ver pets próximos.
                  </p>
                </div>
              </div>
            )}

            {/* Estado: aguardando coords */}
            {!geoErro && !coords && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <span className="text-4xl animate-bounce">🐾</span>
                  <p className="text-sm text-gray-400 mt-2">Obtendo sua localização...</p>
                </div>
              </div>
            )}

            {/* Mapa principal */}
            {coords && (
              <MapContainer
                center={[coords.lat, coords.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Recentra o mapa quando coords mudam */}
                <RecenterMap lat={coords.lat} lng={coords.lng} />

                {/* Círculo do raio de busca */}
                <Circle
                  center={[coords.lat, coords.lng]}
                  radius={raio}
                  pathOptions={{
                    color: '#7c3aed',
                    fillColor: '#7c3aed',
                    fillOpacity: 0.05,
                    weight: 1.5,
                    dashArray: '6 4',
                  }}
                />

                {/* Marcador do usuário */}
                <Marker position={[coords.lat, coords.lng]} icon={iconeUsuario}>
                  <Popup>📍 Você está aqui</Popup>
                </Marker>

                {/* Marcadores dos pets */}
                {pets.map((pet) => (
                  pet.lat && pet.lng && (
                    <Marker
                      key={pet.id}
                      position={[pet.lat, pet.lng]}
                      icon={criarIconePet(pet.especie)}
                      eventHandlers={{
                        click: () => setPetSelecionado(pet),
                      }}
                    >
                      <Popup>
                        <div className="text-sm">
                          <strong>{pet.nome}</strong>
                          <br />
                          {pet.especie} · {pet.porte}
                          <br />
                          <span className="text-violet-600">
                            {(pet.distancia_metros / 1000).toFixed(2)}km de você
                          </span>
                        </div>
                      </Popup>
                    </Marker>
                  )
                ))}

              </MapContainer>
            )}
          </div>

          {/* ── Sidebar de resultados ─────────────────────── */}
          <div className="w-72 flex flex-col gap-2 overflow-y-auto">

            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <span className="text-3xl animate-bounce">🐾</span>
              </div>
            )}

            {isError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
                ❌ Erro ao buscar pets. Verifique a conexão.
              </div>
            )}

            {!isLoading && !isError && pets.length === 0 && coords && (
              <div className="text-center py-12 text-gray-400">
                <span className="text-4xl">🔍</span>
                <p className="text-sm mt-2">Nenhum pet encontrado</p>
                <p className="text-xs mt-1">Tente aumentar o raio de busca</p>
              </div>
            )}

            {pets.map((pet) => (
              <button
                key={pet.id}
                onClick={() => setPetSelecionado(
                  petSelecionado?.id === pet.id ? null : pet
                )}
                className={`w-full text-left bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all ${
                  petSelecionado?.id === pet.id
                    ? 'border-violet-400 ring-2 ring-violet-100'
                    : 'border-gray-100'
                }`}
              >
                {/* Foto + nome */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-violet-50 flex items-center justify-center flex-shrink-0">
                    {pet.foto_url
                      ? <img src={pet.foto_url} alt={pet.nome} className="w-full h-full object-cover" />
                      : <span className="text-2xl">
                          {pet.especie === 'cachorro' ? '🐶' : pet.especie === 'gato' ? '🐱' : '🐾'}
                        </span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{pet.nome}</p>
                    <p className="text-xs text-gray-400">{pet.especie} · {pet.porte}</p>
                  </div>
                </div>

                {/* Distância + status */}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-violet-600 font-medium">
                    📍 {(pet.distancia_metros / 1000).toFixed(1)}km
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    statusConfig[pet.status]?.cor ?? 'bg-gray-100 text-gray-600'
                  }`}>
                    {statusConfig[pet.status]?.label ?? pet.status}
                  </span>
                </div>
              </button>
            ))}

          </div>
        </div>

        {/* ── Card detalhe do pet selecionado ──────────────── */}
        {petSelecionado && (
          <div className="flex-shrink-0 bg-white border border-violet-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-violet-50 flex items-center justify-center">
                  {petSelecionado.foto_url
                    ? <img src={petSelecionado.foto_url} alt={petSelecionado.nome} className="w-full h-full object-cover" />
                    : <span className="text-3xl">
                        {petSelecionado.especie === 'cachorro' ? '🐶' : petSelecionado.especie === 'gato' ? '🐱' : '🐾'}
                      </span>
                  }
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{petSelecionado.nome}</h3>
                  <p className="text-sm text-gray-400">
                    {petSelecionado.especie} · {petSelecionado.genero} · {petSelecionado.porte} · {petSelecionado.idade_anos} ano(s)
                  </p>
                  {petSelecionado.cidade && (
                    <p className="text-xs text-gray-400 mt-0.5">📍 {petSelecionado.cidade}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setPetSelecionado(null)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>

            {petSelecionado.descricao && (
              <p className="text-sm text-gray-500 mt-3">{petSelecionado.descricao}</p>
            )}

            {/* Ações futuras */}
            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                🏠 Quero Adotar
              </button>
              <button className="flex-1 bg-violet-50 hover:bg-violet-100 text-violet-700 text-sm font-medium py-2 rounded-lg transition-colors">
                💜 Apadrinhar
              </button>
              <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium py-2 rounded-lg transition-colors">
                🐾 Passear
              </button>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  )
}
