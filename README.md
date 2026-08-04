# La Récré 🎲

Un petit centre de jeux pour s'entraîner à l'orthographe :
- **Chasse aux fautes** — repère et corrige les mots mal orthographiés
- **Dictée vocale** — écoute une phrase et écris-la sans faute
- **La bonne phrase** — choisis la phrase correcte parmi plusieurs

Site statique (HTML / CSS / JS) avec comptes utilisateurs et sauvegarde des scores via [Supabase](https://supabase.com).

## Activer les vrais comptes + scores (Supabase)

1. Crée un compte sur [supabase.com](https://supabase.com) et un nouveau projet.
2. Dans **Authentication → Providers → Email**, désactive *"Confirm email"* (sinon il faut valider par lien email avant de pouvoir se connecter).
3. Dans **SQL Editor**, colle et exécute le contenu de `setup-supabase.sql` (crée la table des scores avec les bonnes règles de sécurité).
4. Dans **Project Settings → API**, récupère la **Project URL** et la clé **anon public**.
5. Ouvre `supabase-config.js` et remplace les deux valeurs par les tiennes :
   ```js
   const SUPABASE_URL = "https://TON-PROJET.supabase.co";
   const SUPABASE_ANON_KEY = "TA_CLE_ANON_PUBLIQUE";
   ```
6. Pousse le changement sur GitHub (`git add . && git commit -m "config supabase" && git push`) — Vercel redéploie automatiquement.

Une fois configuré : les visiteurs peuvent créer un compte, se connecter, et leurs scores sont sauvegardés automatiquement à la fin de chaque partie. Le bouton "Mon compte" affiche l'historique des 10 derniers scores.

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
index.html                → page d'accueil / centre de jeux
jeu-orthographe.html      → jeu "Chasse aux fautes"
dictee.html                → jeu "Dictée vocale"
bonne-phrase.html         → jeu "La bonne phrase"
style.css                 → styles partagés par toutes les pages
script-orthographe.js      → logique du jeu Chasse aux fautes
script-dictee.js           → logique du jeu Dictée vocale
script-bonne-phrase.js     → logique du jeu La bonne phrase
script-auth.js             → connexion, inscription, sauvegarde des scores (Supabase)
supabase-config.js         → tes identifiants Supabase (à compléter)
setup-supabase.sql         → script SQL à exécuter une fois dans Supabase
```

## À savoir
- Le jeu "Dictée vocale" utilise la synthèse vocale du navigateur (Web Speech API) : elle fonctionne mieux sur Chrome ou Edge.
- Tant que `supabase-config.js` n'est pas complété avec de vrais identifiants, les boutons de connexion ne fonctionneront pas (erreur dans la console du navigateur).
