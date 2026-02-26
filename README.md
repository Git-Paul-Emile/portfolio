# Portfolio – Paul Emile PECKOUET-BINOMBO

Bienvenue sur mon portfolio de développeur fullstack junior !

## Présentation

Ce projet présente mes compétences, mon parcours et mes réalisations web & mobile.  
Il est construit avec :

- [Vite](https://vitejs.dev/) (React + TypeScript)
- [shadcn-ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

## Démarrage local

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/PECKOUET-BINOMBO/stack-story-display.git
   cd mon_portfolio
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Lancer le serveur de développement :**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. Accède à [http://localhost:5173](http://localhost:5173) (ou le port affiché).

## Structure du projet

- `src/components/` : composants réutilisables (UI, sections…)
- `src/pages/Index.tsx` : page principale
- `public/` : fichiers statiques (images, CV…)

## Déploiement

### Sur [Vercel](https://vercel.com/)

1. Crée un compte sur Vercel.
2. Clique sur « New Project » et connecte ton repo GitHub.
3. Vercel détecte Vite automatiquement (voir [`vercel.json`](vercel.json)).
4. Le site sera accessible sur une URL du type `https://ton-projet.vercel.app`.

### Sur [Netlify](https://netlify.com/)

1. Crée un compte Netlify.
2. Clique sur « Add new site » > « Import an existing project ».
3. Connecte ton repo Git.
4. Build command : `npm run build` ; Publish directory : `dist`.

### Déploiement manuel

1. Génère le build :
   ```bash
   npm run build
   ```
2. Envoie le dossier `dist/` sur ton hébergement web.

## Personnalisation

- Modifie les sections dans `src/components/sections/` pour adapter à ton profil.
- Ajoute ton CV dans le dossier `public/` et mets à jour le lien dans le composant Hero.

## Contact

Paul Emile PECKOUET-BINOMBO  
apeckouet@gmail.com  
[LinkedIn](https://urlr.me/HJ85DF) | [Instagram](https://urlr.me/uCngGx)

---

© 2025 Paul Emile PECKOUET-BINOMBO. Tous droits réservés.