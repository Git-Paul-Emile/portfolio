import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Linkedin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Contact() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-background to-primary/5 relative overflow-hidden">
      {/* Parallax background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-32 right-32 w-80 h-80 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        ></div>
      </div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Restons en <span className="text-gradient">Contact</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Vous avez un projet en tête ? Une opportunité à discuter ?
            N'hésitez pas à me contacter, je serai ravi d'échanger avec vous.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6" style={{ transform: `translateY(${scrollY * 0.02}px)` }}>

          {/* Infos de contact */}
          <div className="glass rounded-2xl p-8 border border-border/50 hover:border-primary/20 transition-all duration-300">
            <h3 className="text-2xl font-bold mb-8">Informations de contact</h3>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Téléphone</p>
                  <p className="text-muted-foreground">(+221) 77 299 58 51</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <a
                    href="mailto:apeckouet@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    apeckouet@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Localisation</p>
                  <p className="text-muted-foreground">
                    Dakar, Sénégal{" "}
                    <span className="text-primary font-medium">(Disponible pour télétravail)</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Réseaux sociaux + WhatsApp */}
          <div className="glass rounded-2xl p-8 border border-border/50 hover:border-primary/20 transition-all duration-300">
            <h3 className="text-xl font-bold mb-6">Me contacter directement</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Button
                size="lg"
                className="btn-hero hover:scale-105 transition-all duration-300"
                onClick={() => window.open("https://urlr.me/HJ85DF", "_blank")}
              >
                <Linkedin className="mr-2 h-5 w-5" />
                LinkedIn
              </Button>
              <Button
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white hover:scale-105 transition-all duration-300"
                onClick={() => window.open("https://wa.me/221772995851", "_blank")}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
