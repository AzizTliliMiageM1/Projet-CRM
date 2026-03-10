"use client";

import { useEffect, useState } from "react";
import { extractApiData } from "@/lib/utils/api";
import { Avatar } from "@/components/Avatar";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { Plus, Target, Edit2, Trash2, Search, Download } from "lucide-react";
import { exportLeadsCSV } from "@/lib/utils/csv-export";
import toast from "react-hot-toast";

interface Lead {
  id: string;
  title: string;
  email: string | null;
  status: string | null;
  organization_id: string;
  created_at: string | null;
}

interface Company {
  id: string;
  name: string;
}

interface LeadFormData {
  title: string;
  email: string;
  status: string;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: "bg-slate-900/20", text: "text-slate-400", label: "Nouveau" },
  in_progress: { bg: "bg-blue-900/20", text: "text-blue-400", label: "En cours" },
  won: { bg: "bg-green-900/20", text: "text-green-400", label: "Gagné" },
  lost: { bg: "bg-red-900/20", text: "text-red-400", label: "Perdu" },
};

export function LeadsView() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filtres avancés
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [companyFilter, setCompanyFilter] = useState<string[]>([]);

  const [formData, setFormData] = useState<LeadFormData>({
    title: "",
    email: "",
    status: "new",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch leads
        const leadsRes = await fetch("/api/leads");
        if (leadsRes.ok) {
          const leadsResult = await leadsRes.json();
          const leadsData = extractApiData<Lead[]>(leadsResult);
          setLeads(Array.isArray(leadsData) ? leadsData : []);
        }
        
        // Fetch companies
        const companiesRes = await fetch("/api/companies");
        if (companiesRes.ok) {
          const companiesResult = await companiesRes.json();
          const companiesData = extractApiData<Company[]>(companiesResult);
          setCompanies(Array.isArray(companiesData) ? companiesData : []);
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
      const url = editingLead ? `/api/leads/${editingLead.id}` : "/api/leads";
      const method = editingLead ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");

      setFormData({ title: "", email: "", status: "new" });
      setShowForm(false);
      setEditingLead(null);

      const res = await fetch("/api/leads");
      if (res.ok) {
        const result = await res.json();
        const data = extractApiData<Lead[]>(result);
        setLeads(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError("Erreur lors de l'enregistrement du lead");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr?")) return;
    try {
      const response = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erreur suppression");
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      setError("Impossible de supprimer le lead");
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      title: lead.title,
      email: lead.email || "",
      status: lead.status || "new",
    });
    setShowForm(true);
  };

  const filteredLeads = leads.filter((l) => {
    // Filtrer par recherche
    const matchesSearch =
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.email && l.email.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filtrer par statut
    const matchesStatus =
      statusFilter.length === 0 || (l.status && statusFilter.includes(l.status));

    // Filtrer par entreprise
    const matchesCompany =
      companyFilter.length === 0 || companyFilter.includes(l.organization_id);

    return matchesSearch && matchesStatus && matchesCompany;
  });

  const handleClearFilters = () => {
    setStatusFilter([]);
    setCompanyFilter([]);
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3">
            <Target className="w-8 h-8 text-purple-400" />
            Leads
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Gérez vos prospects et leur progression.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                await exportLeadsCSV();
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
              setEditingLead(null);
              setFormData({ title: "", email: "", status: "new" });
              setShowForm(!showForm);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-500 hover:to-purple-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-purple-500/30 transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Ajouter un lead
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
          <p className="text-slate-400">Chargement des leads...</p>
        </div>
      ) : (
        <>
          {/* Formulaire */}
          {showForm && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-slate-50 mb-4">
                {editingLead ? "✏️ Modifier le lead" : "➕ Nouveau lead"}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Titre du lead"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="md:col-span-2 rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="new">Nouveau</option>
                  <option value="in_progress">En cours</option>
                  <option value="won">Gagné</option>
                  <option value="lost">Perdu</option>
                </select>
                <div className="md:col-span-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="flex-1 rounded-lg bg-purple-600 hover:bg-purple-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {editingLead ? "Mettre à jour" : "Créer"}
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

          {/* Filtres avancés */}
          <FilterPanel
            filters={[
              {
                id: "status",
                label: "Statut",
                options: [
                  { value: "new", label: "Nouveau" },
                  { value: "in_progress", label: "En cours" },
                  { value: "won", label: "Gagné" },
                  { value: "lost", label: "Perdu" },
                ],
                value: statusFilter,
                onChange: setStatusFilter,
              },
              {
                id: "company",
                label: "Entreprise",
                options: companies.map((c) => ({ value: c.id, label: c.name })),
                value: companyFilter,
                onChange: setCompanyFilter,
              },
            ]}
            onClear={handleClearFilters}
          />

          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 w-4 h-4 text-slate-500 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/40 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          {/* Table */}
          {filteredLeads.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-12 text-center shadow-lg">
              <Target className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" />
              <p className="text-slate-300 font-medium">Aucun lead</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg">
              <table className="w-full min-w-max">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 whitespace-nowrap">Nom</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 whitespace-nowrap">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 whitespace-nowrap">Statut</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredLeads.map((lead, i) => {
                    const colors = STATUS_COLORS[lead.status || "new"] || STATUS_COLORS.new;
                    return (
                      <tr key={lead.id} className={`hover:bg-slate-800/80 transition-colors ${i % 2 === 0 ? "bg-slate-900/20" : "bg-slate-900/40"}`}>
                        <td className="px-6 py-4 text-sm text-slate-50 flex items-center gap-3">
                          <Avatar name={lead.title} size="sm" />
                          {lead.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">{lead.email || "—"}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-block rounded px-3 py-1 text-xs font-medium border ${colors.bg} ${colors.text}`}>
                            {colors.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(lead)}
                              className="rounded-lg bg-purple-600 hover:bg-purple-500 px-3 py-2 text-xs font-semibold text-white transition-all"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(lead.id)}
                              className="rounded-lg bg-red-600/20 hover:bg-red-600/30 px-3 py-2 text-xs font-semibold text-red-400 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
