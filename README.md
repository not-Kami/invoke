# 🎮 INVOKE - Plateforme de Gestion de Communautés RPG

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.14.0-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

**INVOKE** est une plateforme complète de gestion de communautés de jeux de rôle sur table (RPG) permettant aux joueurs et maîtres de jeu d'organiser, planifier et gérer leurs sessions de jeu dans un environnement sécurisé et intuitif.

## 🚀 Démo Live

- **Frontend** : [http://localhost:5173](http://localhost:5173)
- **Backend API** : [http://localhost:3000](http://localhost:3000)
- **Documentation API** : [Insomnia Collection](./server/insomnia_collection_complete.json)

## ✨ Fonctionnalités Principales

### 🎯 Gestion des Utilisateurs
- **Système d'authentification** JWT avec cookies sécurisés
- **Profils personnalisables** avec avatars et informations RPG
- **Gestion des rôles** (Admin, User, DM) avec permissions granulaires
- **Système de favoris** et jeux maîtrisés

### 🎲 Gestion des Jeux
- **Catalogue RPG complet** avec genres et systèmes
- **Recherche et filtrage** avancés
- **Gestion des favoris** et collections personnelles
- **Interface d'administration** pour les modérateurs

### 📅 Sessions et Campagnes
- **Planification de sessions** avec calendrier intégré
- **Gestion des campagnes** long terme
- **Système de réservation** et gestion des places
- **Notifications et rappels** automatiques

### 🎨 Interface Moderne
- **Design fantasy** immersif et responsive
- **Dashboard personnalisé** selon le rôle utilisateur
- **Thème sombre/clair** adaptatif
- **Interface mobile-first** optimisée

## 🏗️ Architecture du Projet

```
invoke/
├── 📁 client/          # Frontend React + TypeScript + Vite
├── 📁 server/          # Backend Node.js + Express + MongoDB
├── 📁 docs/            # Documentation complète du projet
└── 📁 .git/            # Contrôle de version
```

### **Frontend (Client)**
- **Framework** : React 18 + TypeScript
- **Build Tool** : Vite 5
- **Styling** : Tailwind CSS 4
- **State Management** : Context API + React Hooks
- **Routing** : React Router DOM 6
- **HTTP Client** : Axios

### **Backend (Server)**
- **Runtime** : Node.js 18+
- **Framework** : Express.js 4.18.2
- **Database** : MongoDB Atlas
- **ODM** : Mongoose 8.14.0
- **Validation** : Joi 17.13.3
- **Security** : Helmet, CORS, Rate Limiting
- **Logging** : Winston 3.17.0

## 🚀 Installation Rapide

### Prérequis
- **Node.js** 18+ 
- **MongoDB Atlas** compte
- **Git**

### 1. Cloner le projet
```bash
git clone <repository-url>
cd invoke
```

### 2. Installer les dépendances
```bash
# Installer le backend
cd server
npm install

# Installer le frontend
cd ../client
npm install
```

### 3. Configuration
```bash
# Backend - Créer .env
cd ../server
cp .env.example .env
# Éditer .env avec vos paramètres MongoDB

# Frontend - Configuration automatique
cd ../client
# Aucune configuration requise
```

### 4. Démarrer l'application
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev
```

## 📊 État d'Avancement

| Composant | Progression | Statut |
|-----------|-------------|--------|
| **Backend API** | 75% | ✅ Fonctionnel |
| **Frontend UI** | 70% | ✅ Interface complète |
| **Documentation** | 90% | ✅ Presque terminée |
| **Tests** | 5% | ❌ À implémenter |
| **Sécurité** | 60% | ⚠️ Vulnérabilités identifiées |

## 🚨 Priorités Critiques

### **Sécurité (URGENT)**
- Tests de sécurité sur toutes les routes
- Validation des middlewares de protection
- Tests d'upload malveillant
- Tests d'élévation de privilèges

### **Tests (Priorité Haute)**
- Tests unitaires avec Jest
- Tests d'intégration API
- Tests de sécurité automatisés
- Couverture de code 80%+

## 📚 Documentation

- **[📖 Documentation Complète](./docs/)** - Guide détaillé du projet
- **[🎯 Méthodologie](./docs/dossier/11-Methodologie.md)** - Roadmap et planning
- **[🔒 Sécurité](./client/SECURITY.md)** - Guide de sécurité
- **[📋 TODO](./docs/TODO.md)** - Liste des tâches et fonctionnalités

## 🧪 Tests et Développement

### Scripts Disponibles

#### Backend
```bash
cd server
npm run dev      # Démarrage avec nodemon
npm start        # Production
npm run seed     # Peupler la base de données
```

#### Frontend
```bash
cd client
npm run dev      # Démarrage Vite
npm run build    # Build de production
npm run lint     # Vérification ESLint
npm run preview  # Prévisualisation build
```

### Base de Données
```bash
# Peupler avec des données de test
cd server
npm run seed
```

## 🔧 Configuration Avancée

### Variables d'Environnement Backend
```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/invoke_db

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
```

### Configuration Frontend
- **Port** : 5173 (configurable dans `vite.config.ts`)
- **API Base URL** : `http://localhost:3000/api/v1`
- **Build Output** : `dist/`

## 🐛 Dépannage

### Problèmes Courants

1. **Erreur de connexion MongoDB**
   - Vérifier l'URI de connexion
   - S'assurer que MongoDB Atlas est accessible
   - Vérifier les paramètres réseau

2. **Port déjà utilisé**
   - Changer le PORT dans `.env`
   - Arrêter les processus existants

3. **Erreurs de validation**
   - Vérifier le format des données
   - S'assurer que tous les champs requis sont présents

### Mode Debug
```bash
# Backend
NODE_ENV=development npm run dev

# Frontend
npm run dev -- --debug
```

## 🤝 Contribution

### Workflow de Développement
1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

### Standards de Code
- **ESLint** configuré pour React + TypeScript
- **Prettier** pour le formatage
- **Conventional Commits** pour les messages
- **Tests** obligatoires pour les nouvelles fonctionnalités

## 📅 Planning et Deadlines

- **🚨 Tests de Sécurité** : 16 août 2025 (CRITIQUE)
- **🧪 Tests d'Intégration** : 17 août 2025
- **📚 Documentation Finale** : 18 août 2025
- **🎯 Démonstration** : 18 août 2025

## 📄 Licence

Ce projet est sous licence **ISC**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

- **Issues** : [Créer une issue](../../issues)
- **Documentation** : [📖 Docs](./docs/)
- **Sécurité** : [🔒 Security Guide](./client/SECURITY.md)

---

## 🎯 Prochaines Étapes

1. **🔒 Tests de Sécurité** - Validation des vulnérabilités identifiées
2. **🧪 Tests d'Intégration** - Validation complète de l'API
3. **📚 Documentation Finale** - Guides utilisateur et technique
4. **🚀 Déploiement** - Mise en production après validation sécurité

---

**Construit avec ❤️ pour la communauté RPG**

*INVOKE - Où l'aventure commence*
