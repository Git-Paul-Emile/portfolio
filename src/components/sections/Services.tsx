import { useState } from "react";
import {
  MonitorSmartphone,
  Network,
  Globe,
  Smartphone,
  Database,
  Rocket,
  ChevronDown,
  ChevronUp,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

/**
 * Icônes des services, dans le MÊME ORDRE que `t.services.items`.
 *
 * Pourquoi séparer icônes et textes ? Les textes vivent dans les dictionnaires
 * de traduction (fr.ts / en.ts), qui doivent rester purement textuels — on n'y
 * met pas de composants React. Le lien se fait par l'index du tableau.
 */
const SERVICE_ICONS: LucideIcon[] = [
  MonitorSmartphone, // Applications web
  Network, // API REST & Backend
  Globe, // Sites vitrines & e-commerce
  Smartphone, // Applications mobiles
  Database, // Base de données
  Rocket, // Déploiement & maintenance
];

/**
 * Sur mobile, la grille passe à une seule colonne : les 6 cartes forment une
 * longue colonne avant d'atteindre la section suivante. On n'en montre que 3,
 * le reste étant masqué derrière « Voir plus » — même repli que la section
 * « Mon expertise ». À partir de `sm`, la grille passe à 2-3 colonnes et tout
 * tient dans l'écran : le repli ne s'applique donc qu'en dessous de ce point
 * de rupture.
 */
const MOBILE_ITEMS_COLLAPSED = 3;

export function Services() {
  const { t } = useLanguage();
  const [showAll, setShowAll] = useState(false);

  const hasOverflow = t.services.items.length > MOBILE_ITEMS_COLLAPSED;

  return (
    <section id="services" className="scroll-mt-24 py-14">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow">{t.services.eyebrow}</p>
          <h2 className="section-title mt-1.5">{t.services.title}</h2>
        </Reveal>

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map((service, index) => {
            const Icon = SERVICE_ICONS[index] ?? MonitorSmartphone;
            const collapsedOnMobile = !showAll && index >= MOBILE_ITEMS_COLLAPSED;

            return (
              <Reveal
                key={service.title}
                delay={Math.min(index, 4) * 60}
                className={cn("h-full", collapsedOnMobile ? "hidden sm:block" : "block")}
              >
                {/* Disposition horizontale : pastille ronde à gauche, texte à
                    droite — c'est la composition exacte de la maquette. */}
                <article className="group relative flex h-full items-start gap-4 overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                  <span className="icon-circle">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>

                  <div className="min-w-0">
                    <h3 className="text-[15px] font-bold leading-snug">{service.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                  </div>

                  {/* Barre d'accent violette en bas de carte : discrète au repos,
                      elle s'étire au survol. */}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-1/2 h-[3px] w-10 -translate-x-1/2 rounded-full bg-primary transition-all duration-300 group-hover:w-24"
                  />
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Uniquement sur mobile : à partir de `sm`, la grille tient déjà
            entièrement sur l'écran et ce bouton n'a plus lieu d'être. */}
        {hasOverflow && (
          <div className="mt-6 flex justify-center sm:hidden">
            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="link-action"
            >
              {showAll ? t.services.viewLess : t.services.viewMore}
              {showAll ? (
                <ChevronUp className="h-3.5 w-3.5" strokeWidth={2.5} />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" strokeWidth={2.5} />
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
