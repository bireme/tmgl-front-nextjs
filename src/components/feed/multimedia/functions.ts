export function translateType(type: string) {
  switch (type) {
    case "Imagem fixa":
      return "Pdf";
    case "Slide":
      return "Pdf";
    case "video":
      return "Vídeo";
    case "audio":
      return "Áudio";
    default:
      return type;
  }
}
