import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  LOCALES,
  getDictionary,
  type Dictionary,
  type Locale,
} from "@/i18n";

const STORAGE_KEY = "portfolio-locale";

/**
 * Ce que le contexte expose aux composants.
 * `t` est le dictionnaire déjà résolu : on écrit `t.nav.home`, pas `t("nav.home")`.
 * Avantage : l'autocomplétion et la vérification de type fonctionnent sur chaque clé.
 */
interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

/** Garde de type : vérifie qu'une chaîne inconnue est bien une langue supportée. */
function isLocale(value: string | null): value is Locale {
  return value !== null && (LOCALES as readonly string[]).includes(value);
}

/**
 * Détermine la langue initiale, par ordre de priorité :
 *   1. le choix déjà enregistré par l'utilisateur (localStorage) ;
 *   2. la langue du navigateur, si elle fait partie des langues supportées ;
 *   3. le français (DEFAULT_LOCALE).
 *
 * Exécuté en initialisation paresseuse du useState : le calcul n'a lieu
 * qu'au premier rendu, pas à chaque re-render.
 */
function resolveInitialLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (isLocale(stored)) return stored;

  const browser = window.navigator.language.slice(0, 2).toLowerCase();
  if (isLocale(browser)) return browser;

  return DEFAULT_LOCALE;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(resolveInitialLocale);

  /** Persiste le choix et met à jour l'attribut `lang` du <html> (SEO + lecteurs d'écran). */
  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((current) => {
      const next: Locale = current === "fr" ? "en" : "fr";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const t = useMemo(() => getDictionary(locale), [locale]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t.meta.title;

    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", t.meta.description);
  }, [locale, t]);

  /**
   * `useMemo` évite de recréer l'objet de contexte à chaque rendu du provider,
   * ce qui provoquerait un re-render inutile de TOUS les consommateurs.
   */
  const value = useMemo<LanguageContextValue>(
    () => ({ locale, setLocale, toggleLocale, t }),
    [locale, setLocale, toggleLocale, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/**
 * Hook d'accès au contexte de langue.
 * Lève une erreur explicite si utilisé hors du provider — on détecte le bug
 * au développement plutôt que d'obtenir un `undefined` silencieux en production.
 */
export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error("useLanguage doit être utilisé à l'intérieur d'un <LanguageProvider>.");
  }

  return context;
}
