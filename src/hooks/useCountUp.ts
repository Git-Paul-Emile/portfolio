import { useEffect, useRef, useState } from "react";

interface CountUpOptions {
  /** Durée totale du décompte, en millisecondes. */
  duration?: number;
  /** Fraction de l'élément visible requise pour démarrer (0 → 1). */
  threshold?: number;
}

/**
 * Décompte animé : la valeur part de 0 et rejoint sa cible quand l'élément
 * entre dans le champ de vision.
 *
 * ── Pourquoi pas un simple `setInterval` ? ─────────────────────────────────
 * Un intervalle avance d'un pas fixe tous les N millisecondes, sans savoir si
 * le navigateur a eu le temps de dessiner. Si l'onglet passe en arrière-plan ou
 * si la machine peine, les pas s'accumulent et le compteur saccade.
 * `requestAnimationFrame` est synchronisé sur le rafraîchissement de l'écran,
 * et l'on recalcule la valeur à partir du TEMPS ÉCOULÉ, pas du nombre d'appels :
 * l'animation dure exactement le temps prévu quelle que soit la machine.
 *
 * ── L'accélération ─────────────────────────────────────────────────────────
 * La courbe employée est un « ease-out cubique » : rapide au début, puis de
 * plus en plus lente. Un décompte linéaire s'arrête net et paraît mécanique ;
 * celui-ci ralentit en approchant du chiffre final, comme un compteur qui se
 * stabilise.
 *
 * L'animation ne se joue qu'UNE fois : l'observateur se détache dès le
 * démarrage, donc revenir sur la section ne relance rien.
 */
export function useCountUp<T extends HTMLElement = HTMLDivElement>(
  target: number,
  { duration = 1600, threshold = 0.4 }: CountUpOptions = {}
) {
  const ref = useRef<T | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      setValue(target);
      return;
    }

    let frame = 0;
    let startTime = 0;

    const step = (now: number) => {
      if (!startTime) startTime = now;

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // ease-out cubique : 1 − (1 − t)³
      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(Math.round(eased * target));

      if (progress < 1) frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        // Détaché immédiatement : le décompte ne se rejoue jamais.
        observer.disconnect();
        frame = requestAnimationFrame(step);
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [target, duration, threshold]);

  return { ref, value };
}
