import { getRouteUserContext } from "@/lib/auth/route-guards";
import { taskCreateSchema } from "@/lib/validation/schemas";
import { listTasks, createTask } from "@/lib/services/task.service";
import { successResponse, handleRouteError } from "@/lib/utils/http";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyUrgent = searchParams.get("urgent") === "true";

    const { supabase, user } = await getRouteUserContext({ role: ["admin", "sales"] });
    const tasks = await listTasks(supabase, user, onlyUrgent);

    return successResponse(tasks);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = taskCreateSchema.parse(json);

    const { supabase, user } = await getRouteUserContext({ role: ["admin", "sales"] });
    const task = await createTask(supabase, user, payload);

    return successResponse(task, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
