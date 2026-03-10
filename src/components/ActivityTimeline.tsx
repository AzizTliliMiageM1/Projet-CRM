"use client";

import { useEffect, useState } from "react";
import { extractApiData } from "@/lib/utils/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Building2, Users, Zap, CheckCircle } from "lucide-react";

interface ActivityEvent {
  id: string;
  type: "company_created" | "contact_added" | "lead_added" | "task_completed";
  title: string;
  description: string;
  timestamp: Date;
  icon: React.ReactNode;
}

export function ActivityTimeline() {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const events: ActivityEvent[] = [];

        // Récupérer les entreprises récentes
        const companiesRes = await fetch("/api/companies");
        if (companiesRes.ok) {
          const companiesData = extractApiData<any[]>(await companiesRes.json());
          if (Array.isArray(companiesData)) {
            companiesData.slice(0, 3).forEach((c) => {
              events.push({
                id: `company-${c.id}`,
                type: "company_created",
                title: "Entreprise créée",
                description: `${c.name} a été ajoutée`,
                timestamp: new Date(c.created_at || new Date()),
                icon: <Building2 className="w-5 h-5 text-blue-400" />,
              });
            });
          }
        }

        // Récupérer les contacts récents
        const contactsRes = await fetch("/api/contacts");
        if (contactsRes.ok) {
          const contactsData = extractApiData<any[]>(await contactsRes.json());
          if (Array.isArray(contactsData)) {
            contactsData.slice(0, 3).forEach((c) => {
              events.push({
                id: `contact-${c.id}`,
                type: "contact_added",
                title: "Contact ajouté",
                description: `${c.name} ajouté`,
                timestamp: new Date(c.created_at || new Date()),
                icon: <Users className="w-5 h-5 text-purple-400" />,
              });
            });
          }
        }

        // Récupérer les leads récents
        const leadsRes = await fetch("/api/leads");
        if (leadsRes.ok) {
          const leadsData = extractApiData<any[]>(await leadsRes.json());
          if (Array.isArray(leadsData)) {
            leadsData.slice(0, 3).forEach((l) => {
              events.push({
                id: `lead-${l.id}`,
                type: "lead_added",
                title: "Lead créé",
                description: `${l.name} (${l.status})`,
                timestamp: new Date(l.created_at || new Date()),
                icon: <Zap className="w-5 h-5 text-yellow-400" />,
              });
            });
          }
        }

        // Récupérer les tâches récentes complétées
        const tasksRes = await fetch("/api/tasks");
        if (tasksRes.ok) {
          const tasksData = extractApiData<any[]>(await tasksRes.json());
          if (Array.isArray(tasksData)) {
            tasksData
              .filter((t) => t.completed)
              .slice(0, 3)
              .forEach((t) => {
                events.push({
                  id: `task-${t.id}`,
                  type: "task_completed",
                  title: "Tâche complétée",
                  description: t.title,
                  timestamp: new Date(t.updated_at || new Date()),
                  icon: <CheckCircle className="w-5 h-5 text-green-400" />,
                });
              });
          }
        }

        // Trier par date décroissante
        events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setActivities(events.slice(0, 10)); // Limiter à 10 événements
      } catch (err) {
        console.error("Erreur chargement activité:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return <div className="text-slate-400 text-sm">Chargement...</div>;
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 text-sm">
        Aucune activité récente
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={activity.id} className="flex gap-4">
          {/* Timeline line */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center">{activity.icon}</div>
            {index < activities.length - 1 && (
              <div className="w-0.5 h-12 bg-slate-700 mt-2" />
            )}
          </div>

          {/* Content */}
          <div className="pb-4">
            <p className="text-sm font-medium text-slate-50">{activity.title}</p>
            <p className="text-xs text-slate-400 mt-1">{activity.description}</p>
            <p className="text-xs text-slate-600 mt-2">
              {format(activity.timestamp, "dd MMM yyyy à HH:mm", { locale: fr })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
