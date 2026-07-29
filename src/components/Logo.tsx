import { assetUrl } from "@/lib/assets";
import { cn } from "@/lib/utils";

/**
 * Monogramme « P&E » (logo fourni, trait pinceau).
 * L'image est en noir sur fond transparent : `dark:invert` la rend lisible
 * sur le thème sombre sans avoir à fournir un second fichier.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={assetUrl("/logo.png")}
      alt=""
      aria-hidden="true"
      className={cn("h-9 w-auto object-contain dark:invert", className)}
    />
  );
}

interface LogoProps {
  className?: string;
}

/**
 * Logo : le monogramme « P&E » seul. Le nom et la fonction ne sont plus
 * répétés en texte à côté — l'image les porte déjà visuellement.
 */
export function Logo({ className }: LogoProps) {
  return <LogoMark className={className} />;
}
