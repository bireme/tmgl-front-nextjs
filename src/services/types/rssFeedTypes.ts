export interface ArticleDTO {
  title: string;
  author: string;
  source: string;
  link: string;
  description: string;
  guid: GuidDTO;
}

export interface GuidDTO {
  _: string; // Identificador único do artigo
  $: {
    isPermaLink: string; // Indica se é um link permanente
  };
}
