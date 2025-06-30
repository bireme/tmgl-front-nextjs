export function translateType(type: string) {
  switch (type) {
    case "Imagem fixa":
      return "Pdf";
    case "Slide":
      return "Pdf";
    case "video":
      return "Video";
    case "audio":
      return "Audio";
    default:
      return type;
  }
}
