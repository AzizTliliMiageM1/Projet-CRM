export type UserRole = "admin" | "sales" | "user";

export type LeadStatus =
  | "new"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

export interface Company {
  id: string;
  name: string;
  domain?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  company_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  title: string;
  status: LeadStatus;
  value: number;
  company_id?: string | null;
  contact_id?: string | null;
  owner_id?: string | null; // commercial
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  lead_id: string;
  title: string;
  due_date: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmailLog {
  id: string;
  lead_id?: string | null;
  to_email: string;
  subject: string;
  sent_at: string;
}
