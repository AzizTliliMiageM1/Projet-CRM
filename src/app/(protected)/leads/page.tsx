"use client";

import { useEffect, useState, useCallback } from "react";
import { LeadTable } from "@/components/leads/LeadTable";
import { LeadForm } from "@/components/leads/LeadForm";
import { Container, PageHeader } from "@/components/Layout";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { TrendingUp, Plus, X } from "lucide-react";

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
    <Container>
      <PageHeader
        icon={<TrendingUp className="w-8 h-8" />}
        title="Leads & Opportunités"
        description="Gérez vos opportunités commerciales et suivez votre pipeline"
        action={
          <Button
            variant="primary"
            onClick={() => {
              setEditingLead(null);
              setShowForm(!showForm);
            }}
            icon={showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          >
            {showForm ? "Fermer" : "Ajouter un lead"}
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3 animate-fade-in">
        {showForm && (
          <Card className="lg:col-span-1 animate-fade-in-up" variant="elevated">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/30">
                <h3 className="text-lg font-semibold text-slate-50">
                  {editingLead ? "Modifier le lead" : "Nouveau lead"}
                </h3>
              </div>
              <LeadForm initialData={editingLead ?? undefined} onSuccess={handleFormSuccess} />
            </div>
          </Card>
        )}

        <div className={`${showForm ? "lg:col-span-2" : "lg:col-span-3"} animate-fade-in-up`} style={{ animationDelay: "0.1s" }}>
          <LeadTable
            leads={leads}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={loading}
          />
        </div>
      </div>
    </Container>
  );
}
