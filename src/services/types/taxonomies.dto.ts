export interface Link {
  href: string;
}

export interface Links {
  collection: Link[];
  wp_items: Link[];
  curies: { name: string; href: string; templated: boolean }[];
}

export interface TaxonomyDTO {
  name: string;
  slug: string;
  description: string;
  types: string[];
  hierarchical: boolean;
  rest_base: string;
  rest_namespace: string;
  _links: Links;
}

export interface Link {
  href: string;
}

interface Curies {
  name: string;
  href: string;
  templated: boolean;
}

interface TermLinks {
  self: Link[];
  collection: Link[];
  about: Link[];
  "wp:post_type": Link[];
  curies: Curies[];
}

export interface TaxonomyTermDTO {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: any[]; // You can replace `any[]` with the actual structure if you know it
  acf: any[]; // You can replace `any[]` with the actual structure if you know it
  _links: TermLinks;
}
