import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { RouteUserContext } from "@/lib/auth/route-guards";
import { sendBrevoEmail, type SendEmailPayload } from "@/lib/email/brevo";
import { logEmailAttempt, logEmailFailure, logEmailSuccess } from "@/lib/utils/logger";

export type EmailStatus = "sent" | "failed";

export interface EmailContext {
  supabase: SupabaseClient<Database>;
  user: RouteUserContext;
  leadId?: string;
}

export interface SendEmailResult {
  status: EmailStatus;
  errorMessage: string | null;
}

export async function sendTransactionalEmail(
  ctx: EmailContext,
  payload: SendEmailPayload,
): Promise<SendEmailResult> {
  const { supabase, user, leadId } = ctx;
  const primaryRecipient = payload.to[0]?.email ?? "unknown";

  // Idempotence : si un email "sent" existe déjà pour ce lead, ne rien renvoyer
  if (leadId) {
    try {
      const { data: existing, error: existingError } = await supabase
        .from("email_logs")
        .select("id, status")
        .eq("lead_id", leadId)
        .eq("status", "sent")
        .limit(1);

      if (!existingError && existing && existing.length > 0) {
        return { status: "sent", errorMessage: null };
      }
    } catch {
      // En cas d erreur sur la vérification d idempotence, on continue l envoi normal
    }
  }

  logEmailAttempt({
    organizationId: user.organizationId,
    userId: user.userId,
    recipient: primaryRecipient,
    subject: payload.subject,
  });

  let status: EmailStatus = "sent";
  let errorMessage: string | null = null;

  try {
    await sendBrevoEmail(payload);

    logEmailSuccess({
      organizationId: user.organizationId,
      userId: user.userId,
      recipient: primaryRecipient,
      subject: payload.subject,
    });
  } catch (error) {
    status = "failed";
    errorMessage = error instanceof Error ? error.message : "Unknown email error";

    logEmailFailure({
      organizationId: user.organizationId,
      userId: user.userId,
      recipient: primaryRecipient,
      subject: payload.subject,
      error: errorMessage,
    });
  }

  try {
    await supabase.from("email_logs").insert({
      organization_id: user.organizationId,
      lead_id: leadId ?? null,
      to_email: primaryRecipient,
      subject: payload.subject,
      status,
      error_message: errorMessage,
    });
  } catch (logError) {
    logEmailFailure({
      organizationId: user.organizationId,
      userId: user.userId,
      recipient: primaryRecipient,
      subject: payload.subject,
      status: status === "sent" ? "success" : "failed",
      error: `Failed to write email_logs: ${
        logError instanceof Error ? logError.message : String(logError)
      }`,
    });
  }

  // Important : ne jamais faire échouer l appelant à cause de l email
  return { status, errorMessage };
}
