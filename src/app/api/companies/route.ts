import { getRouteUserContext } from "@/lib/auth/route-guards";
import { companyCreateSchema } from "@/lib/validation/schemas";
import { listCompanies, createCompany } from "@/lib/services/company.service";
import { successResponse, errorResponse, handleRouteError } from "@/lib/utils/http";
import { ZodError } from "zod";

export async function GET(request: Request) {
  try {
    const { supabase, user } = await getRouteUserContext();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q");

    const companies = await listCompanies(supabase, user, search ?? undefined);
    return successResponse(companies);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, user } = await getRouteUserContext({ role: ["admin", "sales"] });
    const json = await request.json();
    const payload = companyCreateSchema.parse(json);

    const company = await createCompany(supabase, user, payload);
    return successResponse(company, { status: 201 });
  } catch (e) {
    if (e instanceof ZodError) {
      return errorResponse(
        { message: "Payload invalide", code: "VALIDATION_ERROR", details: e.flatten() },
        400,
      );
    }
    return handleRouteError(e);
  }
}
