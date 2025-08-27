# 7. Architecture & Gestion Git

## 7.1 Architecture technique

### Diagramme d'architecture globale
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Base de       │
│   (React)       │◄──►│   (Node/Express)│◄──►│   données       │
│                 │    │                 │    │   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vite Build    │    │   Middlewares   │    │   Atlas Cloud   │
│   Tailwind CSS  │    │   JWT Auth      │    │   Clustering    │
│   TypeScript    │    │   Rate Limiting │    │   Backup Auto   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Structure des dossiers backend
```
server/
├── src/
│   ├── config/           # Configuration (DB, app, dotenv)
│   ├── resources/        # Modules métier
│   │   ├── user/         # Gestion des utilisateurs
│   │   ├── game/         # Gestion des jeux
│   │   ├── session/      # Gestion des sessions
│   │   ├── campaign/     # Gestion des campagnes
│   │   ├── auth/         # Authentification
│   │   └── upload/       # Gestion des uploads
│   ├── middlewares/      # Middlewares personnalisés
│   ├── utils/            # Utilitaires et helpers
│   └── app.js            # Point d'entrée principal
├── uploads/              # Stockage des fichiers
├── logs/                 # Fichiers de logs
└── docs/                 # Documentation API
```

### Structure des dossiers frontend
```
client/
├── src/
│   ├── components/       # Composants réutilisables
│   │   ├── ui/          # Composants de base
│   │   ├── layout/      # Composants de mise en page
│   │   └── forms/       # Composants de formulaires
│   ├── pages/           # Pages de l'application
│   ├── hooks/           # Hooks personnalisés
│   ├── contexts/        # Context API
│   ├── lib/             # Utilitaires et configurations
│   ├── types/           # Définitions TypeScript
│   └── assets/          # Images, icônes, etc.
├── public/              # Assets statiques
└── dist/                # Build de production
```

## 7.2 Workflow Git

### Branches principales
- **`main`** : Branche stable, code de production
- **`dev`** : Branche d'intégration courante, tests et développement

### Branches fonctionnalités
- **`feature/*`** : Nouvelles fonctionnalités
- **`fix/*`** : Corrections de bugs
- **`front/*`** : Développement frontend
- **`back/*`** : Développement backend
- **`docs/*`** : Documentation et guides

### Workflow de développement
```
1. Création branche depuis `dev`
   git checkout dev
   git pull origin dev
   git checkout -b feature/nouvelle-fonctionnalite

2. Développement et commits atomiques
   git add .
   git commit -m "feat(auth): add JWT refresh mechanism"

3. Push et Pull Request
   git push origin feature/nouvelle-fonctionnalite
   # Créer PR sur GitHub/GitLab

4. Code review et tests
   # Review par un autre développeur
   # Tests automatisés (CI)

5. Merge dans `dev`
   # Squash & merge pour garder l'historique propre

6. Merge `dev` → `main` pour release
   # Merge manuel après validation complète
```

### Convention de commit
Format : `type(scope): description`

**Types :**
- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Documentation
- `style` : Formatage du code
- `refactor` : Refactoring
- `test` : Tests
- `chore` : Tâches de maintenance

**Exemples :**
```bash
feat(auth): add JWT refresh mechanism
fix(sessions): correct timezone handling
docs(api): update authentication endpoints
style(ui): improve button component styling
refactor(backend): simplify user controller
test(api): add integration tests for sessions
chore(deps): update dependencies to latest versions
```

## 7.3 Déploiement

### Environnements
- **Development** : Local avec nodemon + vite
- **Staging** : Serveur de test (optionnel)
- **Production** : Serveur de production

### Configuration
- **Variables d'environnement** : `.env` pour chaque environnement
- **Secrets** : Gestion sécurisée des clés API et mots de passe
- **Base de données** : MongoDB Atlas avec clustering

### Processus de déploiement
1. **Build** : Compilation du frontend avec Vite
2. **Tests** : Exécution des tests automatisés
3. **Déploiement** : Upload des fichiers sur le serveur
4. **Redémarrage** : Relance des services
5. **Vérification** : Tests de santé et monitoring

## 7.4 Monitoring et maintenance

### Logs et monitoring
- **Winston** : Logs structurés avec rotation
- **Health checks** : Endpoints de vérification de santé
- **Métriques** : Performance et utilisation des ressources

### Sécurité
- **Audit des dépendances** : npm audit régulier
- **Mises à jour** : Mise à jour des packages de sécurité
- **Backup** : Sauvegarde automatique de la base de données

### Performance
- **Caching** : Redis pour les données fréquemment accédées
- **Optimisation** : Index MongoDB et requêtes optimisées
- **CDN** : Distribution des assets statiques

---

*[Retour au sommaire](./README.md)*
