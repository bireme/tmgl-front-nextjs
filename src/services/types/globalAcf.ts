export interface RegionalItems {
  identificador: string;
  rest_api_prefix: string;
}

export interface RouteItems {
  url: string;
  redirect: string;
}

export interface FooterImages {
  url: string;
  image: string;
}

export interface RegionFilter {
  region_prefix: string;
  region_filter: string;
}

export interface GlobalConfigAcf {
  acf: {
    aside_tab_title: string;
    content_description: string;
    dimensions_description: string;
    footerimages: FooterImages[];
    news_description: string;
    privacy_policy_url: string;
    regionais: RegionalItems[];
    evidence_maps_priority: Array<string>;
    legislations_description: string;
    tm_research_analytics_descriptor: string;
    route: RouteItems[];
    stories_description: string;
    journals_description?: string;
    evidence_maps_description?: string;
    terms_and_conditions_url: string;
    trending_description: string;
    events_description: string;
    database_repositories_descriptions?: string;
    filter_rss?: string;
    region_filters: RegionFilter[];
  };
}
