import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { TaskCreateInput, TaskUpdateInput } from "@/lib/validation/schemas";
import type { RouteUserContext } from "@/lib/auth/route-guards";
import { isAdmin } from "@/lib/auth/roles";
import { logServerEvent } from "@/lib/utils/logger";

export async function listTasks(
  supabase: SupabaseClient<Database>,
  user: RouteUserContext,
  onlyUrgent: boolean,
) {
  let query = supabase
    .from("tasks")
    .select("id, lead_id, title, due_date, completed, created_at, updated_at")
    .eq("organization_id", user.organizationId)
    .order("due_date", { ascending: true });

  // Règle métier :
  // - admin : toutes les tâches de l'organisation
  // - sales/user : uniquement les tâches qui leur sont assignées
  if (!isAdmin(user.role)) {
    query = query.eq("assigned_to", user.userId);
  }
  const { data, error } = await query;
  if (error) throw error;

  const all = data ?? [];

  if (!onlyUrgent) return all;

  const now = new Date();
  return all.filter((t) => {
    if (t.completed) return false;
    if (!t.due_date) return false;
    const due = new Date(t.due_date);
    const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 2;
  });
}

export async function createTask(
  supabase: SupabaseClient<Database>,
  user: RouteUserContext,
  payload: TaskCreateInput,
) {
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      lead_id: payload.lead_id || null,
      title: payload.title,
      due_date: payload.due_date,
      completed: payload.completed ?? false,
      organization_id: user.organizationId,
      assigned_to: user.userId,
    })
    .select()
    .single();

  if (error) throw error;

  logServerEvent({
    userId: user.userId,
    action: "task.create",
    message: "Tâche créée",
    metadata: { taskId: data.id },
  });

  return data;
}

export async function updateTask(
  supabase: SupabaseClient<Database>,
  user: RouteUserContext,
  id: string,
  payload: TaskUpdateInput,
) {
  const { data, error } = await supabase
    .from("tasks")
    .update({
      title: payload.title,
      due_date: payload.due_date,
      completed: payload.completed,
    })
    .eq("id", id)
    .eq("organization_id", user.organizationId)
    .select()
    .maybeSingle();

  if (error) throw error;

  if (data) {
    logServerEvent({
      userId: user.userId,
      action: "task.update",
      message: "Tâche mise à jour",
      metadata: { taskId: id },
    });
  }

  return data;
}

export async function deleteTask(
  supabase: SupabaseClient<Database>,
  user: RouteUserContext,
  id: string,
) {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("organization_id", user.organizationId);

  if (error) throw error;

  logServerEvent({
    userId: user.userId,
    action: "task.delete",
    message: "Tâche supprimée",
    metadata: { taskId: id },
  });
}
