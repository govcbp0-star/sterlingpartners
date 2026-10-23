import {
  Building2,
  FileText,
  Handshake,
  HeartHandshake,
  Home,
  MessageCircle,
  Scale,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface FirmHighlight {
  value: string;
  label: string;
}

export const firmHighlights: FirmHighlight[] = [
  { value: "2012", label: "Established" },
  { value: "15+ years", label: "Combined legal experience" },
  { value: "5", label: "Core practice areas" },
  { value: "Individuals & businesses", label: "Client groups" },
];

export interface PracticeArea {
  title: string;
  icon: LucideIcon;
  homeDescription: string;
  aboutDescription: string;
}

export const practiceAreas: PracticeArea[] = [
  {
    title: "Corporate Law",
    icon: Building2,
    homeDescription:
      "Support with business formation, commercial agreements, governance, and business-related legal matters.",
    aboutDescription:
      "Guidance for businesses at different stages, including formation, commercial agreements, corporate governance, and related legal matters.",
  },
  {
    title: "Litigation and Dispute Resolution",
    icon: Scale,
    homeDescription:
      "Representation and guidance for resolving disputes through appropriate legal processes.",
    aboutDescription:
      "Advice and representation through civil disputes, negotiations, and other appropriate dispute-resolution processes.",
  },
  {
    title: "Property and Real Estate",
    icon: Home,
    homeDescription:
      "Assistance with property transactions, ownership matters, leases, and property disputes.",
    aboutDescription:
      "Support with property transactions, ownership and land-related issues, leases, agreements, and property disputes.",
  },
  {
    title: "Family Law",
    icon: Users,
    homeDescription:
      "Guidance on separation, divorce, maintenance, and other family-related proceedings.",
    aboutDescription:
      "Careful guidance on family-related matters, including separation, divorce, maintenance, and relevant proceedings.",
  },
  {
    title: "Wills and Inheritance",
    icon: FileText,
    homeDescription:
      "Help with wills, estate planning, probate, and inheritance-related matters.",
    aboutDescription:
      "Assistance with preparing wills, planning estates, probate, administration of estates, and inheritance matters.",
  },
];

export interface FirmPrinciple {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const homePrinciples: FirmPrinciple[] = [
  {
    title: "Client-Focused Guidance",
    description:
      "We take time to understand each client's circumstances and priorities.",
    icon: HeartHandshake,
  },
  {
    title: "Professional Integrity",
    description:
      "We approach legal work with honesty, responsibility, and respect.",
    icon: ShieldCheck,
  },
  {
    title: "Practical Legal Solutions",
    description:
      "We explain options and help clients consider appropriate next steps.",
    icon: Handshake,
  },
  {
    title: "Clear Communication",
    description:
      "We aim to make legal issues and processes easier to understand.",
    icon: MessageCircle,
  },
];

export const aboutValues: FirmPrinciple[] = [
  {
    title: "Integrity",
    description:
      "Approaching legal work with honesty, professional responsibility, and respect for client confidentiality.",
    icon: ShieldCheck,
  },
  {
    title: "Diligence",
    description:
      "Preparing carefully, examining relevant details, and approaching each matter thoughtfully.",
    icon: FileText,
  },
  {
    title: "Client Commitment",
    description:
      "Taking time to understand client circumstances, priorities, and concerns.",
    icon: HeartHandshake,
  },
  {
    title: "Clarity",
    description:
      "Explaining legal issues, available options, and next steps in a way clients can understand.",
    icon: MessageCircle,
  },
];

export interface FirmMilestone {
  period: string;
  title: string;
  description: string;
}

export const firmMilestones: FirmMilestone[] = [
  {
    period: "2012",
    title: "The Beginning",
    description: "Sterling Chambers is established.",
  },
  {
    period: "Practice development",
    title: "Building the Practice",
    description:
      "The firm's work develops across corporate, litigation, property, family, and inheritance matters.",
  },
  {
    period: "Professional growth",
    title: "Growing Experience",
    description:
      "The team continues to develop its legal knowledge and practice experience.",
  },
  {
    period: "Looking ahead",
    title: "Continuing the Commitment",
    description:
      "The firm remains focused on professional development, thoughtful client service, and changing legal needs.",
  },
];
