function required(key: string): string {
  const val = process.env[key];
  if (!val) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return val;
}

function optional(key: string, fallback = ""): string {
  return process.env[key] ?? fallback;
}

export const env = {
  supabase: {
    url: () => required("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: () => required("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    serviceRoleKey: () => optional("SUPABASE_SERVICE_ROLE_KEY"),
    hasServiceRole: () => !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  admin: {
    masterKeyHash: () => optional("ADMIN_MASTER_KEY_HASH"),
    sessionSecret: () => required("ADMIN_SESSION_SECRET"),
    hasMasterKeyHash: () => !!process.env.ADMIN_MASTER_KEY_HASH,
  },
  app: {
    url: () => optional("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
    isProduction: () => process.env.NODE_ENV === "production",
  },
} as const;
