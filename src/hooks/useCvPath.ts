import { useEffect, useState } from "react";
import { PROFILE } from "@/data/profile";
import { detectCountryCode } from "@/lib/geolocation";

/**
 * Chemin du CV à proposer au téléchargement : la version Gabon (PNPE) pour
 * les visiteurs situés au Gabon, la version internationale par défaut sinon
 * (y compris pendant la résolution de la géolocalisation, ou si elle échoue).
 */
export function useCvPath(): string {
  const [cvPath, setCvPath] = useState<string>(PROFILE.cvPath);

  useEffect(() => {
    let cancelled = false;

    detectCountryCode().then((countryCode) => {
      if (cancelled) return;
      if (countryCode === "GA") setCvPath(PROFILE.cvPathGabon);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return cvPath;
}
