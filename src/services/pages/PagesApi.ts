import { BaseUnauthenticatedApi } from "../BaseUnauthenticatedApi";

export class PagesApi extends BaseUnauthenticatedApi {
  public constructor(region?: string) {
    super(`${region ? region + "/" : ""}wp-json/wp/v2/pages`);
  }

  public async getPageProperties(pageSlug: string): Promise<any> {
    const { data } = await this._api.get(
      `?slug=${pageSlug}&acf_format=standard`
    );
    //Verify if the client is using another language
    const foundPost = data[0];
    if (foundPost.lang != this._lang) {
      //In that case the lang returned is not the same as the user is trying to access, may because de slug is in a diferent language
      //Lets see if there is any translation to this post
      if (Object.keys(foundPost.translations).length > 0) {
        if (foundPost.translations[this._lang]) {
          const translated_postId: number = foundPost.translations[this._lang];
          const transalated_response = await this._api.get(
            `${translated_postId}?_embed&acf_format=standard`
          );
          return [transalated_response.data];
        }
      }
    }
    return data;
  }
}
