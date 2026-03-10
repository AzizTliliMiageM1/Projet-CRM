"use client";

import { useEffect, useState, useCallback } from "react";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TaskForm } from "@/components/tasks/TaskForm";

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

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Erreur chargement");
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTask(null);
    fetchTasks();
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Tâches</h1>
        <p className="text-sm text-slate-400">
          Gérez vos tâches et rappels.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {showForm && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 md:col-span-1">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-50">
                {editingTask ? "Modifier" : "Nouvelle tâche"}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            <TaskForm initialData={editingTask ?? undefined} onSuccess={handleFormSuccess} />
          </div>
        )}

        <div className={showForm ? "md:col-span-2" : "md:col-span-3"}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-50">Liste des tâches</h2>
            <button
              onClick={() => {
                setEditingTask(null);
                setShowForm(!showForm);
              }}
              className="rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
            >
              + Ajouter une tâche
            </button>
          </div>
          <TaskTable
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
}
