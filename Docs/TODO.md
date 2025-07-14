# TODO

Ce fichier liste toutes les tâches à accomplir, organisées par priorité, session et type (Backend / Frontend / Documentation).

---

## Prochaine Session

### Backend API

* [x] Corriger le **campaign** seeder (blocage actuel)
* [x] Réactiver et tester le middleware **Joi validation**
* [x] Sécuriser toutes les routes (GET/PUT/DELETE by id avec validateParams, POST/PUT avec validate)
* [x] Implémenter le modèle **Character** (multi-personnages par utilisateur)
* [x] Upload d'avatar pour chaque personnage (uploads/characters/)
* [x] Adapter les routes pour lecture publique/écriture protégée (campagnes, jeux, feedbacks, sessions)
* [ ] Écrire et exécuter les **tests d'intégration** pour tous les endpoints CRUD (users, campaigns, feedback, sessions, games, characters)
* [ ] Mettre à jour **README.md** (instructions, variables d'env, scripts de seed)
* [x] Ajouter et configurer un **rate limiter** 
* [x] Intégrer un système centralisé de **logs d'erreur** (Winston,)
* [ ] Documentation API (Swagger/OpenAPI)
* [x] Configurer **Multer** pour les uploads d'images
* [x] Activer les middlewares de **sécurité** (Helmet, CORS)

### Tâches Backend Générales

* [x] Mettre à jour `.env.example` et documenter toutes les variables
* [x] Optimiser les **indexes** Mongoose (unicité, TTL, performance)
* [x] Middleware parsing des **query params** (filtrer, paginer, trier)
* [ ] Store distribué du rate limiter avec **Redis**
* [ ] Pipeline **CI/CD** pour seeders & tests
* [ ] Documentation API (Swagger/OpenAPI)

## Frontend Client (Mobile First)

* [ ] Structure React + TypeScript (features/resource folders)
* [ ] Layout mobile-first (navigation, header, footer)
* [ ] UX empathique & non intrusif (toasts, notifications)
* [ ] Pages CRUD (Users, Campaigns, Sessions, Games, Feedback)
* [ ] Validation forms (react-hook-form + Joi)
* [ ] Connexion API (Axios)
* [ ] Backoffice Desktop (admin)
* [ ] Gestion des uploads d'images (preview & Multer)

## Documentation & Livrables TFE

* [ ] Mettre à jour le **Cahier des charges** avec retours
* [ ] Décrire l'**architecture front-end**
* [ ] Décrire l'**architecture back-end**
* [ ] Rédiger le rapport :

  * Contexte & besoins
  * Choix techniques & justifications
  * Workflow clés (auth, CRUD, uploads, tests)
  * Bilan & perspectives

---

## 🚀 Améliorations Optionnelles

*Ces fonctionnalités peuvent être implémentées selon le temps disponible et les envies. Elles enrichissent l'application mais ne sont pas critiques pour le TFE.*

### Performance & Scalabilité
* [ ] **Redis** - Cache distribué et session store
  * Cache des requêtes fréquentes (campagnes, jeux)
  * Rate limiter multi-instance
  * Sessions utilisateur distribuées
* [ ] **Compression** - Gzip/Brotli pour les réponses API
* [ ] **CDN** - Distribution des assets statiques
* [ ] **Database Indexing** - Optimisation avancée des requêtes MongoDB

### Documentation & Développement
* [ ] **Swagger/OpenAPI** - Documentation interactive de l'API
  * Endpoints documentés avec exemples
  * Interface de test intégrée
  * Génération automatique de la doc
* [ ] **JSDoc** - Documentation du code backend
* [ ] **Storybook** - Documentation des composants frontend
* [ ] **Postman Collection** - Tests d'API automatisés

### Monitoring & Observabilité
* [ ] **Health Checks** - Endpoints de monitoring
* [ ] **Metrics** - Prometheus/Grafana
* [ ] **Error Tracking** - Sentry pour le monitoring d'erreurs
* [ ] **Logging Avancé** - Logs structurés avec correlation IDs

### Sécurité Avancée
* [ ] **Rate Limiting** - Limites par utilisateur/IP
* [ ] **CORS** - Configuration fine des origines autorisées
* [ ] **Input Sanitization** - Protection XSS/Injection
* [ ] **Security Headers** - CSP, HSTS, etc.
* [ ] **Audit Logs** - Traçabilité des actions sensibles

### Fonctionnalités Métier
* [ ] **Notifications** - Système de notifications push/email
* [ ] **Search** - Recherche full-text (Elasticsearch/Algolia)
* [ ] **File Management** - Upload vers cloud (AWS S3, Cloudinary)
* [ ] **Export/Import** - Export des données en CSV/JSON
* [ ] **Backup** - Sauvegarde automatique de la base de données

### Architecture & DevOps
* [ ] **Docker** - Containerisation de l'application
* [ ] **CI/CD** - Pipeline automatisé (GitHub Actions)
* [ ] **Environment Management** - Gestion des environnements
* [ ] **Database Migrations** - Système de migrations MongoDB
* [ ] **Load Testing** - Tests de charge avec Artillery/K6

### Frontend Avancé
* [ ] **PWA** - Progressive Web App
* [ ] **Offline Support** - Fonctionnement hors ligne
* [ ] **Real-time** - WebSockets pour les mises à jour temps réel
* [ ] **Internationalization** - Support multi-langues
* [ ] **Accessibility** - Conformité WCAG

---

## Long-term & Future Features

* [ ] RBAC avancé (permissions granulaires)
* [ ] Stratégie de stockage fichiers (local vs cloud – AWS S3)
* [ ] Redis pour rate limiter multi-instance
* [ ] Endpoints d'analytics & métriques
* [ ] Intégration complète Auth en frontend (guards, stores)
* [ ] Audit sécurité (pentests, code review)
* [ ] Documentation utilisateur (guides API, tutoriels)

*Basé sur le Cahier des charges, Contraintes techniques et fonctionnelles, Checklist TFE et Entrées journalières.*
