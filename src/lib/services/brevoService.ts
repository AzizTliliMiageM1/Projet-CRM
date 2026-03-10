/**
 * Brevo (Sendinblue) Email Service
 * For sending transactional and marketing emails
 */

interface BrevoContact {
  email: string;
  firstName?: string;
  lastName?: string;
  attributes?: Record<string, any>;
  listIds?: number[];
}

interface BrevoEmailRequest {
  to: Array<{ email: string; name?: string }>;
  subject: string;
  htmlContent?: string;
  textContent?: string;
  sender?: { name: string; email: string };
  replyTo?: { email: string; name?: string };
  templateId?: number;
  params?: Record<string, any>;
  cc?: Array<{ email: string; name?: string }>;
  bcc?: Array<{ email: string; name?: string }>;
  attachments?: Array<{
    content: string;
    name: string;
  }>;
}

interface BrevoContactRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  attributes?: Record<string, any>;
  listIds?: number[];
  updateEnabled?: boolean;
}

/**
 * Brevo API Client
 */
export class BrevoClient {
  private apiKey: string;
  private baseUrl = 'https://api.brevo.com/v3';
  private senderEmail: string;
  private senderName: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.BREVO_API_KEY || '';
    this.senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@crm.local';
    this.senderName = process.env.BREVO_SENDER_NAME || 'CRM SaaS';
    
    if (!this.apiKey) {
      console.warn('⚠️ Brevo API key not configured. Emails will not be sent.');
    } else {
      console.log('✅ Brevo service initialized with API key and sender:', this.senderEmail);
    }
  }

  /**
   * Send transactional email via Brevo
   */
  async sendEmail(request: BrevoEmailRequest): Promise<{ messageId: string }> {
    if (!this.apiKey) {
      throw new Error('Brevo API key not configured');
    }

    try {
      const emailPayload = {
        to: request.to,
        subject: request.subject,
        htmlContent: request.htmlContent || request.textContent,
        textContent: request.textContent || '',
        sender: request.sender || {
          name: this.senderName,
          email: this.senderEmail,
        },
        replyTo: request.replyTo,
        templateId: request.templateId,
        params: request.params,
        cc: request.cc,
        bcc: request.bcc,
        attachment: request.attachments?.map(att => ({
          content: att.content,
          name: att.name,
        })) || [],
      };

      console.log('📧 Sending email via Brevo:', {
        to: request.to.map(r => r.email),
        subject: request.subject,
        sender: emailPayload.sender.email,
      });

      const response = await fetch(`${this.baseUrl}/smtp/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify(emailPayload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('❌ Brevo API error response:', {
          status: response.status,
          data: responseData,
        });
        throw new Error(`Brevo API error (${response.status}): ${responseData?.message || 'Unknown error'}`);
      }

      console.log('✅ Email sent successfully:', responseData.messageId);
      return { messageId: responseData.messageId };
    } catch (error) {
      console.error('❌ Failed to send email via Brevo:', error);
      throw error;
    }
  }

  /**
   * Create or update a contact in Brevo
   */
  async upsertContact(contact: BrevoContactRequest): Promise<{ id: number }> {
    if (!this.apiKey) {
      throw new Error('Brevo API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify({
          email: contact.email,
          firstName: contact.firstName,
          lastName: contact.lastName,
          attributes: contact.attributes,
          listIds: contact.listIds || [],
          updateEnabled: contact.updateEnabled !== false,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Brevo API error: ${error.message}`);
      }

      const data = await response.json();
      return { id: data.id };
    } catch (error) {
      console.error('Failed to upsert contact in Brevo:', error);
      throw error;
    }
  }

  /**
   * Get contact details
   */
  async getContact(email: string): Promise<BrevoContact> {
    if (!this.apiKey) {
      throw new Error('Brevo API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/contacts/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Contact not found');
        }
        const error = await response.json();
        throw new Error(`Brevo API error: ${error.message}`);
      }

      const data = await response.json();
      return {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        attributes: data.attributes,
        listIds: data.listIds,
      };
    } catch (error) {
      console.error('Failed to get contact from Brevo:', error);
      throw error;
    }
  }

  /**
   * Add contact to list
   */
  async addContactToList(email: string, listId: number): Promise<void> {
    if (!this.apiKey) {
      throw new Error('Brevo API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/contacts/lists/${listId}/contacts/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify({
          emails: [email],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Brevo API error: ${error.message}`);
      }
    } catch (error) {
      console.error('Failed to add contact to list:', error);
      throw error;
    }
  }

  /**
   * Send SMS via Brevo (if enabled)
   */
  async sendSMS(phoneNumber: string, message: string): Promise<{ reference: string }> {
    if (!this.apiKey) {
      throw new Error('Brevo API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/transactionalSMS/sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify({
          sender: 'CRM',
          recipient: phoneNumber,
          content: message,
          type: 'transactional',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Brevo API error: ${error.message}`);
      }

      const data = await response.json();
      return { reference: data.reference };
    } catch (error) {
      console.error('Failed to send SMS via Brevo:', error);
      throw error;
    }
  }

  /**
   * Get email campaign statistics
   */
  async getCampaignStats(campaignId: number): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Brevo API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/emailCampaigns/${campaignId}`, {
        method: 'GET',
        headers: {
          'api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Brevo API error: ${error.message}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get campaign stats:', error);
      throw error;
    }
  }
}

/**
 * Singleton instance
 */
let brevoClient: BrevoClient | null = null;

export function getBrevoClient(): BrevoClient {
  if (!brevoClient) {
    brevoClient = new BrevoClient();
  }
  return brevoClient;
}
