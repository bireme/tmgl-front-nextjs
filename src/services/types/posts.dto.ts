interface Guid {
  rendered: string;
}

interface Title {
  rendered: string;
}

interface Content {
  rendered: string;
  protected: boolean;
}

interface Excerpt {
  rendered: string;
  protected: boolean;
}

interface Meta {
  _acf_changed: boolean;
  _monsterinsights_skip_tracking: boolean;
  _monsterinsights_sitenote_active: boolean;
  _monsterinsights_sitenote_note: string;
  _monsterinsights_sitenote_category: number;
  footnotes: string;
}

interface Links {
  self: Array<{ href: string }>;
  collection: Array<{ href: string }>;
  about: Array<{ href: string }>;
  author: Array<{ embeddable: boolean; href: string }>;
  replies: Array<{ embeddable: boolean; href: string }>;
  "version-history": Array<{ count: number; href: string }>;
  "predecessor-version": Array<{ id: number; href: string }>;
  "wp:featuredmedia": Array<{ embeddable: boolean; href: string }>;
  "wp:attachment": Array<{ href: string }>;
  "wp:term": Array<{ taxonomy: string; embeddable: boolean; href: string }>;
  curies: Array<{ name: string; href: string; templated: boolean }>;
}

interface Thumbnail {
  source_url: string;
  width: number;
  height: number;
}

interface MediaDetails {
  sizes: {
    thumbnail: Thumbnail;
    medium?: Thumbnail;
    large?: Thumbnail;
    full?: Thumbnail;
  };
}

interface FeaturedMedia {
  id: number;
  media_details: MediaDetails;
  source_url: string;
}

interface Term {
  id: number;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
}

interface Embedded {
  "wp:featuredmedia": FeaturedMedia[];
  "wp:term": Term[][];
}

export interface Post {
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
  content: Content;
  excerpt: Excerpt;
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: Meta;
  categories: number[];
  tags: any[];
  class_list: string[];
  acf: any;
  _links: Links;
  _embedded?: Embedded;
}

export interface AcfMultTab {
  Itens: MultTabItems[];
}

export interface MultTabItems {
  tab_name: string;
  tab_items?: MultTabItem[];
}

export interface MultTabItem {
  item_name: string;
  item_content?: string;
}
