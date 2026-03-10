import { getEnv } from "@/lib/config/env";
import { logServerEvent } from "@/lib/utils/logger";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const REQUEST_TIMEOUT_MS = 5000;
const FAILURE_WINDOW_MS = 60_000;
const CIRCUIT_OPEN_MS = 60_000;

let failureStreak = 0;
let firstFailureAt: number | null = null;
let circuitOpenUntil: number | null = null;

function isCircuitOpen() {
  if (circuitOpenUntil && Date.now() < circuitOpenUntil) {
    return true;
  }
  if (circuitOpenUntil && Date.now() >= circuitOpenUntil) {
    circuitOpenUntil = null;
  }
  return false;
}

function registerFailure(reason: string) {
  const now = Date.now();

  if (!firstFailureAt || now - firstFailureAt > FAILURE_WINDOW_MS) {
    firstFailureAt = now;
    failureStreak = 1;
  } else {
    failureStreak += 1;
  }

  if (failureStreak >= 3) {
    circuitOpenUntil = now + CIRCUIT_OPEN_MS;
    failureStreak = 0;
    firstFailureAt = null;

    logServerEvent({
      action: "email.circuit.open",
      message: "Brevo circuit breaker opened after repeated failures",
      metadata: {
        reason,
        openUntil: new Date(circuitOpenUntil).toISOString(),
      },
    });
  }
}

function resetCircuit() {
  failureStreak = 0;
  firstFailureAt = null;
  circuitOpenUntil = null;
}

function isRetryableStatus(status: number) {
  return status >= 500 && status < 600;
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

export interface SendEmailPayload {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
}

export async function sendBrevoEmail(payload: SendEmailPayload) {
  const { BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME } = getEnv({
    requireBrevo: process.env.NODE_ENV === "production",
  });

  const apiKey = BREVO_API_KEY;
  const senderEmail = BREVO_SENDER_EMAIL;
  const senderName = BREVO_SENDER_NAME ?? "CRM";

  if (!apiKey || !senderEmail) {
    throw new Error("Brevo API is not configured (BREVO_API_KEY / BREVO_SENDER_EMAIL)");
  }

  if (isCircuitOpen()) {
    throw new Error("Brevo circuit breaker is open; skipping email send");
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(BREVO_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          sender: { email: senderEmail, name: senderName },
          to: payload.to,
          subject: payload.subject,
          htmlContent: payload.htmlContent,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");

        if (isRetryableStatus(res.status) && attempt < 2) {
          lastError = new Error(`Brevo API 5xx error (attempt ${attempt}): ${res.status} ${text}`);
          continue;
        }

        throw new Error(`Brevo API error: ${res.status} ${text}`);
      }

      resetCircuit();
      return res.json();
    } catch (error) {
      lastError = error;

      if (isAbortError(error) && attempt < 2) {
        // Timeout -> on retente une fois
        continue;
      }

      // Erreurs réseau (Abort, TypeError, etc.) ou dernières erreurs 5xx arrivent ici
      registerFailure(error instanceof Error ? error.message : "Unknown Brevo error");
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  registerFailure(
    lastError instanceof Error ? lastError.message : "Brevo send failed after retries",
  );
  throw (lastError instanceof Error
    ? lastError
    : new Error("Brevo send failed after retries"));
}
