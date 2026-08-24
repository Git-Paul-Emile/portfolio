import { useLanguage } from "@/hooks/useLanguage";
import { useStepTimeline } from "@/hooks/useStepTimeline";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

/**
 * Section « Ma méthode » : les 5 étapes reliées par une ligne pointillée,
 * chacune introduite par un numéro dans une pastille - la composition de la
 * maquette. Une forme violette unique voyage automatiquement de la pastille 1
 * à la pastille 5 dès que la section entre dans le viewport (voir
 * useStepTimeline) : le défilement ne fait que déclencher ce voyage, il ne le
 * pilote pas.
 *
 * Les numéros (01, 02, …) sont dérivés de l'index avec `padStart(2, "0")` :
 * ajouter une étape dans les dictionnaires suffit, la numérotation suit.
 */
export function Process() {
  const { t } = useLanguage();
  const steps = t.process.steps;

  const { sectionRef, trackRef, registerBadge, activeIndex, blobStyle } =
    useStepTimeline<HTMLElement, HTMLOListElement, HTMLSpanElement>(steps.length);

  return (
    <section ref={sectionRef} id="process" className="scroll-mt-24 py-14">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow">{t.process.eyebrow}</p>
          <h2 className="section-title mt-1.5">{t.process.title}</h2>
        </Reveal>

        <ol ref={trackRef} className="relative mt-9 grid gap-8 md:grid-cols-5 md:gap-5">
          {/* La forme voyageuse : un seul élément, repositionné/étiré par
              transform + width/height. Elle vit sous les pastilles (z-0) et
              ne touche jamais au texte, qui reste au premier plan. */}
          {blobStyle && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 z-0 rounded-full bg-primary shadow-soft transition-[transform,width,height] motion-reduce:hidden"
              style={blobStyle}
            />
          )}

          {steps.map((step, index) => {
            // Tant que la forme n'a pas encore été positionnée (mesure
            // différée le temps que l'entrée Reveal de l'étape 1 se termine),
            // aucune pastille ne doit paraître « active » sans son fond.
            const isActive = index === activeIndex && Boolean(blobStyle);

            return (
              <Reveal as="li" key={step.title} delay={index * 80} className="relative">
                <div className="flex items-center gap-2">
                  <span
                    ref={registerBadge(index)}
                    className={cn(
                      "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-colors duration-300",
                      isActive
                        ? "text-primary-foreground"
                        : "border border-border bg-card text-muted-foreground"
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Trait pointillé vers l'étape suivante, masqué sur la
                      dernière et en dessous de `md` (colonnes empilées). */}
                  {index < steps.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="hidden flex-1 items-center gap-1.5 md:flex"
                    >
                      <span className="h-1 w-1 rounded-full bg-primary/50" />
                      <span className="h-px flex-1 border-t border-dashed border-border" />
                      <span className="h-1 w-1 rounded-full bg-primary/50" />
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-sm font-bold">{step.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground md:pr-5">
                  {step.description}
                </p>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
