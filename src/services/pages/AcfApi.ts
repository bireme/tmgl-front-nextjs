import { BaseUnauthenticatedApi } from "../BaseUnauthenticatedApi";

export class AcfApi extends BaseUnauthenticatedApi {
  public constructor() {
    //ChangeHere
    super("wp/v2/pages/17");
  }

  public async getFields(postTypeSlug: string): Promise<any> {
    const { data } = await this._api.get("");
    return data;
  }
}
