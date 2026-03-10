import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { getRouteUserContext } from "@/lib/auth/route-guards";
import {
  getContactById,
  updateContact,
  deleteContact,
} from "@/lib/services/contact.service";
import { contactUpdateSchema } from "@/lib/validation/schemas";
import { successResponse, errorResponse, handleRouteError } from "@/lib/utils/http";

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { supabase, user } = await getRouteUserContext();
    const contact = await getContactById(supabase, user, id);

    if (!contact) {
      return errorResponse({ message: "Contact introuvable", code: "NOT_FOUND" }, 404);
    }

    return successResponse(contact);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { supabase, user } = await getRouteUserContext({ role: ["admin", "sales"] });
    const json = await request.json();
    const payload = contactUpdateSchema.parse(json);

    const updated = await updateContact(supabase, user, id, payload);

    if (!updated) {
      return errorResponse({ message: "Contact introuvable", code: "NOT_FOUND" }, 404);
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
    await deleteContact(supabase, user, id);
    return successResponse({ success: true });
  } catch (e) {
    return handleRouteError(e);
  }
}
