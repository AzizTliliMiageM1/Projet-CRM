"use client";

import { useEffect, useState, useCallback } from "react";
import { ContactTable } from "@/components/contacts/ContactTable";
import { ContactForm } from "@/components/contacts/ContactForm";
import { Container, PageHeader } from "@/components/Layout";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Users, Plus, X } from "lucide-react";

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
    <Container>
      <PageHeader
        icon={<Users className="w-8 h-8" />}
        title="Contacts"
        description="Gérez vos contacts professionnels et leurs informations"
        action={
          <Button
            variant="primary"
            onClick={() => {
              setEditingContact(null);
              setShowForm(!showForm);
            }}
            icon={showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          >
            {showForm ? "Fermer" : "Ajouter un contact"}
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3 animate-fade-in">
        {showForm && (
          <Card className="lg:col-span-1 animate-fade-in-up" variant="elevated">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/30">
                <h3 className="text-lg font-semibold text-slate-50">
                  {editingContact ? "Modifier le contact" : "Nouveau contact"}
                </h3>
              </div>
              <ContactForm initialData={editingContact ?? undefined} onSuccess={handleFormSuccess} />
            </div>
          </Card>
        )}

        <div className={`${showForm ? "lg:col-span-2" : "lg:col-span-3"} animate-fade-in-up`} style={{ animationDelay: "0.1s" }}>
          <ContactTable
            contacts={contacts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={loading}
          />
        </div>
      </div>
    </Container>
  );
}
