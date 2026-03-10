"use client";

import { useEffect, useState } from "react";
import { extractApiData } from "@/lib/utils/api";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { Plus, CheckSquare, Edit2, Trash2, Search, Calendar, Download } from "lucide-react";
import { exportTasksCSV } from "@/lib/utils/csv-export";
import toast from "react-hot-toast";

interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  due_date: string | null;
  organization_id: string;
  created_at: string | null;
}

interface TaskFormData {
  title: string;
  due_date: string;
  completed: boolean;
}

const getTaskStatus = (task: Task): { label: string; color: string } => {
  if (task.completed) {
    return { label: "Complétée", color: "bg-green-900/20 text-green-400" };
  }
  if (task.due_date && new Date(task.due_date) < new Date()) {
    return { label: "En retard", color: "bg-red-900/20 text-red-400" };
  }
  return { label: "En attente", color: "bg-amber-900/20 text-amber-400" };
};

export function TasksView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filtres avancés
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [dueDateFilter, setDueDateFilter] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    due_date: "",
    completed: false,
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/tasks");
        if (res.ok) {
          const result = await res.json();
          const data = extractApiData<Task[]>(result);
          setTasks(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Erreur chargement:", err);
        setError("Impossible de charger les tâches");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const url = editingTask ? `/api/tasks/${editingTask.id}` : "/api/tasks";
      const method = editingTask ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");

      setFormData({ title: "", due_date: "", completed: false });
      setShowForm(false);
      setEditingTask(null);

      const res = await fetch("/api/tasks");
      if (res.ok) {
        const result = await res.json();
        const data = extractApiData<Task[]>(result);
        setTasks(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError("Erreur lors de l'enregistrement de la tâche");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr?")) return;
    try {
      const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erreur suppression");
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError("Impossible de supprimer la tâche");
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (!response.ok) throw new Error("Erreur");
      
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
      );
    } catch (err) {
      setError("Erreur lors de la mise à jour");
    }
  };

  const getTaskStatusCategory = (task: Task): string => {
    if (task.completed) return "completed";
    if (task.due_date && new Date(task.due_date) < new Date()) return "overdue";
    return "pending";
  };

  const getDueDateCategory = (dueDate: string | null): string => {
    if (!dueDate) return "no_date";
    
    const due = new Date(dueDate);
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    if (due <= weekFromNow) return "this_week";
    if (due <= monthFromNow) return "this_month";
    return "later";
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      due_date: task.due_date ? task.due_date.split("T")[0] : "",
      completed: task.completed,
    });
    setShowForm(true);
  };

  const filteredTasks = tasks.filter((t) => {
    // Filtrer par recherche
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtrer par statut
    const taskStatus = getTaskStatusCategory(t);
    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(taskStatus);

    // Filtrer par date limite
    const dateCategory = getDueDateCategory(t.due_date);
    const matchesDueDate =
      dueDateFilter.length === 0 || dueDateFilter.includes(dateCategory);

    return matchesSearch && matchesStatus && matchesDueDate;
  });

  const handleClearFilters = () => {
    setStatusFilter([]);
    setDueDateFilter([]);
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-green-400" />
            Tâches
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Gérez vos tâches et leur progression.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                await exportTasksCSV();
                toast.success("Fichier exporté");
              } catch (err) {
                toast.error("Erreur exportation");
              }
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-700 hover:bg-slate-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-slate-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            Exporter CSV
          </button>
          <button
            onClick={() => {
              setEditingTask(null);
              setFormData({ title: "", due_date: "", completed: false });
              setShowForm(!showForm);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-600 hover:from-green-500 hover:to-green-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-green-500/30 transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Ajouter une tâche
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-800 bg-red-900/20 p-4 text-red-400">
          <p className="text-sm font-medium">Erreur: {error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 p-12 shadow-lg">
          <p className="text-slate-400">Chargement des tâches...</p>
        </div>
      ) : (
        <>
          {/* Formulaire */}
          {showForm && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-slate-50 mb-4">
                {editingTask ? "✏️ Modifier la tâche" : "➕ Nouvelle tâche"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Titre de la tâche"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                />
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                />
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.completed}
                    onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-slate-300">Marquer comme complétée</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="flex-1 rounded-lg bg-green-600 hover:bg-green-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {editingTask ? "Mettre à jour" : "Créer"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 rounded-lg border border-slate-700 hover:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filtres avancés */}
          <FilterPanel
            filters={[
              {
                id: "status",
                label: "Statut",
                options: [
                  { value: "pending", label: "En attente" },
                  { value: "completed", label: "Complétée" },
                  { value: "overdue", label: "En retard" },
                ],
                value: statusFilter,
                onChange: setStatusFilter,
              },
              {
                id: "duedate",
                label: "Date limite",
                options: [
                  { value: "this_week", label: "Cette semaine" },
                  { value: "this_month", label: "Ce mois" },
                  { value: "later", label: "Plus tard" },
                  { value: "no_date", label: "Sans date" },
                ],
                value: dueDateFilter,
                onChange: setDueDateFilter,
              },
            ]}
            onClear={handleClearFilters}
          />

          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 w-4 h-4 text-slate-500 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une tâche..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/40 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
          </div>

          {/* Liste */}
          {filteredTasks.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-12 text-center shadow-lg">
              <CheckSquare className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" />
              <p className="text-slate-300 font-medium">Aucune tâche</p>
            </div>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {filteredTasks.map((task) => {
                const status = getTaskStatus(task);
                return (
                  <div
                    key={task.id}
                    className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 hover:bg-slate-900/80 transition-colors shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleComplete(task)}
                        className="mt-1 rounded cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-semibold text-sm ${
                            task.completed
                              ? "text-slate-500 line-through"
                              : "text-slate-50"
                          }`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="mt-1 text-xs text-slate-400">
                            {task.description}
                          </p>
                        )}
                        {task.due_date && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                            <Calendar className="w-3 h-3" />
                            {new Date(task.due_date).toLocaleDateString("fr-FR")}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-block rounded px-2.5 py-1 text-xs font-medium border ${status.color}`}>
                          {status.label}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(task)}
                            className="rounded-lg bg-green-600 hover:bg-green-500 px-2 py-1.5 text-xs font-semibold text-white transition-all"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="rounded-lg bg-red-600/20 hover:bg-red-600/30 px-2 py-1.5 text-xs font-semibold text-red-400 transition-all"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
