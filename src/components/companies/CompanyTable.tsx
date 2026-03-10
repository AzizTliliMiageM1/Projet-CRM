"use client";

import { useState } from "react";
import { Edit2, Trash2, ExternalLink, AlertCircle } from "lucide-react";

interface Company {
  id: string;
  name: string;
  domain: string | null;
  organization_id: string;
  created_at: string | null;
  updated_at: string | null;
}

interface CompanyTableProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function CompanyTable({ companies, onEdit, onDelete, isLoading }: CompanyTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<string | null>(null);

  console.log("CompanyTable received companies:", companies);

  // Sécurité: assurer que companies est un array
  const safeCompanies = Array.isArray(companies) ? companies : [];

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };

  const handleConfirmDelete = async (id: string) => {
    setConfirmed(id);
    try {
      const response = await fetch(`/api/companies/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Erreur suppression");
      }
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
      <div className="flex justify-center rounded-xl border border-slate-800 bg-slate-900/60 p-12 shadow-lg">
        <p className="text-slate-400">Chargement des entreprises...</p>
      </div>
    );
  }

  if (!Array.isArray(safeCompanies) || safeCompanies.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-12 text-center shadow-lg">
        <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" />
        <p className="text-slate-300 font-medium">Aucune entreprise</p>
        <p className="text-sm text-slate-400 mt-1">Créez votre première entreprise pour commencer</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg transition-all">
        <table className="w-full min-w-max">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider whitespace-nowrap">
                Entreprise
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Domaine
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Date création
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {safeCompanies.map((company, index) => (
              <tr
                key={company?.id || index}
                className={`transition-colors duration-200 hover:bg-slate-800/80 ${
                  index % 2 === 0 ? "bg-slate-900/20" : "bg-slate-900/40"
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {(company?.name || "?").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-50">{company?.name || "Sans nom"}</p>
                      <p className="text-xs text-slate-500">{(company?.organization_id || "").slice(0, 8)}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {company?.domain ? (
                    <a
                      href={`https://${company.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      <span className="truncate">{company.domain}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  ) : (
                    <span className="text-sm text-slate-500">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {company?.created_at
                    ? new Date(company.created_at).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(company)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 px-3 py-2 text-xs font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-sky-500/20"
                      title="Modifier l'entreprise"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Modifier</span>
                    </button>

                    {deletingId === company?.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleConfirmDelete(company.id)}
                          disabled={confirmed === company?.id}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-600 hover:bg-red-500 px-3 py-2 text-xs font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {confirmed === company?.id ? "Suppression..." : "Confirmer"}
                        </button>
                        <button
                          onClick={handleCancel}
                          className="rounded-lg border border-slate-600 hover:border-slate-500 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-all"
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDeleteClick(company?.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 px-3 py-2 text-xs font-semibold text-red-400 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/10"
                        title="Supprimer l'entreprise"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Supprimer</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer avec compteur */}
      <div className="border-t border-slate-800 bg-slate-800/30 px-6 py-3">
        <p className="text-xs text-slate-400">
          {safeCompanies.length} entreprise{safeCompanies.length > 1 ? "s" : ""} au total
        </p>
      </div>
    </>
  );
}
