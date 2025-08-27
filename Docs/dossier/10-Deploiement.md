# 10. Déploiement et infrastructure

## 10.1 MongoDB Atlas et configuration du cluster

### Configuration MongoDB Atlas

#### Cluster setup
- **Provider** : MongoDB Atlas (AWS)
- **Région** : Europe (Paris) pour latence optimale
- **Tier** : M0 (gratuit) pour développement, M10+ pour production
- **Version** : MongoDB 7.0+ avec dernières fonctionnalités

#### Configuration réseau
- **IP Whitelist** : Adresses IP autorisées uniquement
- **VPC Peering** : Connexion privée avec l'infrastructure
- **TLS/SSL** : Chiffrement en transit obligatoire
- **Authentification** : Base de données + application

#### Configuration de sécurité
```javascript
// .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/invoke?retryWrites=true&w=majority
MONGODB_USER=invoke_user
MONGODB_PASS=secure_password
MONGODB_DB=invoke_production
```

### Optimisation des performances

#### Index stratégiques
```javascript
// Index sur les champs de recherche fréquents
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1, "isDM": 1 });
db.sessions.createIndex({ "date": 1, "status": 1 });
db.games.createIndex({ "featured": 1, "createdAt": -1 });
```

#### Monitoring et alertes
- **Métriques** : Connexions actives, requêtes lentes
- **Alertes** : Utilisation CPU > 80%, mémoire > 90%
- **Backup** : Sauvegarde automatique quotidienne
- **Rétention** : 30 jours de sauvegardes

## 10.2 Hébergement du front-end (Vercel/Netlify)

### Choix de la plateforme

#### Vercel (recommandé)
- **Avantages** : Déploiement automatique, CDN global, analytics
- **Intégration** : GitHub/GitLab automatique
- **Performance** : Edge functions, optimisations automatiques
- **Prix** : Gratuit pour projets personnels

#### Netlify (alternative)
- **Avantages** : Interface simple, forms, functions
- **Intégration** : Déploiement continu depuis Git
- **Performance** : CDN mondial, compression automatique
- **Prix** : Plan gratuit généreux

### Configuration Vercel
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "https://api.invoke.com"
  }
}
```

### Déploiement automatique
- **Trigger** : Push sur la branche main
- **Build** : `npm run build` automatique
- **Preview** : Déploiement sur PR pour tests
- **Rollback** : Retour à la version précédente en cas de problème

## 10.3 Conteneurisation et orchestration (Docker, options K8s)

### Containerisation avec Docker

#### Dockerfile Backend
```dockerfile
# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./
RUN npm ci --only=production

# Copie du code source
COPY . .

# Création de l'utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Exposition du port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]
```

#### Dockerfile Frontend
```dockerfile
# client/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./server
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
    depends_on:
      - mongodb

  frontend:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - backend

  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

### Orchestration Kubernetes (perspectives)

#### Déploiement K8s
- **Cluster** : GKE, EKS ou AKS selon le cloud provider
- **Services** : Load balancing et service discovery
- **Ingress** : Gestion du trafic HTTP/HTTPS
- **HPA** : Auto-scaling basé sur la charge

#### Configuration Kubernetes
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: invoke-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: invoke-backend
  template:
    metadata:
      labels:
        app: invoke-backend
    spec:
      containers:
      - name: backend
        image: invoke/backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
```

## 10.4 Supervision et observabilité (logs, métriques)

### Système de logging

#### Winston configuration
```javascript
// server/src/config/logger.config.js
import winston from 'winston';
import 'winston-daily-rotate-file';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d'
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d'
    })
  ]
});

export default logger;
```

#### Logs structurés
- **Format** : JSON avec métadonnées
- **Niveaux** : Error, Warn, Info, Debug
- **Contexte** : User ID, session ID, request ID
- **Rotation** : Fichiers quotidiens avec rétention

### Monitoring et métriques

#### Métriques système
- **CPU** : Utilisation et charge moyenne
- **Mémoire** : Utilisation RAM et swap
- **Disque** : Espace libre et I/O
- **Réseau** : Trafic entrant/sortant

#### Métriques applicatives
- **API** : Temps de réponse, taux d'erreur
- **Base de données** : Connexions, requêtes lentes
- **Utilisateurs** : Sessions actives, authentifications
- **Performance** : Core Web Vitals, temps de chargement

### Alertes et notifications

#### Seuils d'alerte
- **Critique** : Service indisponible, erreurs 5xx > 5%
- **Warning** : Temps de réponse > 1s, CPU > 80%
- **Info** : Nouveaux déploiements, utilisateurs actifs

#### Canaux de notification
- **Email** : Alertes critiques et rapports quotidiens
- **Slack** : Notifications en temps réel
- **SMS** : Alertes critiques uniquement
- **Dashboard** : Interface de monitoring en temps réel

### Outils de supervision

#### Infrastructure
- **Prometheus** : Collecte de métriques
- **Grafana** : Visualisation et dashboards
- **AlertManager** : Gestion des alertes
- **Node Exporter** : Métriques système

#### Application
- **New Relic** : APM et monitoring utilisateur
- **Sentry** : Gestion des erreurs et performance
- **LogRocket** : Session replay et debugging
- **Google Analytics** : Métriques utilisateur

---

*[Retour au sommaire](./README.md)*
