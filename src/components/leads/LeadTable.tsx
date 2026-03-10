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
  new: "bg-slate-600/30 border border-slate-500/50 text-slate-200",
  qualified: "bg-blue-600/30 border border-blue-500/50 text-blue-200",
  proposal: "bg-purple-600/30 border border-purple-500/50 text-purple-200",
  negotiation: "bg-orange-600/30 border border-orange-500/50 text-orange-200",
  won: "bg-green-600/30 border border-green-500/50 text-green-200",
  lost: "bg-red-600/30 border border-red-500/50 text-red-200",
};

const statusGlow: Record<Lead["status"], string> = {
  new: "group-hover:shadow-slate-500/20",
  qualified: "group-hover:shadow-blue-500/20",
  proposal: "group-hover:shadow-purple-500/20",
  negotiation: "group-hover:shadow-orange-500/20",
  won: "group-hover:shadow-green-500/20",
  lost: "group-hover:shadow-red-500/20",
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
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 via-slate-900/30 to-slate-950 backdrop-blur-sm shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="relative border-b border-slate-800/50 bg-gradient-to-r from-slate-800/40 to-slate-900/20">
                <th className="px-6 py-5 text-left">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest opacity-70">
                    Titre
                  </span>
                </th>
                <th className="px-6 py-5 text-left">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest opacity-70">
                    Statut
                  </span>
                </th>
                <th className="px-6 py-5 text-left">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest opacity-70">
                    Valeur
                  </span>
                </th>
                <th className="px-6 py-5 text-left">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest opacity-70">
                    Date création
                  </span>
                </th>
                <th className="px-6 py-5 text-right">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest opacity-70">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {leads.map((lead, index) => (
                <tr
                  key={lead.id}
                  className={`group transition-all duration-300 hover:bg-slate-800/30 ${
                    index % 2 === 0 ? "bg-slate-900/5" : "bg-slate-900/20"
                  }`}
                >
                  <td className="px-6 py-5 text-sm max-w-xs">
                    <p className="font-semibold text-slate-100 group-hover:text-sky-300 transition-colors duration-300 truncate">
                      {lead.title}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-sm">
                    <span
                      className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${statusBadgeColor[lead.status]} ${statusGlow[lead.status]}`}
                    >
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm">
                    {lead.value ? (
                      <span className="font-semibold text-green-400 group-hover:text-green-300 transition-colors duration-300">
                        {lead.value.toLocaleString("fr-FR")} €
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                    {lead.created_at ? new Date(lead.created_at).toLocaleDateString("fr-FR") : "—"}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(lead)}
                        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
                      >
                        Modifier
                      </button>

                      {deletingId === lead.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleConfirmDelete(lead.id)}
                            disabled={confirmed === lead.id}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {confirmed === lead.id ? "..." : "Confirmer"}
                          </button>
                          <button
                            onClick={handleCancel}
                            className="rounded-lg border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/50 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-slate-100 transition-all duration-300"
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDeleteClick(lead.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 border border-red-500/20 hover:border-red-500/40 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10"
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
      </div>

      {/* Footer */}
      <div className="relative mt-4 rounded-xl border border-slate-800/30 bg-gradient-to-r from-slate-900/40 to-slate-950/40 backdrop-blur-sm px-6 py-4">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
        <p className="relative text-xs font-medium text-slate-400">
          <span className="text-sky-400 font-semibold">{leads.length}</span> lead{leads.length > 1 ? "s" : ""} au total
        </p>
      </div>
    </>
  );
}
