import { Link, useNavigate, useParams } from "react-router-dom";
import LawyerProfileForm from "../../components/admin/LawyerProfileForm";
import { useAdminLawyers } from "../../hooks/useAdminLawyers";
import { saveLawyerProfile } from "../../data/adminLawyerRepository";
import type { LawyerProfileInput } from "../../data/lawyerProfile";

export default function LawyerEditorPage() {
  const { lawyerId } = useParams();
  const { profiles, loading, error, retry } = useAdminLawyers();
  const navigate = useNavigate();
  const profile = lawyerId ? profiles.find((item) => item.id === lawyerId) : undefined;

  if (loading) {
    return <main className="admin-page"><div className="admin-container"><p role="status">Loading profile records…</p></div></main>;
  }

  if (error) {
    return (
      <main className="admin-page">
        <div className="admin-container">
          <div className="admin-notice is-error" role="alert">
            <p>{error}</p>
            <button className="admin-button admin-button-secondary" type="button" onClick={retry}>Retry</button>
          </div>
        </div>
      </main>
    );
  }

  if (lawyerId && !profile) {
    return (
      <main className="admin-page">
        <div className="admin-container admin-empty-state">
          <h1>Profile not found</h1>
          <p>This profile may have been deleted or its database record is invalid.</p>
          <Link className="admin-button admin-button-secondary" to="/admin">Back to dashboard</Link>
        </div>
      </main>
    );
  }

  const handleSave = async (input: LawyerProfileInput) => {
    await saveLawyerProfile(input, profile);
    navigate("/admin", {
      replace: true,
      state: { notice: profile ? "Profile changes saved." : "Lawyer profile created." },
    });
  };

  return (
    <main className="admin-page">
      <div className="admin-container admin-editor-container">
        <LawyerProfileForm profiles={profiles} initialProfile={profile} onSave={handleSave} />
      </div>
    </main>
  );
}
