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
  "wp:attachment": Array<{ href: string }>;
  curies: Array<{ name: string; href: string; templated: boolean }>;
}

export interface Page {
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
  parent: number;
  menu_order: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: Meta;
  class_list: string[];
  acf: any;
  _links: Links;
}
