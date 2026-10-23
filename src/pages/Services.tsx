import {
  Building2,
  FileText,
  Home,
  Scale,
  Users,
  BriefcaseBusiness,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Building2,
    title: "Corporate & Commercial Law",
    description:
      "Legal support for businesses, commercial agreements, corporate governance, and business transactions.",
  },
  {
    icon: Scale,
    title: "Litigation & Dispute Resolution",
    description:
      "Guidance and representation in civil disputes, negotiations, and other dispute resolution processes.",
  },
  {
    icon: Home,
    title: "Property & Real Estate",
    description:
      "Assistance with property transactions, leases, title-related matters, and real estate agreements.",
  },
  {
    icon: FileText,
    title: "Contracts & Legal Documentation",
    description:
      "Preparation, review, and guidance on contracts, agreements, and other legal documents.",
  },
  {
    icon: Users,
    title: "Family & Personal Legal Matters",
    description:
      "Legal guidance for appropriate family, succession, and personal legal matters.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Legal Advisory & Consultation",
    description:
      "Legal research, risk assessment, and practical advice to help clients understand their options.",
  },
];

export default function Services() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">OUR PRACTICE AREAS</span>
          <h1>Legal Services</h1>
          <p>
            Professional legal guidance for individuals,
            entrepreneurs, businesses, and institutions.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">HOW WE CAN HELP</span>
            <h2>Our Areas of Practice</h2>
            <p>
              Explore our practice areas to find the kind of
              legal support relevant to your needs.
            </p>
          </div>

          <div className="services-grid">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article className="service-card" key={service.title}>
                  <div className="service-icon">
                    <Icon size={28} />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <Link
                    to="/contact"
                    className="text-link"
                  >
                    Make an Enquiry <span aria-hidden="true">→</span>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="contact-banner">
        <div className="container contact-banner-inner">
          <div>
            <span className="eyebrow">NEED LEGAL GUIDANCE?</span>
            <h2>Let's Talk About Your Legal Needs</h2>
            <p>Contact the firm to discuss your enquiry.</p>
          </div>
          <Link to="/contact" className="button button-gold">
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}