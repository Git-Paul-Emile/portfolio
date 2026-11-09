import { Download } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useParallax } from "@/hooks/useParallax";
import { useCountUp } from "@/hooks/useCountUp";
import { PROFILE } from "@/data/profile";
import { PROJECTS } from "@/data/projects";
import { assetUrl } from "@/lib/assets";
import { cn } from "@/lib/utils";

/**
 * Cercles concentriques au trait fin, derrière le portrait.
 *
 * Deux niveaux de <div> imbriqués, et c'est volontaire : le conteneur externe
 * porte le centrage (`-translate-x-1/2 -translate-y-1/2`), l'interne reçoit la
 * parallaxe. Appliquer les deux au même élément est impossible - le hook écrit
 * dans `style.transform`, qui écrase les classes de centrage de Tailwind et
 * enverrait les cercles dans le coin inférieur droit.
 */
function BackdropRings() {
  /* Les cercles sont l'arrière-plan : ils se décalent le PLUS. Un élément qui
     prend du retard sur le défilement paraît plus loin de l'observateur.

     Masqués sous `lg` : sur mobile le portrait est un plan large (pieds au
     sol) posé à côté du texte, pas un buste centré - les anneaux concentriques
     n'ont plus de sujet à encadrer et cassent la composition. */
  const ref = useParallax<HTMLDivElement>({ speed: 0.16, max: 120 });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 -z-10 hidden aspect-square w-[128%] -translate-x-1/2 -translate-y-1/2 lg:block"
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
 * Une statistique : chiffre + libellé en majuscules, sans pictogramme.
 * Le chiffre part de 0 et compte jusqu'à sa valeur exacte dès que le hero
 * entre dans le champ de vision (voir useCountUp).
 */
function Stat({ target, suffix = "", label }: { target: number; suffix?: string; label: string }) {
  const { ref, value } = useCountUp<HTMLDivElement>(target);

  return (
    <div ref={ref} className="min-w-0 px-2.5 first:pl-0 last:pr-0 sm:px-5">
      <span className="block text-sm font-extrabold leading-none text-foreground sm:text-lg">
        {value}
        {suffix}
      </span>
      {/* `whitespace-nowrap` à toutes les tailles : le libellé doit tenir sur
          une seule ligne, y compris « Années d'expérience » qui est le plus
          long. C'est ce qui fixe le corps de 9 px en mobile. */}
      <span className="mt-1 block whitespace-nowrap text-[9px] font-semibold uppercase leading-tight tracking-[0.06em] text-muted-foreground sm:text-[9px] sm:tracking-[0.12em]">
        {label}
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
 * petite - celle avec les barres affichées - donc le hero tient toujours dans
 * l'écran. Un plancher de 560 px évite l'écrasement en paysage sur téléphone.
 *
 * Le compteur d'expérience affiche « 2+ » ; le nombre de projets provient
 * directement du catalogue et affiche « + » à partir de 15.
 */
export function Hero() {
  const { t } = useLanguage();
  const haloRef = useParallax<HTMLDivElement>({ speed: 0.28, max: 180 });
  const portraitRef = useParallax<HTMLDivElement>({ speed: 0.05, max: 50 });
  const textRef = useParallax<HTMLDivElement>({ speed: 0.09, max: 90 });

  const stats = [
    { target: 2, suffix: "+", label: t.hero.stats.experience },
    {
      target: PROJECTS.length,
      suffix: PROJECTS.length >= 15 ? "+" : "",
      label: t.hero.stats.projects,
    },
  ];

  const scrollToWork = () => {
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="home"
      className="relative h-[100svh] min-h-[560px] overflow-hidden pt-16 sm:pt-[4.5rem] lg:flex lg:items-center"
    >
      {/* Lavis teal diffus, purement décoratif - le plan le plus lointain.
          Dilué à 40 % en clair ; redescendu à 20 % en sombre, où la même
          opacité virerait à la tache trop saturée sur un fond quasi noir. */}
      <div
        ref={haloRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-secondary/40 to-background dark:from-secondary/20"
      />

      <div className="container-page relative h-full w-full lg:h-auto">
        {/* ── Deux mises en page, un seul balisage ───────────────────────────
            Sous `lg` : le portrait est sorti du flux (`absolute inset-y-0`) et
            occupe donc TOUTE la hauteur utile du hero - du bas de la barre de
            navigation jusqu'au bas de l'écran, pieds posés sur le bord. Le
            texte, lui, reste dans le flux, centré verticalement, et se limite
            en largeur (`w-[57%]`) pour laisser la place au personnage.

            À partir de `lg` : retour à une vraie grille deux colonnes, le
            portrait redevient un élément de flux (`lg:relative`). */}
        {/* `items-start` sous `lg` : le texte n'est plus centré verticalement,
            il démarre haut. À partir de `lg`, la grille reprend son centrage. */}
        <div className="relative flex h-full items-start lg:grid lg:h-auto lg:grid-cols-[1fr_0.88fr] lg:items-center lg:gap-6">
          {/* ============================ Colonne texte =======================
              57 % : c'est la largeur qui reste à gauche une fois le personnage
              posé à droite. Les corps de texte ci-dessous sont calés dessus
              pour que chaque ligne tienne d'un seul tenant. */}
          {/* `mt-[13svh]` cale le haut du texte sur la ligne des ÉPAULES du
              portrait. Le personnage occupe toute la hauteur utile du hero et
              ses épaules commencent à environ 15 % de sa propre hauteur
              (mesuré sur le canal alpha du PNG) : une marge exprimée en `svh`
              suit donc ce repère sur n'importe quel téléphone, alors qu'une
              valeur en pixels se décalerait dès que l'écran change de hauteur.
              `lg:mt-0` : sur ordinateur, la grille recentre tout. */}
          <div ref={textRef} className="relative z-10 mt-[13svh] w-[55%] min-w-0 lg:mt-0 lg:w-auto">
            {/* Tailles mobiles calées sur les 57 % de largeur disponibles : à
                ces corps, « PECKOUET-BINOMBO » et chacune des deux lignes de
                rôle tiennent sur UNE ligne. Monter d'un cran suffirait à les
                couper en deux. */}
            <h1 className="text-[1.5rem] font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {t.hero.firstName}
              <span className="mt-1.5 flex items-center gap-1.5 whitespace-nowrap text-[0.68rem] font-bold uppercase tracking-[0.07em] text-muted-foreground sm:gap-2 sm:text-lg sm:tracking-[0.12em] lg:text-xl">
                {t.hero.lastName}
                <GabonFlag />
              </span>
            </h1>

            {/* Deux lignes de rôle : la seconde met l'accent en teal. */}
            {/* Corps fluide sous `sm` : `clamp(min, 3.1vw, max)`. La ligne la
                plus longue (« Architecte d'applications web ») fait environ
                15 caractères de large en em ; à 3,1 % de la largeur d'écran
                elle reste toujours sous les 57 % de conteneur qui lui sont
                réservés, du iPhone SE (320 px) au grand format (430 px). Un
                corps fixe casserait la ligne en deux sur les petits écrans. */}
            <p className="mt-3 text-[clamp(0.63rem,3.1vw,0.9rem)] font-medium leading-snug text-foreground/80 sm:mt-4 sm:text-[1.35rem] lg:text-[1.6rem]">
              {t.hero.roleStrong} <span className="text-muted-foreground">{t.hero.roleAmp}</span>
              <span className="block">
                <span className="font-semibold text-primary">{t.hero.roleAccent}</span>{" "}
                <span className="text-foreground/80">{t.hero.roleRest}</span>
              </span>
            </p>

            <p className="mt-3 max-w-lg text-[0.72rem] leading-relaxed text-muted-foreground sm:mt-4 sm:text-[15px]">
              {t.hero.description}
            </p>

            {/* `w-[112%]` : boutons et statistiques débordent volontairement de
                la colonne de texte. À leur hauteur, le personnage n'est plus
                qu'une paire de jambes - sa silhouette laisse environ 19 % de
                marge libre à gauche de son cadre (mesuré sur le canal alpha du
                PNG), là où le torse et les bras n'en laissent que 6 %. Ces
                deux lignes peuvent donc s'étendre sans jamais chevaucher le
                dessin, ce qui permet de garder les deux boutons côte à côte.

                `px-3`/`text-[9px]` sous `sm` : les utilitaires Tailwind sont
                dans une couche prioritaire sur `.btn-solid`/`.btn-outline`
                (@layer components), ils écrasent donc leur `px-6`/`text-[11px]`
                sans `!important`. */}
            <div className="mt-5 flex w-[112%] flex-wrap items-center gap-1.5 sm:mt-7 sm:w-auto sm:gap-3">
              <button
                type="button"
                onClick={scrollToWork}
                className="btn-solid px-2.5 py-3 text-[0.53rem] tracking-[0.05em] sm:px-6 sm:py-3.5 sm:text-[11px] sm:tracking-[0.11em]"
              >
                {t.hero.ctaWork}
              </button>

              <a
                href={assetUrl(PROFILE.cvPath)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline gap-1.5 px-2.5 py-3 text-[0.53rem] tracking-[0.05em] sm:gap-2 sm:px-6 sm:py-3.5 sm:text-[11px] sm:tracking-[0.11em]"
              >
                {t.hero.ctaCv}
                <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.5} />
              </a>
            </div>

            {/* --- Statistiques : toujours sur une seule ligne (`flex-nowrap`),
                    séparées par un filet vertical. --- */}
            <dl className="mt-6 flex w-[112%] flex-nowrap items-center divide-x divide-border sm:mt-8 sm:w-auto">
              {stats.map((stat) => (
                <Stat key={stat.label} target={stat.target} suffix={stat.suffix} label={stat.label} />
              ))}
            </dl>
          </div>

          {/* ============================ Colonne visuelle ====================
              Sous `lg` : boîte hors flux qui occupe toute la hauteur utile du
              hero (`inset-y-0`, soit 100svh moins la barre de navigation) et
              déborde jusqu'au bord physique de l'écran (`-right-5` annule le
              `px-5` de `.container-page`, `-right-8` le `sm:px-8`).

              `object-contain` + `object-[right_bottom]` : l'image garde ses
              proportions, se plaque en BAS (les pieds touchent le bas de
              l'écran, aucun espace résiduel) et à DROITE (elle ne flotte pas
              au milieu de sa boîte, ce qui ferait mordre le personnage sur le
              texte).

              Pourquoi une boîte de 62 % alors que le texte n'en cède que 57 % ?
              Parce que la boîte n'est qu'un cadre maximal. Le portrait fait
              203 × 644 px, soit un rapport de 0,315 : sur un téléphone réel
              (≈ 390 × 650 px utiles), la hauteur est la contrainte active, et
              l'image ne dessine en fait que ≈ 0,315 × 580 ≈ 183 px de large.
              Elle remplit donc toute la hauteur SANS atteindre les 62 %, et
              n'empiète jamais sur la colonne de texte. Le cadre large sert
              uniquement de réserve pour les écrans courts (paysage), où
              l'image devient au contraire bornée par la largeur.

              À partir de `lg` : `lg:relative lg:inset-auto` la remet dans le
              flux comme deuxième colonne de la grille.

              Deux photos différentes selon le point de rupture, pas juste deux
              tailles de la même image : sous `lg`, un plan large en pied
              (`hero-mobile`) ; à partir de `lg`, le buste centré (`hero`) sur
              les anneaux. */}
          <div className="absolute inset-y-0 -right-5 w-[54%] sm:-right-8 lg:relative lg:inset-auto lg:right-auto lg:mx-auto lg:h-auto lg:w-full lg:max-w-[28rem]">
            <BackdropRings />

            <div ref={portraitRef} className="relative h-full lg:h-auto">
              {/* Portraits détourés : aucun cadre, aucune ombre - la personne se
                  détache directement sur le fond.

                  Un seul <picture>, mais deux photos selon le point de
                  rupture : les <source media="(min-width: 1024px)"> ne
                  s'appliquent qu'à partir de `lg`, sinon le navigateur retombe
                  sur les <source> suivants puis sur l'<img> - donc UN SEUL des
                  quatre fichiers est réellement téléchargé, jamais les deux
                  photos à la fois. Les classes de l'<img> couvrent les deux
                  mises en page (plan large posé sur le texte sous `lg`, buste
                  centré sur les anneaux à partir de `lg`). */}
              <picture className="block h-full lg:h-auto">
                <source
                  media="(min-width: 1024px)"
                  srcSet={assetUrl("/hero.webp")}
                  type="image/webp"
                />
                <source media="(min-width: 1024px)" srcSet={assetUrl("/hero.png")} />
                <source srcSet={assetUrl("/hero-mobile.webp")} type="image/webp" />
                <img
                  src={assetUrl("/hero-mobile.png")}
                  alt={t.hero.photoAlt}
                  width={203}
                  height={646}
                  loading="eager"
                  /* `fetchpriority="high"` demande au navigateur de charger cette
                     image avant les autres : c'est l'élément le plus visible de
                     la page, celui qui détermine le ressenti de rapidité.

                     Écrit en minuscules et étalé via `{...{}}` : React 18 ne
                     connaît pas encore la forme camelCase `fetchPriority` (elle
                     n'arrive qu'en React 19) et la recrachait telle quelle dans
                     le DOM, avec un avertissement en console à chaque rendu.
                     L'objet étalé contourne le typage JSX tout en produisant
                     l'attribut HTML exact attendu par le navigateur. */
                  {...{ fetchpriority: "high" }}
                  className="relative block h-full w-full select-none object-contain object-[right_bottom] lg:mx-auto lg:h-auto lg:max-h-[calc(100svh-11rem)] lg:w-auto lg:object-center"
                />
              </picture>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
