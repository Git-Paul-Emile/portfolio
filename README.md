# Portfolio — Paul Emile PECKOUET-BINOMBO

Portfolio de développeur full stack : présentation, réalisations, expertise technique et contact.
Site **bilingue français / anglais** (français par défaut), avec mode clair et mode sombre.

## Stack

| Couche | Technologies |
| --- | --- |
| Build | Vite 5, TypeScript 5.8 |
| UI | React 18, Tailwind CSS 3.4, shadcn/ui (Radix UI) |
| Icônes | Lucide (interface) + react-icons/si (logos de marques) |
| Routage | React Router 6 |

Aucune dépendance n'a été ajoutée pour l'internationalisation : le système est écrit à la main
(React Context + dictionnaires typés), soit ~150 lignes et 0 Ko de bundle supplémentaire.

## Démarrage

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # génère dist/
npm run lint
```

## Architecture

```
src/
├── i18n/                     # Internationalisation
│   ├── fr.ts                 #   Dictionnaire FR — SOURCE DE VÉRITÉ du typage
│   ├── en.ts                 #   Dictionnaire EN — typé `Dictionary`, complétude garantie par tsc
│   ├── types.ts              #   Locale, Dictionary = typeof fr, métadonnées des langues
│   └── index.ts              #   Registre des dictionnaires
│
├── data/                     # Contenu — aucune donnée en dur dans les composants
│   ├── profile.ts            #   Coordonnées, CV, liens WhatsApp/mailto/tel
│   ├── projects.ts           #   Les 10 projets (descriptions FR + EN, stack, captures)
│   └── tech.ts               #   Technologies affichées dans « Mon expertise »
│
├── hooks/
│   ├── useLanguage.tsx       #   LanguageProvider + useLanguage()
│   ├── useTheme.tsx          #   ThemeProvider (clair / sombre / système)
│   └── useReveal.ts          #   Animation à l'entrée dans le viewport (IntersectionObserver)
│
├── components/
│   ├── Navigation.tsx        #   Barre fixe, lien actif, menu mobile
│   ├── Footer.tsx
│   ├── LanguageToggle.tsx    #   Pilule FR | EN
│   ├── ThemeToggle.tsx
│   ├── Reveal.tsx            #   Enveloppe d'animation réutilisable
│   ├── SectionHeading.tsx    #   En-tête standard de section
│   ├── projects/             #   Carte, couverture générée, fiche détaillée
│   ├── sections/             #   Hero, Work, Services, Expertise, Process, Contact
│   └── ui/                   #   Primitives shadcn/ui
│
├── lib/
│   ├── assets.ts             #   encodage des chemins /public (espaces, accents)
│   └── utils.ts              #   cn() — fusion de classes Tailwind
│
└── index.css                 # Design system : tokens de couleurs, classes utilitaires
```

### Principes appliqués

- **Source de vérité unique.** Un texte, une coordonnée ou un projet n'existe qu'à un seul endroit.
  Modifier le numéro de téléphone dans `data/profile.ts` le met à jour dans les quatre endroits
  où il apparaît.
- **Traductions vérifiées à la compilation.** `Dictionary = typeof fr` : oublier une clé dans
  `en.ts` fait échouer `npm run build`. Aucune traduction manquante ne peut atteindre la production.
- **Aucune couleur en dur.** Toutes les couleurs passent par des variables CSS déclarées dans
  `index.css` et exposées à Tailwind. Changer la charte = modifier un seul fichier.
- **Chiffres calculés, pas saisis.** Les statistiques du hero (années d'expérience, nombre de
  projets, nombre de technologies) sont dérivées des données réelles et ne périment jamais.
- **Séparation données / présentation.** Les composants de section ne contiennent ni texte ni
  donnée : ils parcourent `src/data` et `src/i18n`.

## Ajouter un projet

1. Ajouter une entrée dans le tableau `PROJECTS` de `src/data/projects.ts`
   (descriptions `fr` **et** `en` obligatoires — TypeScript le vérifie).
2. Déposer les captures dans `public/<nom-du-projet>/` et référencer les chemins.
   Sans capture, une couverture dégradée avec les initiales est générée automatiquement.
3. Passer `featured: true` pour l'afficher dès le premier écran de la section « Réalisations ».

Aucun composant n'est à modifier.

## Ajouter une langue

1. Ajouter le code dans `LOCALES` (`src/i18n/types.ts`) et ses métadonnées dans `LOCALE_META`.
2. Créer `src/i18n/<code>.ts` typé `Dictionary`, puis l'enregistrer dans `src/i18n/index.ts`.
3. Compléter chaque projet de `data/projects.ts` avec la nouvelle langue.

`tsc` signale précisément tout ce qui manque.

## Déploiement

```bash
npm run build     # produit dist/
```

- **Vercel / Netlify** : connecter le dépôt, build `npm run build`, dossier publié `dist`.
- **Hébergement classique (XAMPP, Apache, o2switch…)** : envoyer le contenu de `dist/`.

## Contact

Paul Emile PECKOUET-BINOMBO — apeckouet@gmail.com — (+221) 77 299 58 51
[LinkedIn](https://urlr.me/HJ85DF)

---

© 2026 Paul Emile PECKOUET-BINOMBO. Tous droits réservés.
