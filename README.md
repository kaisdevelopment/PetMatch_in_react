<div align="center">

# 🐾 PetMatch

### Rede Social para Adoção e Apadrinhamento de Animais

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-BaaS-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

</div>

---

## 📖 Sobre o Projeto

O **PetMatch** é uma plataforma web fullstack voltada para conectar animais que precisam de um lar a pessoas dispostas a adotar ou apadrinhar. Nasceu como um projeto pessoal e evoluiu para um **case técnico de alta complexidade**, cobrindo desde autenticação segura até geolocalização e arquitetura serverless.

A proposta vai além de um simples CRUD: o sistema modela **fluxos reais de adoção**, **apadrinhamento financeiro/insumos**, **agendamento de passeios** e um **mapa interativo** estilo Airbnb — tudo com foco em escalabilidade e boas práticas de engenharia.

---

## ✨ Funcionalidades

- [x] Autenticação completa (cadastro, login, logout) via Supabase Auth
- [x] Cadastro de pets com upload de foto
- [x] CRUD completo de pets (criar, editar, excluir)
- [x] Storage com organização por usuário (`userId/petId.ext`)
- [x] Controle de acesso via Row Level Security (RLS)
- [ ] Mapa interativo de pets próximos (PostGIS)
- [ ] Fluxo de adoção com termos de responsabilidade (Edge Functions)
- [ ] Apadrinhamento financeiro e por insumos
- [ ] Agendamento de passeios
- [ ] Notificações assíncronas para padrinhos

---

## 🛠️ Tecnologias e Justificativas

### ⚛️ React 18 + Vite
**Por que?**
React é o padrão de mercado para SPAs modernas. O Vite substitui o Create React App com um servidor de desenvolvimento baseado em ESModules nativos — o resultado é um **HMR (Hot Module Replacement) praticamente instantâneo** e builds de produção significativamente mais rápidos. Para um projeto que cresce iterativamente, essa produtividade faz diferença real.

---

### 🎨 Tailwind CSS + shadcn/ui
**Por que?**
Tailwind adota a filosofia **utility-first**: estilização diretamente no JSX, sem arquivos CSS separados, sem conflitos de especificidade. O shadcn/ui complementa com componentes acessíveis (baseados em Radix UI) que são **copiados para dentro do projeto** — não são uma dependência de terceiro, o que garante total controle sobre o código e zero lock-in de biblioteca de UI.

---

### 🟩 Supabase (PostgreSQL + Auth + Storage + Edge Functions)
**Por que?**
O Supabase é um **BaaS (Backend as a Service)** open-source que entrega em uma só plataforma:

| Módulo | Função no projeto |
|---|---|
| **PostgreSQL** | Banco relacional robusto com suporte a PostGIS para geolocalização |
| **Auth** | JWT + RLS — autenticação segura sem servidor próprio |
| **Storage** | Upload de imagens com organização por bucket e políticas de acesso |
| **Edge Functions** | Lógica de backend em Deno/TypeScript rodando na borda (baixa latência) |
| **Realtime** | WebSockets nativos para notificações em tempo real |

A escolha pelo Supabase em vez de um backend Express/Node tradicional foi deliberada: **reduz o time-to-market** sem abrir mão de features enterprise como RLS por linha de tabela.

---

### 🔐 Row Level Security (RLS)
**Por que?**
RLS é uma feature nativa do PostgreSQL que garante **isolamento de dados no nível do banco** — não na aplicação. Cada usuário acessa apenas seus próprios registros, independentemente de como a query é escrita. Isso elimina uma classe inteira de vulnerabilidades de autorização.

---

### 📍 PostGIS *(planejado)*
**Por que?**
Para buscas do tipo 'pets próximos de mim', índices convencionais não são suficientes. O PostGIS adiciona tipos geométricos ao PostgreSQL e habilita queries com `ST_DWithin` (distância em metros) usando **índices GIST** — eficiente mesmo com milhares de registros de localização.

---

## 🏗️ Arquitetura

```
src/
├── components/
│   ├── layout/           # AppLayout, Sidebar, Header
│   └── pets/             # PetForm, PetCard
├── contexts/
│   └── AuthContext.jsx   # Gerenciamento de sessão global
├── lib/
│   └── supabase.js       # Cliente Supabase singleton
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Pets.jsx
└── main.jsx
```

---

## 🚀 Como rodar localmente

```bash
# Clone o repositório
git clone git@github.com:kaisdevelopment/PetMatch_in_react.git
cd PetMatch_in_react

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

---

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env` na raiz com base no `.env.example`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

> ⚠️ Nunca suba o `.env` para o repositório. Ele já está no `.gitignore`.

---

## 👨‍💻 Autor

Desenvolvido por **Wiliam** — [GitHub](https://github.com/kaisdevelopment)

---

<div align="center">
  <sub>Feito com ❤️ e muito ☕ — PetMatch © 2026</sub>
</div>
