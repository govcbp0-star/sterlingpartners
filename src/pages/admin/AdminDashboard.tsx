import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { ArrowUpRight, Plus, Search, ShieldCheck, Trash2, UserRoundPen } from "lucide-react";
import LawyerPortrait from "../../components/LawyerPortrait";
import { useAdminAuth } from "../../contexts/useAdminAuth";
import { useAdminLawyers } from "../../hooks/useAdminLawyers";
import { auth } from "../../lib/firebaseAuth";
import { deleteLawyerProfile, saveLawyerProfile } from "../../data/adminLawyerRepository";
import type { LawyerProfile } from "../../data/lawyerProfile";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "The request failed. Please try again.";
}

function profileInput(profile: LawyerProfile) {
  const input = { ...profile } as Partial<LawyerProfile>;
  delete input.id;
  delete input.createdAt;
  delete input.updatedAt;
  return input as Omit<LawyerProfile, "id" | "createdAt" | "updatedAt">;
}

export default function AdminDashboard() {
  const location = useLocation();
  const routeNotice = (location.state as { notice?: string } | null)?.notice;
  const { user } = useAdminAuth();
  const { profiles, loading, error, invalidCount, retry } = useAdminLawyers();
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(routeNotice ?? null);
  const [actionError, setActionError] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredProfiles = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return profiles;
    return profiles.filter((profile) =>
      [profile.name, profile.slug, profile.title, ...profile.specialties]
        .some((field) => field.toLowerCase().includes(term)),
    );
  }, [profiles, search]);

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    navigate("/admin/login", { replace: true });
  };

  const togglePublished = async (profile: LawyerProfile) => {
    setBusyId(profile.id);
    setNotice(null);
    setActionError(null);
    try {
      await saveLawyerProfile({ ...profileInput(profile), published: !profile.published }, profile);
      setNotice(profile.published ? "Profile moved to drafts." : "Profile published.");
    } catch (error) {
      setActionError(getErrorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (profile: LawyerProfile) => {
    const confirmed = window.confirm(
      "Permanently delete " + profile.name + "'s profile? This removes its draft and published record.",
    );
    if (!confirmed) return;

    setBusyId(profile.id);
    setNotice(null);
    setActionError(null);
    try {
      await deleteLawyerProfile(profile.id);
      setNotice(profile.name + "'s profile was deleted.");
    } catch (error) {
      setActionError(getErrorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  const publishedCount = profiles.filter((profile) => profile.published).length;

  return (
    <main className="admin-page">
      <div className="admin-container">
        <header className="admin-header">
          <div>
            <span className="eyebrow">STERLING LEGAL PARTNERS</span>
            <h1>Lawyer profiles</h1>
            <p>Manage the public team and profile pages.</p>
          </div>
          <div className="admin-header-actions">
            <span className="admin-session"><ShieldCheck size={16} aria-hidden="true" /> {user?.email}</span>
            <button className="admin-button admin-button-secondary" type="button" onClick={handleSignOut}>Sign out</button>
          </div>
        </header>

        <div className="admin-stats">
          <article className="admin-stat-card">
            <span>Total lawyers</span>
            <strong>{loading ? "—" : profiles.length}</strong>
          </article>
          <article className="admin-stat-card">
            <span>Published profiles</span>
            <strong>{loading ? "—" : publishedCount}</strong>
          </article>
          <article className="admin-stat-card">
            <span>Draft profiles</span>
            <strong>{loading ? "—" : profiles.length - publishedCount}</strong>
          </article>
        </div>

        {(notice || actionError) && (
          <div className={"admin-notice " + (actionError ? "is-error" : "is-success")} role={actionError ? "alert" : "status"}>
            {actionError ?? notice}
          </div>
        )}

        {error && (
          <div className="admin-notice is-error" role="alert">
            <p>{error}</p>
            <button className="admin-button admin-button-secondary" type="button" onClick={retry}>Retry connection</button>
          </div>
        )}

        {!error && invalidCount > 0 && (
          <div className="admin-notice is-warning" role="status">
            {invalidCount} invalid database {invalidCount === 1 ? "record is" : "records are"} hidden. Review the Realtime Database records before editing.
          </div>
        )}

        {!error && !loading && profiles.length === 0 && (
          <div className="admin-empty-state">
            <h2>No lawyer profiles yet</h2>
            <p>
              The existing sample records remain in <code>src/data/lawyers.ts</code> as a migration reference and are not shown publicly.
              Add each profile here, keeping its existing slug to preserve its profile URL, then select its image from <code>public/images/lawyers</code>.
            </p>
            <Link className="admin-button admin-button-primary" to="/admin/lawyers/new"><Plus size={17} /> Add first lawyer</Link>
          </div>
        )}

        {(loading || profiles.length > 0) && (
          <section className="admin-list-panel" aria-labelledby="admin-list-heading">
            <div className="admin-list-heading">
              <div>
                <h2 id="admin-list-heading">All profiles</h2>
                <p>{loading ? "Loading database records…" : "Search, preview, and update profile publication."}</p>
              </div>
              <Link className="admin-button admin-button-primary" to="/admin/lawyers/new"><Plus size={17} /> Add lawyer</Link>
            </div>

            <label className="admin-search">
              <Search size={18} aria-hidden="true" />
              <span className="visually-hidden">Search lawyer profiles</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, title, specialty, or slug" />
            </label>

            {!loading && filteredProfiles.length === 0 && (
              <p className="admin-list-empty">{profiles.length ? "No profiles match your search." : "No profile records found."}</p>
            )}

            <div className="admin-lawyer-list">
              {filteredProfiles.map((profile) => (
                <article className="admin-lawyer-row" key={profile.id}>
                  <div className="admin-lawyer-identity">
                    <div className="admin-lawyer-thumb"><LawyerPortrait profile={profile} /></div>
                    <div className="admin-lawyer-name">
                      <h3>{profile.name}</h3>
                      <p>{profile.title} <span aria-hidden="true">·</span> /team/{profile.slug}</p>
                    </div>
                  </div>
                  <span className={"admin-status " + (profile.published ? "is-published" : "is-draft")}>
                    {profile.published ? "Published" : "Draft"}
                  </span>
                  <div className="admin-row-actions">
                    <Link className="admin-action-link" to={"/admin/lawyers/" + profile.id + "/preview"}><ArrowUpRight size={16} /> Preview</Link>
                    <Link className="admin-action-link" to={"/admin/lawyers/" + profile.id + "/edit"}><UserRoundPen size={16} /> Edit</Link>
                    <button className="admin-action-link" type="button" onClick={() => void togglePublished(profile)} disabled={busyId === profile.id}>
                      {busyId === profile.id ? "Saving…" : profile.published ? "Unpublish" : "Publish"}
                    </button>
                    <button className="admin-action-link is-danger" type="button" onClick={() => void handleDelete(profile)} disabled={busyId === profile.id}>
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
