# 📚 Notes sur l'Application Invoke

## 🎯 **Vue d'ensemble**

**Invoke** est une plateforme moderne dédiée aux passionnés de jeux de rôle (JDR). Elle permet aux joueurs et maîtres de jeu (MJ) de créer, gérer et participer à des sessions de JDR avec une interface intuitive et moderne.

### 🎮 **Concept principal**
- **Plateforme communautaire** pour les joueurs de JDR
- **Gestion de sessions** en ligne et hors ligne
- **Système de campagnes** pour les aventures long terme
- **Interface moderne** avec design responsive

---

## 🏗️ **Architecture Technique**

### **Stack Technologique**
- **Frontend** : React + TypeScript + Vite + Tailwind CSS
- **Backend** : Node.js + Express + MongoDB + Mongoose
- **Authentification** : JWT + Cookies sécurisés
- **Upload d'images** : Cloudinary (CDN mondial)
- **Déploiement** : Render (frontend + backend)

### **Structure des données**
- **Base de données** : MongoDB Atlas
- **Modèles principaux** : User, Game, Session, Campaign, Character, Conversation
- **Relations** : Références entre entités via ObjectId

---

## 👥 **Système d'Utilisateurs**

### **Types d'utilisateurs**
1. **USER** : Joueur standard
2. **ADMIN** : Administrateur avec accès complet
3. **DM** : Maître de jeu (peut être un USER ou ADMIN)

### **Profil utilisateur**
- **Informations** : Prénom, nom, email, avatar, bio
- **Préférences** : Jeux favoris, jeux maîtrisés
- **Statut** : Vérifié, mis en avant (pour les MJ)
- **Historique** : Sessions créées/jointe, évaluations

### **Système de rôles**
- **Authentification** : JWT avec cookies sécurisés
- **Autorisations** : Gestion fine des permissions
- **Sécurité** : Middleware de protection des routes

---

## 🎲 **Gestion des Jeux**

### **Modèle Game**
- **Informations** : Nom, description, genre, système
- **Images** : Logo, portrait, bannière (stockées sur Cloudinary)
- **Statut** : Mis en avant, actif
- **Relations** : Lié aux sessions et campagnes

### **Fonctionnalités**
- **Catalogue** : Liste des jeux disponibles
- **Recherche** : Filtres par genre, système
- **Favoris** : Système de jeux préférés
- **Maîtrise** : Jeux que l'utilisateur peut maîtriser

---

## 📅 **Système de Sessions**

### **Types de sessions**
- **One-shot** : Session unique
- **Campagne** : Session faisant partie d'une campagne
- **En ligne** : Session virtuelle
- **Hors ligne** : Session physique

### **Gestion des sessions**
- **Création** : Par les MJ
- **Inscription** : Par les joueurs (limite de places)
- **Statuts** : Ouverte, complète, terminée, annulée
- **Informations** : Date, heure, fuseau horaire, description

### **Fonctionnalités avancées**
- **Mise en avant** : Sessions recommandées
- **Filtres** : Par jeu, date, statut
- **Export** : Données de session

---

## 📖 **Système de Campagnes**

### **Gestion des campagnes**
- **Création** : Par les MJ
- **Participants** : MJ + joueurs
- **Sessions** : Liées à la campagne
- **Statut** : Active, en pause, terminée

### **Fonctionnalités**
- **Suivi** : Progression de la campagne
- **Communication** : Entre MJ et joueurs
- **Archivage** : Conservation des données

---

## 👤 **Système de Personnages**

### **Création de personnages**
- **Propriétaire** : Lié à un utilisateur
- **Métadonnées** : Attributs dynamiques
- **Sessions** : Participation aux sessions
- **Avatar** : Image personnalisée

---

## 💬 **Système de Communication**

### **Types de conversations**
- **Contact admin** : Support utilisateur
- **Chat utilisateur** : Communication entre joueurs

### **Fonctionnalités**
- **Messages** : Système de chat en temps réel
- **Statuts** : Ouvert, en cours, fermé
- **Priorités** : Faible, moyenne, élevée, urgente
- **Métadonnées** : User-agent, IP, etc.

---

## 🛡️ **Panel d'Administration**

### **Accès**
- **Restriction** : Uniquement aux administrateurs
- **Sécurité** : Double vérification des permissions
- **Interface** : Dashboard moderne et intuitif

### **Gestion des utilisateurs**
- **Liste** : Tous les utilisateurs
- **Actions** : Modification, suppression, mise en avant
- **Statistiques** : Nombre d'utilisateurs, activité

