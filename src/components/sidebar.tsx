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
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-950 border-r border-slate-800/50 backdrop-blur-xl flex flex-col transition-all duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo/Header */}
        <div className="relative px-6 py-6 border-b border-slate-800/30 bg-gradient-to-b from-slate-800/50 via-slate-900/20 to-transparent">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
          <div className="relative flex items-center gap-3 mb-2">
            <Logo className="w-8 h-8" />
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-sky-300 via-sky-400 to-blue-400 bg-clip-text text-transparent">
                CRM Suite
              </h1>
              <p className="text-xs text-slate-500">Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto scrollbar-hide">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? "text-sky-300"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                {/* Background effects */}
                {isActive && (
                  <>
                    {/* Active background glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-600/20 via-sky-500/10 to-blue-600/10 rounded-xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-600/10 to-transparent rounded-xl blur-lg"></div>
                    {/* Border glow */}
                    <div className="absolute inset-0 rounded-xl border border-sky-500/30 shadow-lg shadow-sky-500/10"></div>
                  </>
                )}

                {/* Hover background */}
                {!isActive && (
                  <div className="absolute inset-0 bg-slate-800/0 group-hover:bg-slate-800/30 rounded-xl transition-colors duration-300"></div>
                )}

                {/* Content */}
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-all duration-300 relative z-10 ${
                    isActive
                      ? "text-sky-400 drop-shadow-lg drop-shadow-sky-500/50"
                      : "text-slate-500 group-hover:text-slate-300 group-hover:scale-110"
                  }`}
                />
                <span className={`text-sm font-medium relative z-10 flex-1 text-left transition-all duration-300 ${
                  isActive ? "font-semibold" : ""
                }`}>
                  {item.label}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <div className="relative z-10 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-400 to-blue-400 shadow-lg shadow-sky-500/50 flex-shrink-0 animate-pulse"></div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Divider with gradient */}
        <div className="relative h-px bg-gradient-to-r from-transparent via-slate-800/50 to-transparent"></div>

        {/* User section */}
        <div className="px-3 py-6 space-y-4">
          <div className="relative px-4 py-3 rounded-xl bg-gradient-to-br from-slate-800/30 to-slate-900/20 border border-slate-800/50 backdrop-blur-sm group hover:border-sky-500/30 transition-all duration-300">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500/0 via-sky-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="relative flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-lg shadow-sky-500/30">
                <span className="text-xs font-bold text-white">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{userEmail}</p>
                <p className="text-xs text-slate-500">Rôle : {userRole}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-300 border border-transparent hover:border-red-500/30 text-sm font-medium group"
          >
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            <span>Déconnexion</span>
          </button>
        </div>

        {/* Footer with gradient */}
        <div className="relative border-t border-slate-800/30 px-4 py-4 bg-gradient-to-t from-slate-950/50 to-transparent">
          <p className="text-xs text-slate-500 text-center">
            CRM SaaS
            <br />
            Projet réalisé par
            <br />
            <span className="text-sky-400 font-semibold drop-shadow-lg drop-shadow-sky-500/30">Aziz Tlili</span>
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
