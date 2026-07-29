import { fr } from "./fr";

/**
 * Langues supportées par le site.
 * Ajouter une langue = ajouter le code ici + créer le fichier de dictionnaire.
 */
export const LOCALES = ["fr", "en"] as const;

export type Locale = (typeof LOCALES)[number];

/**
 * Langue affichée par défaut (exigence : le site est en français par défaut).
 */
export const DEFAULT_LOCALE: Locale = "fr";

/**
 * Forme d'un dictionnaire de traduction.
 *
 * Le type est DÉDUIT du dictionnaire français : `fr.ts` fait donc office de
 * contrat. Tout autre dictionnaire déclaré `: Dictionary` doit exposer
 * exactement les mêmes clés, sinon `tsc` échoue au build.
 * C'est un garde-fou gratuit contre les traductions manquantes.
 */
export type Dictionary = typeof fr;

/**
 * Métadonnées d'affichage d'une langue (utilisées par le sélecteur FR/EN).
 */
export interface LocaleMeta {
  code: Locale;
  /** Libellé court affiché dans le bouton : "FR", "EN". */
  short: string;
  /** Nom complet, utilisé pour l'accessibilité (aria-label, title). */
  label: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  fr: { code: "fr", short: "FR", label: "Français" },
  en: { code: "en", short: "EN", label: "English" },
};
