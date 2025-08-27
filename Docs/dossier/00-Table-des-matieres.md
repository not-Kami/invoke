# Table des matières provisoire du dossier TFE « INVOKE »

1. Introduction générale  
   1.1 Contexte académique et professionnel  
   1.2 Objectifs du TFE et portée du projet  
   1.3 Méthodologie adoptée  

2. Analyse du contexte et des besoins  
   2.1 Présentation du jeu de rôle et de la communauté cible  
   2.2 Analyse du marché et des solutions existantes  
   2.3 Identification des parties prenantes  
   2.4 Cahier des charges fonctionnel et non-fonctionnel  

3. Architecture globale du système  
   3.1 Choix technologiques (Node.js, Express, MongoDB, React, Vite)  
   3.2 Diagramme d’architecture logique  
   3.3 Justification des choix (scalabilité, maintenance, coûts)  

4. Conception back-end  
   4.1 Modélisation de la base de données (Mongoose)  
   4.2 Architecture REST API et routes principales  
   4.3 Sécurité : authentification JWT, rate-limiting, CORS  
   4.4 Gestion des erreurs et logs (Winston)  
   4.5 Tests unitaires & d’intégration (Jest, Supertest)  

5. Conception front-end  
   5.1 Structure React + TypeScript (feature folders)  
   5.2 State management et appels API  
   5.3 Routing, prototypage et composants réutilisables  
   5.4 Responsiveness et performance (Vite, code-splitting)  

6. Partie dédiée à l’UX/UI  
   6.1 Recherche utilisateur et personas  
   6.2 Parcours utilisateur (user journeys)  
   6.3 Wireframes & maquettes haute fidélité  
   6.4 Design system : couleurs, typographies, iconographie  
   6.5 Accessibilité et bonnes pratiques WCAG  
   6.6 Tests utilisateurs et itérations de design  

7. Implémentation des fonctionnalités clés  
   7.1 Gestion des utilisateurs et profils  
   7.2 Gestion des jeux, campagnes, sessions  
   7.3 Système de feedback et notation  
   7.4 Téléversement d’avatars et gestion des médias  
   7.5 Notifications et temps réel (perspectives)  

8. Qualité logicielle et assurance qualité  
   8.1 Couverture de tests et analyse statique  
   8.2 Intégration continue et pipelines CI/CD  
   8.3 Conformité aux standards de codage et linting  
   8.4 Mesures de performance back-end & front-end  

9. Sécurité et protection des données  
   9.1 Gestion des accès et rôles (RBAC)  
   9.2 Chiffrement, HTTPS et HSTS  
   9.3 Conformité RGPD et stockage des données utilisateur  
   9.4 Plan de récupération et sauvegardes  

10. Déploiement et infrastructure  
    10.1 MongoDB Atlas et configuration du cluster  
    10.2 Hébergement du front-end (Vercel/Netlify)  
    10.3 Conteneurisation et orchestration (Docker, options K8s)  
    10.4 Supervision et observabilité (logs, métriques)  

11. Gestion de projet et méthodologie Agile  
    11.1 Organisation des sprints et backlog  
    11.2 Outils de suivi (GitHub Projects, Notion)  
    11.3 Rôles et responsabilités au sein de l’équipe  
    11.4 Rétrospectives et amélioration continue  

12. Perspectives d’évolution  
    12.1 Fonctionnalités futures (micro-services, mobile)  
    12.2 Optimisations potentielles (serverless, micro-frontends)  
    12.3 Roadmap à moyen et long terme  

13. Bilan et conclusion  
    13.1 Résultats obtenus vs objectifs initiaux  
    13.2 Difficultés rencontrées et solutions apportées  
    13.3 Apports personnels et compétences acquises  
    13.4 Conclusion générale  

14. Références bibliographiques et webographiques  

15. Annexes  
    A. Journaux de développement (extraits du dossier Docs)  
    B. Captures d’écran de l’application  
    C. Scripts de seed et exemples de requêtes API  
    D. Tableau de mapping exigences ↔ implémentation  
