import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Scale } from "lucide-react";
import LawyerPortrait from "../components/LawyerPortrait";
import { usePublishedLawyers } from "../hooks/usePublishedLawyers";
import {
  firmHighlights,
  homePrinciples,
  practiceAreas,
} from "../data/firmContent";
import { firm } from "../data/firm";

const heroImages = [
  "/images/hero1.webp",
  "/images/hero2.webp",
  "/images/hero3.webp",
  "/images/hero4.webp",
];

export default function Home() {
  const [activeHeroImage, setActiveHeroImage] = useState(0);
  const { profiles, loading: lawyersLoading, error: lawyersError, retry } = usePublishedLawyers();
  const featuredLawyers = profiles.slice(0, 3);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveHeroImage((currentImage) => (currentImage + 1) % heroImages.length);
    }, 30_000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <main>
      <section className="hero" aria-labelledby="home-heading">
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`hero-background${index === activeHeroImage ? " is-active" : ""}`}
            style={{ backgroundImage: `url("${image}")` }}
            aria-hidden="true"
          />
        ))}
        <div className="hero-overlay" aria-hidden="true" />
        <div className="container hero-content">
          <span className="eyebrow">STERLING LEGAL PARTNERS</span>
          <h1 id="home-heading">
            Trusted Legal Guidance.
            <br />
            <span>Thoughtful Representation.</span>
          </h1>
          <p>
            Sterling Legal Partners provides legal guidance and representation
            to individuals, families, entrepreneurs, and businesses. We approach
            each matter with professionalism, careful analysis, and a commitment
            to helping our clients navigate complex legal challenges.
          </p>

          <div className="hero-actions">
            <Link to="/services" className="button button-gold">
              Explore Our Services <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link to="/contact" className="button button-outline">
              Contact Our Team
            </Link>
          </div>

          <div className="hero-note">
            <Scale size={18} aria-hidden="true" />
            Careful preparation. Clear communication.
          </div>
        </div>
      </section>

      <section className="firm-highlights-section" aria-label="Firm highlights">
        <div className="container firm-highlights-grid">
          {firmHighlights.map((highlight) => (
            <article className="firm-highlight" key={highlight.label}>
              <strong>{highlight.value}</strong>
              <span>{highlight.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="services-section section-padding" aria-labelledby="practice-heading">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">HOW WE CAN HELP</span>
            <h2 id="practice-heading">Our Practice Areas</h2>
            <p>
              Practical guidance across the legal matters that affect people,
              families, and businesses.
            </p>
          </div>

          <div className="services-grid">
            {practiceAreas.map((area) => {
              const Icon = area.icon;

              return (
                <article className="service-card practice-area-card" key={area.title}>
                  <div className="service-icon">
                    <Icon size={28} aria-hidden="true" />
                  </div>
                  <h3>{area.title}</h3>
                  <p>{area.homeDescription}</p>
                  <Link to="/services" className="text-link">
                    Learn more <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>

          <div className="services-action">
            <Link to="/services" className="button button-dark">
              View All Services <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="principles-section section-padding" aria-labelledby="principles-heading">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">OUR APPROACH</span>
            <h2 id="principles-heading">Why Work With Sterling Legal Partners</h2>
            <p>
              A considered approach to understanding your needs, explaining
              options, and preparing for the work ahead.
            </p>
          </div>

          <div className="principles-grid">
            {homePrinciples.map((principle) => {
              const Icon = principle.icon;

              return (
                <article className="principle-card" key={principle.title}>
                  <Icon size={28} aria-hidden="true" />
                  <h3>{principle.title}</h3>
                  <p>{principle.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-lawyers-section section-padding" aria-labelledby="home-lawyers-heading">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">THE PEOPLE BEHIND THE PRACTICE</span>
            <h2 id="home-lawyers-heading">Meet Our Lawyers</h2>
            <p>
              Get to know the team and the areas of law they work in.
            </p>
          </div>

          {lawyersLoading && <p className="lawyer-data-message" role="status">Loading lawyer profiles…</p>}

          {!lawyersLoading && lawyersError && (
            <div className="lawyer-data-message is-error" role="alert">
              <p>Lawyer profiles could not be loaded. {lawyersError}</p>
              <button className="button button-dark" type="button" onClick={retry}>Try again</button>
            </div>
          )}

          {!lawyersLoading && !lawyersError && featuredLawyers.length === 0 && (
            <p className="lawyer-data-message">Lawyer profiles will appear here when they are published.</p>
          )}

          {!lawyersLoading && !lawyersError && featuredLawyers.length > 0 && (
            <div className="home-lawyers-grid">
              {featuredLawyers.map((lawyer) => (
                <article className="lawyer-card home-lawyer-card" key={lawyer.id}>
                  <div className="lawyer-photo">
                    <LawyerPortrait profile={lawyer} />
                  </div>
                  <div className="lawyer-info">
                    <span className="lawyer-title">{lawyer.title}</span>
                    <h3>{lawyer.name}</h3>
                    <div className="specializations" aria-label={lawyer.name + "'s practice areas"}>
                      {lawyer.specialties.map((specialty) => <span key={specialty}>{specialty}</span>)}
                    </div>
                    <Link to={`/team/${lawyer.slug}`} className="text-link">
                      View {lawyer.name.split(" ")[0]}'s profile
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="services-action">
            <Link to="/team" className="button button-dark">
              Meet the Full Team <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="firm-intro-section section-padding" aria-labelledby="firm-intro-heading">
        <div className="container firm-intro-grid">
          <div className="firm-intro-aside" aria-label={`Established ${firmHighlights[0].value}`}>
            <Scale size={42} aria-hidden="true" />
            <span>Established {firmHighlights[0].value}</span>
            <strong>Thoughtful advice for important decisions.</strong>
          </div>
          <div className="firm-intro-copy">
            <span className="eyebrow">ABOUT THE FIRM</span>
            <h2 id="firm-intro-heading">A Clear and Considered Approach to Legal Work</h2>
            <p>
              Since its establishment in 2012, Sterling Legal Partners has
              focused on helping individuals and businesses address their legal
              needs with clarity and professionalism. Our work spans a range of
              legal practice areas, bringing together careful preparation,
              practical advice, and a considered approach to each matter.
            </p>
            <Link to="/about" className="text-link">
              Learn About {firm.name} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="contact-banner" aria-labelledby="home-contact-heading">
        <div className="container contact-banner-inner">
          <div>
            <span className="eyebrow">LET'S DISCUSS YOUR NEEDS</span>
            <h2 id="home-contact-heading">Let’s Discuss Your Legal Needs</h2>
            <p>
              Whether you are navigating a business matter, a property issue,
              a family concern, or a legal dispute, our team can help you
              explore the appropriate next steps.
            </p>
          </div>
          <Link to="/contact" className="button button-gold">
            Contact Us <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
