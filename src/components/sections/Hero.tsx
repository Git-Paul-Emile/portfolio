import { Eye, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-flip every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const viewCV = () => {
    window.open("/CV PAUL  \u00c9MILE PECKOUET-BINOMBO.pdf", "_blank");
  };


  const contactWhatsApp = () => {
    window.open("https://wa.me/221772995851", "_blank");
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden hero-gradient pt-20">
      {/* Animated Background with Parallax */}
      <div className="absolute inset-0">
        <div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-xl animate-float"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        ></div>
        <div
          className="absolute bottom-32 right-16 w-48 h-48 bg-gradient-to-br from-accent/20 to-primary/30 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "2s", transform: `translateY(${scrollY * -0.1}px)` }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-primary/40 to-accent/30 rounded-full blur-lg animate-float"
          style={{ animationDelay: "4s", transform: `translateY(${scrollY * 0.15}px)` }}
        ></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
          <div
            className="absolute inset-0 dark:block hidden"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>
      </div>

      <div
        className="container mx-auto px-6 text-center relative z-10"
        style={{ transform: `translateY(${scrollY * -0.1}px)` }}
      >
        <div className="max-w-4xl mx-auto">

          {/* ── Card Flip Photo ── */}
          <div className="mb-8 flex justify-center">
            <div className={`card-flip-container ${isFlipped ? 'flipped' : ''}`}>
              <div className="card-flip-inner">
                {/* Recto — photo identité */}
                <div className="card-flip-front">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-accent p-1 shadow-hero">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img
                        src="/mon-photo-d-identite.jpg"
                        alt="Paul Emile PECKOUET-BINOMBO"
                        className="object-cover w-full h-full object-top"
                      />
                    </div>
                  </div>
                </div>
                {/* Verso — photo pro */}
                <div className="card-flip-back">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-accent to-primary p-1 shadow-hero">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img
                        src="/Gemini_Generated_Image_necb72necb72necb.png"
                        alt="Paul Emile PECKOUET-BINOMBO — professionnel"
                        className="object-cover w-full h-full object-top"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 fade-in">
            <span className="text-gradient-hero">Paul Emile</span>
            <br />
            <span className="text-foreground text-3xl md:text-5xl">PECKOUET-BINOMBO</span>
          </h1>

          <h2 className="text-xl md:text-2xl font-semibold mb-3 fade-in fade-in-delay-1">
            <span className="text-gradient">Développeur JS Full Stack</span>{" "}
            <span className="text-muted-foreground font-light">
              évoluant dans la création<br className="hidden md:block" /> d'applications performantes et évolutives
            </span>
          </h2>

          <p className="text-sm text-muted-foreground mb-6 fade-in fade-in-delay-1">
            📍 Dakar, Sénégal —{" "}
            <span className="text-primary font-medium">Disponible pour télétravail</span>
          </p>

          <p className="text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto text-muted-foreground fade-in fade-in-delay-2">
            Passionné par le Clean Code et l'expérience utilisateur, je conçois des solutions web et
            mobiles alliant performance technique et valeur métier concrète.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center flex-wrap fade-in fade-in-delay-3">
            <Button className="btn-hero text-base px-7 py-3 h-auto" onClick={viewCV}>
              <Eye className="mr-2 h-5 w-5" />
              Voir CV
            </Button>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white text-base px-7 py-3 h-auto hover:scale-105 transition-all duration-300 shadow-md"
              onClick={contactWhatsApp}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Discutons de votre projet
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
