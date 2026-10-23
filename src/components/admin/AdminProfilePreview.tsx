import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MessageCircle } from "lucide-react";
import LawyerPortrait from "../LawyerPortrait";
import type { LawyerProfile } from "../../data/lawyerProfile";

interface AdminProfilePreviewProps {
  profile: LawyerProfile;
  backTo?: string;
  backLabel: string;
  onBack?: () => void;
}

export default function AdminProfilePreview({ profile, backTo, backLabel, onBack }: AdminProfilePreviewProps) {
  return (
    <div className="admin-preview-wrap">
      <div className="admin-preview-toolbar">
        {onBack ? (
          <button className="admin-back-link admin-link-button" type="button" onClick={onBack}>
            <ArrowLeft size={16} aria-hidden="true" /> {backLabel}
          </button>
        ) : (
          <Link to={backTo ?? "/admin"} className="admin-back-link"><ArrowLeft size={16} aria-hidden="true" /> {backLabel}</Link>
        )}
        <span className={profile.published ? "admin-status is-published" : "admin-status is-draft"}>
          {profile.published ? "Published preview" : "Draft preview"}
        </span>
      </div>

      <article className="profile-layout admin-public-preview">
        <div className="profile-photo">
          <LawyerPortrait profile={profile} loading="eager" />
        </div>

        <div className="profile-details">
          <span className="eyebrow">{profile.title}</span>
          <h1>{profile.name}</h1>
          <p className="profile-short-bio">{profile.shortBio}</p>
          <p>{profile.bio}</p>

          <h2>Areas of Practice</h2>
          <div className="specializations">
            {profile.specialties.map((specialty) => <span key={specialty}>{specialty}</span>)}
          </div>

          {profile.qualifications.length > 0 && (
            <>
              <h2>Qualifications</h2>
              <ul className="profile-list">{profile.qualifications.map((item) => <li key={item}>{item}</li>)}</ul>
            </>
          )}

          {profile.memberships.length > 0 && (
            <>
              <h2>Professional Memberships</h2>
              <ul className="profile-list">{profile.memberships.map((item) => <li key={item}>{item}</li>)}</ul>
            </>
          )}

          {(profile.phone || profile.email || profile.whatsapp) && (
            <>
              <h2>Contact {profile.name.split(" ")[0]}</h2>
              <div className="profile-contact">
                {profile.phone && <a href={"tel:" + profile.phone}><Phone size={18} aria-hidden="true" /> Call</a>}
                {profile.email && <a href={"mailto:" + profile.email}><Mail size={18} aria-hidden="true" /> Email</a>}
                {profile.whatsapp && (
                  <a href={"https://wa.me/" + profile.whatsapp.replace(/\D/g, "")} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={18} aria-hidden="true" /> WhatsApp
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </article>
    </div>
  );
}