### **Gestion des jeux**
- **CRUD** : Création, lecture, mise à jour, suppression
- **Images** : Upload vers Cloudinary
- **Mise en avant** : Système de recommandation

### **Gestion des sessions**
- **Monitoring** : Toutes les sessions
- **Actions** : Modification, suppression, export
- **Statistiques** : Sessions actives, terminées

### **Gestion des campagnes**
- **Suivi** : Progression des campagnes
- **Participants** : Gestion des joueurs
- **Statuts** : Activation/désactivation

### **Support utilisateur**
- **Conversations** : Messages de contact
- **Réponses** : Système de tickets
- **Priorités** : Gestion des urgences

---

## 🎨 **Interface Utilisateur**

### **Design**
- **Thème** : Sombre avec accents violets/bleus
- **Typographie** : Cinzel pour les titres
- **Responsive** : Mobile-first design
- **Animations** : Transitions fluides

### **Pages principales**
1. **Accueil** : Présentation, jeux mis en avant
2. **Jeux** : Catalogue et recherche
3. **Sessions** : Liste et création
4. **Dashboard** : Profil utilisateur
5. **Admin** : Panel d'administration
6. **Contact** : Support et communication

### **Composants réutilisables**
- **Cards** : Affichage des jeux/sessions
- **Modals** : Création/édition
- **Tables** : Données tabulaires
- **Forms** : Saisie de données

---

## 🔧 **Fonctionnalités Techniques**

### **Upload d'images**
- **Service** : Cloudinary (CDN mondial)
- **Types** : Avatars, images de jeux, bannières
- **Optimisation** : Compression automatique
- **Sécurité** : URLs signées

### **Authentification**
- **JWT** : Tokens sécurisés
- **Cookies** : Stockage côté client
- **Middleware** : Protection des routes
- **Sessions** : Gestion des connexions

### **API REST**
- **Endpoints** : CRUD complet
- **Validation** : Joi pour la validation
- **Rate Limiting** : Protection contre les abus
- **CORS** : Configuration multi-origines

### **Base de données**
- **MongoDB** : Base NoSQL
- **Mongoose** : ODM pour Node.js
- **Relations** : Références entre entités
- **Indexation** : Optimisation des requêtes

---

## 🚀 **Déploiement et Production**

### **Environnements**
- **Développement** : Local avec hot-reload
- **Staging** : Tests avant production
- **Production** : Render (frontend + backend)

### **Variables d'environnement**
- **Base de données** : MONGODB_URI
- **Authentification** : JWT_SECRET
- **Cloudinary** : CLOUDINARY_* (3 variables)
- **CORS** : FRONTEND_URLS

### **Monitoring**
- **Logs** : Winston avec rotation
- **Erreurs** : Gestion centralisée
- **Performance** : Optimisation des requêtes

---

## 📊 **Métriques et Statistiques**

### **Utilisateurs**
- **Inscriptions** : Nouveaux comptes
- **Activité** : Sessions créées/jointe
- **Engagement** : Temps passé sur la plateforme

### **Contenu**
- **Jeux** : Nombre de jeux disponibles
- **Sessions** : Sessions créées/terminées
- **Campagnes** : Campagnes actives

### **Support**
- **Conversations** : Messages de contact
- **Résolution** : Temps de réponse
- **Satisfaction** : Retours utilisateurs

---

## 🔒 **Sécurité et Conformité**

### **Protection des données**
- **Chiffrement** : Mots de passe hashés (bcrypt)
- **HTTPS** : Communication sécurisée
- **Validation** : Sanitisation des entrées
- **CORS** : Configuration restrictive

### **Gestion des erreurs**
- **Logging** : Traçabilité complète
- **Monitoring** : Détection des anomalies
- **Récupération** : Gestion des pannes

---

## 🎯 **Points Forts de l'Application**

1. **Interface moderne** : Design responsive et intuitif
2. **Communauté active** : Système de favoris et recommandations
3. **Flexibilité** : Support de différents types de JDR
4. **Administration** : Panel complet pour la gestion
5. **Sécurité** : Authentification robuste et protection des données
6. **Performance** : CDN pour les images, optimisation des requêtes
7. **Évolutivité** : Architecture modulaire et extensible

---

## 🚧 **Améliorations Futures Possibles**

1. **Notifications** : Système de notifications en temps réel
2. **Calendrier** : Intégration calendrier pour les sessions
3. **Vidéo** : Support des sessions vidéo intégrées
4. **Mobile** : Application mobile native
5. **Analytics** : Tableaux de bord avancés
6. **API publique** : API pour intégrations tierces

---

*Ces notes sont mises à jour régulièrement pour refléter l'état actuel de l'application Invoke.*
