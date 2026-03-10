"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Target,
  CheckSquare,
  Activity,
  LogOut,
  Menu,
  X,
  GitBranch,
  Mail,
} from "lucide-react";
import { Logo } from "./Logo";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "#dashboard" },
  { id: "companies", label: "Entreprises", icon: Building2, href: "#companies" },
  { id: "contacts", label: "Contacts", icon: Users, href: "#contacts" },
  { id: "leads", label: "Leads", icon: Target, href: "#leads" },
  { id: "pipeline", label: "Pipeline", icon: GitBranch, href: "#pipeline" },
  { id: "tasks", label: "Tâches", icon: CheckSquare, href: "#tasks" },
  { id: "diagnostics", label: "Diagnostiques", icon: Activity, href: "#diagnostics" },
  { id: "email-settings", label: "Email", icon: Mail, href: "#email-settings" },
];

interface SidebarProps {
  active: string;
  onSelect: (section: string) => void;
  userEmail?: string;
  userRole?: string;
}

export function Sidebar({ active, onSelect, userEmail = "Admin@test.com", userRole = "Admin" }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await router.push("/api/auth/logout");
  };

  const handleNavClick = (itemId: string) => {
    onSelect(itemId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden rounded-md bg-slate-800 p-2 text-slate-200 hover:bg-slate-700"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo/Header */}
        <div className="px-6 py-6 border-b border-slate-700/50 bg-gradient-to-b from-slate-800/50 to-slate-900/0">
          <div className="flex items-center gap-3 mb-2">
            <Logo className="w-8 h-8" />
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                CRM Suite
              </h1>
              <p className="text-xs text-slate-500">Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group relative ${
                  isActive
                    ? "bg-gradient-to-r from-sky-600/30 to-blue-600/20 text-sky-400 border border-sky-500/40 shadow-lg shadow-sky-500/10"
                    : "text-slate-400 hover:text-slate-300 border border-transparent hover:bg-slate-800/30"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-sky-600/10 to-transparent" />
                )}
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                    isActive ? "text-sky-400 scale-110" : "text-slate-500 group-hover:text-slate-300 group-hover:scale-105"
                  }`}
                />
                <span className="text-sm font-medium relative z-10 flex-1 text-left">{item.label}</span>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0" />}
              </button>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-slate-800 px-4 py-6 space-y-4">
          <div className="px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{userEmail}</p>
                <p className="text-xs text-slate-400">Rôle : {userRole}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/10 transition-colors duration-200 border border-transparent hover:border-red-500/30 text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 px-4 py-4">
          <p className="text-xs text-slate-500 text-center">
            CRM SaaS
            <br />
            Projet réalisé par
            <br />
            <span className="text-sky-400 font-medium">Aziz Tlili</span>
          </p>
        </div>
      </aside>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
