/**
 * Email templates for CRM SaaS notifications
 */

const getAppUrl = () => process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const emailTemplates = {
  /**
   * New lead notification email
   */
  newLeadNotification: (leadName: string, companyName: string, status: string): string => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; }
          .field { margin-bottom: 15px; }
          .field-label { font-weight: 600; color: #1f2937; }
          .field-value { color: #6b7280; margin-top: 5px; }
          .button { display: inline-block; background: #0ea5e9; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
          .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #9ca3af; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ Nouvelle Piste</h1>
          </div>
          <div class="content">
            <p>Bonjour,</p>
            <p>Une nouvelle piste a été créée dans votre CRM:</p>
            
            <div class="field">
              <div class="field-label">Nom de la piste</div>
              <div class="field-value">${leadName}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Entreprise</div>
              <div class="field-value">${companyName}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Statut</div>
              <div class="field-value">${status}</div>
            </div>
            
            <a href="${getAppUrl()}/dashboard/leads" class="button">Voir la piste →</a>
          </div>
          <div class="footer">
            <p>© 2024 CRM SaaS. Tous droits réservés.</p>
          </div>
        </div>
      </body>
    </html>
  `,

  /**
   * Task reminder email
   */
  taskReminder: (taskTitle: string, dueDate: string): string => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; }
          .field { margin-bottom: 15px; }
          .field-label { font-weight: 600; color: #1f2937; }
          .field-value { color: #6b7280; margin-top: 5px; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
          .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #9ca3af; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Rappel de Tâche</h1>
          </div>
          <div class="content">
            <p>Bonjour,</p>
            <p>Vous avez une tâche à accomplir:</p>
            
            <div class="field">
              <div class="field-label">Tâche</div>
              <div class="field-value">${taskTitle}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Date d'échéance</div>
              <div class="field-value">${dueDate}</div>
            </div>
            
            <a href="${getAppUrl()}/dashboard/tasks" class="button">Voir la tâche →</a>
          </div>
          <div class="footer">
            <p>© 2024 CRM SaaS. Tous droits réservés.</p>
          </div>
        </div>
      </body>
    </html>
  `,

  /**
   * Contact follow-up email template
   */
  contactFollowUp: (contactName: string, message: string): string => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; }
          .message { background: white; padding: 15px; border-left: 4px solid #10b981; border-radius: 4px; margin: 20px 0; }
          .button { display: inline-block; background: #10b981; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
          .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #9ca3af; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📞 Suivi de Contact</h1>
          </div>
          <div class="content">
            <p>Bonjour ${contactName},</p>
            
            <div class="message">
              <p>${message}</p>
            </div>
            
            <p>N'hésitez pas à nous contacter si vous avez des questions.</p>
            
            <a href="${getAppUrl()}/dashboard/contacts" class="button">Accéder au CRM →</a>
          </div>
          <div class="footer">
            <p>© 2024 CRM SaaS. Tous droits réservés.</p>
          </div>
        </div>
      </body>
    </html>
  `,

  /**
   * Weekly summary email
   */
  weeklySummary: (leads: number, tasks: number, contacts: number): string => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; }
          .stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin: 20px 0; }
          .stat-card { background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; text-align: center; }
          .stat-number { font-size: 28px; font-weight: bold; color: #8b5cf6; }
          .stat-label { font-size: 12px; color: #6b7280; margin-top: 5px; }
          .button { display: inline-block; background: #8b5cf6; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
          .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #9ca3af; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Résumé Hebdomadaire</h1>
          </div>
          <div class="content">
            <p>Bonjour,</p>
            <p>Voici votre résumé de la semaine:</p>
            
            <div class="stats">
              <div class="stat-card">
                <div class="stat-number">${leads}</div>
                <div class="stat-label">Nouvelles Pistes</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${tasks}</div>
                <div class="stat-label">Tâches Complétées</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${contacts}</div>
                <div class="stat-label">Contacts Actifs</div>
              </div>
            </div>
            
            <p>Continuez à faire du bon travail! 🚀</p>
            
            <a href="${getAppUrl()}/dashboard" class="button">Voir le Tableau de Bord →</a>
          </div>
          <div class="footer">
            <p>© 2024 CRM SaaS. Tous droits réservés.</p>
          </div>
        </div>
      </body>
    </html>
  `,
};

/**
 * Generate plain text version of email
 */
export function generatePlainText(htmlContent: string): string {
  return htmlContent
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n\n+/g, '\n') // Normalize line breaks
    .trim();
}
