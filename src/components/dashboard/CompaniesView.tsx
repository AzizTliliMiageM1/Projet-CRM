"use client";

import { useEffect, useState } from "react";
import { CompanyTable } from "@/components/companies/CompanyTable";
import { CompanyForm } from "@/components/companies/CompanyForm";
import { extractApiData, getErrorMessage } from "@/lib/utils/api";
import { Plus, Building2, Search, Download } from "lucide-react";
import { exportCompaniesCSV } from "@/lib/utils/csv-export";
import toast from "react-hot-toast";

interface Company {
  id: string;
  name: string;
  domain: string | null;
  organization_id: string;
  created_at: string | null;
  updated_at: string | null;
}

export function CompaniesView() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/companies");
        console.log("Companies API response status:", response.status);
        
        if (!response.ok) {
          throw new Error("Impossible de charger les entreprises");
        }
        
        const result = await response.json();
        console.log("Companies API result:", result);
        
        const data = extractApiData<Company[]>(result);
        console.log("Extracted data:", data);
        
        if (!Array.isArray(data)) {
          console.warn("Data is not array:", typeof data, data);
          setCompanies([]);
          return;
        }
        
        console.log("Setting companies with", data.length, "items");
        setCompanies(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur inconnue";
        console.error("Erreur chargement entreprises:", err);
        setError(message);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingCompany(null);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/companies");
      if (!response.ok) {
        throw new Error("Impossible de charger les entreprises");
      }
      const result = await response.json();
      const data = extractApiData<Company[]>(result);
      
      if (!Array.isArray(data)) {
        throw new Error("Format de données invalide");
      }
      
      setCompanies(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      console.error("Erreur chargement entreprises:", err);
      setError(message);
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

  // Filtrer les entreprises par recherche
  const filteredCompanies = companies.filter((company) => {
    try {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = company?.name?.toLowerCase?.()?.includes?.(searchLower) ?? false;
      const domainMatch = company?.domain?.toLowerCase?.()?.includes?.(searchLower) ?? false;
      return nameMatch || domainMatch;
    } catch (err) {
      console.error("Erreur filtrage entreprise:", company, err);
      return false;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-sky-400" />
            Entreprises
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Gérez les entreprises et leurs informations.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                await exportCompaniesCSV();
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
              setEditingCompany(null);
              setShowForm(!showForm);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-sky-500/30 transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Ajouter une entreprise
          </button>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="rounded-lg border border-red-800 bg-red-900/20 p-4 text-red-400">
          <p className="text-sm font-medium">Erreur: {error}</p>
        </div>
      )}

      {/* Loader */}
      {loading && !error ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 p-12 shadow-lg">
          <p className="text-slate-400">Chargement des entreprises...</p>
        </div>
      ) : (
        <>
          {/* Form section */}
          {showForm && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-50">
                  {editingCompany ? "✏️ Modifier une entreprise" : "➕ Nouvelle entreprise"}
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  ✕
                </button>
              </div>
              <CompanyForm initialData={editingCompany ?? undefined} onSuccess={handleFormSuccess} />
            </div>
          )}

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 w-4 h-4 text-slate-500 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom ou domaine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/40 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
            />
          </div>

          {/* Table */}
          <CompanyTable
            companies={filteredCompanies}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={loading}
          />

          {/* Stats */}
          {filteredCompanies.length > 0 && (
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3 flex items-center justify-between">
              <p className="text-sm text-slate-400">
                {filteredCompanies.length === companies.length
                  ? `${companies.length} entreprise${companies.length > 1 ? "s" : ""} au total`
                  : `${filteredCompanies.length} résultat${filteredCompanies.length > 1 ? "s" : ""} sur ${companies.length}`}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
