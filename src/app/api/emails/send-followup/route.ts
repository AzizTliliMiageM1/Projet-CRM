import { NextRequest, NextResponse } from 'next/server';
import { getBrevoClient } from '@/lib/services/brevoService';
import { emailTemplates, generatePlainText } from '@/lib/services/emailTemplates';

/**
 * POST /api/emails/send-followup
 * Send follow-up email to a contact
 */
export async function POST(request: NextRequest) {
  try {
    const { recipientEmail, contactName, message } = await request.json();

    if (!recipientEmail || !message) {
      return NextResponse.json(
        { error: 'recipientEmail and message are required' },
        { status: 400 }
      );
    }

    const brevoClient = getBrevoClient();
    const htmlContent = emailTemplates.contactFollowUp(contactName || 'Customer', message);
    const textContent = generatePlainText(htmlContent);

    const result = await brevoClient.sendEmail({
      to: [{ email: recipientEmail }],
      subject: '📞 Suivi de votre demande',
      htmlContent,
      textContent,
    });

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      message: 'Follow-up email sent successfully',
    });
  } catch (error) {
    console.error('Error sending follow-up email:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}
