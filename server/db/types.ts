export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          summary: string;
          description: string | null;
          thumbnail_url: string | null;
          live_url: string | null;
          github_url: string | null;
          ai_tags: string[];
          tech_stack: string[];
          sort_order: number;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          summary: string;
          description?: string | null;
          thumbnail_url?: string | null;
          live_url?: string | null;
          github_url?: string | null;
          ai_tags?: string[];
          tech_stack?: string[];
          sort_order?: number;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      credentials: {
        Row: {
          id: string;
          title: string;
          issuer: string;
          issue_date: string;
          cert_image_url: string | null;
          proof_image_url: string | null;
          verification_url: string | null;
          category: "certificate" | "competition";
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          issuer: string;
          issue_date: string;
          cert_image_url?: string | null;
          proof_image_url?: string | null;
          verification_url?: string | null;
          category?: "certificate" | "competition";
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["credentials"]["Insert"]>;
      };
      messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
      admin_audit_log: {
        Row: {
          id: string;
          event_type: "login_success" | "login_fail" | "lockout";
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_type: "login_success" | "login_fail" | "lockout";
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: never;
      };
      site_settings: {
        Row: {
          id: number;
          hero_tagline: string | null;
          cv_url: string | null;
          footer_text: string | null;
          social_links: Json;
          skills: Json;
          tools: Json;
          principles: Json;
          updated_at: string;
        };
        Insert: {
          id?: number;
          hero_tagline?: string | null;
          cv_url?: string | null;
          footer_text?: string | null;
          social_links?: Json;
          skills?: Json;
          tools?: Json;
          principles?: Json;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
      };
      pages: {
        Row: {
          id: string;
          slug: string;
          title: string;
          content: string | null;
          metadata: PageMetadata;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          content?: string | null;
          metadata?: PageMetadata;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          content?: string | null;
          metadata?: PageMetadata;
          is_published?: boolean;
          updated_at?: string;
        };
      };
    };
  };
}

/** Free-form per-page fields (hero_name, profile_photo_url, ...). Values are plain strings. */
export type PageMetadata = Record<string, string>;

// Shorthand row types
export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type CredentialRow = Database["public"]["Tables"]["credentials"]["Row"];
export type MessageRow = Database["public"]["Tables"]["messages"]["Row"];
export type AuditLogRow = Database["public"]["Tables"]["admin_audit_log"]["Row"];
export type SiteSettingsRow = Database["public"]["Tables"]["site_settings"]["Row"];
export type PageRow = Database["public"]["Tables"]["pages"]["Row"];
