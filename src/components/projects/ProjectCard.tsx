import { ExternalLink } from "lucide-react";
import type { Project } from "@/data/projects";
import { useLanguage } from "@/hooks/useLanguage";
import { ProjectCover } from "./ProjectCover";

interface ProjectCardProps {
  project: Project;
  /** Appelé au clic sur la carte : ouvre la fiche détaillée. */
  onOpen: (project: Project) => void;
}

/**
 * Carte projet, calquée sur la maquette :
 * visuel en haut, puis une bande blanche contenant le nom en gras, la catégorie
 * en gris dessous, et à droite une icône « lien externe » qui se teinte au survol.
 *
 * Accessibilité : la carte entière est un <article> et le titre porte un
 * <button> qui couvre toute la surface via `after:absolute inset-0`.
 * On évite ainsi d'imbriquer un lien dans un bouton (HTML invalide) tout en
 * gardant une zone cliquable large et un focus clavier correct.
 */
export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const { locale, t } = useLanguage();

  const primaryLink = project.links[0];

  return (
    <article className="group card-interactive relative flex h-full flex-col overflow-hidden">
      {/* --- Visuel --- */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <ProjectCover project={project} />
      </div>

      {/* --- Pied : nom + catégorie à gauche, lien externe à droite --- */}
      <div className="flex flex-1 items-center justify-between gap-3 border-t border-border p-4">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-bold tracking-tight">
            <button
              type="button"
              onClick={() => onOpen(project)}
              className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {project.name}
            </button>
          </h3>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {project.category[locale]}
          </p>
        </div>

        {primaryLink ? (
          /* z-10 : passe au-dessus du pseudo-élément de la carte pour rester
             cliquable indépendamment de l'ouverture de la fiche. */
          <a
            href={primaryLink.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            aria-label={`${t.work.visitSite} - ${project.name}`}
            className="relative z-10 shrink-0 text-muted-foreground transition-all duration-300 hover:scale-110 hover:text-primary"
          >
            <ExternalLink className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </a>
        ) : (
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            {t.work.noLiveSite}
          </span>
        )}
      </div>
    </article>
  );
}
