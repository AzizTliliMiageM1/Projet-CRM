"use client";

import { useState } from "react";
import { companyCreateSchema, companyUpdateSchema } from "@/lib/validation/schemas";
import { Building2, Globe, CheckCircle, AlertCircle, Loader } from "lucide-react";

interface Company {
  id: string;
  name: string;
  domain: string | null;
  organization_id: string;
  created_at: string | null;
  updated_at: string | null;
}

interface CompanyFormProps {
  onSuccess: () => void;
  initialData?: Company;
}


export function CompanyForm({ onSuccess, initialData }: CompanyFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [domain, setDomain] = useState(initialData?.domain ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const schema = initialData ? companyUpdateSchema : companyCreateSchema;
      const payload = schema.parse({ name, domain: domain || undefined });

      const method = initialData ? "PATCH" : "POST";
      const url = initialData ? `/api/companies/${initialData.id}` : "/api/companies";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = "Erreur serveur";
        try {
          const errorData = await response.json();
          errorMessage = errorData?.error?.message || errorData?.message || errorMessage;
        } catch {
          // Si pas du JSON, on utilise le message par défaut
          errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        }
        setError(errorMessage);
        setLoading(false);
        return;
      }

      setName("");
      setDomain("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      setTimeout(() => onSuccess(), 500);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nom de l'entreprise */}
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-sky-400" />
          Nom de l&apos;entreprise
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
          placeholder="Acme Corp"
        />
      </div>

      {/* Domaine */}
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
          <Globe className="w-4 h-4 text-sky-400" />
          Domaine
        </label>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
          placeholder="example.com"
        />
      </div>

      {/* Messages d'erreur/succès */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-800 bg-red-900/20 p-3">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-lg border border-green-800 bg-green-900/20 p-3">
          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-400">
            {initialData ? "Entreprise mise à jour avec succès" : "Entreprise créée avec succès"}
          </p>
        </div>
      )}

      {/* Bouton */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-sky-500/20 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:from-slate-700 disabled:to-slate-700"
      >
        {loading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            {initialData ? "Mise à jour..." : "Création..."}
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" />
            {initialData ? "Mettre à jour" : "Créer"}
          </>
        )}
      </button>
    </form>
  );
}
