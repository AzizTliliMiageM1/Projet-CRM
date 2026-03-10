"use client";

import { useEffect, useState } from "react";
import { CompanyTable } from "@/components/companies/CompanyTable";
import { CompanyForm } from "@/components/companies/CompanyForm";

interface Company {
  id: string;
  name: string;
  domain: string | null;
  organization_id: string;
  created_at: string | null;
  updated_at: string | null;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/companies");
        if (!response.ok) throw new Error("Erreur chargement");
        const data: Company[] = await response.json();
        setCompanies(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingCompany(null);
    // Fetch updated list
    setLoading(true);
    try {
      const response = await fetch("/api/companies");
      if (!response.ok) throw new Error("Erreur chargement");
      const data: Company[] = await response.json();
      setCompanies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setCompanies((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCompany(null);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Entreprises</h1>
        <p className="text-sm text-slate-400">
          Gérez les entreprises et leurs informations.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Formulaire (sidebar droite) */}
        {showForm && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 md:col-span-1">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-50">
                {editingCompany ? "Modifier" : "Nouvelle entreprise"}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            <CompanyForm initialData={editingCompany ?? undefined} onSuccess={handleFormSuccess} />
          </div>
        )}

        {/* Tableau (col principale) */}
        <div className={showForm ? "md:col-span-2" : "md:col-span-3"}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-50">Liste des entreprises</h2>
            <button
              onClick={() => {
                setEditingCompany(null);
                setShowForm(!showForm);
              }}
              className="rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
            >
              + Ajouter une entreprise
            </button>
          </div>
          <CompanyTable
            companies={companies}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
}
