import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

const highlights = [
  "Disponible en freelance",
  "Travail à distance ou sur site",
  "Livraison dans les délais",
];

export function About() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-background to-muted/30 relative overflow-hidden">
      {/* Parallax background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        ></div>
        <div
          className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-br from-accent/5 to-primary/5 rounded-full blur-2xl"
          style={{ transform: `translateY(${scrollY * -0.05}px)` }}
        ></div>
      </div>

      <div className="container mx-auto px-6">
        <div className="text-center">
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto text-left">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                À <span className="text-gradient">propos</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Je développe des applications web/mobile complètes, de l'interface utilisateur
                jusqu'à la base de données. Mon objectif est de créer des solutions rapides,
                sécurisées et évolutives qui répondent aux besoins réels des utilisateurs.
              </p>
            </div>

            <div className="card-glass border border-border/50 p-8">
              <ul className="space-y-4">
                {highlights.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
