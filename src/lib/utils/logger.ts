export interface LogContext {
  userId?: string;
  action: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export function logServerEvent(ctx: LogContext) {
  // Logging minimaliste structuré, prêt à être remplacé par un vrai provider
  // (Datadog, Logflare, etc.).
  console.log(
    JSON.stringify({
      level: "info",
      ts: new Date().toISOString(),
      userId: ctx.userId ?? null,
      action: ctx.action,
      message: ctx.message,
      metadata: ctx.metadata ?? {},
    }),
  );
}

export interface EmailLogContext {
  organizationId?: string | null;
  userId?: string | null;
  recipient: string;
  subject: string;
  status?: "attempt" | "success" | "failed" | "skipped";
  error?: string | null;
}

function logEmailEvent(action: string, message: string, ctx: EmailLogContext) {
  logServerEvent({
    userId: ctx.userId ?? undefined,
    action,
    message,
    metadata: {
      organizationId: ctx.organizationId ?? null,
      recipient: ctx.recipient,
      subject: ctx.subject,
      status: ctx.status ?? null,
      error: ctx.error ?? null,
    },
  });
}

export function logEmailAttempt(ctx: EmailLogContext) {
  logEmailEvent("email.attempt", "Attempting to send transactional email", {
    ...ctx,
    status: "attempt",
  });
}

export function logEmailSuccess(ctx: EmailLogContext) {
  logEmailEvent("email.success", "Transactional email sent successfully", {
    ...ctx,
    status: "success",
  });
}

export function logEmailFailure(ctx: EmailLogContext) {
  logEmailEvent("email.failure", "Transactional email failed", {
    ...ctx,
    status: "failed",
  });
}
