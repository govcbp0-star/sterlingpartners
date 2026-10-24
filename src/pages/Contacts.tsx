
import { useState, type FormEvent } from "react";
import { Clock, Headphones, Mail, MapPin, Phone } from "lucide-react";
import { config } from "../config";
import { firm } from "../data/firm";
import Seo from "../components/Seo";
import { seoPages } from "../seoConfig";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");

    if (!config.web3FormsAccessKey) {
      setError("The enquiry form is not available right now. Please contact the firm using the details listed.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: config.web3FormsAccessKey,
            subject: `Website enquiry from ${name}`,
            name,
            email,
            message,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to send your enquiry."
        );
      }

      setStatus("Your enquiry has been sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setError(
        "We couldn't send your enquiry. Please try again or email us directly."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <Seo page={seoPages.contact} />
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">WE'RE HERE TO HELP</span>
          <h1>Contact Our Firm</h1>
          <p>
            Reach out to discuss your enquiry or find out how to
            contact the appropriate member of our team.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container contact-layout">
          <div className="contact-details">
            <span className="eyebrow">GET IN TOUCH</span>
            <h2>Let's Start a Conversation</h2>
            <p>
              Contact us using the details below. Please avoid
              including confidential case information in an initial
              email or enquiry.
            </p>

            {config.firmPhone && (
              <a className="contact-detail" href={`tel:${config.firmPhone}`}>
                <span><Phone size={21} aria-hidden="true" /></span>
                <div>
                  <strong>Call Us</strong>
                  <p>{config.firmPhone}</p>
                </div>
              </a>
            )}

            {config.firmEmail && (
              <a className="contact-detail" href={`mailto:${config.firmEmail}`}>
                <span><Mail size={21} aria-hidden="true" /></span>
                <div>
                  <strong>Email Us</strong>
                  <p>{config.firmEmail}</p>
                </div>
              </a>
            )}

            <div className="contact-detail">
              <span><MapPin size={21} /></span>
              <div>
                <strong>Office Location</strong>
                <p>{firm.address}</p>
              </div>
            </div>

            <section className="office-hours-card" aria-labelledby="office-hours-title">
              <div className="office-hours-heading">
                <Clock size={20} aria-hidden="true" />
                <h3 id="office-hours-title">Office Hours</h3>
              </div>

              <dl className="office-hours-list">
                {firm.officeHours.map(({ days, hours }) => (
                  <div className="office-hours-row" key={days}>
                    <dt>{days}</dt>
                    <dd>{hours}</dd>
                  </div>
                ))}
              </dl>

              <div className="office-receptionist">
                <Headphones size={19} aria-hidden="true" />
                <p><strong>AI Phone Receptionist:</strong> {firm.receptionistAvailability}</p>
              </div>

              <p className="office-hours-note">{firm.officeHoursNote}</p>
            </section>

          </div>

          <div className="contact-form-card">
            <h2>Send an Enquiry</h2>
            <p>
              Complete the form below to send an enquiry directly to our firm.
            </p>

            <form onSubmit={handleSubmit}>
              <label htmlFor="contact-name">Your Name</label>
              <input
                id="contact-name"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />

              <label htmlFor="contact-email">Email Address</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />

              <label htmlFor="contact-message">How can we help?</label>
              <textarea
                id="contact-message"
                name="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Briefly describe your enquiry. Do not include confidential details."
                rows={5}
                required
              />

              {error && (
                <p role="alert" style={{ color: "#b42318" }}>
                  {error}
                </p>
              )}

              {status && (
                <p role="status" style={{ color: "#18794e" }}>
                  {status}
                </p>
              )}

              <button
                className="button button-dark"
                type="submit"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Enquiry"}
                {!loading && <Mail size={17} />}
              </button>

              <small>
                Please do not include confidential or sensitive case information.
              </small>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
