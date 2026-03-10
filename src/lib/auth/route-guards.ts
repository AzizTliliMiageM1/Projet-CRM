import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/types";
import type { UserRole } from "@/lib/types/crm";
import { isAdmin, isSales } from "@/lib/auth/roles";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface AuthUserContext {
  id: string;
  email: string | null;
  role: UserRole | null;
  organizationId: string | null;
}

export interface RouteContext {
  supabase: SupabaseClient<Database>;
  user: AuthUserContext;
}

export type RequiredRole = "admin" | "sales" | "user";

function hasRequiredRole(userRole: UserRole | null, required?: RequiredRole | RequiredRole[]) {
  if (!required) return !!userRole;
  const roles = Array.isArray(required) ? required : [required];

  return roles.some((role) => {
    if (role === "admin") return isAdmin(userRole);
    if (role === "sales") return isSales(userRole);
    return !!userRole;
  });
}

export async function requireAuth(options?: { role?: RequiredRole | RequiredRole[] }): Promise<RouteContext> {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: Parameters<typeof cookieStore.set>[2] }[]) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("UNAUTHENTICATED");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, organization_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error("PROFILE_LOOKUP_FAILED");
  }

  const role = (profile?.role as UserRole | null) ?? null;
  const organizationId = (profile?.organization_id as string | null) ?? null;

  if (!hasRequiredRole(role, options?.role)) {
    throw new Error("FORBIDDEN");
  }

  return {
    supabase,
    user: {
      id: user.id,
      email: user.email ?? null,
      role,
      organizationId,
    },
  };
}

export type RouteUserContext = {
  userId: string;
  role: RequiredRole;
  organizationId: string;
};

export async function getRouteUserContext(options?: {
  role?: RequiredRole | RequiredRole[];
}): Promise<{ supabase: SupabaseClient<Database>; user: RouteUserContext }> {
  const { supabase, user } = await requireAuth(options);

  if (!user.role || !user.organizationId) {
    throw new Error("MISSING_TENANT_CONTEXT");
  }

  return {
    supabase,
    user: {
      userId: user.id,
      role: user.role as RequiredRole,
      organizationId: user.organizationId,
    },
  };
}
