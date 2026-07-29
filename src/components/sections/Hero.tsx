import { Download, Clock3, LayoutGrid, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useParallax } from "@/hooks/useParallax";
import { useCountUp } from "@/hooks/useCountUp";
import { PROFILE } from "@/data/profile";
import { assetUrl } from "@/lib/assets";
import { cn } from "@/lib/utils";

/**
 * Cercles concentriques au trait fin, derrière le portrait.
 *
 * Deux niveaux de <div> imbriqués, et c'est volontaire : le conteneur externe
 * porte le centrage (`-translate-x-1/2 -translate-y-1/2`), l'interne reçoit la
 * parallaxe. Appliquer les deux au même élément est impossible — le hook écrit
 * dans `style.transform`, qui écrase les classes de centrage de Tailwind et
 * enverrait les cercles dans le coin inférieur droit.
 */
function BackdropRings() {
  /* Les cercles sont l'arrière-plan : ils se décalent le PLUS. Un élément qui
     prend du retard sur le défilement paraît plus loin de l'observateur. */
  const ref = useParallax<HTMLDivElement>({ speed: 0.16, max: 120 });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[128%] -translate-x-1/2 -translate-y-1/2"
    >
      <div ref={ref} className="absolute inset-0">
        <div className="absolute inset-0 rounded-full border border-primary/12" />
        <div className="absolute inset-[9%] rounded-full border border-primary/16" />
        <div className="absolute inset-[19%] rounded-full border border-primary/12" />
        <div className="absolute inset-[29%] rounded-full border border-dashed border-primary/12" />
        <div className="absolute inset-[36%] rounded-full bg-primary/5 blur-3xl" />
      </div>
    </div>
  );
}

/**
 * Petit drapeau du Gabon (SVG, trois bandes horizontales), affiché à côté du
 * nom de famille dans le hero. Une image plutôt qu'un émoji 🇬🇦 : le rendu des
 * émojis de drapeau est incohérent selon l'OS (Windows, en particulier,
 * n'affiche pas toujours l'image et retombe sur les lettres du pays).
 */
function GabonFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 30 20"
      role="img"
      aria-label="Drapeau du Gabon"
      className={cn("animate-flag-wave h-[0.85em] w-auto shrink-0 rounded-[1px] shadow-sm", className)}
    >
      <rect width="30" height="20" fill="#009E60" />
      <rect y="6.67" width="30" height="6.67" fill="#FCD116" />
      <rect y="13.33" width="30" height="6.67" fill="#3A75C4" />
    </svg>
  );
}

/**
 * Une statistique : cercle à filet fin + chiffre + libellé en majuscules.
 * Le chiffre part de 0 et compte jusqu'à sa valeur exacte dès que le hero
 * entre dans le champ de vision (voir useCountUp).
 */
function Stat({
  icon: Icon,
  target,
  suffix = "",
  label,
}: {
  icon: LucideIcon;
  target: number;
  suffix?: string;
  label: string;
}) {
  const { ref, value } = useCountUp<HTMLDivElement>(target);

  return (
    <div ref={ref} className="flex items-center gap-3 px-5 first:pl-0 last:pr-0">
      <span className="icon-ring">
        <Icon className="h-4 w-4" strokeWidth={1.6} />
      </span>
      <span>
        <span className="block text-lg font-extrabold leading-none text-foreground">
          {value}
          {suffix}
        </span>
        <span className="mt-1 block whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </span>
      </span>
    </div>
  );
}

/**
 * Section d'ouverture : texte à gauche, portrait détouré à droite posé sur des
 * cercles concentriques.
 *
 * ── Profondeur par parallaxe ────────────────────────────────────────────────
 * Trois plans se décalent à des vitesses différentes au défilement :
 *   halo 0.28  >  cercles 0.16  >  portrait 0.05
 * Plus la valeur est élevée, plus l'élément prend de retard sur la page, et
 * plus il paraît lointain. Le portrait bouge à peine : il reste le sujet net,
 * au premier plan.
 *
 * ── Hauteur bornée à un écran ───────────────────────────────────────────────
 * L'unité utilisée est `svh` (« small viewport height ») et non `vh`.
 * Sur mobile, `100vh` correspond à la hauteur de l'écran BARRES D'INTERFACE
 * MASQUÉES : tant que la barre d'adresse est visible, un bloc en `100vh`
 * dépasse et provoque un défilement parasite. `100svh` prend la hauteur la plus
 * petite — celle avec les barres affichées — donc le hero tient toujours dans
 * l'écran. Un plancher de 560 px évite l'écrasement en paysage sur téléphone.
 *
 * Les deux chiffres proviennent de `PROFILE` (src/data/profile.ts) : ce sont
 * des valeurs métier, pas des compteurs déduits du tableau de projets.
 */
