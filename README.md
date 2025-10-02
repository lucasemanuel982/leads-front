# Frontend - Sistema de Gerenciamento de Leads

Frontend construído com Next.js 14, TypeScript, Tailwind CSS e Framer Motion.

## Links de Produção
-- https://leads-front.vercel.app - Página do formulário
-- https://leads-front.vercel.app/admin/login -- Página de login
-- https://leads-front.vercel.app/admin/leads -- Dashboard de leads

-- Login de testes:
   -- E-mail: leads@leads.com.br
   -- Senha: leads123
-- Alternativa é criar um login através do swagger.

## Estrutura Detalhada do Projeto

```
src/
├── app/                    # App Router do Next.js 14
│   ├── page.tsx           # Formulário público de leads (SSG)
│   ├── layout.tsx         # Layout raiz da aplicação
│   ├── globals.css        # Estilos globais
│   └── admin/             # Área administrativa
│       ├── login/         # Autenticação
│       │   └── page.tsx   # Página de login
│       ├── dashboard/     # Dashboard principal
│       │   └── page.tsx   # Estatísticas e visão geral
│       └── leads/         # Gerenciamento de leads
│           ├── page.tsx           # Lista de leads
│           ├── new/               # Criar novo lead
│           │   └── page.tsx       # Formulário de criação
│           └── [id]/              # Detalhes do lead
│               ├── page.tsx       # Visualização (SSR)
│               └── edit/          # Edição
│                   └── page.tsx   # Formulário de edição
├── components/            # Componentes reutilizáveis
│   ├── AdminLayout.tsx    # Layout da área admin
│   ├── LeadForm.tsx       # Formulário de leads
│   ├── Toast.tsx          # Sistema de notificações
│   └── ui/                # Componentes UI (shadcn/ui)
│       ├── button.tsx     # Botões
│       ├── input.tsx      # Inputs
│       ├── table.tsx      # Tabelas
│       ├── card.tsx       # Cards
│       ├── dialog.tsx     # Modais
│       └── ...            # Outros componentes UI
└── lib/                   # Utilitários e configurações
    ├── api.ts             # Cliente Axios configurado
    ├── validations.ts     # Schemas Zod para validação
    ├── utils.ts           # Funções helper
    └── export.ts          # Utilitários de exportação
```

## 🚀 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
Crie um arquivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## 🏃 Executando

### Desenvolvimento
```bash
npm run dev
```

Acesse: http://localhost:3000

### Produção
```bash
npm run build
npm start
```

## 📄 Rotas e Páginas

### Rotas Públicas
- **`/`** - Formulário de cadastro de leads
  - **Renderização**: SSG (Static Site Generation)
  - **Features**: Validação com React Hook Form + Zod, tracking automático (UTM, GCLID, FBCLID), animações com Framer Motion
  - **Componentes**: `LeadForm`, componentes UI do shadcn/ui

### Rotas Privadas (Requerem Autenticação)

#### Autenticação
- **`/admin/login`** - Página de login do administrador
  - **Features**: Validação de formulário, tratamento de erros, redirecionamento automático

#### Dashboard
- **`/admin/dashboard`** - Dashboard principal
  - **Features**: Estatísticas em tempo real, gráficos de leads, visão geral do sistema
  - **Dados**: Total de leads, leads ativos/inativos, leads do mês atual

#### Gerenciamento de Leads
- **`/admin/leads`** - Lista de leads
  - **Features**: Busca por nome/email, paginação, filtros, ações em lote
  - **Componentes**: Tabela com dados, filtros de busca, paginação

- **`/admin/leads/new`** - Criar novo lead
  - **Features**: Formulário completo de criação, validação em tempo real
  - **Componentes**: `LeadForm` adaptado para criação

- **`/admin/leads/[id]`** - Detalhes do lead
  - **Renderização**: SSR (Server-Side Rendering)
  - **Features**: Visualização completa dos dados, histórico de interações
  - **Dados**: Informações pessoais, tracking data, timestamps

- **`/admin/leads/[id]/edit`** - Editar lead
  - **Features**: Formulário de edição, validação, preview das alterações
  - **Componentes**: `LeadForm` adaptado para edição

