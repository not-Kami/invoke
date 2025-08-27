# 🎨 INVOKE Client - Frontend React + TypeScript

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC.svg)](https://tailwindcss.com/)

**Frontend moderne et responsive** pour la plateforme INVOKE, construite avec React 18, TypeScript et Tailwind CSS. Interface utilisateur immersive avec design fantasy pour la gestion de communautés RPG.

## 🚀 Démo Live

- **URL de développement** : [http://localhost:5173](http://localhost:5173)
- **Build de production** : `npm run build`
- **Prévisualisation** : `npm run preview`

## ✨ Fonctionnalités Frontend

### 🎯 Interface Utilisateur
- **Dashboard personnalisé** selon le rôle (Admin, User, DM)
- **Design fantasy immersif** avec thème sombre/clair
- **Interface responsive** mobile-first optimisée
- **Navigation intuitive** avec React Router

### 🎲 Gestion des Jeux
- **Catalogue visuel** avec carousel et grilles
- **Système de favoris** et collections personnelles
- **Recherche et filtrage** avancés
- **Gestion des jeux maîtrisés**

### 👥 Gestion des Utilisateurs
- **Profils personnalisables** avec avatars
- **Système d'authentification** JWT
- **Gestion des rôles** et permissions
- **Interface d'administration** complète

### 📅 Sessions et Campagnes
- **Planification visuelle** des sessions
- **Gestion des campagnes** long terme
- **Calendrier intégré** avec réservations
- **Système de notifications**

## 🛠️ Stack Technique

### **Core Framework**
- **React 18.2.0** - Bibliothèque UI moderne
- **TypeScript 5.2.2** - Typage statique avancé
- **Vite 5.4.19** - Build tool ultra-rapide

### **Styling & UI**
- **Tailwind CSS 4.1.11** - Framework CSS utilitaire
- **PostCSS 8.5.6** - Post-processing CSS
- **Autoprefixer 10.4.21** - Compatibilité navigateurs

### **State Management & Routing**
- **React Context API** - Gestion d'état globale
- **React Router DOM 6.20.1** - Routing côté client
- **React Hook Form 7.48.2** - Gestion des formulaires

### **HTTP & Utilitaires**
- **Axios 1.11.0** - Client HTTP robuste
- **clsx 2.0.0** - Utilitaires CSS conditionnels
- **tailwind-merge 2.1.0** - Fusion intelligente des classes

### **Icons & Composants**
- **Lucide React 0.294.0** - Icônes modernes et cohérentes
- **Hookform Resolvers 3.3.2** - Validation des formulaires

## 🚀 Installation et Démarrage

### Prérequis
- **Node.js** 18+ 
- **npm** ou **yarn**
- **Backend INVOKE** en cours d'exécution

### 1. Installation des dépendances
```bash
cd client
npm install
```

### 2. Configuration de l'environnement
```bash
# Créer un fichier .env.local (optionnel)
cp .env.example .env.local

# Variables d'environnement disponibles
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=INVOKE
VITE_APP_VERSION=1.0.0
```

### 3. Démarrage du serveur de développement
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:5173](http://localhost:5173)

## 📁 Structure du Projet

```
client/
├── 📁 public/              # Assets statiques
│   ├── favicon.ico
│   └── index.html
├── 📁 src/
│   ├── 📁 assets/          # Images, fonts, etc.
│   ├── 📁 components/      # Composants réutilisables
│   │   ├── 📁 ui/          # Composants UI de base
│   │   ├── 📁 forms/       # Composants de formulaires
│   │   └── 📁 layout/      # Composants de mise en page
│   ├── 📁 contexts/        # Contextes React (état global)
│   ├── 📁 hooks/           # Hooks personnalisés
│   ├── 📁 lib/             # Utilitaires et configurations
│   ├── 📁 pages/           # Pages de l'application
│   ├── 📁 types/           # Définitions TypeScript
│   ├── 📁 utils/           # Fonctions utilitaires
│   ├── App.tsx             # Composant racine
│   ├── main.tsx            # Point d'entrée
│   └── index.css           # Styles globaux
├── 📁 node_modules/        # Dépendances
├── package.json            # Configuration npm
├── tsconfig.json           # Configuration TypeScript
├── vite.config.ts          # Configuration Vite
├── tailwind.config.js      # Configuration Tailwind
├── postcss.config.js       # Configuration PostCSS
└── eslint.config.js        # Configuration ESLint
```

## 🎨 Design System

### **Thème Fantasy**
- **Palette de couleurs** : Tons sombres et mystiques
- **Typographie** : Fonts lisibles et immersives
- **Composants** : Design cohérent et moderne
- **Animations** : Transitions fluides et élégantes

### **Responsive Design**
- **Mobile-first** : Optimisé pour les petits écrans
- **Breakpoints** : Adaptatif à tous les appareils
- **Touch-friendly** : Interface optimisée tactile
- **Performance** : Chargement rapide sur mobile

## 🧪 Scripts Disponibles

### **Développement**
```bash
npm run dev          # Serveur de développement Vite
npm run build        # Build de production
npm run preview      # Prévisualisation du build
npm run lint         # Vérification ESLint
```

### **Build et Déploiement**
```bash
# Build de production
npm run build

# Prévisualiser le build
npm run preview

# Analyser le bundle
npm run build -- --analyze
```

## 🔧 Configuration

### **Vite Configuration** (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

### **Tailwind Configuration** (`tailwind.config.js`)
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette fantasy personnalisée
      },
      fontFamily: {
        // Fonts personnalisées
      }
    },
  },
  plugins: [],
}
```

### **TypeScript Configuration** (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 🌐 Intégration API

### **Configuration Axios**
```typescript
// src/lib/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  withCredentials: true,
  timeout: 10000
})

