# TODO

Ce fichier liste toutes les tâches à accomplir, organisées par priorité, session et type (Backend / Frontend / Documentation).

---

## 🚀 **PROCHAINE PRIORITÉ IMMÉDIATE**

### Onboarding & Création de Compte
* [ ] **Implémenter l'onboarding pour la création de compte**
  * [ ] Formulaire de création avec validation (react-hook-form + Joi)
  * [ ] Choix du rôle (Joueur/DM) avec explications
  * [ ] Sélection des jeux préférés via l'API `/favorites`
  * [ ] Personnalisation du profil (avatar, bio, nickname)
  * [ ] Première connexion au dashboard avec tutoriel
  * [ ] Validation côté client et serveur
  * [ ] Gestion des erreurs et feedback utilisateur

---

## ✅ **SESSION ACTUELLE TERMINÉE (13/08/25)**

### Upload d'Images & Carousel de Jeux
* [x] **Upload d'images pour les jeux** : Logo, portrait, bannière
* [x] **Résolution du problème de suppression** des fichiers nouvellement uploadés
* [x] **Correction de la duplication** des jeux lors de la modification
* [x] **Implémentation du carousel** de jeux mis en avant
* [x] **Gestion des champs manquants** (featured) pour les jeux existants
* [x] **Architecture robuste** pour la gestion des images
* [x] **Types alignés** entre client et serveur

### Dashboard & Architecture Backend
* [x] **Refactor complet du dashboard** avec séparation des responsabilités
* [x] **Architecture RESTful** avec routes spécialisées
* [x] **Middlewares spécialisés** par type d'opération
* [x] **API jeux favoris** : GET, POST, DELETE avec persistance
* [x] **API jeux maîtrisés** : Gestion pour les DMs
* [x] **Gestion des rôles** : Devenir DM, arrêter d'être DM
* [x] **Sécurité renforcée** : Permissions granulaires et validation des champs
* [x] **Interface utilisateur** : Dashboard responsive avec gestion des rôles
* [x] **Persistance des données** : Jeux favoris sauvegardés en base

### Architecture & Sécurité
* [x] **Séparation des responsabilités** : Profil, favoris, maîtrisés, rôles
* [x] **Routes RESTful claires** : `/profile`, `/favorites`, `/mastered`, `/role`
* [x] **Middlewares spécialisés** : `canUpdateProfile`, `canManageFavoriteGames`, `canManageMasteredGames`
* [x] **Validation des champs** : Seuls les champs autorisés peuvent être modifiés
* [x] **Gestion d'erreurs** : catchAsync et AppError pour une gestion propre
* [x] **Permissions granulaires** : Utilisateur peut modifier son profil, admins peuvent tout

---

## 🔄 **EN COURS / PROCHAINES SESSIONS**

### 🎯 **PRIORITÉ IMMÉDIATE - Demain (14/08/25)**
* [ ] **Finaliser l'affichage des images** dans le carousel
  * [ ] Tester l'upload d'images avec le nouveau contrôleur
  * [ ] Vérifier que les URLs sont sauvegardées en base de données
  * [ ] Confirmer l'affichage des images portrait en arrière-plan des cartes
  * [ ] Nettoyer les logs de debug une fois fonctionnel
* [ ] **Optimisation du carousel** de jeux mis en avant
  * [ ] Vérifier les performances avec plusieurs jeux
  * [ ] Ajouter des transitions fluides
  * [ ] Gérer les cas d'erreur d'affichage d'images

### 🆕 **NOUVELLES FONCTIONNALITÉS - Contact & About**
* [ ] **Page About** - Créer une page "À propos" complète
  * [ ] Histoire et mission d'Invoke
  * [ ] Équipe et contributeurs
  * [ ] Technologies utilisées
  * [ ] Roadmap et vision
  * [ ] Intégration dans la navigation
* [ ] **Système de notifications** pour les conversations
  * [ ] Notifications push pour nouveaux messages
  * [ ] Badge de messages non lus
  * [ ] Historique des conversations côté utilisateur
* [ ] **Intégration Discord/Email** pour les réponses
  * [ ] Webhook Discord pour notifications
  * [ ] Envoi d'emails automatiques
  * [ ] Synchronisation des statuts

