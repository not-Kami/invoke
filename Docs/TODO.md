# TODO

Ce fichier liste toutes les tâches à accomplir, organisées par priorité, session et type (Backend / Frontend / Documentation).

---



```markdown
<code_block_to_apply_changes_from>
```

---



Veux-tu que je te propose un diff précis à appliquer à ton `TODO.md` pour refléter l’état actuel du backend, ou tu préfères le faire à la main ?

## Prochaine Session

### Backend API

* [x] Corriger le **campaign** seeder (blocage actuel)
* [x] Réactiver et tester le middleware **Joi validation**
* [x] Sécuriser toutes les routes (GET/PUT/DELETE by id avec validateParams, POST/PUT avec validate)
* [x] Implémenter le modèle **Character** (multi-personnages par utilisateur)
* [x] Upload d'avatar pour chaque personnage (uploads/characters/)
* [x] Adapter les routes pour lecture publique/écriture protégée (campagnes, jeux, feedbacks, sessions)
* [ ] Écrire et exécuter les **tests d’intégration** pour tous les endpoints CRUD (users, campaigns, feedback, sessions, games, characters)
* [ ] Mettre à jour **README.md** (instructions, variables d’env, scripts de seed)
* [x] Ajouter et configurer un **rate limiter** 
* [x] Intégrer un système centralisé de **logs d’erreur** (Winston,)
* [ ] Documentation API (Swagger/OpenAPI)
* [ ] Configurer **Multer** pour les uploads d’images
* [ ] Activer les middlewares de **sécurité** (Helmet, CORS)

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
* [ ] Gestion des uploads d’images (preview & Multer)

## Documentation & Livrables TFE

* [ ] Mettre à jour le **Cahier des charges** avec retours
* [ ] Décrire l’**architecture front-end**
* [ ] Décrire l’**architecture back-end**
* [ ] Rédiger le rapport :

  * Contexte & besoins
  * Choix techniques & justifications
  * Workflow clés (auth, CRUD, uploads, tests)
  * Bilan & perspectives

---

## Long-term & Future Features

* [ ] RBAC avancé (permissions granulaires)
* [ ] Stratégie de stockage fichiers (local vs cloud – AWS S3)
* [ ] Redis pour rate limiter multi-instance
* [ ] Endpoints d’analytics & métriques
* [ ] Intégration complète Auth en frontend (guards, stores)
* [ ] Audit sécurité (pentests, code review)
* [ ] Documentation utilisateur (guides API, tutoriels)

*Basé sur le Cahier des charges, Contraintes techniques et fonctionnelles, Checklist TFE et Entrées journalières.*
