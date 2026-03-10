"use client";

import { useEffect, useState } from "react";
import { CompanyTable } from "@/components/companies/CompanyTable";
import { CompanyForm } from "@/components/companies/CompanyForm";
import { Container, PageHeader } from "@/components/Layout";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Building2, Plus, X } from "lucide-react";

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
    <Container>
      <PageHeader
        icon={<Building2 className="w-8 h-8" />}
        title="Entreprises"
        description="Gérez les entreprises et leurs informations"
        action={
          <Button
            variant="primary"
            onClick={() => {
              setEditingCompany(null);
              setShowForm(!showForm);
            }}
            icon={showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          >
            {showForm ? "Fermer" : "Ajouter une entreprise"}
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3 animate-fade-in">
        {/* Formulaire (sidebar droite) */}
        {showForm && (
          <Card className="lg:col-span-1 animate-fade-in-up" variant="elevated">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/30">
                <h3 className="text-lg font-semibold text-slate-50">
                  {editingCompany ? "Modifier l'entreprise" : "Nouvelle entreprise"}
                </h3>
              </div>
              <CompanyForm initialData={editingCompany ?? undefined} onSuccess={handleFormSuccess} />
            </div>
          </Card>
        )}

        {/* Tableau (col principale) */}
        <div className={`${showForm ? "lg:col-span-2" : "lg:col-span-3"} animate-fade-in-up`} style={{ animationDelay: "0.1s" }}>
          <CompanyTable
            companies={companies}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={loading}
          />
        </div>
      </div>
    </Container>
  );
}
