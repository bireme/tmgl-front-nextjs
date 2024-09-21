import { BaseUnauthenticatedApi } from "../BaseUnauthenticatedApi";

export class SettingsApi extends BaseUnauthenticatedApi {
  public constructor() {
    super("wp/v2/settings");
  }

  public async getSettings(): Promise<any> {
    const { data } = await this._api.get("");
    return data;
  }
}
