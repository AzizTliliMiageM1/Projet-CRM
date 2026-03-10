import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { getRouteUserContext } from "@/lib/auth/route-guards";
import { updateTask, deleteTask } from "@/lib/services/task.service";
import { taskUpdateSchema } from "@/lib/validation/schemas";
import { successResponse, errorResponse, handleRouteError } from "@/lib/utils/http";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const json = await request.json();
    const payload = taskUpdateSchema.parse(json);

    const { supabase, user } = await getRouteUserContext({ role: ["admin", "sales"] });
    const updated = await updateTask(supabase, user, id, payload);

    if (!updated) {
      return errorResponse({ message: "Tâche introuvable", code: "NOT_FOUND" }, 404);
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
    await deleteTask(supabase, user, id);

    return successResponse({ success: true });
  } catch (e) {
    return handleRouteError(e);
  }
}
