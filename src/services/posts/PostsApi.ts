import { ListPostsDto, Post } from "../types/posts.dto";
import { TaxonomyDTO, TaxonomyTermDTO } from "../types/taxonomies.dto";
import {
  createUrlParametersFilter,
  decodeHtmlEntities,
} from "@/helpers/stringhelper";

import { BaseUnauthenticatedApi } from "../BaseUnauthenticatedApi";
import { TagItem } from "@/components/feed/resourceitem";
import { TaxonomiesApi } from "../taxonomies/TaxonomiesApi";
import { queryType } from "../types/resources";

export type GetCustomPostOptions = {
  /** ID único ou lista de IDs de tag */
  tagId?: number | number[];
  /** Se true, usa tags_exclude (default: incluir com tags) */
  excludeTag?: boolean;
  catId?: number | number[];
  excludeCat?: boolean;
  /** ID único ou lista de IDs de país */
  countryId?: number | number[];
  excludeCountry?: boolean;
};

export class PostsApi extends BaseUnauthenticatedApi {
  public constructor(region?: string) {
    super(`${region ? region + "/" : ""}wp-json/wp/v2/`);
    if (region) this._region = region;
  }

  public async getTaxonomies(): Promise<TaxonomyDTO[]> {
    const { data } = await this._api.get(`taxonomies`);
    return data;
  }

  public async getTaxonomiesBySlug(
    taxSlug: string
  ): Promise<TaxonomyTermDTO[]> {
    const { data } = await this._api.get(`${taxSlug}`);
    return data;
  }

  public async getCategoryBySlug(slug: string) {
    const { data } = await this._api.get(
      `categories?slug=${encodeURIComponent(slug)}&per_page=100`
    );
    return Array.isArray(data) && data.length ? data[0] : null;
  }

  public async getCustomPost(
    postTypeSlug: string,
    perPage?: number,
    parent?: number,
    region?: number[],
    regionString?: string,
    options?: GetCustomPostOptions
  ): Promise<Post[]> {
    if (regionString) {
      const _taxApi = new TaxonomiesApi();
      const taxonomies = await _taxApi.getTaxonomies("region");
      const hit = taxonomies?.find(
        (t) => t?.name == regionString || t?.slug == regionString
      );
      if (hit) region = [hit.id];
    }

    // tags
    let tagQuery = "";
    if (options?.tagId !== undefined) {
      const ids = Array.isArray(options.tagId)
        ? options.tagId
        : [options.tagId];
      if (ids.length > 0) {
        tagQuery = options.excludeTag
          ? `&tags_exclude=${ids.join(",")}`
          : `&tags=${ids.join(",")}`;
      }
    }

    // categorias
    let catQuery = "";
    let catIds: number[] = [];
    if (options?.catId !== undefined) {
      catIds = Array.isArray(options.catId) ? options.catId : [options.catId];
      if (catIds.length > 0) {
        catQuery = options.excludeCat
          ? `&categories_exclude=${catIds.join(",")}`
          : `&categories=${catIds.join(",")}`;
      }
    }

    // países
    let countryQuery = "";
    if (options?.countryId !== undefined) {
      const countryIds = Array.isArray(options.countryId) ? options.countryId : [options.countryId];
      if (countryIds.length > 0) {
        countryQuery = options.excludeCountry
          ? `&country_exclude=${countryIds.join(",")}`
          : `&country=${countryIds.join(",")}`;
      }
    }

    const url =
      `${postTypeSlug}?per_page=${perPage ?? process.env.POSTSPERPAGE}` +
      `&_embed&orderby=date&order=desc&acf_format=standard` +
      `${parent !== undefined && parent >= 0 ? `&parent=${parent}` : ""}` +
      `${region && region.length ? `&region=${region.join(",")}` : ""}` +
      `${tagQuery}${catQuery}${countryQuery}` +
      `&${
        this._lang == "en"
          ? postTypeSlug === "posts" || postTypeSlug === "pages"
            ? `lang=${this._lang}`
            : ""
          : `lang=${this._lang}`
      }`;
    console.log(url);
    const { data } = await this._api.get(url);

    if (options?.excludeCat && catIds.length > 0 && Array.isArray(data)) {
      const exclude = new Set(catIds);
      // WP expõe 'categories' para posts e para CPTs que suportam 'category'
      return data.filter((p: any) => {
        const cats: number[] = Array.isArray(p?.categories) ? p.categories : [];
        return cats.every((id) => !exclude.has(id));
      });
    }

    // Filtragem adicional para tags (caso o WordPress não respeite tags_exclude)
    if (options?.excludeTag && options?.tagId && Array.isArray(data)) {
      const excludeTagIds = Array.isArray(options.tagId) ? options.tagId : [options.tagId];
      const exclude = new Set(excludeTagIds);
      
      return data.filter((p: any) => {
        // Verificar tags diretas do post
        const postTags: number[] = Array.isArray(p?.tags) ? p.tags : [];
        if (postTags.some((id) => exclude.has(id))) {
          return false;
        }
        
        // Verificar tags via _embedded["wp:term"]
        const embeddedTags = p?._embedded?.["wp:term"]?.flat() || [];
        const wpTags = embeddedTags.filter((term: any) => term.taxonomy === "post_tag");
        const wpTagIds = wpTags.map((tag: any) => tag.id);
        
        return !wpTagIds.some((id: number) => exclude.has(id));
      });
    }

    return data;
  }

