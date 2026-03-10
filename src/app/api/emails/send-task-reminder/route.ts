import { NextRequest, NextResponse } from 'next/server';
import { getBrevoClient } from '@/lib/services/brevoService';
import { emailTemplates, generatePlainText } from '@/lib/services/emailTemplates';

/**
 * POST /api/emails/send-task-reminder
 * Send task reminder email
 */
export async function POST(request: NextRequest) {
  try {
    const { taskTitle, dueDate, recipientEmail } = await request.json();

    if (!recipientEmail) {
      return NextResponse.json(
        { error: 'recipientEmail is required' },
        { status: 400 }
      );
    }

    const brevoClient = getBrevoClient();
    const htmlContent = emailTemplates.taskReminder(taskTitle, dueDate);
    const textContent = generatePlainText(htmlContent);

    const result = await brevoClient.sendEmail({
      to: [{ email: recipientEmail }],
      subject: `⏰ Rappel: ${taskTitle}`,
      htmlContent,
      textContent,
    });

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      message: 'Task reminder email sent successfully',
    });
  } catch (error) {
    console.error('Error sending task reminder:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}
