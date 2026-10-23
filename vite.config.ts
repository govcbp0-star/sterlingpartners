import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { firm } from "./src/data/firm.ts";
import { parseLawyerProfile } from "./src/data/lawyerProfile.ts";
import {
  absoluteSiteUrl,
  buildLawyerPersonStructuredData,
  buildLegalServiceStructuredData,
  createLawyerSeoPage,
  publicSeoPages,
  renderSeoHead,
  resolveSiteUrl,
  type SeoPageDefinition,
} from "./src/seoConfig.ts";

interface PublicLawyer {
  slug: string;
  name: string;
  title: string;
  shortBio: string;
  specialties: string[];
  email?: string;
}

function getPublicLawyers(value: unknown): PublicLawyer[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];

  const profiles = Object.entries(value).flatMap(([id, candidate]) => {
    const profile = parseLawyerProfile(id, candidate, true);
    return profile ? [{
      slug: profile.slug,
      name: profile.name,
      title: profile.title,
      shortBio: profile.shortBio,
      specialties: Array.isArray(profile.specialties)
        ? profile.specialties.filter((item): item is string => typeof item === "string")
        : [],
      ...(typeof profile.email === "string" && profile.email.trim()
        ? { email: profile.email.trim() }
        : {}),
    }] : [];
  });

  return [...new Map(profiles.map((profile) => [profile.slug, profile])).values()]
    .sort((first, second) => first.slug.localeCompare(second.slug));
}

async function fetchPublicLawyers(databaseUrl?: string) {
  if (!databaseUrl?.trim()) {
    console.warn("SEO sitemap: VITE_FIREBASE_DATABASE_URL is unset; no lawyer profile URLs were added.");
    return [];
  }

  try {
    const baseUrl = databaseUrl.trim().replace(/\/+$/, "");
    const response = await fetch(`${baseUrl}/lawyersPublic.json`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error("Public profile request failed.");
    return getPublicLawyers(await response.json());
  } catch {
    throw new Error(
      "SEO sitemap generation could not read published public lawyer profiles. Check VITE_FIREBASE_DATABASE_URL and public read access.",
    );
  }
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function sitemapXml(urls: string[]) {
  const entries = urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

function replaceSeoBlock(template: string, content: string) {
  return template.replace(/<!-- SEO_START -->[\s\S]*?<!-- SEO_END -->/, `<!-- SEO_START -->\n    ${content}\n    <!-- SEO_END -->`);
}

function buildSeoFilesPlugin(
  siteUrl: string,
  databaseUrl: string | undefined,
  email: string | undefined,
  telephone: string | undefined,
): Plugin {
  let outputDirectory = resolve("dist");
  let isBuild = false;
  const firmSchema = buildLegalServiceStructuredData({
    siteUrl,
    name: firm.name,
    description: firm.description,
    address: firm.address,
    email: email?.trim() || undefined,
    telephone: telephone?.trim() || undefined,
  });

  return {
    name: "sterling-seo-files",
    configResolved(config) {
      isBuild = config.command === "build";
      outputDirectory = resolve(config.root, config.build.outDir);
    },
    transformIndexHtml(html) {
      return replaceSeoBlock(html, renderSeoHead({
        siteUrl,
        page: publicSeoPages[0],
        firmName: firm.name,
        structuredData: [firmSchema],
      }));
    },
    async closeBundle() {
      if (!isBuild) return;

      const lawyers = await fetchPublicLawyers(databaseUrl);
      const template = await readFile(resolve(outputDirectory, "index.html"), "utf8");
      const buildPage = (
        page: SeoPageDefinition,
        structuredData: unknown[] = [firmSchema],
        openGraphType = "website",
      ) => replaceSeoBlock(template, renderSeoHead({
        siteUrl,
        page,
        firmName: firm.name,
        structuredData,
        openGraphType,
      }));

      await writeFile(resolve(outputDirectory, "index.html"), buildPage(publicSeoPages[0]), "utf8");

      for (const page of publicSeoPages.slice(1)) {
        const routeFile = resolve(outputDirectory, `${page.path.slice(1)}/index.html`);
        await mkdir(dirname(routeFile), { recursive: true });
        await writeFile(routeFile, buildPage(page), "utf8");
      }

      for (const lawyer of lawyers) {
        const page = createLawyerSeoPage(lawyer, firm.name);
        const personSchema = buildLawyerPersonStructuredData({
          siteUrl,
          firmName: firm.name,
          path: page.path,
          name: lawyer.name,
          title: lawyer.title,
          shortBio: lawyer.shortBio,
          specialties: lawyer.specialties,
          email: lawyer.email,
        });
        const routeFile = resolve(outputDirectory, `team/${lawyer.slug}/index.html`);
        await mkdir(dirname(routeFile), { recursive: true });
        await writeFile(routeFile, buildPage(page, [firmSchema, personSchema], "profile"), "utf8");
      }

      const sitemapUrls = [
        ...publicSeoPages.map((page) => absoluteSiteUrl(siteUrl, page.path)),
        ...lawyers.map((lawyer) => absoluteSiteUrl(siteUrl, `/team/${encodeURIComponent(lawyer.slug)}`)),
      ];
      await writeFile(resolve(outputDirectory, "sitemap.xml"), sitemapXml(sitemapUrls), "utf8");
      await writeFile(
        resolve(outputDirectory, "robots.txt"),
        `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
        "utf8",
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = resolveSiteUrl(env.VITE_SITE_URL);

  return {
    plugins: [
      react(),
      buildSeoFilesPlugin(
        siteUrl,
        env.VITE_FIREBASE_DATABASE_URL,
        env.VITE_FIRM_EMAIL,
        env.VITE_FIRM_PHONE,
      ),
    ],
  };
});
