import { ItemResource, TmsItem } from "./posts.dto";

import { AcfImageArray } from "./featuredStoriesAcf";

export interface AcfSearch {
  title: string;
  subtitle: string;
  slide_image_1?: number;
  slide_image_2?: number;
  slide_image_3?: number;
  slide_image_4?: number;
  slide_image_5?: number;
  slide_image_6?: number;
}

export interface AcfEvents {
  title?: string;
  subtitle?: string;
  webcast?: string;
  meeting?: string;
  repport?: string;
  background?: AcfImageArray;
}

interface AcfTmd {
  title: string;
  subtitle: string;
  dimensions?: any;
  background_image: AcfImageArray;
  explore_page?: AcfPageObject | false;
}

interface AcfModalHome {
  show_modal: string;
  modal_content: string;
}

interface AcfPageObject {
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

export interface HomeAcf {
  search: AcfSearch;
  text_trending_topics: string;
  events: AcfEvents;
  shortcode_newsletter: string;
  tmd: AcfTmd;
  url_trending_topics: string;
  url_featured_stories: string;
  url_events: string;
  url_news: string;
  modal_home: AcfModalHome;
  itens: ItemResource[];
  manual_media: TmsItem[];
  region_resources_title: string;
  region_resources_subtitle: string;
  resources: ItemResource[];
  collaboration_network_items: AcfImageArray[];
}
