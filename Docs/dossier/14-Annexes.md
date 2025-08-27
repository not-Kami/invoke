# 8. Annexes

## 8.1 Journal de développement

### Structure des journaux
- **Format** : `MM-DD-YY.md` (ex: `08-14-25.md`)
- **Localisation** : `Docs/journaling/`
- **Contenu** : Suivi quotidien des sessions de développement

### Journaux disponibles
| Date | Fichier | Contenu principal | Taille |
|------|---------|-------------------|---------|
| 07-04-25 | [07-04-25.md](../journaling/07-04-25.md) | Initialisation du projet | 3.6KB |
| 07-11-25 | [07-11-25.md](../journaling/07-11-25.md) | Setup backend et frontend | 4.6KB |
| 07-22-25 | [07-22-25.md](../journaling/07-22-25.md) | Architecture et modèles | 2.4KB |
| 07-26-25 | [07-26-25.md](../journaling/07-26-25.md) | Refonte frontend fantasy | 3.0KB |
| 08-10-25 | [08-10-25.md](../journaling/08-10-25.md) | Gestion des jeux et uploads | 8.3KB |
| 08-11-25 | [08-11-25.md](../journaling/08-11-25.md) | Création de sessions et campagnes | 28KB |
| 08-12-25 | [08-12-25.md](../journaling/08-12-25.md) | Système d'invitation et gestion | 55KB |
| 08-13-25 | [08-13-25.md](../journaling/08-13-25.md) | Dashboard et architecture backend | 17KB |
| 08-14-25 | [08-14-25.md](../journaling/08-14-25.md) | Complétion de la présentation TFE | 1.2KB |

### Utilisation des journaux
- **Consultation** : Suivi de l'évolution du projet
- **Décision** : Justification des choix techniques
- **Problèmes** : Solutions et workarounds documentés
- **Planning** : Estimation des temps de développement

## 8.2 Collection Insomnia

### Fichier de collection
- **Localisation** : `server/insomnia_collection`
- **Format** : Collection Insomnia exportée
- **Taille** : 27KB (867 lignes)

### Endpoints documentés
- **Authentification** : Signup, login, logout, me
- **Utilisateurs** : CRUD complet, avatar, favoris, maîtrisés
- **Jeux** : CRUD complet, featured, uploads
- **Sessions** : CRUD complet, featured, join
- **Campagnes** : CRUD complet, gestion des joueurs

### Utilisation
- **Tests API** : Validation des endpoints
- **Documentation** : Exemples de requêtes et réponses
- **Développement** : Tests pendant le développement
- **Formation** : Guide pour les nouveaux développeurs

## 8.3 Documentation technique

### Fichiers de documentation
| Fichier | Localisation | Description |
|---------|--------------|-------------|
| **README.md** | `server/README.md` | Guide d'installation et utilisation |
| **TODO.md** | `Docs/TODO.md` | Liste des tâches et priorités |
| **SECURITY.md** | `client/SECURITY.md` | Guide de sécurité frontend |
| **RATE_LIMIT_CONFIG.md** | `server/RATE_LIMIT_CONFIG.md` | Configuration du rate limiting |

### Contenu des guides
- **Installation** : Prérequis et étapes de setup
- **Configuration** : Variables d'environnement
- **Développement** : Commandes et workflow
- **Déploiement** : Instructions de mise en production

## 8.4 Configuration et scripts

### Fichiers de configuration
- **Backend** : `server/package.json`, `server/.env.example`
- **Frontend** : `client/package.json`, `client/tailwind.config.js`
- **Build** : `client/vite.config.ts`, `client/tsconfig.json`

### Scripts disponibles
```json
// Backend
"dev": "nodemon src/app.js",
"start": "node src/app.js",
"build": "npm install"

// Frontend
"dev": "vite",
"build": "tsc && vite build",
"preview": "vite preview"
```

### Variables d'environnement
```bash
# Backend (.env)
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=90d
COOKIE_EXPIRES_IN=90

# Frontend (.env)
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=INVOKE
```

## 8.5 Ressources et références

### Technologies utilisées
- **Backend** : [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [MongoDB](https://www.mongodb.com/)
- **Frontend** : [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)

### Documentation officielle
- **Node.js** : [Guide officiel](https://nodejs.org/en/docs/)
- **Express** : [Documentation API](https://expressjs.com/en/api.html)
- **MongoDB** : [Manuel utilisateur](https://docs.mongodb.com/)
- **React** : [Documentation officielle](https://reactjs.org/docs/)

### Outils de développement
- **IDE** : VS Code avec extensions recommandées
- **Versioning** : Git avec GitHub/GitLab
- **API Testing** : Insomnia ou Postman
- **Database** : MongoDB Compass pour la gestion

## 8.6 Structure des logs

### Fichiers de logs
- **Serveur** : `server/server.log` (1006KB, 39K lignes)
- **Rotation** : `server/logs/` avec rotation quotidienne
- **Format** : JSON structuré avec timestamps

### Niveaux de log
- **Error** : Erreurs critiques et exceptions
- **Warn** : Avertissements et situations anormales
- **Info** : Informations générales et opérations
- **Debug** : Détails techniques pour le développement

### Exemple de log
```json
{
  "timestamp": "2025-08-14T10:30:00.000Z",
  "level": "info",
  "message": "Server started successfully",
  "port": 3000,
  "environment": "development"
}
```

---

*[Retour au sommaire](./README.md)*
