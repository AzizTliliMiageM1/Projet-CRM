"use client";

import { useState } from "react";

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

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function TaskTable({ tasks, onEdit, onDelete, isLoading }: TaskTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };

  const handleConfirmDelete = async (id: string) => {
    setConfirmed(id);
    try {
      const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erreur suppression");
      onDelete(id);
    } finally {
      setDeletingId(null);
      setConfirmed(null);
    }
  };

  const handleCancel = () => {
    setDeletingId(null);
    setConfirmed(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center rounded-xl border border-slate-800 bg-slate-900/60 p-8">
        <p className="text-slate-400">Chargement...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center">
        <p className="text-slate-400">Aucune tâche. Créez-en une pour commencer.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Statut</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Titre</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Échéance</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Description</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              className={`border-b border-slate-800 hover:bg-slate-800/50 ${task.completed ? "opacity-60" : ""}`}
            >
              <td className="px-6 py-3 text-sm text-slate-100">
                {task.completed ? (
                  <span className="inline-block rounded px-2 py-1 text-xs font-semibold bg-green-600 text-white">
                    ✓ Complétée
                  </span>
                ) : (
                  <span className="inline-block rounded px-2 py-1 text-xs font-semibold bg-orange-600 text-white">
                    En cours
                  </span>
                )}
              </td>
              <td className="px-6 py-3 text-sm text-slate-100">{task.title}</td>
              <td className="px-6 py-3 text-sm text-slate-400">
                {task.due_date ? new Date(task.due_date).toLocaleDateString("fr-FR") : "—"}
              </td>
              <td className="px-6 py-3 text-sm text-slate-400">{task.description || "—"}</td>
              <td className="px-6 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(task)}
                    className="rounded-md bg-sky-600 px-3 py-1 text-xs font-semibold text-white hover:bg-sky-500"
                  >
                    Modifier
                  </button>

                  {deletingId === task.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleConfirmDelete(task.id)}
                        disabled={confirmed === task.id}
                        className="rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-60"
                      >
                        {confirmed === task.id ? "..." : "Oui"}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="rounded-md border border-slate-600 px-2 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-800"
                      >
                        Non
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDeleteClick(task.id)}
                      className="rounded-md bg-red-600/20 px-3 py-1 text-xs font-semibold text-red-400 hover:bg-red-600/30"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
