import { BaseUnauthenticatedApi } from "../BaseUnauthenticatedApi";
import { MenuItemDTO } from "../types/menus.dto";

export class MenusApi extends BaseUnauthenticatedApi {
  public constructor() {
    super("wp-json/wp-api-menus/v2/");
  }

  public async getMenu(menuSlug: string): Promise<MenuItemDTO[]> {
    const { data } = await this._api.get(
      `/menu-locations/${menuSlug}${this._lang ? `?lang=${this._lang}` : ""}`
    );

    return data.filter((menu: MenuItemDTO) => menu.title !== "Search Collection");
  }
  public async getMenus(): Promise<MenuItemDTO[]> {
    const { data } = await this._api.get("/menu-locations");
    return data;
  }
}
