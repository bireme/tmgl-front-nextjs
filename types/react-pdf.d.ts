declare module "react-pdf" {
  import * as React from "react";

  export interface DocumentProps {
    file: string | File | { data: Uint8Array };
    onLoadSuccess?: (pdf: any) => void;
    onLoadError?: (error: any) => void;
    children?: React.ReactNode;
  }

  export interface PageProps {
    pageNumber: number;
    width?: number;
    renderAnnotationLayer?: boolean;
    renderTextLayer?: boolean;
  }

  export const Document: React.FC<DocumentProps>;
  export const Page: React.FC<PageProps>;
}
