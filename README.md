# TMGL Portal - Frontend

Portal web desenvolvido para a **The WHO Traditional Medicine Global Library (TMGL)** em parceria com a **BIREME**. Plataforma Next.js que consome conteúdo gerenciado no WordPress.

## 📋 Overview

Este projeto é um portal web moderno e responsivo que serve como biblioteca digital global para medicina tradicional. O frontend consome conteúdo de múltiplas fontes (WordPress CMS, APIs externas) e apresenta informações organizadas por regiões, países, dimensões temáticas e recursos especializados.

### Características Principais

- 🌍 **Multi-regional**: Suporte para diferentes regiões e países
- 🌐 **Multi-idioma**: Sistema de internacionalização (em desenvolvimento)
- 📱 **Responsivo**: Design adaptável para todos os dispositivos
- 🔍 **Busca Avançada**: Sistema de busca e filtros para recursos bibliográficos
- 📊 **Diversos Formatos**: Suporte para PDFs, vídeos, multimídia, RSS feeds
- 🎨 **UI Moderna**: Interface construída com Mantine UI

## 📑 Sumário

- [Tecnologias](#-tecnologias)
  - [Linguagem e Framework](#linguagem-e-framework)
  - [Estilização](#estilização)
- [Bibliotecas Principais](#-bibliotecas-principais)
  - [UI e Componentes](#ui-e-componentes)
  - [Gerenciamento de Estado e Dados](#gerenciamento-de-estado-e-dados)
  - [Processamento de Documentos](#processamento-de-documentos)
  - [Utilitários](#utilitários)
  - [Processamento de Mídia](#processamento-de-mídia)
  - [Integrações Especializadas](#integrações-especializadas)
- [Integrações](#-integrações)
  - [CMS e Conteúdo](#cms-e-conteúdo)
  - [APIs Externas](#apis-externas)
  - [Serviços de Terceiros](#serviços-de-terceiros)
  - [Processamento de Arquivos](#processamento-de-arquivos)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Executar](#-como-executar)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Variáveis de Ambiente](#variáveis-de-ambiente)
  - [Executar em Desenvolvimento](#executar-em-desenvolvimento)
  - [Build para Produção](#build-para-produção)
  - [Scripts Disponíveis](#scripts-disponíveis)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Documentação de Componentes](#-documentação-de-componentes)
  - [Layout](#layout-componentslayout)
  - [Breadcrumbs](#breadcrumbs-componentsbreadcrumbs)
  - [Cards](#cards-componentscards)
  - [Categories](#categories-componentscategories)
  - [Embed](#embed-componentsembed)
  - [Forms](#forms-componentsforms)
  - [Feed](#feed-componentsfeed)
  - [Multitab](#multitab-componentsmultitab)
  - [PDF View](#pdf-view-componentspdfview)
  - [Share](#share-componentsshare)
  - [Slider](#slider-componentsslider)
  - [Video](#video-componentsvideo)
  - [Videos](#videos-componentsvideos)
  - [GPT](#gpt-componentsgpt)
  - [RSS](#rss-componentsrss)
  - [Sections](#sections-componentssections)
- [Documentação Adicional](#-documentação-adicional)

## 🛠️ Tecnologias

<details>
<summary><b>Ver detalhes</b></summary>

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

</details>

## 📚 Bibliotecas Principais

<details>
<summary><b>Ver detalhes</b></summary>

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

</details>

## 🔌 Integrações

<details>
<summary><b>Ver detalhes</b></summary>

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

</details>

## 📁 Estrutura do Projeto

<details>
<summary><b>Ver detalhes</b></summary>

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

</details>

## 🚀 Como Executar

<details>
<summary><b>Ver detalhes</b></summary>

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

</details>

## 🧩 Funcionalidades Principais

<details>
<summary><b>Ver detalhes</b></summary>

- **Páginas Regionais**: Conteúdo específico por região e país
- **Dimensões Temáticas**: Organização por temas de medicina tradicional
- **Biblioteca de Recursos**: Busca e filtros avançados
- **Multimídia**: Galeria de vídeos, imagens e documentos
- **Notícias e Eventos**: Feed de notícias e calendário de eventos
- **Periódicos**: Catálogo de revistas científicas
- **Mapas de Evidências**: Visualização de evidências científicas
- **Newsletter**: Sistema de inscrição via Mailchimp
- **RSS Feeds**: Agregação de conteúdo externo

</details>

## 🧩 Documentação de Componentes

### Layout (`components/layout/`)

<details>
<summary><b>Ver componentes de Layout</b></summary>

#### `HeaderLayout`
**Localização**: `src/components/layout/header.tsx`

**Descrição**: Componente principal de cabeçalho do site com menu de navegação responsivo e mega menu.

**Atributos**: Nenhum (componente sem props)

**Integrações**:
- **WordPress REST API** (`MenusApi`): Busca menus "global-menu" e "regional-menu"
- **GlobalContext**: Acessa `regionName` e `countryName` para exibição no logo

**Funcionalidades**:
- Menu responsivo com hamburger para mobile
- Mega menu com navegação em 3 níveis
- Scroll detection para alterar estilo do header
- Suporte a navegação por teclado (acessibilidade)
- Menu regional e global configuráveis via WordPress

**Dependências**:
- `@mantine/core` (Container, Flex, Grid, Button)
- `@tabler/icons-react` (ícones)
- `next/router` (navegação)

---

#### `FooterLayout`
**Localização**: `src/components/layout/footer.tsx`

**Descrição**: Rodapé do site com links organizados em colunas e imagens de parceiros.

**Atributos**: Nenhum (componente sem props)

**Integrações**:
- **WordPress REST API** (`MenusApi`): Busca menus "footer-left", "footer-right", "footer-center"
- **GlobalContext**: Acessa `globalConfig` para imagens do footer e URL de termos

**Funcionalidades**:
- Renderização de menus hierárquicos do WordPress
- Exibição de imagens de parceiros (BIREME, WHO)
- Link para política de privacidade e termos
- Layout responsivo com Grid do Mantine

---

#### `SkipLink`
**Localização**: `src/components/layout/skip-link.tsx`

**Descrição**: Link de acessibilidade para pular para o conteúdo principal.

**Atributos**: Nenhum (componente sem props)

**Funcionalidades**:
- Link invisível que aparece no foco do teclado
- Navegação rápida para `#main-content`
- Melhora acessibilidade para leitores de tela

---

#### `helper.ts`
**Localização**: `src/components/layout/helper.ts`

**Descrição**: Função utilitária para dividir arrays em chunks.

**Funções**:
- `chunkArray<T>(arr: T[], size: number): T[][]` - Divide array em sub-arrays de tamanho especificado

</details>

---

### Breadcrumbs (`components/breadcrumbs/`)

<details>
<summary><b>Ver componentes de Breadcrumbs</b></summary>

#### `BreadCrumbs`
**Localização**: `src/components/breadcrumbs/index.tsx`

**Descrição**: Componente de navegação breadcrumb para mostrar o caminho da página atual.

**Atributos**:
- `path: Array<pathItem>` - Array de itens do breadcrumb (obrigatório)
  - `pathItem`: `{ name: string, path: string }`
- `blackColor?: boolean` - Aplica estilo de cor preta (opcional)

**Funcionalidades**:
- Renderiza links navegáveis com separador ">"
- Limita nomes a 40 caracteres com "..."
- Remove tags HTML dos nomes
- Substitui hífens por espaços

**Dependências**:
- `@helpers/stringhelper` (removeHTMLTagsAndLimit)

</details>

---

### Cards (`components/cards/`)

<details>
<summary><b>Ver componentes de Cards</b></summary>

#### `IconCard`
**Localização**: `src/components/cards/index.tsx`

**Descrição**: Card com ícone e título, usado para navegação visual.

**Atributos**:
- `title: string` - Título do card (obrigatório)
- `icon: ReactNode` - Ícone ou elemento React (obrigatório)
- `callBack?: Function` - Função executada ao clicar (opcional)
- `small?: boolean` - Aplica estilo reduzido (opcional)

**Funcionalidades**:
- Layout flexível com ícone centralizado
- Callback opcional ao clicar
- Suporte a tamanho pequeno

---

#### `ImageCard`
**Localização**: `src/components/cards/index.tsx`

**Descrição**: Card com imagem e título.

**Atributos**:
- `title: string` - Título do card (obrigatório)
- `icon: ReactNode` - Imagem ou elemento React (obrigatório)
- `callBack?: Function` - Função executada ao clicar (opcional)
- `small?: boolean` - Aplica estilo reduzido (opcional)

**Funcionalidades**:
- Similar ao IconCard mas otimizado para imagens
- Imagem ocupa largura total do card

</details>

---

### Categories (`components/categories/`)

<details>
<summary><b>Ver componentes de Categories</b></summary>

#### `CategorieBadge`
**Localização**: `src/components/categories/index.tsx`

**Descrição**: Exibe badges coloridos para categorias.

**Atributos**:
- `categories?: Array<String>` - Array de nomes de categorias (opcional)

**Funcionalidades**:
- Filtra categoria "Uncategorized"
- Aplica cores rotativas do helper `colors`
- Usa Badge do Mantine

**Dependências**:
- `@helpers/colors` (array de cores)

---

#### `CustomTaxBadge`
**Localização**: `src/components/categories/index.tsx`

**Descrição**: Wrapper para exibir badges de taxonomias customizadas.

**Atributos**:
- `names: Array<string>` - Array de nomes de taxonomia (obrigatório)

**Funcionalidades**:
- Reutiliza `CategorieBadge` internamente

</details>

---

### Embed (`components/embed/`)

<details>
<summary><b>Ver componentes de Embed</b></summary>

#### `EmbedIframe`
**Localização**: `src/components/embed/EmbedIframe.tsx`

**Descrição**: Componente iframe com suporte a redimensionamento automático via postMessage.

**Atributos**:
- `src: string` - URL do iframe (obrigatório)
- `width?: string | number` - Largura (padrão: "100%")
- `height?: string | number` - Altura inicial (padrão: 600)
- `className?: string` - Classe CSS adicional (opcional)
- `style?: React.CSSProperties` - Estilos inline (opcional)
- `onResize?: (height: number) => void` - Callback quando altura muda (opcional)

**Funcionalidades**:
- Escuta mensagens postMessage do tipo "resize"
- Ajusta altura automaticamente (+200px de margem)
- Suporte a fullscreen

**Uso**: Ideal para embeds de dashboards Tableau ou outras aplicações que enviam eventos de resize.

</details>

---

### Forms (`components/forms/`)

<details>
<summary><b>Ver componentes de Forms</b></summary>

#### `SearchForm`
**Localização**: `src/components/forms/search/index.tsx`

**Descrição**: Formulário de busca principal do site.

**Atributos**:
- `title?: string` - Título do formulário (opcional)
- `subtitle?: string` - Subtítulo (opcional)
- `small?: boolean` - Aplica estilo reduzido (opcional)

**Integrações**:
- **Variável de Ambiente**: `BASE_SEARCH_URL` - URL base da busca externa

**Funcionalidades**:
- Redireciona para URL de busca externa com query string
- Links para busca avançada e Subject Headings
- Suporte a Enter para submeter
- Layout responsivo

**Dependências**:
- `next/router` (navegação)

---

#### `FiltersForm`
**Localização**: `src/components/forms/filters/index.tsx`

**Descrição**: Formulário de filtros para posts (atualmente com funcionalidade comentada).

**Atributos**:
- `onSubmit: (regions?: number[]) => void` - Callback ao submeter (obrigatório)

**Integrações**:
- **WordPress REST API** (`PostsApi`): Busca taxonomias "tm-dimension", "country", "region"

**Funcionalidades**:
- Carrega taxonomias do WordPress
- Formulário com checkboxes (comentado no código)
- Botão "Apply" para aplicar filtros

**Status**: Funcionalidade principal está comentada, apenas estrutura visível.

---

#### `TrendingTopicsFiltersForm`
**Localização**: `src/components/forms/filters/index.tsx`

**Descrição**: Formulário de busca para tópicos em destaque.

**Atributos**:
- `queryString: string` - String de busca atual (obrigatório)
- `setQueryString: (queryString: string) => void` - Função para atualizar busca (obrigatório)

**Funcionalidades**:
- Campo de busca simples
- Submete query string via callback
- Usa `@mantine/form` para gerenciamento

</details>

---

### Feed (`components/feed/`)

<details>
<summary><b>Ver componentes de Feed</b></summary>

#### `FeedSection`
**Localização**: `src/components/feed/index.tsx`

**Descrição**: Seção genérica de feed de posts do WordPress.

**Atributos**:
- `postType: string` - Tipo de post a buscar (obrigatório, ex: "news", "events")

**Integrações**:
- **WordPress REST API** (`PostsApi`): Busca posts customizados
- **FiltersForm**: Integração com filtros de região

**Funcionalidades**:
- Carrega 9 posts do tipo especificado
- Renderiza lista de `PostItem`
- Suporte a filtros por região
- Loading overlay durante carregamento

---

#### `TrendingTopicsFeedSection`
**Localização**: `src/components/feed/index.tsx`

**Descrição**: Feed de tópicos em destaque via RSS.

**Atributos**:
- `filter?: string` - Filtro RSS opcional

**Integrações**:
- **RSS Feed Service** (`FetchRSSFeed`): Busca artigos de feed RSS
- **GlobalContext**: Acessa `globalConfig` para filtro padrão

**Funcionalidades**:
- Carrega artigos de feed RSS
- Suporte a busca por query string
- Botão "Load more" para carregar mais itens (+9)
- Integração com `TrendingTopicsFiltersForm`

---

#### `PostItem`
**Localização**: `src/components/feed/post/postItem.tsx`

**Descrição**: Item individual de post no feed.

**Atributos**:
- `title: string` - Título do post (obrigatório)
- `excerpt: string` - Resumo/excerpt (obrigatório)
- `href: string` - URL de destino (obrigatório)
- `thumbnail: string` - URL da imagem (obrigatório)
- `tags?: Array<string>` - Array de tags (opcional)

**Funcionalidades**:
- Card clicável que navega para href
- Exibe thumbnail como background
- Renderiza excerpt como HTML
- Badges coloridos para tags

**Dependências**:
- `next/router` (navegação)

---

#### `Pagination`
**Localização**: `src/components/feed/pagination/index.tsx`

**Descrição**: Componente de paginação numérica.

**Atributos**:
- `currentIndex: number` - Índice atual (baseado em 0) (obrigatório)
- `totalPages: number` - Total de páginas (obrigatório)
- `callBack: Dispatch<SetStateAction<number>>` - Função para mudar página (obrigatório)

**Funcionalidades**:
- Botões Prev/Next desabilitados nas extremidades
- Lista de números de página (máximo 100)
- Página atual destacada
- Índice interno baseado em 0, exibição baseada em 1

---

### Multitab (`components/multitab/`)

#### `Multitabs`
**Localização**: `src/components/multitab/index.tsx`

**Descrição**: Sistema de tabs aninhadas com conteúdo HTML.

**Atributos**:
- `props: MultTabItems[]` - Array de itens de tab (obrigatório)
  - `MultTabItems`: `{ tab_name: string, tab_items?: Array<{ item_name: string, item_content: string }> }`

**Funcionalidades**:
- Tabs horizontais principais
- Tabs verticais internas (se houver tab_items)
- Renderiza conteúdo HTML via `dangerouslySetInnerHTML`
- Suporte a múltiplos níveis de navegação

**Dependências**:
- `@mantine/core` (Tabs)

---

#### `DisclaimerMultitab`
**Localização**: `src/components/multitab/disclaimer.tsx`

**Descrição**: Tabs com conteúdo de disclaimer/termos de uso.

**Atributos**: Nenhum (conteúdo hardcoded)

**Funcionalidades**:
- 12 seções de disclaimer pré-definidas
- Tabs verticais em desktop, horizontais em mobile
- Conteúdo sobre licença CC BY-NC-SA 3.0 IGO
- Informações sobre uso, copyright, responsabilidade

**Dependências**:
- `@mantine/core` (Container, Grid, Tabs)
- `@mantine/hooks` (useMediaQuery para responsividade)

---

#### `DimensionMultitab`
**Localização**: `src/components/multitab/dimension.tsx`

**Descrição**: Tabs geradas dinamicamente a partir de HTML com tags `<h3>`.

**Atributos**:
- `content: string` - HTML content com tags `<h3 class="wp-block-heading">` (obrigatório)

**Funcionalidades**:
- Parse HTML para extrair seções por `<h3>`
- Cria tabs dinamicamente a partir dos títulos
- Renderiza conteúdo HTML de cada seção

**Uso**: Ideal para conteúdo WordPress formatado com blocos de cabeçalho.

</details>

---

### PDF View (`components/pdfview/`)

<details>
<summary><b>Ver componentes de PDF View</b></summary>

#### `usePdfCanvas`
**Localização**: `src/components/pdfview/index.tsx`

**Descrição**: Hook React para renderizar primeira página de PDF em canvas.

**Parâmetros**:
- `pdfUrl: string` - URL do PDF (obrigatório)

**Retorno**: `RefObject<HTMLCanvasElement>` - Referência ao canvas

**Integrações**:
- **pdfjs-dist**: Biblioteca para renderização de PDFs

**Funcionalidades**:
- Carrega PDF via URL
- Renderiza primeira página em canvas HTML5
- Escala 1:1 (scale: 1)
- Auto-ajusta dimensões do canvas

**Dependências**:
- `pdfjs-dist` (PDF.js)
- Worker configurado via `pdfjs-dist/build/pdf.worker.min.js`

</details>

---

### Share (`components/share/`)

<details>
<summary><b>Ver componentes de Share</b></summary>

#### `ShareModal`
**Localização**: `src/components/share/index.tsx`

**Descrição**: Modal para compartilhamento em redes sociais.

**Atributos**:
- `link: string` - URL para compartilhar (obrigatório)
- `open: boolean` - Estado de abertura (obrigatório)
- `setOpen: (open: boolean) => void` - Função para controlar abertura (obrigatório)

**Funcionalidades**:
- Ícones para Facebook, Twitter/X, LinkedIn
- Abre URLs de compartilhamento em nova aba
- Modal centralizado do Mantine
- Sem botão de fechar (usa overlay)

**Dependências**:
- `@mantine/core` (Modal, Flex)
- `@tabler/icons-react` (ícones sociais)
- `next/router` (navegação)

</details>

---

### Slider (`components/slider/`)

#### `HeroSlider`
**Localização**: `src/components/slider/index.tsx`

**Descrição**: Slider de imagens com fade para hero section.

**Atributos**:
- `images: Array<AcfImageArray | undefined>` - Array de imagens (obrigatório)
  - `AcfImageArray`: `{ url: string }`

**Funcionalidades**:
- Fade automático entre imagens
- Duração de 5 segundos por slide
- Sem setas ou indicadores
- Background images com CSS

**Dependências**:
- `react-slideshow-image` (Fade component)

---

#### `HeroImage`
**Localização**: `src/components/slider/index.tsx`

**Descrição**: Componente para exibir uma única imagem de hero.

**Atributos**:
- `image: string` - URL da imagem (obrigatório)

**Funcionalidades**:
- Background image simples
- Estilo de hero section

</details>

---

### Video (`components/video/`)

<details>
<summary><b>Ver componentes de Video</b></summary>

#### `VideoSection`
**Localização**: `src/components/video/index.tsx`

**Descrição**: Seção com vídeo de fundo em loop.

**Atributos**:
- `children: ReactNode` - Conteúdo sobreposto ao vídeo (obrigatório)

**Funcionalidades**:
- Vídeo de fundo (`/local/video/bg.mp4`)
- Auto-play, loop, muted
- Conteúdo sobreposto via children

---

#### `ImageSection`
**Localização**: `src/components/video/index.tsx`

**Descrição**: Seção similar ao VideoSection mas sem vídeo.

**Atributos**:
- `children: ReactNode` - Conteúdo da seção (obrigatório)

**Funcionalidades**:
- Layout similar ao VideoSection
- Apenas conteúdo, sem vídeo de fundo

</details>

---

### Videos (`components/videos/`)

<details>
<summary><b>Ver componentes de Videos</b></summary>

#### `VideoItem`
**Localização**: `src/components/videos/index.tsx`

**Descrição**: Item individual de vídeo/multimídia.

**Atributos**:
- `title: string` - Título do vídeo (obrigatório)
- `href: string` - URL de destino (obrigatório)
- `thumbnail: string` - URL da thumbnail (obrigatório)
- `main?: boolean` - Se é o vídeo principal (opcional)

**Funcionalidades**:
- Detecta se thumbnail é PDF e renderiza iframe
- Layout responsivo (row em desktop, column em mobile)
- Altura ajustável (100% se main, 47% se não)

**Dependências**:
- `IframeThumbNail` (para PDFs)

---

#### `FixedRelatedVideosSection`
**Localização**: `src/components/videos/index.tsx`

**Descrição**: Seção fixa de vídeos relacionados com lista pré-definida.

**Atributos**:
- `items: VideoItemProps[]` - Array de itens de vídeo (obrigatório)
- `title?: string` - Título da seção (opcional, padrão: "Related videos")
- `backgroundColor?: string` - Cor de fundo (opcional)

**Funcionalidades**:
- Layout com vídeo principal grande e 2 laterais
- Suporte a 1-3 vídeos
- Container responsivo

---

#### `RelatedVideosSection`
**Localização**: `src/components/videos/index.tsx`

**Descrição**: Seção de vídeos relacionados carregados da API.

**Atributos**:
- `filter?: string` - Filtro opcional (não utilizado atualmente)

**Integrações**:
- **Multimedia API** (`MultimediaService`): Busca 3 recursos multimídia
- **GlobalContext**: Acessa `language` para tradução

**Funcionalidades**:
- Carrega 3 itens da API de multimídia
- Suporte a múltiplos idiomas (title vs title_translated)
- Layout similar ao FixedRelatedVideosSection

---

#### `RecentMultimediaItems`
**Localização**: `src/components/videos/index.tsx`

**Descrição**: Seção de itens multimídia recentes com filtros.

**Atributos**:
- `filter?: queryType[]` - Array de filtros de query (opcional)

**Integrações**:
- **Multimedia API** (`MultimediaService`): Busca recursos com filtros
- **GlobalContext**: Acessa `language`

**Funcionalidades**:
- Carrega 3 itens com filtros opcionais
- Suporte a tradução
- Título "Related media"

</details>

---

### GPT (`components/gpt/`)

<details>
<summary><b>Ver componentes de GPT</b></summary>

#### `GptWidget`
**Localização**: `src/components/gpt/index.tsx`

**Descrição**: Widget flutuante para acessar ChatGPT customizado.

**Atributos**: Nenhum (componente sem props)

**Funcionalidades**:
- Botão flutuante fixo
- Abre ChatGPT customizado em nova aba
- URL hardcoded: `https://chatgpt.com/g/g-2rwZEsuEj-tmgl-gpt-the-integrative-public-health-model`

**Uso**: Widget de assistente de IA para TMGL.

</details>

---

### RSS (`components/rss/`)

<details>
<summary><b>Ver componentes de RSS</b></summary>

#### `TrendingSlider`
**Localização**: `src/components/rss/slider/index.tsx`

**Descrição**: Carrossel horizontal de tópicos em destaque via RSS.

**Atributos**: Nenhum (componente sem props)

**Integrações**:
- **RSS Feed Service** (`FetchRSSFeed`): Busca 10 artigos
- **GlobalContext**: Acessa `globalConfig` e `regionName` para filtros regionais

**Funcionalidades**:
- Carrossel com Embla Carousel
- Controles de navegação (prev/next)
- Slide size: 15%
- Filtro regional automático se `regionName` presente
- Loading state com Loader do Mantine

**Dependências**:
- `@mantine/carousel` (Carousel)
- `TrendingTopicSection` (componente de card)

---

#### `TrendingCarrocel`
**Localização**: `src/components/rss/slider/index.tsx`

**Descrição**: Carrossel configurável de literatura recente.

**Atributos**:
- `title?: string` - Título da seção (opcional, padrão: "Recent literature reviews")
- `rssString?: string` - Filtro RSS customizado (opcional)
- `allFilter?: string` - Filtro de país (opcional)
- `exploreAllLabel?: string` - Label do botão "Explore all" (opcional)

**Integrações**:
- **RSS Feed Service** (`FetchRSSFeed`): Busca 10 artigos
- **GlobalContext**: Acessa `globalConfig` e `regionName`

**Funcionalidades**:
- Carrossel responsivo (100% mobile, 50% tablet, 32% desktop)
- Botão "Explore all" que navega para `/recent-literature-reviews`
- Suporte a filtros customizados
- 3 slides por scroll

---

#### `TrendingTopicCard`
**Localização**: `src/components/rss/slider/index.tsx`

**Descrição**: Card individual para tópico em destaque.

**Atributos**:
- `title: string` - Título do tópico (obrigatório)
- `excerpt: string` - Resumo/excerpt (obrigatório)
- `href: string` - URL de destino (obrigatório)
- `height?: string` - Altura do card (opcional, padrão: undefined)

**Funcionalidades**:
- Card clicável com botão de ação
- Limita título a 140 caracteres
- Renderiza excerpt como HTML
- Botão com ícone de seta

</details>

---

### Sections (`components/sections/`)

<details>
<summary><b>Ver componentes de Sections</b></summary>

#### `HeroSection`
**Localização**: `src/components/sections/hero/HeroSection.tsx`

**Descrição**: Seção hero principal com slider, breadcrumbs e busca.

**Atributos**:
- `sliderImages?: AcfImageArray[] | string[]` - Imagens do slider (opcional)
- `breadcrumbs: BreadcrumbItem[]` - Array de breadcrumbs (obrigatório)
- `searchTitle?: string` - Título do formulário de busca (opcional)
- `searchSubtitle?: string` - Subtítulo do formulário (opcional)
- `small?: boolean` - Estilo reduzido (padrão: false)
- `blackColor?: boolean` - Cor preta para breadcrumbs (padrão: false)
- `className?: string` - Classe CSS adicional (opcional)

**Funcionalidades**:
- Combina `HeroSlider`, `BreadCrumbs` e `SearchForm`
- Container responsivo
- Suporte a múltiplos estilos

**Dependências**:
- `HeroSlider`, `BreadCrumbs`, `SearchForm`

---

#### `DimensionsSection`
**Localização**: `src/components/sections/index.tsx`

**Descrição**: Seção de cards de dimensões temáticas.

**Atributos**:
- `items?: ItemResource[]` - Array de itens customizados (opcional)
  - Se não fornecido, busca do WordPress

**Integrações**:
- **WordPress REST API** (`PostsApi`): Busca 20 posts do tipo "dimensions"

**Funcionalidades**:
- Renderiza cards de dimensões
- Se `items` fornecido, usa lista customizada
- Caso contrário, busca do WordPress
- Resolve URLs (externas ou `/dimensions/{slug}`)

**Dependências**:
- `TraditionalSectionCard` (componente interno)

---

#### `TraditionalSectionCard`
**Localização**: `src/components/sections/index.tsx`

**Descrição**: Card individual para seção tradicional.

**Atributos**:
- `iconPath: string` - URL do ícone/imagem (obrigatório)
- `title: string` - Título do card (obrigatório)
- `target?: string` - URL de destino (opcional, padrão: "/")
- `sm?: boolean` - Tamanho pequeno (opcional)

**Funcionalidades**:
- Card clicável que abre em nova aba
- Layout flexível com ícone e título
- Padding ajustável (20px se small, 40px se não)

---

---

#### `NewsSection`
**Localização**: `src/components/sections/news/index.tsx`

**Descrição**: Seção de notícias com cards em grid horizontal.

**Atributos**:
- `region?: string` - Filtro por região (opcional)
- `title?: string` - Título da seção (opcional)
- `posType?: string` - Tipo de post customizado (opcional, ex: "events", "news")
- `archive?: string` - Slug do arquivo para link "Explore more" (opcional)
- `includeDemo?: boolean` - Incluir posts com tag "demo" (padrão: false)
- `excludedTagIds?: number[]` - IDs de tags para excluir (opcional)

**Integrações**:
- **WordPress REST API** (`PostsApi`): Busca 4 posts
  - Se `posType` fornecido: busca posts do tipo customizado
  - Caso contrário: busca posts normais excluindo categoria "thematic-page"
- **Tag "demo"**: Detecta e marca posts com tag demo

**Funcionalidades**:
- Carrega 4 posts
- Suporte a filtros por região e exclusão de tags
- Cards em layout horizontal responsivo
- Link "Explore more" ou "Explore archived news"
- Detecta tag "demo" e marca visualmente

**Dependências**:
- `ResourceCard` (componente de card)
- `moment` (formatação de datas)

---

#### `NewsletterSection`
**Localização**: `src/components/sections/newsletter/index.tsx`

**Descrição**: Seção de newsletter com formulário de inscrição.

**Atributos**: Nenhum (componente sem props)

**Integrações**:
- **Mailchimp API** (`MailChimpService`): Inscreve email na lista

**Funcionalidades**:
- Formulário de email com validação
- Loading overlay durante submissão
- Redireciona para `/subscription` em sucesso
- Tratamento de erros (email já cadastrado, etc.)
- Background image de newsletter

**Dependências**:
- `@mantine/form` (validação de formulário)
- `MailChimpService` (integração com Mailchimp)

---

### Feed Components (`components/feed/`)

#### `NewsFeed`
**Localização**: `src/components/feed/news/index.tsx`

**Descrição**: Feed completo de notícias com filtros e paginação.

**Atributos**:
- `displayType: string` - Tipo de display: "column" ou "row" (obrigatório)
- `country?: string` - Filtro por país (opcional)
- `region?: string` - Filtro por região (opcional)
- `thematicArea?: string` - Filtro por área temática (slug) (opcional)

**Integrações**:
- **WordPress REST API** (`PostsApi`): Lista posts com paginação
- **Taxonomias**: Busca tags por slug para filtros iniciais

**Funcionalidades**:
- Paginação (12 itens por página)
- Filtros dinâmicos: Região, País, Área Temática, Ano de Publicação
- Filtros iniciais via URL (country, region, thematicArea)
- Grid responsivo (column ou row mode)
- Loading overlay fixo
- Contador de resultados
- Filtros laterais com `ResourceFilters`

**Dependências**:
- `ResourceFilters` (componente de filtros)
- `ResourceCard` (card de recurso)
- `Pagination` (componente de paginação)

---

#### `MultimediaFeed`
**Localização**: `src/components/feed/multimedia/index.tsx`

**Descrição**: Feed completo de recursos multimídia com filtros.

**Atributos**:
- `displayType: string` - Tipo de display: "column" ou "row" (obrigatório)
- `country?: string` - Filtro por país (opcional)
- `region?: string` - Filtro por região (opcional)
- `thematicArea?: string` - Filtro por área temática (opcional)
- `mediaType?: string` - Filtro por tipo de mídia (opcional)

**Integrações**:
- **Multimedia API** (`MultimediaService`): Busca recursos multimídia
- **GlobalContext**: Acessa `language` e `globalConfig`

**Funcionalidades**:
- Paginação (12 itens por página)
- Filtros dinâmicos da API de multimídia
- Suporte a múltiplos idiomas
- Filtros iniciais via URL
- Grid responsivo
- Tags: país, região, área temática
- Links abrem em nova aba (`target="_blank"`)

**Dependências**:
- `DefaultFeedFilterComponent` (filtros específicos de multimídia)
- `ResourceCard` (card de recurso)
- `Pagination` (componente de paginação)

</details>

---

**Nota**: Outros componentes de sections (`PageHeaderSection`, `ContentSection`, `ResourcesSection`, `NewsEventsSection`, `MultimediaSection`, `JournalsSection`, `FundingOpportunitiesSection`, `PeriodicalsSection`, etc.) seguem padrões similares de integração com WordPress REST API e APIs externas. Consulte os arquivos individuais em `src/components/sections/` para detalhes específicos.

**Nota**: Outros feeds (`EventsFeed`, `StoriesFeed`, `DatabaseAndRepositoriesFeed`, `JournalsFeed`, etc.) seguem padrões similares aos feeds documentados acima, adaptados para seus respectivos tipos de conteúdo e APIs.

</details>

---

## 📖 Documentação Adicional

- [Next.js Documentation](https://nextjs.org/docs)
- [Mantine UI Documentation](https://mantine.dev/)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)

