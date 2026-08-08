# La Récré 🎲

Un petit centre de jeux pour s'entraîner à l'orthographe, disponible en français et en anglais :
- **Chasse aux fautes / Spot the Mistake** — repère et corrige les mots mal orthographiés
- **Dictée vocale / Listening Dictation** — écoute une phrase et écris-la sans faute
- **La bonne phrase / Pick the Right Sentence** — choisis la phrase correcte parmi plusieurs

Site statique (HTML / CSS / JS) avec comptes utilisateurs et sauvegarde des scores via [Supabase](https://supabase.com).

## Changer de langue

Le sélecteur 🇫🇷 / 🇬🇧 en haut à droite bascule toute l'interface ET le contenu des jeux (les phrases ne sont pas traduites mot à mot, ce sont de vrais exercices d'orthographe/grammaire anglaise en version anglaise). Le choix de langue est mémorisé dans le navigateur. Changer de langue en pleine partie ramène à l'écran de sélection du niveau.

## Activer les vrais comptes + scores (Supabase)

1. Crée un compte sur [supabase.com](https://supabase.com) et un nouveau projet.
2. Dans **Authentication → Providers → Email**, désactive *"Confirm email"* (sinon il faut valider par lien email avant de pouvoir se connecter).
3. Dans **SQL Editor**, colle et exécute le contenu de `setup-supabase.sql` (crée la table des scores avec les bonnes règles de sécurité et permissions).
4. Dans **Project Settings → API**, récupère la **Project URL** et la clé **anon public**.
5. Ouvre `supabase-config.js` et remplace les deux valeurs par les tiennes :
   ```js
   const SUPABASE_URL = "https://TON-PROJET.supabase.co";
   const SUPABASE_ANON_KEY = "TA_CLE_ANON_PUBLIQUE";
   ```
6. Pousse le changement sur GitHub (`git add . && git commit -m "config supabase" && git push`) — Vercel redéploie automatiquement.

Une fois configuré : les visiteurs peuvent créer un compte, se connecter, et leurs scores sont sauvegardés automatiquement à la fin de chaque partie, quelle que soit la langue utilisée. Le bouton "Mon compte" / "My account" affiche l'historique des 10 derniers scores, avec les noms de jeux et niveaux traduits dans la langue active.

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
jeu-orthographe.html      → jeu "Chasse aux fautes" / "Spot the Mistake"
dictee.html                → jeu "Dictée vocale" / "Listening Dictation"
bonne-phrase.html         → jeu "La bonne phrase" / "Pick the Right Sentence"
style.css                 → styles partagés par toutes les pages
script-orthographe.js      → logique + contenu FR/EN du jeu Chasse aux fautes
script-dictee.js           → logique + contenu FR/EN du jeu Dictée vocale
script-bonne-phrase.js     → logique + contenu FR/EN du jeu La bonne phrase
script-lang.js             → sélecteur de langue FR/EN et traductions de l'interface
script-auth.js             → connexion, inscription, sauvegarde des scores (Supabase)
supabase-config.js         → tes identifiants Supabase (à compléter)
setup-supabase.sql         → script SQL à exécuter une fois dans Supabase
```

## À savoir
- Le jeu "Dictée vocale" utilise la synthèse vocale du navigateur (Web Speech API) : elle fonctionne mieux sur Chrome ou Edge, en français comme en anglais.
- Tant que `supabase-config.js` n'est pas complété avec de vrais identifiants, les boutons de connexion ne fonctionneront pas (erreur dans la console du navigateur).
- Ajouter de nouvelles langues plus tard : dupliquer un bloc de traductions dans `script-lang.js` et les jeux de phrases dans chaque `script-*.js`, sous une nouvelle clé de langue.
