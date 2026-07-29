import type { Project } from "@/data/projects";
import { assetUrl } from "@/lib/assets";
import { cn } from "@/lib/utils";

/**
 * Transforme une chaîne en un entier stable (algorithme djb2 simplifié).
 *
 * Pourquoi une fonction de hachage plutôt que `Math.random()` ? Il faut que la
 * couleur d'un projet soit TOUJOURS la même, à chaque rendu et à chaque visite.
 * Une valeur aléatoire changerait à chaque re-render et donnerait un effet de
 * clignotement. Le hachage est déterministe : même entrée, même sortie.
 */
function hashToHue(value: string): number {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  // On borne le résultat sur la plage violet → bleu → rose de la charte.
  return 235 + (Math.abs(hash) % 70);
}

/** Initiales du projet, utilisées comme motif sur la couverture générée. */
function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

interface ProjectCoverProps {
  project: Project;
  className?: string;
}

/**
 * Visuel de couverture d'un projet.
 *
 * Deux cas, un seul composant (le reste du code n'a pas à savoir lequel
 * s'applique — c'est le principe d'encapsulation) :
 *  1. le projet a une capture d'écran → on l'affiche ;
 *  2. le projet n'en a pas (site en ligne uniquement) → on génère une
 *     couverture dégradée portant les initiales du projet.
 */
export function ProjectCover({ project, className }: ProjectCoverProps) {
  if (project.cover) {
    return (
      <img
        src={assetUrl(project.cover)}
        alt={project.name}
        loading="lazy"
        decoding="async"
        className={cn(
          "h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]",
          className
        )}
      />
    );
  }

  const hue = hashToHue(project.id);

  return (
    <div
      className={cn("relative flex h-full w-full items-center justify-center", className)}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 80% 62%), hsl(${hue + 28} 78% 70%))`,
      }}
    >
      {/* Trame de points, pour éviter un aplat de couleur trop plat. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />
      <span className="relative text-5xl font-extrabold tracking-tight text-white/90 drop-shadow-sm">
        {initialsOf(project.name)}
      </span>
    </div>
  );
}
