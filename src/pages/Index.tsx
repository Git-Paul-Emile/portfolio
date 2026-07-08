import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { TechMarquee } from "@/components/TechMarquee";
import { Services } from "@/components/sections/Services";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";
import { Process } from "@/components/sections/Process";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { ScrollToTop } from "@/components/ScrollToTop";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <TechMarquee />
      <Services />
      <Projects />
      <Contact />
      <Process />
      <FinalCTA />
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
