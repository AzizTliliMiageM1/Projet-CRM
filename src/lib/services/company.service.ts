import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { CompanyCreateInput, CompanyUpdateInput } from "@/lib/validation/schemas";
import type { RouteUserContext } from "@/lib/auth/route-guards";
import { logServerEvent } from "@/lib/utils/logger";

export async function listCompanies(
  supabase: SupabaseClient<Database>,
  user: RouteUserContext,
  search?: string,
) {
  let query = supabase
    .from("companies")
    .select("id, name, domain, created_at, updated_at")
    .eq("organization_id", user.organizationId)
    .order("created_at", { ascending: false });

  if (search) {
    const pattern = `%${search}%`;
    query = query.ilike("name", pattern);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createCompany(
  supabase: SupabaseClient<Database>,
  user: RouteUserContext,
  payload: CompanyCreateInput,
) {
  const { data, error } = await supabase
    .from("companies")
    .insert({
      name: payload.name,
      domain: payload.domain || null,
      organization_id: user.organizationId,
    })
    .select()
    .single();

  if (error) throw error;

  logServerEvent({
    userId: user.userId,
    action: "company.create",
    message: "Entreprise créée",
    metadata: { companyId: data.id },
  });

  return data;
}

export async function getCompanyById(
  supabase: SupabaseClient<Database>,
  user: RouteUserContext,
  id: string,
) {
  const { data, error } = await supabase
    .from("companies")
    .select("id, name, domain, created_at, updated_at")
    .eq("id", id)
    .eq("organization_id", user.organizationId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateCompany(
  supabase: SupabaseClient<Database>,
  user: RouteUserContext,
  id: string,
  payload: CompanyUpdateInput,
) {
  const { data, error } = await supabase
    .from("companies")
    .update({
      name: payload.name,
      domain: payload.domain,
    })
    .eq("id", id)
    .eq("organization_id", user.organizationId)
    .select()
    .maybeSingle();

  if (error) throw error;

  logServerEvent({
    userId: user.userId,
    action: "company.update",
    message: "Entreprise mise à jour",
    metadata: { companyId: id },
  });

  return data;
}

export async function deleteCompany(
  supabase: SupabaseClient<Database>,
  user: RouteUserContext,
  id: string,
) {
  const { error } = await supabase
    .from("companies")
    .delete()
    .eq("id", id)
    .eq("organization_id", user.organizationId);

  if (error) throw error;

  logServerEvent({
    userId: user.userId,
    action: "company.delete",
    message: "Entreprise supprimée",
    metadata: { companyId: id },
  });
}
