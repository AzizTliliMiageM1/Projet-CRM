import { z } from "zod";

export const emailSchema = z.string().email("Email invalide");

export const companyCreateSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  domain: z.union([z.string().url("URL invalide"), z.literal("")]).optional(),
});

export const companyUpdateSchema = companyCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Aucune donnée à mettre à jour",
  },
);

export const contactCreateSchema = z.object({
  first_name: z.string().min(1, "Prénom requis"),
  last_name: z.string().min(1, "Nom requis"),
  email: emailSchema,
  phone: z.string().optional().or(z.literal("")),
  company_id: z.string().uuid().optional().or(z.literal("")),
});

export const contactUpdateSchema = contactCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Aucune donnée à mettre à jour",
  },
);

export const leadCreateSchema = z.object({
  title: z.string().min(1, "Titre requis"),
  status: z
    .enum(["new", "qualified", "proposal", "negotiation", "won", "lost"])
    .optional(),
  value: z
    .number()
    .min(0, "La valeur ne peut pas être négative")
    .optional(),
  company_id: z.string().uuid().optional().or(z.literal("")),
  contact_id: z.string().uuid().optional().or(z.literal("")),
  owner_id: z.string().uuid().optional().or(z.literal("")),
});

export const leadUpdateSchema = leadCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Aucune donnée à mettre à jour",
  },
);

export const taskCreateSchema = z.object({
  lead_id: z.string().uuid({ message: "lead_id invalide" }).optional().or(z.literal("")),
  title: z.string().min(1, "Titre requis"),
  due_date: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Date d’échéance invalide",
  }),
  completed: z.boolean().optional(),
});

export const taskUpdateSchema = taskCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Aucune donnée à mettre à jour",
  },
);

export type CompanyCreateInput = z.infer<typeof companyCreateSchema>;
export type CompanyUpdateInput = z.infer<typeof companyUpdateSchema>;
export type ContactCreateInput = z.infer<typeof contactCreateSchema>;
export type ContactUpdateInput = z.infer<typeof contactUpdateSchema>;
export type LeadCreateInput = z.infer<typeof leadCreateSchema>;
export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;
export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;
