declare module "pdf-poppler" {
  interface ConvertOptions {
    format: "jpeg" | "png";
    out_dir: string;
    out_prefix: string;
    page?: number;
    scale?: number;
  }

  export class PdfConverter {
    static convert(pdfFilePath: string, options: ConvertOptions): Promise<void>;
  }
}
