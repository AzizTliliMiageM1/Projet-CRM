"use client";

import { useEffect, useState, useCallback } from "react";
import { ContactTable } from "@/components/contacts/ContactTable";
import { ContactForm } from "@/components/contacts/ContactForm";

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

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/contacts");
      if (!response.ok) throw new Error("Erreur chargement");
      const data: Contact[] = await response.json();
      setContacts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingContact(null);
    fetchContacts();
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingContact(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Contacts</h1>
        <p className="text-sm text-slate-400">
          Gérez vos contacts et leurs informations.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {showForm && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 md:col-span-1">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-50">
                {editingContact ? "Modifier" : "Nouveau contact"}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            <ContactForm initialData={editingContact ?? undefined} onSuccess={handleFormSuccess} />
          </div>
        )}

        <div className={showForm ? "md:col-span-2" : "md:col-span-3"}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-50">Liste des contacts</h2>
            <button
              onClick={() => {
                setEditingContact(null);
                setShowForm(!showForm);
              }}
              className="rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
            >
              + Ajouter un contact
            </button>
          </div>
          <ContactTable
            contacts={contacts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
}
