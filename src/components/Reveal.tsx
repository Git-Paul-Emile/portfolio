import type { ElementType, ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  /** Balise HTML rendue. Par défaut `div`. Ex. `as="section"`, `as="li"`. */
  as?: ElementType;
  className?: string;
  /** Décalage de l'animation, en millisecondes (effet cascade dans une grille). */
  delay?: number;
}

/**
 * Enveloppe un contenu et l'anime à son entrée dans le viewport.
 *
 * Composant « présentationnel » : il ne connaît rien du contenu qu'il anime.
 * C'est le principe de responsabilité unique (le « S » de SOLID) - la logique
 * de détection vit dans le hook `useReveal`, l'animation vit dans le CSS
 * (`.reveal` / `.is-visible`), et ce composant ne fait que les relier.
 */
export function Reveal({ children, as: Tag = "div", className, delay = 0 }: RevealProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      className={cn("reveal", isVisible && "is-visible", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
