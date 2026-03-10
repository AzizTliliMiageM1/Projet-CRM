import { leadCreateSchema } from "@/lib/validation/schemas";
import { getRouteUserContext } from "@/lib/auth/route-guards";
import { listLeads, createLead } from "@/lib/services/lead.service";
import { successResponse, handleRouteError } from "@/lib/utils/http";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const { supabase, user } = await getRouteUserContext({ role: ["admin", "sales", "user"] });
    const leads = await listLeads(supabase, user, status);
    return successResponse(leads);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = leadCreateSchema.parse(json);

    const { supabase, user } = await getRouteUserContext({ role: ["admin", "sales"] });
    const lead = await createLead(supabase, user, payload);

    return successResponse(lead, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
