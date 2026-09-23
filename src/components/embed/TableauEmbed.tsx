interface TableauEmbedProps {
  sourceUrl: string;
  title: string;
}

// Tableau's iframe embed does not depend on a React-specific runtime.
export function TableauEmbed({ sourceUrl, title }: TableauEmbedProps) {
  const url = new URL(sourceUrl);
  url.searchParams.set(":embed", "true");
  url.searchParams.set(":showVizHome", "no");

  return (
    <iframe
      src={url.toString()}
      title={title}
      width="100%"
      height={1050}
      style={{ border: 0, marginBottom: 40 }}
      allowFullScreen
    />
  );
}
