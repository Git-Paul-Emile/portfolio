/**
 * Informations de contact et identité — source de vérité unique.
 *
 * Pourquoi centraliser ? Le numéro de téléphone apparaît dans le hero, la
 * section contact, le pied de page et les liens WhatsApp. Le dupliquer, c'est
 * garantir qu'un jour l'un des quatre ne sera pas mis à jour (violation du
 * principe DRY). Ici, une seule ligne à changer.
 */
export const PROFILE = {
  firstName: "Paul Emile",
  lastName: "PECKOUET-BINOMBO",
  initials: "PE",

  email: "apeckouet@gmail.com",

  /** Format international brut, sans espace — requis par les liens tel: et WhatsApp. */
  phoneRaw: "221772995851",
  /** Format lisible par un humain. */
  phoneDisplay: "(+221) 77 299 58 51",

  linkedinUrl: "https://www.linkedin.com/in/paul-emile-peckouet-binombo🇬🇦-ba76bb278",
  githubUrl: "https://github.com/Git-Paul-Emile",

  /** Chemin du CV dans /public. Encodé au moment de l'affichage. */
  cvPath: "/CV PAUL  ÉMILE PECKOUET-BINOMBO.pdf",

  photoPath: "/mon-photo-d-identite.jpg",
  logoPath: "/logo.png",

  /**
   * Chiffres affichés dans le bandeau du hero.
   *
   * Valeurs fixées manuellement (et non déduites du tableau de projets) :
   * elles reflètent l'expérience professionnelle réelle, qui ne correspond pas
   * forcément au nombre de projets publiés sur le site. Pense à les relire
   * chaque année.
   */
  yearsOfExperience: 3,
  projectsDelivered: 5,
} as const;

/** Lien `mailto:` prêt à l'emploi. */
export const mailtoHref = `mailto:${PROFILE.email}`;

/** Lien `tel:` prêt à l'emploi. */
export const telHref = `tel:+${PROFILE.phoneRaw}`;

/**
 * Construit une URL WhatsApp avec un message pré-rempli.
 * `encodeURIComponent` est indispensable : sans lui, les espaces et les
 * accents casseraient l'URL.
 */
export function whatsappHref(message: string): string {
  return `https://wa.me/${PROFILE.phoneRaw}?text=${encodeURIComponent(message)}`;
}

