// src/components/pets/PetForm.jsx

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

const ESPECIES = ['cachorro', 'gato', 'outro']
const GENEROS  = ['macho', 'femea']
const PORTES   = ['pequeno', 'medio', 'grande']

const initialForm = {
  nome:       '',
  especie:    'cachorro',
  genero:     'macho',
  porte:      'pequeno',
  idade_anos: 0,
  descricao:  '',
  cidade:     '',
}

export default function PetForm({ onSuccess, pet }) { 
    
   const { user } = useAuth()

  const [form, setForm]       = useState(pet ? {
    nome:       pet.nome,
    especie:    pet.especie,
    genero:     pet.genero,
    porte:      pet.porte,
    idade_anos: pet.idade_anos,
    descricao:  pet.descricao  || '',
    cidade:     pet.cidade     || '',
  } : initialForm)

  const [foto, setFoto]       = useState(null)
  const [preview, setPreview] = useState(pet?.foto_url || null) 
  const [loading, setLoading] = useState(false)
  const [erro, setErro]       = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleFoto(e) {
    const file = e.target.files[0]
    if (!file) return
    setFoto(file)
    setPreview(URL.createObjectURL(file))
  }

  async function uploadFoto(petId) {
    if (!foto) return null

    const ext  = foto.name.split('.').pop().toLowerCase()
    const path = `${user.id}/${petId}.${ext}`

    // Remove variações antigas para evitar conflito de extensão
    await supabase.storage.from('pets').remove([
        `${user.id}/${petId}.jpg`,
        `${user.id}/${petId}.jpeg`,
        `${user.id}/${petId}.png`,
        `${user.id}/${petId}.webp`,
    ])

    const { error } = await supabase.storage
        .from('pets')
        .upload(path, foto, { upsert: true })

    if (error) throw new Error(error.message)

    const { data } = supabase.storage
        .from('pets')
        .getPublicUrl(path)

    return `${data.publicUrl}?t=${Date.now()}`
    }


  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErro(null)

    try {
      const payload = {
        ...form,
        idade_anos: Number(form.idade_anos),
      }

      let petId = pet?.id

      if (pet) {
       
        const { error } = await supabase
          .from('pets')
          .update(payload)
          .eq('id', pet.id)

        if (error) throw new Error(error.message)

      } else {
       
        const { data: petData, error: insertError } = await supabase
          .from('pets')
          .insert({ ...payload, owner_id: user.id })
          .select('id')
          .single()

        if (insertError) throw new Error(insertError.message)
        petId = petData.id
      }

      const fotoUrl = await uploadFoto(petId)
      if (fotoUrl) {
        await supabase
          .from('pets')
          .update({ foto_url: fotoUrl })
          .eq('id', petId)
      }

      if (!pet) {
        setForm(initialForm)
        setFoto(null)
        setPreview(null)
      }

      onSuccess?.()

    } catch (err) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Preview da foto */}
      <div>
        <label className="text-sm font-medium text-gray-700">Foto do pet</label>
        <div className="mt-1 flex items-center gap-4">
          <div className="w-24 h-24 rounded-xl bg-violet-50 flex items-center justify-center overflow-hidden border border-gray-200">
            {preview
              ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
              : <span className="text-3xl">🐾</span>
            }
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFoto}
            className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer"
          />
        </div>
      </div>

      {/* Nome */}
      <div>
        <label className="text-sm font-medium text-gray-700">Nome do pet</label>
        <input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          required
          placeholder="Ex: Rex, Mia..."
          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
      </div>

      {/* Espécie + Gênero */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700">Espécie</label>
          <select name="especie" value={form.especie} onChange={handleChange}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
            {ESPECIES.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Gênero</label>
          <select name="genero" value={form.genero} onChange={handleChange}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
            {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      {/* Porte + Idade */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700">Porte</label>
          <select name="porte" value={form.porte} onChange={handleChange}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
            {PORTES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Idade (anos)</label>
          <input name="idade_anos" type="number" min="0" max="30"
            value={form.idade_anos} onChange={handleChange}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>
      </div>

      {/* Cidade */}
      <div>
        <label className="text-sm font-medium text-gray-700">Cidade</label>
        <input name="cidade" value={form.cidade} onChange={handleChange}
          placeholder="Ex: Caxias do Sul - RS"
          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
      </div>

      {/* Descrição */}
      <div>
        <label className="text-sm font-medium text-gray-700">Descrição</label>
        <textarea name="descricao" value={form.descricao} onChange={handleChange}
          rows={3} placeholder="Conte um pouco sobre o pet..."
          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
        />
      </div>

      {erro && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{erro}</p>
      )}

      <button type="submit" disabled={loading}
        className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors">
        {loading ? 'Salvando...' : pet ? '✏️ Salvar Alterações' : '🐾 Cadastrar Pet'}
      </button>

    </form>
  )
}
