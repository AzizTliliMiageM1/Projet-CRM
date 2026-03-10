"use client";

import { useState } from "react";

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company_id: string | null;
  organization_id: string;
  created_at: string | null;
  updated_at: string | null;
}

interface ContactTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function ContactTable({ contacts, onEdit, onDelete, isLoading }: ContactTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };

  const handleConfirmDelete = async (id: string) => {
    setConfirmed(id);
    try {
      const response = await fetch(`/api/contacts/${id}`, { method: "DELETE" });
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

  if (contacts.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center">
        <p className="text-slate-400">Aucun contact. Créez-en un pour commencer.</p>
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
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest opacity-70">Nom</span>
                </th>
                <th className="px-6 py-5 text-left">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest opacity-70">Email</span>
                </th>
                <th className="px-6 py-5 text-left">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest opacity-70">Téléphone</span>
                </th>
                <th className="px-6 py-5 text-left">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest opacity-70">Date création</span>
                </th>
                <th className="px-6 py-5 text-right">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest opacity-70">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {contacts.map((contact, index) => (
                <tr key={contact.id} className={`group transition-all duration-300 hover:bg-slate-800/30 ${index % 2 === 0 ? "bg-slate-900/5" : "bg-slate-900/20"}`}>
                  <td className="px-6 py-5 text-sm">
                    <p className="font-semibold text-slate-100 group-hover:text-sky-300 transition-colors duration-300">{contact.first_name} {contact.last_name}</p>
                  </td>
                  <td className="px-6 py-5 text-sm text-sky-400 group-hover:text-sky-300 transition-colors duration-300">{contact.email}</td>
                  <td className="px-6 py-5 text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">{contact.phone ?? "—"}</td>
                  <td className="px-6 py-5 text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                    {contact.created_at ? new Date(contact.created_at).toLocaleDateString("fr-FR") : "—"}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(contact)}
                        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
                      >
                        Modifier
                      </button>

                      {deletingId === contact.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleConfirmDelete(contact.id)}
                            disabled={confirmed === contact.id}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {confirmed === contact.id ? "..." : "Confirmer"}
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
                          onClick={() => handleDeleteClick(contact.id)}
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
          <span className="text-sky-400 font-semibold">{contacts.length}</span> contact{contacts.length > 1 ? "s" : ""} au total
        </p>
      </div>
    </>
  );
}
