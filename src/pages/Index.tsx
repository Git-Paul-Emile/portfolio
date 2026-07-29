import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { Expertise } from "@/components/sections/Expertise";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";

/**
 * Page unique du portfolio.
 *
 * Structure reprise de la maquette : le hero occupe le fond de page lavande,
 * puis TOUT le reste — sections et pied de page — est posé dans une grande
 * carte blanche à coins arrondis (`.page-shell`), ce qui crée l'effet de
 * « feuille » caractéristique du modèle.
 *
 * Ce composant ne contient aucune logique : il ne fait qu'ordonner les
 * sections. Toute la donnée vit dans `src/data`, tout le texte dans `src/i18n`.
 *
 * L'ordre suit une progression volontaire :
 *   qui je suis → ce que j'ai fait → ce que je propose → ce qu'on en dit
 *   → avec quels outils → comment je travaille → comment me joindre.
 */
export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <Hero />

      {/* La coquille est volontairement plus large que le conteneur de contenu
          (max-w-6xl utilisé par les sections) : le décalage crée la marge
          intérieure visible sur la maquette.

          Aucune marge négative ici : le hero occupe exactement un écran et ne
          doit pas être recouvert, sinon sa dernière ligne (les statistiques)
          passerait sous la coquille sur les fenêtres peu hautes. */}
      <main className="relative z-10 px-3 pb-8 sm:px-6">
        <div className="page-shell mx-auto max-w-[78rem]">
          <Work />
          <Services />
          <Testimonials />
          <Expertise />
          <Process />
          <Contact />
          <Footer />
        </div>
      </main>

      <ScrollToTop />
    </div>
  );
}
