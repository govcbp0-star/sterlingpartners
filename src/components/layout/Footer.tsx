import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Scale } from "lucide-react";
import { config } from "../../config";
import { firm } from "../../data/firm";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <Scale size={26} />
            <strong>{firm.name}</strong>
          </div>

          <p>{firm.description}</p>
          <span className="footer-tagline">{firm.tagline}</span>
        </div>

        <div>
          <h3>Quick Links</h3>
          {firm.navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => window.scrollTo(0, 0)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="footer-contact">
          <h3>Get in Touch</h3>
          {config.firmPhone && (
            <a href={`tel:${config.firmPhone}`}>
              <Phone size={17} aria-hidden="true" /> {config.firmPhone}
            </a>
          )}
          {config.firmEmail && (
            <a href={`mailto:${config.firmEmail}`}>
              <Mail size={17} aria-hidden="true" /> {config.firmEmail}
            </a>
          )}
          <p>
            <MapPin size={17} /> {firm.address}
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          © {new Date().getFullYear()} {firm.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
