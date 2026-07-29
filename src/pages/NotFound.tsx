import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

/** Textes de la page 404, gardés ici car ils ne servent qu'à cet écran. */
const MESSAGES = {
  fr: {
    title: "Page introuvable",
    text: "L'adresse demandée n'existe pas ou a été déplacée.",
    back: "Retour à l'accueil",
  },
  en: {
    title: "Page not found",
    text: "The requested address does not exist or has been moved.",
    back: "Back to home",
  },
} as const;

export default function NotFound() {
  const location = useLocation();
  const { locale } = useLanguage();
  const message = MESSAGES[locale];

  useEffect(() => {
    console.error("Erreur 404 — route inexistante :", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-7xl font-extrabold tracking-tight text-gradient">404</p>
      <h1 className="mt-4 text-2xl font-bold">{message.title}</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{message.text}</p>

      <Link to="/" className="btn-primary-gradient mt-8">
        <ArrowLeft className="h-4 w-4" />
        {message.back}
      </Link>
    </main>
  );
}
