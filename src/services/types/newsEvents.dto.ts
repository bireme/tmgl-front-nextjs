/**
 * DTO genérico para componentes de News e Events
 * Contém apenas os campos necessários para renderização
 */
export interface NewsEventsItem {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      id: number;
      media_details: {
        sizes: {
          thumbnail: {
            source_url: string;
            width: number;
            height: number;
          };
          medium?: {
            source_url: string;
            width: number;
            height: number;
          };
          large?: {
            source_url: string;
            width: number;
            height: number;
          };
          full?: {
            source_url: string;
            width: number;
            height: number;
          };
        };
      };
      source_url: string;
    }>;
  };
}

/**
 * Props genéricas para seções de News e Events
 */
export interface NewsEventsSectionProps {
  news: NewsEventsItem[];
  events: NewsEventsItem[];
  newsTitle?: string;
  otherNewsTitle?: string;
  eventsTitle?: string;
  otherEventsTitle?: string;
  showMoreNewsLink?: string;
  showMoreEventsLink?: string;
  exploreAllLabel?: string;
  className?: string;
}
