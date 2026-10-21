import useSWR from "swr";
import { MenusApi } from "@/services/menus/MenusApi";

const fetchRegionalMenu = () => new MenusApi().getMenu("regional-menu");

/** Shared by the header and regional home; SWR deduplicates the request. */
export function useRegionalMenu() {
  return useSWR("wordpress:global:regional-menu", fetchRegionalMenu, {
    revalidateOnFocus: false,
  });
}
