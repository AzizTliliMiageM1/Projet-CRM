import { ZodError } from "zod";
import { getRouteUserContext } from "@/lib/auth/route-guards";
import { listContacts, createContact } from "@/lib/services/contact.service";
import { contactCreateSchema } from "@/lib/validation/schemas";
import { successResponse, errorResponse, handleRouteError } from "@/lib/utils/http";

export async function GET(request: Request) {
  try {
    const { supabase, user } = await getRouteUserContext();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q");

    const contacts = await listContacts(supabase, user, search);
    return successResponse(contacts);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, user } = await getRouteUserContext({ role: ["admin", "sales"] });
    const json = await request.json();
    const payload = contactCreateSchema.parse(json);

    const contact = await createContact(supabase, user, payload);
    return successResponse(contact, { status: 201 });
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
