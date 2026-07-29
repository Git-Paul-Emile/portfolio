import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TESTIMONIALS } from "@/data/testimonials";
import { useLanguage } from "@/hooks/useLanguage";
import { useParallax } from "@/hooks/useParallax";
import { assetUrl } from "@/lib/assets";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

/** Durée d'affichage d'un témoignage avant passage automatique au suivant. */
const AUTOPLAY_MS = 7000;

/** Initiales d'un nom, affichées quand la personne n'a pas de photo. */
function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

/**
 * Carte de citation pleine largeur, reprise de la maquette :
 * grand guillemet teal à gauche, texte au centre, portrait et identité à
 * droite, points de navigation sous le portrait.
 *
 * Le défilement automatique se met en pause au survol : l'utilisateur qui lit
 * un témoignage ne doit pas le voir disparaître sous ses yeux.
 */
export function Testimonials() {
  const { locale, t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  /** Le guillemet dérive légèrement au défilement : la carte prend du relief. */
  const quoteRef = useParallax<HTMLSpanElement>({ speed: 0.08, max: 26 });

  const total = TESTIMONIALS.length;

  /* `useCallback` : ces fonctions sont utilisées comme dépendances d'un effet.
     Sans mémoïsation, elles seraient recréées à chaque rendu et relanceraient
     le minuteur en boucle. */
  const goNext = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const goPrev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  useEffect(() => {
    if (isPaused || total < 2) return;

    const timer = window.setInterval(goNext, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [goNext, isPaused, total]);

  if (total === 0) return null;

  const current = TESTIMONIALS[index];

  return (
    <div className="container-page pb-4">
      <Reveal>
        <figure
          aria-roledescription="carousel"
          aria-label={t.testimonials.regionLabel}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative grid items-center gap-6 rounded-2xl bg-muted p-6 sm:p-8 lg:grid-cols-[auto_1fr_auto] lg:gap-10"
        >
          {/* --- Guillemet ouvrant, purement décoratif ---
              `leading-[0.7]` colle le glyphe au haut de sa boîte : sans cela,
              une police serif réserve un large espace sous la ligne de base et
              le guillemet paraîtrait décentré vers le haut. */}
          <span
            ref={quoteRef}
            aria-hidden="true"
            className="select-none self-start font-serif text-[7rem] leading-[0.7] text-primary/40 lg:text-[10rem]"
          >
            &ldquo;
          </span>

          {/* --- Texte --- */}
          <blockquote className="text-base leading-relaxed text-foreground/85 sm:text-lg">
            {current.quote[locale]}
          </blockquote>

          {/* --- Auteur --- */}
          <figcaption className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-sm font-bold text-secondary-foreground ring-2 ring-card">
              {current.avatar ? (
                <img
                  src={assetUrl(current.avatar)}
                  alt={current.author}
                  className="h-full w-full object-cover"
                />
              ) : (
                initialsOf(current.author)
              )}
            </span>

            <span className="lg:min-w-[9rem]">
              <span className="block text-sm font-bold text-foreground">{current.author}</span>
              <span className="block text-xs text-muted-foreground">{current.role[locale]}</span>

              {/* --- Points de navigation --- */}
              {total > 1 && (
                <span className="mt-3 flex items-center gap-1.5">
                  {TESTIMONIALS.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`${t.testimonials.goTo} ${i + 1}`}
                      aria-current={i === index}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        i === index ? "w-5 bg-primary" : "w-1.5 bg-border hover:bg-primary/40"
                      )}
                    />
                  ))}
                </span>
              )}
            </span>
          </figcaption>

          {/* --- Flèches --- */}
          {total > 1 && (
            <div className="absolute right-5 top-5 flex gap-1.5">
              <button
                type="button"
                onClick={goPrev}
                aria-label={t.testimonials.previous}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-primary"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label={t.testimonials.next}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-primary"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </figure>
      </Reveal>
    </div>
  );
}
