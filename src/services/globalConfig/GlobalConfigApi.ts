import { BaseUnauthenticatedApi } from "../BaseUnauthenticatedApi";
import { GlobalConfigAcf } from "../types/globalAcf";

export class GlobalConfigApi extends BaseUnauthenticatedApi {
  public constructor() {
    super("wp-json/acf/v3/options/options");
  }

  public async getGlobalConfig(): Promise<GlobalConfigAcf> {
    try {
      const { data } = await this._api.get("");
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error while connecting to wp");
    }
  }
}
