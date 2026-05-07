# 🐾 PetMatch — Rede Social para Adoção e Apadrinhamento de Animais

![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Deno](https://img.shields.io/badge/Deno-000000?style=for-the-badge&logo=deno&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostGIS](https://img.shields.io/badge/PostGIS-336791?style=for-the-badge&logo=postgresql&logoColor=white)

> Plataforma completa para adoção e apadrinhamento de animais, construída com arquitetura moderna, serverless e geolocalização em tempo real.

---

## 🧭 Visão Geral

O PetMatch conecta ONGs, adotantes e padrinhos em uma experiência fluida e segura. O projeto explora o ecossistema JavaScript moderno de ponta a ponta — do frontend reativo ao backend serverless com Edge Functions na borda, armazenamento em nuvem e buscas geoespaciais via PostGIS.

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                         │
│         React.js (Vite) + Tailwind + Shadcn/UI      │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS / REST / Realtime
┌──────────────────────▼──────────────────────────────┐
│                   SUPABASE                          │
│  ┌─────────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  PostgreSQL  │  │   Auth   │  │    Storage    │  │
│  │  + PostGIS  │  │  (JWT)   │  │  (termos/pdf) │  │
│  └─────────────┘  └──────────┘  └───────────────┘  │
│  ┌──────────────────────────────────────────────┐   │
│  │           Edge Functions (Deno)              │   │
│  │      gerar-termo · notificacoes-padrinhos    │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Funcionalidades

### 🔐 Autenticação
- Login e cadastro via Supabase Auth (JWT)
- Perfis diferenciados: Adotante, ONG e Padrinho
- Row Level Security (RLS) por tipo de usuário

### 🐶 Gestão de Pets
- Cadastro completo com upload de fotos (Supabase Storage)
- Status controlado: `disponível` · `em processo` · `adotado`

### 📋 Fluxo de Adoção
- Solicitação com aprovação pela ONG
- Geração automática do Termo de Responsabilidade via Edge Function
  - Documento gerado dinamicamente com dados do adotante e do pet
  - Upload automático para Supabase Storage com encoding UTF-8
  - URL pública acessível via CDN

### 💰 Apadrinhamento
- Modalidades: financeiro e/ou insumos
- Painel do padrinho com histórico de contribuições

### 🗺️ Mapa Interativo
- Visualização de pets por geolocalização (estilo Airbnb)
- Marcações customizadas com clustering
- Busca por proximidade usando PostGIS + ST_DWithin

### 🗓️ Agendamento de Passeios
- Calendário de visitas e passeios com confirmação

---

## 🚀 Stack Técnica

| Camada | Tecnologia | Por quê |
|--------|-----------|---------|
| Frontend | React.js + Vite | SPA performática com HMR instantâneo |
| Estilização | Tailwind CSS + Shadcn/UI | Design system acessível e consistente |
| Backend/DB | Supabase (PostgreSQL) | BaaS serverless com RLS nativo |
| Auth | Supabase Auth | JWT + políticas de segurança por linha |
| Storage | Supabase Storage | CDN para arquivos e imagens |
| Edge Functions | Deno + TypeScript | Lógica serverless executada na borda |
| Geolocalização | PostGIS | Índices espaciais e busca por proximidade |
| Cache | React Query (TanStack) | Cache inteligente com invalidação reativa |
| Mensageria | pg_cron + pg_net | Notificações assíncronas sem infraestrutura extra |

---

## 📁 Estrutura do Projeto

```
petmatch/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   │   └── supabaseClient.ts
│   └── types/
├── supabase/
│   ├── functions/
│   │   └── gerar-termo/
│   │       ├── index.ts          ← Edge Function (Deno/TypeScript)
│   │       └── deno.json
│   ├── migrations/
│   └── config.toml
├── public/
├── .env.example
├── CHANGELOG.md
└── README.md
```

---

## ⚙️ Como Rodar

**Pré-requisitos:** Node.js 18+, Supabase CLI

```bash
# 1. Clone o repositório
git clone https://github.com/kaisdevelopment/PetMatch_in_react.git
cd petmatch

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Preencha com suas chaves do Supabase:
# VITE_SUPABASE_URL=
# VITE_SUPABASE_ANON_KEY=

# 4. Rode o projeto
npm run dev
```

---

## 🧪 Testando as Edge Functions

```bash
curl -X POST https://SEU_PROJECT_REF.supabase.co/functions/v1/gerar-termo \
  -H "Authorization: Bearer SEU_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "adocao_id": "adocao-001",
    "adotante": {
      "nome": "Nome do Adotante",
      "cpf": "123.456.789-00",
      "email": "adotante@email.com"
    },
    "pet": {
      "nome": "Rex",
      "especie": "Cachorro",
      "raca": "Vira-lata"
    }
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "url_termo": "https://...supabase.co/storage/v1/object/public/termos/adocoes/termo_adocao-001_xxx.txt",
  "mensagem": "Termo de responsabilidade gerado com sucesso!"
}
```

---

## 📈 Roadmap

- [x] Setup React + Vite + Tailwind + Shadcn/UI
- [x] Integração Supabase — Auth, Database e Storage
- [x] Edge Function: geração de Termo de Responsabilidade (Deno/TypeScript)
- [ ] PostGIS: busca de pets por geolocalização com ST_DWithin
- [ ] React Query: cache e otimização de consultas do mapa
- [ ] pg_cron + pg_net: notificações assíncronas para padrinhos

---

## 👨‍💻 Autor

Desenvolvido por **Wiliam Kais**

[![GitHub](https://img.shields.io/badge/GitHub-kaisdevelopment-181717?style=flat-square&logo=github)](https://github.com/kaisdevelopment)

---

*Construído com TypeScript, boas práticas de arquitetura e muito ☕*

---

## 🗺️ Geolocalização — Mapa Interativo

### O que foi implementado

- Mapa interativo com **Leaflet + OpenStreetMap** na rota `/mapa`
- Slider de raio de busca (1km a 50km) com círculo visual em tempo real
- **Mini-mapa de seleção de ponto** no formulário de cadastro do pet
  - Usuário clica no mapa para definir a localização exata
  - Coordenadas `lat`, `lng` e `location` (PostGIS) salvas automaticamente
- Geolocalização do browser via `navigator.geolocation` para centrar o mapa

### Estrutura de dados no banco

```sql
-- Colunas adicionadas na tabela pets
lat      NUMERIC,          -- latitude
lng      NUMERIC,          -- longitude
location GEOGRAPHY(POINT)  -- ponto PostGIS para buscas espaciais
```

---

## ⚡ Edge Functions — Geração de Termos

### Arquitetura da função `gerar-termo`

```
React (hook useGerarTermo)
        │
        │ POST /functions/v1/gerar-termo
        │ Bearer: session.access_token
        ▼
Edge Function Deno/TypeScript
        │
        ├── Valida campos obrigatórios
        ├── Monta texto do Termo (UTF-8)
        ├── Upload → Storage bucket 'termos/adocoes/'
        ├── INSERT → tabela 'termos_adocao'
        └── Retorna URL pública do .txt
```

### Por que Edge Function e não lógica no frontend?

A `service_role` key do Supabase **nunca deve ser exposta no browser**.
A Edge Function roda no servidor (Deno), recebe o JWT do usuário,
valida a sessão e executa operações privilegiadas com segurança.

### Resultado em produção

```json
{
  "success": true,
  "url_termo": "https://...supabase.co/storage/v1/object/public/termos/adocoes/termo_adocao_xxx.txt",
  "mensagem": "Termo de responsabilidade gerado com sucesso!"
}
```

---

## 🪝 Hooks Implementados

| Hook | Responsabilidade |
|---|---|
| `useGerarTermo` | Chama a Edge Function e gerencia estado de loading/erro/url |

### Uso

```jsx
const { gerarTermo, loading, erro, urlTermo } = useGerarTermo()

await gerarTermo({
  adocao_id: 'adocao_001',
  adotante: { nome, cpf, email, telefone },
  pet:      { nome, especie, raca, idade },
})
```

---

## 📦 Estrutura atual do projeto

```
petmatch/
├── src/
│   ├── components/
│   │   ├── layout/        # AppLayout, Sidebar, Navbar
│   │   └── pets/          # PetForm (com mini-mapa)
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useGerarTermo.js   ← novo
│   ├── pages/
│   │   ├── Pets.jsx
│   │   ├── Mapa.jsx
│   │   └── TesteTermo.jsx     ← novo
│   └── lib/
│       └── supabase.js
├── supabase/
│   └── functions/
│       └── gerar-termo/
│           └── index.ts       ← Edge Function Deno
└── README.md
```

---

## 🔐 Segurança implementada

| Camada | Mecanismo | Proteção |
|---|---|---|
| Banco | Row Level Security (RLS) | Cada usuário acessa só seus dados |
| Storage | Policies por bucket | Escrita apenas via service_role |
| Edge Function | JWT validation | service_role nunca exposta no frontend |
| Auth | Supabase Auth + JWT | Sessões seguras com refresh token |

---

## 📈 Roadmap atualizado

- [x] Setup React + Vite + Tailwind + Shadcn/UI
- [x] Supabase Auth + RLS + Storage
- [x] CRUD de Pets com upload de fotos
- [x] Mini-mapa de seleção de localização no cadastro
- [x] Mapa interativo com raio de busca dinâmico
- [x] Edge Function: geração de Termo de Responsabilidade (Deno/TS)
- [x] Hook `useGerarTermo` integrado ao React
- [ ] PostGIS: `ST_DWithin` + índice GIST para busca por proximidade
- [ ] React Query: cache e otimização das consultas do mapa
- [ ] pg_cron + pg_net: notificações assíncronas para padrinhos
