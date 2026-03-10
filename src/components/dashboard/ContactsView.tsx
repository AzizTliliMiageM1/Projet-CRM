"use client";

import { useEffect, useState } from "react";
import { extractApiData } from "@/lib/utils/api";
import { Avatar } from "@/components/Avatar";
import { Plus, Users, Edit2, Trash2, Search, Mail, Phone, Download } from "lucide-react";
import { exportContactsCSV } from "@/lib/utils/csv-export";
import toast from "react-hot-toast";

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  company_id: string;
  organization_id: string;
  created_at: string | null;
}

interface ContactFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_id: string;
}

export function ContactsView() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<ContactFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company_id: "",
  });
  const [companies, setCompanies] = useState<any[]>([]);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Charger les contacts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Charger les contacts
        const contactsRes = await fetch("/api/contacts");
        if (contactsRes.ok) {
          const result = await contactsRes.json();
          const data = extractApiData<Contact[]>(result);
          setContacts(Array.isArray(data) ? data : []);
        }

        // Charger les entreprises pour le formulaire
        const companiesRes = await fetch("/api/companies");
        if (companiesRes.ok) {
          const result = await companiesRes.json();
          const data = extractApiData<any[]>(result);
          setCompanies(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Erreur chargement:", err);
        setError("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const url = editingContact ? `/api/contacts/${editingContact.id}` : "/api/contacts";
      const method = editingContact ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erreur lors de l'enregistrement");
      }

      setFormData({ first_name: "", last_name: "", email: "", phone: "", company_id: "" });
      setShowForm(false);
      setEditingContact(null);
      toast.success("Contact créé avec succès!");

      // Recharger les contacts
      const res = await fetch("/api/contacts");
      if (res.ok) {
        const result = await res.json();
        const data = extractApiData<Contact[]>(result);
        setContacts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de l'enregistrement du contact";
      setError(message);
      toast.error(message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr?")) return;
    try {
      const response = await fetch(`/api/contacts/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erreur suppression");
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError("Impossible de supprimer le contact");
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email || "",
      phone: contact.phone || "",
      company_id: contact.company_id,
    });
    setShowForm(true);
  };

  const filteredContacts = contacts.filter((c) =>
    `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            Contacts
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Gérez vos contacts et leurs informations de contact.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                await exportContactsCSV();
                toast.success("Fichier exporté");
              } catch (err) {
                toast.error("Erreur exportation");
              }
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-700 hover:bg-slate-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-slate-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            Exporter CSV
          </button>
          <button
            onClick={() => {
              setEditingContact(null);
              setFormData({ first_name: "", last_name: "", email: "", phone: "", company_id: "" });
              setShowForm(!showForm);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-blue-500/30 transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Ajouter un contact
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-800 bg-red-900/20 p-4 text-red-400">
          <p className="text-sm font-medium">Erreur: {error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 p-12 shadow-lg">
          <p className="text-slate-400">Chargement des contacts...</p>
        </div>
      ) : (
        <>
          {/* Formulaire */}
          {showForm && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-slate-50 mb-4">
                {editingContact ? "✏️ Modifier le contact" : "➕ Nouveau contact"}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Prénom"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                  className="rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <input
                  type="text"
                  placeholder="Nom"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                  className="rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <input
                  type="tel"
                  placeholder="Téléphone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <select
                  value={formData.company_id}
                  onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                  required
                  className="rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Sélectionnez une entreprise</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <div className="md:col-span-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {editingContact ? "Mettre à jour" : "Créer"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 rounded-lg border border-slate-700 hover:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 w-4 h-4 text-slate-500 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/40 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Table */}
          {filteredContacts.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-12 text-center shadow-lg">
              <Users className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" />
              <p className="text-slate-300 font-medium">Aucun contact</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg">
              <table className="w-full min-w-max">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 whitespace-nowrap">Nom</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 whitespace-nowrap">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 whitespace-nowrap">Téléphone</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredContacts.map((contact, i) => (
                    <tr key={contact.id} className={`hover:bg-slate-800/80 transition-colors ${i % 2 === 0 ? "bg-slate-900/20" : "bg-slate-900/40"}`}>
                      <td className="px-6 py-4 text-sm text-slate-50 flex items-center gap-3">
                        <Avatar name={`${contact.first_name} ${contact.last_name}`} size="sm" />
                        {contact.first_name} {contact.last_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400 flex items-center gap-2">
                        {contact.email ? (
                          <>
                            <Mail className="w-4 h-4 text-blue-400" />
                            <a href={`mailto:${contact.email}`} className="text-blue-400 hover:underline">
                              {contact.email}
                            </a>
                          </>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400 flex items-center gap-2">
                        {contact.phone ? (
                          <>
                            <Phone className="w-4 h-4 text-blue-400" />
                            {contact.phone}
                          </>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(contact)}
                            className="rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-2 text-xs font-semibold text-white transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(contact.id)}
                            className="rounded-lg bg-red-600/20 hover:bg-red-600/30 px-3 py-2 text-xs font-semibold text-red-400 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
