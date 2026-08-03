# La Récré 🎲

Un petit centre de jeux pour s'entraîner à l'orthographe :
- **Chasse aux fautes** — repère et corrige les mots mal orthographiés
- **Dictée vocale** — écoute une phrase et écris-la sans faute
- **La bonne phrase** — choisis la phrase correcte parmi plusieurs

Site 100% statique : HTML / CSS / JavaScript, aucune dépendance, aucun serveur nécessaire.

## Mettre le site en ligne avec Vercel (gratuit)

### 1. Créer le dépôt GitHub
1. Va sur [github.com](https://github.com) et crée un compte si tu n'en as pas.
2. Clique sur **New repository**, donne-lui un nom (ex. `la-recre`), laisse-le **Public**, ne coche aucune case d'initialisation.
3. Sur ta machine, dans le dossier contenant ces fichiers :
   ```bash
   git init
   git add .
   git commit -m "Premier envoi de La Récré"
   git branch -M main
   git remote add origin https://github.com/TON-PSEUDO/la-recre.git
   git push -u origin main
   ```
   (Remplace `TON-PSEUDO` par ton nom d'utilisateur GitHub.)

### 2. Connecter Vercel à GitHub
1. Va sur [vercel.com](https://vercel.com) et crée un compte (tu peux te connecter directement avec ton compte GitHub, c'est le plus simple).
2. Clique sur **Add New → Project**.
3. Choisis le dépôt `la-recre` que tu viens de créer.
4. Vercel détecte automatiquement que c'est un site statique : **aucune configuration nécessaire**, laisse tout par défaut (Framework Preset : "Other").
5. Clique sur **Deploy**.

### 3. C'est en ligne !
Après 10-20 secondes, Vercel te donne une adresse du style :
```
la-recre.vercel.app
```
Chaque fois que tu pousses (`git push`) une modification sur GitHub, Vercel redéploie automatiquement le site.

## Structure des fichiers
```
index.html               → page d'accueil / centre de jeux
jeu-orthographe.html      → jeu "Chasse aux fautes"
dictee.html                → jeu "Dictée vocale"
bonne-phrase.html         → jeu "La bonne phrase"
style.css                 → styles partagés par toutes les pages
script-orthographe.js      → logique du jeu Chasse aux fautes
script-dictee.js           → logique du jeu Dictée vocale
script-bonne-phrase.js     → logique du jeu La bonne phrase
script-auth.js             → bouton et modale "Se connecter" (front-end uniquement)
```

## À savoir
- Le bouton "Se connecter" est pour l'instant **cosmétique uniquement** : il n'y a pas de vraie base de données derrière. Si tu veux des comptes persistants plus tard, il faudra ajouter un backend (ex. Supabase, qui a aussi un plan gratuit et s'intègre bien avec Vercel).
- Le jeu "Dictée vocale" utilise la synthèse vocale du navigateur (Web Speech API) : elle fonctionne mieux sur Chrome ou Edge.
