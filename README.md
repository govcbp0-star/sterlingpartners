# Sterling Chambers

A responsive React and TypeScript website built with Vite. Public lawyer profiles are read from Firebase Realtime Database. The single Firebase Authentication account whose UID is configured in `VITE_ADMIN_UID` can manage private drafts and publish profiles through the `/admin` dashboard.

## Local setup

Use Node.js 20.19+ or 22.12+ (required by the installed Vite 8 toolchain).

Run `npm install`, copy `.env.example` to `.env`, fill in the settings described in [ADMIN_SETUP.md](ADMIN_SETUP.md), then run `npm run dev`.

## Search metadata and production URL

`VITE_SITE_URL` is the canonical production site URL. The current Vercel domain is the fallback in `src/seoConfig.ts`; leave `VITE_SITE_URL` blank to use it, or set it in `.env` and the Vercel project's build environment to override it. When a custom domain is connected, update that value before building so canonical links, social metadata, structured data, `robots.txt`, and `sitemap.xml` use the new domain.

The production build writes route-specific page metadata and generates `robots.txt` and `sitemap.xml`. The sitemap reads only the public `/lawyersPublic` Firebase branch and includes profiles marked published; it uses profile slugs only. Admin and draft records are not queried. Ensure `VITE_FIREBASE_DATABASE_URL` is available during the build and that this public branch permits reads. No Firebase rules are changed by the SEO build step.

The site still renders page content in the browser. Route-specific metadata is included in the built HTML, which supports crawlers and social previews that read the initial document head. Search crawlers that do not execute JavaScript may not see the rendered page body; consider full prerendering or server-side rendering only if search indexing shows that limitation in practice.

## Project checks

- `npm run lint`
- `npm run build`
- `npm run test:rules`
- `npm run preview`

The production build is written to `dist/`. Configure the hosting provider to serve the app as a single page and rewrite unknown application paths to `/index.html`, so direct visits to routes such as `/team/:slug` and `/admin` load the React app.

## Environment and security

Every `VITE_` variable is compiled into browser JavaScript and can be inspected by site visitors. The Firebase web configuration and administrator UID are client-side identifiers, not authorization secrets. The UID in `VITE_ADMIN_UID` must match the UID in `firebase/database.rules.json`; Firebase Realtime Database rules enforce access to protected branches. Never put a Firebase service-account file, private key, database secret, or other server credential in this project.

The admin route check in the interface only controls the user experience. Run `npm run test:rules`, review `firebase/database.rules.json` against the existing rules in Firebase Console, and publish manually only after review. This repository does not deploy Firebase rules.

Web3Forms decides where enquiry submissions are delivered in its service configuration. The browser access key is public; configure abuse protection and the recipient in Web3Forms before launch.

Before launch, confirm the firm contact details, office address, service descriptions, biographies, and factual claims in the site content. The repository includes Vercel routing configuration, but live Vercel environment values and production Firebase settings must be reviewed in their respective dashboards.
