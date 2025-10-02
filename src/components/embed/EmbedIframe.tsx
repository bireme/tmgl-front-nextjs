import { useEffect, useRef } from "react";

interface EmbedIframeProps {
  src: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
  onResize?: (height: number) => void;
}

export const EmbedIframe: React.FC<EmbedIframeProps> = ({
  src,
  width = "100%",
  height = 600,
  className,
  style,
  onResize,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "resize" && iframeRef.current) {
        const newHeight = event.data.height + 200;
        iframeRef.current.style.height = `${newHeight}px`;
        
        // Callback opcional para notificar o componente pai sobre a mudança de altura
        if (onResize) {
          onResize(newHeight);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onResize]);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      width={width}
      height={height}
      className={className}
      style={style}
      frameBorder="0"
      allowFullScreen
    />
  );
};
