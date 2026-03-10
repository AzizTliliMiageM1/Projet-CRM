"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/cards";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import { LeadsOverTimeChart, CompaniesEvolutionChart, ActivityDistributionChart } from "@/components/dashboard/AnalyticsCharts";
import { extractApiData } from "@/lib/utils/api";

interface Stats {
  companies: number;
  contacts: number;
  leads: number;
  tasks: number;
}

interface Trend {
  value: number;
  isPositive: boolean;
}

export function DashboardOverview() {
  const [stats, setStats] = useState<Stats>({
    companies: 0,
    contacts: 0,
    leads: 0,
    tasks: 0,
  });
  const [trends, setTrends] = useState<{ leads: Trend; tasks: Trend }>({
    leads: { value: 0, isPositive: true },
    tasks: { value: 0, isPositive: true },
  });
  const [loading, setLoading] = useState(true);

  // Calculer les tendances en comparant ce mois avec le mois dernier
  const calculateMonthlyTrend = (allItems: any[]): Trend => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const thisMonthCount = allItems.filter((item) => {
      if (!item.created_at) return false;
      const date = new Date(item.created_at);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    }).length;

    const lastMonthCount = allItems.filter((item) => {
      if (!item.created_at) return false;
      const date = new Date(item.created_at);
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    }).length;

    if (lastMonthCount === 0) {
      return { value: thisMonthCount > 0 ? 100 : 0, isPositive: thisMonthCount > 0 };
    }
    const percentChange = Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100);
    return { value: Math.abs(percentChange), isPositive: percentChange >= 0 };
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Faire les requêtes séquentiellement pour éviter les problèmes
        let companies = 0;
        let contacts = 0;
        let leads = 0;
        let tasks = 0;
        let leadsData: any[] = [];
        let tasksData: any[] = [];

        try {
          const res = await fetch("/api/companies");
          if (res.ok) {
            const result = await res.json();
            const data = extractApiData<any[]>(result);
            companies = Array.isArray(data) ? data.length : 0;
          }
        } catch (e) {
          console.error("Erreur companies:", e);
        }

        try {
          const res = await fetch("/api/contacts");
          if (res.ok) {
            const result = await res.json();
            const data = extractApiData<any[]>(result);
            contacts = Array.isArray(data) ? data.length : 0;
          }
        } catch (e) {
          console.error("Erreur contacts:", e);
        }

        try {
          const res = await fetch("/api/leads");
          if (res.ok) {
            const result = await res.json();
            const data = extractApiData<any[]>(result);
            leadsData = Array.isArray(data) ? data : [];
            leads = leadsData.length;
          }
        } catch (e) {
          console.error("Erreur leads:", e);
        }

        try {
          const res = await fetch("/api/tasks");
          if (res.ok) {
            const result = await res.json();
            const data = extractApiData<any[]>(result);
            tasksData = Array.isArray(data) ? data : [];
            tasks = tasksData.length;
          }
        } catch (e) {
          console.error("Erreur tasks:", e);
        }

        setStats({ companies, contacts, leads, tasks });
        
        // Calculer les tendances avec les données récupérées
        const leadsTrend = calculateMonthlyTrend(leadsData);
        const tasksTrend = calculateMonthlyTrend(tasksData);
        setTrends({ leads: leadsTrend, tasks: tasksTrend });
      } catch (err) {
        console.error("Erreur chargement statistiques:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-50">Vue d'ensemble</h1>
        <p className="text-sm text-slate-400 mt-1">
          Récapitulatif global de votre CRM
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <p className="text-slate-400">Chargement des statistiques...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Entreprises"
              value={stats.companies}
              icon="📦"
              color="sky"
            />
            <StatCard
              title="Contacts"
              value={stats.contacts}
              icon="👥"
              color="blue"
            />
            <StatCard
              title="Leads"
              value={stats.leads}
              icon="🎯"
              color="purple"
              trend={trends.leads}
            />
            <StatCard
              title="Tâches"
              value={stats.tasks}
              icon="✓"
              color="green"
              trend={trends.tasks}
            />
          </div>

          {/* Activité récente */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-lg font-semibold text-slate-50 mb-4">
              Activité récente
            </h2>
            <ActivityTimeline />
          </div>

          {/* Charts supplémentaires */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LeadsOverTimeChart />
            <CompaniesEvolutionChart />
          </div>

          <div>
            <ActivityDistributionChart />
          </div>
        </>
      )}
    </div>
  );
}
