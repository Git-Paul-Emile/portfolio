import {
  SiReact,
  SiNodedotjs,
  SiLaravel,
  SiJavascript,
  SiTypescript,
  SiTailwindcss,
  SiMysql,
  SiPostgresql,
  SiGit,
  SiWordpress,
  SiFigma,
  SiNestjs,
  SiNextdotjs,
  SiN8N,
} from "react-icons/si";

const categories = [
  {
    name: "Frontend",
    technologies: [
      { icon: SiReact, name: "React", color: "#61DAFB", learning: false },
      { icon: SiJavascript, name: "JavaScript", color: "#F7DF1E", learning: false },
      { icon: SiTypescript, name: "TypeScript", color: "#3178C6", learning: false },
      { icon: SiTailwindcss, name: "Tailwind", color: "#06B6D4", learning: false },
      { icon: SiNextdotjs, name: "Next.js", color: "#71717A", learning: true },
      { icon: SiReact, name: "React Native", color: "#61DAFB", learning: true },
    ],
  },
  {
    name: "Backend",
    technologies: [
      { icon: SiNodedotjs, name: "Node.js", color: "#339933", learning: false },
      { icon: SiLaravel, name: "Laravel", color: "#FF2D20", learning: false },
      { icon: SiNestjs, name: "NestJS", color: "#E0234E", learning: true },
    ],
  },
  {
    name: "Base de données",
    technologies: [
      { icon: SiMysql, name: "MySQL", color: "#4479A1", learning: false },
      { icon: SiPostgresql, name: "PostgreSQL", color: "#336791", learning: false },
    ],
  },
  {
    name: "CMS",
    technologies: [{ icon: SiWordpress, name: "WordPress", color: "#21759B", learning: false }],
  },
  {
    name: "Outils",
    technologies: [
      { icon: SiGit, name: "Git", color: "#F05032", learning: false },
      { icon: SiFigma, name: "Figma", color: "#F24E1E", learning: false },
      { icon: SiN8N, name: "n8n", color: "#EA4B71", learning: false },
    ],
  },
];

export function TechMarquee() {
  return (
    <section id="technologies" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Technologies</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Les langages, frameworks et outils que j'utilise.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {categories.map((category) => (
            <div key={category.name}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.technologies.map((tech) => (
                  <div
                    key={tech.name}
                    className={`flex items-center gap-2 px-4 py-2 glass rounded-full whitespace-nowrap hover:scale-105 transition-all duration-300 border hover:border-primary/20 ${
                      tech.learning ? "border-accent/40 bg-accent/5" : "border-border/30"
                    }`}
                  >
                    <tech.icon className="w-5 h-5" style={{ color: tech.color }} />
                    <span className="font-medium text-sm">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
