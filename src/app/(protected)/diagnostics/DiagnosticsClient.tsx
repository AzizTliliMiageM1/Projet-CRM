"use client";

import { useState } from "react";

interface PingResult {
  endpoint: string;
  ok: boolean;
  status: number;
  durationMs: number;
  error?: string;
}

export function DiagnosticsClient() {
  const [results, setResults] = useState<PingResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  async function ping(endpoint: string) {
    setIsRunning(true);
    const start = performance.now();

    try {
      const res = await fetch(endpoint, { method: "GET" });
      const durationMs = Math.round(performance.now() - start);

      setResults((prev) => [
        {
          endpoint,
          ok: res.ok,
          status: res.status,
          durationMs,
        },
        ...prev,
      ]);
    } catch (error) {
      const durationMs = Math.round(performance.now() - start);
      setResults((prev) => [
        {
          endpoint,
          ok: false,
          status: 0,
          durationMs,
          error: error instanceof Error ? error.message : String(error),
        },
        ...prev,
      ]);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-x-2">
        <button
          type="button"
          className="rounded-md bg-slate-800 px-3 py-1 text-sm font-medium hover:bg-slate-700 disabled:opacity-50"
          disabled={isRunning}
          onClick={() => ping("/api/companies")}
        >
          Ping API Companies
        </button>
        <button
          type="button"
          className="rounded-md bg-slate-800 px-3 py-1 text-sm font-medium hover:bg-slate-700 disabled:opacity-50"
          disabled={isRunning}
          onClick={() => ping("/api/leads")}
        >
          Ping API Leads
        </button>
        <button
          type="button"
          className="rounded-md bg-slate-800 px-3 py-1 text-sm font-medium hover:bg-slate-700 disabled:opacity-50"
          disabled={isRunning}
          onClick={() => ping("/api/tasks")}
        >
          Ping API Tasks
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-4 rounded-md border border-slate-800 bg-slate-900/60 p-3 text-xs">
          <h3 className="mb-2 font-semibold">Résultats des derniers pings</h3>
          <ul className="space-y-1">
            {results.map((r, index) => (
              <li key={`${r.endpoint}-${index}`}>
                <span className="font-mono">{r.endpoint}</span>
                {" "}-
                <span className={r.ok ? "text-emerald-400" : "text-red-400"}>
                  {r.ok ? "OK" : "ERREUR"}
                </span>
                {" "}({r.status || "n/a"}) en {r.durationMs} ms
                {r.error ? <span className="ml-2 text-red-400">{r.error}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
