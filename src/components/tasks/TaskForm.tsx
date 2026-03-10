"use client";

import { useState, useCallback } from "react";
import { taskCreateSchema, taskUpdateSchema } from "@/lib/validation/schemas";
import { Input, Textarea } from "@/components/FormInputs";
import { Button } from "@/components/Button";
import { CheckCircle2 } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Titre"
        type="text"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Call ABC Company"
      />

      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Notes..."
        rows={3}
      />

      <Input
        label="Date d'échéance"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-700/50 bg-slate-900/30 backdrop-blur-sm hover:bg-slate-900/50 transition-colors cursor-pointer group">
        <input
          type="checkbox"
          id="completed"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
          className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-sky-600 focus:ring-2 focus:ring-sky-500/20 cursor-pointer"
        />
        <label htmlFor="completed" className="text-sm text-slate-200 flex-1 cursor-pointer flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-slate-400 group-hover:text-sky-400 transition-colors" />
          Marquée comme complétée
        </label>
      </div>

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
