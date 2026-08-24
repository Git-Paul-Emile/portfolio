import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface BlobState {
  rect: Rect;
  durationMs: number;
  easing: string;
}

/* Durées de chaque phase du voyage entre deux étapes. */
const STRETCH_MS = 550; // la forme s'étire de l'étape courante vers la suivante
const SETTLE_MS = 450; // elle se rétracte sur la nouvelle étape, avec un léger rebond
const HOLD_MS = 750; // pause sur l'étape active avant de repartir
const FIRST_TRAVEL_DELAY_MS = 500; // pause supplémentaire une fois positionnée sur l'étape 1, avant de partir

/**
 * Délai entre l'apparition de la section et la toute première mesure de
 * position. La pastille de l'étape 1 est enveloppée par `Reveal`, qui la fait
 * glisser depuis 24px plus bas pendant 700ms (`.reveal` dans index.css). Si on
 * mesure sa position trop tôt, on capture cette position de DÉPART (encore
 * décalée vers le bas) et la forme reste figée là, visiblement en dessous de
 * la pastille une fois l'entrée terminée. On attend donc que cette animation
 * d'entrée soit certainement terminée avant de positionner la forme.
 */
const REVEAL_SETTLE_MS = 760;

/**
 * Anime une forme unique (« liquide ») qui voyage d'une étape à l'autre d'un
 * parcours en N points, une seule fois par chargement de page.
 *
 * ── Pourquoi ne pas piloter ça au scroll ? ──────────────────────────────────
 * Le cahier des charges est explicite : le défilement ne fait que DÉCLENCHER
 * l'animation (via IntersectionObserver, comme `useReveal`) ; une fois lancée,
 * elle se joue en autonomie, étape après étape, avec `setTimeout`, sans jamais
 * relire la position de scroll. `hasStarted` (un ref, pas un state) garantit
 * que le déclenchement n'a lieu qu'une fois : même si la section ressort puis
 * revient dans le viewport, l'observateur est déjà déconnecté.
 *
 * ── Pourquoi mesurer le DOM plutôt que calculer des positions ? ─────────────
 * Les étapes peuvent être disposées en ligne (bureau) ou empilées (mobile).
 * Plutôt que dupliquer la logique par breakpoint, on mesure la position RÉELLE
 * de chaque pastille (`getBoundingClientRect`) relative au conteneur, et on
 * construit le rectangle englobant les deux pastilles concernées pour la
 * phase d'étirement. Cette approche géométrique fonctionne à l'identique,
 * que le parcours soit horizontal ou vertical.
 */
export function useStepTimeline<
  Section extends HTMLElement = HTMLElement,
  Track extends HTMLElement = HTMLElement,
  Badge extends HTMLElement = HTMLElement
