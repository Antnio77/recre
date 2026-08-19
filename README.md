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

## Système premium et classes (codes de rédemption)

Pas de vrai système de paiement intégré — tu gères la vente toi-même, puis tu génères un ou des codes que tu distribues. **Trois types de codes possibles**, un même compte peut n'en utiliser qu'un :

1. **Code "premium"** — débloque juste les 4 jeux premium, pas de classe. Pour un client individuel.
2. **Code "teacher"** — débloque le premium ET fait de la personne qui l'entre la prof de la classe liée à ce code (elle obtient l'accès à « Espace prof » automatiquement).
3. **Code "student"** — débloque le premium ET ajoute la personne comme élève de la classe liée à ce code (réutilisable N fois, un par élève).

Un code prof + un code élèves qui pointent vers la **même classe** forment ensemble une classe complète : la prof voit le détail de tous les élèves qui ont utilisé le code élèves correspondant.

**Créer une classe complète** (école avec une prof + 30 élèves), dans le SQL Editor de Supabase :
```sql
-- 1. Crée la classe
insert into public.classes (label) values ('École Dupont - CM2 2025/2026');

-- 2. Code prof (normalement 1 seule utilisation)
insert into public.premium_codes (code, label, code_type, class_id, max_redemptions)
select 'PROF-DUPONT-2026', 'École Dupont - Prof', 'teacher', id, 1
from public.classes where label = 'École Dupont - CM2 2025/2026';

-- 3. Code élèves (réutilisable, ici jusqu'à 30 fois)
insert into public.premium_codes (code, label, code_type, class_id, max_redemptions)
select 'ELEVE-DUPONT-2026', 'École Dupont - Élèves', 'student', id, 30
from public.classes where label = 'École Dupont - CM2 2025/2026';
```
Tu donnes `PROF-DUPONT-2026` à la prof, et `ELEVE-DUPONT-2026` à distribuer à ses élèves.

**Créer un code premium simple** (pas de classe) :
```sql
insert into public.premium_codes (code, label, max_redemptions)
values ('SOLO-MARIE-2026', 'Marie - client individuel', 1);
```

**Sécurité** : aucune table (codes, classes, membres) n'est accessible directement depuis le site — toute la logique passe par des fonctions Postgres sécurisées. Impossible de deviner un code ou de voir les données d'une classe qui n'est pas la sienne en fouillant le code du site.

**Suivre l'activité** : Table Editor → `premium_codes` (colonne `redemption_count`), `classes`, `class_members`.

## Ma classe et Espace prof

- **« Ma classe »** (visible par tous, élèves comme prof) : classement de tous les élèves de la classe par XP, avec médailles pour le podium.
- **« Espace prof »** (accès automatique dès que la prof s'est connectée avec le compte ayant entré le code "teacher") : une fiche dépliable par élève avec ses points forts (Français/Anglais/Maths), son score moyen par jeu, et l'historique complet de toutes ses parties.

Ces deux pages sont accessibles depuis la modale « Mon compte » sur n'importe quelle page du site.

## Organisation de la page d'accueil

Un interrupteur en haut de la page d'accueil bascule entre "Jeux de langues" et "Mathématiques" (mémorisé dans le navigateur). Les jeux premium apparaissent dans leur catégorie habituelle, avec une étiquette "✨ Premium" sur leur case. Un compte non-premium qui clique dessus voit un écran l'invitant à saisir son code plutôt que le jeu.

## Changer de langue

Le sélecteur 🇫🇷 / 🇬🇧 en haut à droite bascule toute l'interface. Pour les jeux de langues (gratuits et premium), le contenu est adapté dans chaque langue (pas une traduction mot à mot). Pour les maths, les calculs sont universels ; seuls les énoncés des problèmes et l'interface changent selon la langue.

## Activer les vrais comptes + scores (Supabase)

1. Crée un compte sur [supabase.com](https://supabase.com) et un nouveau projet.
2. Dans **Authentication → Providers → Email**, désactive *"Confirm email"*.
3. Dans **SQL Editor**, exécute dans l'ordre : `setup-supabase.sql`, puis `setup-premium.sql`, puis `setup-classes.sql`.
4. Dans **Project Settings → API**, récupère la **Project URL** et la clé **anon public**.
5. Complète `supabase-config.js` avec ces deux valeurs.
6. Pousse sur GitHub — Vercel redéploie automatiquement.

**Si le site existait déjà avant cette mise à jour**, exécute les scripts manquants dans l'ordre : `add-lang-column.sql` (si pas déjà fait, pour le radar de statistiques), `setup-premium.sql` (si pas déjà fait, pour le premium), puis `setup-classes.sql` (pour activer les classes — sans danger même si `setup-premium.sql` a déjà été exécuté, les codes premium existants restent valides et redeviennent simplement du type "premium" par défaut).

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
classe.html                       → Classement de la classe (élèves + prof)
espace-prof.html                  → Vue admin détaillée pour la prof

style.css                        → styles partagés
script-lang.js                    → langue FR/EN et traductions
script-category.js                → interrupteur Langues/Maths (accueil)
script-keypad.js                  → pavé numérique tactile partagé
script-auth.js                    → connexion, scores, résumé compte (Supabase)
script-premium.js                 → statut premium + saisie de code (partagé)
script-stats.js                   → graphiques et historique (Chart.js)
script-xp.js / script-level-badge.js / script-niveau.js → système de niveaux
script-classe.js                  → classement de la classe
script-espace-prof.js             → vue admin détaillée par élève

script-orthographe.js / script-dictee.js / script-bonne-phrase.js
script-calcul-mental.js / script-bon-resultat-maths.js / script-problemes-quotidien.js
script-conjugaison-eclair.js / script-texte-a-trous.js
script-problemes-multi-etapes.js / script-geometrie-eclair.js
  → logique + contenu de chaque jeu

supabase-config.js                → tes identifiants Supabase
setup-supabase.sql                → table des scores (nouveau projet)
add-lang-column.sql               → migration colonne lang (si site pré-existant)
setup-premium.sql                 → tables et fonction du système premium
setup-classes.sql                 → tables classes/élèves + fonctions de la vue prof
```

## À savoir
- "Dictée vocale" utilise la synthèse vocale du navigateur : fonctionne mieux sur Chrome ou Edge.
- Tant que `supabase-config.js` n'est pas complété, la connexion et le premium ne fonctionnent pas.
- Minuteurs (Calcul mental, Conjugaison, Géométrie) : 15s (facile) / 10s (moyen) / 8s (difficile) par question.
- Les graphiques de la page statistiques nécessitent un accès internet (Chart.js via CDN), comme Supabase.
