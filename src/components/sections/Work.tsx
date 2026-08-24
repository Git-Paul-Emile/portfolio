import { useMemo, useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp, SearchX } from "lucide-react";
import {
  PROJECTS,
  FEATURED_PROJECTS,
  filterProjects,
  type Project,
  type ProjectFilter,
} from "@/data/projects";
import { useLanguage } from "@/hooks/useLanguage";
import { Reveal } from "@/components/Reveal";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectDialog } from "@/components/projects/ProjectDialog";
import { ProjectFilters } from "@/components/projects/ProjectFilters";

/** `id` de la grille : cité par `aria-controls` sur les onglets de filtre. */
const GRID_ID = "work-grid";

/**
 * Section « Réalisations ».
 *
 * Trois états locaux, chacun avec une responsabilité unique :
 *  - `filter`   : Tous / Web / Mobile ;
 *  - `showAll`  : n'affiche que les projets mis en avant, ou la liste complète ;
 *  - `selected` : quel projet est ouvert dans la fiche détaillée (`null` = aucun).
 *
 * L'état est gardé ICI plutôt que dans les cartes : une seule fiche peut être
 * ouverte à la fois, donc une seule source de vérité.
 */
export function Work() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);

  /**
   * Liste affichée = (projets mis en avant OU tous) puis filtre Web/Mobile.
   *
   * L'ordre des deux opérations compte : filtrer APRÈS avoir choisi la source
   * garantit que « Voir tous les projets » reste cohérent quel que soit
   * l'onglet actif. `useMemo` évite de refaire le calcul à chaque rendu (par
   * exemple à l'ouverture d'une fiche projet, qui ne change pas la liste).
   */
  const visibleProjects = useMemo(
    () => filterProjects(showAll ? PROJECTS : FEATURED_PROJECTS, filter),
    [filter, showAll]
  );

  /**
   * Le repli à trois projets ne concerne que l'onglet « Tous ».
   * Sur « Web » ou « Mobile », l'utilisateur a explicitement demandé une
   * catégorie : lui en cacher une partie n'aurait aucun sens.
   */
  const hasMore = filter === "all" && PROJECTS.length > FEATURED_PROJECTS.length;

  const handleFilterChange = (value: ProjectFilter) => {
    setFilter(value);
    /* Onglet Web ou Mobile → tout afficher.
       Retour sur Tous → on revient à la sélection de trois projets. */
    setShowAll(value !== "all");
  };

  return (
    <section id="work" className="scroll-mt-24 pb-14 pt-12 sm:pt-16">
      <div className="container-page">
        {/* --- En-tête --- */}
        <Reveal className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">{t.work.eyebrow}</p>
            <h2 className="section-title mt-1.5">{t.work.title}</h2>
          </div>

          {/* Sur mobile, ce bouton d'en-tête cède la place à la version
              « Voir plus », centrée en bas de grille (voir plus bas) - la
              même disposition que la section « Mon expertise ». */}
          {hasMore && (
            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="link-action hidden sm:inline-flex"
            >
              {showAll ? t.work.viewLess : t.work.viewAll}
              {showAll ? (
                <ChevronUp className="h-3.5 w-3.5" strokeWidth={2.5} />
              ) : (
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              )}
            </button>
          )}
        </Reveal>

        {/* --- Filtres Tous / Web / Mobile --- */}
        <Reveal className="mt-6">
          <ProjectFilters value={filter} onChange={handleFilterChange} panelId={GRID_ID} />
        </Reveal>

        {/* --- Grille ---
            `key={filter}` force React à remonter la grille à chaque changement
            d'onglet. Sans cette clé, il réutiliserait les cartes existantes et
            les animations d'apparition ne rejoueraient pas : le changement de
            filtre passerait inaperçu. */}
        <div id={GRID_ID} role="tabpanel" aria-live="polite">
          {visibleProjects.length > 0 ? (
            <div key={filter} className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProjects.map((project, index) => (
                /* Le délai en cascade est plafonné : au-delà de ~240 ms,
                   l'utilisateur a l'impression que la page « rame ». */
                <Reveal key={project.id} delay={Math.min(index, 4) * 60} className="h-full">
                  <ProjectCard project={project} onOpen={setSelected} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-7 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border p-10 text-center">
              <SearchX className="h-6 w-6 text-muted-foreground/60" strokeWidth={1.5} />
              <p className="text-sm text-muted-foreground">{t.work.empty}</p>
            </div>
          )}
        </div>

        {/* Uniquement sur mobile : au-delà de `sm`, le bouton d'en-tête
            suffit déjà. */}
        {hasMore && (
          <div className="mt-6 flex justify-center sm:hidden">
            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="link-action"
            >
              {showAll ? t.work.viewLess : t.work.viewMore}
              {showAll ? (
                <ChevronUp className="h-3.5 w-3.5" strokeWidth={2.5} />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" strokeWidth={2.5} />
              )}
            </button>
          </div>
        )}
      </div>

      <ProjectDialog project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
