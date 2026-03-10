"use client";

import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { extractApiData } from "@/lib/utils/api";

interface SearchResult {
  type: "company" | "contact" | "lead" | "task";
  id: string;
  title: string;
  subtitle?: string;
  action: () => void;
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(
    async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchLower = searchTerm.toLowerCase();
        const searchResults: SearchResult[] = [];

        // Rechercher les entreprises
        const companiesRes = await fetch(`/api/companies?q=${encodeURIComponent(searchTerm)}`);
        if (companiesRes.ok) {
          const companiesData = extractApiData<any[]>(await companiesRes.json());
          if (Array.isArray(companiesData)) {
            companiesData.forEach((c) => {
              searchResults.push({
                type: "company",
                id: c.id,
                title: c.name,
                subtitle: c.domain,
                action: () => console.log("Navigate to company", c.id),
              });
            });
          }
        }

        // Rechercher les contacts
        const contactsRes = await fetch("/api/contacts");
        if (contactsRes.ok) {
          const contactsData = extractApiData<any[]>(await contactsRes.json());
          if (Array.isArray(contactsData)) {
            contactsData
              .filter((c) => c.name?.toLowerCase().includes(searchLower) || c.email?.toLowerCase().includes(searchLower))
              .forEach((c) => {
                searchResults.push({
                  type: "contact",
                  id: c.id,
                  title: c.name,
                  subtitle: c.email,
                  action: () => console.log("Navigate to contact", c.id),
                });
              });
          }
        }

        // Rechercher les leads
        const leadsRes = await fetch("/api/leads");
        if (leadsRes.ok) {
          const leadsData = extractApiData<any[]>(await leadsRes.json());
          if (Array.isArray(leadsData)) {
            leadsData
              .filter((l) => l.name?.toLowerCase().includes(searchLower) || l.email?.toLowerCase().includes(searchLower))
              .forEach((l) => {
                searchResults.push({
                  type: "lead",
                  id: l.id,
                  title: l.name,
                  subtitle: `${l.email} • ${l.status}`,
                  action: () => console.log("Navigate to lead", l.id),
                });
              });
          }
        }

        // Rechercher les tâches
        const tasksRes = await fetch("/api/tasks");
        if (tasksRes.ok) {
          const tasksData = extractApiData<any[]>(await tasksRes.json());
          if (Array.isArray(tasksData)) {
            tasksData
              .filter((t) => t.title?.toLowerCase().includes(searchLower))
              .forEach((t) => {
                searchResults.push({
                  type: "task",
                  id: t.id,
                  title: t.title,
                  subtitle: t.description?.slice(0, 50),
                  action: () => console.log("Navigate to task", t.id),
                });
              });
          }
        }

        setResults(searchResults.slice(0, 10)); // Limiter à 10 résultats
      } catch (err) {
        console.error("Erreur recherche:", err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    handleSearch(value);
  };

  const getIcon = (type: string) => {
    const icons: Record<string, string> = {
      company: "🏢",
      contact: "👤",
      lead: "🎯",
      task: "✓",
    };
    return icons[type] || "📄";
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 w-4 h-4 text-slate-500 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Recherche globale..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-600/20"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown des résultats */}
      {isOpen && query && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-slate-700 bg-slate-900/95 shadow-xl z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-slate-400 text-sm">Recherche en cours...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-slate-400 text-sm">Aucun résultat</div>
          ) : (
            <div className="divide-y divide-slate-800">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => {
                    result.action();
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-slate-800/50 transition-colors flex items-start gap-3"
                >
                  <span className="text-lg flex-shrink-0">{getIcon(result.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-50 truncate">{result.title}</p>
                    {result.subtitle && (
                      <p className="text-xs text-slate-400 truncate">{result.subtitle}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
