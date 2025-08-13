# Upload d'Avatar Utilisateur

Ce document décrit l'implémentation de l'upload d'avatar utilisateur dans l'application Invoke.

## 🎯 **Fonctionnalité Implémentée**

L'upload d'avatar utilisateur est maintenant **entièrement fonctionnel** avec :
- ✅ Validation des fichiers
- ✅ Gestion des permissions
- ✅ Stockage organisé
- ✅ Mise à jour automatique du modèle utilisateur
- ✅ Gestion des erreurs

## 📁 **Structure des Dossiers**

```
uploads/
├── user/                    # Nouveau système organisé
│   └── :userId/           # Dossier par utilisateur
│       └── avatar.{ext}   # Avatar de l'utilisateur
├── avatars/                # Ancien système (rétrocompatible)
└── characters/             # Ancien système (rétrocompatible)
```

## 🔌 **API Endpoint**

### **Upload d'Avatar**
```
POST /api/v1/users/:id/avatar
```

**Headers requis :**
- `Authorization: Bearer {JWT_TOKEN}`
- `Content-Type: multipart/form-data`

**Body :**
- `image` : Fichier image (avatar, banner, etc.)

**Paramètres :**
- `id` : ID de l'utilisateur

## 🔐 **Sécurité et Permissions**

### **Vérifications effectuées :**
1. **Authentification** : Utilisateur doit être connecté
2. **Autorisation** : Seul l'utilisateur lui-même ou un admin peut modifier l'avatar
3. **Validation** : Seuls les fichiers image sont acceptés
4. **Taille** : Limite de 5MB par fichier

### **Types de fichiers acceptés :**
- JPEG/JPG
- PNG
- WebP
- GIF

## 📝 **Exemple d'Utilisation**

### **Avec cURL :**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "image=@/path/to/avatar.jpg" \
  http://localhost:3000/api/v1/users/USER_ID/avatar
```

### **Avec JavaScript/Fetch :**
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const response = await fetch(`/api/v1/users/${userId}/avatar`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const result = await response.json();
if (result.success) {
  console.log('Avatar URL:', result.data.file.url);
  console.log('Utilisateur mis à jour:', result.data.user);
}
```

### **Avec Axios :**
```javascript
import axios from 'axios';

const formData = new FormData();
formData.append('image', file);

const response = await axios.post(
  `/api/v1/users/${userId}/avatar`,
  formData,
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  }
);

console.log('Avatar uploadé:', response.data);
```

## 📊 **Réponse de l'API**

### **Succès (200) :**
```json
{
  "success": true,
  "message": "Avatar uploadé avec succès",
  "data": {
    "user": {
      "id": "user123",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "/uploads/user/user123/avatar.jpg"
    },
    "file": {
      "filename": "avatar.jpg",
      "path": "uploads/user/user123/avatar.jpg",
      "size": 1024000,
      "mimetype": "image/jpeg",
      "url": "/uploads/user/user123/avatar.jpg"
    }
  }
}
```

### **Erreurs possibles :**

#### **400 - Aucun fichier fourni :**
```json
{
  "success": false,
  "message": "Aucun fichier fourni"
}
```

#### **401 - Non authentifié :**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

#### **403 - Non autorisé :**
```json
{
  "success": false,
  "message": "Vous n'êtes pas autorisé à modifier cet avatar"
}
```

#### **404 - Utilisateur non trouvé :**
```json
{
  "success": false,
  "message": "Utilisateur non trouvé"
}
```

#### **413 - Fichier trop volumineux :**
```json
{
  "success": false,
  "message": "File too large. Maximum size is 5MB."
}
```

## 🔄 **Comportement du Système**

### **Lors de l'upload :**
1. **Validation** : Vérification du type et de la taille du fichier
2. **Stockage** : Création automatique du dossier `uploads/user/:userId/`
3. **Nommage** : Le fichier est renommé en `avatar.{extension}`
4. **Remplacement** : L'ancien avatar est automatiquement remplacé
5. **Mise à jour DB** : Le champ `avatar` de l'utilisateur est mis à jour
6. **Timestamp** : Le champ `updatedAt` est mis à jour

### **Accès à l'image :**
- **URL directe** : `/uploads/user/:userId/avatar.{ext}`
- **Champ utilisateur** : `user.avatar` contient l'URL complète

## 🧪 **Tests et Validation**

### **Tests effectués :**
- ✅ Structure des dossiers
- ✅ Permissions d'écriture
- ✅ Authentification (401 sans token)
- ✅ Validation des fichiers
- ✅ Gestion des erreurs

### **Pour tester manuellement :**
1. Démarrer le serveur
2. Se connecter et récupérer un token JWT
3. Utiliser l'endpoint avec un fichier image
4. Vérifier la création du dossier et du fichier
5. Vérifier la mise à jour en base de données

## 🚀 **Prochaines Étapes**

### **Améliorations possibles :**
1. **Redimensionnement automatique** des images
2. **Compression** des fichiers
3. **Thumbnails** pour les avatars
4. **CDN** pour la distribution des images
5. **Backup** automatique des avatars

### **Intégration frontend :**
1. **Composant d'upload** avec drag & drop
2. **Prévisualisation** de l'image
3. **Barre de progression** pour l'upload
4. **Gestion des erreurs** côté client

## 📚 **Références**

- **Middleware d'upload** : `src/middlewares/upload.middleware.js`
- **Contrôleur utilisateur** : `src/resources/user/user.controller.js`
- **Route utilisateur** : `src/resources/user/user.route.js`
- **Modèle utilisateur** : `src/resources/user/user.model.js`
- **Documentation générale** : `docs/UPLOAD_API.md`
