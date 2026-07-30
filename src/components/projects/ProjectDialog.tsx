import { ArrowUpRight } from "lucide-react";
import type { Project, ProjectStack } from "@/data/projects";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectGallery } from "./ProjectGallery";

interface ProjectDialogProps {
  /** `null` ferme la fenêtre. Le composant est donc entièrement piloté par le parent. */
  project: Project | null;
  onClose: () => void;
}

/** Une ligne de la fiche technique (Frontend / Backend / Base de données). */
function StackRow({
  label,
  items,
  emptyLabel,
}: {
  label: string;
  items: string[] | null;
  emptyLabel: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      {items && items.length > 0 ? (
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {items.map((item) => (
            <li
              key={item}
              className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1.5 text-xs italic text-muted-foreground">{emptyLabel}</p>
      )}
    </div>
  );
}

/**
 * Fiche détaillée d'un projet : description longue, stack par couche,
 * liens vers les versions en ligne et galerie de captures.
 *
 * Composant « contrôlé » : il ne gère aucun état d'ouverture lui-même, il
 * reçoit `project` et `onClose`. Un seul endroit décide de ce qui est affiché
 * (la section Work), ce qui évite les états désynchronisés.
 */
export function ProjectDialog({ project, onClose }: ProjectDialogProps) {
  const { locale, t } = useLanguage();

  if (!project) return null;

  const stack: ProjectStack = project.stack;

  return (
    <Dialog open={project !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-2xl">
        <DialogHeader className="text-left">
          <p className="eyebrow">{project.category[locale]}</p>
          <DialogTitle className="text-2xl font-bold tracking-tight">{project.name}</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            {project.description[locale]}
          </DialogDescription>
        </DialogHeader>

        {/* --- Liens en ligne --- */}
        {project.links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary-soft px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.11em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {link.label}
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              </a>
            ))}
          </div>
        )}

        {/* --- Fiche technique --- */}
        <section className="space-y-4 rounded-xl border border-border bg-muted/40 p-4">
          <h4 className="text-sm font-bold">{t.work.stack}</h4>
          <StackRow label={t.work.frontend} items={stack.frontend} emptyLabel={t.work.none} />
          <StackRow label={t.work.backend} items={stack.backend} emptyLabel={t.work.none} />
          <StackRow label={t.work.database} items={stack.database} emptyLabel={t.work.none} />
        </section>

        {/* --- Galerie de captures --- */}
        <ProjectGallery screenshots={project.screenshots} projectName={project.name} />
      </DialogContent>
    </Dialog>
  );
}
