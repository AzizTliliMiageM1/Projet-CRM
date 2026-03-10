import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

/**
 * POST /api/admin/seed-demo-data
 * Load demo data for presentation
 */
export async function POST(request: NextRequest) {
  // Security check: Only allow in development or with secret key
  const authHeader = request.headers.get('authorization');
  const demoSecret = process.env.DEMO_SEED_SECRET || 'demo-secret-key';

  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${demoSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    );
  }

  try {
    console.log('🌱 Seeding demo data...\n');

    // For this demo, we'll use the first organization in the system
    // In a real app, you'd get this from the authenticated user
    const { data: orgs } = await supabase
      .from('organizations')
      .select('id')
      .limit(1);

    const organizationId = orgs?.[0]?.id || 'demo-org-' + Date.now();

    // 1. Create Companies
    console.log('📊 Creating companies...');
    const companies = [
      { name: 'Tesla', domain: 'tesla.com', industry: 'Automotive & Energy', organization_id: organizationId, status: 'active' },
      { name: 'Apple', domain: 'apple.com', industry: 'Technology', organization_id: organizationId, status: 'active' },
      { name: 'Microsoft', domain: 'microsoft.com', industry: 'Software & Cloud', organization_id: organizationId, status: 'active' },
      { name: 'OpenAI', domain: 'openai.com', industry: 'AI & Research', organization_id: organizationId, status: 'active' },
    ];

    const { data: companiesData, error: companiesError } = await supabase
      .from('companies')
      .insert(companies)
      .select();

    if (companiesError) {
      console.error('Error creating companies:', companiesError);
      return NextResponse.json({ error: companiesError.message }, { status: 500 });
    }

    console.log(`✅ Created ${companiesData?.length || 0} companies\n`);

    const companyMap: Record<string, string> = {};
    companiesData?.forEach((company, index) => {
      const names = ['Tesla', 'Apple', 'Microsoft', 'OpenAI'];
      companyMap[names[index]] = company.id;
    });

    // 2. Create Contacts
    console.log('👥 Creating contacts...');
    const contacts = [
      {
        first_name: 'Elon',
        last_name: 'Musk',
        email: 'elon@tesla.com',
        phone: '+1-650-681-5000',
        company_id: companyMap.Tesla,
        organization_id: organizationId,
        status: 'active',
      },
      {
        first_name: 'Tim',
        last_name: 'Cook',
        email: 'tim.cook@apple.com',
        phone: '+1-408-996-1010',
        company_id: companyMap.Apple,
        organization_id: organizationId,
        status: 'active',
      },
      {
        first_name: 'Satya',
        last_name: 'Nadella',
        email: 'satya@microsoft.com',
        phone: '+1-425-882-8080',
        company_id: companyMap.Microsoft,
        organization_id: organizationId,
        status: 'active',
      },
      {
        first_name: 'Sam',
        last_name: 'Altman',
        email: 'sam@openai.com',
        phone: '+1-617-253-1000',
        company_id: companyMap.OpenAI,
        organization_id: organizationId,
        status: 'active',
      },
    ];

    const { data: contactsData, error: contactsError } = await supabase
      .from('contacts')
      .insert(contacts)
      .select();

    if (contactsError) {
      console.error('Error creating contacts:', contactsError);
      return NextResponse.json({ error: contactsError.message }, { status: 500 });
    }

    console.log(`✅ Created ${contactsData?.length || 0} contacts\n`);

    // 3. Create Leads
    console.log('🎯 Creating leads...');
    const leads = [
      {
        title: 'Contrat IA - Système Autonome',
        company_id: companyMap.Tesla,
        organization_id: organizationId,
        amount: 50000,
        currency: 'EUR',
        status: 'new',
        probability: 20,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        title: 'Consulting Data & Analytics',
        company_id: companyMap.Apple,
        organization_id: organizationId,
        amount: 30000,
        currency: 'EUR',
        status: 'in_progress',
        probability: 60,
        due_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        title: 'Licence Software Enterprise',
        company_id: companyMap.Microsoft,
        organization_id: organizationId,
        amount: 80000,
        currency: 'EUR',
        status: 'negotiation',
        probability: 75,
        due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        title: 'Partnership Stratégique',
        company_id: companyMap.OpenAI,
        organization_id: organizationId,
        amount: 120000,
        currency: 'EUR',
        status: 'won',
        probability: 100,
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .insert(leads)
      .select();

    if (leadsError) {
      console.error('Error creating leads:', leadsError);
      return NextResponse.json({ error: leadsError.message }, { status: 500 });
    }

    console.log(`✅ Created ${leadsData?.length || 0} leads\n`);

    // 4. Create Tasks
    console.log('✅ Creating tasks...');
    const tasks = [
      {
        title: 'Relancer Tesla sur proposition',
        description: 'Envoyer un suivi concernant le contrat IA',
        priority: 'high',
        status: 'todo',
        due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        company_id: companyMap.Tesla,
        organization_id: organizationId,
      },
      {
        title: 'Envoyer proposition Apple',
        description: 'Proposal for data consulting services',
        priority: 'high',
        status: 'in_progress',
        due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        company_id: companyMap.Apple,
        organization_id: organizationId,
      },
      {
        title: 'Meeting Microsoft - Négociation',
        description: 'Call with procurement team at 2 PM',
        priority: 'medium',
        status: 'todo',
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        company_id: companyMap.Microsoft,
        organization_id: organizationId,
      },
      {
        title: 'Préparer contrat OpenAI',
        description: 'Finalize partnership agreement and terms',
        priority: 'high',
        status: 'todo',
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        company_id: companyMap.OpenAI,
        organization_id: organizationId,
      },
    ];

    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .insert(tasks)
      .select();

    if (tasksError) {
      console.error('Error creating tasks:', tasksError);
      return NextResponse.json({ error: tasksError.message }, { status: 500 });
    }

    console.log(`✅ Created ${tasksData?.length || 0} tasks\n`);

    console.log('🎉 Demo data successfully seeded!\n');
    console.log('📊 Summary:');
    console.log(`   • ${companiesData?.length || 0} Companies`);
    console.log(`   • ${contactsData?.length || 0} Contacts`);
    console.log(`   • ${leadsData?.length || 0} Leads (Total value: €280,000)`);
    console.log(`   • ${tasksData?.length || 0} Tasks\n`);

    return NextResponse.json({
      success: true,
      message: 'Demo data seeded successfully',
      data: {
        companies: companiesData?.length || 0,
        contacts: contactsData?.length || 0,
        leads: leadsData?.length || 0,
        tasks: tasksData?.length || 0,
        totalValue: '€280,000',
      },
    });
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
