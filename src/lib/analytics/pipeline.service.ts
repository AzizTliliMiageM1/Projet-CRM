import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { LeadStatus } from "@/lib/types/crm";

export interface LeadAggRow {
  created_at: string | null;
  status: LeadStatus | null;
  value: number | null;
}

export interface TaskAggRow {
  due_date: string | null;
  completed: boolean | null;
}

export interface PipelineMetrics {
  revenueThisMonth: number;
  activeLeads: number;
  conversionRate: number; // 0-100
  urgentTasks: number;
}

export async function getPipelineMetrics(
  supabase: SupabaseClient<Database>,
): Promise<PipelineMetrics> {
  const [leadsRes, tasksRes] = await Promise.all([
    supabase.from("leads").select("created_at, status, value"),
    supabase.from("tasks").select("due_date, completed"),
  ]);

  if (leadsRes.error) throw leadsRes.error;
  if (tasksRes.error) throw tasksRes.error;

  const leads = (leadsRes.data as LeadAggRow[] | null) ?? [];
  const tasks = (tasksRes.data as TaskAggRow[] | null) ?? [];

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const leadsThisMonth = leads.filter((l) => {
    if (!l.created_at) return false;
    const created = new Date(l.created_at);
    return created.getMonth() === currentMonth && created.getFullYear() === currentYear;
  });

  const revenueThisMonth = leadsThisMonth
    .filter((l) => l.status === "won")
    .reduce((sum, l) => sum + (l.value ?? 0), 0);

  const activeLeads = leads.filter((l) =>
    ["new", "qualified", "proposal", "negotiation"].includes(l.status ?? ""),
  ).length;

  const totalWon = leads.filter((l) => l.status === "won").length;
  const totalLost = leads.filter((l) => l.status === "lost").length;
  const conversionRate = totalWon + totalLost === 0
    ? 0
    : Math.round((totalWon / (totalWon + totalLost)) * 100);

  const urgentTasks = tasks.filter((t) => {
    if (t.completed || !t.due_date) return false;
    const due = new Date(t.due_date);
    const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 2;
  }).length;

  return {
    revenueThisMonth,
    activeLeads,
    conversionRate,
    urgentTasks,
  };
}
