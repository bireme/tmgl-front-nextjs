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
  thematicAreas: Term[];
}

export interface ThematicPageAcfProps {
  disclaimer?: string;
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
  featured_stories_label: string;
  show_more_events_link: string;
  multimedia_items: ACFMultimediaItem[];
  more_media_url: string;
  rss_filter: string;
  resources: ACFMultimediaItem[];
  news_title?: string;
  other_news_title?: string;
  events_title?: string;
  releated_video_title?: string;
  recent_literature_reviews_title?: string;
  resources_title?: string;
  explore_all_label?: string;
  similar_themes_title?: string;
  colaboration_network_title?: string;
  other_events_title?: string;
  fetured_stories_items?: ResumedPost[];
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

export interface AcfOtherVersionItem {
  description: string;
  link: string;
}

export interface CountryAcfProps {
  layout: string;
  disclaimer?: string;
  stories_url: string;
  content: string;
  other_version: AcfOtherVersionItem;
  other_funding_title?: string;
  other_periodicals_title?: string;
  founding_oportunity_title: string;
  periodicals_title: string;
  slide_images: AcfImageArray[];
  resources_title: string;
  resources: CountryAcfResource[];
  key_resources: Array<KeyResource>;
  embed_title: string;
  embed_content: string;
  rss_filter: string;
  multimedia_filter: string;
  multimedia_title: string;
  api_filter: string;
  manual_media: MediaItem[] | false;
  tms_title: string;
  tms_items: TmsItem[] | false;
  translate_labels: TranslateLabels;
  events_title: string;
  news_title: string;
  stories_title: string;
  stories_button_label: string;
  research_block_title: string;
  research_block_content: string;
  founding_oportunity_heading: HeadingItem;
  founding_oportunities_items?: smallItemObj[];
  periodicals_heading: HeadingItem;
  periodical_items?: smallItemObj[];
  search_institute_title: string;
  search_institute_items: CountryAcfResource[];
  search_group_title: string;
  search_group_items: CountryAcfResource[];
}

export interface smallItemObj {
  title?: string;
  url?: string;
}

export interface TmsItem {
  title: string;
  url: string;
  image: string;
  description?: string;
  tooltip_description?: string;
}

export interface MediaItem {
  image: AcfImageArray;
  title: string;
  url: string;
}

export interface CountryAcfResource {
  image?: string;
  icon: string | string;
  title: string;
  url: string;
}

export interface KeyResource {
  text: string;
  url: string;
}

export interface TranslateLabels {
  news_label: string;
  events_label: string;
  rss_label: string;
  rss_see_more_label: string;
  periodics_label: string;
  key_resources_label: string;
}

export interface HeadingItem {
  title: string;
  image: string | false;
  description: string;
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

export interface ResumedPost {
  ID: number;
  post_author: string;
  post_date: string;
  post_date_gmt: string;
  post_content: string;
  post_title: string;
  post_excerpt: string;
  post_status: string;
  comment_status: string;
  ping_status: string;
  post_password: string;
  post_name: string;
  to_ping: string;
  pinged: string;
  post_modified: string;
  post_modified_gmt: string;
  post_content_filtered: string;
  post_parent: number;
  guid: string;
  menu_order: number;
  post_type: string;
  post_mime_type: string;
  comment_count: string;
  filter: string;
}
