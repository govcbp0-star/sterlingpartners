import { Scale } from "lucide-react";
import { getLawyerImageSource, type LawyerProfile } from "../data/lawyerProfile";

interface LawyerPortraitProps {
  profile: Pick<LawyerProfile, "name" | "imageDataUrl">;
  className?: string;
  loading?: "eager" | "lazy";
}

export default function LawyerPortrait({ profile, className, loading = "lazy" }: LawyerPortraitProps) {
  const source = getLawyerImageSource(profile);

  if (!source) {
    return (
      <div className={`${className ?? ""} lawyer-image-placeholder`} role="img" aria-label={`No portrait for ${profile.name}`}>
        <Scale size={36} aria-hidden="true" />
      </div>
    );
  }

  return <img className={className} src={source} alt={`Portrait of ${profile.name}`} loading={loading} />;
}
