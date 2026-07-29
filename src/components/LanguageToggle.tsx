import { LOCALES, LOCALE_META } from "@/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

/**
 * Sélecteur de langue en forme de pilule segmentée : [ FR | EN ].
 *
 * Accessibilité : `role="group"` + `aria-pressed` sur chaque bouton,
 * pour qu'un lecteur d'écran annonce laquelle des deux langues est active.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.a11y.switchLanguage}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border bg-card p-0.5",
        className
      )}
    >
      {LOCALES.map((code) => {
        const meta = LOCALE_META[code];
        const isActive = locale === code;

        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={isActive}
            title={meta.label}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide transition-colors duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {meta.short}
          </button>
        );
      })}
    </div>
  );
}
