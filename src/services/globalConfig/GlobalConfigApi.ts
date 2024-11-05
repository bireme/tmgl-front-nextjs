import { BaseUnauthenticatedApi } from "../BaseUnauthenticatedApi";

export class GlobalConfigApi extends BaseUnauthenticatedApi {
  public constructor() {
    super("wp-json/acf/v3/options/options");
  }

  public async getGlobalConfig() {
    const { data } = await this._api.get("");
    return data;
  }
}
