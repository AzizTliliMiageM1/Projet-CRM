"use client";

import { useEffect, useState, useCallback } from "react";
import { LeadTable } from "@/components/leads/LeadTable";
import { LeadForm } from "@/components/leads/LeadForm";

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

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/leads");
      if (!response.ok) throw new Error("Erreur chargement");
      const data: Lead[] = await response.json();
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingLead(null);
    fetchLeads();
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingLead(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Leads</h1>
        <p className="text-sm text-slate-400">
          Gérez vos opportunités commerciales.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {showForm && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 md:col-span-1">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-50">
                {editingLead ? "Modifier" : "Nouveau lead"}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            <LeadForm initialData={editingLead ?? undefined} onSuccess={handleFormSuccess} />
          </div>
        )}

        <div className={showForm ? "md:col-span-2" : "md:col-span-3"}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-50">Liste des leads</h2>
            <button
              onClick={() => {
                setEditingLead(null);
                setShowForm(!showForm);
              }}
              className="rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
            >
              + Ajouter un lead
            </button>
          </div>
          <LeadTable
            leads={leads}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
}
