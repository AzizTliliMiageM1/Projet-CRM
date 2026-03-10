import { NextResponse } from "next/server";

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export function successResponse<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init);
}

export function errorResponse(error: ApiError, status = 400, init?: ResponseInit) {
  return NextResponse.json({ success: false, error }, { ...init, status });
}

export function handleRouteError(e: unknown) {
  if (e instanceof Error) {
    if (e.message === "UNAUTHENTICATED") {
      return errorResponse({ message: "Non authentifié", code: "UNAUTHENTICATED" }, 401);
    }
    if (e.message === "FORBIDDEN") {
      return errorResponse({ message: "Accès refusé", code: "FORBIDDEN" }, 403);
    }
    if (e.message === "PROFILE_LOOKUP_FAILED") {
      return errorResponse(
        { message: "Impossible de récupérer le profil utilisateur", code: "PROFILE_ERROR" },
        500,
      );
    }

    return errorResponse(
      { message: e.message || "Erreur serveur", code: "INTERNAL_ERROR" },
      500,
    );
  }

  return errorResponse({ message: "Erreur inconnue", code: "UNKNOWN" }, 500);
}
