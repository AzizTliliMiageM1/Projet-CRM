"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { extractApiData } from "@/lib/utils/api";
import { TrendingUp } from "lucide-react";

interface Lead {
  id: string;
  created_at: string | null;
}

interface Company {
  id: string;
  created_at: string | null;
}

interface ChartData {
  month: string;
  leads?: number;
  companies?: number;
  count?: number;
}

export function LeadsOverTimeChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        const res = await fetch("/api/leads");
        if (res.ok) {
          const result = await res.json();
          const leads = extractApiData<Lead[]>(result);
          
          // Grouper par mois
          const monthCounts: Record<string, number> = {};
          const now = new Date();
          
          // Initialiser les 6 derniers mois
          for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            monthCounts[monthKey] = 0;
          }
          
          // Compter les leads par mois
          if (Array.isArray(leads)) {
            leads.forEach((lead) => {
              if (lead.created_at) {
                const date = new Date(lead.created_at);
                const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                if (monthKey in monthCounts) {
                  monthCounts[monthKey]++;
                }
              }
            });
          }
          
          const chartData = Object.entries(monthCounts).map(([month, count]) => ({
            month,
            leads: count,
          }));
          
          setData(chartData);
        }
      } catch (err) {
        console.error("Erreur chargement data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded bg-slate-700"></div>
          <div className="h-64 rounded bg-slate-800"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 via-slate-900/30 to-slate-950 backdrop-blur-sm p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-5 h-5 text-green-400" />
        <h3 className="text-lg font-semibold text-slate-50">Leads créés par mois</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
          <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "12px",
              boxShadow: "0 20px 25px rgba(0, 0, 0, 0.3)",
            }}
            formatter={(value) => [`${value} leads`, "Créés"]}
            cursor={{ stroke: "#64748b", strokeWidth: 1 }}
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          <Line
            type="monotone"
            dataKey="leads"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ fill: "#22c55e", r: 5, strokeWidth: 2, stroke: "#15803d" }}
            activeDot={{ r: 7 }}
            name="Leads"
            fillOpacity={1}
            fill="url(#colorLeads)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CompaniesEvolutionChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        const res = await fetch("/api/companies");
        if (res.ok) {
          const result = await res.json();
          const companies = extractApiData<Company[]>(result);
          
          // Grouper par mois
          const monthCounts: Record<string, number> = {};
          const now = new Date();
          
          // Initialiser les 6 derniers mois
          for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            monthCounts[monthKey] = 0;
          }
          
          // Compter les entreprises par mois
          if (Array.isArray(companies)) {
            companies.forEach((company) => {
              if (company.created_at) {
                const date = new Date(company.created_at);
                const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                if (monthKey in monthCounts) {
                  monthCounts[monthKey]++;
                }
              }
            });
          }
          
          const chartData = Object.entries(monthCounts).map(([month, count]) => ({
            month,
            companies: count,
          }));
          
          setData(chartData);
        }
      } catch (err) {
        console.error("Erreur chargement data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded bg-slate-700"></div>
          <div className="h-64 rounded bg-slate-800"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 via-slate-900/30 to-slate-950 backdrop-blur-sm p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-slate-50">Entreprises créées par mois</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorCompanies" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
          <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "12px",
              boxShadow: "0 20px 25px rgba(0, 0, 0, 0.3)",
            }}
            formatter={(value) => [`${value} entreprises`, "Créées"]}
            cursor={{ fill: "rgba(51, 65, 85, 0.2)" }}
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          <Bar
            dataKey="companies"
            fill="url(#colorCompanies)"
            radius={[12, 12, 0, 0]}
            name="Entreprises"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ActivityDistributionChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        // Fetch all data
        const [leadsRes, companiesRes, contactsRes, tasksRes] = await Promise.all([
          fetch("/api/leads"),
          fetch("/api/companies"),
          fetch("/api/contacts"),
          fetch("/api/tasks"),
        ]);

        let activitiesCount: Record<string, number> = {
          Leads: 0,
          Entreprises: 0,
          Contacts: 0,
          Tâches: 0,
        };

        if (leadsRes.ok) {
          const result = await leadsRes.json();
          const leads = extractApiData<Lead[]>(result);
          activitiesCount.Leads = Array.isArray(leads) ? leads.length : 0;
        }

        if (companiesRes.ok) {
          const result = await companiesRes.json();
          const companies = extractApiData<Company[]>(result);
          activitiesCount.Entreprises = Array.isArray(companies) ? companies.length : 0;
        }

        if (contactsRes.ok) {
          const result = await contactsRes.json();
          const contacts = extractApiData<[]>(result);
          activitiesCount.Contacts = Array.isArray(contacts) ? contacts.length : 0;
        }

        if (tasksRes.ok) {
          const result = await tasksRes.json();
          const tasks = extractApiData<[]>(result);
          activitiesCount.Tâches = Array.isArray(tasks) ? tasks.length : 0;
        }

        const chartData = Object.entries(activitiesCount).map(([name, count]) => ({
          month: name,
          count,
        }));

        setData(chartData);
      } catch (err) {
        console.error("Erreur chargement data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded bg-slate-700"></div>
          <div className="h-64 rounded bg-slate-800"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 via-slate-900/30 to-slate-950 backdrop-blur-sm p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-slate-50">Distribution par module</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
          <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "12px",
              boxShadow: "0 20px 25px rgba(0, 0, 0, 0.3)",
            }}
            formatter={(value) => [`${value}`, "Total"]}
            cursor={{ fill: "rgba(51, 65, 85, 0.2)" }}
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          <Bar
            dataKey="count"
            fill="url(#colorActivity)"
            radius={[12, 12, 0, 0]}
            name="Nombre d'éléments"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
