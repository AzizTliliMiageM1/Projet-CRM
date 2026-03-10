"use client";

import { useState, useCallback } from "react";
import { leadCreateSchema, leadUpdateSchema } from "@/lib/validation/schemas";

interface Lead {
  id: string;
  title: string;
  status: "new" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
  value: number | null;
  company_id: string | null;
  contact_id: string | null;
  owner_id: string;
  organization_id: string;
  created_at: string | null;
  updated_at: string | null;
}

interface LeadFormProps {
  onSuccess: () => void;
  initialData?: Lead;
}

const statusOptions: Array<Lead["status"]> = ["new", "qualified", "proposal", "negotiation", "won", "lost"];

export function LeadForm({ onSuccess, initialData }: LeadFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [status, setStatus] = useState<Lead["status"]>(initialData?.status ?? "new");
  const [value, setValue] = useState(initialData?.value?.toString() ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
        const schema = initialData ? leadUpdateSchema : leadCreateSchema;
        const payload = schema.parse({
          title,
          status,
          value: value ? parseFloat(value) : undefined,
        });

        const method = initialData ? "PATCH" : "POST";
        const url = initialData ? `/api/leads/${initialData.id}` : "/api/leads";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data?.message || "Erreur serveur");
          setLoading(false);
          return;
        }

        setTitle("");
        setStatus("new");
        setValue("");
        onSuccess();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur inconnue";
        setError(message);
        setLoading(false);
      }
    },
    [initialData, title, status, value, onSuccess],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-200">Titre</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          placeholder="Contrat ABC Company"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200">Statut</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Lead["status"])}
          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s} className="bg-slate-950">
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200">Valeur (€)</label>
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          placeholder="5000"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (initialData ? "Mise à jour..." : "Création...") : initialData ? "Mettre à jour" : "Créer"}
      </button>
    </form>
  );
}
