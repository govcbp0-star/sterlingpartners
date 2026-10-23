import { Link, useParams } from "react-router-dom";
import AdminProfilePreview from "../../components/admin/AdminProfilePreview";
import { useAdminLawyers } from "../../hooks/useAdminLawyers";

export default function AdminPreviewPage() {
  const { lawyerId } = useParams();
  const { profiles, loading, error, retry } = useAdminLawyers();

  if (loading) {
    return <main className="admin-page"><div className="admin-container"><p role="status">Loading profile preview…</p></div></main>;
  }

  if (error) {
    return (
      <main className="admin-page">
        <div className="admin-container admin-notice is-error" role="alert">
          <p>{error}</p>
          <button className="admin-button admin-button-secondary" type="button" onClick={retry}>Retry</button>
        </div>
      </main>
    );
  }

  const profile = profiles.find((item) => item.id === lawyerId);
  if (!profile) {
    return (
      <main className="admin-page">
        <div className="admin-container admin-empty-state">
          <h1>Preview unavailable</h1>
          <p>This profile was not found or its database record is invalid.</p>
          <Link className="admin-button admin-button-secondary" to="/admin">Back to dashboard</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-container admin-editor-container">
        <AdminProfilePreview
          profile={profile}
          backTo={"/admin/lawyers/" + profile.id + "/edit"}
          backLabel="Back to edit"
        />
      </div>
    </main>
  );
}
