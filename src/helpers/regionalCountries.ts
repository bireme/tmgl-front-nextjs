import type { MenuItemDTO } from "@/services/types/menus.dto";
import { normalizeInternalLink } from "./seo";

export function regionalCountries(menu: MenuItemDTO[], region: string) {
  const countries: { id: number; title: string; href: string }[] = [];
  const seen = new Set<string>();
  const reserved = new Set(["content", "dimensions", "featured-stories", "news", "events"]);
  function visit(items: MenuItemDTO[]) {
    for (const item of items) {
      const href = normalizeInternalLink(item.url);
      const pathname = href.split(/[?#]/)[0];
      const segments = pathname.split("/").filter(Boolean);
      if (href.startsWith("/") && segments[0] === region && segments.length === 2
        && !reserved.has(segments[1]) && !seen.has(pathname)) {
        seen.add(pathname);
        countries.push({ id: item.ID, title: item.title, href });
      }
      visit(item.children || []);
    }
  }
  visit(menu);
  return countries;
}
