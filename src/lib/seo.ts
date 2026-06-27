export interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown>;
}

export function buildTitle(page: string): string {
  return `${page} — Bem Calculado`;
}
