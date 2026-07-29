import { useCallback, useEffect, useRef, useState } from "react";

/** Délai sans nouvel événement de défilement à partir duquel on considère
 *  que le défilement fluide déclenché par un clic est terminé. */
const SCROLL_SETTLE_MS = 140;

/** Garde-fou : si aucun défilement ne se produit (section déjà à l'écran),
 *  on déverrouille quand même au bout de ce délai. */
const SCROLL_MAX_MS = 1200;

/**
 * Gère à la fois la NAVIGATION vers une section et la DÉTECTION de la section
 * actuellement affichée. Les deux sont indissociables : c'est pourquoi ils
 * vivent dans le même hook plutôt que dans deux hooks qui se marcheraient
 * dessus.
 *
 * ── Détection au défilement manuel ──────────────────────────────────────────
 * On lit directement la position de chaque section plutôt que d'utiliser un
 * IntersectionObserver. Un observer ne réagit qu'au franchissement d'un seuil :
 * avec des sections de hauteurs très inégales, certaines ne le franchissent
 * jamais et leur lien ne s'allume pas. La lecture de position donne toujours
 * une réponse — on retient la DERNIÈRE section dont le haut est passé au-dessus
 * d'une ligne de référence située au tiers de l'écran.
 *
 * ── Navigation au clic ──────────────────────────────────────────────────────
 * Le lien cliqué s'active IMMÉDIATEMENT, puis la détection automatique est
 * gelée le temps du défilement fluide. Sans ce verrou, deux défauts
 * apparaissent :
 *   1. le surlignage saute de section en section pendant le trajet ;
 *   2. si la section visée est courte, ou déjà partiellement visible, la
 *      détection la « corrige » aussitôt et le lien cliqué ne reste pas actif.
 * Le verrou se lève dès que le défilement s'arrête.
 *
 * @param sectionIds identifiants des sections, dans l'ordre du document
 */
export function useSectionNavigation<T extends string>(sectionIds: readonly T[]) {
  const [activeSection, setActiveSection] = useState<T>(sectionIds[0]);

  /* `useRef` et non `useState` : modifier ces valeurs ne doit JAMAIS déclencher
     un nouveau rendu, et elles doivent être lues à jour depuis les écouteurs
     d'événements (une variable d'état y serait figée à sa valeur du rendu). */
  const isLockedRef = useRef(false);
  const settleTimerRef = useRef(0);
  const releaseTimerRef = useRef(0);

  const unlock = useCallback(() => {
    isLockedRef.current = false;
    window.clearTimeout(settleTimerRef.current);
    window.clearTimeout(releaseTimerRef.current);
  }, []);

  /** Fait défiler jusqu'à la section et active son lien sans attendre. */
  const goToSection = useCallback(
    (id: T) => {
      const element = document.getElementById(id);
      if (!element) return;

      setActiveSection(id);
      isLockedRef.current = true;

      element.scrollIntoView({ behavior: "smooth", block: "start" });

      window.clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = window.setTimeout(unlock, SCROLL_MAX_MS);
    },
    [unlock]
  );

  useEffect(() => {
    /* `requestAnimationFrame` limite le calcul à une fois par image affichée :
       l'événement `scroll` peut se déclencher plus souvent que le navigateur ne
       redessine, et on ferait alors du travail pour rien. */
    let frame = 0;

    const compute = () => {
      if (isLockedRef.current) return;

      /* Ligne de référence : une horizontale imaginaire placée au tiers de
         l'écran, sous la barre de navigation. Une section devient « courante »
         dès que son bord haut passe au-dessus de cette ligne.

         ⚠ `getBoundingClientRect().top` est déjà relatif à la FENÊTRE, pas au
         document. Il se compare donc directement à `line`, sans y ajouter
         `window.scrollY`. Additionner le défilement reviendrait à comparer une
         position absolue dans le document à une distance mesurée dans la
         fenêtre : seule la toute première section satisferait la condition, et
         le lien « Accueil » resterait actif sur toute la page. */
      const line = 80 + window.innerHeight / 3;

      // Bas de page atteint : la dernière section est forcément celle affichée,
      // même si elle est trop courte pour croiser la ligne de référence.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      if (atBottom) {
        setActiveSection(sectionIds[sectionIds.length - 1]);
        return;
      }

      let current = sectionIds[0];

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (!element) continue;

        if (element.getBoundingClientRect().top <= line) current = id;
      }

      setActiveSection(current);
    };

    const onScroll = () => {
      // Pendant un défilement piloté par un clic, chaque événement repousse le
      // moment du déverrouillage : il ne survient qu'une fois la page immobile.
      if (isLockedRef.current) {
        window.clearTimeout(settleTimerRef.current);
        settleTimerRef.current = window.setTimeout(unlock, SCROLL_SETTLE_MS);
        return;
      }

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settleTimerRef.current);
      window.clearTimeout(releaseTimerRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sectionIds, unlock]);

  return { activeSection, goToSection };
}
