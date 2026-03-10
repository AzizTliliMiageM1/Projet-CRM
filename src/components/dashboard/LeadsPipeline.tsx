"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { extractApiData } from "@/lib/utils/api";
import { Plus, GripVertical, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Lead {
  id: string;
  name: string;
  email: string;
  status: "new" | "in_progress" | "won" | "lost";
  organization_id: string;
}

const STATUS_CONFIG = {
  new: { label: "Nouveau", color: "bg-slate-900/40 border-slate-700", badge: "bg-slate-600" },
  in_progress: { label: "En cours", color: "bg-blue-900/20 border-blue-700", badge: "bg-blue-600" },
  won: { label: "Gagné", color: "bg-green-900/20 border-green-700", badge: "bg-green-600" },
  lost: { label: "Perdu", color: "bg-red-900/20 border-red-700", badge: "bg-red-600" },
};

function LeadCard({ lead, onDelete }: { lead: Lead; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border p-4 bg-slate-900/60 border-slate-700 hover:border-slate-600 transition-all cursor-grab active:cursor-grabbing ${
        isDragging ? "shadow-lg shadow-slate-900/50" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div {...attributes} {...listeners} className="text-slate-400 hover:text-slate-200 mt-1">
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-50 truncate">{lead.name}</h4>
          <p className="text-xs text-slate-400 truncate mt-1">{lead.email}</p>
        </div>
        <button
          onClick={() => onDelete(lead.id)}
          className="text-slate-400 hover:text-red-400 transition-colors flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function LeadColumn({
  status,
  leads,
  onDelete,
}: {
  status: keyof typeof STATUS_CONFIG;
  leads: Lead[];
  onDelete: (id: string) => void;
}) {
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex-1 min-w-80 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${config.badge}`} />
        <h3 className="font-semibold text-slate-50">{config.label}</h3>
        <span className="ml-auto text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
          {leads.length}
        </span>
      </div>

      <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 min-h-96">
          {leads.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">Aucun lead</div>
          ) : (
            leads.map((lead) => <LeadCard key={lead.id} lead={lead} onDelete={onDelete} />)
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export function LeadsPipeline() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch("/api/leads");
        if (res.ok) {
          const result = await res.json();
          const data = extractApiData<Lead[]>(result);
          setLeads(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Erreur chargement leads:", err);
        toast.error("Impossible de charger les leads");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const lead = leads.find((l) => l.id === active.id);
      if (lead) {
        // Déterminer le nouveau statut basé sur la colonne
        let newStatus = lead.status;
        const overLead = leads.find((l) => l.id === over.id);
        if (overLead) {
          newStatus = overLead.status;
        }

        // Mettre à jour le lead
        try {
          const response = await fetch(`/api/leads/${lead.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...lead, status: newStatus }),
          });

          if (response.ok) {
            setLeads((prev) =>
              prev.map((l) => (l.id === lead.id ? { ...l, status: newStatus } : l))
            );
            toast.success(`Lead déplacé vers ${STATUS_CONFIG[newStatus].label}`);
          }
        } catch (err) {
          toast.error("Erreur lors du déplacement");
        }
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr?")) return;

    try {
      const response = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (response.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        toast.success("Lead supprimé");
      }
    } catch (err) {
      toast.error("Erreur suppression");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-slate-400">Chargement du pipeline...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-50">Pipeline de Ventes</h1>
        <p className="text-sm text-slate-400 mt-2">
          Glissez-déposez les leads pour changer leur statut
        </p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {(["new", "in_progress", "won", "lost"] as const).map((status) => (
            <LeadColumn
              key={status}
              status={status}
              leads={leads.filter((l) => l.status === status)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
