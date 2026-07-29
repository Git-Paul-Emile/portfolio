import { useEffect, useRef, useState } from "react";

interface UseRevealOptions {
  /** Fraction de l'élément qui doit être visible pour déclencher (0 → 1). */
  threshold?: number;
  /** Marge autour de la zone de détection, ex. "0px 0px -80px 0px". */
  rootMargin?: string;
  /** Si vrai, l'animation ne se joue qu'une seule fois (comportement par défaut). */
  once?: boolean;
}

/**
 * Anime l'apparition d'un élément lorsqu'il entre dans le viewport.
 *
 * Pourquoi IntersectionObserver et pas un écouteur `scroll` ?
 * Un écouteur `scroll` se déclenche des dizaines de fois par seconde et force
 * le navigateur à recalculer la position des éléments (reflow) : c'est coûteux.
 * IntersectionObserver délègue ce travail au navigateur, qui ne rappelle notre
 * code QUE lorsque la visibilité change réellement. Coût quasi nul.
 *
 * Utilisation :
 *   const { ref, isVisible } = useReveal();
 *   <div ref={ref} className={cn("reveal", isVisible && "is-visible")} />
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = "0px 0px -60px 0px",
  once = true,
}: UseRevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Repli pour les très vieux navigateurs : on affiche tout de suite.
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    // Nettoyage : indispensable pour éviter une fuite mémoire au démontage.
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}