  public async listPosts(
    postTypeSlug: string,
    perPage: number,
    page: number,
    queryItems?: Array<queryType>
  ): Promise<ListPostsDto> {
    const response = await this._api.get<Post[]>(
      `${postTypeSlug}?per_page=${
        perPage ? perPage : process.env.POSTSPERPAGE
      }&page=${page}&_embed&orderby=date&order=desc&acf_format=standard${
        queryItems ? `${createUrlParametersFilter(queryItems)}` : ""
      }`
    );

    console.log(`${postTypeSlug}?per_page=${
        perPage ? perPage : process.env.POSTSPERPAGE
      }&page=${page}&_embed=wp:term&orderby=date&order=desc&acf_format=standard${
        queryItems ? `${createUrlParametersFilter(queryItems)}` : ""
      }`);

    if (!this._region) {
      const [regions, tags, dimensions, countries] = await Promise.all([
        this._api.get("/region?per_page=100"),
        this._api.get("/tags?per_page=100"),
        this._api.get("/tm-dimension?per_page=100"),
        this._api.get("/country?per_page=100"),
      ]);
      return {
        data: response.data,
        totalItems: parseInt(response.headers["x-wp-total"], 10),
        totalPages: parseInt(response.headers["x-Wp-totalpages"], 1),
        regions: regions.data,
        tags: tags.data,
        dates: response.data.map((d) => d.date),
        dimensions: dimensions.data,
        countries: countries.data,
        thematicAreas: tags.data,
      };
    } else {
      const [regions] = await Promise.all([
        this._api.get("/tags?per_page=100"),
      ]);
      return {
        data: response.data,
        totalItems: parseInt(response.headers["x-wp-total"], 10),
        totalPages: parseInt(response.headers["x-Wp-totalpages"], 1),
        regions: regions.data,
        dates: response.data.map((d) => d.date),
        tags: [],
        dimensions: [],
        countries: [],
        thematicAreas: [],
      };
    }
  }

  public formatTags(item: Post): TagItem[] {
    const countries = item._embedded?.["wp:term"]
      ?.flat()
      .filter((term) => term.taxonomy === "country");

    let countryTags: TagItem[] = [];

    if (countries) {
      countryTags = countries.map((c) => ({
        name: decodeHtmlEntities(c.name),
        type: "country",
      }));
    }

    const regions = item._embedded?.["wp:term"]
      ?.flat()
      .filter((term) => term.taxonomy === "region");

    let regionTags: TagItem[] = [];

    if (regions) {
      regionTags = regions.map((c) => ({
        name: decodeHtmlEntities(c.name),
        type: "region",
      }));
    }

    // Buscar tags de tm-dimension (descriptors)
    const dimensions = item._embedded?.["wp:term"]
      ?.flat()
      .filter((term) => term.taxonomy === "tm-dimension");

    let dimensionTags: TagItem[] = [];

    if (dimensions) {
      dimensionTags = dimensions.map((c) => ({
        name: decodeHtmlEntities(c.name),
        type: "descriptor",
      }));
    }

    // Buscar tags regulares (post_tag)
    const postTags = item._embedded?.["wp:term"]
      ?.flat()
      .filter((term) => term.taxonomy === "post_tag");

    let regularTags: TagItem[] = [];

    if (postTags) {
      regularTags = postTags.map((c) => ({
        name: decodeHtmlEntities(c.name),
        type: "descriptor",
      }));
    }

    return countryTags.concat(regionTags).concat(dimensionTags).concat(regularTags);
  }

