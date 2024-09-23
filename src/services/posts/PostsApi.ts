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
      }&_embed&orderby=date&order=desc`
    );
    return data;
  }

  public async getPost(postTypeSlug: string, slug: string) {
    const { data } = await this._api.get(`${postTypeSlug}?slug=${slug}&_embed`);
    return data;
  }

  public findFeaturedMedia(post: Post, size?: string): string {
    let url;
    if (post._embedded) {
      if (post._embedded["wp:featuredmedia"].length > 0) {
        if (
          post._embedded["wp:featuredmedia"][0].media_details.sizes &&
          size != "full"
        ) {
          switch (size) {
            case "thumbnail":
              url =
                post._embedded["wp:featuredmedia"][0].media_details.sizes
                  .thumbnail.source_url;
              break;
            case "medium":
              url =
                post._embedded["wp:featuredmedia"][0].media_details.sizes.medium
                  ?.source_url;
              break;
            case "large":
              url =
                post._embedded["wp:featuredmedia"][0].media_details.sizes.large
                  ?.source_url;
              break;
            case "full":
              url =
                post._embedded["wp:featuredmedia"][0].media_details.sizes.full
                  ?.source_url;
              break;
          }
        } else {
          url = post._embedded["wp:featuredmedia"][0].source_url;
        }
      }
    }
    if (url) return url;
    return "";
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
