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

    //Adicionado Regulations and policies ... (Remover isso quando atualizar a staging)
    const tmglResources = data.find(
      (item: any) => item.title === "TMGL Resources"
    );

    if (tmglResources) {
      tmglResources.children = tmglResources.children || [];

      tmglResources.children.push({
        ID: 999999,
        order: 999,
        parent: tmglResources.ID,
        title: "Regulations and Policies",
        url: "/regulations-and-policies",
        attr: "/wp-content/uploads/2025/07/Depositphotos_179267040_XL.jpg",
        target: "",
        classes: "",
        xfn: "",
        description:
          "This collection compiles records of laws, regulations, and policies on traditional, complementary, and integrative medicine (TCIM) from the Americas and Africa Region. It covers frameworks governing practices, products, and practitioners, and is indexed with descriptors such as Complementary Therapies, Acupuncture, Traditional Chinese Medicine, National Health Programs, Health Policy, Healthcare Policies, Public Policy, International Health Regulations, and Health Services Administration, along with terms reflecting cultural and indigenous health contexts like Traditional Medicine, Traditional Indigenous Medicine of the Americas, Culturally Competent Care, Cultural Diversity, Health of Indigenous Peoples, and Health Systems. This rich resource supports the understanding of how TCIM is regulated and integrated into health systems across diverse cultural and policy environments.",
        object_id: 999999,
        object: "custom",
        type: "custom",
        type_label: "Custom Link",
        children: [],
      });
    }

    return data;
  }

  public async getMenus(): Promise<MenuItemDTO[]> {
    const { data } = await this._api.get("/menu-locations");
    return data;
  }
}
