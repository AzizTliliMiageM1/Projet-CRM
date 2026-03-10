import { getRouteUserContext } from "@/lib/auth/route-guards";
import { isAdmin } from "@/lib/auth/roles";
import { redirect } from "next/navigation";
import { DiagnosticsClient } from "./DiagnosticsClient";

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
    <div className="space-y-8">
      <section className="rounded-md border border-slate-800 bg-slate-900/60 p-4">
        <h1 className="mb-2 text-lg font-semibold">Diagnostics admin</h1>
        <p className="text-sm text-slate-400">
          Page réservée aux administrateurs pour vérifier rapidement l état du CRM.
        </p>
      </section>

      <section className="rounded-md border border-slate-800 bg-slate-900/60 p-4 text-sm">
        <h2 className="mb-2 font-semibold">Contexte utilisateur courant</h2>
        <dl className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <div>
            <dt className="text-slate-400">User ID</dt>
            <dd className="font-mono text-xs break-all">{user.userId}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Rôle</dt>
            <dd className="capitalize">{user.role}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Organization ID</dt>
            <dd className="font-mono text-xs break-all">{user.organizationId}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-md border border-slate-800 bg-slate-900/60 p-4 text-sm">
        <h2 className="mb-3 font-semibold">Smoke tests API</h2>
        <DiagnosticsClient />
      </section>

      <section className="rounded-md border border-slate-800 bg-slate-900/60 p-4 text-sm">
        <h2 className="mb-3 font-semibold">Derniers email_logs</h2>
        {emailLogs && emailLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className="px-2 py-1">Sent at</th>
                  <th className="px-2 py-1">Lead ID</th>
                  <th className="px-2 py-1">Status</th>
                  <th className="px-2 py-1">Error</th>
                </tr>
              </thead>
              <tbody>
                {emailLogs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-800/60">
                    <td className="px-2 py-1 text-slate-300">
                      {log.sent_at ? new Date(log.sent_at as string).toLocaleString() : ""}
                    </td>
                    <td className="px-2 py-1 font-mono break-all">{log.lead_id ?? "-"}</td>
                    <td className="px-2 py-1">
                      <span
                        className={
                          log.status === "sent"
                            ? "rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-300"
                            : "rounded bg-red-500/20 px-2 py-0.5 text-red-300"
                        }
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-2 py-1 text-slate-300">
                      {log.error_message ?? ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-400">Aucun email logué pour cette organisation.</p>
        )}
      </section>
    </div>
  );
}
