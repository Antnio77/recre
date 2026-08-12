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

Site statique (HTML / CSS / JS) avec comptes utilisateurs, sauvegarde des scores, statistiques et système de niveaux via [Supabase](https://supabase.com).

## Organisation de la page d'accueil

Un interrupteur en haut de la page d'accueil bascule entre "Jeux de langues" et "Mathématiques" (le choix est mémorisé dans le navigateur). Le sélecteur 🇫🇷 / 🇬🇧 en haut à droite bascule toute l'interface, indépendamment de la catégorie affichée.

## Le pavé numérique

Les jeux de maths avec réponse à taper (Calcul mental éclair, Problèmes du quotidien) affichent un pavé numérique tactile sous le champ de réponse — pratique sur mobile, mais le clavier physique fonctionne aussi normalement. Composant partagé : `script-keypad.js`.

## Changer de langue

Pour les jeux de langues, les phrases sont de vrais exercices dans chaque langue (pas une traduction mot à mot). Pour les maths, les calculs sont identiques quelle que soit la langue (7×8=56 partout), seuls "Problèmes du quotidien" (énoncés) et l'interface changent. Changer de langue en pleine partie ramène à l'écran de sélection du niveau.

## Système de niveaux

Un badge sur la page d'accueil (sous l'accroche) affiche le niveau actuel du joueur connecté — clique dessus pour ouvrir "Ma progression", une page dédiée avec un chemin façon jeu vidéo à parcourir : 10 niveaux, chacun avec un grade un peu loufoque sur le thème de l'école (Poussin de la Récré → ... → Maître Suprême de la Récré).

Chaque partie rapporte des points d'XP selon la réussite **et** la difficulté choisie (Facile ×10 XP max, Moyen ×20, Difficile ×35 par manche parfaite) — jouer en difficile rapporte donc bien plus qu'en facile, ce qui encourage à progresser plutôt qu'à répéter le niveau facile. Les seuils et les grades sont réglables dans `script-xp.js` si tu veux ajuster la difficulté de progression.

## Activer les vrais comptes + scores (Supabase)

1. Crée un compte sur [supabase.com](https://supabase.com) et un nouveau projet.
2. Dans **Authentication → Providers → Email**, désactive *"Confirm email"*.
3. Dans **SQL Editor**, colle et exécute le contenu de `setup-supabase.sql`.
4. Dans **Project Settings → API**, récupère la **Project URL** et la clé **anon public**.
5. Complète `supabase-config.js` avec ces deux valeurs.
6. Pousse sur GitHub — Vercel redéploie automatiquement.

**Si tu avais déjà déployé le site avant l'ajout de la page statistiques**, exécute en plus `add-lang-column.sql` dans le SQL Editor de Supabase (ajoute la colonne qui permet de savoir si chaque partie a été jouée en français ou en anglais — nécessaire pour le graphique radar et pour rien d'autre, le système de niveaux n'en a pas besoin).

Le bouton "Mon compte" / "My account" affiche un résumé par jeu (meilleur score + nombre de parties), avec un bouton vers la page de statistiques détaillée.

## Page statistiques

Accessible depuis "Mon compte" → "Voir mes statistiques". Deux graphiques (via Chart.js, chargé en CDN, aucune installation requise) :
- **Évolution des scores** — courbe du score (%) partie après partie, pondéré par la difficulté (Facile ×0,6, Moyen ×0,8, Difficile ×1)
- **Points forts** — graphique radar à 3 axes : Français / Anglais / Mathématiques, basé sur la moyenne des scores pondérés de chaque catégorie

En dessous, l'historique complet de toutes les parties jouées, dans une liste défilante (pour ne pas allonger la page indéfiniment).

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
index.html                    → accueil avec interrupteur Langues / Mathématiques + badge de niveau
jeu-orthographe.html          → Chasse aux fautes / Spot the Mistake
dictee.html                    → Dictée vocale / Listening Dictation
bonne-phrase.html             → La bonne phrase / Pick the Right Sentence
calcul-mental.html            → Calcul mental éclair
bon-resultat-maths.html       → Le bon résultat
problemes-quotidien.html      → Problèmes du quotidien
stats.html                     → Page de statistiques (graphiques + historique)
niveau.html                    → Page "Ma progression" (chemin de niveaux)

style.css                     → styles partagés
script-lang.js                 → sélecteur de langue FR/EN et traductions
script-category.js             → interrupteur Langues/Mathématiques (accueil uniquement)
script-keypad.js               → pavé numérique tactile partagé
script-auth.js                 → connexion, inscription, scores, résumé "Mon compte" (Supabase)
script-stats.js                → graphiques et historique de la page statistiques (Chart.js)
script-xp.js                   → calcul des points d'XP et des niveaux (partagé)
script-level-badge.js          → badge de niveau sur la page d'accueil
script-niveau.js               → logique de la page "Ma progression" (chemin de niveaux)

script-orthographe.js          → logique + contenu FR/EN Chasse aux fautes
script-dictee.js               → logique + contenu FR/EN Dictée vocale
script-bonne-phrase.js         → logique + contenu FR/EN La bonne phrase
script-calcul-mental.js        → logique + contenu (langue-agnostique) + minuteur
script-bon-resultat-maths.js   → logique + contenu (langue-agnostique)
script-problemes-quotidien.js  → logique + contenu FR/EN

supabase-config.js             → tes identifiants Supabase
setup-supabase.sql             → script SQL à exécuter une fois dans Supabase (nouveau projet)
add-lang-column.sql            → migration à exécuter si ta base existait déjà avant la page statistiques
```

## À savoir
- "Dictée vocale" utilise la synthèse vocale du navigateur (Web Speech API) : fonctionne mieux sur Chrome ou Edge.
- Tant que `supabase-config.js` n'est pas complété, les boutons de connexion ne fonctionnent pas.
- Le minuteur de "Calcul mental éclair" : 15s (facile) / 10s (moyen) / 8s (difficile) par question.
- Les graphiques de la page statistiques ont besoin d'un accès internet (Chart.js est chargé depuis un CDN), comme Supabase.
