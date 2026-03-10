"use client";

import { useState } from "react";

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

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const statusBadgeColor: Record<Lead["status"], string> = {
  new: "bg-slate-600 text-slate-100",
  qualified: "bg-blue-600 text-white",
  proposal: "bg-purple-600 text-white",
  negotiation: "bg-orange-600 text-white",
  won: "bg-green-600 text-white",
  lost: "bg-red-600 text-white",
};

export function LeadTable({ leads, onEdit, onDelete, isLoading }: LeadTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };

  const handleConfirmDelete = async (id: string) => {
    setConfirmed(id);
    try {
      const response = await fetch(`/api/leads/${id}`, { method: "DELETE" });
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

  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center">
        <p className="text-slate-400">Aucun lead. Créez-en un pour commencer.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Titre</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Statut</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Valeur</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Date création</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-slate-800 hover:bg-slate-800/50">
              <td className="px-6 py-3 text-sm text-slate-100">{lead.title}</td>
              <td className="px-6 py-3 text-sm">
                <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${statusBadgeColor[lead.status]}`}>
                  {lead.status}
                </span>
              </td>
              <td className="px-6 py-3 text-sm text-slate-400">
                {lead.value ? `${lead.value.toLocaleString("fr-FR")} €` : "—"}
              </td>
              <td className="px-6 py-3 text-sm text-slate-400">
                {lead.created_at ? new Date(lead.created_at).toLocaleDateString("fr-FR") : "—"}
              </td>
              <td className="px-6 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(lead)}
                    className="rounded-md bg-sky-600 px-3 py-1 text-xs font-semibold text-white hover:bg-sky-500"
                  >
                    Modifier
                  </button>

                  {deletingId === lead.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleConfirmDelete(lead.id)}
                        disabled={confirmed === lead.id}
                        className="rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-60"
                      >
                        {confirmed === lead.id ? "..." : "Oui"}
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
                      onClick={() => handleDeleteClick(lead.id)}
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
