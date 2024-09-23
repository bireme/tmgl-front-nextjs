interface AcfSearch {
  title: string;
  subtitle: string;
  slide_image_1?: number;
  slide_image_2?: number;
  slide_image_3?: number;
  slide_image_4?: number;
  slide_image_5?: number;
  slide_image_6?: number;
}

interface AcfEvents {
  title: string;
  subtitle: string;
  webcast?: string;
  meeting?: string;
  repport?: string;
}

interface AcfTmd {
  title: string;
  subtitle: string;
}

interface AcfModalHome {
  show_modal: string;
  modal_content: string;
}

interface HomeAcf {
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
}
