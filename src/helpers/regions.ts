export function getRegionName(region: string) {
  switch (region.toLowerCase()) {
    case "searo":
      return "South-East Asia";
    case "emro":
      return "Eastern Mediterranean";
    case "euro":
      return "Europa";
    case "afro":
      return "Africa";
    case "wpro":
      return "Western Pacific";
    default:
      return region;
  }
}
