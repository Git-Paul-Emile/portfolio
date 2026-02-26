import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Birane Baila WANE",
    title: "Formateur & Encadrant technique",
    text: "Paul Emile a démontré une vraie capacité à s'approprier rapidement les concepts techniques et à les appliquer dans des projets concrets. Sa rigueur et son sens du détail font de lui un développeur fiable et sérieux.",
  },
  {
    name: "Aly Tall NIANG",
    title: "Développeur senior & Mentor",
    text: "Ce qui me frappe chez Paul Emile, c'est sa curiosité et sa volonté de toujours produire un code propre et maintenable. Il est capable de travailler en équipe comme de manière autonome, avec une grande adaptabilité.",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-br from-muted/20 to-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-gradient-to-br from-accent/5 to-primary/5 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ils me <span className="text-gradient">recommandent</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            La confiance que m'accordent mes collaborateurs et mentors est ma meilleure carte de visite.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="testimonial-card relative"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Quote icon */}
              <div className="mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                  <Quote className="h-5 w-5 text-primary" />
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6 italic">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                {/* Avatar initiales */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {t.name
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
