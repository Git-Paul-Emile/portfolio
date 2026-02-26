import { useEffect, useState } from "react";
import {
  SiReact,
  SiNodedotjs,
  SiLaravel,
  SiJavascript,
  SiTypescript,
  SiTailwindcss,
  SiMysql,
  SiPostgresql,
  SiPrisma,
  SiGit,
  SiWordpress,
  SiFigma,
  SiNestjs,
  SiNextdotjs,
} from "react-icons/si";

const technologies = [
  { icon: SiTypescript, name: "TypeScript", color: "#3178C6", learning: false },
  { icon: SiNodedotjs, name: "Node.js", color: "#339933", learning: false },
  { icon: SiReact, name: "React", color: "#61DAFB", learning: false },
  { icon: SiJavascript, name: "JavaScript", color: "#F7DF1E", learning: false },
  { icon: SiTailwindcss, name: "Tailwind", color: "#06B6D4", learning: false },
  { icon: SiMysql, name: "MySQL", color: "#4479A1", learning: false },
  { icon: SiPostgresql, name: "PostgreSQL", color: "#336791", learning: false },
  { icon: SiPrisma, name: "Prisma", color: "#2D3748", learning: false },
  { icon: SiLaravel, name: "Laravel", color: "#FF2D20", learning: false },
  { icon: SiGit, name: "Git", color: "#F05032", learning: false },
  { icon: SiWordpress, name: "WordPress", color: "#21759B", learning: false },
  { icon: SiFigma, name: "Figma", color: "#F24E1E", learning: false },
  { icon: SiNestjs, name: "NestJS", color: "#E0234E", learning: true },
  { icon: SiNextdotjs, name: "Next.js", color: "#000000", learning: true },
  { icon: SiReact, name: "React Native", color: "#61DAFB", learning: true },
];

export function TechMarquee() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="py-12 overflow-hidden relative"
      style={{ transform: `translateY(${scrollY * 0.05}px)` }}
    >
      <div className="relative">
        <div className="flex">
          <div className="marquee flex gap-8 pr-8">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 px-6 py-3 glass rounded-full whitespace-nowrap hover:scale-105 transition-all duration-300 border hover:border-primary/20 ${
                  tech.learning
                    ? "border-accent/40 bg-accent/5"
                    : "border-border/30"
                }`}
              >
                <tech.icon
                  className="w-6 h-6"
                  style={{ color: tech.color }}
                />
                <span className="font-medium">{tech.name}</span>
                {tech.learning && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30 leading-tight">
                    En cours
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="marquee flex gap-8 pr-8">
            {technologies.map((tech, index) => (
              <div
                key={`duplicate-${index}`}
                className={`flex items-center gap-3 px-6 py-3 glass rounded-full whitespace-nowrap hover:scale-105 transition-all duration-300 border hover:border-primary/20 ${
                  tech.learning
                    ? "border-accent/40 bg-accent/5"
                    : "border-border/30"
                }`}
              >
                <tech.icon
                  className="w-6 h-6"
                  style={{ color: tech.color }}
                />
                <span className="font-medium">{tech.name}</span>
                {tech.learning && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30 leading-tight">
                    En cours
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
