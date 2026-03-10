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
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Nom</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Email</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Téléphone</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Date création</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id} className="border-b border-slate-800 hover:bg-slate-800/50">
              <td className="px-6 py-3 text-sm text-slate-100">{contact.first_name} {contact.last_name}</td>
              <td className="px-6 py-3 text-sm text-slate-400">{contact.email}</td>
              <td className="px-6 py-3 text-sm text-slate-400">{contact.phone ?? "—"}</td>
              <td className="px-6 py-3 text-sm text-slate-400">
                {contact.created_at ? new Date(contact.created_at).toLocaleDateString("fr-FR") : "—"}
              </td>
              <td className="px-6 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(contact)}
                    className="rounded-md bg-sky-600 px-3 py-1 text-xs font-semibold text-white hover:bg-sky-500"
                  >
                    Modifier
                  </button>

                  {deletingId === contact.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleConfirmDelete(contact.id)}
                        disabled={confirmed === contact.id}
                        className="rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-60"
                      >
                        {confirmed === contact.id ? "..." : "Oui"}
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
                      onClick={() => handleDeleteClick(contact.id)}
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