>(stepCount: number) {
  const sectionRef = useRef<Section | null>(null);
  const trackRef = useRef<Track | null>(null);
  const badgeRefs = useRef<(Badge | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [blob, setBlob] = useState<BlobState | null>(null);

  const hasStarted = useRef(false);
  const hasMeasuredOnce = useRef(false);
  const activeIndexRef = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const registerBadge = useCallback(
    (index: number) => (el: Badge | null) => {
      badgeRefs.current[index] = el;
    },
    []
  );

  const measureRect = useCallback((index: number): Rect | null => {
    const track = trackRef.current;
    const badge = badgeRefs.current[index];
    if (!track || !badge) return null;

    const trackBox = track.getBoundingClientRect();
    const badgeBox = badge.getBoundingClientRect();

    return {
      left: badgeBox.left - trackBox.left,
      top: badgeBox.top - trackBox.top,
      width: badgeBox.width,
      height: badgeBox.height,
    };
  }, []);

  /** Repositionne la forme sur l'étape active, sans transition (redimensionnement). */
  const snapTo = useCallback(
    (index: number) => {
      const rect = measureRect(index);
      if (rect) {
        hasMeasuredOnce.current = true;
        setBlob({ rect, durationMs: 0, easing: "linear" });
      }
    },
    [measureRect]
  );

  // Recalage au redimensionnement de la fenêtre - seulement si une première
  // mesure a déjà eu lieu (sinon rien à corriger, la section n'est pas encore visible).
  useEffect(() => {
    const onResize = () => {
      if (hasMeasuredOnce.current) snapTo(activeIndexRef.current);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [snapTo]);

  // Déclenchement unique du voyage complet, au moment où la section devient visible.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const travelTo = (from: number) => {
      if (from >= stepCount - 1) return; // étape 5 atteinte : terminé, définitivement

      const fromRect = measureRect(from);
      const toRect = measureRect(from + 1);
      if (!fromRect || !toRect) return;

      // Sur mobile, les étapes sont empilées verticalement (grille 1 colonne) :
      // entre deux pastilles se trouve tout le texte (titre + description) de
      // l'étape en cours. Un rectangle englobant les deux pastilles, comme en
      // ligne, formerait un long pavé qui recouvrirait ce texte pendant toute
      // la phase d'étirement. On détecte donc l'orientation réelle (mesurée,
      // pas déduite d'un breakpoint) : même `top` ≈ côte à côte (bureau),
      // sinon empilé (mobile/tablette étroite).
      const sameRow = Math.abs(fromRect.top - toRect.top) < 4;

      if (!sameRow) {
        // Empilé : la forme garde la taille d'une pastille et se déplace
        // directement vers la suivante (léger rebond élastique à l'arrivée),
        // au lieu de s'étirer sur toute la hauteur du texte intermédiaire.
        setBlob({
          rect: toRect,
          durationMs: STRETCH_MS + SETTLE_MS,
          easing: "cubic-bezier(0.34, 1.45, 0.64, 1)",
        });
        setActiveIndex(from + 1);

        const nextTimer = window.setTimeout(
          () => travelTo(from + 1),
          STRETCH_MS + SETTLE_MS + HOLD_MS
        );
        timers.current.push(nextTimer);
        return;
      }

      // Rectangle englobant les deux pastilles : la forme s'étire pour les couvrir toutes les deux.
      const left = Math.min(fromRect.left, toRect.left);
      const top = Math.min(fromRect.top, toRect.top);
      const stretched: Rect = {
        left,
        top,
        width: Math.max(fromRect.left + fromRect.width, toRect.left + toRect.width) - left,
        height: Math.max(fromRect.top + fromRect.height, toRect.top + toRect.height) - top,
      };

      setBlob({ rect: stretched, durationMs: STRETCH_MS, easing: "cubic-bezier(0.65, 0, 0.35, 1)" });

      const settleTimer = window.setTimeout(() => {
        // Rétraction sur la nouvelle étape, avec un léger dépassement élastique.
        setBlob({ rect: toRect, durationMs: SETTLE_MS, easing: "cubic-bezier(0.34, 1.65, 0.64, 1)" });
        setActiveIndex(from + 1);

        const nextTimer = window.setTimeout(() => travelTo(from + 1), SETTLE_MS + HOLD_MS);
        timers.current.push(nextTimer);
      }, STRETCH_MS);
      timers.current.push(settleTimer);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasStarted.current) return;
        hasStarted.current = true;
        observer.disconnect();

        // On attend d'abord que l'entrée de la pastille 1 (Reveal) soit
        // terminée avant de la mesurer et d'y poser la forme.
        const snapTimer = window.setTimeout(() => {
          snapTo(0);

          if (prefersReducedMotion) return; // reste posée sur l'étape 1, sans voyage automatique

          const startTimer = window.setTimeout(() => travelTo(0), FIRST_TRAVEL_DELAY_MS);
          timers.current.push(startTimer);
        }, REVEAL_SETTLE_MS);
        timers.current.push(snapTimer);
      },
      { threshold: 0.35 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
  }, [stepCount, measureRect, snapTo]);

  const blobStyle: CSSProperties | undefined = blob
    ? {
        transform: `translate(${blob.rect.left}px, ${blob.rect.top}px)`,
        width: blob.rect.width,
        height: blob.rect.height,
        transitionDuration: `${blob.durationMs}ms`,
        transitionTimingFunction: blob.easing,
      }
    : undefined;

  return { sectionRef, trackRef, registerBadge, activeIndex, blobStyle };
}
