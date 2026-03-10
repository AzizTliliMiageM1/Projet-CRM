import { getRouteUserContext } from "@/lib/auth/route-guards";
import { isAdmin } from "@/lib/auth/roles";
import { redirect } from "next/navigation";
import { Container, PageHeader } from "@/components/Layout";
import { Card } from "@/components/Card";
import { DiagnosticsClient } from "./DiagnosticsClient";
import { Activity } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DiagnosticsPage() {
  const { supabase, user } = await getRouteUserContext();

  if (!isAdmin(user.role)) {
    redirect("/dashboard");
  }

  const { data: emailLogs } = await supabase
    .from("email_logs")
    .select("id, lead_id, status, error_message, sent_at")
    .eq("organization_id", user.organizationId)
    .order("sent_at", { ascending: false })
    .limit(10);

  return (
    <Container>
      <PageHeader
        icon={<Activity className="w-8 h-8" />}
        title="Diagnostics admin"
        description="Page réservée aux administrateurs pour vérifier rapidement l'état du CRM et les logs système."
      />

      <div className="space-y-6 animate-fade-in">
        {/* User Context Card */}
        <Card variant="elevated" className="animate-fade-in-up">
          <h2 className="mb-4 font-semibold text-lg flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-sky-400"></div>
            Contexte utilisateur courant
          </h2>
          <dl className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
              <dt className="text-sm text-slate-400 mb-1">User ID</dt>
              <dd className="font-mono text-xs break-all text-sky-300">{user.userId}</dd>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
              <dt className="text-sm text-slate-400 mb-1">Rôle</dt>
              <dd className="capitalize text-sky-300 font-medium">{user.role}</dd>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
              <dt className="text-sm text-slate-400 mb-1">Organization ID</dt>
              <dd className="font-mono text-xs break-all text-sky-300">{user.organizationId}</dd>
            </div>
          </dl>
        </Card>

        {/* Smoke Tests Card */}
        <Card variant="elevated" className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="mb-4 font-semibold text-lg flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-green-400"></div>
            Smoke tests API
          </h2>
          <DiagnosticsClient />
        </Card>

        {/* Email Logs Card */}
        <Card variant="elevated" className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="mb-4 font-semibold text-lg flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-purple-400"></div>
            Derniers email_logs ({emailLogs?.length ?? 0})
          </h2>
          {emailLogs && emailLogs.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-slate-700/50">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-800/50 border-b border-slate-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-200">Sent at</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-200">Lead ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-200">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-200">Error</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {emailLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 text-slate-300">
                        {log.sent_at ? new Date(log.sent_at as string).toLocaleString() : ""}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs break-all text-sky-300">{log.lead_id ?? "-"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            log.status === "sent"
                              ? "inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300 border border-emerald-500/30"
                              : "inline-flex items-center gap-1 rounded-full bg-red-500/20 px-3 py-1 text-xs font-medium text-red-300 border border-red-500/30"
                          }
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${log.status === "sent" ? "bg-emerald-400" : "bg-red-400"}`}></div>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{log.error_message ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-lg bg-slate-800/40 border border-slate-700/50 p-6 text-center">
              <p className="text-slate-400">Aucun email logué pour cette organisation.</p>
            </div>
          )}
        </Card>
      </div>
    </Container>
  );
}
