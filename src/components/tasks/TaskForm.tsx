"use client";

import { useState, useCallback } from "react";
import { taskCreateSchema, taskUpdateSchema } from "@/lib/validation/schemas";

interface Task {
  id: string;
  lead_id: string | null;
  title: string;
  description?: string | null;
  due_date: string | null;
  completed: boolean;
  owner_id: string;
  organization_id: string;
  created_at: string | null;
  updated_at: string | null;
}

interface TaskFormProps {
  onSuccess: () => void;
  initialData?: Task;
}

export function TaskForm({ onSuccess, initialData }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [dueDate, setDueDate] = useState(initialData?.due_date?.split("T")[0] ?? "");
  const [completed, setCompleted] = useState(initialData?.completed ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
        const schema = initialData ? taskUpdateSchema : taskCreateSchema;
        const payload = schema.parse({
          title,
          description: description || undefined,
          due_date: dueDate || undefined,
          completed,
        });

        const method = initialData ? "PATCH" : "POST";
        const url = initialData ? `/api/tasks/${initialData.id}` : "/api/tasks";

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
        setDescription("");
        setDueDate("");
        setCompleted(false);
        onSuccess();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur inconnue";
        setError(message);
        setLoading(false);
      }
    },
    [initialData, title, description, dueDate, completed, onSuccess],
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
          placeholder="Call ABC Company"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          placeholder="Notes..."
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200">Date d&apos;échéance</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="completed"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
          className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-sky-600 focus:ring-sky-500"
        />
        <label htmlFor="completed" className="ml-2 text-sm text-slate-200">
          Marquée comme complétée
        </label>
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