// Intercepteurs pour JWT et gestion d'erreurs
api.interceptors.request.use(/* ... */)
api.interceptors.response.use(/* ... */)

export default api
```

### **Endpoints Principaux**
- **Users** : `/api/v1/users`
- **Games** : `/api/v1/games`
- **Sessions** : `/api/v1/sessions`
- **Campaigns** : `/api/v1/campaigns`
- **Auth** : `/api/v1/auth`

## 🎯 Composants Clés

### **Layout Components**
- `Header` - Navigation principale et authentification
- `Sidebar` - Menu latéral avec navigation
- `Footer` - Pied de page avec informations
- `Layout` - Structure principale de l'application

### **UI Components**
- `Button` - Boutons avec variantes et états
- `Card` - Conteneurs de contenu
- `Modal` - Fenêtres modales
- `Form` - Composants de formulaires
- `Table` - Tableaux de données

### **Feature Components**
- `GameCard` - Affichage des jeux
- `SessionCalendar` - Calendrier des sessions
- `UserProfile` - Profils utilisateurs
- `AdminPanel` - Interface d'administration

## 🔒 Sécurité

### **Authentification JWT**
- **Cookies sécurisés** pour le stockage des tokens
- **Intercepteurs Axios** pour l'injection automatique
- **Gestion des sessions** avec expiration
- **Protection des routes** sensibles

### **Validation des Données**
- **React Hook Form** avec validation côté client
- **TypeScript** pour la sécurité des types
- **Sanitisation** des entrées utilisateur

## 📱 Responsive Design

### **Breakpoints Tailwind**
```css
/* Mobile First */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### **Stratégies d'Adaptation**
- **Mobile-first** : Design optimisé pour petits écrans
- **Progressive enhancement** : Amélioration progressive sur grands écrans
- **Touch targets** : Éléments tactiles optimisés
- **Performance** : Chargement optimisé selon l'appareil

## 🚀 Optimisations de Performance

### **Code Splitting**
- **Lazy loading** des composants
- **Route-based splitting** avec React Router
- **Dynamic imports** pour les fonctionnalités non critiques

### **Bundle Optimization**
- **Tree shaking** automatique avec Vite
- **Minification** des assets
- **Compression** des bundles
- **Source maps** pour le debugging

## 🧪 Tests

### **Configuration des Tests**
```bash
# Installation des dépendances de test
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Exécution des tests
npm test
```

### **Types de Tests**
- **Unit Tests** : Composants individuels
- **Integration Tests** : Interactions entre composants
- **E2E Tests** : Scénarios utilisateur complets

## 🐛 Dépannage

### **Problèmes Courants**

1. **Erreur de compilation TypeScript**
   ```bash
   # Vérifier la configuration
   npx tsc --noEmit
   
   # Réinstaller les dépendances
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Erreur de build Vite**
   ```bash
   # Nettoyer le cache
   rm -rf node_modules/.vite
   
   # Rebuild
   npm run build
   ```

3. **Problèmes de styles Tailwind**
   ```bash
   # Rebuild Tailwind
   npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch
   ```

### **Mode Debug**
```bash
# Activer les logs de développement
npm run dev -- --debug

# Vérifier les variables d'environnement
console.log(import.meta.env)
```

## 📚 Ressources et Documentation

### **Documentation Officielle**
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### **Outils de Développement**
- **React Developer Tools** - Extension navigateur
- **TypeScript Playground** - Test des types
- **Vite Inspector** - Inspection du code source

## 🤝 Contribution

### **Standards de Code**
- **ESLint** configuré pour React + TypeScript
- **Prettier** pour le formatage automatique
- **Conventional Commits** pour les messages
- **TypeScript strict mode** activé

### **Workflow de Développement**
1. **Fork** le projet
2. **Créer** une branche feature
3. **Développer** avec tests
4. **Linter** et formater le code
5. **Commit** avec message conventionnel
6. **Push** et créer une Pull Request

## 📅 Roadmap Frontend

### **Phase 1 : Fondations** ✅
- [x] Architecture React + TypeScript
- [x] Configuration Vite + Tailwind
- [x] Système de routing
- [x] Composants UI de base

### **Phase 2 : Fonctionnalités** ✅
- [x] Authentification et gestion des rôles
- [x] Dashboard personnalisé
- [x] Gestion des jeux et sessions
- [x] Interface d'administration

### **Phase 3 : Optimisations** 🔄
- [ ] Tests unitaires et d'intégration
- [ ] Optimisations de performance
- [ ] PWA et offline support
- [ ] Internationalisation

## 📄 Licence

Ce projet est sous licence **ISC**. Voir le fichier [LICENSE](../LICENSE) pour plus de détails.

---

**Frontend INVOKE - Construit avec React, TypeScript et Tailwind CSS**

*Où l'interface rencontre l'aventure* 🎮✨
