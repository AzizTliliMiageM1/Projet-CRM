"use client";

import { useState } from "react";
import { companyCreateSchema, companyUpdateSchema } from "@/lib/validation/schemas";
import { Building2, Globe } from "lucide-react";
import { Input } from "@/components/FormInputs";
import { Button } from "@/components/Button";

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Nom de l'entreprise"
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Acme Corp"
        icon={<Building2 className="w-5 h-5" />}
        error={error ? "Erreur" : undefined}
      />

      <Input
        label="Domaine"
        type="text"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        placeholder="example.com"
        icon={<Globe className="w-5 h-5" />}
      />

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <Button
        type="submit"
        variant="primary"
        isLoading={loading}
        fullWidth
      >
        {initialData ? "Mettre à jour" : "Créer"}
      </Button>
    </form>
  );
}
