interface JsonLdProps {
  type: 'VideoObject' | 'WebPage' | 'BreadcrumbList' | 'WebSite' | 'ItemList' | 'Organization';
  data: Record<string, unknown>;
}

export function JsonLd({ type, data }: JsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
