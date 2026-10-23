# Lawyer dashboard and Firebase setup

The public site reads published lawyer profiles from /lawyersPublic. The /admin dashboard uses Firebase Authentication and manages drafts and complete profiles in /lawyersAdmin. Public visitors never read the private branch.

## Configure Firebase

1. Create or select the Sterling Legal Partners Firebase project and add a Web App.
2. Enable Email/Password sign-in in Firebase Authentication.
3. Create the one admin account manually in Authentication. This project has no public registration page.
4. Create a Realtime Database and note its URL.
5. Copy .env.example to .env and fill in the Firebase web app settings, database URL, and VITE_ADMIN_UID.
6. Configure the Web3Forms access key and the firm phone, WhatsApp, and email settings in .env.
7. Restart the Vite development server after changing environment settings.

All VITE_ settings are included in client-side JavaScript. Treat them as public configuration, not as secrets. Do not add service-account JSON, private keys, or database secrets to this frontend.

## Review and publish Realtime Database rules

firebase/database.rules.json is the local rules file for this application’s two lawyer branches. It has root-level default deny rules, public read access only for published profile records at /lawyersPublic, and admin-only access to /lawyersAdmin and writes to /lawyersPublic.

The rules contain a literal admin UID because Firebase rules cannot read Vite environment variables. If the authorized admin account changes, update both the UID in this file and VITE_ADMIN_UID. Do not add a broad read or write rule at the root or at a parent path.

Before publishing:

1. Export or copy the complete current rules from Firebase Console and compare them with the local file. Preserve any unrelated rules required by the Firebase project.
2. Test the complete ruleset with the Realtime Database Emulator or Rules Playground. Confirm public users can read published profiles but cannot write; a different signed-in UID cannot access either lawyer branch; and the designated admin can manage both branches.
3. Confirm publishing creates a public projection, unpublishing removes it, and deleting removes both records.
4. Manually paste and publish the reviewed complete ruleset in Firebase Console.

Do not treat a successful local JSON parse or frontend build as proof of live Firebase security. No Firebase Console or live database operation is performed by this project setup.

## Profile data and migration

src/data/lawyers.ts retains the original sample profiles as a migration reference; the public website does not import or serve that file. Treat those records as sample content: verify and replace all names, contact details, biographies, qualifications, and images before adding them to Firebase. Keep a slug only if it is verified and its URL needs to remain stable. The editor compresses selected JPEG, PNG, or WebP photos before storing them in the private record. Published projections omit administrative timestamps.

Publishing, unpublishing, editing, and deleting update the private and public paths together. Firebase rules still enforce authorization; the client-side admin check is only a user-interface guard.
