import { useEffect, useState } from "react";
import { Code2, Database, Wrench, Users } from "lucide-react";

const skills = [
  {
    icon: Code2,
    title: "Écosystème Frontend JS",
    description: "React.js, TypeScript, JavaScript, HTML/CSS, TailwindCSS, Bootstrap",
    color: "text-blue-500",
    highlight: ["TypeScript", "React.js"],
  },
  {
    icon: Database,
    title: "Écosystème Backend JS",
    description: "Node.js, Express, TypeScript, Prisma, MySQL, PostgreSQL, JWT, Zod",
    color: "text-green-500",
    highlight: ["Node.js", "TypeScript"],
  },
  {
    icon: Wrench,
    title: "Outils & Autres",
    description: "PHP, Laravel, WordPress, Figma, Git",
    color: "text-purple-500",
    highlight: [],
  },
  {
    icon: Users,
    title: "Soft Skills",
    description: "Travail en équipe, Autonomie, Adaptabilité, Communication, Clean Code",
    color: "text-orange-500",
    highlight: ["Clean Code"],
  },
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
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            À <span className="text-gradient">propos</span>
          </h2>

          {/* Nouveau texte de présentation */}
          <div className="max-w-3xl mx-auto glass rounded-2xl p-8 border border-border/50 text-left leading-relaxed text-muted-foreground">
            <p>
              Développeur JS Full Stack évoluant dans la conception d'applications web et mobiles
              performantes, je me spécialise sur les technologies{" "}
              <span className="text-primary font-semibold">React.js</span>,{" "}
              <span className="text-primary font-semibold">Node.js</span> et{" "}
              <span className="text-primary font-semibold">TypeScript</span>. Passionné par le{" "}
              <span className="font-semibold text-foreground">Clean Code</span> et l'expérience
              utilisateur, j'ai déjà réalisé des solutions allant de la gestion de
              logistique à l'automatisation de processus RH. Orienté vers l'apprentissage continu,
              je suis prêt à m'adapter à vos enjeux techniques pour relever de nouveaux défis.
            </p>
          </div>
        </div>

        {/* Skills par écosystèmes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="card-glass text-center group hover:scale-105 hover:shadow-hero transition-all duration-500 border border-border/50 hover:border-primary/20"
              style={{
                animationDelay: `${index * 0.1}s`,
                transform: `translateY(${scrollY * 0.02}px)`,
              }}
            >
              <div className="mb-6">
                <div className="relative">
                  <skill.icon
                    className={`h-12 w-12 mx-auto ${skill.color} group-hover:scale-110 transition-transform duration-300 relative z-10`}
                  />
                  <div
                    className="absolute inset-0 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                    style={{ backgroundColor: `hsl(var(--primary))` }}
                  ></div>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-4">{skill.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {skill.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
