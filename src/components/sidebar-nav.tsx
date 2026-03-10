"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarNavProps {
  isAdmin: boolean;
}

const navItems: Array<{
  href: string;
  label: string;
  adminOnly?: boolean;
}> = [{ href: "/dashboard", label: "Dashboard" }];

export function SidebarNav({ isAdmin }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1 text-sm">
      {navItems.map((item) => {
        if (item.adminOnly && !isAdmin) return null;

        const isActive = pathname.startsWith("/dashboard");

        const baseClasses =
          "flex items-center justify-between rounded-md px-3 py-2 transition-colors duration-150";
        const inactiveClasses = "text-slate-300 hover:bg-slate-800 hover:text-slate-50";
        const activeClasses = "bg-slate-800 text-sky-300 shadow-sm border border-slate-700";

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
          >
            <span className="truncate">{item.label}</span>
            {isActive && <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />}
          </Link>
        );
      })}
    </nav>
  );
}
