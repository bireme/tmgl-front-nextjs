# NewsEventsSection - Componente Genérico

Este componente foi refatorado para ser mais genérico e reutilizável, utilizando um DTO específico que contém apenas os campos necessários.

## DTO Genérico

O componente agora utiliza `NewsEventsItem` em vez de `Post` completo, contendo apenas:

- `id`: ID do item
- `slug`: Slug para URLs
- `title.rendered`: Título renderizado
- `excerpt.rendered`: Resumo renderizado
- `featured_media`: ID da mídia destacada
- `_embedded`: Dados embarcados da mídia destacada

## Como usar

```tsx
import { NewsEventsSection } from '@/components/sections/newsEvents/NewsEventsSection';
import { NewsEventsItem } from '@/services/types/newsEvents.dto';

// Exemplo de dados
const newsData: NewsEventsItem[] = [
  {
    id: 1,
    slug: 'exemplo-noticia',
    title: { rendered: 'Título da Notícia' },
    excerpt: { rendered: 'Resumo da notícia...' },
    featured_media: 123,
    _embedded: {
      'wp:featuredmedia': [{
        id: 123,
        media_details: {
          sizes: {
            thumbnail: { source_url: 'url-thumbnail', width: 150, height: 150 },
            medium: { source_url: 'url-medium', width: 300, height: 200 },
            large: { source_url: 'url-large', width: 600, height: 400 },
            full: { source_url: 'url-full', width: 1200, height: 800 }
          }
        },
        source_url: 'url-original'
      }]
    }
  }
];

const eventsData: NewsEventsItem[] = [
  // ... dados similares para eventos
];

// Uso do componente
<NewsEventsSection
  news={newsData}
  events={eventsData}
  newsTitle="Notícias"
  eventsTitle="Eventos"
  otherNewsTitle="Outras Notícias"
  otherEventsTitle="Outros Eventos"
  showMoreNewsLink="/news"
  showMoreEventsLink="/events"
  exploreAllLabel="Ver todos"
/>
```

## Vantagens

1. **Menor dependência**: Não depende mais do tipo `Post` completo
2. **Melhor performance**: Menos dados transferidos
3. **Mais genérico**: Pode ser usado com qualquer fonte de dados que implemente `NewsEventsItem`
4. **Type safety**: Mantém a segurança de tipos do TypeScript
5. **Reutilizável**: Pode ser usado em diferentes contextos sem depender da API do WordPress

## Migração

Para migrar de `Post[]` para `NewsEventsItem[]`, você pode criar uma função de mapeamento:

```tsx
const mapPostToNewsEventsItem = (post: Post): NewsEventsItem => ({
  id: post.id,
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  featured_media: post.featured_media,
  _embedded: post._embedded
});
```
