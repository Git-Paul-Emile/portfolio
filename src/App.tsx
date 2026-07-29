import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { LanguageProvider } from "@/hooks/useLanguage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/**
 * Racine de l'application.
 *
 * Ordre des fournisseurs de contexte, du plus général au plus spécifique :
 *   Query → Thème → Langue → UI.
 * `LanguageProvider` est placé au-dessus de tout ce qui affiche du texte, car
 * la quasi-totalité des composants en dépend (y compris les toasts).
 *
 * `defaultTheme="light"` : la charte de référence est claire ; le mode sombre
 * reste accessible via le bouton de la barre de navigation.
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="portfolio-theme">
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* Toute nouvelle route doit être déclarée AVANT le "*" ci-dessous. */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
