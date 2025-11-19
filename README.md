## TMGL Front — Visão Geral

Portal Next.js/TypeScript que consome conteúdo gerenciado no WordPress e expõe módulos temáticos para iniciativas TMGL/BIREME. Abaixo está um resumo rápido da arquitetura para facilitar onboarding.

### Estrutura de Rotas (`src/pages`)
- `index.tsx`: home com hero, destaques e blocos configuráveis via WordPress.
- `multimedia`, `news`, `events`, `journals`, `global-summit`, `databases-and-repositories`, `regulations-and-policies`, `recent-literature-reviews`, `subscription`: páginas de listagem especializadas.
- Rotas dinâmicas: `news/[slug]`, `events/[slug]`, `featured-stories/[slug]`, `dimensions/[slug]`, `evidence-maps/[id]`, `thematic-page/[slug]/index.tsx`, `content/[slug]` e grupo `[region]/[...customRoute]` para páginas regionais.
- API routes (`src/pages/api`): wrappers para integrações externas (`bibliographic`, `direve`, `evidencemaps`, `journals`, `legislations`, `lis`, `multimedia`, `rssfeed`) e utilidades (`check-thumbnails`, `pdf-image`, `proxy-pdf`, `video-thumbnail`, `subscribe`).

### Componentes
- `components/layout`: `header`, `footer` e helpers responsivos.
- `components/sections`: blocos de conteúdo reutilizáveis (hero, notícias, multimídia, recursos, newsletter, topics, etc.).
- `components/feed`: renderizadores de listas e paginação para cada domínio (notícias, journals, multimedia, events, etc.).
- `components/forms`: formulários de filtro e busca.
- `components/multitab`, `cards`, `breadcrumbs`, `slider`, `video`, `pdfview`, `share`, `rss`: widgets auxiliares.
- `components/gpt`: superfície para integrações de IA (embeds ou chat).

### Contexto e Configuração
- `contexts/globalContext.tsx` e `GlobalConfigLoader`: carregam configurações globais (menus, textos, idiomas) e expõem via React Context.
- `_app.tsx` aplica tema Mantine (`styles/mantine-theme.ts`) e estilos globais (`styles/custom-global.scss`, `_mantine.scss`).

### Serviços e Dados
- `services/`: clientes tipados para WordPress REST e APIs externas. Inclui `apiRepositories`, `media`, `menus`, `pages`, `posts`, `rss`, `settings`, `taxonomies` e `mailchimp`.
- `services/globalConfig`: leitura de configurações remotas/cacheadas.
- `services/types`: contratos compartilhados.
- `data/mocks`: fixtures para desenvolvimento offline, incluindo respostas de APIs externas (`api-external`) e WordPress (`wp-api`).

### Helpers e Tipagens
- `helpers/`: utilitários como `colors`, `regions`, `stringhelper`, `crypto`.
- `types/` e `src/types/@types`: definições d.ts customizadas (ex.: `pdf-poppler`).

### Assets e Público
- `public/`: logotipos, vídeos, PDFs pré-processados e imagens para cards, eventos, newsletters etc.
- `public/local`: assets offline/localizados.

### Como executar
```
npm run dev
# ou
yarn dev
# ou
bun dev
```
Aplicação disponível em `http://localhost:3000`.

### Referências
- Next.js: https://nextjs.org/
- Mantine UI: https://mantine.dev/
- WordPress REST API: https://developer.wordpress.org/rest-api/
