import { NextRequest, NextResponse } from 'next/server';
import { getBrevoClient } from '@/lib/services/brevoService';

/**
 * GET /api/emails/stats
 * Get email campaign statistics and health check
 */
export async function GET(request: NextRequest) {
  try {
    const brevoClient = getBrevoClient();

    // Test Brevo connection and get account info
    try {
      // We'll use a simple API call to verify the connection
      const response = await fetch('https://api.brevo.com/v3/account', {
        headers: {
          'api-key': process.env.BREVO_API_KEY || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to connect to Brevo API');
      }

      const accountInfo = await response.json();

      return NextResponse.json({
        success: true,
        status: 'connected',
        account: {
          email: accountInfo.email,
          firstName: accountInfo.firstName,
          lastName: accountInfo.lastName,
          company: accountInfo.company,
          planType: accountInfo.planType,
          credits: accountInfo.credits,
        },
        message: 'Brevo connection is healthy',
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        status: 'disconnected',
        message: 'Brevo API is not configured or connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  } catch (error) {
    console.error('Error getting email stats:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get stats' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/emails/stats
 * Send test email to verify Brevo connection
 */
export async function POST(request: NextRequest) {
  try {
    const { testEmail } = await request.json();

    if (!testEmail) {
      return NextResponse.json(
        { error: 'testEmail is required' },
        { status: 400 }
      );
    }

    const brevoClient = getBrevoClient();

    const result = await brevoClient.sendEmail({
      to: [{ email: testEmail }],
      subject: '✅ Test Email from CRM SaaS',
      htmlContent: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #0ea5e9;">✅ Brevo Connection Successful!</h1>
              <p>This is a test email to verify your Brevo integration is working correctly.</p>
              <p>You can now start sending emails through your CRM SaaS.</p>
              <p>Happy selling! 🚀</p>
            </div>
          </body>
        </html>
      `,
      textContent: `Brevo Connection Successful! This is a test email to verify your Brevo integration is working correctly.`,
    });

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      message: 'Test email sent successfully. Check your inbox!',
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send test email' },
      { status: 500 }
    );
  }
}
