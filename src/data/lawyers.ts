export interface Lawyer {
  id: string;
  slug: string;
  name: string;
  title: string;
  bio: string;
  specializations: string[];
  email: string;
  phone: string;
  whatsapp: string;
  photo: string;
}

export const lawyers: Lawyer[] = [
  {
    id: "lawyer-1",
    slug: "john-mensah",
    name: "John Mensah",
    title: "Managing Partner",
    bio: "Provides legal guidance in commercial matters and dispute resolution.",
    specializations: ["Corporate Law", "Commercial Litigation"],
    email: "john@example.com",
    phone: "+233000000001",
    whatsapp: "233000000001",
    photo: "/images/lawyers/lawyer-1.webp",
  },
  {
    id: "lawyer-2",
    slug: "ama-boateng",
    name: "Ama Boateng",
    title: "Associate",
    bio: "Focuses on property matters, contracts, and legal advisory work.",
    specializations: ["Property Law", "Contracts"],
    email: "ama@example.com",
    phone: "+233000000002",
    whatsapp: "233000000002",
    photo: "/images/lawyers/lawyer-2.webp",
  },

   {
    id: "lawyer-3",
    slug: "ato-ampah",
    name: "Ato Ampah",
    title: "Associate",
    bio: "Focuses on property matters, contracts, and legal advisory work.",
    specializations: ["Property Law", "Contracts"],
    email: "aato@example.com",
    phone: "+233000000003",
    whatsapp: "233000000003",
    photo: "/images/lawyers/lawyer-3.webp",
  },
];
