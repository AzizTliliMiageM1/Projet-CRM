export type AppEnv = {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  BREVO_API_KEY?: string;
  BREVO_SENDER_EMAIL?: string;
  BREVO_SENDER_NAME?: string;
};

let cachedEnv: AppEnv | null = null;

export function getEnv(options?: { requireSupabase?: boolean; requireBrevo?: boolean }): AppEnv {
  if (cachedEnv) return cachedEnv;

  const env: AppEnv = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL,
    BREVO_SENDER_NAME: process.env.BREVO_SENDER_NAME,
  };

  if (process.env.NODE_ENV === "production") {
    const missing: string[] = [];

    if (options?.requireSupabase) {
      if (!env.NEXT_PUBLIC_SUPABASE_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL");
      if (!env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }

    if (options?.requireBrevo) {
      if (!env.BREVO_API_KEY) missing.push("BREVO_API_KEY");
      if (!env.BREVO_SENDER_EMAIL) missing.push("BREVO_SENDER_EMAIL");
    }

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }
  }

  cachedEnv = env;
  return env;
}
