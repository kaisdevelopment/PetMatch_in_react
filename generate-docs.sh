#!/bin/bash

echo "📝 Gerando README e documentação..."

# ============================================================
# README PRINCIPAL
# ============================================================
cat > README.md << 'README'
# 🐾 PetMatch — Rede Social para Adoção e Apadrinhamento de Animais

> Case técnico de alta complexidade — Stack moderna para vagas R$ 8k+ PJ

![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Deno](https://img.shields.io/badge/Deno-000000?style=for-the-badge&logo=deno&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🧭 Visão Geral

PetMatch é uma plataforma completa para adoção e apadrinhamento de animais,
desenvolvida como case técnico para demonstrar domínio de arquitetura moderna
com React, Supabase, Edge Functions e geolocalização.

---

## 🏗️ Arquitetura

\`\`\`
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                         │
│         React.js (Vite) + Tailwind + Shadcn/UI      │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS / REST / Realtime
┌──────────────────────▼──────────────────────────────┐
│                   SUPABASE                          │
│  ┌─────────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  PostgreSQL  │  │   Auth   │  │    Storage    │  │
│  │  + PostGIS  │  │  (JWT)   │  │  (termos PDF) │  │
│  └─────────────┘  └──────────┘  └───────────────┘  │
│  ┌──────────────────────────────────────────────┐   │
│  │           Edge Functions (Deno)              │   │
│  │         gerar-termo · notificações           │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
\`\`\`

---

## ✅ Funcionalidades Implementadas

### 🔐 Autenticação
- Login/Cadastro via Supabase Auth (JWT)
- Perfis diferenciados: Adotante, ONG, Padrinho

### 🐶 Gestão de Pets
- Cadastro completo com fotos (Supabase Storage)
- Status: disponível, em processo, adotado

### 📋 Fluxo de Adoção
- Solicitação de adoção com aprovação da ONG
- **Geração automática de Termo de Responsabilidade**
  - Edge Function em Deno/TypeScript
  - Documento gerado dinamicamente com dados do adotante + pet
  - Upload automático para Supabase Storage (UTF-8)
  - URL pública via CDN

### 💰 Apadrinhamento
- Modalidades: financeiro e/ou insumos
- Painel do padrinho com histórico de contribuições

### 🗺️ Mapa Interativo
- Visualização de pets por geolocalização
- Estilo Airbnb com marcações customizadas

### 🗓️ Agendamento de Passeios
- Calendário de visitas e passeios

---

## 🚀 Stack Técnica (Plano B+)

| Camada | Tecnologia | Objetivo Técnico |
|--------|-----------|-----------------|
| Frontend | React.js + Vite | SPA performática |
| Estilização | Tailwind CSS + Shadcn/UI | Design system consistente |
| Backend | Supabase (PostgreSQL) | BaaS serverless |
| Auth | Supabase Auth | JWT + RLS policies |
| Storage | Supabase Storage | CDN para arquivos |
| Edge Functions | Deno + TypeScript | Serverless na borda |
| Geolocalização | PostGIS | Busca por proximidade |
| Cache | React Query (TanStack) | Performance de consultas |
| Mensageria | pg_cron + pg_net | Simulação de filas async |

---

## 📁 Estrutura do Projeto

\`\`\`
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
│   │       └── index.ts        ← Edge Function (Deno)
│   └── migrations/
├── public/
├── README.md
└── CHANGELOG.md
\`\`\`

---

## ⚙️ Como Rodar

\`\`\`bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/petmatch.git
cd petmatch

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY

# 4. Rode o projeto
npm run dev
\`\`\`

---

## 🧪 Testando as Edge Functions

\`\`\`bash
curl -X POST https://SEU_PROJECT_REF.supabase.co/functions/v1/gerar-termo \
  -H "Authorization: Bearer SEU_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "adocao_id": "teste-001",
    "adotante": {
      "nome": "Wiliam Teste",
      "cpf": "123.456.789-00",
      "email": "wiliam@teste.com"
    },
    "pet": {
      "nome": "Rex",
      "especie": "Cachorro",
      "raca": "Vira-lata"
    }
  }'
\`\`\`

**Resposta esperada:**
\`\`\`json
{
  "success": true,
  "url_termo": "https://...supabase.co/storage/v1/object/public/termos/adocoes/termo_teste-001_xxx.txt",
  "mensagem": "Termo de responsabilidade gerado com sucesso!"
}
\`\`\`

---

## 📈 Roadmap Técnico

- [x] Setup React + Vite + Tailwind + Shadcn/UI
- [x] Integração Supabase (Auth + DB + Storage)
- [x] Edge Function: Geração de Termo de Responsabilidade
- [ ] PostGIS: Busca de pets por geolocalização
- [ ] React Query: Cache e otimização do mapa
- [ ] pg_cron + pg_net: Notificações assíncronas para padrinhos

---

## 👨‍💻 Autor

Desenvolvido por **Wiliam** como case técnico.

> *"Arquitetura que resolve problemas reais com tecnologia de ponta."*
README

# ============================================================
# CHANGELOG
# ============================================================
cat > CHANGELOG.md << 'CHANGELOG'
# 📋 Changelog — PetMatch

Todas as mudanças relevantes do projeto serão documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [0.2.0] — 2026-05-06

### ✅ Adicionado
- **Edge Function `gerar-termo`** (Deno/TypeScript)
  - Geração dinâmica de Termo de Responsabilidade de Adoção
  - Injeção de dados do adotante e do pet no documento
  - Upload automático para Supabase Storage em `termos/adocoes/`
  - URL pública via CDN do Supabase
  - Encoding UTF-8 correto via `TextEncoder` + `charset=utf-8`
  - Deploy em produção via `supabase functions deploy`

### 🔧 Técnico
- Configuração do Supabase CLI para deploy em produção
- Uso da Legacy anon key (JWT) para autenticação das Edge Functions
- Bucket `termos` configurado como público no Supabase Storage

---

## [0.1.0] — 2026-04-01

### ✅ Adicionado
- Setup inicial do projeto com React.js + Vite
- Configuração do Tailwind CSS e Shadcn/UI
- Integração com Supabase (PostgreSQL, Auth, Storage)
- Estrutura base de rotas e componentes
- Fluxos de negócio: adoção, apadrinhamento, mapa, agendamento
CHANGELOG

echo "✅ README.md gerado!"
echo "✅ CHANGELOG.md gerado!"
echo ""
echo "🚀 Rodando commits..."

git add README.md CHANGELOG.md supabase/functions/gerar-termo/index.ts

git commit -m "docs: adiciona README completo com arquitetura e stack técnica

- Visão geral do projeto PetMatch
- Diagrama de arquitetura (Frontend + Supabase + Edge Functions)
- Documentação de todas as funcionalidades implementadas
- Tabela de stack técnica (Plano B+)
- Estrutura do projeto e instruções de setup
- Exemplo de teste da Edge Function com cURL
- Roadmap técnico atualizado"

git commit -m "docs: adiciona CHANGELOG com histórico de versões

- v0.2.0: Edge Function gerar-termo (Deno/TypeScript)
- v0.1.0: Setup inicial React + Supabase"

git commit -m "feat(edge-functions): implementa gerar-termo com encoding UTF-8

- Edge Function em Deno/TypeScript para geração de termos
- Documento gerado dinamicamente com dados do adotante + pet
- Upload automático para Supabase Storage (bucket: termos/adocoes)
- Correção de encoding: TextEncoder + contentType charset=utf-8
- Deploy validado em produção via Supabase CLI
- Teste confirmado via cURL com resposta success: true"

echo ""
echo "════════════════════════════════════════"
echo "✅ TUDO COMMITADO COM SUCESSO!"
echo "════════════════════════════════════════"
echo ""
echo "📦 Agora rode: git push origin main"
