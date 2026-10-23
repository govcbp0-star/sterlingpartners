# Sterling Chambers

A responsive React and TypeScript website built with Vite. Public lawyer profiles are read from Firebase Realtime Database. A single Firebase Authentication account can manage private drafts and publish profiles through the /admin dashboard.

## Local setup

Use Node.js 20.19+ or 22.12+ (required by the installed Vite 8 toolchain).

Run npm install, copy .env.example to .env, fill in the settings described in ADMIN_SETUP.md, then run npm run dev.

## Project checks

- npm run lint
- npm run build
- npm run preview

The production build is written to dist/. Configure the hosting provider to serve the app as a single page and rewrite unknown application paths to /index.html, so direct visits to routes such as /team/:slug and /admin load the React app.

## Environment and security

Every VITE_ variable is compiled into browser JavaScript and can be inspected by site visitors. The Firebase web configuration and admin UID are client-side identifiers, not authorization secrets. Never put a Firebase service-account file, private key, database secret, or other server credential in this project.

The admin route and UID checks in the interface only control the user experience. Firebase Realtime Database rules must enforce access on the server. Review firebase/database.rules.json against the existing rules in Firebase Console, test with the Realtime Database Emulator, and publish manually only after review. This repository does not deploy Firebase rules.

Web3Forms decides where enquiry submissions are delivered in its service configuration. The browser access key is public; configure abuse protection and the recipient in Web3Forms before launch.

Before launch, confirm the firm contact details, office address, service descriptions, biographies, and factual claims in the site content. No hosting provider or production Firebase environment is configured by this repository.
