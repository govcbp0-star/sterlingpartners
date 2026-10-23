import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Scale } from "lucide-react";
import { config } from "../../config";
import { firm } from "../../data/firm";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function closeMenuOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    }

    window.addEventListener("keydown", closeMenuOnEscape);
    return () => window.removeEventListener("keydown", closeMenuOnEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <nav className="navbar container">
        <Link
          to="/"
          className="brand"
          onClick={() => setMenuOpen(false)}
        >
          <span className="brand-icon">
            <Scale size={25} />
          </span>
          <span>
            <strong>{firm.name}</strong>
            <small>ATTORNEYS & LEGAL CONSULTANTS</small>
          </span>
        </Link>

        <button
          ref={menuButtonRef}
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <div
          id="primary-navigation"
          className={`nav-links ${menuOpen ? "open" : ""}`}
        >
          {firm.navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {config.firmPhone ? (
            <a
              className="nav-cta"
              href={`tel:${config.firmPhone}`}
              onClick={() => setMenuOpen(false)}
            >
              Contact Us
            </a>
          ) : (
            <Link
              className="nav-cta"
              to="/contact"
              onClick={() => setMenuOpen(false)}
            >
              Contact Us
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
