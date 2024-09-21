import { BaseUnauthenticatedApi } from "../BaseUnauthenticatedApi";

export class CustomPostsApi extends BaseUnauthenticatedApi {
  public constructor() {
    //ChangeHere
    super("wp/v2/settings");
  }

  public async getCustomPost(postTypeSlug: string): Promise<any> {
    const { data } = await this._api.get("");
    return data;
  }
}
