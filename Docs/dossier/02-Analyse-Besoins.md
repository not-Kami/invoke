# 2. Analyse du contexte et des besoins

## 2.1 Présentation du jeu de rôle et de la communauté cible

### Qu'est-ce que le jeu de rôle sur table ?
- **Définition** : Activité sociale où les joueurs incarnent des personnages dans un univers fictif
- **Mécanique** : Narration collaborative guidée par un Maître de Jeu (MJ)
- **Popularité** : Renouveau avec des jeux comme D&D 5e, Pathfinder 2e, Call of Cthulhu
- **Communauté** : Joueurs de tous âges, débutants aux experts

### Caractéristiques de la communauté JDR
- **Passionnés** : Engagement fort dans l'activité et la culture
- **Débutants** : Besoin d'accompagnement et de découverte
- **Expérimentés** : Recherche de nouveaux défis et groupes
- **Maîtres de Jeu** : Créateurs de contenu et organisateurs

### Besoins identifiés
- **Mise en relation** : Trouver des groupes et des parties
- **Organisation** : Gérer les sessions et campagnes
- **Découverte** : Explorer de nouveaux jeux et univers
- **Communauté** : Partager expériences et conseils

## 2.2 Analyse du marché et des solutions existantes

### Solutions actuelles sur le marché

#### Plateformes dédiées
- **Roll20** : Plateforme de jeu en ligne, interface complexe
- **Fantasy Grounds** : Logiciel payant, fonctionnalités avancées
- **D&D Beyond** : Spécialisé D&D, propriétaire Wizards of the Coast

#### Outils de communication
- **Discord** : Communication générale, pas de fonctionnalités JDR
- **Slack** : Organisation d'équipe, manque de spécialisation
- **WhatsApp/Telegram** : Groupes informels, pas de structure

#### Solutions traditionnelles
- **Forums spécialisés** : Interface obsolète, navigation complexe
- **Groupes Facebook** : Pas de structure, recherche difficile
- **Sites de clubs** : Informations éparpillées et non centralisées

### Analyse de la concurrence

#### Forces des solutions existantes
- **Roll20** : Fonctionnalités complètes, communauté établie
- **Discord** : Facilité d'utilisation, intégration communication
- **Forums** : Contenu riche, expertise communautaire

#### Faiblesses identifiées
- **Complexité** : Interfaces trop complexes pour débutants
- **Dispersion** : Informations éparpillées entre plateformes
- **Obsolescence** : Design et UX dépassés
- **Spécialisation** : Focus trop étroit ou trop large

### Opportunités du marché
- **Croissance** : Renouveau du JDR sur table
- **Modernisation** : Besoin d'interfaces contemporaines
- **Centralisation** : Demande d'outils unifiés
- **Accessibilité** : Ouverture à de nouveaux publics

## 2.3 Identification des parties prenantes

### Utilisateurs finaux

#### Joueurs débutants
- **Profil** : Première expérience JDR, recherche de groupes d'accueil
- **Besoins** : Découverte, accompagnement, simplicité
- **Objectifs** : Première partie réussie, intégration communautaire
- **Fréquence** : Occasionnelle, exploration progressive

#### Joueurs expérimentés
- **Profil** : Plusieurs années d'expérience, jeux favoris établis
- **Besoins** : Optimisation, découverte, partage
- **Objectifs** : Nouvelles expériences, amélioration continue
- **Fréquence** : Régulière, engagement communautaire

#### Maîtres de Jeu
- **Profil** : Créateurs de contenu, organisateurs de parties
- **Besoins** : Outils de gestion, visibilité, organisation
- **Objectifs** : Faciliter l'organisation, gérer efficacement
- **Fréquence** : Élevée, utilisation intensive

#### Administrateurs
- **Profil** : Modérateurs, gestionnaires de contenu
- **Besoins** : Outils de modération, analytics, supervision
- **Objectifs** : Maintenir la qualité, analyser les tendances
- **Fréquence** : Quotidienne, supervision continue

### Parties prenantes indirectes

#### Éditeurs de jeux
- **Intérêt** : Visibilité et promotion de leurs produits
- **Contribution** : Contenu officiel et licences
- **Bénéfices** : Augmentation des ventes et de la notoriété

#### Clubs et associations
- **Intérêt** : Organisation et promotion de leurs activités
- **Contribution** : Événements et contenu communautaire
- **Bénéfices** : Recrutement et visibilité

#### Communauté JDR
- **Intérêt** : Développement et pérennité de l'activité
- **Contribution** : Feedback, contenu, promotion
- **Bénéfices** : Outils modernes et communauté élargie

## 2.4 Cahier des charges fonctionnel et non-fonctionnel

### Cahier des charges fonctionnel

#### Fonctionnalités utilisateur
- **Gestion de compte** : Inscription, connexion, profil personnalisable
- **Découverte** : Recherche de jeux, sessions, campagnes
- **Participation** : Rejoindre des sessions, gérer ses préférences
- **Organisation** : Créer et gérer des sessions/campagnes (MJ)

#### Fonctionnalités communautaires
- **Profils** : Affichage des informations publiques
- **Recherche** : Filtres et tri des contenus
- **Favoris** : Gestion des jeux et sessions préférés
- **Maîtrise** : Déclaration de compétence sur les jeux

#### Fonctionnalités d'administration
- **Modération** : Gestion des contenus et utilisateurs
- **Analytics** : Statistiques d'utilisation et tendances
- **Configuration** : Paramètres système et maintenance

### Cahier des charges non-fonctionnel

#### Performance
- **Temps de réponse** : < 200ms pour les requêtes API
- **Disponibilité** : 99.9% uptime
- **Scalabilité** : Support de 1000+ utilisateurs simultanés
- **Temps de chargement** : < 3s pour les pages principales

#### Sécurité
- **Authentification** : JWT sécurisé avec expiration
- **Autorisation** : Gestion des rôles et permissions
- **Protection** : Rate limiting, CORS, validation des entrées
- **Conformité** : RGPD, HTTPS, headers de sécurité

#### Qualité
- **Tests** : Couverture de code > 80%
- **Documentation** : API documentée, guides utilisateur
- **Maintenance** : Code maintenable et évolutif
- **Standards** : Respect des bonnes pratiques web

#### Accessibilité
- **WCAG** : Conformité niveau AA minimum
- **Responsive** : Support mobile, tablette, desktop
- **Navigation** : Support clavier et lecteurs d'écran
- **Internationalisation** : Support multilingue (perspectives)

---

*[Retour au sommaire](./README.md)*
