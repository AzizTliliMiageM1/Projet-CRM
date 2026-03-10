import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { isAdmin } from "@/lib/auth/roles";
import { SidebarNav } from "@/components/sidebar-nav";

export const dynamic = "force-dynamic";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900/80 px-4 py-6 shadow-xl md:flex">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            CRM
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-50">SaaS</p>
        </div>
        <SidebarNav isAdmin={isAdmin(currentUser.role)} />
        <div className="mt-auto border-t border-slate-800 pt-4 text-xs text-slate-400">
          <p>{currentUser.full_name ?? currentUser.email}</p>
          <p className="capitalize">Rôle : {currentUser.role ?? "user"}</p>
          <form action="/api/auth/logout" method="post" className="mt-3">
            <button
              type="submit"
              className="w-full rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-100 transition-colors duration-150 hover:bg-slate-800 hover:text-white"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
        {children}
      </main>
    </div>
  );
}
