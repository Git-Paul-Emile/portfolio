import { Linkedin, Github, MessageCircle, Mail } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Logo } from "@/components/Logo";
import { PROFILE, mailtoHref, whatsappHref } from "@/data/profile";

/** Identifiants des sections, alignés sur ceux du DOM (voir Navigation.tsx). */
const FOOTER_SECTIONS = ["work", "services", "expertise", "process", "contact"] as const;

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const links: { id: (typeof FOOTER_SECTIONS)[number]; label: string }[] = [
    { id: "work", label: t.nav.projects },
    { id: "services", label: t.nav.services },
    { id: "expertise", label: t.nav.expertise },
    { id: "process", label: t.nav.process },
    { id: "contact", label: t.nav.contact },
  ];

  const socials = [
    { href: PROFILE.linkedinUrl, label: "LinkedIn", Icon: Linkedin, external: true },
    { href: PROFILE.githubUrl, label: "GitHub", Icon: Github, external: true },
    {
      href: whatsappHref(t.contact.whatsappMessage),
      label: "WhatsApp",
      Icon: MessageCircle,
      external: true,
    },
    { href: mailtoHref, label: "Email", Icon: Mail, external: false },
  ];

  return (
    <footer className="border-t border-border">
      <div className="container-page py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          {/* --- Identité --- */}
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
              {t.footer.tagline}
            </p>

            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              {t.footer.availability}
            </p>
          </div>

          {/* --- Navigation --- */}
          <nav aria-label={t.footer.quickLinks}>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              {t.footer.quickLinks}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {links.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-[13px] text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* --- Réseaux --- */}
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              {t.footer.followMe}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {socials.map(({ href, label, Icon, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="inline-flex items-center gap-2.5 text-[13px] text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Icon className="h-[15px] w-[15px] text-primary" strokeWidth={1.7} />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* --- Mention légale, centrée --- */}
        <p className="mt-10 border-t border-border pt-6 text-center text-[12px] text-muted-foreground">
          © {year} {PROFILE.firstName} {PROFILE.lastName}. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