  public async getTagBySlug(slug: string): Promise<any[]> {
    try {
      const { data } = await this._api.get(
        `tags?slug=${encodeURIComponent(slug)}`
      );
      return data; // retorna todos os objetos da tag
    } catch (error) {
      console.error("Erro ao buscar tag por slug:", error);
      return [];
    }
  }

  public async getCountryBySlug(slug: string): Promise<any[]> {
    try {
      const { data } = await this._api.get(
        `country?slug=${encodeURIComponent(slug)}`
      );
      return data; // retorna todos os objetos do termo de país
    } catch (error) {
      console.error("Erro ao buscar país por slug:", error);
      return [];
    }
  }

  public async getPostByAcfMetaKey(
    postTypeSlug: string,
    metavalue: string,
    metakey: string
  ) {
    const { data } = await this._api.get(
      `${postTypeSlug}?meta_key=${metakey}&meta_value=${metavalue}&_embed&acf_format=standard&per_page=100`
    );
    return data;
  }

  public async getPost(postTypeSlug: string, slug: string, lang?: string) {
    const targetLang = lang || this._lang;
    const { data } = await this._api.get(
      `${postTypeSlug}?slug=${slug}&_embed&acf_format=standard&lang=${targetLang}`
    );
    //Verify if the client is using another language
    const foundPost = data[0];
    if (foundPost) {
      if (foundPost?.lang != targetLang) {
        //In that case the lang returned is not the same as the user is trying to access, may because de slug is in a diferent language
        //Lets see if there is any translation to this post
        if (foundPost.translations) {
          if (Object.keys(foundPost.translations).length > 0) {
            if (foundPost.translations[targetLang]) {
              const translated_postId: number =
                foundPost.translations[targetLang];
              const transalated_response = await this._api.get(
                `${postTypeSlug}/${translated_postId}?_embed&acf_format=standard&lang=${targetLang}`
              );
              return [transalated_response.data];
            }
          }
        }
      }
    }

    return data;
  }

  public async getPostById(postTypeSlug: string, id: string) {
    const { data } = await this._api.get(`${postTypeSlug}/${id}`);
    return data;
  }

  public getPostCategories(post: Post): string[] {
    const categories = post._embedded?.["wp:term"]?.filter(
      (i) => i[0]?.taxonomy == "category"
    )[0];

    if (categories && categories.length > 0) {
      return categories
        .map((category) => category.name)
        .filter((i) => i != "Uncategorized");
    } else {
      return [];
    }
  }

  public getPostTags(post: Post): string[] {
    const categories = post._embedded?.["wp:term"]?.filter(
      (i) => i[0]?.taxonomy == "post_tag"
    )[0];

    if (categories && categories.length > 0) {
      return categories
        .map((category) => category.name)
        .filter((i) => i != "Uncategorized");
    } else {
      return [];
    }
  }

  /**
   * Busca a featured image de um post pelo ID e retorna a URL como string
   * @param postId - ID do post
   * @param size - Tamanho da imagem desejado (thumbnail, medium, large, full)
   * @returns URL da featured image ou string vazia se não encontrada
   */
  public async getFeaturedImageById(postId: number, size: string = "medium"): Promise<string> {
    try {
      const { data } = await this._api.get(`media?parent=${postId}&per_page=1`);
      
      if (data && data.length > 0) {
        const media = data[0];
        const sizes = media.media_details?.sizes;
        
        if (sizes) {
          // Ordem de prioridade para fallback
          const order = ["thumbnail", "medium", "large", "full"] as const;
          
          if (size && size !== "full") {
            const url = sizes[size as keyof typeof sizes]?.source_url;
            if (url) return url;
          } else if (size === "full") {
            const url = sizes.full?.source_url;
            if (url) return url;
          }
          
          // Fallback para qualquer tamanho disponível
          for (const key of order) {
            const candidate = sizes[key]?.source_url;
            if (candidate) {
              return candidate;
            }
          }
        }
        
        // Fallback para source_url original
        return media.source_url || "";
      }
      
      return "";
    } catch (error) {
      console.error("Error while trying to get featured image:", error);
      return "";
    }
  }
}
