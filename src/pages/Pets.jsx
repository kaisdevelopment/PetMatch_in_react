// src/pages/Pets.jsx

import { useEffect, useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import PetForm from '@/components/pets/PetForm'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { PlusCircle, X, Pencil, Trash2 } from 'lucide-react'

export default function Pets() {
  const { user } = useAuth()
  const [pets, setPets]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [editingPet, setEditingPet] = useState(null)   
  const [deletingId, setDeletingId] = useState(null)   

  async function fetchPets() {
    setLoading(true)
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })

    if (!error) setPets(data)
    setLoading(false)
  }

  useEffect(() => { fetchPets() }, [])

  function handleEdit(pet) {
    setEditingPet(pet)
    setShowForm(false)   
  }

  async function handleDelete(pet) {
    if (!confirm(`Excluir ${pet.nome}? Esta ação não pode ser desfeita.`)) return

    setDeletingId(pet.id)
    try {

      if (pet.foto_url) {
        const path = pet.foto_url.split('/pets/')[1]  // extrai "userId/petId.ext"
        await supabase.storage.from('pets').remove([path])
      }

      // Remove o registro do banco
      await supabase.from('pets').delete().eq('id', pet.id)

      fetchPets()
    } finally {
      setDeletingId(null)
    }
  }

  const statusColor = {
    disponivel:  'bg-green-100 text-green-700',
    em_processo: 'bg-yellow-100 text-yellow-700',
    adotado:     'bg-blue-100 text-blue-700',
    apadrinhado: 'bg-violet-100 text-violet-700',
  }

  return (
    <AppLayout>
      <div className="max-w-4xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Meus Pets 🐾</h2>
            <p className="text-sm text-gray-400 mt-1">
              {pets.length} pet{pets.length !== 1 ? 's' : ''} cadastrado{pets.length !== 1 ? 's' : ''}
            </p>
          </div>

          <button
            onClick={() => { setShowForm(v => !v); setEditingPet(null) }}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            {showForm ? <X size={16} /> : <PlusCircle size={16} />}
            {showForm ? 'Cancelar' : 'Novo Pet'}
          </button>
        </div>

        {/* Form de CRIAÇÃO */}
        {showForm && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm mb-6">
            <h3 className="text-base font-semibold text-gray-700 mb-4">Cadastrar novo pet</h3>
            <PetForm onSuccess={() => { setShowForm(false); fetchPets() }} />
          </div>
        )}

        {/* Form de EDIÇÃO */}
        {editingPet && (
          <div className="bg-white border border-violet-200 rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-700">✏️ Editando: {editingPet.nome}</h3>
              <button onClick={() => setEditingPet(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <PetForm
              pet={editingPet}
              onSuccess={() => { setEditingPet(null); fetchPets() }}
            />
          </div>
        )}

        {/* Lista */}
        {loading ? (
          <p className="text-sm text-gray-400">Carregando...</p>
        ) : pets.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🐾</p>
            <p className="text-sm">Nenhum pet cadastrado ainda.</p>
            <p className="text-sm">Clique em "Novo Pet" para começar!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pets.map(pet => (
              <div key={pet.id}
                className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">

                {/* Foto */}
                <div className="w-full h-32 rounded-lg overflow-hidden mb-4 bg-violet-50 flex items-center justify-center">
                  {pet.foto_url
                    ? <img src={pet.foto_url} alt={pet.nome} className="w-full h-full object-cover" />
                    : <span className="text-4xl">
                        {pet.especie === 'cachorro' ? '🐶' : pet.especie === 'gato' ? '🐱' : '🐾'}
                      </span>
                  }
                </div>

                {/* Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">{pet.nome}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {pet.especie} · {pet.genero} · {pet.porte}
                    </p>
                    {pet.cidade && (
                      <p className="text-xs text-gray-400">📍 {pet.cidade}</p>
                    )}
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[pet.status]}`}>
                    {pet.status}
                  </span>
                </div>

                {pet.descricao && (
                  <p className="text-xs text-gray-500 mt-3 line-clamp-2">{pet.descricao}</p>
                )}

                {/* 👇 Botões Editar / Excluir */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(pet)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-violet-600 hover:bg-violet-50 py-1.5 rounded-lg transition-colors"
                  >
                    <Pencil size={13} /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(pet)}
                    disabled={deletingId === pet.id}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-red-500 hover:bg-red-50 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={13} />
                    {deletingId === pet.id ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </AppLayout>
  )
}