### Backend API - Fonctionnalités Avancées
* [ ] **Tests d'intégration** pour tous les endpoints CRUD
  * [ ] Tests pour les nouvelles routes RESTful
  * [ ] Tests de permissions et middlewares
  * [ ] Tests de validation et gestion d'erreurs
* [ ] **Filtres, pagination et tri** sur les endpoints de liste
  * [ ] `/api/v1/users` avec recherche et filtres
  * [ ] `/api/v1/games` avec pagination
  * [ ] `/api/v1/sessions` avec filtres par statut
  * [ ] `/api/v1/campaigns` avec tri par date
* [ ] **Documentation API** (Swagger/OpenAPI)
* [ ] **Rate limiting avancé** avec Redis
* [ ] **Pipeline CI/CD** pour tests et déploiement

### Frontend Client - Améliorations UX
* [ ] **Gestion des uploads d'images** (avatars, preview)
* [ ] **Validation des formulaires** (react-hook-form + Joi)
* [ ] **Gestion des erreurs** (toasts, notifications)
* [ ] **Tests unitaires** pour les composants
* [ ] **Responsive design** mobile-first
* [ ] **Accessibilité** (ARIA, navigation clavier)

---

## 📋 **TÂCHES BACKEND GÉNÉRALES**

* [x] **Modèles et schémas** : User, Game, Session, Campaign
* [x] **Routes CRUD** : Users, Games, Sessions, Campaigns
* [x] **Middleware d'authentification** : JWT, protect, restrictTo
* [x] **Validation des données** : Joi schemas
* [x] **Gestion des erreurs** : AppError, catchAsync
* [x] **Upload d'images** : Multer configuré
* [x] **Sécurité** : Helmet, CORS, rate limiting
* [x] **Logs** : Winston pour le logging
* [x] **Indexes MongoDB** : Performance et unicité
* [ ] **Tests** : Unitaires et d'intégration
* [ ] **Documentation** : API et déploiement

---

## 🎨 **FRONTEND CLIENT (Mobile First)**

* [x] **Structure React + TypeScript** : Composants organisés
* [x] **Dashboard principal** : Interface utilisateur complète
* [x] **Gestion des rôles** : Vue joueur et vue DM
* [x] **Jeux favoris** : Interface d'ajout/suppression
* [x] **Navigation** : Header, sidebar, routing
* [x] **État global** : Context API pour l'authentification
* [x] **API integration** : Hooks personnalisés
* [ ] **Onboarding** : Création de compte et première connexion
* [ ] **Formulaires** : Validation et gestion des erreurs
* [ ] **Upload d'images** : Preview et gestion des fichiers
* [ ] **Tests** : Unitaires et d'intégration
* [ ] **Responsive design** : Mobile-first approach

---

## 📚 **DOCUMENTATION & LIVRABLES TFE**

* [x] **Journal de développement** : Suivi quotidien des sessions
* [x] **Architecture backend** : Routes, middlewares, sécurité
* [x] **Architecture frontend** : Composants, hooks, état
* [ ] **Cahier des charges** : Mise à jour avec retours
* [ ] **Documentation technique** : API, déploiement, maintenance
* [ ] **Rapport TFE** :
  * [ ] Contexte & besoins
  * [ ] Choix techniques & justifications
  * [ ] Workflow clés (auth, CRUD, uploads, tests)
  * [ ] Bilan & perspectives
  * [ ] Démonstration des fonctionnalités

---

## 🔮 **LONG-TERM & FUTURE FEATURES**

* [ ] **RBAC avancé** : Permissions granulaires par ressource
* [ ] **Stratégie de stockage** : Local vs cloud (AWS S3)
* [ ] **Redis avancé** : Cache, sessions, rate limiting
* [ ] **Analytics** : Métriques d'utilisation et performance
* [ ] **Notifications** : Push, email, in-app
* [ ] **Collaboration** : Chat, partage de ressources
* [ ] **Mobile app** : React Native ou PWA
* [ ] **Audit sécurité** : Pentests, code review automatisé

---

## 📊 **PROGRESSION GÉNÉRALE**

- **Backend** : 85% ✅
- **Frontend** : 70% ✅
- **Documentation** : 60% ✅
- **Tests** : 20% ⚠️
- **Onboarding** : 0% ❌

*Basé sur le Cahier des charges, Contraintes techniques et fonctionnelles, Checklist TFE et Entrées journalières.*
