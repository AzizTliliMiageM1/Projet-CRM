"use client";

import { useState, useCallback } from "react";
import { leadCreateSchema, leadUpdateSchema } from "@/lib/validation/schemas";
import { Input, Select } from "@/components/FormInputs";
import { Button } from "@/components/Button";

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
const statusLabels: Record<Lead["status"], string> = {
  new: "Nouveau",
  qualified: "Qualifié",
  proposal: "Proposition",
  negotiation: "Négociation",
  won: "Remporté",
  lost: "Perdu",
};

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
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Titre"
        type="text"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Contrat ABC Company"
        error={error ? "Erreur" : undefined}
      />

      <Select
        label="Statut"
        value={status}
        onChange={(e) => setStatus(e.target.value as Lead["status"])}
        options={statusOptions.map((s) => ({ label: statusLabels[s], value: s }))}
      />

      <Input
        label="Valeur (€)"
        type="number"
        min="0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="5000"
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

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
