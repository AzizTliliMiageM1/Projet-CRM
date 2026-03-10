import { NextRequest, NextResponse } from 'next/server';
import { getBrevoClient } from '@/lib/services/brevoService';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/emails/sync-contact
 * Sync a contact to Brevo
 */
export async function POST(request: NextRequest) {
  try {
    const { contactId, email, firstName, lastName, companyName } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'email is required' },
        { status: 400 }
      );
    }

    const brevoClient = getBrevoClient();

    // Upsert contact in Brevo
    const result = await brevoClient.upsertContact({
      email,
      firstName: firstName || '',
      lastName: lastName || '',
      attributes: {
        COMPANY: companyName || '',
        CRM_ID: contactId || '',
        SYNC_DATE: new Date().toISOString(),
      },
      updateEnabled: true,
    });

    return NextResponse.json({
      success: true,
      brevoId: result.id,
      message: 'Contact synced to Brevo successfully',
    });
  } catch (error) {
    console.error('Error syncing contact to Brevo:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to sync contact' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/emails/sync-contact
 * Sync all contacts from CRM to Brevo
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    // Fetch all contacts
    const { data: contacts, error: fetchError } = await supabase
      .from('contacts')
      .select('id, name, email, phone, company_id, organization_id, created_at')
      .limit(100); // Limit to prevent timeout

    if (fetchError) {
      throw fetchError;
    }

    const brevoClient = getBrevoClient();
    let synced = 0;
    let failed = 0;

    // Sync each contact
    for (const contact of contacts || []) {
      try {
        await brevoClient.upsertContact({
          email: contact.email,
          firstName: contact.name?.split(' ')[0] || '',
          lastName: contact.name?.split(' ').slice(1).join(' ') || '',
          attributes: {
            COMPANY_ID: contact.company_id,
            PHONE: contact.phone || '',
            CRM_ID: contact.id,
            SYNC_DATE: new Date().toISOString(),
          },
          updateEnabled: true,
        });
        synced++;
      } catch (error) {
        console.error(`Failed to sync contact ${contact.id}:`, error);
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      synced,
      failed,
      total: (contacts || []).length,
      message: `Synced ${synced} contacts, ${failed} failed`,
    });
  } catch (error) {
    console.error('Error syncing contacts:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to sync contacts' },
      { status: 500 }
    );
  }
}
