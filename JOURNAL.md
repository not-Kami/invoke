## 2026-09-29 — session

- **Mouvement** : tour local de l'app (client Vite + API + Mongo Docker). `server/.env` local créé pour le dev. Pas de commit.
- **Encore ouvert** :
  - Données fictives du dashboard
  - Page mot de passe oublié vide
  - Mélange FR/EN et stats hero en dur
- **Ensuite** : prioriser les bugs d'usage (erreurs silencieuses, page blanche, débordement profil)

### Note

Lancement local, puis parcours accueil, catalogue, sessions, campagnes, about, contact, auth, onboarding, dashboard, profil et création de session.

## 2026-09-29 — avis production

- **Mouvement** : aucun code. Estimation de mise en production après le tour.
- **Encore ouvert** : démo possible, produit public non.
- **Ensuite** : retirer le faux contenu, réparer les impasses (mot de passe, erreurs, catalogue), puis seulement déployer.

### Note

Réponse : vitrine ou bêta fermée oui, après un passage d'honnêteté. Service ouvert à des inconnus, non en l'état. Aucun test automatisé dans le repo.

## 2026-09-29 — bêta sans BMAD

- **Mouvement** : aucun code. Choix de méthode pour la bêta fermée.
- **Encore ouvert** : cadrage court puis premier chantier (contenu fictif du dashboard).
- **Ensuite** : avancer story par story dans le repo, sans installer BMAD.

### Note

BMAD n'est pas dans le dépôt. Recommandation : s'en passer, le périmètre est déjà connu.

## 2026-09-29 — branche demo

- **Mouvement** : branche locale `demo` depuis `production`. Suivi racine (`AGENTS.md`, `TODO.md`, `NEXT.md`, `PROGRESS.md`). Stratégie dans `Docs/STRATEGIE-MARKETING.md`. Aperçu dashboard (personnage, table, activité) enrichi, toujours fictif et marqué Preview. Pas de commit.
- **Encore ouvert** :
  - Relire l'aperçu avec toi
  - Bêta à ouvrir depuis `production`, pas depuis `demo`
- **Ensuite** : figer la vitrine, puis la table d'amorçage sur la future branche bêta

### Note

La démo montre ce que le dashboard pourra faire. La bêta n'affichera ces fiches que lorsqu'elles viendront de la base.

## 2026-09-30 — périmètre bêta

- **Mouvement** : aucun code. Le périmètre change : la bêta inclut personnage, table et activité, pas seulement le compte et les sessions.
- **Encore ouvert** :
  - Brancher `/api/v1/characters` sur le dashboard
  - Compléter les tables (liste des miennes) et un fil d'activité réel
- **Ensuite** : personnages d'abord, sur une branche `beta` tirée de `production`

### Note

L'API personnage et une partie des tables existent déjà. L'écran démo ne les appelle pas. Recruter un MJ et la facturation restent hors bêta.

## 2026-09-30 — figer demo

- **Mouvement** : commit de la vitrine sur `demo` (aperçu dashboard, suivi Atelier, stratégie). Les lockfiles npm ne sont pas inclus.
- **Encore ouvert** : pousser `demo`, puis personnages sur `beta`.
- **Ensuite** : une fonctionnalité à la fois, en commençant par les personnages du compte.

### Note

`demo` reste la vitrine. Le développement réel part sur `beta`.
