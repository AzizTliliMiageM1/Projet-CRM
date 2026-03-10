import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);

async function seedDemoData() {
  console.log("🌱 Seeding demo data...");

  try {
    // Get user's organization from auth
    const { data: { user }, error: authError } = await supabase.auth.admin.getUserById(
      (await supabase.auth.getUser()).data.user?.id || ""
    );

    if (authError || !user) {
      console.error("❌ Error getting user:", authError);
      return;
    }

    // Get organization
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("organization_id")
      .eq("user_id", user.id)
      .single();

    if (!profile) {
      console.error("❌ Error getting profile");
      return;
    }

    const orgId = profile.organization_id;
    console.log(`📊 Organization ID: ${orgId}`);

    // Check existing data
    const { count: companyCount } = await supabase
      .from("companies")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", orgId);

    if (companyCount && companyCount > 0) {
      console.log(`✅ Demo data already exists (${companyCount} companies)`);
      return;
    }

    // Add demo companies
    console.log("➕ Adding demo companies...");
    const { data: companies, error: companyError } = await supabase
      .from("companies")
      .insert([
        { name: "Acme Corp", domain: "acmecorp.com", organization_id: orgId },
        { name: "TechStart Inc", domain: "techstart.io", organization_id: orgId },
        { name: "Global Solutions", domain: "global-solutions.fr", organization_id: orgId },
      ])
      .select();

    if (companyError) {
      console.error("❌ Error adding companies:", companyError);
      return;
    }

    console.log(`✅ Added ${companies?.length || 0} companies`);

    // Add demo contacts
    if (companies && companies.length > 0) {
      console.log("➕ Adding demo contacts...");
      const { error: contactError } = await supabase
        .from("contacts")
        .insert([
          {
            name: "Jean Dupont",
            email: "jean.dupont@acmecorp.com",
            phone: "+33 1 23 45 67 89",
            company_id: companies[0].id,
            organization_id: orgId,
          },
          {
            name: "Marie Martin",
            email: "marie.martin@techstart.io",
            phone: "+33 2 34 56 78 90",
            company_id: companies[1].id,
            organization_id: orgId,
          },
          {
            name: "Pierre Bernard",
            email: "pierre.bernard@global-solutions.fr",
            phone: "+33 3 45 67 89 01",
            company_id: companies[2].id,
            organization_id: orgId,
          },
        ]);

      if (contactError) {
        console.error("❌ Error adding contacts:", contactError);
      } else {
        console.log("✅ Added 3 contacts");
      }
    }

    // Add demo leads
    console.log("➕ Adding demo leads...");
    const { error: leadError } = await supabase
      .from("leads")
      .insert([
        {
          name: "Prospect A",
          email: "prospect-a@example.com",
          status: "new",
          organization_id: orgId,
        },
        {
          name: "Prospect B",
          email: "prospect-b@example.com",
          status: "in_progress",
          organization_id: orgId,
        },
        {
          name: "Prospect C",
          email: "prospect-c@example.com",
          status: "won",
          organization_id: orgId,
        },
      ]);

    if (leadError) {
      console.error("❌ Error adding leads:", leadError);
    } else {
      console.log("✅ Added 3 leads");
    }

    // Add demo tasks
    console.log("➕ Adding demo tasks...");
    const { error: taskError } = await supabase
      .from("tasks")
      .insert([
        {
          title: "Appel client Acme",
          description: "Discuter des besoins pour le Q2",
          due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
          organization_id: orgId,
        },
        {
          title: "Envoyer devis",
          description: "Devis pour TechStart",
          due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
          organization_id: orgId,
        },
        {
          title: "Réunion de suivi",
          description: "Follow-up avec Global Solutions",
          due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
          organization_id: orgId,
        },
      ]);

    if (taskError) {
      console.error("❌ Error adding tasks:", taskError);
    } else {
      console.log("✅ Added 3 tasks");
    }

    console.log("\n🎉 Demo data seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding demo data:", error);
  }
}

seedDemoData();
