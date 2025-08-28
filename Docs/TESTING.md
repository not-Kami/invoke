# Guide des Tests - Projet Invoke

Ce document décrit comment exécuter et maintenir les tests pour le projet Invoke.

## Structure des Tests

### Côté Client (React + TypeScript)
- **Framework**: Vitest
- **Dossier**: `client/src/test/`
- **Configuration**: `client/vitest.config.ts`

### Côté Serveur (Node.js + Express)
- **Framework**: Jest
- **Dossier**: `server/src/test/`
- **Configuration**: `server/jest.config.js`

## Installation des Dépendances

### Client
```bash
cd client
npm install
```

### Serveur
```bash
cd server
npm install
```

## Exécution des Tests

### Tests Côté Client

```bash
cd client

# Exécuter tous les tests
npm test

# Exécuter les tests en mode watch
npm run test:ui

# Exécuter les tests une fois
npm run test:run

# Exécuter les tests avec couverture
npm run test:coverage
```

### Tests Côté Serveur

```bash
cd server

# Exécuter tous les tests
npm test

# Exécuter les tests en mode watch
npm run test:watch

# Exécuter les tests avec couverture
npm run test:coverage

# Exécuter les tests en mode verbose
npm run test:verbose
```

## Types de Tests

### 1. Tests Unitaires
- **Composants React** : Test du rendu, des props, des événements
- **Hooks personnalisés** : Test de la logique métier
- **Utilitaires** : Test des fonctions pures
- **Contrôleurs** : Test de la logique des routes

### 2. Tests d'Intégration
- **Routes API** : Test des endpoints complets
- **Base de données** : Test avec MongoDB en mémoire
- **Authentification** : Test des middlewares

### 3. Tests E2E (À venir)
- **Cypress** : Tests de bout en bout
- **Playwright** : Alternative moderne

## Structure des Fichiers de Test

### Convention de Nommage
```
ComponentName.test.tsx          # Test de composant
useHookName.test.ts            # Test de hook
api.test.ts                    # Test d'API
utils.test.ts                  # Test d'utilitaires
```

### Organisation des Tests
```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup avant chaque test
  })

  it('should render correctly', () => {
    // Test de rendu
  })

  it('should handle user interactions', () => {
    // Test d'interactions
  })

  it('should handle errors gracefully', () => {
    // Test de gestion d'erreurs
  })
})
```

## Mocks et Stubs

### Mocks Côté Client
- **API calls** : Mock de fetch avec `vi.fn()`
- **Contextes** : Mock des providers React
- **Modules externes** : Mock avec `vi.mock()`

### Mocks Côté Serveur
- **Base de données** : MongoDB en mémoire
- **Middlewares** : Mock des fonctions d'authentification
- **Modules** : Mock avec `jest.mock()`

## Couverture de Code

### Client (Vitest)
```bash
npm run test:coverage
```
- Génère un rapport HTML dans `client/coverage/`
- Couverture par défaut : 80%

### Serveur (Jest)
```bash
npm run test:coverage
```
- Génère un rapport HTML dans `server/coverage/`
- Couverture par défaut : 80%

## Bonnes Pratiques

### 1. Nommage des Tests
- Utiliser des descriptions claires et descriptives
- Suivre le pattern "should [expected behavior] when [condition]"

### 2. Structure des Tests
- Un seul concept par test
- Setup dans `beforeEach`
- Nettoyage dans `afterEach`

### 3. Assertions
- Utiliser des assertions spécifiques
- Éviter les assertions multiples par test
- Tester les cas d'erreur

### 4. Mocks
- Mocker au niveau le plus bas possible
- Utiliser des mocks réalistes
- Documenter les mocks complexes

## Exemples de Tests

### Test de Composant React
```typescript
import { render, screen, fireEvent } from '@/test/utils'
import GameCard from '../GameCard'

describe('GameCard', () => {
  it('should render game information correctly', () => {
    const game = createTestGame()
    render(<GameCard game={game} />)
    
    expect(screen.getByText(game.name)).toBeInTheDocument()
    expect(screen.getByText(game.description)).toBeInTheDocument()
  })
})
```

### Test de Hook
```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { useFavoriteGames } from '../useFavoriteGames'

describe('useFavoriteGames', () => {
  it('should fetch favorite games on mount', async () => {
    const { result } = renderHook(() => useFavoriteGames())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.favoriteGames).toBeDefined()
  })
})
```

### Test d'API
```typescript
import request from 'supertest'
import app from '../../app'

describe('Games API', () => {
  it('should create a new game', async () => {
    const response = await request(app)
      .post('/api/v1/games')
      .send(testGame)
      .expect(201)
    
    expect(response.body).toHaveProperty('_id')
  })
})
```

## Débogage des Tests

### Client
```bash
# Mode debug avec console.log
npm run test:run -- --reporter=verbose

# Mode watch avec recompilation automatique
npm run test:ui
```

### Serveur
```bash
# Mode debug
npm run test:verbose

# Mode watch
npm run test:watch
```

## Intégration Continue

### GitHub Actions
- Tests automatiques à chaque push
- Vérification de la couverture
- Tests sur différents environnements

### Pre-commit Hooks
- Exécution des tests avant commit
- Vérification du linting
- Vérification de la couverture

## Maintenance

### Mise à Jour des Tests
- Adapter les tests aux changements de code
- Maintenir la couverture de code
- Réviser les mocks régulièrement

### Performance
- Tests unitaires : < 100ms
- Tests d'intégration : < 1s
- Tests E2E : < 10s

## Ressources

- [Documentation Vitest](https://vitest.dev/)
- [Documentation Jest](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Supertest](https://github.com/visionmedia/supertest)
