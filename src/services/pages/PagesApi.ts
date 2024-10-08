import { BaseUnauthenticatedApi } from "../BaseUnauthenticatedApi";

export class PagesApi extends BaseUnauthenticatedApi {
  public constructor(region?: string) {
    super(`${region ? region + "/" : ""}wp-json/wp/v2/pages`);
  }

  public async getPageProperties(pageSlug: string): Promise<any> {
    const { data } = await this._api.get(
      `?slug=${pageSlug}&acf_format=standard`
    );
    return data;
  }
}
