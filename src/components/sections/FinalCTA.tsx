import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  const contactWhatsApp = () => {
    window.open(
      "https://wa.me/221772995851?text=" +
        encodeURIComponent("Bonjour, j'ai un projet d'application web à discuter avec vous."),
      "_blank"
    );
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 max-w-3xl mx-auto">
          Vous avez un projet d'application web ?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Transformons votre idée en une solution moderne, performante et évolutive.
        </p>
        <Button
          size="lg"
          className="btn-hero text-base px-8 py-3 h-auto hover:scale-105 transition-all duration-300"
          onClick={contactWhatsApp}
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Parlons de votre projet
        </Button>
      </div>
    </section>
  );
}
