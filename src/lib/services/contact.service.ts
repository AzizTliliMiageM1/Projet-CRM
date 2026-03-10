import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { ContactCreateInput, ContactUpdateInput } from "@/lib/validation/schemas";
import type { RouteUserContext } from "@/lib/auth/route-guards";
import { logServerEvent } from "@/lib/utils/logger";

export async function listContacts(
  supabase: SupabaseClient<Database>,
  user: RouteUserContext,
  search?: string | null,
) {
  let query = supabase
    .from("contacts")
    .select("id, first_name, last_name, email, phone, company_id, created_at, updated_at")
    .eq("organization_id", user.organizationId)
    .order("created_at", { ascending: false });

  if (search) {
    const pattern = `%${search}%`;
    query = query.or(
      `first_name.ilike.${pattern},last_name.ilike.${pattern},email.ilike.${pattern}`,
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createContact(
  supabase: SupabaseClient<Database>,
  user: RouteUserContext,
  payload: ContactCreateInput,
) {
  const { data, error } = await supabase
    .from("contacts")
    .insert({
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      phone: payload.phone || null,
      company_id: payload.company_id || null,
      organization_id: user.organizationId,
    })
    .select()
    .single();

  if (error) throw error;

  logServerEvent({
    userId: user.userId,
    action: "contact.create",
    message: "Contact créé",
    metadata: { contactId: data.id },
  });

  return data;
}

export async function getContactById(
  supabase: SupabaseClient<Database>,
  user: RouteUserContext,
  id: string,
) {
  const { data, error } = await supabase
    .from("contacts")
    .select("id, first_name, last_name, email, phone, company_id, created_at, updated_at")
    .eq("id", id)
    .eq("organization_id", user.organizationId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateContact(
  supabase: SupabaseClient<Database>,
  user: RouteUserContext,
  id: string,
  payload: ContactUpdateInput,
) {
  const { data, error } = await supabase
    .from("contacts")
    .update({
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      phone: payload.phone,
      company_id: payload.company_id,
    })
    .eq("id", id)
    .eq("organization_id", user.organizationId)
    .select()
    .maybeSingle();

  if (error) throw error;

  logServerEvent({
    userId: user.userId,
    action: "contact.update",
    message: "Contact mis à jour",
    metadata: { contactId: id },
  });

  return data;
}

export async function deleteContact(
  supabase: SupabaseClient<Database>,
  user: RouteUserContext,
  id: string,
) {
  const { error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", id)
    .eq("organization_id", user.organizationId);

  if (error) throw error;

  logServerEvent({
    userId: user.userId,
    action: "contact.delete",
    message: "Contact supprimé",
    metadata: { contactId: id },
  });
}
