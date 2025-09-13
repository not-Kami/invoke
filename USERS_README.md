# Utilisateurs Invoke - Base de données

## 🎲 Utilisateurs créés via seeder

### 👑 Administrateur
- **Nacho Admin** (`nacho@invoke.com`) - Le boss des boss ! 🎲👑
  - **Mot de passe** : `admin123`
  - **Rôle** : Admin + DM
  - **Statut** : Featured ⭐

### 🎭 Maîtres de Jeu (MJ)
- **Maxime Chattam** (`maxime.chattam@invoke.com`) - Auteur français de JDR
  - **Mot de passe** : `mj123`
  - **Rôle** : User + DM
  - **Statut** : Featured ⭐

- **Julien Dutel** (`julien.dutel@invoke.com`) - Créateur de JDR français
  - **Mot de passe** : `mj123`
  - **Rôle** : User + DM
  - **Statut** : Featured ⭐

- **J.R.R. Tolkien** (`tolkien@invoke.com`) - Père de la fantasy moderne
  - **Mot de passe** : `mj123`
  - **Rôle** : User + DM
  - **Statut** : Featured ⭐

- **Gary Gygax** (`gary.gygax@invoke.com`) - Créateur de D&D
  - **Mot de passe** : `mj123`
  - **Rôle** : User + DM

- **Dave Arneson** (`dave.arneson@invoke.com`) - Co-créateur de D&D
  - **Mot de passe** : `mj123`
  - **Rôle** : User + DM

### 🎲 Joueurs
- **Frodo Baggins** (`frodo@invoke.com`) - Hobbit aventurier
  - **Mot de passe** : `player123`
  - **Rôle** : User

- **Gandalf Le Gris** (`gandalf@invoke.com`) - Magicien puissant
  - **Mot de passe** : `player123`
  - **Rôle** : User

- **Aragorn Elessar** (`aragorn@invoke.com`) - Rôdeur du Nord
  - **Mot de passe** : `player123`
  - **Rôle** : User

- **Legolas Vertfeuille** (`legolas@invoke.com`) - Elfe sylvain
  - **Mot de passe** : `player123`
  - **Rôle** : User

- **Gimli Fils de Glóin** (`gimli@invoke.com`) - Nain guerrier
  - **Mot de passe** : `player123`
  - **Rôle** : User

- **Conan Le Barbare** (`conan@invoke.com`) - Barbare de Cimmérie
  - **Mot de passe** : `player123`
  - **Rôle** : User

- **Elric de Melniboné** (`elric@invoke.com`) - Empereur sorcier
  - **Mot de passe** : `player123`
  - **Rôle** : User

- **Fafhrd Le Barbare** (`fafhrd@invoke.com`) - Aventurier du Nord
  - **Mot de passe** : `player123`
  - **Rôle** : User

- **Le Souricier Gris** (`souricier@invoke.com`) - Voleur agile
  - **Mot de passe** : `player123`
  - **Rôle** : User

## 🔐 Identifiants de connexion

### Administrateur
- **Email** : `nacho@invoke.com`
- **Mot de passe** : `admin123`

### Maîtres de Jeu
- **Mot de passe** : `mj123`
- **Emails** : `maxime.chattam@invoke.com`, `julien.dutel@invoke.com`, `tolkien@invoke.com`, `gary.gygax@invoke.com`, `dave.arneson@invoke.com`

### Joueurs
- **Mot de passe** : `player123`
- **Emails** : `frodo@invoke.com`, `gandalf@invoke.com`, `aragorn@invoke.com`, `legolas@invoke.com`, `gimli@invoke.com`, `conan@invoke.com`, `elric@invoke.com`, `fafhrd@invoke.com`, `souricier@invoke.com`

## 🚀 Utilisation

### Créer les utilisateurs
```bash
cd server
node seed-users-jdr.js
```

### Réinitialiser la base de données
```bash
# Supprimer tous les utilisateurs
mongo invoke --eval "db.users.drop()"

# Recréer les utilisateurs
node seed-users-jdr.js
```

## 📊 Statistiques
- **Total** : 15 utilisateurs
- **Admin** : 1 (Nacho)
- **MJ** : 5 (Maxime, Julien, Tolkien, Gary, Dave)
- **Joueurs** : 9 (Frodo, Gandalf, Aragorn, Legolas, Gimli, Conan, Elric, Fafhrd, Souricier)
- **Featured** : 4 (Nacho, Maxime, Julien, Tolkien)

## 🎭 Rôles et permissions
- **Admin** : Accès complet à l'interface d'administration
- **DM** : Peut créer et gérer des sessions, marquer des jeux comme maîtrisés
- **User** : Peut rejoindre des sessions, ajouter des jeux aux favoris
