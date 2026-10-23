import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";
import LawyerPortrait from "../components/LawyerPortrait";
import { usePublishedLawyers } from "../hooks/usePublishedLawyers";

export default function Team() {
  const { profiles, loading, error, invalidCount, retry } = usePublishedLawyers();
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);
    retry();
    window.setTimeout(() => setRetrying(false), 500);
  };

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">THE PEOPLE BEHIND THE PRACTICE</span>
          <h1>Meet Our Lawyers</h1>
          <p>Connect with our legal team to find the appropriate contact for your enquiry.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">OUR TEAM</span>
            <h2>Professional Legal Support</h2>
            <p>Learn about our team members and the areas of law they work in.</p>
          </div>

          {loading && <p className="lawyer-data-message" role="status">Loading lawyer profiles…</p>}

          {!loading && error && (
            <div className="lawyer-data-message is-error" role="alert">
              <p>{error}</p>
              <button className="button button-dark" type="button" onClick={handleRetry} disabled={retrying}>
                {retrying ? "Retrying…" : "Try again"}
              </button>
            </div>
          )}

          {!loading && !error && invalidCount > 0 && (
            <p className="lawyer-data-warning" role="status">
              {invalidCount} incomplete profile {invalidCount === 1 ? "record is" : "records are"} hidden. Please review the database entries.
            </p>
          )}

          {!loading && !error && profiles.length === 0 && (
            <div className="lawyer-data-message">No published lawyer profiles are available yet.</div>
          )}

          {!loading && !error && profiles.length > 0 && (
            <div className="lawyers-grid">
              {profiles.map((lawyer) => (
                <article className="lawyer-card" key={lawyer.id}>
                  <div className="lawyer-photo">
                    <LawyerPortrait profile={lawyer} />
                  </div>

                  <div className="lawyer-info">
                    <span className="lawyer-title">{lawyer.title}</span>
                    <h2>{lawyer.name}</h2>
                    <p>{lawyer.shortBio}</p>

                    <div className="specializations" aria-label={lawyer.name + "'s practice areas"}>
                      {lawyer.specialties.map((specialty) => <span key={specialty}>{specialty}</span>)}
                    </div>

                    <Link to={"/team/" + lawyer.slug} className="text-link">
                      View Full Profile <ArrowRight size={16} aria-hidden="true" />
                    </Link>

                    <div className="lawyer-contact">
                      {lawyer.email && (
                        <a href={"mailto:" + lawyer.email} aria-label={"Email " + lawyer.name}>
                          <Mail size={17} aria-hidden="true" /> Email
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
