import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { get, ref, update } from "firebase/database";

const projectId = process.env.GCLOUD_PROJECT ?? "demo-sterling-chambers";
const configuredAdminUid = process.env.VITE_ADMIN_UID?.trim();
const formerAdminUid = process.env.FORMER_ADMIN_UID?.trim();
const rules = await readFile(new URL("../firebase/database.rules.json", import.meta.url), "utf8");
const ruleUids = [...rules.matchAll(/auth\.uid === '([^']+)'/g)].map((match) => match[1]);

assert.ok(configuredAdminUid, "VITE_ADMIN_UID must be set in .env before running this test.");
assert.equal(ruleUids.length, 3, "The database rules must contain the three expected single-UID checks.");
assert.ok(ruleUids.every((uid) => uid === configuredAdminUid), "VITE_ADMIN_UID must match every admin UID check in the rules.");
assert.doesNotMatch(rules, /auth\.token\.admin/, "The single-admin rules must not depend on admin custom claims.");
if (formerAdminUid) {
  assert.notEqual(formerAdminUid, configuredAdminUid, "The former administrator UID must differ from the configured UID.");
}

const testEnv = await initializeTestEnvironment({
  projectId,
  database: {
    host: "127.0.0.1",
    port: 9000,
    rules,
  },
});

const privateProfile = {
  id: "rules-test-profile",
  slug: "rules-test-profile",
  name: "Rules Test Profile",
  title: "Barrister",
  shortBio: "A test profile.",
  bio: "Used only by the local Realtime Database emulator test.",
  specialties: ["Testing"],
  published: true,
  sortOrder: 0,
  createdAt: 1,
  updatedAt: 1,
};
const publicProfile = Object.fromEntries(
  Object.entries(privateProfile).filter(([key]) => key !== "createdAt" && key !== "updatedAt"),
);

try {
  const adminDb = testEnv.authenticatedContext(configuredAdminUid).database();
  const ordinaryUserDb = testEnv.authenticatedContext("ordinary-user").database();
  const signedOutDb = testEnv.unauthenticatedContext().database();

  await assertSucceeds(update(ref(adminDb), {
    "lawyersAdmin/rules-test-profile": privateProfile,
    "lawyersPublic/rules-test-profile": publicProfile,
  }));
  await assertSucceeds(get(ref(adminDb, "lawyersAdmin/rules-test-profile")));
  await assertSucceeds(get(ref(adminDb, "lawyersPublic/rules-test-profile")));

  const editedPrivateProfile = { ...privateProfile, name: "Updated Rules Test Profile", updatedAt: 2 };
  const editedPublicProfile = { ...publicProfile, name: "Updated Rules Test Profile" };
  await assertSucceeds(update(ref(adminDb), {
    "lawyersAdmin/rules-test-profile": editedPrivateProfile,
    "lawyersPublic/rules-test-profile": editedPublicProfile,
  }));
  await assertSucceeds(update(ref(adminDb), {
    "lawyersAdmin/rules-test-profile": { ...editedPrivateProfile, published: false, updatedAt: 3 },
    "lawyersPublic/rules-test-profile": null,
  }));
  assert.equal((await get(ref(adminDb, "lawyersPublic/rules-test-profile"))).exists(), false);
  await assertSucceeds(update(ref(adminDb), {
    "lawyersAdmin/rules-test-profile": null,
    "lawyersPublic/rules-test-profile": null,
  }));
  console.log("PASS configured single administrator can read and create, edit, publish, unpublish, and delete profiles");

  await assertFails(get(ref(ordinaryUserDb, "lawyersAdmin")));
  await assertFails(update(ref(ordinaryUserDb), {
    "lawyersAdmin/unauthorized": { draft: true },
    "lawyersPublic/unauthorized": publicProfile,
  }));
  await assertSucceeds(get(ref(ordinaryUserDb, "lawyersPublic")));
  console.log("PASS ordinary signed-in user is denied private reads and writes to both protected branches");

  if (formerAdminUid) {
    const formerAdminDb = testEnv.authenticatedContext(formerAdminUid).database();
    await assertFails(get(ref(formerAdminDb, "lawyersAdmin")));
    await assertFails(update(ref(formerAdminDb), {
      "lawyersAdmin/former-admin-denied": { draft: true },
      "lawyersPublic/former-admin-denied": publicProfile,
    }));
    console.log("PASS former administrator UID is denied private reads and writes to both protected branches");
  }

  await assertFails(get(ref(signedOutDb, "lawyersAdmin")));
  await assertFails(update(ref(signedOutDb), {
    "lawyersAdmin/unauthorized": { draft: true },
    "lawyersPublic/unauthorized": publicProfile,
  }));
  console.log("PASS unauthenticated users are denied private reads and protected writes");
} finally {
  await testEnv.cleanup();
}
