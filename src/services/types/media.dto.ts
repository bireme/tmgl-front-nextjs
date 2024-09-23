// Representa o GUID do arquivo
interface Guid {
  rendered: string;
}

// Representa o título do arquivo
interface Title {
  rendered: string;
}

// Representa os diferentes tamanhos da mídia
interface MediaSize {
  file: string;
  width: number;
  height: number;
  mime_type: string;
  source_url: string;
}

// Detalhes da mídia, incluindo tamanhos disponíveis e metadados da imagem
interface MediaDetails {
  width: number;
  height: number;
  file: string;
  sizes: {
    thumbnail?: MediaSize;
    medium?: MediaSize;
    large?: MediaSize;
    full?: MediaSize;
    [key: string]: MediaSize | undefined; // Permite outros tamanhos de imagem personalizados
  };
  image_meta: {
    aperture: string;
    credit: string;
    camera: string;
    caption: string;
    created_timestamp: string;
    copyright: string;
    focal_length: string;
    iso: string;
    shutter_speed: string;
    title: string;
    orientation: string;
    keywords: string[];
  };
}

// Links associados à mídia (para API REST)
interface Links {
  self: Array<{ href: string }>;
  collection: Array<{ href: string }>;
}

// DTO principal para a resposta da API de mídia
export interface MediaResponse {
  id: number;
  date: string;
  date_gmt: string;
  guid: Guid;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: Title;
  author: number;
  comment_status: string;
  ping_status: string;
  meta: any[]; // Pode ser um array vazio ou outros valores
  template: string;
  alt_text: string; // Texto alternativo para a imagem
  media_type: string; // Tipo da mídia (geralmente "image")
  mime_type: string; // MIME type da mídia (geralmente "image/jpeg")
  media_details: MediaDetails; // Detalhes da mídia, incluindo tamanhos
  source_url: string; // URL da mídia original
  _links: Links; // Links relacionados à API REST
}
