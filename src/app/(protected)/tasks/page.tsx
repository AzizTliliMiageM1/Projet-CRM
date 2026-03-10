"use client";

import { useEffect, useState, useCallback } from "react";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Container, PageHeader } from "@/components/Layout";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { CheckSquare, Plus, X } from "lucide-react";

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

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <Container>
      <PageHeader
        icon={<CheckSquare className="w-8 h-8" />}
        title="Tâches & Actions"
        description={`Gérez vos tâches. ${completedCount} complétée${completedCount !== 1 ? "s" : ""}`}
        action={
          <Button
            variant="primary"
            onClick={() => {
              setEditingTask(null);
              setShowForm(!showForm);
            }}
            icon={showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          >
            {showForm ? "Fermer" : "Nouvelle tâche"}
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3 animate-fade-in">
        {showForm && (
          <Card className="lg:col-span-1 animate-fade-in-up" variant="elevated">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/30">
                <h3 className="text-lg font-semibold text-slate-50">
                  {editingTask ? "Modifier la tâche" : "Nouvelle tâche"}
                </h3>
              </div>
              <TaskForm initialData={editingTask ?? undefined} onSuccess={handleFormSuccess} />
            </div>
          </Card>
        )}

        <div className={`${showForm ? "lg:col-span-2" : "lg:col-span-3"} animate-fade-in-up`} style={{ animationDelay: "0.1s" }}>
          <TaskTable
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={loading}
          />
        </div>
      </div>
    </Container>
  );
}
