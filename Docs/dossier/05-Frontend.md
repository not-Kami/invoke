# 5. Frontend

## 5.1 Stack & structure

### Technologies principales
- **React 18** : Bibliothèque UI moderne avec hooks et concurrent features
- **TypeScript** : Typage statique pour la robustesse du code
- **Vite** : Build tool ultra-rapide avec HMR optimisé
- **Tailwind CSS v3.4** : Framework CSS utility-first avec configuration personnalisée

### Structure des dossiers
```
client/src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants de base (Button, Card, etc.)
│   ├── layout/         # Composants de mise en page
│   ├── forms/          # Composants de formulaires
│   ├── auth/           # Composants d'authentification
│   ├── dashboard/      # Composants du tableau de bord
│   ├── sessions/       # Composants de gestion des sessions
│   ├── games/          # Composants de gestion des jeux
│   ├── admin/          # Composants d'administration
│   ├── profile/        # Composants de profil utilisateur
│   └── onboarding/     # Composants d'intégration
├── pages/              # Pages de l'application
├── hooks/              # Hooks personnalisés
│   └── admin/          # Hooks spécifiques à l'administration
├── contexts/           # Context API pour l'état global
├── lib/                # Utilitaires et configurations
│   ├── api.ts          # Point d'entrée centralisé pour tous les appels API
│   └── utils.ts        # Fonctions utilitaires
├── types/              # Définitions TypeScript
├── utils/              # Utilitaires supplémentaires
└── assets/             # Images, icônes, etc.
```

### Point d'entrée API centralisé : `api.ts`
Le fichier `client/src/lib/api.ts` est **essentiel** et constitue le cœur de la communication avec le backend. Il centralise :

- **Types TypeScript** : Interfaces complètes pour User, Session, Campaign, Game, Conversation
- **Fonction utilitaire `apiCall`** : Gestion centralisée des erreurs, normalisation des réponses, gestion des cookies
- **Endpoints organisés par domaine** :
  - `adminAPI` : Gestion des utilisateurs, sessions, jeux, campagnes (Admin uniquement)
  - `usersApi` : Profil utilisateur, jeux favoris, évaluations
  - `conversationsApi` : Système de messagerie et support
  - `authAPI` : Authentification (login, signup, logout)
  - `publicAPI` : Endpoints publics (sessions/jeux mis en avant)

**Caractéristiques clés :**
- Gestion automatique des erreurs avec format standardisé
- Support des cookies pour l'authentification
- Normalisation des réponses API
- Typage strict TypeScript pour la sécurité

### Routing et navigation
- **React Router v6** : Routing moderne avec protection des routes
- **ProtectedRoute** : Composant de protection des pages privées
- **Layout** : Structure commune avec header, sidebar et footer
- **Navigation** : Menu responsive avec gestion des rôles

### État global
- **Context API** : Gestion de l'authentification et des données utilisateur
- **Hooks personnalisés** : Logique métier réutilisable
- **Local state** : État local des composants avec useState/useReducer
- **Persistance** : Stockage local pour les préférences utilisateur

## 5.2 Pages principales

| Page | URL | Composants clés | Statut | Description |
|------|-----|-----------------|--------|-------------|
| Home | / | Hero, GameCarousel, FeaturedSessions | ✅ | Page d'accueil avec présentation |
| Login | /login | LoginForm, validation | ✅ | Authentification utilisateur |
| Signup | /signup | SignupForm, validation | ✅ | Création de compte |
| Dashboard | /dashboard | Sidebar, StatsCard, QuickActions | ✅ | Tableau de bord personnalisé |
| Sessions | /sessions | SessionList, CreateSession, JoinSession | ✅ | Gestion des sessions |
| Campaigns | /campaigns | CampaignList, CreateCampaign | ✅ | Gestion des campagnes |
| Admin | /admin | AdminPanel, GameManagement | ✅ | Administration système |
| Profile | /profile | UserProfile, AvatarUpload | ✅ | Profil utilisateur |
| Onboarding | /onboarding | OnboardingFlow | ✅ | Processus d'intégration |

### Composants détaillés par page

#### Home (/)
- **Hero** : Section d'accueil avec titre et CTA
- **GameCarousel** : Carrousel des jeux populaires
- **FeaturedSessions** : Sessions mises en avant
- **StatsOverview** : Statistiques globales de la plateforme

#### Dashboard (/dashboard)
- **Sidebar** : Navigation contextuelle selon le rôle
- **StatsCard** : Métriques personnelles (sessions, jeux favoris)
- **QuickActions** : Actions rapides (créer session, rejoindre partie)
- **UpcomingGames** : Prochaines sessions à venir
- **RecentActivity** : Activité récente de l'utilisateur

#### Sessions (/sessions)
- **SessionList** : Liste des sessions avec filtres
- **CreateSession** : Formulaire de création (MJ/Admin uniquement)
- **JoinSession** : Modal pour rejoindre une session
- **SessionFilters** : Filtres par jeu, date, statut
- **SessionCard** : Carte d'affichage d'une session

#### Admin (/admin)
- **AdminPanel** : Interface d'administration complète
- **GameManagement** : Gestion des jeux (CRUD)
- **UserManagement** : Gestion des utilisateurs
- **SessionManagement** : Gestion des sessions
- **CampaignManagement** : Gestion des campagnes

