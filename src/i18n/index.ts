import { fr } from "./fr";
import { en } from "./en";
import type { Dictionary, Locale } from "./types";

export * from "./types";

/**
 * Registre des dictionnaires disponibles.
 * `Record<Locale, Dictionary>` : si tu ajoutes une langue dans LOCALES sans
 * l'enregistrer ici, TypeScript le signale immédiatement.
 */
export const dictionaries: Record<Locale, Dictionary> = { fr, en };

/**
 * Récupère le dictionnaire d'une langue.
 * Fonction pure : facile à tester, aucune dépendance à React.
 */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
