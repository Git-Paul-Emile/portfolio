import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { assetUrl } from "@/lib/assets";

interface ProjectGalleryProps {
  /** Chemins des captures, relatifs à /public. */
  screenshots: string[];
  /** Nom du projet, utilisé dans les textes alternatifs. */
  projectName: string;
}

/**
 * Galerie de captures d'écran : grille de vignettes cliquables, puis
 * visionneuse plein écran (« lightbox ») avec navigation clavier.
 *
 * Pourquoi une grille et non un carrousel ? Le carrousel ne montre qu'une image
 * à la fois : le visiteur ne sait pas combien il en reste ni ce qu'il rate, et
 * doit cliquer autant de fois qu'il y a d'écrans. La grille donne une vue
 * d'ensemble immédiate, et la visionneuse reste disponible pour le détail.
 *
 * Les vignettes utilisent `loading="lazy"` : les images ne sont téléchargées
 * qu'au moment où elles approchent de la zone visible. Sur un projet à vingt
 * captures, cela évite plusieurs mégaoctets inutiles à l'ouverture de la fiche.
 */
export function ProjectGallery({ screenshots, projectName }: ProjectGalleryProps) {
  const { t } = useLanguage();
  /** Index de l'image affichée en plein écran, `null` si la visionneuse est fermée. */
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const total = screenshots.length;
  const isOpen = lightboxIndex !== null;

  const close = useCallback(() => setLightboxIndex(null), []);
  const goNext = useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i + 1) % total)),
    [total]
  );
  const goPrev = useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i - 1 + total) % total)),
    [total]
  );

  /* --- Verrouille le défilement de la page pendant la visionneuse --------- */
  useEffect(() => {
    if (!isOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  /* --- Navigation au clavier ------------------------------------------------
     Échap ferme, les flèches font défiler. C'est ce qu'attend tout utilisateur
     habitué à une visionneuse d'images ; sans cela, la seule sortie serait la
     souris, ce qui exclut la navigation au clavier.                          */
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close, goNext, goPrev]);

  if (total === 0) return null;

  return (
    <section>
      <h4 className="mb-3 text-sm font-bold">
        {t.work.gallery}
        <span className="ml-2 font-normal text-muted-foreground">({total})</span>
      </h4>

      {/* --- Grille de vignettes --- */}
      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {screenshots.map((src, index) => (
          <li key={src}>
            <button
              type="button"
              onClick={() => setLightboxIndex(index)}
              aria-label={`${t.work.openImage} ${index + 1}`}
              className="group relative block aspect-[16/10] w-full overflow-hidden rounded-lg border border-border bg-muted"
            >
              <img
                src={assetUrl(src)}
                alt={`${projectName} - ${t.work.imageAlt} ${index + 1}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all duration-300 group-hover:bg-foreground/40 group-hover:opacity-100">
                <Maximize2 className="h-5 w-5 text-white" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* --- Visionneuse plein écran ---
          Rendue dans un PORTAIL vers <body>, et non à sa place dans l'arbre.
          Raison technique : la fenêtre de dialogue parente applique une
          transformation CSS (`translate`). Or un élément `position: fixed`
          placé dans un ancêtre transformé se positionne par rapport à CET
          ancêtre, et non par rapport à la fenêtre du navigateur - la
          visionneuse serait décalée et rognée par le défilement de la fiche.
          Le portail sort l'élément de ce contexte et rétablit le plein écran.

          `pointer-events-auto` n'est PAS décoratif, c'est ce qui rend les
          flèches cliquables. Explication : tant que la fiche projet (Radix
          Dialog) est ouverte, Radix pose `pointer-events: none` sur <body>
          pour neutraliser tout ce qui se trouve derrière la fenêtre, et ne
          réactive les clics que sur son propre contenu. Or la visionneuse est
          portalisée vers <body> : elle héritait donc de ce `none` et ne
          recevait plus aucun clic - ni les chevrons, ni la croix, ni le fond.
          On rétablit explicitement les événements de pointeur sur ce calque,
          qui est de toute façon au-dessus de tout (`z-[200]`). */}
      {isOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${projectName} - ${t.work.gallery}`}
            onClick={close}
            className="pointer-events-auto fixed inset-0 z-[200] flex items-center justify-center bg-foreground/90 p-4 backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={close}
              aria-label={t.work.closeImage}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    goPrev();
                  }}
                  aria-label={t.work.previous}
                  className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    goNext();
                  }}
                  aria-label={t.work.next}
                  className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* `stopPropagation` : un clic SUR l'image ne doit pas fermer la
                visionneuse - seul un clic sur le fond la ferme. */}
            <img
              src={assetUrl(screenshots[lightboxIndex])}
              alt={`${projectName} - ${t.work.imageAlt} ${lightboxIndex + 1}`}
              onClick={(event) => event.stopPropagation()}
              className="max-h-[86vh] max-w-full rounded-lg object-contain shadow-2xl"
            />

            <span className="absolute bottom-5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
              {lightboxIndex + 1} / {total}
            </span>
          </div>,
          document.body
        )}
    </section>
  );
}
