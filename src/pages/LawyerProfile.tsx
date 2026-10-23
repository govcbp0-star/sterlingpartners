import { Link, useParams } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import LawyerPortrait from "../components/LawyerPortrait";
import Seo from "../components/Seo";
import { config } from "../config";
import { firm } from "../data/firm";
import { usePublishedLawyers } from "../hooks/usePublishedLawyers";
import { buildLawyerPersonStructuredData, createLawyerSeoPage } from "../seoConfig";

export default function LawyerProfile() {
  const { slug } = useParams();
  const { profiles, loading, error, retry } = usePublishedLawyers();
  const path = `/team/${encodeURIComponent(slug ?? "")}`;
  const fallbackPage = {
    path,
    title: `Lawyer Profile | ${firm.name}`,
    description: `View lawyer profiles and practice areas at ${firm.name}.`,
  };

  if (loading) {
    return <>
      <Seo page={fallbackPage} noindex includeFirmSchema={false} />
      <main className="section-padding container"><p role="status">Loading lawyer profile…</p></main>
    </>;
  }

  if (error) {
    return (
      <>
        <Seo page={fallbackPage} noindex includeFirmSchema={false} />
        <main className="section-padding container lawyer-data-message is-error" role="alert">
          <h1>Profile unavailable</h1>
          <p>{error}</p>
          <button className="button button-dark" type="button" onClick={retry}>Try again</button>
        </main>
      </>
    );
  }

  const lawyer = profiles.find((item) => item.slug === slug);

  if (!lawyer) {
    return (
      <>
        <Seo page={fallbackPage} noindex includeFirmSchema={false} />
        <main className="section-padding container">
          <h1>Lawyer Not Found</h1>
          <p>The requested lawyer profile could not be found or is not published.</p>
          <Link to="/team" className="button button-dark">Return to Our Lawyers</Link>
        </main>
      </>
    );
  }

  const page = createLawyerSeoPage(lawyer, firm.name);
  const personSchema = buildLawyerPersonStructuredData({
    siteUrl: config.siteUrl,
    firmName: firm.name,
    path: page.path,
    name: lawyer.name,
    title: lawyer.title,
    shortBio: lawyer.shortBio,
    specialties: lawyer.specialties,
    email: lawyer.email,
  });

  return (
    <main className="section-padding">
      <Seo page={page} openGraphType="profile" structuredData={[personSchema]} />
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

            {lawyer.email && (
              <>
                <h2>Contact {lawyer.name.split(" ")[0]}</h2>
                <div className="profile-contact">
                  <a href={"mailto:" + lawyer.email}><Mail size={18} aria-hidden="true" /> Email</a>
                </div>
              </>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
