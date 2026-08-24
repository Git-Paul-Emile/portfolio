import type { Localized } from "./projects";

/**
 * ⚠️  CONTENU D'EXEMPLE - À REMPLACER
 * ----------------------------------------------------------------------------
 * Ces témoignages sont des textes de démonstration destinés à valider la mise
 * en page. Ils ne proviennent PAS de vrais clients.
 *
 * Avant toute mise en ligne, remplace chaque entrée par un retour réel, avec
 * l'accord de la personne citée. Publier un faux témoignage est trompeur pour
 * les visiteurs et juridiquement risqué (pratique commerciale trompeuse).
 *
 * Si tu n'as pas encore de témoignage à publier, supprime simplement
 * `<Testimonials />` de `src/pages/Index.tsx` : la page reste cohérente.
 */
export interface Testimonial {
  id: string;
  /** Texte du témoignage, dans les deux langues. */
  quote: Localized;
  /** Nom de la personne citée. */
  author: string;
  /** Fonction et société. */
  role: Localized;
  /** Photo de la personne. `null` → les initiales sont affichées à la place. */
  avatar: string | null;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "exemple-1",
    quote: {
      fr: "Exemple de témoignage à remplacer. Décrivez ici le besoin initial du client, la façon dont le projet a été mené, et le résultat obtenu une fois la solution en production.",
      en: "Placeholder testimonial to replace. Describe the client's initial need, how the project was run, and the outcome once the solution went live.",
    },
    author: "Prénom Nom",
    role: { fr: "Fonction, Entreprise", en: "Role, Company" },
    avatar: null,
  },
  {
    id: "exemple-2",
    quote: {
      fr: "Deuxième exemple de témoignage. Un retour court et concret vaut mieux qu'un long éloge : un chiffre, un délai tenu ou un problème résolu convainc davantage.",
      en: "Second placeholder testimonial. A short, concrete comment beats a long compliment: a figure, a deadline met or a problem solved is far more convincing.",
    },
    author: "Prénom Nom",
    role: { fr: "Fonction, Entreprise", en: "Role, Company" },
    avatar: null,
  },
  {
    id: "exemple-3",
    quote: {
      fr: "Troisième exemple de témoignage. Pensez à demander l'autorisation écrite avant de publier le nom et la photo d'un client sur votre site.",
      en: "Third placeholder testimonial. Remember to get written permission before publishing a client's name and photo on your website.",
    },
    author: "Prénom Nom",
    role: { fr: "Fonction, Entreprise", en: "Role, Company" },
    avatar: null,
  },
];
