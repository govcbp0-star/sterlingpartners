import { useEffect } from "react";
import { config } from "../config";
import { firm } from "../data/firm";
import {
  absoluteSiteUrl,
  buildLegalServiceStructuredData,
  escapeJsonForHtml,
  type SeoPageDefinition,
  SOCIAL_IMAGE_PATH,
} from "../seoConfig";

interface SeoProps {
  page: SeoPageDefinition;
  noindex?: boolean;
  includeFirmSchema?: boolean;
  openGraphType?: string;
  structuredData?: unknown[];
}

function setMeta(attribute: "name" | "property", key: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = value;
}

export default function Seo({
  page,
  noindex = false,
  includeFirmSchema = true,
  openGraphType = "website",
  structuredData = [],
}: SeoProps) {
  const canonical = absoluteSiteUrl(config.siteUrl, page.path);
  const socialImage = absoluteSiteUrl(config.siteUrl, SOCIAL_IMAGE_PATH);
  const legalService = buildLegalServiceStructuredData({
    siteUrl: config.siteUrl,
    name: firm.name,
    description: firm.description,
    address: firm.address,
    email: config.firmEmail || undefined,
    telephone: config.firmPhone || undefined,
  });
  const schemaJson = JSON.stringify([...(includeFirmSchema ? [legalService] : []), ...structuredData]);

  useEffect(() => {
    document.title = page.title;
    setMeta("name", "description", page.description);
    setMeta("name", "robots", noindex ? "noindex,nofollow" : "index,follow");
    setMeta("property", "og:title", page.title);
    setMeta("property", "og:description", page.description);
    setMeta("property", "og:type", openGraphType);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:site_name", firm.name);
    setMeta("property", "og:image", socialImage);
    setMeta("property", "og:image:alt", "Lady Justice sculpture representing the firm’s legal practice");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", page.title);
    setMeta("name", "twitter:description", page.description);
    setMeta("name", "twitter:image", socialImage);

    let canonicalElement = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement("link");
      canonicalElement.rel = "canonical";
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.href = canonical;

    document.head.querySelectorAll('script[data-seo-jsonld]').forEach((script) => script.remove());
    for (const schema of JSON.parse(schemaJson) as unknown[]) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seoJsonld = "true";
      script.textContent = escapeJsonForHtml(schema);
      document.head.appendChild(script);
    }
  }, [canonical, noindex, openGraphType, page.description, page.title, schemaJson, socialImage]);

  return null;
}
