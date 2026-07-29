/**
 * Encode un chemin de fichier situé dans /public pour l'utiliser dans un
 * attribut `src` ou `href`.
 *
 * Pourquoi c'est nécessaire : plusieurs captures d'écran portent des noms
 * contenant des espaces et des apostrophes typographiques
 * (« Capture d’écran du 2025-10-17 14-52-29.png »). Ces caractères ne sont pas
 * valides tels quels dans une URL. `encodeURI` les convertit (%20, %E2%80%99…)
 * tout en préservant les séparateurs « / », contrairement à
 * `encodeURIComponent` qui les encoderait aussi et casserait le chemin.
 */
export function assetUrl(path: string): string {
  return encodeURI(path);
}
