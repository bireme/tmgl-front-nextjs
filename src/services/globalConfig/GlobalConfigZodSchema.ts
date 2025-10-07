import { z } from "zod";

const RegionalItemsSchema = z.object({
  identificador: z.string(),
  rest_api_prefix: z.string(),
});

const RouteItemsSchema = z.object({
  url: z.string(),
  redirect: z.string(),
});

const FooterImagesSchema = z.object({
  url: z.string(),
  image: z.string(),
});

const RegionFilterSchema = z.object({
  region_prefix: z.string(),
  region_filter: z.string(),
});

export const GlobalConfigAcfSchema = z.object({
  acf: z.object({
    who_tm_global_summit_description: z.string(),
    aside_tab_title: z.string(),
    content_description: z.string(),
    dimensions_description: z.string(),
    footerimages: z.array(FooterImagesSchema),
    news_description: z.string(),
    privacy_policy_url: z.string(),
    regionais: z.array(RegionalItemsSchema),
    evidence_maps_priority: z.array(z.string()),
    legislations_description: z.string(),
    tm_research_analytics_descriptor: z.string(),
    route: z.array(RouteItemsSchema),
    stories_description: z.string(),
    journals_description: z.string().optional(),
    evidence_maps_description: z.string().optional(),
    multimedia_description: z.string().optional(),
    terms_and_conditions_url: z.string(),
    trending_description: z.string(),
    events_description: z.string(),
    database_repositories_descriptions: z.string().optional(),
    filter_rss: z.string().optional(),
    region_filters: z.array(RegionFilterSchema),
    thematic_area_description: z.string().optional(),
    thematic_page_tag: z.number(),
  }),
});

// Define o tipo a partir do schema (usado onde precisar tipar manualmente)
export type GlobalConfigAcf = z.infer<typeof GlobalConfigAcfSchema>;
