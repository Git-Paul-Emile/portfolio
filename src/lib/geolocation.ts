/**
 * Détecte le pays du visiteur à partir de son adresse IP (aucune permission
 * navigateur requise, contrairement à `navigator.geolocation`).
 *
 * Retourne `null` en cas d'échec (API indisponible, réseau coupé, etc.) :
 * l'appelant doit alors se rabattre sur un choix par défaut.
 */
export async function detectCountryCode(): Promise<string | null> {
  try {
    const response = await fetch("https://ipwho.is/", {
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) return null;

    const data = (await response.json()) as { success?: boolean; country_code?: string };
    if (data.success === false) return null;

    return typeof data.country_code === "string" ? data.country_code : null;
  } catch {
    return null;
  }
}
