"use client";

import { useState, useCallback } from "react";
import { contactCreateSchema, contactUpdateSchema } from "@/lib/validation/schemas";
import { Input } from "@/components/FormInputs";
import { Button } from "@/components/Button";

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company_id: string | null;
  organization_id: string;
  created_at: string | null;
  updated_at: string | null;
}

interface ContactFormProps {
  onSuccess: () => void;
  initialData?: Contact;
}

export function ContactForm({ onSuccess, initialData }: ContactFormProps) {
  const [firstName, setFirstName] = useState(initialData?.first_name ?? "");
  const [lastName, setLastName] = useState(initialData?.last_name ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
        const schema = initialData ? contactUpdateSchema : contactCreateSchema;
        const payload = schema.parse({
          first_name: firstName,
          last_name: lastName,
          email,
          phone: phone || undefined,
        });

        const method = initialData ? "PATCH" : "POST";
        const url = initialData ? `/api/contacts/${initialData.id}` : "/api/contacts";

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

        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        onSuccess();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur inconnue";
        setError(message);
        setLoading(false);
      }
    },
    [initialData, firstName, lastName, email, phone, onSuccess],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Prénom"
          type="text"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Jean"
        />
        <Input
          label="Nom"
          type="text"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Dupont"
        />
      </div>

      <Input
        label="Email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="jean@example.com"
      />

      <Input
        label="Téléphone"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+33612345678"
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
