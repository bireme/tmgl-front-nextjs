import { TaxonomieObjDto, TaxonomyDTO } from "../types/taxonomies.dto";

import { BaseUnauthenticatedApi } from "../BaseUnauthenticatedApi";

export class TaxonomiesApi extends BaseUnauthenticatedApi {
  public constructor(region?: string) {
    super(`wp-json/wp/v2/`);
  }

  public async getTaxonomies(taxSlug?: string): Promise<TaxonomieObjDto[]> {
    const { data } = await this._api.get(`${taxSlug ? taxSlug : ""}`);
    return data;
  }
}
