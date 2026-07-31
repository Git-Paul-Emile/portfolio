import type { Locale } from "@/i18n";

/**
 * Texte disponible dans chaque langue supportée.
 * `Record<Locale, string>` force la présence des DEUX langues : oublier
 * l'anglais d'une description devient une erreur de compilation.
 */
export type Localized = Record<Locale, string>;

/** Un lien cliquable vers une instance en ligne du projet. */
export interface ProjectLink {
  /** Libellé affiché (utile quand un projet expose plusieurs applications). */
  label: string;
  url: string;
}

/**
 * Description technique d'un projet, découpée par couche.
 * Ce découpage reflète l'architecture réelle : présentation / logique métier /
 * persistance. `null` signifie explicitement « cette couche n'existe pas »
 * (par exemple un site statique n'a ni backend ni base de données) — c'est
 * plus honnête et plus lisible qu'un tableau vide.
 */
export interface ProjectStack {
  frontend: string[];
  backend: string[] | null;
  database: string[] | null;
}

/**
 * Nature du livrable, utilisée par le filtre de la section « Réalisations ».
 * `web`    : application ou site consulté dans un navigateur.
 * `mobile` : application installée sur iOS / Android.
 */
export type ProjectType = "web" | "mobile";

export interface Project {
  /** Identifiant stable et unique (slug). Sert de clé React et d'ancre. */
  id: string;
  /** Nom commercial du projet — non traduit. */
  name: string;
  /** Web ou mobile — détermine l'onglet de filtre dans lequel il apparaît. */
  type: ProjectType;
  /** Domaine métier, affiché sous le nom sur la carte. */
  category: Localized;
  /** Une phrase : ce que fait le produit. Affichée sur la carte. */
  summary: Localized;
  /** Paragraphe détaillé, affiché dans la fenêtre de détail. */
  description: Localized;
  stack: ProjectStack;
  /** 3 à 4 technologies clés, affichées en badges sur la carte. */
  highlights: string[];
  /** Liens vers les versions en ligne. Tableau vide = projet non public. */
  links: ProjectLink[];
  /** Visuel de couverture. `null` → une couverture dégradée est générée. */
  cover: string | null;
  /** Captures d'écran de la galerie. */
  screenshots: string[];
  /** Mis en avant en haut de la section « Réalisations ». */
  featured: boolean;
}

/**
 * Les projets du portfolio.
 * Fichier unique = source de vérité : les composants ne font que lire
 * ce tableau, ils ne dupliquent aucune donnée (principe DRY).
 */
