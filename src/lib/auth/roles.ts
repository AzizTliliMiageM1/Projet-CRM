import type { UserRole } from "@/lib/types/crm";

export function isAdmin(role?: UserRole | null) {
  return role === "admin";
}

export function isSales(role?: UserRole | null) {
  return role === "sales";
}

export function canManageLeads(role?: UserRole | null) {
  return role === "admin" || role === "sales";
}

export function canViewDashboard(role?: UserRole | null) {
  return !!role;
}
