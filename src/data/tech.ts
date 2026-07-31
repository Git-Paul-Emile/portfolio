import type { IconType } from "react-icons";
import {
  SiReact,
  SiNextdotjs,
  SiAngular,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiVite,
  SiNodedotjs,
  SiExpress,
  SiPhp,
  SiLaravel,
  SiPrisma,
  SiN8N,
  SiPostgresql,
  SiMysql,
  SiFirebase,
  SiGit,
  SiExpo,
  SiOpenai,
} from "react-icons/si";

/**
 * Une technologie affichée dans la section « Mon expertise ».
 *
 * `brandColor` est volontairement optionnel : certaines marques ont un logo
 * monochrome noir (Next.js, Express, Prisma). Sur fond sombre elles
 * deviendraient invisibles. Quand la propriété est absente, le composant
 * applique `currentColor`, c'est-à-dire la couleur du texte courante — le logo
 * reste donc lisible dans les deux thèmes.
 */
export interface Tech {
  /** Identifiant stable, utilisé comme clé React. */
  id: string;
  /** Nom affiché sous la tuile. */
  name: string;
  /** Composant d'icône (react-icons). */
  Icon: IconType;
  /** Couleur officielle de la marque, en hexadécimal. */
  brandColor?: string;
}

/**
 * Liste unique des technologies (source de vérité).
 * Ordre d'affichage pensé par affinité : frontend → backend → données → outils.
 */
export const TECHNOLOGIES: Tech[] = [
  // --- Frontend -------------------------------------------------------------
  { id: "react", name: "React", Icon: SiReact, brandColor: "#61DAFB" },
  { id: "nextjs", name: "Next.js", Icon: SiNextdotjs },
  { id: "angular", name: "Angular", Icon: SiAngular, brandColor: "#DD0031" },
  { id: "typescript", name: "TypeScript", Icon: SiTypescript, brandColor: "#3178C6" },
  { id: "javascript", name: "JavaScript", Icon: SiJavascript, brandColor: "#F7DF1E" },
  { id: "tailwind", name: "Tailwind CSS", Icon: SiTailwindcss, brandColor: "#06B6D4" },
  { id: "vite", name: "Vite", Icon: SiVite, brandColor: "#646CFF" },
  { id: "expo", name: "React Native", Icon: SiExpo },

  // --- Backend --------------------------------------------------------------
  { id: "node", name: "Node.js", Icon: SiNodedotjs, brandColor: "#5FA04E" },
  { id: "express", name: "Express", Icon: SiExpress },
  { id: "php", name: "PHP", Icon: SiPhp, brandColor: "#777BB4" },
  { id: "laravel", name: "Laravel", Icon: SiLaravel, brandColor: "#FF2D20" },
  { id: "prisma", name: "Prisma", Icon: SiPrisma },
  { id: "openai", name: "OpenAI", Icon: SiOpenai },

  // --- Automatisation -------------------------------------------------------
  { id: "n8n", name: "n8n", Icon: SiN8N, brandColor: "#EA4B71" },

  // --- Données --------------------------------------------------------------
  { id: "postgresql", name: "PostgreSQL", Icon: SiPostgresql, brandColor: "#4169E1" },
  { id: "mysql", name: "MySQL", Icon: SiMysql, brandColor: "#4479A1" },
  { id: "firebase", name: "Firebase", Icon: SiFirebase, brandColor: "#FFCA28" },

  // --- Outils & déploiement -------------------------------------------------
  { id: "git", name: "Git", Icon: SiGit, brandColor: "#F05032" },
];
