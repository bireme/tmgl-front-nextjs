import { BaseUnauthenticatedApi } from "../BaseUnauthenticatedApi";
import { Post } from "../types/posts.dto";

export class PostsApi extends BaseUnauthenticatedApi {
  public constructor() {
    super("wp/v2/");
  }

  public async getCustomPost(
    postTypeSlug: string,
    perPage?: number
  ): Promise<Post[]> {
    const { data } = await this._api.get(
      `${postTypeSlug}?per_page=${
        perPage ? perPage : process.env.POSTSPERPAGE
      }&_embed&orderby=date&order=desc&acf_format=standard`
    );
    return data;
  }

  public async getPost(postTypeSlug: string, slug: string) {
    const { data } = await this._api.get(
      `${postTypeSlug}?slug=${slug}&_embed&acf_format=standard`
    );
    return data;
  }

  public getPostCategories(post: Post): string[] {
    const categories = post._embedded?.["wp:term"]?.[0];

    if (categories && categories.length > 0) {
      return categories.map((category) => category.name);
    } else {
      return ["Uncategorized"];
    }
  }
}
