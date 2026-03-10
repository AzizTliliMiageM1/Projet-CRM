export interface LeadWonTemplateData {
  contactFirstName?: string | null;
  leadTitle: string;
}

export function buildLeadWonTemplate(data: LeadWonTemplateData): string {
  const greeting = data.contactFirstName
    ? `Bonjour ${data.contactFirstName},`
    : "Bonjour,";

  return `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; color: #0f172a;">
      <p>${greeting}</p>
      <p>Bonne nouvelle : votre projet <strong>${data.leadTitle}</strong> a été validé.</p>
      <p>
        Notre équipe va revenir vers vous très rapidement pour finaliser les prochaines étapes
        et vous accompagner dans la mise en place.
      </p>
      <p>Merci pour votre confiance.</p>
      <p>Cordialement,<br/>L équipe CRM SaaS</p>
    </div>
  `;
}