### Estratégias de Renderização
- **SSG**: Formulário público (melhor performance e SEO)
- **SSR**: Detalhes do lead (dados dinâmicos)
- **CSR**: Dashboard e lista de leads (interatividade)

### Design

- **Tailwind CSS** para estilização
- **Framer Motion** para animações fluidas
- **React Icons** para ícones
- Design responsivo e moderno
- UI/UX otimizada

## 🔌 Integração com API

### 📡 Cliente Axios Configurado
O arquivo `lib/api.ts` contém a configuração completa do cliente HTTP:


### 🎯 Funções Helper da API

#### Leads API
```typescript
leadsApi.create(data)           // Criar lead público
leadsApi.createAdmin(data)      // Criar lead admin
leadsApi.getAll(params)         // Listar com paginação/busca
leadsApi.getById(id)           // Buscar por ID
leadsApi.update(id, data)      // Atualizar lead
leadsApi.deactivate(id)        // Desativar lead
leadsApi.delete(id)           // Deletar permanentemente
leadsApi.getStats()           // Estatísticas
```

#### Auth API
```typescript
authApi.login(data)           // Login
authApi.getMe()              // Dados do usuário
authApi.register(data)       // Criar usuário
authApi.getUsers()           // Listar usuários
```

### Gerenciamento de Autenticação
- Token JWT armazenado no `localStorage`
- Interceptor automático para adicionar token nas requisições
- Redirecionamento automático em caso de token expirado
- Proteção de rotas no client-side

## 📦 Deploy na Vercel

1. Conecte seu repositório na Vercel
2. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_API_URL` - URL da API backend


## 🛠️ Stack Tecnológica

### Core
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **React 18** - Biblioteca de interface

### UI/UX
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI modernos
- **Framer Motion** - Animações fluidas
- **React Icons** - Biblioteca de ícones

### Formulários e Validação
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas TypeScript

### HTTP e Estado
- **Axios** - Cliente HTTP
- **localStorage** - Persistência de token

### Desenvolvimento
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **PostCSS** - Processamento CSS

## Componentes UI - shadcn/ui

O projeto utiliza a biblioteca **shadcn/ui**, uma coleção de componentes reutilizáveis, acessíveis e estilosos construídos com **Radix UI** e **Tailwind CSS**.

### 📦 Componentes Implementados

#### Componentes de Formulário
- **Input** - Campos de entrada de texto
- **Textarea** - Áreas de texto
- **Label** - Rótulos de formulário
- **Form** - Componentes de formulário com validação

#### Componentes de Exibição
- **Card** - Cartões com cabeçalho, conteúdo e rodapé
- **Badge** - Distintivos e etiquetas
- **Separator** - Separadores visuais
- **Skeleton** - Indicadores de carregamento

#### Componentes de Navegação
- **Button** - Botões com múltiplas variantes

#### Componentes de Overlay
- **Dialog** - Diálogos modais
- **Popover** - Popovers
- **Alert** - Alertas e notificações

#### Componentes de Layout
- **Calendar** - Calendário

### 🎨 Personalização de Tema

As cores do tema podem ser personalizadas no arquivo `src/app/globals.css`. As variáveis CSS estão definidas em formato HSL:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... */
}
```

### 📚 Recursos Adicionais
- [Documentação oficial do shadcn/ui](https://ui.shadcn.com)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CVA (Class Variance Authority)](https://cva.style/docs)

## Estrutura de Rotas

- **SSG (Static Site Generation)**: Formulário público
- **SSR (Server-Side Rendering)**: Detalhes do lead
- **CSR (Client-Side Rendering)**: Dashboard e lista de leads

## Features

- ✅ Formulário público com validação robusta
- ✅ Tracking automático (UTM, GCLID, FBCLID)
- ✅ Painel administrativo completo
- ✅ Dashboard com estatísticas em tempo real
- ✅ Busca e paginação de leads
- ✅ Visualização detalhada de cada lead
- ✅ Animações e transições suaves
- ✅ Design responsivo
- ✅ Feedback visual em todas as ações


