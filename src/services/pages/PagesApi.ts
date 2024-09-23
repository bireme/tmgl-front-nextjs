import { BaseUnauthenticatedApi } from "../BaseUnauthenticatedApi";

export class PagesApi extends BaseUnauthenticatedApi {
  public constructor() {
    //ChangeHere
    super("wp/v2/pages");
  }

  public async getPageProperties(pageSlug: string): Promise<any> {
    const { data } = await this._api.get(`?slug=${pageSlug}`);
    return data;
  }
}
