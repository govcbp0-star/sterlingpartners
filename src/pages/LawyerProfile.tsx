import { Link, useParams } from "react-router-dom";
import { Mail, Phone, MessageCircle, ArrowLeft } from "lucide-react";
import LawyerPortrait from "../components/LawyerPortrait";
import { usePublishedLawyers } from "../hooks/usePublishedLawyers";

export default function LawyerProfile() {
  const { slug } = useParams();
  const { profiles, loading, error, retry } = usePublishedLawyers();

  if (loading) {
    return <main className="section-padding container"><p role="status">Loading lawyer profile…</p></main>;
  }

  if (error) {
    return (
      <main className="section-padding container lawyer-data-message is-error" role="alert">
        <h1>Profile unavailable</h1>
        <p>{error}</p>
        <button className="button button-dark" type="button" onClick={retry}>Try again</button>
      </main>
    );
  }

  const lawyer = profiles.find((item) => item.slug === slug);

  if (!lawyer) {
    return (
      <main className="section-padding container">
        <h1>Lawyer Not Found</h1>
        <p>The requested lawyer profile could not be found or is not published.</p>
        <Link to="/team" className="button button-dark">Return to Our Lawyers</Link>
      </main>
    );
  }

  return (
    <main className="section-padding">
      <div className="container">
        <Link to="/team" className="text-link">
          <ArrowLeft size={16} aria-hidden="true" /> Back to Our Lawyers
        </Link>

        <article className="profile-layout">
          <div className="profile-photo">
            <LawyerPortrait profile={lawyer} loading="eager" />
          </div>

          <div className="profile-details">
            <span className="eyebrow">{lawyer.title}</span>
            <h1>{lawyer.name}</h1>
            <p className="profile-short-bio">{lawyer.shortBio}</p>
            <p>{lawyer.bio}</p>

            <h2>Areas of Practice</h2>
            <div className="specializations">
              {lawyer.specialties.map((specialty) => <span key={specialty}>{specialty}</span>)}
            </div>

            {lawyer.qualifications.length > 0 && (
              <>
                <h2>Qualifications</h2>
                <ul className="profile-list">
                  {lawyer.qualifications.map((qualification) => <li key={qualification}>{qualification}</li>)}
                </ul>
              </>
            )}

            {lawyer.memberships.length > 0 && (
              <>
                <h2>Professional Memberships</h2>
                <ul className="profile-list">
                  {lawyer.memberships.map((membership) => <li key={membership}>{membership}</li>)}
                </ul>
              </>
            )}

            {(lawyer.phone || lawyer.email || lawyer.whatsapp) && (
              <>
                <h2>Contact {lawyer.name.split(" ")[0]}</h2>
                <div className="profile-contact">
                  {lawyer.phone && <a href={"tel:" + lawyer.phone}><Phone size={18} aria-hidden="true" /> Call</a>}
                  {lawyer.email && <a href={"mailto:" + lawyer.email}><Mail size={18} aria-hidden="true" /> Email</a>}
                  {lawyer.whatsapp && (
                    <a href={"https://wa.me/" + lawyer.whatsapp.replace(/\D/g, "")} target="_blank" rel="noopener noreferrer">
                      <MessageCircle size={18} aria-hidden="true" /> WhatsApp
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
