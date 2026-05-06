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
