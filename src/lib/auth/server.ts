import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types/crm";

export interface CurrentUser {
  id: string;
  email: string | null;
  role: UserRole | null;
  full_name: string | null;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? null,
    role: (profile?.role as UserRole | null) ?? null,
    full_name: (profile?.full_name as string | null) ?? null,
  };
}
