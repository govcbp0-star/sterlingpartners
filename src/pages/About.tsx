import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { firm } from "../data/firm";
import {
  aboutValues,
  firmHighlights,
  firmMilestones,
  practiceAreas,
} from "../data/firmContent";

export default function About() {
  return (
    <main>
      <section className="page-hero" aria-labelledby="about-heading">
        <div className="container">
          <span className="eyebrow">GET TO KNOW US</span>
          <h1 id="about-heading">About Sterling Legal Partners</h1>
          <p>
            Professional legal guidance grounded in preparation, integrity,
            and a commitment to our clients.
          </p>
        </div>
      </section>

      <section className="about-story section-padding" aria-labelledby="story-heading">
        <div className="container about-story-grid">
          <div className="about-story-photo">
            <img
              src="/images/hero1.webp"
              alt="Sculpture of Lady Justice holding the scales of justice"
              loading="lazy"
            />
          </div>
          <div className="about-copy">
            <span className="eyebrow">OUR STORY</span>
            <h2 id="story-heading">A Practice Built on Thoughtful Legal Support</h2>
            <p>
              Established in 2012, {firm.name} was founded with the aim of
              providing individuals and businesses with accessible, thoughtful,
              and professional legal support.
            </p>
            <p>
              The firm’s work has encompassed a range of legal matters, from
              business and commercial concerns to property, family, and
              inheritance issues. We seek to understand each client’s
              circumstances, explain available options, and prepare carefully
              for the matter at hand.
            </p>
            <Link to="/services" className="text-link">
              Explore Our Practice Areas <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="about-experience-section section-padding" aria-labelledby="experience-heading">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">OUR EXPERIENCE</span>
            <h2 id="experience-heading">A Practice That Continues to Grow</h2>
            <p>
              The firm’s background includes shared team experience across
              several areas of law and work with individuals, families,
              entrepreneurs, and businesses.
            </p>
          </div>

          <div className="firm-highlights-grid about-highlights-grid">
            {firmHighlights.map((highlight) => (
              <article className="firm-highlight" key={highlight.label}>
                <strong>{highlight.value}</strong>
                <span>{highlight.label}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-practice-section section-padding" aria-labelledby="about-practice-heading">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">OUR PRACTICE AREAS</span>
            <h2 id="about-practice-heading">Legal Support Across Key Areas</h2>
            <p>
              Our work addresses a range of personal and business matters.
              Contact the firm to discuss the circumstances relevant to you.
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
                  <p>{area.aboutDescription}</p>
                  <Link to="/services" className="text-link">
                    Learn more <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="values-section section-padding" aria-labelledby="values-heading">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">WHAT GUIDES US</span>
            <h2 id="values-heading">Our Values</h2>
            <p>
              The principles that inform how we approach legal work and client
              relationships.
            </p>
          </div>

          <div className="values-grid">
            {aboutValues.map((value) => {
              const Icon = value.icon;

              return (
                <article className="value-card" key={value.title}>
                  <Icon size={30} aria-hidden="true" />
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="firm-timeline-section section-padding" aria-labelledby="milestones-heading">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">OUR MILESTONES</span>
            <h2 id="milestones-heading">The Firm’s Development</h2>
            <p>
              A concise view of the firm’s establishment, continuing practice
              development, and direction.
            </p>
          </div>

          <ol className="firm-timeline">
            {firmMilestones.map((milestone) => (
              <li className="firm-timeline-item" key={milestone.title}>
                <span className="timeline-period">{milestone.period}</span>
                <div className="timeline-content">
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="people-intro-section section-padding" aria-labelledby="people-heading">
        <div className="container people-intro-inner">
          <div>
            <span className="eyebrow">OUR PEOPLE</span>
            <h2 id="people-heading">Meet the People Behind the Practice</h2>
            <p>
              Learn more about our team members, their professional roles, and
              the areas of law they work in.
            </p>
          </div>
          <Link to="/team" className="button button-dark">
            Meet Our Lawyers <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="contact-banner" aria-labelledby="about-contact-heading">
        <div className="container contact-banner-inner">
          <div>
            <span className="eyebrow">START A CONVERSATION</span>
            <h2 id="about-contact-heading">A Clearer Path Forward Starts With a Conversation</h2>
            <p>
              Learn more about how {firm.name} can assist with your legal needs.
            </p>
          </div>
          <Link to="/contact" className="button button-gold">
            Contact the Firm <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
