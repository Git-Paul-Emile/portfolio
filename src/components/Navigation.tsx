import { useEffect, useMemo, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSectionNavigation } from "@/hooks/useSectionNavigation";
import { Logo } from "@/components/Logo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { whatsappHref } from "@/data/profile";
import { cn } from "@/lib/utils";

/** Identifiants des sections cibles. Doivent correspondre aux `id` du DOM. */
const SECTION_IDS = ["home", "work", "services", "expertise", "process", "contact"] as const;
type SectionId = (typeof SECTION_IDS)[number];

export function Navigation() {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /* Défilement vers une section + surlignage du lien correspondant.
     Toute la logique vit dans un hook dédié : ce composant ne fait que le rendu. */
  const { activeSection, goToSection } = useSectionNavigation(SECTION_IDS);

  /** Libellés traduits, recalculés uniquement quand la langue change. */
  const links = useMemo(
    () =>
      [
        { id: "home", label: t.nav.home },
        { id: "work", label: t.nav.projects },
        { id: "services", label: t.nav.services },
        { id: "expertise", label: t.nav.expertise },
        { id: "process", label: t.nav.process },
        { id: "contact", label: t.nav.contact },
      ] as { id: SectionId; label: string }[],
    [t]
  );

  /* --- Fond opaque dès que la page défile ---------------------------------- */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* --- Verrouille le défilement de la page quand le menu mobile est ouvert - */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const goTo = (id: SectionId) => {
    setIsMenuOpen(false);

    /* Le menu mobile fige le défilement du <body>. `setIsMenuOpen` étant
       asynchrone, l'effet qui lève ce verrou ne s'exécutera qu'après le
       prochain rendu - trop tard : `scrollIntoView` serait ignoré. On libère
       donc le verrou tout de suite, de façon synchrone. */
    document.body.style.overflow = "";

    goToSection(id);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled ? "glass border-b border-border" : "bg-transparent"
      )}
    >
      <nav className="container-page flex h-[4.5rem] items-center justify-between gap-4">
        <button type="button" onClick={() => goTo("home")} aria-label="Paul Emile PECKOUET-BINOMBO">
          <Logo />
        </button>

        {/* --- Liens (desktop) --- */}
        <ul className="hidden items-center gap-0.5 xl:flex">
          {links.map((link) => (
            <li key={link.id}>
              <button
                type="button"
                onClick={() => goTo(link.id)}
                data-active={activeSection === link.id}
                className="nav-link"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* --- Actions --- */}
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />

          <a
            href={whatsappHref(t.contact.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost hidden md:inline-flex"
          >
            {t.nav.cta}
            <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
          </a>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground xl:hidden"
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* --- Menu mobile --- */}
      {isMenuOpen && (
        <div className="glass border-t border-border xl:hidden">
          <ul className="container-page flex flex-col py-3">
            {links.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => goTo(link.id)}
                  className={cn(
                    "w-full rounded-lg px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.11em] transition-colors",
                    activeSection === link.id
                      ? "bg-primary-soft text-primary"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </button>
              </li>
            ))}
            <li className="pt-2">
              <a
                href={whatsappHref(t.contact.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-solid w-full"
              >
                {t.nav.cta}
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
