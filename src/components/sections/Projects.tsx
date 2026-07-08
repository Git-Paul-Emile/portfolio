import { useEffect, useState, useRef } from "react";
import { ExternalLink, Camera, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const projects = [
  {
    id: 0,
    title: "Seek",
    description:
      "Seek est une plateforme web immobilière permettant aux propriétaires de publier et gérer leurs biens, et aux utilisateurs de rechercher des logements par localisation, budget ou proximité d'un point précis. Le projet intègre un système avancé de recherche géographique, gestion des annonces, dashboard propriétaire et suivi des performances.",
    category: "Web",
    icon: Globe,
    technologies: ["React", "TypeScript", "Node.js", "Tailwind CSS"],
    image: "/seek/screencapture-localhost-5173-2026-02-26-13_29_11.png",
    screenshots: [
      "/seek/screencapture-localhost-5173-2026-02-26-13_29_11.png",
      "/seek/screencapture-localhost-5173-admin-annonces-2026-02-26-13_30_14.png",
      "/seek/screencapture-localhost-5173-annonce-835478bc-08f4-4b7d-b3a0-e80a564237a6-2026-02-26-13_31_54.png",
      "/seek/screencapture-localhost-5173-owner-dashboard-2026-02-26-13_31_08.png",
    ],
    liveUrl: "#",
  },
  {
    id: 2,
    title: "Gestion Cargaison",
    description:
      "Besoin : Gérer et tracer les expéditions de marchandises pour une entreprise logistique. Solution : Application web PHP/TypeScript avec envoi automatisé d'emails et stockage JSON. Résultat : Système de gestion logistique complet avec suivi en temps réel et notifications automatiques.",
    category: "Web",
    icon: Globe,
    technologies: ["PHP", "TypeScript", "HTML", "CSS"],
    image: "/cargaison/cover.png",
    screenshots: [
      "/cargaison/Capture d'écran du 2025-10-17 14-52-29.png",
      "/cargaison/Capture d'écran du 2025-10-17 14-56-13.png",
      "/cargaison/Capture d'écran du 2025-10-17 14-56-22.png",
      "/cargaison/Capture d'écran du 2025-10-17 14-56-31.png",
      "/cargaison/Capture d'écran du 2025-10-17 14-56-36.png",
      "/cargaison/Capture d'écran du 2025-10-17 14-56-39.png",
      "/cargaison/Capture d'écran du 2025-10-17 14-56-47.png",
      "/cargaison/Capture d'écran du 2025-10-17 15-00-04.png",
      "/cargaison/Capture d'écran du 2025-10-17 15-00-12.png",
      "/cargaison/Capture d'écran du 2025-10-17 15-00-51.png",
      "/cargaison/Capture d'écran du 2025-10-17 15-00-59.png",
      "/cargaison/Capture d'écran du 2025-10-17 15-01-04.png",
      "/cargaison/Capture d'écran du 2025-10-17 15-01-15.png",
      "/cargaison/screencapture-localhost-8000-accueil-2025-10-17-14_58_43.png",
      "/cargaison/screencapture-localhost-8000-accueil-2025-10-17-14_59_45.png",
      "/cargaison/screencapture-localhost-8000-dashboard-2025-10-17-14_58_18.png",
      "/cargaison/screencapture-localhost-8000-recherche-2025-10-17-14-57-01.png",
      "/cargaison/screencapture-localhost-8000-recherche-2025-10-17-15_00_32.png",
    ],
    liveUrl: "#",
  },
  {
    id: 3,
    title: "FotolJay",
    description:
      "Besoin : Créer un marketplace de mise en relation directe entre vendeurs et acheteurs. Solution : Application full-stack Node.js/TypeScript avec MySQL et gestion admin. Résultat : Plateforme de petites annonces avec dashboard complet et gestion des utilisateurs.",
    category: "Web",
    icon: Globe,
    technologies: ["Node.js", "TypeScript", "Express.js", "MySQL", "Angular"],
    image: "/fotoljay/fotoljay.png",
    screenshots: [
      "/fotoljay/screencapture-localhost-4200-2025-10-17-00_07_07.png",
      "/fotoljay/screencapture-localhost-4200-about-2025-10-17-00_08_09.png",
      "/fotoljay/screencapture-localhost-4200-admin-dashboard-2025-10-17-00_11_28.png",
      "/fotoljay/screencapture-localhost-4200-admin-dashboard-2025-10-17-00_13_38.png",
      "/fotoljay/screencapture-localhost-4200-admin-parametres-2025-10-17-00_13_16.png",
      "/fotoljay/screencapture-localhost-4200-admin-vendeurs-2025-10-17-00_11_44.png",
      "/fotoljay/screencapture-localhost-4200-annonces-2025-10-17-00_07_49.png",
      "/fotoljay/screencapture-localhost-4200-annonces-creer-2025-10-17-00_09_27.png",
      "/fotoljay/screencapture-localhost-4200-annonces-modifier-8-2025-10-17-00_10_37.png",
      "/fotoljay/screencapture-localhost-4200-mes-annonces-2025-10-17-00_09_02.png",
      "/fotoljay/screencapture-localhost-4200-mes-annonces-2025-10-17-00_10_18.png",
    ],
    liveUrl: "#",
  },
  {
    id: 4,
    title: "Milna Gourmet",
    description:
      "Besoin : Digitaliser une entreprise de yaourts artisanaux et permettre les commandes en ligne. Solution : Application React/TypeScript avec validation de formulaires. Résultat : Plateforme e-commerce avec personnalisation des produits, témoignages clients et espace admin.",
    category: "Web",
    icon: Globe,
    technologies: ["React/vite", "TypeScript", "Tailwind CSS"],
    image: "/milnaGourmet/cover.png",
    screenshots: [
      "/milnaGourmet/Capture d'écran du 2025-10-17 00-43-37.png",
      "/milnaGourmet/Capture d'écran du 2025-10-17 00-43-44.png",
      "/milnaGourmet/Capture d'écran du 2025-10-17 00-43-58.png",
      "/milnaGourmet/Capture d'écran du 2025-10-17 00-44-26.png",
      "/milnaGourmet/Capture d'écran du 2025-10-17 00-44-30.png",
      "/milnaGourmet/Capture d'écran du 2025-10-17 00-44-51.png",
      "/milnaGourmet/Capture d'écran du 2025-10-17 00-45-00.png",
      "/milnaGourmet/Capture d'écran du 2025-10-17 00-45-06.png",
      "/milnaGourmet/Capture d'écran du 2025-10-17 00-45-12.png",
      "/milnaGourmet/Capture d'écran du 2025-10-17 00-45-17.png",
      "/milnaGourmet/Capture d'écran du 2025-10-17 00-45-41.png",
      "/milnaGourmet/Capture d'écran du 2025-10-17 00-46-09.png",
      "/milnaGourmet/Capture d'écran du 2025-10-17 00-46-15.png",
      "/milnaGourmet/Capture d'écran du 2025-10-17 00-46-21.png",
      "/milnaGourmet/screencapture-localhost-8081-2025-10-17-00_42_20.png",
      "/milnaGourmet/screencapture-localhost-8081-dashboard-2025-10-17-00_44_09.png",
      "/milnaGourmet/screencapture-localhost-8081-dashboard-2025-10-17-00_44_38.png",
      "/milnaGourmet/screencapture-localhost-8081-dashboard-2025-10-17-00_45_26.png",
      "/milnaGourmet/screencapture-localhost-8081-dashboard-2025-10-17-00_45_48.png",
      "/milnaGourmet/screencapture-localhost-8081-dashboard-2025-10-17-00_46_28.png",
    ],
    liveUrl: "#",
  },
  {
    id: 5,
    title: "Gestionnaire de salaire",
    description:
      "Besoin : Automatiser la paie multi-tenant avec différents rôles (admin, RH, employé). Solution : Architecture Node/Express avec TypeScript, génération PDF/QR Code et envoi d'emails automatisés. Résultat : Système RH complet, fiable et documenté avec gestion multi-entreprise.",
    category: "Web",
    icon: Globe,
    technologies: ["React.js", "Node.js", "Express", "TypeScript", "MySQL"],
    image: "/gestion_salaire/cover.png",
    screenshots: [
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-04-35.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-04-41.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-04-50.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-04-55.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-05-04.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-05-18.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-06-24.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-06-38.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-16-28.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-16-35.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-25-37.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-25-45.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-25-54.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-26-06.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-26-21.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-26-27.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-26-29.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-26-31.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-26-38.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-26-40.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-26-52.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-27-13.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-27-21.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-27-30.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-27-34.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-29-24.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-29-27.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-29-31.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-29-36.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-29-53.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-30-23.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-30-27.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-30-31.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-30-39.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-30-47.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-30-58.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-31-06.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-32-53.png",
      "/gestion_salaire/Capture d'écran du 2025-10-17 14-33-02.png",
      "/gestion_salaire/screencapture-localhost-5173-dashboard-2025-10-17-14_31_46.png",
      "/gestion_salaire/screencapture-localhost-5173-parametres-2025-10-17-14_03_39.png",
    ],
    liveUrl: "#",
  },
  {
    id: 7,
    title: "Système de Gestion des Apprenants",
    description:
      "Besoin : Administrer les promotions, référentiels de formation et le suivi des apprenants. Solution : Application web PHP complète avec base de données PostgreSQL et gestion des rôles. Résultat : Système de suivi complet avec gestion des présences, promotions et référentiels de formation.",
    category: "Web",
    icon: Globe,
    technologies: ["PHP", "PostgreSQL", "HTML", "CSS"],
    image: "/gest_apprenant/cover.png",
    screenshots: [
      "/gest_apprenant/Capture d'écran du 2025-10-17 16-04-49.png",
      "/gest_apprenant/Capture d'écran du 2025-10-17 16-27-34.png",
      "/gest_apprenant/Capture d'écran du 2025-10-17 16-27-59.png",
      "/gest_apprenant/screencapture-localhost-9090-2025-10-17-16_13_33.png",
      "/gest_apprenant/screencapture-localhost-9090-2025-10-17-16_13_51.png",
      "/gest_apprenant/screencapture-localhost-9090-2025-10-17-16_14_12.png",
      "/gest_apprenant/screencapture-localhost-9090-2025-10-17-16_22_33.png",
      "/gest_apprenant/screencapture-localhost-9090-2025-10-17-16_22_43.png",
      "/gest_apprenant/screencapture-localhost-9090-2025-10-17-16_23_00.png",
      "/gest_apprenant/screencapture-localhost-9090-2025-10-17-16_27_38.png",
    ],
    liveUrl: "#",
  },
  {
    id: 8,
    title: "ProNet Multiservices",
    description:
      "Besoin : Présenter une entreprise de services professionnels (nettoyage, déménagement, froid…) et générer des leads. Solution : Site web PHP/JavaScript avec formulaire de devis interactif et 7 pages de services détaillées. Résultat : Vitrine professionnelle complète avec formulaire de contact et demande de devis en ligne.",
    category: "Web",
    icon: Globe,
    technologies: ["PHP", "JavaScript", "HTML", "CSS"],
    image: "/pro_net/cover.png",
    screenshots: [
      "/pro_net/Capture d'écran du 2025-10-17 15-21-00.png",
      "/pro_net/Capture d'écran du 2025-10-17 15-21-04.png",
      "/pro_net/Capture d'écran du 2025-10-17 15-21-17.png",
      "/pro_net/Capture d'écran du 2025-10-17 15-21-27.png",
      "/pro_net/screencapture-localhost-3000-2025-10-17-15_19_50.png",
      "/pro_net/screencapture-localhost-3000-2025-10-17-15_20_40.png",
      "/pro_net/screencapture-localhost-3000-pages-demenagement-php-2025-10-17-15_23_45.png",
      "/pro_net/screencapture-localhost-3000-pages-desinfection-php-2025-10-17-15_24_04.png",
      "/pro_net/screencapture-localhost-3000-pages-devis-php-2025-10-17-15_25_27.png",
      "/pro_net/screencapture-localhost-3000-pages-froid-php-2025-10-17-15_24_21.png",
      "/pro_net/screencapture-localhost-3000-pages-gestion-php-2025-10-17-15_24_39.png",
      "/pro_net/screencapture-localhost-3000-pages-laverie-php-2025-10-17-15_24_54.png",
      "/pro_net/screencapture-localhost-3000-pages-nettoyage-php-2025-10-17-15_25_11.png",
      "/pro_net/screencapture-localhost-3000-pages-propos-php-2025-10-17-15_22_58.png",
    ],
    liveUrl: "#",
  },
  {
    id: 9,
    title: "Refonte du site web Autour de Mary",
    description:
      "Besoin : Moderniser le site de l'incubateur Autour de Mary pour mieux valoriser ses programmes. Solution : Refonte complète sous WordPress en tant qu'intégrateur, avec nouvelle architecture et design. Résultat : Nouveau site responsive présentant les programmes, événements et partenaires de l'incubateur.",
    category: "Web",
    icon: Globe,
    technologies: [],
    image: "/autour_Mary/cover.png",
    screenshots: [
      "/autour_Mary/Capture d'écran du 2025-10-17 15-34-33.png",
      "/autour_Mary/screencapture-dev-autour-de-mary-pantheonsite-io-2025-10-17-15_34_06.png",
      "/autour_Mary/screencapture-dev-autour-de-mary-pantheonsite-io-african-bridge-2025-10-17-15_36_28.png",
      "/autour_Mary/screencapture-dev-autour-de-mary-pantheonsite-io-articles-2025-10-17-15_35_15.png",
      "/autour_Mary/screencapture-dev-autour-de-mary-pantheonsite-io-boosteur-de-talents-2025-10-17-15_36_01.png",
      "/autour_Mary/screencapture-dev-autour-de-mary-pantheonsite-io-evenements-2025-10-17-15_35_31.png",
      "/autour_Mary/screencapture-dev-autour-de-mary-pantheonsite-io-projets-2025-10-17-15_36_58.png",
      "/autour_Mary/screencapture-dev-autour-de-mary-pantheonsite-io-qui-sommes-nous-2025-10-17-15_35_42.png",
      "/autour_Mary/screencapture-dev-autour-de-mary-pantheonsite-io-start-your-african-dream-2025-10-17-15_36_14.png",
    ],
    liveUrl: "https://dev-autour-de-mary.pantheonsite.io/",
  },
];

const categories = ["Tous", "Web", "Mobile"];

export function Projects() {
  const [scrollY, setScrollY] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredProjects =
    activeCategory === "Tous"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <section
      id="projects"
      className="py-20 bg-gradient-to-br from-muted/30 to-background relative overflow-hidden"
    >
      {/* Parallax background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-accent/5 to-primary/5 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.08}px)` }}
        ></div>
      </div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Mes <span className="text-gradient">Projets</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Quelques applications que j'ai développées.
          </p>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className={`transition-all duration-300 ${
                activeCategory === category ? "btn-hero shadow-hero" : "btn-glass hover:scale-105"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-primary/80 hover:bg-primary text-white p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Projet précédent"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-primary/80 hover:bg-primary text-white p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Projet suivant"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Projects Slider - Horizontal Scroll */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-6 overflow-x-auto scrollbar-hide pb-4 px-4"
          style={{ scrollBehavior: "smooth" }}
        >
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground text-xl py-12">
              Aucun projet dans cette catégorie pour le moment.
            </div>
          ) : (
            filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="flex-shrink-0 w-[350px] card-project group border border-border/50 hover:border-primary/20 cursor-pointer flex flex-col"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="relative">
                      <project.icon className="h-8 w-8 text-primary relative z-10" />
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg"></div>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {project.category}
                    </Badge>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
                      {project.screenshots && project.screenshots.length > 0 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          aria-label={`Voir les captures d'écran de ${project.title}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedProject(project);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                      {project.liveUrl !== "#" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          aria-label={`Ouvrir ${project.title} en ligne`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(project.liveUrl, "_blank");
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <div className="text-muted-foreground mb-4 leading-relaxed h-28 overflow-y-auto scrollbar-hide text-sm">
                    <p className="whitespace-pre-line">{project.description}</p>
                  </div>

                  <div className="mt-auto">
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Button
                      variant="outline"
                      className="w-full btn-glass"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (project.liveUrl !== "#") {
                          window.open(project.liveUrl, "_blank");
                        } else if (project.screenshots && project.screenshots.length > 0) {
                          setSelectedProject(project);
                          setIsDialogOpen(true);
                        }
                      }}
                    >
                      Voir le projet
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Screenshots Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Captures d'écran — {selectedProject?.title}</DialogTitle>
            </DialogHeader>
            {selectedProject?.screenshots && (
              <Carousel className="w-full">
                <CarouselContent>
                  {selectedProject.screenshots.map((screenshot, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <img
                          src={screenshot}
                          alt={`Capture ${index + 1} de ${selectedProject.title}`}
                          className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
