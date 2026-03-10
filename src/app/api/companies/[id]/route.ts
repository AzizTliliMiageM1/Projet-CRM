import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { getRouteUserContext } from "@/lib/auth/route-guards";
import { companyUpdateSchema } from "@/lib/validation/schemas";
import {
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "@/lib/services/company.service";
import { successResponse, errorResponse, handleRouteError } from "@/lib/utils/http";

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { supabase, user } = await getRouteUserContext();
    const company = await getCompanyById(supabase, user, id);

    if (!company) {
      return errorResponse({ message: "Entreprise introuvable", code: "NOT_FOUND" }, 404);
    }

    return successResponse(company);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { supabase, user } = await getRouteUserContext({ role: ["admin", "sales"] });
    const json = await request.json();
    const payload = companyUpdateSchema.parse(json);

    const updated = await updateCompany(supabase, user, id, payload);

    if (!updated) {
      return errorResponse({ message: "Entreprise introuvable", code: "NOT_FOUND" }, 404);
    }

    return successResponse(updated);
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

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const { supabase, user } = await getRouteUserContext({ role: ["admin", "sales"] });
    await deleteCompany(supabase, user, id);
    return successResponse({ success: true });
  } catch (e) {
    return handleRouteError(e);
  }
}
