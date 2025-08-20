import { AcfImageArray } from "./featuredStoriesAcf";

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
  caption: Caption;
}

interface Caption {
  rendered: string;
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

export interface ListPostsDto {
  totalItems: number;
  totalPages?: number;
  data: Post[];
  regions: Term[];
  tags: Term[];
  dates: string[];
  dimensions: Term[];
  countries: Term[];
}

export interface ThematicPageAcfProps {
  search: {
    title: string;
    subtitle: string;
    slider_images: AcfImageArray[];
  };
  title: string;
  content: string;
  comunity_initiatives_title: string;
  community_iniciatives: CommunityInitiative[];
  similar_themes: SimilarTheme[];
  news_tag_filter: string;
  events_tag_filter: string;
  show_more_news_link: string;
  show_more_events_link: string;
  multimedia_items: ACFMultimediaItem[];
  more_media_url: string;
  rss_filter: string;
}

export interface CommunityInitiative {
  label: string;
  url: string;
}

export interface SimilarTheme {
  title: string;
  image: string;
  url: string;
}

export interface ACFMultimediaItem {
  image: string;
  title: string;
  url: string;
}

export interface CountryAcfProps {
  content: string;
  slide_images: AcfImageArray[];
  resources: CountryAcfResource[];
  key_resources: Array<KeyResource>;
  embed_content: string;
  rss_filter: string;
  multimedia_filter: string;
  manual_media: MediaItem[];
  tms_items: TmsItem[];
}

export interface TmsItem {
  title: string;
  url: string;
  image: string;
}

export interface MediaItem {
  image: AcfImageArray;
  title: string;
  url: string;
}

export interface CountryAcfResource {
  icon: string;
  title: string;
  url: string;
}

export interface KeyResource {
  text: string;
  url: string;
}

export interface ItemResource {
  title: string;
  url: string;
  icon: string;
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
  lang: string;
  translations: {
    [key: string]: number;
  };
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
