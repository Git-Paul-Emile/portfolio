import { Search, PenTool, Code, TestTube, Rocket, LifeBuoy } from "lucide-react";

const steps = [
  { icon: Search, title: "Analyse du besoin" },
  { icon: PenTool, title: "Conception de la solution" },
  { icon: Code, title: "Développement" },
  { icon: TestTube, title: "Tests" },
  { icon: Rocket, title: "Déploiement" },
  { icon: LifeBuoy, title: "Maintenance" },
];

export function Process() {
  return (
    <section id="process" className="py-20 bg-gradient-to-br from-muted/30 to-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Processus de <span className="text-gradient">travail</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une méthode claire, de l'analyse du besoin à la maintenance.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="card-glass border border-border/50 hover:border-primary/20 text-center"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 shadow-hero">
                <step.icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-xs font-semibold text-primary mb-1">
                Étape {index + 1}
              </div>
              <h3 className="font-semibold">{step.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
