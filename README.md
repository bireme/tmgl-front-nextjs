# TMGL Portal - Frontend

Portal web desenvolvido para a **The WHO Traditional Medicine Global Library (TMGL)** em parceria com a **BIREME**. Plataforma Next.js que consome conteúdo gerenciado no WordPress e expõe módulos temáticos para iniciativas de medicina tradicional.

## 📋 Overview

Este projeto é um portal web moderno e responsivo que serve como biblioteca digital global para medicina tradicional. O frontend consome conteúdo de múltiplas fontes (WordPress CMS, APIs externas) e apresenta informações organizadas por regiões, países, dimensões temáticas e recursos especializados.

### Características Principais

- 🌍 **Multi-regional**: Suporte para diferentes regiões e países
- 🌐 **Multi-idioma**: Sistema de internacionalização integrado
- 📱 **Responsivo**: Design adaptável para todos os dispositivos
- 🔍 **Busca Avançada**: Sistema de busca e filtros para recursos bibliográficos
- 📊 **Diversos Formatos**: Suporte para PDFs, vídeos, multimídia, RSS feeds
- 🎨 **UI Moderna**: Interface construída com Mantine UI

## 🛠️ Tecnologias

### Linguagem e Framework

- **TypeScript** - Linguagem de programação
- **Next.js 14.2.4** - Framework React para produção
- **React 18** - Biblioteca UI
- **Node.js** - Runtime JavaScript

### Estilização

- **SASS/SCSS** - Pré-processador CSS
- **Mantine UI v7** - Biblioteca de componentes React
- **PostCSS** - Processamento de CSS
- **CSS Modules** - Estilos com escopo

## 📚 Bibliotecas Principais

### UI e Componentes

- `@mantine/core` - Componentes base do Mantine
- `@mantine/carousel` - Carrossel de imagens/conteúdo
- `@mantine/dates` - Seletores de data
- `@mantine/form` - Gerenciamento de formulários
- `@mantine/hooks` - Hooks utilitários
- `@mantine/modals` - Sistema de modais
- `@tabler/icons-react` - Ícones SVG
- `react-slick` / `slick-carousel` - Carrosséis adicionais
- `react-slideshow-image` - Slideshows de imagens
- `react-background-slider` - Slider de fundo

### Gerenciamento de Estado e Dados

- `swr` - Data fetching e cache
- `axios` - Cliente HTTP
- `react-hotjar` - Analytics e heatmaps

### Processamento de Documentos

- `pdfjs-dist` - Renderização de PDFs no navegador
- `pdf-lib` - Manipulação de PDFs
- `pdf-poppler` - Conversão de PDF para imagens
- `pdf2pic` - Conversão PDF para imagem
- `pdf-thumbnail` - Geração de thumbnails de PDFs
- `puppeteer` - Automação de navegador (para PDFs)

### Utilitários

- `dayjs` / `moment` - Manipulação de datas
- `crypto-js` - Criptografia
- `spark-md5` - Hash MD5
- `js-cookie` - Gerenciamento de cookies
- `he` - Decodificação HTML entities
- `zod` - Validação de schemas TypeScript
- `rss-parser` - Parsing de feeds RSS
- `xml2js` - Conversão XML para JSON

### Processamento de Mídia

- `sharp` - Processamento de imagens
- `canvas` - Renderização de canvas
- `@coveops/vimeo-thumbnail` - Thumbnails do Vimeo

### Integrações Especializadas

- `@stoddabr/react-tableau-embed-live` - Embed de dashboards Tableau

## 🔌 Integrações

### CMS e Conteúdo

- **WordPress REST API** - Gerenciamento de conteúdo principal
  - Posts, páginas, mídia
  - Taxonomias e categorias
  - Menus e configurações globais

### APIs Externas

- **DIREV API** - Base de dados bibliográficos
- **LIS API** - Literatura em Saúde
- **Journals API** - Catálogo de periódicos
- **Multimedia API** - Recursos multimídia
- **Evidence Maps API** - Mapas de evidências
- **Regulations and Policies API** - Legislações e políticas

### Serviços de Terceiros

- **Mailchimp** - Newsletter e email marketing
- **Hotjar** - Analytics e comportamento do usuário
- **RSS Feeds** - Agregação de conteúdo externo

### Processamento de Arquivos

- Geração de thumbnails de PDFs
- Conversão de documentos
- Proxy de PDFs para visualização segura
- Processamento de vídeos e imagens

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React reutilizáveis
│   ├── layout/         # Header, Footer, Skip Links
│   ├── sections/       # Blocos de conteúdo (Hero, News, etc.)
│   ├── feed/           # Renderizadores de listas e feeds
│   ├── forms/          # Formulários de busca e filtros
│   └── ...
├── pages/              # Rotas Next.js (App Router)
│   ├── api/            # API Routes (proxies e utilitários)
│   └── [rotas dinâmicas]
├── services/           # Clientes de API e serviços
│   ├── apiRepositories/ # Serviços de APIs externas
│   ├── globalConfig/   # Configurações globais
│   └── ...
├── contexts/           # React Contexts (estado global)
├── helpers/            # Funções utilitárias
├── styles/             # Estilos globais e temas
└── types/              # Definições TypeScript
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ 
- npm, yarn ou bun

### Instalação

```bash
# Instalar dependências
npm install
# ou
yarn install
# ou
bun install
```

### Variáveis de Ambiente

Configure as seguintes variáveis de ambiente (crie um arquivo `.env.local`):

```env
# URLs Base
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_API_BASE_URL=
BASE_URL=
WP_BASE_URL=

# APIs Externas
DIREV_API_KEY=
DIREV_API_URL=
LIS_API_URL=
Journals_API_URL=
MULTIMEDIA_API_URL=

# Mailchimp
MAILCHIMP_API_KEY=
MAILCHIMP_LIST_ID=
MAILCHIMP_DATA_CENTER=

# Outros
RSS_FEED_URL=
SECRET=
POSTSPERPAGE=
BASE_SEARCH_URL=
FIADMIN_URL=
PRODUCTION=false
```

### Executar em Desenvolvimento

```bash
npm run dev
# ou
yarn dev
# ou
bun dev
```

A aplicação estará disponível em `http://localhost:3000`

### Build para Produção

```bash
npm run build
npm run start
```

### Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia servidor de produção
- `npm run lint` - Executa ESLint
- `npm run generate-pdf` - Gera PDFs de documentação
- `npm run generate-pdf:manual` - Gera PDF do manual técnico
- `npm run generate-pdf:sitemap` - Gera PDF do mapa do site

## 🧩 Funcionalidades Principais

- **Páginas Regionais**: Conteúdo específico por região e país
- **Dimensões Temáticas**: Organização por temas de medicina tradicional
- **Biblioteca de Recursos**: Busca e filtros avançados
- **Multimídia**: Galeria de vídeos, imagens e documentos
- **Notícias e Eventos**: Feed de notícias e calendário de eventos
- **Periódicos**: Catálogo de revistas científicas
- **Mapas de Evidências**: Visualização de evidências científicas
- **Newsletter**: Sistema de inscrição via Mailchimp
- **RSS Feeds**: Agregação de conteúdo externo

## 📖 Documentação Adicional

- [Next.js Documentation](https://nextjs.org/docs)
- [Mantine UI Documentation](https://mantine.dev/)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)

## 👥 Desenvolvido para

- **WHO** - World Health Organization
- **BIREME** - Centro Latino-Americano e do Caribe de Informação em Ciências da Saúde

## 📄 Licença

Este projeto é privado e confidencial.
