export interface LawyerProfile {
  id: string;
  slug: string;
  name: string;
  title: string;
  shortBio: string;
  bio: string;
  specialties: string[];
  email?: string;
  qualifications: string[];
  memberships: string[];
  imageDataUrl?: string;
  published: boolean;
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
}

export type LawyerProfileInput = Omit<LawyerProfile, "id" | "createdAt" | "updatedAt">;

export function getLawyerImageSource(profile: Pick<LawyerProfile, "imageDataUrl">) {
  const image = profile.imageDataUrl;

  return image && /^data:image\/(?:webp|jpeg);base64,[A-Za-z0-9+/]+=*$/.test(image)
    ? image
    : undefined;
}

export function parseLawyerProfile(
  id: string,
  value: unknown,
  requirePublished: boolean,
): LawyerProfile | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const record = value as Record<string, unknown>;
  const isString = (field: string) => typeof record[field] === "string";
  const isStringArray = (field: string) =>
    Array.isArray(record[field]) && record[field].every((entry) => typeof entry === "string");

  if (
    (record.id !== undefined && record.id !== id) ||
    !isString("slug") ||
    !isString("name") ||
    !isString("title") ||
    !isString("shortBio") ||
    !isString("bio") ||
    !isStringArray("specialties") ||
    typeof record.published !== "boolean" ||
    (requirePublished && record.published !== true) ||
    (record.sortOrder !== undefined && typeof record.sortOrder !== "number")
  ) {
    return null;
  }

  for (const field of ["email", "imageDataUrl"]) {
    if (record[field] !== undefined && typeof record[field] !== "string") return null;
  }

  if (!isStringArray("qualifications") && record.qualifications !== undefined) return null;
  if (!isStringArray("memberships") && record.memberships !== undefined) return null;

  const profile: LawyerProfile = {
    id,
    slug: record.slug as string,
    name: record.name as string,
    title: record.title as string,
    shortBio: record.shortBio as string,
    bio: record.bio as string,
    specialties: record.specialties as string[],
    qualifications: (record.qualifications as string[] | undefined) ?? [],
    memberships: (record.memberships as string[] | undefined) ?? [],
    published: record.published as boolean,
    sortOrder: (record.sortOrder as number | undefined) ?? 0,
    createdAt: typeof record.createdAt === "number" ? record.createdAt : 0,
    updatedAt: typeof record.updatedAt === "number" ? record.updatedAt : 0,
  };

  for (const field of ["email", "imageDataUrl"] as const) {
    const candidate = record[field];
    if (typeof candidate === "string" && candidate.trim()) profile[field] = candidate;
  }

  if (profile.imageDataUrl && !getLawyerImageSource(profile)) return null;

  return profile;
}

export function sortLawyerProfiles(profiles: LawyerProfile[]) {
  return [...profiles].sort(
    (first, second) => first.sortOrder - second.sortOrder || first.name.localeCompare(second.name),
  );
}
