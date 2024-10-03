interface ImageSizes {
  thumbnail: string;
  "thumbnail-width": number;
  "thumbnail-height": number;
  medium: string;
  "medium-width": number;
  "medium-height": number;
  medium_large: string;
  "medium_large-width": number;
  "medium_large-height": number;
  large: string;
  "large-width": number;
  "large-height": number;
  "1536x1536": string;
  "1536x1536-width": number;
  "1536x1536-height": number;
  "2048x2048": string;
  "2048x2048-width": number;
  "2048x2048-height": number;
  "bg-header": string;
  "bg-header-width": number;
  "bg-header-height": number;
  news: string;
  "news-width": number;
  "news-height": number;
  "stories-lg": string;
  "stories-lg-width": number;
  "stories-lg-height": number;
  "stories-sm": string;
  "stories-sm-width": number;
  "stories-sm-height": number;
}

export interface AcfImageArray {
  ID: number;
  id: number;
  title: string;
  filename: string;
  filesize: number;
  url: string;
  link: string;
  alt: string;
  author: string;
  description: string;
  caption: string;
  name: string;
  status: string;
  uploaded_to: number;
  date: string;
  modified: string;
  menu_order: number;
  mime_type: string;
  type: string;
  subtype: string;
  icon: string;
  width: number;
  height: number;
  sizes: ImageSizes;
}

export interface FeaturedStoriesSession {
  background?: string;
  imagem: AcfImageArray;
  content: string;
}

export interface FeaturedStoriesAcf {
  first_session: FeaturedStoriesSession;
  second_session: FeaturedStoriesSession;
  third_session: FeaturedStoriesSession;
}
