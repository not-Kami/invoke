# Collection Insomnia - Création d'utilisateurs JDR

Cette collection contient des requêtes pour créer des utilisateurs avec des noms de références au monde du JDR.

## 🎲 Utilisateurs créés

### 👑 Administrateur
- **Nacho Admin** (`nacho@invoke.com`) - Le boss des boss ! 🎲👑 (créé via seeder)

### 🎭 Maîtres de Jeu (isDM: true)
- **Maxime Chattam** - Auteur français de JDR
- **Julien Dutel** - Créateur de JDR français
- **J.R.R. Tolkien** - Père de la fantasy moderne
- **Dave Arneson** - Co-créateur de D&D
- **Monte Cook** - Designer de JDR renommé

### ⚔️ Joueurs (isDM: false)
- **Elminster Aumar** - Mage légendaire de D&D
- **Drizzt Do'Urden** - Ranger drow légendaire
- **Raistlin Majere** - Mage de Dragonlance
- **Conan the Barbarian** - Barbare légendaire
- **Gandalf the Grey** - Mage de la Terre du Milieu
- **Aragorn Elessar** - Ranger du Gondor
- **Legolas Greenleaf** - Elfe de la Forêt Noire
- **Gimli son of Glóin** - Nain de la Montagne Solitaire
- **Frodo Baggins** - Hobbit porteur de l'Anneau

## 🚀 Instructions d'utilisation

### 1. Importer la collection
1. Ouvrir Insomnia
2. Cliquer sur "Import/Export" → "Import Data"
3. Sélectionner le fichier `insomnia_users_creation.json`

### 2. Configurer l'environnement
- **Développement** : `base_url = http://localhost:3000/api/v1`
- **Production** : `base_url = https://invoke-api.onrender.com/api/v1`

### 3. Exécuter les requêtes
1. Sélectionner l'environnement approprié
2. Exécuter les requêtes dans l'ordre (1-15)
3. Vérifier les réponses pour s'assurer que les utilisateurs sont créés

## 🔐 Identifiants de connexion

### Administrateur
- **Email** : `nacho@invoke.com`
- **Mot de passe** : `admin123`
- **Note** : Créé via seeder, pas besoin de l'ajouter via Insomnia

### Maîtres de Jeu
- **Mot de passe** : `mj123`
- **Emails** : `maxime.chattam@invoke.com`, `julien.dutel@invoke.com`, etc.

### Joueurs
- **Mot de passe** : `player123`
- **Emails** : `elminster@invoke.com`, `drizzt@invoke.com`, etc.

## 📝 Structure des requêtes

Chaque requête utilise l'endpoint `POST /auth/signup` avec le body suivant :

```json
{
  "firstName": "Prénom",
  "lastName": "Nom",
  "email": "email@invoke.com",
  "password": "motdepasse",
  "isDM": true/false,
  "avatar": null
}
```

## 🎯 Utilisation recommandée

1. **Créer d'abord l'admin** (Gary Gygax) pour avoir accès au panel d'administration
2. **Créer les MJ** pour pouvoir créer des sessions
3. **Créer les joueurs** pour tester l'inscription aux sessions
4. **Modifier les avatars** via l'interface admin si nécessaire

## ⚠️ Notes importantes

- Tous les mots de passe sont simples pour les tests
- Les avatars sont initialisés à `null` (à modifier via l'admin)
- Les utilisateurs sont créés avec `verified: false` par défaut
- L'admin peut modifier les rôles et permissions via le panel d'administration
