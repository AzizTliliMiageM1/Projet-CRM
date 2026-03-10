"use client";

import { useState, useMemo, useCallback, lazy, Suspense } from "react";
import { Sidebar } from "@/components/sidebar";
import { GlobalSearch } from "@/components/GlobalSearch";
import { ThemeToggle } from "@/components/ThemeToggle";

// Lazy load heavy components for better performance
const DashboardOverview = lazy(() => import("@/components/dashboard/DashboardOverview").then(mod => ({ default: mod.DashboardOverview })));
const CompaniesView = lazy(() => import("@/components/dashboard/CompaniesView").then(mod => ({ default: mod.CompaniesView })));
const ContactsView = lazy(() => import("@/components/dashboard/ContactsView").then(mod => ({ default: mod.ContactsView })));
const LeadsView = lazy(() => import("@/components/dashboard/LeadsView").then(mod => ({ default: mod.LeadsView })));
const LeadsPipeline = lazy(() => import("@/components/dashboard/LeadsPipeline").then(mod => ({ default: mod.LeadsPipeline })));
const TasksView = lazy(() => import("@/components/dashboard/TasksView").then(mod => ({ default: mod.TasksView })));
const DiagnosticsView = lazy(() => import("@/components/dashboard/DiagnosticsView").then(mod => ({ default: mod.DiagnosticsView })));
const EmailSettingsView = lazy(() => import("@/components/dashboard/EmailSettingsView").then(mod => ({ default: mod.EmailSettingsView })));

type Section = "dashboard" | "companies" | "contacts" | "leads" | "pipeline" | "tasks" | "diagnostics" | "email-settings";

// Skeleton loader for better UX
function LoadingSkeleton() {
  return (
    <div className="space-y-4 p-8">
      <div className="h-12 bg-slate-800/50 rounded-lg animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-slate-800/50 rounded-lg animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

// Memoized section renderer to prevent unnecessary re-renders
const renderSection = (section: Section) => {
  switch (section) {
    case "dashboard":
      return <DashboardOverview />;
    case "companies":
      return <CompaniesView />;
    case "contacts":
      return <ContactsView />;
    case "leads":
      return <LeadsView />;
    case "pipeline":
      return <LeadsPipeline />;
    case "tasks":
      return <TasksView />;
    case "diagnostics":
      return <DiagnosticsView />;
    case "email-settings":
      return <EmailSettingsView />;
    default:
      return <DashboardOverview />;
  }
};

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard");

  // Use useCallback to memoize section change handler
  const handleSectionChange = useCallback((section: Section) => {
    setActiveSection(section);
  }, []);

  // Memoize rendered section content
  const renderedContent = useMemo(() => renderSection(activeSection), [activeSection]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900/95 to-slate-950">
      {/* Sidebar */}
      <Sidebar active={activeSection as any} onSelect={handleSectionChange as any} />

      {/* Mobile overlay */}
      <div className="fixed inset-0 z-30 bg-black/50 md:hidden"></div>

      {/* Main content */}
      <main className="flex-1 md:ml-64 w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Sticky Header with gradient background */}
        <div className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 shadow-lg">
          <div className="p-3 md:px-8 md:py-5 flex items-center justify-between gap-2 md:gap-4">
            <div className="flex-1 min-w-0">
              <GlobalSearch />
            </div>
            <div className="flex-shrink-0 flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Main Content Area with lazy loading fallback */}
        <div className="p-3 md:p-8 max-w-7xl">
          <Suspense fallback={<LoadingSkeleton />}>
            {renderedContent}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
