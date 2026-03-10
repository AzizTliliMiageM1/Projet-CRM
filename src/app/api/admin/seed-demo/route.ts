import { getRouteUserContext } from "@/lib/auth/route-guards";
import { successResponse, errorResponse } from "@/lib/utils/http";

export async function POST(request: Request) {
  try {
    const { supabase, user } = await getRouteUserContext({ role: ["admin"] });

    // Check if data already exists
    const { count: existingCount } = await supabase
      .from("companies")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", user.organizationId);

    if (existingCount && existingCount > 0) {
      return successResponse({ message: "Demo data already exists", count: existingCount });
    }

    // Insert demo companies
    const { data: companies, error: companyError } = await supabase
      .from("companies")
      .insert([
        { name: "Acme Corp", domain: "acmecorp.com", organization_id: user.organizationId },
        { name: "TechStart Inc", domain: "techstart.io", organization_id: user.organizationId },
        { name: "Global Solutions", domain: "global-solutions.fr", organization_id: user.organizationId },
      ])
      .select();

    if (companyError) throw companyError;

    // Insert demo contacts
    if (companies && companies.length > 0) {
      const { error: contactError } = await supabase
        .from("contacts")
        .insert([
          {
            name: "Jean Dupont",
            email: "jean.dupont@acmecorp.com",
            phone: "+33 1 23 45 67 89",
            company_id: companies[0].id,
            organization_id: user.organizationId,
          },
          {
            name: "Marie Martin",
            email: "marie.martin@techstart.io",
            phone: "+33 2 34 56 78 90",
            company_id: companies[1].id,
            organization_id: user.organizationId,
          },
          {
            name: "Pierre Bernard",
            email: "pierre.bernard@global-solutions.fr",
            phone: "+33 3 45 67 89 01",
            company_id: companies[2].id,
            organization_id: user.organizationId,
          },
        ]);

      if (contactError) throw contactError;
    }

    // Insert demo leads
    const { error: leadError } = await supabase
      .from("leads")
      .insert([
        {
          name: "Prospect A",
          email: "prospect-a@example.com",
          status: "new",
          organization_id: user.organizationId,
        },
        {
          name: "Prospect B",
          email: "prospect-b@example.com",
          status: "in_progress",
          organization_id: user.organizationId,
        },
        {
          name: "Prospect C",
          email: "prospect-c@example.com",
          status: "won",
          organization_id: user.organizationId,
        },
      ]);

    if (leadError) throw leadError;

    // Insert demo tasks
    const { error: taskError } = await supabase
      .from("tasks")
      .insert([
        {
          title: "Appel client Acme",
          description: "Discuter des besoins pour le Q2",
          due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
          organization_id: user.organizationId,
        },
        {
          title: "Envoyer devis",
          description: "Devis pour TechStart",
          due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
          organization_id: user.organizationId,
        },
        {
          title: "Réunion de suivi",
          description: "Follow-up avec Global Solutions",
          due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
          organization_id: user.organizationId,
        },
      ]);

    if (taskError) throw taskError;

    return successResponse({
      message: "Demo data seeded successfully",
      companies: companies?.length || 0,
      tasks: 3,
      leads: 3,
      contacts: 3,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur inconnue";
    console.error("Error seeding demo data:", message);
    return errorResponse({ message, code: "SEED_ERROR" }, 500);
  }
}
