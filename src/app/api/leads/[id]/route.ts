import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { getRouteUserContext } from "@/lib/auth/route-guards";
import { getLeadById, updateLead, deleteLead } from "@/lib/services/lead.service";
import { leadUpdateSchema } from "@/lib/validation/schemas";
import { successResponse, errorResponse, handleRouteError } from "@/lib/utils/http";

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { supabase, user } = await getRouteUserContext({ role: ["admin", "sales", "user"] });
    const lead = await getLeadById(supabase, user, id);

    if (!lead) {
      return errorResponse({ message: "Lead introuvable", code: "NOT_FOUND" }, 404);
    }

    return successResponse(lead);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const json = await request.json();
    const payload = leadUpdateSchema.parse(json);

    const { supabase, user } = await getRouteUserContext({ role: ["admin", "sales"] });
    const updated = await updateLead(supabase, user, id, payload);

    if (!updated) {
      return errorResponse({ message: "Lead introuvable", code: "NOT_FOUND" }, 404);
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
    await deleteLead(supabase, user, id);

    return successResponse({ success: true });
  } catch (e) {
    return handleRouteError(e);
  }
}
