import {
  onValue,
  orderByChild,
  push,
  query,
  ref,
  update,
} from "firebase/database";
import { adminUid, database } from "../lib/firebase";
import { auth } from "../lib/firebaseAuth";
import {
  recordsFromSnapshot,
  type ProfileSnapshot,
} from "./lawyerRepository";
import {
  sortLawyerProfiles,
  type LawyerProfile,
  type LawyerProfileInput,
} from "./lawyerProfile";

export function subscribeToAdminLawyers(
  onChange: (snapshot: ProfileSnapshot) => void,
  onError: (error: Error) => void,
) {
  if (!database || !auth?.currentUser || !adminUid || auth.currentUser.uid !== adminUid) {
    onError(new Error("The current session is not authorized to manage lawyer profiles."));
    return () => undefined;
  }

  let privateSnapshot: ProfileSnapshot = { profiles: [], invalidCount: 0 };
  let publicSnapshot: ProfileSnapshot = { profiles: [], invalidCount: 0 };

  const publishMergedSnapshot = () => {
    const merged = new Map<string, LawyerProfile>();
    publicSnapshot.profiles.forEach((profile) => merged.set(profile.id, profile));
    privateSnapshot.profiles.forEach((profile) => merged.set(profile.id, profile));
    onChange({
      profiles: sortLawyerProfiles([...merged.values()]),
      invalidCount: privateSnapshot.invalidCount + publicSnapshot.invalidCount,
    });
  };

  const privateUnsubscribe = onValue(
    ref(database, "lawyersAdmin"),
    (snapshot) => {
      privateSnapshot = recordsFromSnapshot(snapshot, false);
      publishMergedSnapshot();
    },
    onError,
  );
  const publicUnsubscribe = onValue(
    query(ref(database, "lawyersPublic"), orderByChild("sortOrder")),
    (snapshot) => {
      publicSnapshot = recordsFromSnapshot(snapshot, true);
      publishMergedSnapshot();
    },
    onError,
  );

  return () => {
    privateUnsubscribe();
    publicUnsubscribe();
  };
}

function assertAuthorizedAdmin() {
  if (!database || !auth?.currentUser || !adminUid) {
    throw new Error("Firebase and the authorized admin account must be configured before saving.");
  }

  if (auth.currentUser.uid !== adminUid) {
    throw new Error("This account is not authorized to manage lawyer profiles.");
  }
}

export async function saveLawyerProfile(
  input: LawyerProfileInput,
  existing?: LawyerProfile,
) {
  assertAuthorizedAdmin();
  const db = database!;
  const id = existing?.id ?? push(ref(db, "lawyersAdmin")).key;
  if (!id) throw new Error("A profile ID could not be generated. Please retry.");

  const now = Date.now();
  const profile: LawyerProfile = {
    id,
    slug: input.slug.trim(),
    name: input.name.trim(),
    title: input.title.trim(),
    shortBio: input.shortBio.trim(),
    bio: input.bio.trim(),
    specialties: input.specialties.map((item) => item.trim()).filter(Boolean),
    qualifications: input.qualifications.map((item) => item.trim()).filter(Boolean),
    memberships: input.memberships.map((item) => item.trim()).filter(Boolean),
    published: input.published,
    sortOrder: input.sortOrder,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  if (input.email?.trim()) profile.email = input.email.trim();
  if (input.phone?.trim()) profile.phone = input.phone.trim();
  if (input.whatsapp?.trim()) profile.whatsapp = input.whatsapp.trim();
  if (input.imageDataUrl) profile.imageDataUrl = input.imageDataUrl;

  const { createdAt, updatedAt, ...publicProjection } = profile;
  void createdAt;
  void updatedAt;

  await update(ref(db), {
    ["lawyersAdmin/" + id]: profile,
    ["lawyersPublic/" + id]: profile.published ? publicProjection : null,
  });

  return profile;
}

export async function deleteLawyerProfile(id: string) {
  assertAuthorizedAdmin();
  await update(ref(database!), {
    ["lawyersAdmin/" + id]: null,
    ["lawyersPublic/" + id]: null,
  });
}
