/**
 * Exporte un array d'objets en fichier CSV
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: (keyof T)[]
) {
  if (!data || data.length === 0) {
    alert("Aucune donnée à exporter");
    return;
  }

  // Déterminer les colonnes à exporter
  const keys = columns || (Object.keys(data[0]) as (keyof T)[]);

  // En-têtes CSV
  const headers = keys.map((key) => `"${String(key)}"`).join(",");

  // Lignes CSV
  const rows = data.map((item) =>
    keys
      .map((key) => {
        const value = item[key];
        // Échapper les guillemets et retours à la ligne
        const escaped = String(value || "").replace(/"/g, '""').replace(/\n/g, " ");
        return `"${escaped}"`;
      })
      .join(",")
  );

  // Combiner headers + rows
  const csv = [headers, ...rows].join("\n");

  // Créer le blob et télécharger
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Export spécifiques pour chaque entité
 */
export async function exportCompaniesCSV() {
  const res = await fetch("/api/companies");
  if (res.ok) {
    const result = await res.json();
    const companies = result.data || result;
    exportToCSV(companies, "companies.csv", ["name", "domain", "created_at"]);
  }
}

export async function exportContactsCSV() {
  const res = await fetch("/api/contacts");
  if (res.ok) {
    const result = await res.json();
    const contacts = result.data || result;
    exportToCSV(contacts, "contacts.csv", ["name", "email", "phone", "created_at"]);
  }
}

export async function exportLeadsCSV() {
  const res = await fetch("/api/leads");
  if (res.ok) {
    const result = await res.json();
    const leads = result.data || result;
    exportToCSV(leads, "leads.csv", ["name", "email", "status", "created_at"]);
  }
}

export async function exportTasksCSV() {
  const res = await fetch("/api/tasks");
  if (res.ok) {
    const result = await res.json();
    const tasks = result.data || result;
    exportToCSV(tasks, "tasks.csv", ["title", "description", "completed", "due_date"]);
  }
}
