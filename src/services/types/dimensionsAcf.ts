import { AcfImageArray } from "./featuredStoriesAcf";

export interface DimensionsAcf {
  long_title: string;
  cover_image: AcfImageArray;
  external_link: string;
  related_resources: DimensionRelatedResources[];
  rss_feed: string;
}

export interface DimensionRelatedResources {
  icon: string;
  title: string;
  target: string;
}
