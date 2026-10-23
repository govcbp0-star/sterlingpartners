export const DEFAULT_SITE_URL = "https://sterlingpartners-eight.vercel.app";
export const SOCIAL_IMAGE_PATH = "/images/hero1.webp";

export interface SeoPageDefinition {
  path: string;
  title: string;
  description: string;
}

export const seoPages = {
  home: {
    path: "/",
    title: "Sterling Chambers | Legal Guidance & Representation",
    description:
      "Sterling Chambers provides thoughtful legal guidance and representation to individuals, families, entrepreneurs, and businesses.",
  },
  about: {
    path: "/about",
    title: "About Sterling Chambers | Our Firm",
    description:
      "Learn about Sterling Chambers, our approach to client service, and our work across corporate, litigation, property, family, and inheritance matters.",
  },
  services: {
    path: "/services",
    title: "Legal Services | Sterling Chambers",
    description:
      "Explore Sterling Chambers legal support in corporate and commercial law, dispute resolution, property, contracts, family matters, and legal advisory.",
  },
  team: {
    path: "/team",
    title: "Our Lawyers | Sterling Chambers",
    description:
      "Meet the lawyers at Sterling Chambers, learn about their roles and practice areas, and find the appropriate member of our legal team.",
  },
  contact: {
    path: "/contact",
    title: "Contact Sterling Chambers | Get in Touch",
    description:
      "Contact Sterling Chambers about your legal enquiry and find the appropriate member of our team.",
  },
} satisfies Record<string, SeoPageDefinition>;

export const publicSeoPages = Object.values(seoPages);

export function createLawyerSeoPage(
  lawyer: { slug: string; name: string; title: string; shortBio: string },
  firmName: string,
): SeoPageDefinition {
  const description = `${lawyer.name} (${lawyer.title}) at ${firmName}. ${lawyer.shortBio}`;

  return {
    path: `/team/${encodeURIComponent(lawyer.slug)}`,
    title: `${lawyer.name} (${lawyer.title}) | ${firmName}`,
    description: description.length <= 160 ? description : `${description.slice(0, 157).trimEnd()}…`,
  };
}

export function resolveSiteUrl(value?: string) {
  try {
    const parsed = new URL(value?.trim() || DEFAULT_SITE_URL);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return DEFAULT_SITE_URL;
    return parsed.toString().replace(/\/+$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function absoluteSiteUrl(siteUrl: string, path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalPath = normalizedPath.replace(/\/+$/, "");
  return canonicalPath ? `${siteUrl}${canonicalPath}/` : `${siteUrl}/`;
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&#39;");
}

export function escapeJsonForHtml(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export interface LegalServiceDetails {
  siteUrl: string;
  name: string;
  description: string;
  address: string;
  email?: string;
  telephone?: string;
}

export function buildLegalServiceStructuredData(details: LegalServiceDetails) {
  const [locality, region] = details.address.split(",").map((part) => part.trim());
  const postalAddress: Record<string, string> = { "@type": "PostalAddress" };

  if (locality) postalAddress.addressLocality = locality;
  if (region) postalAddress.addressRegion = region;

  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": `${details.siteUrl}/#legalservice`,
    name: details.name,
    url: `${details.siteUrl}/`,
    description: details.description,
    logo: absoluteSiteUrl(details.siteUrl, "/favicon.svg"),
    address: postalAddress,
    ...(details.email ? { email: details.email } : {}),
    ...(details.telephone ? { telephone: details.telephone } : {}),
  };
}

export interface LawyerSeoDetails {
  siteUrl: string;
  firmName: string;
  path: string;
  name: string;
  title: string;
  shortBio: string;
  specialties: string[];
  email?: string;
}

export function buildLawyerPersonStructuredData(details: LawyerSeoDetails) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${absoluteSiteUrl(details.siteUrl, details.path)}#person`,
    name: details.name,
    jobTitle: details.title,
    description: details.shortBio,
    url: absoluteSiteUrl(details.siteUrl, details.path),
    worksFor: {
      "@type": "LegalService",
      "@id": `${details.siteUrl}/#legalservice`,
      name: details.firmName,
    },
    ...(details.specialties.length > 0 ? { knowsAbout: details.specialties } : {}),
    ...(details.email ? { email: details.email } : {}),
  };
}

export interface SeoHeadDetails {
  siteUrl: string;
  page: SeoPageDefinition;
  firmName: string;
  structuredData: unknown[];
  robots?: string;
  openGraphType?: string;
}

export function renderSeoHead(details: SeoHeadDetails) {
  const canonical = absoluteSiteUrl(details.siteUrl, details.page.path);
  const image = absoluteSiteUrl(details.siteUrl, SOCIAL_IMAGE_PATH);
  const robots = details.robots ?? "index,follow";
  const tags = [
    `<title data-seo-title>${escapeHtml(details.page.title)}</title>`,
    `<meta name="description" data-seo-description content="${escapeHtml(details.page.description)}">`,
    `<meta name="robots" data-seo-robots content="${escapeHtml(robots)}">`,
    `<link rel="canonical" data-seo-canonical href="${escapeHtml(canonical)}">`,
    `<meta property="og:title" data-seo-og-title content="${escapeHtml(details.page.title)}">`,
    `<meta property="og:description" data-seo-og-description content="${escapeHtml(details.page.description)}">`,
    `<meta property="og:type" data-seo-og-type content="${escapeHtml(details.openGraphType ?? "website")}">`,
    `<meta property="og:url" data-seo-og-url content="${escapeHtml(canonical)}">`,
    `<meta property="og:site_name" content="${escapeHtml(details.firmName)}">`,
    `<meta property="og:image" data-seo-og-image content="${escapeHtml(image)}">`,
    `<meta property="og:image:alt" content="Lady Justice sculpture representing the firm’s legal practice">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" data-seo-twitter-title content="${escapeHtml(details.page.title)}">`,
    `<meta name="twitter:description" data-seo-twitter-description content="${escapeHtml(details.page.description)}">`,
    `<meta name="twitter:image" data-seo-twitter-image content="${escapeHtml(image)}">`,
    ...details.structuredData.map(
      (schema) => `<script type="application/ld+json" data-seo-jsonld>${escapeJsonForHtml(schema)}</script>`,
    ),
  ];

  return tags.join("\n    ");
}
