import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { TechMarquee } from "@/components/TechMarquee";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";
import { ScrollToTop } from "@/components/ScrollToTop";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <TechMarquee />
      <About />
      <Projects />
      <Contact />
      <ScrollToTop />

      {/* Footer */}
      <footer className="py-8 bg-muted/30 text-center">
        <p className="text-muted-foreground">
          © 2025 Paul Emile PECKOUET-BINOMBO. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
};

export default Index;
