import { useEffect, useRef } from "react";

interface ParallaxOptions {
  /**
   * Intensité du décalage.
   * 0    = l'élément suit exactement la page (aucun effet) ;
   * 0.1  = discret ;
   * 0.3  = très marqué.
   * Une valeur NÉGATIVE inverse le sens : l'élément semble alors défiler plus
   * vite que la page, ce qui le fait paraître au premier plan.
   */
  speed: number;
  /** Décalage maximal en pixels, pour éviter qu'un élément ne sorte du cadre. */
  max?: number;
}

/**
 * Effet de parallaxe : l'élément se décale verticalement en fonction de la
 * position de la page, ce qui crée une impression de profondeur.
 *
 * ── Pourquoi écrire directement dans `style.transform` ? ────────────────────
 * Passer par un état React déclencherait un rendu complet du composant à chaque
 * image affichée - soit 60 rendus par seconde pendant tout le défilement. Ici
 * on modifie une seule propriété CSS sur un nœud du DOM : React n'est pas
 * sollicité, et le navigateur n'a qu'une composition à refaire.
 *
 * ── Pourquoi `translate3d` et pas `top` ? ──────────────────────────────────
 * `top` déclenche un recalcul de mise en page (layout) puis un repeint de la
 * zone. `translate3d` est traité par le compositeur, sur le processeur
 * graphique : aucune mise en page n'est recalculée, le défilement reste fluide.
 *
 * ── Le piège de la mesure ──────────────────────────────────────────────────
 * `getBoundingClientRect()` renvoie la position APRÈS transformation. Mesurer
 * l'élément une fois déplacé reviendrait à réinjecter le décalage dans son
 * propre calcul : la valeur dériverait à chaque image jusqu'à faire sortir
 * l'élément de l'écran. On mémorise donc une position de référence, prise une
 * seule fois transformation désactivée, et recalculée uniquement quand la mise
 * en page change (redimensionnement, image chargée).
 *
 * L'effet est désactivé si le système demande de réduire les animations
 * (réglage d'accessibilité « Réduire les animations »), qui existe notamment
 * pour les personnes sujettes au mal des transports ou aux migraines.
 */
export function useParallax<T extends HTMLElement | SVGElement = HTMLDivElement>({
  speed,
  max = 160,
}: ParallaxOptions) {
  const ref = useRef<T | null>(null);
  /** Centre de l'élément dans le document, hors transformation. */
  const baseRef = useRef(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let frame = 0;

    /** Relève la position de référence, transformation neutralisée. */
    const measure = () => {
      const previous = element.style.transform;
      element.style.transform = "none";

      const rect = element.getBoundingClientRect();
      baseRef.current = rect.top + window.scrollY + rect.height / 2;

      element.style.transform = previous;
    };

    const update = () => {
      // Écart entre le centre de la fenêtre et le centre de l'élément.
      // Positif = on a dépassé l'élément en descendant.
      const viewportCenter = window.scrollY + window.innerHeight / 2;
      const delta = viewportCenter - baseRef.current;

      const offset = Math.max(-max, Math.min(max, delta * speed));
      element.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    /* Prévient le navigateur qu'il devra animer cette propriété : il peut
       promouvoir l'élément sur sa propre couche graphique dès maintenant,
       plutôt qu'au premier défilement (ce qui provoquerait un à-coup). */
    element.style.willChange = "transform";

    measure();
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    /* Les images se chargent après le premier rendu et changent la hauteur du
       bloc : sans nouvelle mesure, la référence resterait fausse. */
    const observer = new ResizeObserver(onResize);
    observer.observe(element);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      element.style.transform = "";
      element.style.willChange = "";
    };
  }, [speed, max]);

  return ref;
}