export function Hero() {
  const { t } = useLanguage();

  const haloRef = useParallax<HTMLDivElement>({ speed: 0.28, max: 180 });
  const portraitRef = useParallax<HTMLDivElement>({ speed: 0.05, max: 50 });
  const textRef = useParallax<HTMLDivElement>({ speed: 0.09, max: 90 });

  const stats = [
    { icon: Clock3, target: PROFILE.yearsOfExperience, label: t.hero.stats.experience },
    { icon: LayoutGrid, target: PROFILE.projectsDelivered, label: t.hero.stats.projects },
  ];

  const scrollToWork = () => {
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="home"
      className="relative flex h-[100svh] min-h-[560px] items-center overflow-hidden pt-[4.5rem]"
    >
      {/* Lavis teal diffus, purement décoratif — le plan le plus lointain.
          Dilué à 40 % en clair ; redescendu à 20 % en sombre, où la même
          opacité virerait à la tache trop saturée sur un fond quasi noir. */}
      <div
        ref={haloRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-secondary/40 to-background dark:from-secondary/20"
      />

      <div className="container-page relative w-full">
        <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-[1fr_0.88fr] lg:gap-6">
          {/* ============================ Colonne texte ======================= */}
          <div ref={textRef} className="order-2 lg:order-1">
            <h1 className="text-[2rem] font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {t.hero.firstName}
              <span className="mt-1.5 flex items-center gap-2 text-base font-bold uppercase tracking-[0.12em] text-muted-foreground sm:text-lg lg:text-xl">
                {t.hero.lastName}
                <GabonFlag />
              </span>
            </h1>

            {/* Deux lignes de rôle : la seconde met l'accent en teal. */}
            <p className="mt-3 text-lg font-medium leading-snug text-foreground/80 sm:mt-4 sm:text-2xl lg:text-[1.6rem]">
              {t.hero.roleStrong} <span className="text-muted-foreground">{t.hero.roleAmp}</span>
              <span className="block">
                <span className="font-semibold text-primary">{t.hero.roleAccent}</span>{" "}
                <span className="text-foreground/80">{t.hero.roleRest}</span>
              </span>
            </p>

            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-[15px]">
              {t.hero.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-7">
              <button type="button" onClick={scrollToWork} className="btn-solid">
                {t.hero.ctaWork}
              </button>

              <a
                href={assetUrl(PROFILE.cvPath)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                {t.hero.ctaCv}
                <Download className="h-3.5 w-3.5" strokeWidth={2.5} />
              </a>
            </div>

            {/* --- Statistiques : toujours sur une seule ligne (`flex-nowrap`),
                    séparées par un filet vertical. --- */}
            <dl className="mt-6 flex flex-nowrap items-center divide-x divide-border sm:mt-8">
              {stats.map((stat) => (
                <Stat
                  key={stat.label}
                  icon={stat.icon}
                  target={stat.target}
                  suffix="+"
                  label={stat.label}
                />
              ))}
            </dl>
          </div>

          {/* ============================ Colonne visuelle ====================
              Le conteneur épouse la largeur du portrait : les cercles se
              positionnent ainsi PAR RAPPORT À LA PHOTO, et non par rapport à
              la colonne de la grille.

              Le bas de l'image se fond dans le fond sur environ un tiers de sa
              hauteur : on l'agrandit d'autant pour que le visage garde la même
              présence à l'écran qu'avec une photo à bord franc. */}
          <div className="relative order-1 mx-auto w-full max-w-[17rem] sm:max-w-[21rem] lg:order-2 lg:max-w-[28rem]">
            <BackdropRings />

            <div ref={portraitRef}>
              {/* Portrait détouré : aucun cadre, aucune ombre — la personne se
                  détache directement sur les cercles.

                  <picture> sert un WebP (70 Ko) aux navigateurs qui le gèrent, et
                  retombe sur le PNG (548 Ko) pour les autres. Le navigateur ne
                  télécharge QU'UN seul des deux fichiers. */}
              <picture>
                <source srcSet={assetUrl("/hero.webp")} type="image/webp" />
                <img
                  src={assetUrl("/hero.png")}
                  alt={t.hero.photoAlt}
                  width={795}
                  height={800}
                  loading="eager"
                  /* `fetchPriority="high"` demande au navigateur de charger cette
                     image avant les autres : c'est l'élément le plus visible de
                     la page, celui qui détermine le ressenti de rapidité. */
                  fetchPriority="high"
                  className="relative mx-auto block max-h-[30svh] w-auto select-none object-contain sm:max-h-[36svh] lg:max-h-[calc(100svh-11rem)] lg:w-full"
                />
              </picture>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
