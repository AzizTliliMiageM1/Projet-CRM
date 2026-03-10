import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { LeadCreateInput, LeadUpdateInput } from "@/lib/validation/schemas";
import type { RouteUserContext } from "@/lib/auth/route-guards";
import { logServerEvent } from "@/lib/utils/logger";
import { isAdmin } from "@/lib/auth/roles";
import { sendTransactionalEmail } from "@/lib/email/email.service";
import { buildLeadWonTemplate } from "@/lib/email/templates";

export async function listLeads(
  supabase: SupabaseClient<Database>,
  user: RouteUserContext,
  status?: string | null,
) {
  let query = supabase
    .from("leads")
    .select("id, title, status, value, company_id, contact_id, owner_id, created_at, updated_at")
    .eq("organization_id", user.organizationId)
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  // Règle métier :
  // - admin : tous les leads
  // - sales/user : seulement les leads dont ils sont owner
  if (!isAdmin(user.role)) {
    query = query.eq("owner_id", user.userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createLead(
  supabase: SupabaseClient<Database>,
  user: RouteUserContext,
  payload: LeadCreateInput,
) {
  const { data, error } = await supabase
    .from("leads")
    .insert({
      title: payload.title,
      status: payload.status ?? "new",
      value: payload.value ?? 0,
      company_id: payload.company_id || null,
      contact_id: payload.contact_id || null,
      // Anti-escalade : un sales ne peut créer qu'avec lui-même comme owner
      owner_id: isAdmin(user.role) ? payload.owner_id || user.userId : user.userId,
      organization_id: user.organizationId,
    })
    .select()
    .single();

  if (error) throw error;

  logServerEvent({
    userId: user.userId,
    action: "lead.create",
    message: "Lead créé",
    metadata: { leadId: data.id },
  });

  return data;
}

export async function getLeadById(
  supabase: SupabaseClient<Database>,
  user: RouteUserContext,
  id: string,
) {
  let query = supabase
    .from("leads")
    .select("id, title, status, value, company_id, contact_id, owner_id, created_at, updated_at")
    .eq("id", id)
    .eq("organization_id", user.organizationId)
    .limit(1);

  if (!isAdmin(user.role)) {
    query = query.eq("owner_id", user.userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data?.[0] ?? null;
}

export async function updateLead(
  supabase: SupabaseClient<Database>,
  user: RouteUserContext,
  id: string,
  payload: LeadUpdateInput,
) {
  const existing = await getLeadById(supabase, user, id);
  const oldStatus = existing?.status ?? null;

  // Empêcher une élévation de privilège en changeant owner_id pour un rôle non admin
  const updatePayload = {
    title: payload.title,
    status: payload.status,
    value: payload.value,
    company_id: payload.company_id,
    contact_id: payload.contact_id,
    owner_id: isAdmin(user.role) ? payload.owner_id : undefined,
  };

  let query = supabase
    .from("leads")
    .update(updatePayload)
    .eq("id", id)
    .eq("organization_id", user.organizationId)
    .select()
    .limit(1);

  if (!isAdmin(user.role)) {
    query = query.eq("owner_id", user.userId);
  }

  const { data, error } = await query;
  if (error) throw error;

  const lead = data?.[0] ?? null;

  if (lead) {
    logServerEvent({
      userId: user.userId,
      action: "lead.update",
      message: "Lead mis à jour",
      metadata: { leadId: id },
    });

    const newStatus = (lead as { status?: string | null }).status ?? oldStatus;

    if (oldStatus !== "won" && newStatus === "won") {
      logServerEvent({
        userId: user.userId,
        action: "lead.status.changed",
        message: "Lead status changed",
        metadata: {
          leadId: id,
          oldStatus,
          newStatus,
        },
      });

      try {
        let recipientEmail: string | null = null;
        let recipientName: string | null = null;

        if (lead.contact_id) {
          const { data: contact } = await supabase
            .from("contacts")
            .select("email, first_name")
            .eq("id", lead.contact_id)
            .eq("organization_id", user.organizationId)
            .maybeSingle();

          recipientEmail = contact?.email ?? null;
          recipientName = contact?.first_name ?? null;
        }

        if (recipientEmail) {
          await sendTransactionalEmail(
            { supabase, user, leadId: id },
            {
              to: [{ email: recipientEmail, name: recipientName ?? undefined }],
              subject: "Félicitations – Votre projet est validé",
              htmlContent: buildLeadWonTemplate({
                contactFirstName: recipientName,
                leadTitle: lead.title,
              }),
            },
          );
        }
      } catch {
        // L email est un side-effect : ne jamais bloquer la mise à jour du lead
      }
    }
  }

  return lead;
}

export async function deleteLead(
  supabase: SupabaseClient<Database>,
  user: RouteUserContext,
  id: string,
) {
  let query = supabase
    .from("leads")
    .delete()
    .eq("id", id)
    .eq("organization_id", user.organizationId);

  if (!isAdmin(user.role)) {
    query = query.eq("owner_id", user.userId);
  }

  const { error } = await query;
  if (error) throw error;

  logServerEvent({
    userId: user.userId,
    action: "lead.delete",
    message: "Lead supprimé",
    metadata: { leadId: id },
  });
}
