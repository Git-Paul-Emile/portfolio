import type { Dictionary } from "./types";

/**
 * ENGLISH dictionary.
 *
 * Typed as `Dictionary` (derived from `fr.ts`): TypeScript guarantees that
 * every key present in French also exists here. A missing translation is a
 * build error, not a runtime surprise.
 */
export const en: Dictionary = {
  meta: {
    title: "Paul Emile PECKOUET-BINOMBO — Full Stack Developer",
    description:
      "Portfolio of Paul Emile PECKOUET-BINOMBO, full stack developer. Modern, fast and scalable web and mobile applications: React, Next.js, Angular, Node.js, PostgreSQL.",
  },

  nav: {
    home: "Home",
    services: "Services",
    projects: "Projects",
    expertise: "Expertise",
    process: "Process",
    contact: "Contact",
    cta: "Let's talk",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },

  hero: {
    firstName: "Paul Emile",
    lastName: "PECKOUET-BINOMBO",
    roleStrong: "Full Stack Developer",
    roleAmp: "&",
    roleAccent: "Architect",
    roleRest: "of web applications",
    description:
      "I build modern, secure and scalable web and mobile solutions. I support companies, entrepreneurs and individuals from the first idea to production.",
    ctaWork: "View my work",
    ctaCv: "My CV",
    stats: {
      experience: "Years of experience",
      projects: "Projects",
    },
    photoAlt: "Portrait of Paul Emile PECKOUET-BINOMBO",
  },

  work: {
    eyebrow: "Featured projects",
    title: "Selected work",
    viewAll: "View all projects",
    viewMore: "View more",
    viewLess: "Show less",
    visitSite: "Visit website",
    noLiveSite: "Not publicly available",
    stack: "Tech stack",
    frontend: "Frontend",
    backend: "Backend",
    database: "Database",
    none: "None",
    filterAll: "All",
    filterWeb: "Web",
    filterMobile: "Mobile",
    filterPrefix: "Filter",
    filterLabel: "Filter projects",
    empty: "No project in this category yet.",
    gallery: "Gallery",
    openImage: "Enlarge image",
    closeImage: "Close image",
    imageAlt: "Project preview",
    previous: "Previous",
    next: "Next",
  },

  services: {
    eyebrow: "Services",
    title: "What I do",
    items: [
      {
        title: "Web applications",
        description:
          "Tailor-made business platforms: back-office, dashboards, role and access management.",
      },
      {
        title: "REST APIs & Backend",
        description:
          "Documented and secured APIs. JWT authentication, OAuth 2.0, error handling.",
      },
      {
        title: "Showcase & e-commerce sites",
        description:
          "Fast, responsive and SEO-optimised websites, designed to turn visitors into customers.",
      },
      {
        title: "Mobile applications",
        description:
          "Mobile apps shipped to iOS and Android, connected to your existing services.",
      },
      {
        title: "Database & data modelling",
        description:
          "Normalised relational schemas, versioned migrations and optimised queries with Prisma.",
      },
      {
        title: "Deployment & maintenance",
        description:
          "Go-live and continuous improvement of your application.",
      },
    ],
    viewMore: "View more",
    viewLess: "View less",
  },

  testimonials: {
    regionLabel: "Client testimonials",
    previous: "Previous testimonial",
    next: "Next testimonial",
    goTo: "Go to testimonial",
  },

  expertise: {
    eyebrow: "Tools & skills",
    title: "My expertise",
    subtitle:
      "The technologies I work with every day, from the frontend to deployment.",
    viewMore: "View more",
    viewLess: "View less",
  },

  process: {
    eyebrow: "My method",
    title: "A simple, effective process",
    steps: [
      {
        title: "Discovery",
        description: "Understanding your goals, your users and your constraints.",
      },
      {
        title: "Design",
        description: "Technical architecture, data model and screen wireframes.",
      },
      {
        title: "Development",
        description: "Clean, tested code, delivered in iterations you validate.",
      },
      {
        title: "Testing",
        description: "Functional testing, bug fixing and performance tuning.",
      },
      {
        title: "Launch",
        description: "Deployment, training on the tool and long-term support.",
      },
    ],
  },

  contact: {
    eyebrow: "Let's work together",
    title: "Have a project in mind?",
    description:
      "Available for freelance missions and collaborations. Let's talk about your project and build something solid.",
    emailLabel: "Email",
    phoneLabel: "Phone",
    locationLabel: "Location",
    locationValue: "Dakar, Senegal",
    workModeLabel: "Working mode",
    workModeValue: "Remote or on site",
    cta: "Start the conversation",
    whatsappMessage:
      "Hello Paul Emile, I saw your portfolio and I'd like to discuss a project.",
  },

  footer: {
    tagline:
      "I build web and mobile applications that inspire trust and stand the test of time.",
    quickLinks: "Navigation",
    followMe: "Follow me",
    availability: "Available for new projects",
    rights: "All rights reserved.",
    backToTop: "Back to top",
  },

  a11y: {
    switchToDark: "Switch to dark mode",
    switchToLight: "Switch to light mode",
    switchLanguage: "Change language",
  },
};