## 5.3 Gestion d'état & appels API

### Architecture API
La communication avec le backend est entièrement centralisée via `api.ts` qui fournit :

```typescript
// Exemple d'utilisation des APIs
import { authAPI, adminAPI, usersApi } from '@/lib/api';

// Authentification
const { data, error } = await authAPI.login({ email, password });

// Gestion des sessions (admin)
const sessions = await adminAPI.getSessions({ 
  status: 'open', 
  game: gameId 
});

// Profil utilisateur
const profile = await usersApi.getProfile(userId);
```

### Context API
- **AuthContext** : État d'authentification et données utilisateur
- **UserContext** : Informations du profil et préférences
- **ThemeContext** : Gestion du thème (clair/sombre)

### Hooks personnalisés
- **`useAuth`** : Gestion de l'état d'authentification
  ```typescript
  const { user, login, logout, isAuthenticated } = useAuth();
  ```
- **`useApi`** : Appels API centralisés avec gestion d'erreurs
  ```typescript
  const { data, loading, error, execute } = useApi(endpoint);
  ```
- **`useFavoriteGames`** : Gestion des jeux favoris
  ```typescript
  const { favorites, addFavorite, removeFavorite } = useFavoriteGames();
  ```
- **`useDashboardData`** : Données du dashboard
  ```typescript
  const { sessions, campaigns, stats } = useDashboardData();
  ```
- **`useMasteredGames`** : Gestion des jeux maîtrisés
- **`useUserPreferences`** : Préférences utilisateur
- **`useOnboarding`** : Processus d'intégration
- **`usePermissions`** : Gestion des permissions et rôles
- **`useNotifications`** : Système de notifications

### Gestion des erreurs
- **Toast notifications** : Feedback immédiat avec react-hot-toast
- **Error boundaries** : Gestion gracieuse des erreurs React
- **Fallback UI** : Interfaces de secours en cas d'erreur
- **Retry logic** : Tentatives de reconnexion automatiques
- **Normalisation API** : Format d'erreur standardisé via `api.ts`

### Validation des formulaires
- **React Hook Form** : Gestion des formulaires performante
- **Joi resolvers** : Validation côté client cohérente avec le backend
- **Error handling** : Affichage des erreurs de validation
- **Real-time validation** : Validation en temps réel des champs

## 5.4 UI kit & Tailwind configuration

### Composants de base
- **Button** : Variants (default, outline, ghost, danger) avec dégradés
- **Card** : Effet glassmorphism avec backdrop-blur et ombres
- **Badge** : Variants (success, warning, danger, info, default)
- **Modal** : Overlay avec animations et gestion du focus
- **Input** : Champs avec validation et états d'erreur
- **Select** : Dropdown avec recherche et multi-sélection

### Technologies de mise en page
- **CSS Grid** : Utilisé via Tailwind pour les grilles responsives
  ```tsx
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  ```
- **Flexbox** : Utilisé via Tailwind pour l'alignement et la distribution
  ```tsx
  <div className="flex items-center justify-center space-x-3">
  ```
- **Combinaison intelligente** : Grid pour les layouts principaux, Flexbox pour l'alignement des éléments

### Variants et props
```typescript
interface ButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}
```

### Thème fantasy
- **Palette de couleurs** : Violets/bleus avec dégradés
- **Variables CSS** : Couleurs, espacements, typographie
- **Dark mode** : Support du thème sombre
- **Animations** : Transitions fluides et micro-interactions

### Configuration Tailwind
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          500: '#8b5cf6',
          900: '#4c1d95',
        },
        fantasy: {
          purple: '#7c3aed',
          blue: '#3b82f6',
          dark: '#1e293b',
        }
      },
      fontFamily: {
        'cinzel': ['Cinzel', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      }
    }
  }
}
```

### Responsive design
- **Mobile-first** : Développement mobile en priorité
- **Breakpoints** : sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grille adaptative** : **CSS Grid** via Tailwind (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) et **Flexbox** (`flex items-center justify-center`) pour la mise en page
- **Navigation** : Menu hamburger sur mobile, sidebar sur desktop

### Animations et transitions
- **CSS Transitions** : Transitions fluides entre états
- **Framer Motion** : Animations complexes et micro-interactions
- **Loading states** : Skeleton loaders et spinners
- **Hover effects** : Effets au survol avec feedback visuel

## 5.5 Système de composants avancés

### Composants d'administration
- **AdminPanel** : Interface centralisée d'administration
- **GameManagement** : CRUD complet des jeux
- **UserManagement** : Gestion des utilisateurs et rôles
- **SessionManagement** : Supervision des sessions
- **CampaignManagement** : Gestion des campagnes

### Composants de communication
- **ConversationsBubble** : Interface de messagerie
- **ConversationModal** : Modal de conversation
- **ContactForm** : Formulaire de contact administrateur

### Composants d'intégration
- **OnboardingFlow** : Processus d'intégration utilisateur
- **UserPreferences** : Gestion des préférences
- **ProfileManagement** : Gestion du profil utilisateur

---

*[Retour au sommaire](./README.md)*
