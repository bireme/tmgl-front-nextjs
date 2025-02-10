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

export class PostsApi extends BaseUnauthenticatedApi {
  public constructor(region?: string) {
    super(`${region ? region + "/" : ""}wp-json/wp/v2/`);
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

  public async getCustomPost(
    postTypeSlug: string,
    perPage?: number,
    parent?: number,
    region?: number[],
    regionString?: string
  ): Promise<Post[]> {
    if (regionString) {
      const _taxApi = new TaxonomiesApi();
      const taxonomies = await _taxApi.getTaxonomies("region");
      if (taxonomies) {
        const filteredRegions = taxonomies.filter(
          (t) => t?.name == regionString || t?.slug == regionString
        );
        if (filteredRegions.length > 0) {
          region = [filteredRegions[0].id];
        }
      }
    }

    const { data } = await this._api.get(
      `${postTypeSlug}?per_page=${
        perPage ? perPage : process.env.POSTSPERPAGE
      }&_embed&orderby=date&order=desc&acf_format=standard${
        parent || (parent == 0 && parent >= 0) ? "&parent=" + parent : ""
      }${
        region && region.length > 0
          ? `&region=${region.length > 0 ? region.join(",") : ""}`
          : ""
      }&${
        this._lang == "en"
          ? postTypeSlug == "posts" || postTypeSlug == "pages"
            ? `lang=${this._lang}`
            : ""
          : `lang=${this._lang}`
      }`
    );
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

    console.log(createUrlParametersFilter(queryItems ? queryItems : []));

    const [regions, tags, dimensions, countries] = await Promise.all([
      this._api.get("/region?per_page=100"),
      this._api.get("/tags?per_page=100"),
      this._api.get("/tm-dimension?per_page=100"),
      this._api.get("/country?per_page=100"),
    ]);

    return {
      data: response.data,
      totalItems: parseInt(response.headers["x-wp-total"], 10),
      regions: regions.data,
      tags: tags.data,
      dimensions: dimensions.data,
      countries: countries.data,
    };
  }

  public formatTags(item: Post): TagItem[] {
    const countries = item._embedded?.["wp:term"]
      .flat()
      .filter((term) => term.taxonomy === "country");

    let countryTags: TagItem[] = [];

    if (countries) {
      countryTags = countries.map((c) => ({
        name: decodeHtmlEntities(c.name),
        type: "country",
      }));
    }

    const regions = item._embedded?.["wp:term"]
      .flat()
      .filter((term) => term.taxonomy === "region");

    let regionTags: TagItem[] = [];

    if (regions) {
      regionTags = regions.map((c) => ({
        name: decodeHtmlEntities(c.name),
        type: "region",
      }));
    }

    const tags = item._embedded?.["wp:term"]
      .flat()
      .filter((term) => term.taxonomy === "tm-dimension");

    let tagsTags: TagItem[] = [];

    if (tags) {
      tagsTags = tags.map((c) => ({
        name: decodeHtmlEntities(c.name),
        type: "descriptor",
      }));
    }

    return countryTags.concat(regionTags).concat(tagsTags);
  }

  public async getPostByAcfMetaKey(
    postTypeSlug: string,
    metavalue: string,
    metakey: string
  ) {
    const { data } = await this._api.get(
      `${postTypeSlug}?meta_key=${metakey}&meta_value=${metavalue}&_embed&acf_format=standard`
    );
    return data;
  }

  public async getPost(postTypeSlug: string, slug: string) {
    const { data } = await this._api.get(
      `${postTypeSlug}?slug=${slug}&_embed&acf_format=standard`
    );
    //Verify if the client is using another language
    const foundPost = data[0];
    if (foundPost.lang != this._lang) {
      //In that case the lang returned is not the same as the user is trying to access, may because de slug is in a diferent language
      //Lets see if there is any translation to this post
      if (foundPost.translations) {
        if (Object.keys(foundPost.translations).length > 0) {
          if (foundPost.translations[this._lang]) {
            const translated_postId: number =
              foundPost.translations[this._lang];
            const transalated_response = await this._api.get(
              `${postTypeSlug}/${translated_postId}?_embed&acf_format=standard`
            );
            return [transalated_response.data];
          }
        }
      }
    }

    return data;
  }

  public async getPostById(postTypeSlug: string, id: string) {
    const { data } = await this._api.get(`${postTypeSlug}/${id}`);
    console.log(data);
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
}
