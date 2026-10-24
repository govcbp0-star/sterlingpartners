# Administrator and Firebase setup

The public site reads published lawyer profiles from `/lawyersPublic`. The `/admin` dashboard uses Firebase Authentication and manages drafts and full profiles in `/lawyersAdmin`. Public visitors can read published profiles but cannot read the private branch.

## Single administrator authorization

Exactly one Firebase Authentication UID is authorized. The app reads it from `VITE_ADMIN_UID`; `firebase/database.rules.json` contains the same UID to enforce the restriction at the database. Both values must match. There is no administrator list in Realtime Database, no custom-claims tooling, and no public registration flow. An ordinary authenticated user remains denied access.

The current local configuration is set to the replacement administrator UID supplied by the site owner. The old administrator's local authorization has been removed. This does not change live Firebase rules or Vercel settings by itself.

## Firebase and environment setup

1. In Firebase Console, enable Email/Password sign-in under Authentication.
2. Create the administrator account manually in Firebase Authentication. Do not add a public account registration page.
3. Copy that account's UID from the Firebase Authentication user list.
4. Set `VITE_ADMIN_UID` to that UID in local `.env` and set the same UID in the `auth.uid` checks in `firebase/database.rules.json`.
5. Fill the Firebase web app settings in `.env` from `.env.example`, and configure the Web3Forms key and firm contact details.
6. Restart the Vite development server after changing environment settings.

All `VITE_` values are included in browser JavaScript. Do not put a service-account file, private key, database secret, or other server credential in `.env` or website source.

### Replacing the administrator

A project owner replaces the single authorized administrator by creating or selecting the new account in Firebase Authentication, then updating both `VITE_ADMIN_UID` and the matching UID checks in `firebase/database.rules.json`. Once the change is released, the former UID no longer satisfies the rules. Do not change any lawyer records as part of administrator replacement.

### Vercel environment variables

In the Vercel project, update `VITE_ADMIN_UID` to the replacement UID in each environment that should use the new administrator (normally Production and Preview). Keep the Firebase web configuration variables already used by the project. Vite embeds these values at build time, so trigger a new deployment after changing them. This repository has no Vercel account connection, so those settings must be changed and verified in the Vercel dashboard; never paste credentials into chat or commit `.env`.

## Review and publish Realtime Database rules

The local rules keep root access denied, allow public reads under `/lawyersPublic`, and allow writes to `/lawyersPublic` plus reads and writes to `/lawyersAdmin` only for the configured UID. Rules validate published public profile data. They do not store an editable administrator allowlist.

Run local checks before release:

```sh
npm run lint
npm run build
npm run test:rules
```

The rules test starts a local Realtime Database Emulator and uses test identities. It verifies the configured administrator can create, edit, publish, unpublish, and delete profiles; an ordinary signed-in user cannot read `/lawyersAdmin` or write either protected branch; signed-out users are denied; and public reads remain available. The emulator requires a Java runtime and may download its emulator binary the first time it starts. The test reads `VITE_ADMIN_UID` from `.env` and checks it matches the UID in the rules.

### Safe release steps

1. Confirm the new Firebase Authentication account is enabled and its UID matches both local `VITE_ADMIN_UID` and the authorization UID in `firebase/database.rules.json`.
2. Review the complete rules currently deployed in Firebase Console. Compare them with the local rules and preserve any production rules for unrelated paths; do not blindly overwrite rules that differ.
3. Run `npm run lint`, `npm run build`, and `npm run test:rules` locally.
4. Set Vercel's `VITE_ADMIN_UID` to the new UID in Production and Preview as needed, and prepare the production build. Confirm it uses the new UID before release.
5. Coordinate the cutover. After the owner explicitly approves, publish the reviewed complete ruleset in Firebase Console (or through the team's approved Firebase deployment process). This immediately removes the former UID's database access. Release the prepared Vercel build with the new UID right after the rules update; the dashboard may be briefly unavailable between these two changes.
6. Verify the new administrator can sign in and manage profiles. Verify the former administrator and an ordinary account cannot access `/lawyersAdmin` or write either protected branch. Check that public lawyer listings and profile pages still load.

This project does not deploy the website or publish Firebase rules automatically. Until both Vercel and Firebase are updated, production may continue to use the previous authorization configuration. Never delete or rewrite existing profile data during this UID-only change.

## Profile data

`src/data/lawyers.ts` retains the original sample profiles as a migration reference; the public website does not import or serve that file. Verify and replace all names, contact details, biographies, qualifications, and images before adding records to Firebase. Keep a slug only if it is verified and its URL needs to remain stable. The editor compresses selected JPEG, PNG, or WebP photos before storing them in the private record. Published projections omit administrative timestamps.

Publishing, unpublishing, editing, and deleting continue to update the private and public paths together. Firebase rules enforce authorization independently of the React interface.
