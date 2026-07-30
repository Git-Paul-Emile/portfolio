/**
 * Dictionnaire FRANÇAIS — langue de référence.
 *
 * Ce fichier est la SOURCE DE VÉRITÉ du typage : le type `Dictionary`
 * (voir ./types.ts) est déduit de cet objet via `typeof fr`.
 * Conséquence pratique : si tu ajoutes une clé ici, TypeScript refusera
 * de compiler tant que la même clé n'existe pas dans `en.ts`.
 * Impossible d'oublier une traduction — l'erreur est détectée au build.
 */
export const fr = {
  meta: {
    title: "Paul Emile PECKOUET-BINOMBO — Développeur Full Stack",
    description:
      "Portfolio de Paul Emile PECKOUET-BINOMBO, développeur full stack. Applications web et mobiles modernes, performantes et évolutives : React, Next.js, Angular, Node.js, PostgreSQL.",
  },

  nav: {
    home: "Accueil",
    services: "Services",
    projects: "Projets",
    expertise: "Expertise",
    process: "Processus",
    contact: "Contact",
    cta: "Discutons",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
  },

  hero: {
    firstName: "Paul Emile",
    lastName: "PECKOUET-BINOMBO",
    roleStrong: "Développeur Full Stack",
    roleAmp: "&",
    roleAccent: "Architecte",
    roleRest: "d'applications web",
    description:
      "Je conçois des solutions web et mobiles modernes, sécurisées et évolutives. J'accompagne entreprises, entrepreneurs et particuliers de la conception à la mise en production.",
    ctaWork: "Voir mes projets",
    ctaCv: "Mon cv",
    stats: {
      experience: "Années d'expérience",
      projects: "Projets",
    },
    photoAlt: "Portrait de Paul Emile PECKOUET-BINOMBO",
  },

  work: {
    eyebrow: "Projets sélectionnés",
    title: "Réalisations",
    viewAll: "Voir tous les projets",
    viewMore: "Voir plus",
    viewLess: "Réduire",
    visitSite: "Visiter le site",
    noLiveSite: "Site non public",
    stack: "Stack technique",
    frontend: "Frontend",
    backend: "Backend",
    database: "Base de données",
    none: "Aucun",
    filterAll: "Tous",
    filterWeb: "Web",
    filterMobile: "Mobile",
    filterPrefix: "Filtre",
    filterLabel: "Filtrer les projets",
    empty: "Aucun projet dans cette catégorie pour le moment.",
    gallery: "Galerie",
    openImage: "Agrandir l'image",
    closeImage: "Fermer l'image",
    imageAlt: "Aperçu du projet",
    previous: "Précédent",
    next: "Suivant",
  },

  services: {
    eyebrow: "Services",
    title: "Ce que je fais",
    items: [
      {
        title: "Applications web",
        description:
          "Plateformes métier sur mesure : back-office, tableaux de bord, gestion des rôles et des accès.",
      },
      {
        title: "API REST & Backend",
        description:
          "APIs documentées, sécurisées et paginées. Authentification JWT, validation des entrées, gestion d'erreurs.",
      },
      {
        title: "Sites vitrines & e-commerce",
        description:
          "Sites rapides, responsives et optimisés SEO, pensés pour convertir vos visiteurs en clients.",
      },
      {
        title: "Applications mobiles",
        description:
          "Applications React Native / Expo publiées sur iOS et Android, connectées à vos services existants.",
      },
      {
        title: "Base de données & modélisation",
        description:
          "Schémas relationnels normalisés, migrations versionnées et requêtes optimisées avec Prisma.",
      },
      {
        title: "Déploiement & maintenance",
        description:
          "Mise en production, Docker, CI/CD, monitoring et évolutions continues de votre application.",
      },
    ],
    viewMore: "Voir plus",
    viewLess: "Voir moins",
  },

  testimonials: {
    regionLabel: "Témoignages clients",
    previous: "Témoignage précédent",
    next: "Témoignage suivant",
    goTo: "Aller au témoignage",
  },

  expertise: {
    eyebrow: "Outils & compétences",
    title: "Mon expertise",
    subtitle:
      "Les technologies que j'utilise au quotidien, du frontend au déploiement.",
    viewMore: "Voir plus",
    viewLess: "Voir moins",
  },

  process: {
    eyebrow: "Ma méthode",
    title: "Un processus simple et efficace",
    steps: [
      {
        title: "Cadrage",
        description: "Comprendre vos objectifs, vos utilisateurs et vos contraintes.",
      },
      {
        title: "Conception",
        description: "Architecture technique, modèle de données et maquettes des écrans.",
      },
      {
        title: "Développement",
        description: "Code propre et testé, livré par itérations que vous validez.",
      },
      {
        title: "Recette",
        description: "Tests fonctionnels, corrections et optimisation des performances.",
      },
      {
        title: "Mise en ligne",
        description: "Déploiement, formation à l'outil et accompagnement dans la durée.",
      },
    ],
  },

  contact: {
    eyebrow: "Travaillons ensemble",
    title: "Un projet en tête ?",
    description:
      "Disponible pour des missions freelance et des collaborations. Parlons de votre projet et construisons quelque chose de solide.",
    emailLabel: "Email",
    phoneLabel: "Téléphone",
    locationLabel: "Localisation",
    locationValue: "Dakar, Sénégal",
    workModeLabel: "Mode de travail",
    workModeValue: "À distance ou sur site",
    cta: "Démarrer la discussion",
    whatsappMessage:
      "Bonjour Paul Emile, j'ai vu votre portfolio et je souhaite discuter d'un projet.",
  },

  footer: {
    tagline:
      "Je conçois des applications web et mobiles qui inspirent confiance et durent dans le temps.",
    quickLinks: "Navigation",
    followMe: "Me suivre",
    availability: "Disponible pour de nouveaux projets",
    rights: "Tous droits réservés.",
    backToTop: "Retour en haut",
  },

  a11y: {
    switchToDark: "Passer en mode sombre",
    switchToLight: "Passer en mode clair",
    switchLanguage: "Changer de langue",
  },
};
