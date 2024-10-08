import { BaseUnauthenticatedApi } from "../BaseUnauthenticatedApi";
import { MenuItemDTO } from "../types/menus.dto";

export class MenusApi extends BaseUnauthenticatedApi {
  public constructor() {
    //ChangeHere
    super("wp-api-menus/v2/");
  }

  public async getMenu(menuSlug: string): Promise<MenuItemDTO[]> {
    const { data } = await this._api.get(`/menu-locations/${menuSlug}`);
    return data;
  }

  public async getMenus(): Promise<MenuItemDTO[]> {
    const { data } = await this._api.get("/menu-locations");
    return data;
  }
}