export const PROJECTS: Project[] = [
  /* ------------------------------------------------------------------ 01
     La suite FeetiApp regroupe trois livrables distincts, développés et
     déployés séparément. Ils sont donc présentés comme trois projets, et non
     comme une seule entrée : chacun a son public, son URL et son périmètre. */
  {
    id: "feeti-ticket",
    name: "Feeti Ticket",
    type: "web",
    category: { fr: "Billetterie événementielle", en: "Event ticketing" },
    summary: {
      fr: "Plateforme de billetterie événementielle africaine avec contrôle d'accès par QR code.",
      en: "African event ticketing platform with QR code access control.",
    },
    description: {
      fr: "Feeti Ticket couvre tout le cycle de la billetterie : création de l'événement par l'organisateur, mise en vente des billets, paiement, génération du billet avec QR code unique, puis contrôle d'accès par scan à l'entrée. L'API Node/Express typée s'appuie sur une file de tâches BullMQ/Redis pour les traitements longs (envoi des billets par email, génération des PDF) afin que l'interface reste réactive même en pic de vente.",
      en: "Feeti Ticket covers the full ticketing cycle: event creation by the organiser, ticket sales, payment, generation of a ticket with a unique QR code, then access control by scanning at the entrance. The typed Node/Express API relies on a BullMQ/Redis job queue for long-running work (emailing tickets, generating PDFs) so the interface stays responsive even during sales peaks.",
    },
    stack: {
      frontend: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "Radix UI"],
      backend: ["Node.js", "Express", "TypeScript", "Prisma ORM", "JWT", "BullMQ / Redis"],
      database: ["PostgreSQL (Supabase)", "Firebase / Firestore"],
    },
    highlights: ["React", "Node.js", "PostgreSQL", "QR Code"],
    links: [{ label: "Feeti Ticket", url: "https://front-feeti.vercel.app/" }],
    cover: "/feetiticket/cover.png",
    screenshots: [
      "/feetiticket/screenshot-1.png",
      "/feetiticket/screenshot-2.png",
      "/feetiticket/screenshot-3.png",
    ],
    featured: true,
  },

  /* ------------------------------------------------------------------ 02 */
  {
    id: "feeti-play",
    name: "Feeti Play",
    type: "web",
    category: { fr: "Streaming live", en: "Live streaming" },
    summary: {
      fr: "Plateforme de diffusion en direct des événements de la billetterie Feeti.",
      en: "Live streaming platform for the events sold through Feeti ticketing.",
    },
    description: {
      fr: "Feeti Play diffuse en direct les événements vendus sur Feeti Ticket, pour le public qui ne peut pas se déplacer. La diffusion s'appuie sur Mux (ingestion, transcodage, lecture adaptative) et Socket.IO gère le temps réel : compteur de spectateurs, messages du chat et signalement de fin de direct. L'accès au flux est contrôlé par le billet acheté sur Feeti Ticket.",
      en: "Feeti Play streams live the events sold on Feeti Ticket, for audiences who cannot attend in person. Streaming relies on Mux (ingest, transcoding, adaptive playback) and Socket.IO handles real time: viewer count, chat messages and end-of-stream signalling. Access to the stream is gated by the ticket bought on Feeti Ticket.",
    },
    stack: {
      frontend: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "MUI"],
      backend: ["Node.js", "Express", "TypeScript", "Socket.IO", "Mux", "JWT"],
      database: ["PostgreSQL (Supabase) via Prisma"],
    },
    highlights: ["React", "Socket.IO", "Mux", "Express"],
    links: [{ label: "Feeti Play", url: "https://feet-play-front.vercel.app/" }],
    cover: "/feetiplay/cover.png",
    screenshots: [
      "/feetiplay/screenshot-1.png",
      "/feetiplay/screenshot-2.png",
      "/feetiplay/screenshot-3.png",
      "/feetiplay/screenshot-4.png",
      "/feetiplay/screenshot-5.png",
    ],
    featured: true,
  },

  /* ------------------------------------------------------------------ 03 */
  {
    id: "feeti-play-mobile",
    name: "Feeti Play Mobile",
    type: "mobile",
    category: { fr: "Application mobile", en: "Mobile application" },
    summary: {
      fr: "Version mobile iOS et Android de Feeti Play : billets, scan et direct dans la poche.",
      en: "iOS and Android version of Feeti Play: tickets, scanning and live streams in your pocket.",
    },
    description: {
      fr: "Déclinaison mobile de la plateforme, développée en React Native avec Expo pour livrer iOS et Android depuis une seule base de code. L'application permet au spectateur de retrouver ses billets hors connexion, de présenter son QR code à l'entrée, et de suivre le direct. Côté organisateur, elle sert de scanner d'accès : la caméra lit le QR code et valide le billet auprès de l'API.",
      en: "Mobile version of the platform, built with React Native and Expo to ship iOS and Android from a single codebase. It lets attendees find their tickets offline, present their QR code at the entrance and watch the live stream. On the organiser side, it acts as an access scanner: the camera reads the QR code and validates the ticket against the API.",
    },
    stack: {
      frontend: ["React Native", "Expo", "TypeScript", "React Navigation"],
      backend: ["API Feeti (Node.js / Express / Prisma)", "JWT", "Socket.IO"],
      database: ["PostgreSQL (Supabase)", "Firebase / Firestore"],
    },
    highlights: ["React Native", "Expo", "TypeScript", "QR Code"],
    links: [],
    cover: null,
    screenshots: [],
    featured: false,
  },

  /* ------------------------------------------------------------------ 04 */
  {
    id: "seek",
    name: "Seek",
    type: "web",
    category: { fr: "Immobilier locatif", en: "Rental real estate" },
    summary: {
      fr: "Plateforme immobilière locative au Sénégal : annonces, baux et paiement Mobile Money.",
      en: "Rental real estate platform in Senegal: listings, leases and Mobile Money payments.",
    },
    description: {
      fr: "Seek met en relation propriétaires et locataires. Les propriétaires publient et gèrent leurs biens depuis un tableau de bord dédié ; les locataires recherchent par localisation, budget ou proximité d'un point précis grâce à une carte Leaflet. La plateforme couvre tout le cycle : annonce, visite, signature du bail, puis paiement du loyer par Orange Money ou Wave.",
      en: "Seek connects landlords and tenants. Owners publish and manage their properties from a dedicated dashboard; tenants search by location, budget or proximity to a point of interest through a Leaflet map. The platform covers the full cycle: listing, viewing, lease signature, then rent payment via Orange Money or Wave.",
    },
    stack: {
      frontend: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "Leaflet"],
      backend: ["Node.js", "Express 5", "TypeScript", "JWT", "Cloudinary", "Twilio"],
      database: ["PostgreSQL (Neon) via Prisma"],
    },
    highlights: ["React", "Express", "PostgreSQL", "Leaflet"],
    links: [{ label: "Seek", url: "https://seek-front-plum.vercel.app/" }],
    cover: "/seek/cover.png",
    screenshots: [
      "/seek/screenshot-1.png",
      "/seek/screenshot-2.png",
      "/seek/screenshot-3.png",
      "/seek/screenshot-4.png",
      "/seek/screenshot-5.png",
      "/seek/screenshot-6.png",
      "/seek/screenshot-7.png",
    ],
    featured: false,
  },

  /* ------------------------------------------------------------------ 05 */
  {
    id: "memo-ai",
    name: "Memo AI Assistant",
    type: "web",
    category: { fr: "EdTech & intelligence artificielle", en: "EdTech & artificial intelligence" },
    summary: {
      fr: "Accompagnement à la rédaction de mémoires académiques assisté par IA.",
      en: "AI-assisted support for writing academic dissertations.",
    },
    description: {
      fr: "Memo AI analyse les documents déposés par l'étudiant (plan, chapitres, bibliographie) et produit un retour structuré grâce à GPT-4o-mini et à une recherche sémantique par embeddings. Les encadrants suivent la progression de chaque étudiant depuis un tableau de bord. Les analyses, longues par nature, sont traitées en arrière-plan via BullMQ/Redis pour ne jamais bloquer l'interface.",
      en: "Memo AI analyses documents uploaded by the student (outline, chapters, bibliography) and produces structured feedback using GPT-4o-mini and embedding-based semantic search. Supervisors track each student's progress from a dashboard. Analyses, long by nature, run in the background through BullMQ/Redis so the interface never blocks.",
    },
    stack: {
      frontend: ["Next.js 16 (App Router)", "React 19", "TypeScript", "Tailwind CSS v4", "shadcn/ui"],
      backend: ["Node.js", "Express", "Prisma", "OpenAI (GPT-4o-mini + embeddings)", "BullMQ / Redis", "Firebase Auth"],
      database: ["PostgreSQL (Neon)", "Firestore"],
    },
    highlights: ["Next.js", "OpenAI", "Prisma", "Redis"],
    links: [{ label: "Memo AI", url: "https://memo-ai-front.vercel.app/" }],
    cover: "/memo/cover.png",
    screenshots: [
      "/memo/screenshot-1.png",
      "/memo/screenshot-2.png",
      "/memo/screenshot-3.png",
      "/memo/screenshot-4.png",
      "/memo/screenshot-5.png",
    ],
    featured: true,
  },

  /* ------------------------------------------------------------------ 06 */
  {
    id: "milna-gourmet",
    name: "Milna Gourmet",
    type: "web",
    category: { fr: "E-commerce agroalimentaire", en: "Food e-commerce" },
    summary: {
      fr: "Boutique en ligne de produits gourmands avec personnalisation et panneau d'administration.",
      en: "Online shop for gourmet products with customisation and an admin panel.",
    },
    description: {
      fr: "Milna Gourmet digitalise une entreprise de yaourts artisanaux et de créations personnalisées. Le client compose son produit, passe commande en ligne et reçoit une confirmation WhatsApp automatique via Twilio. Côté administration, un back-office permet de gérer le catalogue, les commandes et les statuts de livraison.",
      en: "Milna Gourmet digitalises an artisanal yoghurt and custom-creation business. Customers build their own product, order online and receive an automatic WhatsApp confirmation through Twilio. On the admin side, a back-office manages the catalogue, orders and delivery statuses.",
    },
    stack: {
      frontend: ["React", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "TanStack Query"],
      backend: ["Node.js", "Express", "TypeScript", "JWT", "Twilio (WhatsApp)"],
      database: ["MySQL via Prisma"],
    },
    highlights: ["React", "Express", "MySQL", "Twilio"],
    links: [{ label: "Milna Gourmet", url: "https://milnagourmet.com" }],
    cover: "/milnaGourmet/cover.png",
    screenshots: [
      "/milnaGourmet/screenshot-1.png",
      "/milnaGourmet/screenshot-2.png",
      "/milnaGourmet/screenshot-3.png",
      "/milnaGourmet/screenshot-4.png",
      "/milnaGourmet/screenshot-5.png",
    ],
    featured: false,
  },

  /* ------------------------------------------------------------------ 07 */
  {
    id: "fotol-jay",
    name: "Fotol Jay",
    type: "web",
    category: { fr: "Marketplace", en: "Marketplace" },
    summary: {
      fr: "Marketplace reliant vendeurs informels et acheteurs locaux au Sénégal.",
      en: "Marketplace connecting informal sellers with local buyers in Senegal.",
    },
    description: {
      fr: "Fotol Jay donne une vitrine numérique aux vendeurs informels. Chacun publie ses annonces avec photos, l'équipe de modération valide les contenus, et l'acheteur contacte directement le vendeur via WhatsApp ou Telegram. Le frontend Angular 20 s'appuie sur un système de design tokens en SCSS pour garantir une charte cohérente.",
      en: "Fotol Jay gives informal sellers a digital storefront. Each seller publishes listings with photos, a moderation team validates the content, and buyers contact sellers directly via WhatsApp or Telegram. The Angular 20 frontend relies on an SCSS design-token system to keep the visual language consistent.",
    },
    stack: {
      frontend: ["Angular 20", "SCSS (design tokens)", "PrimeIcons"],
      backend: ["Node.js", "Express 5", "TypeScript", "Prisma 6"],
      database: ["PostgreSQL (Neon)"],
    },
    highlights: ["Angular", "Express", "Prisma", "PostgreSQL"],
    links: [{ label: "Fotol Jay", url: "https://fotol-jay-front.vercel.app/" }],
    cover: "/fotoljay/fotoljay.png",
    screenshots: [
      "/fotoljay/screencapture-localhost-4200-2025-10-17-00_07_07.png",
      "/fotoljay/screencapture-localhost-4200-annonces-2025-10-17-00_07_49.png",
      "/fotoljay/screencapture-localhost-4200-annonces-creer-2025-10-17-00_09_27.png",
      "/fotoljay/screencapture-localhost-4200-mes-annonces-2025-10-17-00_09_02.png",
      "/fotoljay/screencapture-localhost-4200-admin-dashboard-2025-10-17-00_11_28.png",
      "/fotoljay/screencapture-localhost-4200-admin-vendeurs-2025-10-17-00_11_44.png",
      "/fotoljay/screencapture-localhost-4200-admin-parametres-2025-10-17-00_13_16.png",
      "/fotoljay/screencapture-localhost-4200-about-2025-10-17-00_08_09.png",
    ],
    featured: false,
  },

  /* ------------------------------------------------------------------ 08 */
  {
    id: "cargotrack",
    name: "CargoTrack",
    type: "web",
    category: { fr: "Logistique & transport", en: "Logistics & transport" },
    summary: {
      fr: "Gestion et suivi de cargaisons maritimes, aériennes et routières.",
      en: "Management and tracking of sea, air and road cargo.",
    },
    description: {
      fr: "CargoTrack couvre l'enregistrement des colis, leur affectation à une cargaison, le suivi de leur état et la recherche multicritère. Un tableau de bord synthétise l'activité, et PHPMailer notifie automatiquement les clients à chaque changement de statut. Le stockage repose sur un fichier JSON structuré simulant une base de données, ce qui rend l'application déployable sans serveur de base de données.",
      en: "CargoTrack covers parcel registration, assignment to a shipment, status tracking and multi-criteria search. A dashboard summarises activity, and PHPMailer automatically notifies customers on every status change. Storage relies on a structured JSON file acting as a database, which makes the app deployable without a database server.",
    },
    stack: {
      frontend: ["TypeScript (compilé en JS)", "HTML / CSS", "Templates PHP"],
      backend: ["PHP", "PHPMailer"],
      database: ["Fichier JSON (db.json)"],
    },
    highlights: ["PHP", "TypeScript", "JSON", "PHPMailer"],
    links: [],
    cover: "/cargaison/cover.png",
    screenshots: [
      "/cargaison/screencapture-localhost-8000-accueil-2025-10-17-14_58_43.png",
      "/cargaison/screencapture-localhost-8000-dashboard-2025-10-17-14_58_18.png",
      "/cargaison/screencapture-localhost-8000-recherche-2025-10-17-14_57_01.png",
      "/cargaison/screencapture-localhost-8000-recherche-2025-10-17-15_00_32.png",
      "/cargaison/screencapture-localhost-8000-accueil-2025-10-17-14_59_45.png",
      "/cargaison/Capture d’écran du 2025-10-17 14-52-29.png",
      "/cargaison/Capture d’écran du 2025-10-17 14-56-13.png",
      "/cargaison/Capture d’écran du 2025-10-17 14-56-31.png",
      "/cargaison/Capture d’écran du 2025-10-17 14-56-47.png",
      "/cargaison/Capture d’écran du 2025-10-17 15-00-51.png",
      "/cargaison/Capture d’écran du 2025-10-17 15-01-15.png",
    ],
    featured: false,
  },

  /* ------------------------------------------------------------------ 09 */
  {
    id: "dch-nettoyage",
    name: "DCH Nettoyage Multiservices",
    type: "web",
    category: { fr: "Site vitrine & génération de leads", en: "Showcase site & lead generation" },
    summary: {
      fr: "Site vitrine pour une entreprise de nettoyage : catalogue, galerie et demande de devis.",
      en: "Showcase site for a cleaning company: service catalogue, gallery and quote requests.",
    },
    description: {
      fr: "Le site présente l'ensemble des prestations et transforme les visiteurs en prospects via un formulaire de devis. Le backend Express valide chaque soumission avec Zod, protège l'endpoint par Helmet et un rate-limiting, puis envoie l'email au gérant grâce à Resend. En cas d'indisponibilité du service d'envoi, les messages sont conservés dans un fichier JSON local afin qu'aucune demande ne soit perdue.",
      en: "The site presents all services and converts visitors into leads through a quote form. The Express backend validates each submission with Zod, protects the endpoint with Helmet and rate limiting, then emails the manager through Resend. If the mail service is unavailable, messages are stored in a local JSON file so no request is ever lost.",
    },
    stack: {
      frontend: ["React 18", "Vite", "React Router", "Tailwind CSS", "React Helmet Async"],
      backend: ["Node.js", "Express", "Zod", "Helmet", "Rate limiting", "Resend"],
      database: null,
    },
    highlights: ["React", "Express", "Zod", "Resend"],
    links: [{ label: "DCH Nettoyage", url: "https://dch-nm.com" }],
    cover: "/dch/cover.png",
    screenshots: [
      "/dch/screenshot-1.png",
      "/dch/screenshot-2.png",
      "/dch/screenshot-3.png",
      "/dch/screenshot-4.png",
      "/dch/screenshot-5.png",
    ],
    featured: false,
  },

  /* ------------------------------------------------------------------ 10 */
  {
    id: "veilonne",
    name: "Veilonne Group",
    type: "web",
    category: { fr: "Négoce & logistique", en: "Trading & logistics" },
    summary: {
      fr: "Site institutionnel : sourcing Chine, véhicules, transit douanier et fret international.",
      en: "Corporate website: China sourcing, vehicles, customs clearance and international freight.",
    },
    description: {
      fr: "Site institutionnel présentant les quatre métiers du groupe. L'expérience s'appuie sur des animations Framer Motion et une scène Three.js en page d'accueil pour illustrer les flux logistiques. Un service Express centralise les demandes de devis et les transmet par email via Resend.",
      en: "Corporate website presenting the group's four business lines. The experience relies on Framer Motion animations and a Three.js scene on the home page to illustrate logistics flows. An Express service centralises quote requests and forwards them by email through Resend.",
    },
    stack: {
      frontend: ["React 18", "Vite", "Tailwind CSS", "Radix UI", "Framer Motion", "Three.js"],
      backend: ["Node.js", "Express", "Resend"],
      database: null,
    },
    highlights: ["React", "Three.js", "Framer Motion", "Express"],
    links: [{ label: "Veilonne Group", url: "https://veilonne.com" }],
    cover: "/veilonne/cover.png",
    screenshots: [
      "/veilonne/screenshot-1.png",
      "/veilonne/screenshot-2.png",
      "/veilonne/screenshot-3.png",
      "/veilonne/screenshot-4.png",
      "/veilonne/screenshot-5.png",
      "/veilonne/screenshot-6.png",
      "/veilonne/screenshot-7.png",
    ],
    featured: false,
  },

  /* ------------------------------------------------------------------ 11 */
  {
    id: "ainey",
    name: "Ainey",
    type: "web",
    category: { fr: "Mode & haute couture", en: "Fashion & haute couture" },
    summary: {
      fr: "Site vitrine one-page pour une maison de haute couture sénégalaise.",
      en: "One-page showcase site for a Senegalese haute couture house.",
    },
    description: {
      fr: "Vitrine élégante présentant les collections homme et femme. L'accent est mis sur la mise en valeur des visuels et la fluidité des transitions (Framer Motion). La commande se fait directement par WhatsApp, sans tunnel d'achat : un choix assumé, adapté aux usages locaux et au volume de la maison.",
      en: "An elegant showcase for the men's and women's collections. The focus is on presenting the visuals and on smooth transitions (Framer Motion). Ordering happens directly through WhatsApp, with no checkout funnel: a deliberate choice matching local habits and the brand's volume.",
    },
    stack: {
      frontend: ["React 18", "TypeScript", "Vite", "shadcn/ui", "Radix UI", "Tailwind CSS", "Framer Motion", "TanStack Query"],
      backend: null,
      database: null,
    },
    highlights: ["React", "TypeScript", "Framer Motion", "Tailwind"],
    links: [{ label: "Ainey House", url: "https://aineyhouse.com/" }],
    cover: "/ainey/cover.png",
    screenshots: [
      "/ainey/screenshot-1.png",
      "/ainey/screenshot-2.png",
      "/ainey/screenshot-3.png",
      "/ainey/screenshot-4.png",
    ],
    featured: false,
  },

  /* ------------------------------------------------------------------ 12 */
  {
    id: "carte-visite",
    name: "Carte de visite numérique",
    type: "web",
    category: { fr: "Diplomatie & identité numérique", en: "Diplomacy & digital identity" },
    summary: {
      fr: "Carte de visite numérique bilingue pour un ambassadeur, accessible par QR code.",
      en: "Bilingual digital business card for an ambassador, accessible via QR code.",
    },
    description: {
      fr: "Réalisée pour le Haut-Commissariat de la République gabonaise au Nigeria. La carte regroupe coordonnées, appel direct, envoi d'email et adresse, avec une bascule français / anglais. Elle se partage par QR code et fonctionne sans installation. Volontairement développée en HTML/CSS/JS sans framework : la page pèse quelques kilo-octets et s'affiche instantanément, même sur une connexion mobile lente.",
      en: "Built for the High Commission of the Gabonese Republic to Nigeria. The card gathers contact details, direct call, email and address, with a French / English switch. It is shared through a QR code and works without installation. Deliberately built in plain HTML/CSS/JS without a framework: the page weighs a few kilobytes and renders instantly, even on a slow mobile connection.",
    },
    stack: {
      frontend: ["HTML", "CSS", "JavaScript (sans framework)"],
      backend: null,
      database: null,
    },
    highlights: ["HTML", "CSS", "JavaScript", "QR Code"],
    links: [{ label: "Carte de visite", url: "https://sweet-baklava-448173.netlify.app/" }],
    cover: "/carte_visite/cover.png",
    screenshots: ["/carte_visite/cover.png"],
    featured: false,
  },
];

/** Projets mis en avant : les seuls affichés tant que « Voir tous » n'est pas cliqué. */
export const FEATURED_PROJECTS = PROJECTS.filter((project) => project.featured);

/** Valeurs possibles du filtre de la section « Réalisations ». */
export type ProjectFilter = "all" | ProjectType;

/**
 * Applique le filtre Tous / Web / Mobile.
 * Fonction pure et exportée : elle se teste sans monter le moindre composant.
 */
export function filterProjects(projects: Project[], filter: ProjectFilter): Project[] {
  return filter === "all" ? projects : projects.filter((project) => project.type === filter);
}
