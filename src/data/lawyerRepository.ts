import { onValue, orderByChild, query, ref, type DataSnapshot } from "firebase/database";
import { database } from "../lib/firebase";
import { parseLawyerProfile, sortLawyerProfiles, type LawyerProfile } from "./lawyerProfile";

export interface ProfileSnapshot {
  profiles: LawyerProfile[];
  invalidCount: number;
}

export function recordsFromSnapshot(snapshot: DataSnapshot, publishedOnly: boolean): ProfileSnapshot {
  const profiles: LawyerProfile[] = [];
  let invalidCount = 0;

  snapshot.forEach((child) => {
    if (!child.key) {
      invalidCount += 1;
      return;
    }

    const profile = parseLawyerProfile(child.key, child.val(), publishedOnly);
    if (profile) profiles.push(profile);
    else invalidCount += 1;
  });

  return { profiles: sortLawyerProfiles(profiles), invalidCount };
}

export function subscribeToPublishedLawyers(
  onChange: (snapshot: ProfileSnapshot) => void,
  onError: (error: Error) => void,
) {
  if (!database) {
    onError(new Error("Firebase Realtime Database is not configured."));
    return () => undefined;
  }

  const publishedQuery = query(ref(database, "lawyersPublic"), orderByChild("sortOrder"));
  return onValue(
    publishedQuery,
    (snapshot) => onChange(recordsFromSnapshot(snapshot, true)),
    (error) => onError(error),
  );
}
