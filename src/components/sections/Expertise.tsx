import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TECHNOLOGIES, type Tech } from "@/data/tech";
import { useLanguage } from "@/hooks/useLanguage";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

/**
 * Sur mobile, la grille est en 4 colonnes (voir plus bas) : 2 lignes = 8 tuiles.
 * Au-delà, le reste est masqué derrière « Voir plus » pour ne pas faire défiler
 * une longue colonne de logos avant d'atteindre la section suivante.
 * À partir de `sm`, la grille passe à 6+ colonnes et tout tient dans l'écran :
 * le repli ne s'applique donc qu'en dessous de ce point de rupture.
 */
const MOBILE_ROWS_COLLAPSED = 8;

/**
 * Une tuile de la grille : le logo est enfermé dans une petite carte blanche à
 * filet, et le nom de la technologie s'affiche SOUS la carte — c'est la
 * disposition exacte de la maquette.
 *
 * `brandColor` vaut la couleur officielle de la marque quand elle existe, sinon
 * `currentColor` — c'est-à-dire la couleur du texte héritée du parent. Ce repli
 * est indispensable pour les logos monochromes noirs (Next.js, Express,
 * Vercel, Prisma…) qui deviendraient invisibles en mode sombre.
 */
function TechTile({ tech, collapsedOnMobile }: { tech: Tech; collapsedOnMobile: boolean }) {
  const { Icon, name, brandColor } = tech;

  return (
    <li
      className={cn(
        "group flex-col items-center gap-2",
        collapsedOnMobile ? "hidden sm:flex" : "flex"
      )}
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-card transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-card">
        <Icon
          className="h-8 w-8 transition-transform duration-300 group-hover:scale-110"
          style={{ color: brandColor ?? "currentColor" }}
          aria-hidden="true"
        />
      </span>
      <span className="text-center text-[11px] font-medium leading-tight text-muted-foreground">
        {name}
      </span>
    </li>
  );
}

/**
 * Section « Mon expertise » : uniquement les logos des technologies, en grille
 * de tuiles, avec le nom sous chaque logo.
 *
 * La grille est alimentée par `TECHNOLOGIES` (src/data/tech.ts) : ajouter une
 * technologie ne demande AUCUNE modification de ce composant.
 */
export function Expertise() {
  const { t } = useLanguage();
  const [showAll, setShowAll] = useState(false);

  const hasOverflow = TECHNOLOGIES.length > MOBILE_ROWS_COLLAPSED;

  return (
    <section id="expertise" className="scroll-mt-24 py-14">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow">{t.expertise.eyebrow}</p>
          <h2 className="section-title mt-1.5">{t.expertise.title}</h2>
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
            {t.expertise.subtitle}
          </p>
        </Reveal>

        <Reveal>
          <ul className="mt-8 grid grid-cols-4 gap-x-3 gap-y-6 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-9">
            {TECHNOLOGIES.map((tech, index) => (
              <TechTile
                key={tech.id}
                tech={tech}
                collapsedOnMobile={!showAll && index >= MOBILE_ROWS_COLLAPSED}
              />
            ))}
          </ul>

          {/* Uniquement sur mobile : à partir de `sm`, la grille tient déjà
              entièrement sur l'écran et ce bouton n'a plus lieu d'être. */}
          {hasOverflow && (
            <div className="mt-6 flex justify-center sm:hidden">
              <button
                type="button"
                onClick={() => setShowAll((value) => !value)}
                className="link-action"
              >
                {showAll ? t.expertise.viewLess : t.expertise.viewMore}
                {showAll ? (
                  <ChevronUp className="h-3.5 w-3.5" strokeWidth={2.5} />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" strokeWidth={2.5} />
                )}
              </button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
