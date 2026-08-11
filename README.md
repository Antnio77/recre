# La Récré 🎲

Un centre de jeux pour s'entraîner, disponible en français et en anglais :

**Jeux de langues**
- **Chasse aux fautes / Spot the Mistake** — repère et corrige les mots mal orthographiés
- **Dictée vocale / Listening Dictation** — écoute une phrase et écris-la sans faute
- **La bonne phrase / Pick the Right Sentence** — choisis la phrase correcte parmi plusieurs

**Mathématiques**
- **Calcul mental éclair** — résous un maximum de calculs avant la fin du temps imparti (minuteur)
- **Le bon résultat** — un calcul, plusieurs résultats proposés, un seul est correct
- **Problèmes du quotidien** — petits problèmes concrets à résoudre (disponibles en FR et EN)

Site statique (HTML / CSS / JS) avec comptes utilisateurs et sauvegarde des scores via [Supabase](https://supabase.com).

## Organisation de la page d'accueil

Un interrupteur en haut de la page d'accueil bascule entre "Jeux de langues" et "Mathématiques" (le choix est mémorisé dans le navigateur). Le sélecteur 🇫🇷 / 🇬🇧 en haut à droite bascule toute l'interface, indépendamment de la catégorie affichée.

## Le pavé numérique

Les jeux de maths avec réponse à taper (Calcul mental éclair, Problèmes du quotidien) affichent un pavé numérique tactile sous le champ de réponse — pratique sur mobile, mais le clavier physique fonctionne aussi normalement. Composant partagé : `script-keypad.js`.

## Changer de langue

Pour les jeux de langues, les phrases sont de vrais exercices dans chaque langue (pas une traduction mot à mot). Pour les maths, les calculs sont identiques quelle que soit la langue (7×8=56 partout), seuls "Problèmes du quotidien" (énoncés) et l'interface changent. Changer de langue en pleine partie ramène à l'écran de sélection du niveau.

## Activer les vrais comptes + scores (Supabase)

1. Crée un compte sur [supabase.com](https://supabase.com) et un nouveau projet.
2. Dans **Authentication → Providers → Email**, désactive *"Confirm email"*.
3. Dans **SQL Editor**, colle et exécute le contenu de `setup-supabase.sql`.
4. Dans **Project Settings → API**, récupère la **Project URL** et la clé **anon public**.
5. Complète `supabase-config.js` avec ces deux valeurs.
6. Pousse sur GitHub — Vercel redéploie automatiquement.

Le bouton "Mon compte" / "My account" affiche l'historique des 10 derniers scores, tous jeux confondus, avec les noms traduits dans la langue active.

## Mettre le site en ligne avec Vercel (gratuit)

### 1. Créer le dépôt GitHub
```bash
git init
git add .
git commit -m "Premier envoi de La Récré"
git branch -M main
git remote add origin https://github.com/TON-PSEUDO/la-recre.git
git push -u origin main
```

### 2. Connecter Vercel à GitHub
Sur [vercel.com](https://vercel.com) : **Add New → Project** → choisis ton dépôt → laisse tout par défaut (site statique, aucune config nécessaire) → **Deploy**.

Adresse obtenue : `la-recre.vercel.app`. Chaque `git push` redéploie automatiquement.

## Structure des fichiers
```
index.html                    → accueil avec interrupteur Langues / Mathématiques
jeu-orthographe.html          → Chasse aux fautes / Spot the Mistake
dictee.html                    → Dictée vocale / Listening Dictation
bonne-phrase.html             → La bonne phrase / Pick the Right Sentence
calcul-mental.html            → Calcul mental éclair
bon-resultat-maths.html       → Le bon résultat
problemes-quotidien.html      → Problèmes du quotidien

style.css                     → styles partagés
script-lang.js                 → sélecteur de langue FR/EN et traductions
script-category.js             → interrupteur Langues/Mathématiques (accueil uniquement)
script-keypad.js               → pavé numérique tactile partagé
script-auth.js                 → connexion, inscription, scores (Supabase)

script-orthographe.js          → logique + contenu FR/EN Chasse aux fautes
script-dictee.js               → logique + contenu FR/EN Dictée vocale
script-bonne-phrase.js         → logique + contenu FR/EN La bonne phrase
script-calcul-mental.js        → logique + contenu (langue-agnostique) + minuteur
script-bon-resultat-maths.js   → logique + contenu (langue-agnostique)
script-problemes-quotidien.js  → logique + contenu FR/EN

supabase-config.js             → tes identifiants Supabase
setup-supabase.sql             → script SQL à exécuter une fois dans Supabase
```

## À savoir
- "Dictée vocale" utilise la synthèse vocale du navigateur (Web Speech API) : fonctionne mieux sur Chrome ou Edge.
- Tant que `supabase-config.js` n'est pas complété, les boutons de connexion ne fonctionnent pas.
- Le minuteur de "Calcul mental éclair" : 15s (facile) / 10s (moyen) / 8s (difficile) par question.
