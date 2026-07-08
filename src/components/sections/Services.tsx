import { Smartphone, Layout, Server, Webhook, Database, Wrench } from "lucide-react";

const services = [
  {
    icon: Smartphone,
    title: "Développement d'applications Web/mobile",
    description: "Création d'applications web/mobile modernes adaptées à vos besoins.",
  },
  {
    icon: Layout,
    title: "Développement Frontend",
    description: "Interfaces utilisateur modernes, responsives et performantes.",
  },
  {
    icon: Server,
    title: "Développement Backend",
    description: "Création d'API sécurisées, authentification, gestion des données et logique métier.",
  },
  {
    icon: Webhook,
    title: "Intégration d'API",
    description: "Paiement, Email, Authentification, API tierces, Webhooks.",
  },
  {
    icon: Database,
    title: "Conception de Base de Données",
    description: "Modélisation, optimisation et sécurisation des données.",
  },
  {
    icon: Wrench,
    title: "Maintenance & Évolution",
    description: "Correction de bugs, optimisation des performances et ajout de nouvelles fonctionnalités.",
  },
];

export function Services() {
  return (
    <section id="services" className="py-20 bg-gradient-to-br from-muted/30 to-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Services</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des solutions sur mesure pour transformer vos idées en produits concrets.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="card-glass text-left border border-border/50 hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mb-4">
                <service.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
