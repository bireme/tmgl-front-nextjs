import { BaseUnauthenticatedApi } from "../BaseUnauthenticatedApi";
import { MediaResponse } from "../types/media.dto";
import { extend } from "dayjs";

export class MediaApi extends BaseUnauthenticatedApi {
  public constructor() {
    super("wp/v2/media");
  }

  public getMediaById = async (id: number): Promise<string> => {
    const { data } = await this._api.get<MediaResponse>(`/${id}`);
    return data.source_url;
  };
}
