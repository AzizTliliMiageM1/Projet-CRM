/**
 * Extrait les données d'une réponse API
 * Gère les formats : { success: true, data: [...] }, ainsi que les tableaux directs
 */
export function extractApiData<T>(response: any): T {
  if (!response) return [] as T;

  // Format avec success + data
  if (response.success && response.data !== undefined) {
    return response.data;
  }

  // Format tableau direct
  if (Array.isArray(response)) {
    return response as T;
  }

  // Fallback
  return [] as T;
}

/**
 * Valide que la réponse n'est pas une erreur API
 */
export function isApiError(response: any): boolean {
  return response?.success === false || (response?.error && !Array.isArray(response));
}

/**
 * Récupère le message d'erreur d'une réponse API
 */
export function getErrorMessage(response: any): string {
  return (
    response?.error?.message ||
    response?.message ||
    response?.error ||
    "Erreur serveur inconnue"
  );
}
