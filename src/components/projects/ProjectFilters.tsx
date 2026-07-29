import { ChevronDown, Check } from "lucide-react";
import type { ProjectFilter } from "@/data/projects";
import { useLanguage } from "@/hooks/useLanguage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ProjectFiltersProps {
  value: ProjectFilter;
  onChange: (value: ProjectFilter) => void;
  /** `id` de la grille pilotée par ce filtre (liaison pour les lecteurs d'écran). */
  panelId: string;
}

/**
 * Filtre des réalisations, présenté comme un menu déroulant compact.
 *
 * ── Pourquoi un menu et non des onglets ? ───────────────────────────────────
 * Un groupe d'onglets occupe toute la largeur de son contenu et impose trois
 * blocs colorés au visiteur, alors que le filtre n'est qu'un réglage secondaire
 * — le contenu principal, ce sont les projets. Un bouton unique qui affiche la
 * valeur courante (« Filtre : Tous ») dit la même chose en un quart de la
 * place, et laisse la grille respirer.
 *
 * ── Pourquoi ce composant et pas un <select> natif ? ────────────────────────
 * Un `<select>` est rendu par le système d'exploitation : impossible d'aligner
 * son apparence sur le reste du site, et le résultat diffère entre Windows,
 * macOS et Android. Radix reconstruit le menu en HTML tout en conservant le
 * comportement attendu — navigation aux flèches, saisie de la première lettre,
 * Échap pour fermer, fermeture au clic extérieur, piège de focus.
 *
 * Le motif ARIA employé est `menuitemradio` : un seul choix possible à la fois,
 * l'option retenue étant annoncée comme cochée aux lecteurs d'écran.
 */
export function ProjectFilters({ value, onChange, panelId }: ProjectFiltersProps) {
  const { t } = useLanguage();

  const options: { value: ProjectFilter; label: string }[] = [
    { value: "all", label: t.work.filterAll },
    { value: "web", label: t.work.filterWeb },
    { value: "mobile", label: t.work.filterMobile },
  ];

  const current = options.find((option) => option.value === value) ?? options[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t.work.filterLabel}
          aria-controls={panelId}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border border-border bg-card",
            "px-3 py-2 text-[13px] text-foreground shadow-soft",
            "transition-colors duration-200 hover:bg-muted/60",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            // Pivote le chevron quand le menu est ouvert : le bouton indique
            // lui-même son état, sans texte supplémentaire.
            "[&[data-state=open]>svg]:rotate-180"
          )}
        >
          <span className="text-muted-foreground">{t.work.filterPrefix} :</span>
          <span className="font-medium">{current.label}</span>
          <ChevronDown
            className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200"
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-[9rem] rounded-lg p-1">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => onChange(next as ProjectFilter)}
        >
          {options.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              /* Trois retouches sur le style par défaut de shadcn :
                 · `[&>span:first-child]:hidden` masque la pastille ronde qu'il
                   place en absolu à gauche — la coche est ici à droite ;
                 · `pl-2` récupère l'indentation que cette pastille réservait ;
                 · `focus:bg-muted focus:text-foreground` remplace le surlignage
                   violet plein par un gris discret, plus proche d'un menu
                   système. */
              className={cn(
                "cursor-pointer rounded-md py-1.5 pl-2 pr-2 text-[13px]",
                "[&>span:first-child]:hidden",
                "focus:bg-muted focus:text-foreground"
              )}
            >
              <span className="flex-1">{option.label}</span>
              {value === option.value && (
                <Check className="ml-3 h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
              )}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
