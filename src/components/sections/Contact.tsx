import { Mail, Phone, MapPin, Laptop, ArrowUpRight, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useParallax } from "@/hooks/useParallax";
import { PROFILE, mailtoHref, telHref, whatsappHref } from "@/data/profile";
import { Reveal } from "@/components/Reveal";

/**
 * Avion en papier et sa trajectoire pointillée, dessinés en SVG.
 * Élément purement décoratif repris de la maquette : il occupe le vide à
 * droite de la carte et donne le mouvement « message envoyé ».
 */
function PaperPlane() {
  /* Amplitude volontairement faible et bornée : la carte a `overflow-hidden`,
     un décalage trop ample ferait disparaître l'avion derrière son bord. */
  const ref = useParallax<SVGSVGElement>({ speed: 0.13, max: 34 });

  return (
    <svg
      ref={ref}
      viewBox="0 0 220 140"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute bottom-2 right-3 hidden h-36 w-56 lg:block"
    >
      {/* Trajectoire */}
      <path
        d="M8 118 C 50 138, 108 128, 150 84"
        stroke="hsl(var(--accent))"
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeDasharray="4 5"
        strokeLinecap="round"
      />
      {/* Corps de l'avion : trois facettes de teintes différentes. Seul usage
          du corail sur toute la page — décoratif, jamais cliquable. */}
      <path d="M196 22 L146 96 L142 62 Z" fill="hsl(var(--accent))" fillOpacity="0.95" />
      <path d="M196 22 L142 62 L112 54 Z" fill="hsl(var(--accent))" fillOpacity="0.55" />
      <path d="M196 22 L146 96 L166 100 Z" fill="hsl(var(--accent-foreground))" fillOpacity="0.45" />
    </svg>
  );
}

/**
 * Une ligne de coordonnées : icône au trait fin (sans pastille, comme sur la
 * maquette), libellé en gras au-dessus, valeur en gris en dessous.
 */
function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}) {
  const body = (
    <>
      <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-primary" strokeWidth={1.6} />
      <span className="min-w-0">
        <span className="block text-[13px] font-bold text-foreground">{label}</span>
        <span className="block truncate text-[13px] text-muted-foreground">{value}</span>
      </span>
    </>
  );

  if (!href) return <div className="flex items-start gap-3">{body}</div>;

  return (
    <a href={href} className="flex items-start gap-3 transition-colors hover:text-primary">
      {body}
    </a>
  );
}

/**
 * Bloc d'appel à l'action final.
 *
 * Aucun formulaire : les demandes passent par WhatsApp, l'email ou le
 * téléphone. C'est un choix pragmatique — un formulaire exigerait un backend,
 * un service d'envoi et une protection anti-spam pour un gain nul ici, puisque
 * les canaux directs sont ceux réellement utilisés par les prospects.
 */
export function Contact() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="scroll-mt-24 py-14">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-secondary/50 p-7 sm:p-9">
            <PaperPlane />

            {/* `lg:pr-56` réserve la place de l'avion : sans cette gouttière,
                l'illustration passerait par-dessus les coordonnées. */}
            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_auto_1fr] lg:gap-10 lg:pr-56">
              {/* --- Discours --- */}
              <div>
                <p className="eyebrow">{t.contact.eyebrow}</p>
                <h2 className="section-title mt-1.5">{t.contact.title}</h2>
                <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
                  {t.contact.description}
                </p>

                <a
                  href={whatsappHref(t.contact.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-solid mt-6"
                >
                  {t.contact.cta}
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                </a>
              </div>

              {/* --- Filet séparateur vertical --- */}
              <div aria-hidden="true" className="hidden w-px bg-border lg:block" />

              {/* --- Coordonnées --- */}
              <div className="space-y-5">
                <ContactRow
                  icon={Mail}
                  label={t.contact.emailLabel}
                  value={PROFILE.email}
                  href={mailtoHref}
                />
                <ContactRow
                  icon={Phone}
                  label={t.contact.phoneLabel}
                  value={PROFILE.phoneDisplay}
                  href={telHref}
                />
                <ContactRow
                  icon={MapPin}
                  label={t.contact.locationLabel}
                  value={t.contact.locationValue}
                />
                <ContactRow
                  icon={Laptop}
                  label={t.contact.workModeLabel}
                  value={t.contact.workModeValue}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
