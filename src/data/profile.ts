/**
 * Informations de contact et identité - source de vérité unique.
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

  /** Format international brut, sans espace - requis par les liens tel: et WhatsApp. */
  phoneRaw: "241077896327",
  /** Format lisible par un humain. */
  phoneDisplay: "(+241) 077 89 63 27",

  linkedinUrl: "https://www.linkedin.com/in/paul-emile-peckouet-binombo🇬🇦-ba76bb278",
  githubUrl: "https://github.com/Git-Paul-Emile",

  /** Chemin du CV dans /public (encodé au moment de l'affichage). */
  cvPath: "/CV Paul Emile PECKOUET-BINOMBO qrcode.pdf",

  photoPath: "/mon-photo-d-identite.jpg",
  logoPath: "/logo.png",

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
