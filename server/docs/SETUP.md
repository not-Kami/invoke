# 🚀 Guide de Configuration du Serveur Invoke

## 📋 Prérequis

- Node.js 18+ installé
- MongoDB installé et démarré
- Git installé

## 🔧 Installation

### 1. **Cloner le projet**
```bash
git clone <votre-repo>
cd invoke/server
npm install
```

### 2. **Configuration des variables d'environnement**

#### **Option A : Copier le fichier d'exemple**
```bash
cp docs/env.example .env
```

#### **Option B : Créer manuellement le fichier .env**
```bash
touch .env
```

### 3. **Configurer le fichier .env**

```bash
# URL du serveur (IMPORTANT pour les uploads d'images)
SERVER_URL=http://localhost:3000

# Base de données MongoDB
MONGODB_URI=mongodb://localhost:27017/invoke

# Secrets JWT et cookies (GÉNÉRER DES VALEURS UNIQUES)
JWT_SECRET=votre-secret-jwt-super-securise-ici
COOKIE_SECRET=votre-secret-cookie-super-securise-ici

# Configuration des logs
LOG_LEVEL=info

# Port du serveur
PORT=3000

# Configuration CORS
CORS_ORIGIN=http://localhost:5173
```

### 4. **Générer des secrets sécurisés**

#### **Pour JWT_SECRET :**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### **Pour COOKIE_SECRET :**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🎯 **Variables d'environnement importantes**

### **SERVER_URL** (OBLIGATOIRE)
- **Développement** : `http://localhost:3000`
- **Production** : `https://votre-domaine.com`
- **Utilisation** : Génère les URLs complètes des images uploadées

### **MONGODB_URI** (OBLIGATOIRE)
- **Local** : `mongodb://localhost:27017/invoke`
- **Cloud** : `mongodb+srv://user:pass@cluster.mongodb.net/invoke`

### **JWT_SECRET** (OBLIGATOIRE)
- **Générer** : Une valeur unique et sécurisée
- **Longueur** : Au moins 32 caractères

## 🚀 **Démarrer le serveur**

### **Développement**
```bash
npm run dev
```

### **Production**
```bash
npm start
```

## 📁 **Structure des dossiers créés automatiquement**

```
server/
├── uploads/
│   ├── user/          # Avatars utilisateurs
│   ├── avatars/       # Fallback ancien système
│   ├── characters/    # Avatars personnages
│   ├── session/       # Bannières sessions
│   ├── campaign/      # Bannières campagnes
│   └── game/          # Images de jeux
├── logs/              # Fichiers de logs
└── .env               # Variables d'environnement
```

## 🔍 **Vérification de l'installation**

### **1. Test de santé du serveur**
```bash
curl http://localhost:3000/api/v1/health
```

### **2. Test de l'endpoint d'upload**
```bash
# Créer une image de test
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > test.png

# Tester l'upload (avec un token JWT valide)
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@test.png" \
  http://localhost:3000/api/v1/users/USER_ID/avatar
```

## ⚠️ **Sécurité**

- **Ne jamais commiter** le fichier `.env` dans Git
- **Utiliser des secrets forts** en production
- **Configurer HTTPS** en production
- **Limiter l'accès** aux dossiers d'upload

## 🆘 **Dépannage**

### **Problème : Images non accessibles**
- Vérifier que `SERVER_URL` est correct dans `.env`
- Vérifier que le serveur statique est configuré
- Vérifier les permissions des dossiers d'upload

### **Problème : Erreur de connexion MongoDB**
- Vérifier que MongoDB est démarré
- Vérifier `MONGODB_URI` dans `.env`
- Vérifier les permissions de la base de données

### **Problème : Erreurs JWT**
- Vérifier que `JWT_SECRET` est défini
- Vérifier que `JWT_EXPIRES_IN` est valide
- Régénérer le secret si nécessaire

## 📞 **Support**

En cas de problème, vérifiez :
1. Les logs du serveur (`logs/server.log`)
2. La configuration dans `.env`
3. La documentation de l'API
