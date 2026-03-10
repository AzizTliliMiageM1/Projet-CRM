import { NextRequest, NextResponse } from 'next/server';
import { getBrevoClient } from '@/lib/services/brevoService';
import { emailTemplates, generatePlainText } from '@/lib/services/emailTemplates';

/**
 * POST /api/emails/send-lead-notification
 * Send notification email when a new lead is created
 */
export async function POST(request: NextRequest) {
  try {
    const { leadName, companyName, status, recipientEmail } = await request.json();

    if (!recipientEmail) {
      return NextResponse.json(
        { error: 'recipientEmail is required' },
        { status: 400 }
      );
    }

    const brevoClient = getBrevoClient();
    const htmlContent = emailTemplates.newLeadNotification(leadName, companyName, status);
    const textContent = generatePlainText(htmlContent);

    const result = await brevoClient.sendEmail({
      to: [{ email: recipientEmail }],
      subject: `✨ Nouvelle piste: ${leadName}`,
      htmlContent,
      textContent,
    });

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      message: 'Lead notification email sent successfully',
    });
  } catch (error) {
    console.error('Error sending lead notification:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}
