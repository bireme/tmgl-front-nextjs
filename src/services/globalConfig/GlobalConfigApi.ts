import { BaseUnauthenticatedApi } from "../BaseUnauthenticatedApi";
import { GlobalConfigAcf } from "../types/globalAcf";

export class GlobalConfigApi extends BaseUnauthenticatedApi {
  public constructor() {
    super("wp-json/acf/v3/options/options");
  }

  public async getGlobalConfig(): Promise<GlobalConfigAcf> {
    const { data } = await this._api.get("");
    return data;
  }
}
