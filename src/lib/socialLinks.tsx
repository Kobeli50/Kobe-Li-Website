import type { ComponentType, SVGProps } from "react";
import { Github, Instagram, Linkedin } from "lucide-react";
import SubstackIcon from "@/components/icons/SubstackIcon";

const GoodreadsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
    <text x="12" y="18" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="27" fontWeight="400">g</text>
  </svg>
);

const XIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.835L0 1.154h7.594l5.243 6.932 6.064-6.933ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z" />
  </svg>
);

export type SocialLink = {
  id: "linkedin" | "instagram" | "goodreads" | "substack" | "x" | "github";
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  color?: string;
};

export const socialLinks: SocialLink[] = [
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/kobeli50/", icon: Linkedin, color: "#0A66C2" },
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/kobeli50/", icon: Instagram, color: "#C13584" },
  { id: "goodreads", label: "Goodreads", href: "https://www.goodreads.com/user/show/187557631-kobe", icon: GoodreadsIcon, color: "#553B26" },
  { id: "substack", label: "Substack", href: "https://substack.com/@kobeli2", icon: SubstackIcon, color: "#FF6719" },
  { id: "x", label: "X", href: "https://x.com/Kobeli50", icon: XIcon, color: "#171717" },
  { id: "github", label: "GitHub", href: "https://github.com/Kobeli50", icon: Github, color: "#24292F" },
];
