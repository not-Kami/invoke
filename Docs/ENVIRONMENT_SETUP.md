# 🌍 Configuration des Environnements (Décentralisée)

Ce document explique comment gérer les différents environnements (development, staging, production) dans le projet Invoke avec une approche décentralisée.

## 📁 Structure des Fichiers (Décentralisée)

```
invoke/
├── client/
│   ├── .env.development     # Configuration client - développement
│   ├── .env.staging         # Configuration client - staging
│   ├── .env.production      # Configuration client - production
│   ├── .env                 # Fichier actuel (généré automatiquement)
│   └── scripts/
│       └── set-env.js       # Script de configuration client
├── server/
│   ├── .env.development     # Configuration serveur - développement
│   ├── .env.staging         # Configuration serveur - staging
│   ├── .env.production      # Configuration serveur - production
│   ├── .env                 # Fichier actuel (généré automatiquement)
│   └── scripts/
│       └── set-env.js       # Script de configuration serveur
└── scripts/
    └── set-environment.js   # Script orchestration
```

## 🎯 **Avantages de l'Approche Décentralisée**

- ✅ **Séparation claire** : Chaque composant gère ses propres variables
- ✅ **CI/CD simplifiée** : Déploiement indépendant par composant
- ✅ **Maintenance facile** : Modifications isolées par environnement
- ✅ **Sécurité** : Pas de mélange de variables sensibles
- ✅ **Scalabilité** : Facile d'ajouter de nouveaux composants

## 🚀 Utilisation

### Configuration Complète

```bash
# Configuration complète (client + serveur)
npm run env:dev          # Développement
npm run env:staging      # Staging
npm run env:production   # Production
```

### Configuration Individuelle

```bash
# Serveur uniquement
cd server
npm run env:dev
npm run env:staging
npm run env:production

# Client uniquement
cd client
npm run env:dev
npm run env:staging
npm run env:production
```

### Script Direct

```bash
# Depuis la racine
node scripts/set-environment.js development
node scripts/set-environment.js staging
node scripts/set-environment.js production
```

## 🔧 Variables d'Environnement

### Client (Vite)

| Variable | Development | Staging | Production |
|----------|-------------|---------|------------|
| `VITE_API_BASE_URL` | `http://localhost:3000/api/v1` | `https://dev-api-invoke.onrender.com/api/v1` | `https://invoke-backend.onrender.com/api/v1` |
| `VITE_APP_TITLE` | `Invoke - Development` | `Invoke - Staging` | `Invoke` |
| `VITE_DEBUG` | `true` | `false` | `false` |
| `VITE_ENABLE_DEV_TOOLS` | `true` | `false` | `false` |

### Serveur (Node.js)

| Variable | Development | Staging | Production |
|----------|-------------|---------|------------|
| `NODE_ENV` | `development` | `staging` | `production` |
| `PORT` | `3000` | `3000` | `3000` |
| `FRONTEND_URLS` | `http://localhost:5173,...` | `https://dev-invoke.onrender.com` | `https://invoke.efp.be` |
| `DISABLE_RATE_LIMIT` | `true` | `true` | `false` |
| `LOG_LEVEL` | `debug` | `info` | `warn` |

## 🛡️ Sécurité

### Variables Sensibles

⚠️ **IMPORTANT** : Les variables suivantes doivent être différentes en production :

- `JWT_SECRET` : Doit être changé en production
- `MONGODB_URI` : Devrait pointer vers une DB séparée en production
- `CLOUDINARY_API_SECRET` : Doit être sécurisé

### Fichiers Ignorés

Les fichiers `.env` sont automatiquement ignorés par Git :

```gitignore
# Environnements
.env
.env.local
.env.*.local
```

## 🔄 Workflow de Déploiement (CI/CD)

### **Avantages pour la CI/CD**

L'approche décentralisée simplifie considérablement les pipelines de déploiement :

#### **Déploiement Client (Frontend)**
```yaml
# .github/workflows/deploy-client.yml
- name: Set Client Environment
  run: cd client && npm run env:production
  
- name: Build Client
  run: cd client && npm run build
  
- name: Deploy to Render
  run: # Déploiement du build client
```

#### **Déploiement Serveur (Backend)**
```yaml
# .github/workflows/deploy-server.yml
- name: Set Server Environment
  run: cd server && npm run env:production
  
- name: Deploy to Render
  run: # Déploiement du serveur
```

### **Développement Local**

```bash
# 1. Configuration complète
npm run env:dev

# 2. Installation des dépendances
npm run install:all

# 3. Démarrage
npm run dev
```

### **Déploiement Manuel**

```bash
# Client uniquement
cd client && npm run env:staging && npm run build

# Serveur uniquement  
cd server && npm run env:staging

# Déploiement complet
npm run env:staging && npm run build
```

## 📋 Checklist de Déploiement

### Avant le Déploiement

- [ ] Vérifier que `JWT_SECRET` est sécurisé
- [ ] Vérifier que `MONGODB_URI` pointe vers la bonne DB
- [ ] Vérifier que `FRONTEND_URLS` contient les bonnes URLs
- [ ] Tester la configuration avec `npm run env:show`

### Après le Déploiement

- [ ] Vérifier que l'API répond correctement
- [ ] Vérifier que le frontend se connecte à la bonne API
- [ ] Vérifier les logs pour les erreurs
- [ ] Tester les fonctionnalités principales

## 🐛 Dépannage

### Problèmes Courants

1. **API ne répond pas**
   - Vérifier `VITE_API_BASE_URL` côté client
   - Vérifier `SERVER_URL` côté serveur

2. **Erreurs CORS**
   - Vérifier `FRONTEND_URLS` côté serveur
   - Vérifier `COOKIE_DOMAIN`

3. **Base de données**
   - Vérifier `MONGODB_URI`
   - Vérifier la connectivité réseau

### Commandes de Diagnostic

```bash
# Voir la configuration actuelle
npm run env:show

# Vérifier les variables d'environnement
cd server && node -e "console.log(process.env.NODE_ENV)"
cd client && node -e "console.log(process.env.VITE_API_BASE_URL)"
```

## 📚 Ressources

- [Documentation Vite - Variables d'environnement](https://vitejs.dev/guide/env-and-mode.html)
- [Documentation Node.js - Variables d'environnement](https://nodejs.org/api/process.html#process_process_env)
- [Best Practices - Configuration d'environnement](https://12factor.net/config)

