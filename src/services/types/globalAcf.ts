export interface RegionalItems {
  identificador: string;
  rest_api_prefix: string;
}

export interface RouteItems {
  url: string;
  redirect: string;
}

export interface GlobalConfigAcf {
  acf: {
    aside_tab_title: string;
    content_description: string;
    dimensions_description: string;
    footerimages: boolean;
    news_description: string;
    privacy_policy_url: string;
    regionais: RegionalItems[];
    route: RouteItems[];
    stories_description: string;
    terms_and_conditions_url: string;
    trending_description: string;
  };
}
