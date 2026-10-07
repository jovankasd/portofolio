export type { ProjectRow, CredentialRow, MessageRow, AuditLogRow, SiteSettingsRow } from "@/server/db/types";

export interface ProjectItem {
  id: string;
  title: string;
  summary: string;
  description: string;
  thumbnail_url: string;
  live_url?: string;
  github_url: string;
  ai_tags: string[];
  tech_stack: string[];
  sort_order: number;
  is_featured: boolean;
}

export interface CredentialItem {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  cert_image_url: string;
  proof_image_url?: string;
  verification_url?: string;
  category: "certificate" | "competition";
  sort_order: number;
}

export interface SocialLink {
  label: string;
  address: string;
  url: string;
}

export interface DossierProfile {
  codename: string;
  persona: string;
  status: string;
  location: string;
  bio: string;
  cv_filename: string;
  socials: SocialLink[];
}
