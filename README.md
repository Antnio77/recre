# La Récré 🎲

Un centre de jeux pour s'entraîner, disponible en français et en anglais.

**Jeux de langues (gratuits)**
- Chasse aux fautes / Spot the Mistake
- Dictée vocale / Listening Dictation
- La bonne phrase / Pick the Right Sentence

**Mathématiques (gratuits)**
- Calcul mental éclair
- Le bon résultat
- Problèmes du quotidien

**Jeux premium ✨** (accès par code, voir plus bas)
- Conjugaison éclair — conjugue un verbe contre la montre
- Texte à trous — complète des phrases selon le contexte
- Problèmes à plusieurs étapes — problèmes plus corsés, 2 à 4 calculs par énoncé
- Géométrie éclair — périmètres, aires, volumes, contre la montre

Site statique (HTML / CSS / JS) avec comptes utilisateurs, sauvegarde des scores, statistiques, système de niveaux et accès premium via [Supabase](https://supabase.com).

## Système premium (codes de rédemption)

Pas de vrai système de paiement intégré — tu gères la vente toi-même (ex. avec une école), puis tu génères un code que tu leur donnes. Chaque personne qui saisit ce code dans « Mon compte » débloque les 4 jeux premium sur son compte, définitivement.

**Créer un code** : dans Supabase, SQL Editor :
```sql
insert into public.premium_codes (code, label, max_redemptions)
values ('ECOLE-DUPONT-2026', 'École Dupont - 2025/2026', 30);
```
`max_redemptions` = combien de personnes différentes peuvent utiliser CE code (ex. 30 pour une classe de 30 élèves). Tu peux créer un code différent par école, avec un `label` pour t'y retrouver.

**Sécurité** : la table des codes n'est jamais accessible directement depuis le site (aucune policy de lecture) — toute la vérification passe par une fonction Postgres sécurisée. Un utilisateur ne peut donc pas deviner ou lister les codes valides en fouillant dans le code du site.

**Suivre les rédemptions** : Table Editor → `premium_codes`, la colonne `redemption_count` montre combien de fois chaque code a été utilisé. La table `premium_status` liste tous les comptes premium.

## Organisation de la page d'accueil

Un interrupteur en haut de la page d'accueil bascule entre "Jeux de langues" et "Mathématiques" (mémorisé dans le navigateur). Les jeux premium apparaissent dans leur catégorie habituelle, avec une étiquette "✨ Premium" sur leur case. Un compte non-premium qui clique dessus voit un écran l'invitant à saisir son code plutôt que le jeu.

## Changer de langue

Le sélecteur 🇫🇷 / 🇬🇧 en haut à droite bascule toute l'interface. Pour les jeux de langues (gratuits et premium), le contenu est adapté dans chaque langue (pas une traduction mot à mot). Pour les maths, les calculs sont universels ; seuls les énoncés des problèmes et l'interface changent selon la langue.

## Activer les vrais comptes + scores (Supabase)

1. Crée un compte sur [supabase.com](https://supabase.com) et un nouveau projet.
2. Dans **Authentication → Providers → Email**, désactive *"Confirm email"*.
3. Dans **SQL Editor**, exécute dans l'ordre : `setup-supabase.sql`, puis `setup-premium.sql`.
4. Dans **Project Settings → API**, récupère la **Project URL** et la clé **anon public**.
5. Complète `supabase-config.js` avec ces deux valeurs.
6. Pousse sur GitHub — Vercel redéploie automatiquement.

**Si le site existait déjà avant cette mise à jour**, exécute aussi `add-lang-column.sql` si ce n'est pas déjà fait (nécessaire pour le radar de statistiques), puis `setup-premium.sql` pour activer le système premium.

## Système de niveaux

Un badge en haut à droite affiche le niveau du joueur connecté → clic → page "Ma progression" avec un chemin façon jeu vidéo (10 niveaux, grades sur le thème de l'école). Chaque partie rapporte de l'XP selon la réussite et la difficulté (les jeux premium comptent aussi). Réglable dans `script-xp.js`.

## Page statistiques

Accessible depuis "Mon compte" → "Voir mes statistiques" : courbe d'évolution des scores (pondérés par difficulté) et radar Français / Anglais / Mathématiques. Les jeux premium de langues (Conjugaison éclair, Texte à trous) comptent dans les axes Français/Anglais ; les jeux premium de maths comptent dans l'axe Mathématiques.

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
Sur [vercel.com](https://vercel.com) : **Add New → Project** → choisis ton dépôt → laisse tout par défaut → **Deploy**.

Chaque `git push` redéploie automatiquement.

## Structure des fichiers
```
index.html                       → accueil (interrupteur Langues/Maths, badge de niveau)
jeu-orthographe.html             → Chasse aux fautes / Spot the Mistake
dictee.html                       → Dictée vocale / Listening Dictation
bonne-phrase.html                → La bonne phrase / Pick the Right Sentence
calcul-mental.html               → Calcul mental éclair
bon-resultat-maths.html          → Le bon résultat
problemes-quotidien.html         → Problèmes du quotidien
conjugaison-eclair.html          → [Premium] Conjugaison éclair
texte-a-trous.html               → [Premium] Texte à trous
problemes-multi-etapes.html      → [Premium] Problèmes à plusieurs étapes
geometrie-eclair.html            → [Premium] Géométrie éclair
stats.html                        → Page de statistiques
niveau.html                       → Page "Ma progression"

style.css                        → styles partagés
script-lang.js                    → langue FR/EN et traductions
script-category.js                → interrupteur Langues/Maths (accueil)
script-keypad.js                  → pavé numérique tactile partagé
script-auth.js                    → connexion, scores, résumé compte (Supabase)
script-premium.js                 → statut premium + saisie de code (partagé)
script-stats.js                   → graphiques et historique (Chart.js)
script-xp.js / script-level-badge.js / script-niveau.js → système de niveaux

script-orthographe.js / script-dictee.js / script-bonne-phrase.js
script-calcul-mental.js / script-bon-resultat-maths.js / script-problemes-quotidien.js
script-conjugaison-eclair.js / script-texte-a-trous.js
script-problemes-multi-etapes.js / script-geometrie-eclair.js
  → logique + contenu de chaque jeu

supabase-config.js                → tes identifiants Supabase
setup-supabase.sql                → table des scores (nouveau projet)
add-lang-column.sql               → migration colonne lang (si site pré-existant)
setup-premium.sql                 → tables et fonction du système premium
```

## À savoir
- "Dictée vocale" utilise la synthèse vocale du navigateur : fonctionne mieux sur Chrome ou Edge.
- Tant que `supabase-config.js` n'est pas complété, la connexion et le premium ne fonctionnent pas.
- Minuteurs (Calcul mental, Conjugaison, Géométrie) : 15s (facile) / 10s (moyen) / 8s (difficile) par question.
- Les graphiques de la page statistiques nécessitent un accès internet (Chart.js via CDN), comme Supabase.
