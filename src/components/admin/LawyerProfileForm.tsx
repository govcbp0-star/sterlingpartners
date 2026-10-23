import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, ImagePlus, X } from "lucide-react";
import AdminProfilePreview from "./AdminProfilePreview";
import type { LawyerProfile, LawyerProfileInput } from "../../data/lawyerProfile";
import { processLawyerImage } from "../../lib/profileImage";

interface LawyerProfileFormProps {
  profiles: LawyerProfile[];
  initialProfile?: LawyerProfile;
  onSave: (input: LawyerProfileInput) => Promise<void>;
}

interface FormValues {
  name: string;
  slug: string;
  title: string;
  shortBio: string;
  bio: string;
  specialties: string;
  email: string;
  phone: string;
  whatsapp: string;
  qualifications: string;
  memberships: string;
  sortOrder: string;
  published: boolean;
  imageDataUrl?: string;
}

function makeSlug(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function listFromText(value: string) {
  return value.split(/[,\n]/).map((item) => item.trim()).filter(Boolean);
}

function toFormValues(profile: LawyerProfile | undefined, nextOrder: number): FormValues {
  return {
    name: profile?.name ?? "",
    slug: profile?.slug ?? "",
    title: profile?.title ?? "",
    shortBio: profile?.shortBio ?? "",
    bio: profile?.bio ?? "",
    specialties: profile?.specialties.join(", ") ?? "",
    email: profile?.email ?? "",
    phone: profile?.phone ?? "",
    whatsapp: profile?.whatsapp ?? "",
    qualifications: profile?.qualifications.join("\n") ?? "",
    memberships: profile?.memberships.join("\n") ?? "",
    sortOrder: String(profile?.sortOrder ?? nextOrder),
    published: profile?.published ?? false,
    imageDataUrl: profile?.imageDataUrl,
  };
}

export default function LawyerProfileForm({ profiles, initialProfile, onSave }: LawyerProfileFormProps) {
  const [values, setValues] = useState(() => toFormValues(initialProfile, profiles.length));
  const [slugTouched, setSlugTouched] = useState(Boolean(initialProfile));
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [processingImage, setProcessingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewProfile, setPreviewProfile] = useState<LawyerProfile | null>(null);

  const update = <K extends keyof FormValues,>(field: K, value: FormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setError(null);
  };

  const buildInput = (): LawyerProfileInput | null => {
    const name = values.name.trim();
    const slug = values.slug.trim().toLowerCase();
    const title = values.title.trim();
    const shortBio = values.shortBio.trim();
    const bio = values.bio.trim();
    const specialties = listFromText(values.specialties);
    const email = values.email.trim();
    const sortOrder = Number(values.sortOrder);

    if (!name || !slug || !title || !shortBio || !bio || specialties.length === 0) {
      setError("Complete the required fields: name, slug, title, short introduction, biography, and at least one practice area.");
      return null;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError("Use a URL slug with lowercase letters, numbers, and single hyphens.");
      return null;
    }
    if (profiles.some((profile) => profile.id !== initialProfile?.id && profile.slug.toLowerCase() === slug)) {
      setError("That URL slug is already in use. Choose a unique slug.");
      return null;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid professional email address.");
      return null;
    }
    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      setError("Display order must be a whole number greater than or equal to zero.");
      return null;
    }

    return {
      slug,
      name,
      title,
      shortBio,
      bio,
      specialties,
      email: email || undefined,
      phone: values.phone.trim() || undefined,
      whatsapp: values.whatsapp.trim() || undefined,
      qualifications: listFromText(values.qualifications),
      memberships: listFromText(values.memberships),
      imageDataUrl: values.imageDataUrl,
      published: values.published,
      sortOrder,
    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = buildInput();
    if (!input) return;

    setSaving(true);
    setError(null);
    try {
      await onSave(input);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "The profile could not be saved. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    const input = buildInput();
    if (!input) return;

    setPreviewProfile({
      ...input,
      id: initialProfile?.id ?? "unsaved-preview",
      createdAt: initialProfile?.createdAt ?? 0,
      updatedAt: initialProfile?.updatedAt ?? 0,
    });
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;

    setImageError(null);
    setProcessingImage(true);
    try {
      const imageDataUrl = await processLawyerImage(file);
      update("imageDataUrl", imageDataUrl);
    } catch (processingError) {
      setImageError(processingError instanceof Error ? processingError.message : "The image could not be processed.");
    } finally {
      setProcessingImage(false);
    }
  };

  if (previewProfile) {
    return (
      <div className="admin-editor-panel">
        <AdminProfilePreview
          profile={previewProfile}
          backLabel="Return to edit"
          onBack={() => setPreviewProfile(null)}
        />
        <div className="admin-preview-actions">
          <button className="admin-button admin-button-secondary" type="button" onClick={() => setPreviewProfile(null)}>
            <ArrowLeft size={16} /> Continue editing
          </button>
          <button className="admin-button admin-button-primary" type="button" onClick={() => setPreviewProfile(null)}>
            Looks good — return to form
          </button>
        </div>
      </div>
    );
  }

  return (
    <form id="edit-profile" className="admin-editor-panel admin-form" onSubmit={handleSubmit} noValidate>
      <div className="admin-form-intro">
        <div>
          <span className="eyebrow">LAWYER DETAILS</span>
          <h2>{initialProfile ? "Edit profile" : "Add a lawyer"}</h2>
          <p>Fields marked required are shown on the public profile.</p>
        </div>
        <Link className="admin-back-link" to="/admin"><ArrowLeft size={16} /> Back to dashboard</Link>
      </div>

      <div className="admin-form-grid">
        <label className="admin-field">
          <span>Full name <b aria-hidden="true">*</b></span>
          <input
            required
            autoComplete="name"
            value={values.name}
            onChange={(event) => {
              const name = event.target.value;
              setValues((current) => ({
                ...current,
                name,
                ...(!slugTouched ? { slug: makeSlug(name) } : {}),
              }));
              setError(null);
            }}
          />
        </label>

        <label className="admin-field">
          <span>URL slug <b aria-hidden="true">*</b></span>
          <input
            required
            value={values.slug}
            onChange={(event) => {
              setSlugTouched(true);
              update("slug", event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-{2,}/g, "-"));
            }}
            aria-describedby="slug-help"
          />
          <small id="slug-help">Profile URL: /team/{values.slug || "your-slug"}</small>
        </label>

        <label className="admin-field">
          <span>Professional title <b aria-hidden="true">*</b></span>
          <input required value={values.title} onChange={(event) => update("title", event.target.value)} />
        </label>

        <label className="admin-field">
          <span>Display order</span>
          <input type="number" min="0" step="1" value={values.sortOrder} onChange={(event) => update("sortOrder", event.target.value)} />
        </label>

        <label className="admin-field admin-field-full">
          <span>Short introduction <b aria-hidden="true">*</b></span>
          <textarea required rows={3} maxLength={260} value={values.shortBio} onChange={(event) => update("shortBio", event.target.value)} />
          <small>{values.shortBio.length}/260 characters</small>
        </label>

        <label className="admin-field admin-field-full">
          <span>Full biography <b aria-hidden="true">*</b></span>
          <textarea required rows={7} value={values.bio} onChange={(event) => update("bio", event.target.value)} />
        </label>

        <label className="admin-field admin-field-full">
          <span>Practice areas / specialties <b aria-hidden="true">*</b></span>
          <textarea required rows={3} placeholder="Separate each area with a comma or new line" value={values.specialties} onChange={(event) => update("specialties", event.target.value)} />
        </label>

        <label className="admin-field">
          <span>Professional email</span>
          <input type="email" autoComplete="email" value={values.email} onChange={(event) => update("email", event.target.value)} />
        </label>

        <label className="admin-field">
          <span>Phone number</span>
          <input type="tel" autoComplete="tel" value={values.phone} onChange={(event) => update("phone", event.target.value)} />
        </label>

        <label className="admin-field">
          <span>WhatsApp number</span>
          <input type="tel" value={values.whatsapp} onChange={(event) => update("whatsapp", event.target.value)} />
        </label>

        <label className="admin-field">
          <span>Qualifications</span>
          <textarea rows={3} placeholder="One per line" value={values.qualifications} onChange={(event) => update("qualifications", event.target.value)} />
        </label>

        <label className="admin-field admin-field-full">
          <span>Professional memberships</span>
          <textarea rows={3} placeholder="One per line" value={values.memberships} onChange={(event) => update("memberships", event.target.value)} />
        </label>

        <div className="admin-field admin-field-full">
          <span>Profile photograph</span>
          <p className="admin-help-text">JPEG, PNG, or WebP; up to 12 MB before processing. Images are resized to at most 600 × 600 and saved in the database.</p>
          <div className="admin-image-controls">
            <label className="admin-button admin-button-secondary admin-file-button">
              <ImagePlus size={17} /> {processingImage ? "Processing image…" : values.imageDataUrl ? "Replace image" : "Choose image"}
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void handleImageChange(event)} disabled={processingImage} />
            </label>
            {values.imageDataUrl && (
              <button className="admin-button admin-button-secondary" type="button" onClick={() => update("imageDataUrl", undefined)} disabled={processingImage}>
                <X size={16} /> Remove image
              </button>
            )}
          </div>
          {imageError && <p className="admin-notice is-error" role="alert">{imageError}</p>}
          {values.imageDataUrl && (
            <div className="admin-image-preview">
              <img src={values.imageDataUrl} alt="Selected lawyer portrait preview" />
              <span>Image ready to save</span>
            </div>
          )}
        </div>

        <label className="admin-publish-toggle admin-field-full">
          <input type="checkbox" checked={values.published} onChange={(event) => update("published", event.target.checked)} />
          <span>
            <strong>Publish this profile</strong>
            <small>Published profiles appear on the public Home, Team, and profile pages.</small>
          </span>
        </label>
      </div>

      {error && <p className="admin-notice is-error" role="alert">{error}</p>}

      <div className="admin-form-actions">
        <button className="admin-button admin-button-secondary" type="button" onClick={handlePreview} disabled={saving || processingImage}>
          <Eye size={17} /> Preview profile
        </button>
        <div>
          <Link className="admin-button admin-button-secondary" to="/admin">Cancel</Link>
          <button className="admin-button admin-button-primary" type="submit" disabled={saving || processingImage}>
            {saving ? "Saving…" : initialProfile ? "Save changes" : "Create profile"}
          </button>
        </div>
      </div>
    </form>
  );
}
