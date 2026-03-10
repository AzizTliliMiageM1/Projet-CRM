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
      <div className="overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 via-slate-900/30 to-slate-950 backdrop-blur-sm shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="relative border-b border-slate-800/50 bg-gradient-to-r from-slate-800/40 to-slate-900/20">
                <th className="px-6 py-5 text-left">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest opacity-70">
                    Entreprise
                  </span>
                </th>
                <th className="px-6 py-5 text-left">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest opacity-70">
                    Domaine
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
              {safeCompanies.map((company, index) => (
                <tr
                  key={company?.id || index}
                  className={`group transition-all duration-300 hover:bg-slate-800/30 ${
                    index % 2 === 0 ? "bg-slate-900/5" : "bg-slate-900/20"
                  }`}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500/80 to-blue-600/80 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/40 transition-all duration-300">
                        <div className="absolute inset-0 rounded-xl bg-sky-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative text-xs font-bold text-white">
                          {(company?.name || "?").charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-100 group-hover:text-sky-300 transition-colors duration-300 truncate">
                          {company?.name || "Sans nom"}
                        </p>
                        <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors duration-300 truncate">
                          {(company?.organization_id || "").slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {company?.domain ? (
                      <a
                        href={`https://${company.domain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300 transition-all duration-300 group/link px-2 py-1 rounded-lg hover:bg-sky-500/10"
                      >
                        <span className="truncate">{company.domain}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-60 group-hover/link:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <span className="text-sm text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                    {company?.created_at
                      ? new Date(company.created_at).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(company)}
                        className="relative inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
                        title="Modifier l'entreprise"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Modifier</span>
                      </button>

                      {deletingId === company?.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleConfirmDelete(company.id)}
                            disabled={confirmed === company?.id}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {confirmed === company?.id ? "Suppression..." : "Confirmer"}
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
                          onClick={() => handleDeleteClick(company?.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 border border-red-500/20 hover:border-red-500/40 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10"
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
      </div>

      {/* Footer avec compteur - modernisé */}
      <div className="relative mt-4 rounded-xl border border-slate-800/30 bg-gradient-to-r from-slate-900/40 to-slate-950/40 backdrop-blur-sm px-6 py-4">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
        <p className="relative text-xs font-medium text-slate-400">
          <span className="text-sky-400 font-semibold">{safeCompanies.length}</span> entreprise{safeCompanies.length > 1 ? "s" : ""} au total
        </p>
      </div>
    </>
  );
}
