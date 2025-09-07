# Configuration Cloudinary pour Invoke

Ce document explique comment configurer et utiliser Cloudinary pour l'upload d'images dans l'application Invoke.

## 🚀 Configuration Initiale

### 1. Créer un compte Cloudinary

1. Allez sur [https://cloudinary.com/](https://cloudinary.com/)
2. Créez un compte gratuit (25GB de stockage + 25GB de bande passante/mois)
3. Une fois connecté, allez dans le [Dashboard](https://cloudinary.com/console)

### 2. Récupérer les clés API

Dans le Dashboard Cloudinary, vous trouverez :
- **Cloud Name** : Votre nom de cloud
- **API Key** : Votre clé API
- **API Secret** : Votre secret API

### 3. Configurer les variables d'environnement

Ajoutez ces variables à votre fichier `.env` :

```env
# ===== CLOUDINARY =====
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📡 Nouvelles Routes API

### Routes Cloudinary (recommandées)

#### Upload d'Avatar Utilisateur
```
POST /api/v1/upload/cloudinary/user/:id/avatar
POST /api/v1/upload/cloudinary/user/avatar
```

#### Upload de Bannière de Session
```
POST /api/v1/upload/cloudinary/session/:id/banner
POST /api/v1/upload/cloudinary/session/banner
```

#### Upload de Bannière de Campagne
```
POST /api/v1/upload/cloudinary/campaign/:id/banner
POST /api/v1/upload/cloudinary/campaign/banner
```

#### Upload d'Image de Jeu
```
POST /api/v1/upload/cloudinary/game/:gameId/:imageType
POST /api/v1/upload/cloudinary/game/name/:gameName/:imageType
POST /api/v1/upload/cloudinary/game/image
```

#### Suppression d'Image
```
DELETE /api/v1/upload/cloudinary/:publicId
```

## 🔄 Migration depuis l'Upload Local

### Avantages de Cloudinary

✅ **Compatible avec Render** : Pas de problème d'espace disque  
✅ **CDN mondial** : Images optimisées et rapides  
✅ **Transformations automatiques** : Compression, redimensionnement  
✅ **Gratuit** : 25GB de stockage + 25GB de bande passante  
✅ **Sécurisé** : URLs signées, contrôle d'accès  

### Structure des URLs

Les images sont organisées dans Cloudinary avec cette structure :
```
invoke/
├── user/
│   └── {userId}/
│       └── avatar_{timestamp}.{ext}
├── session/
│   └── {sessionId}/
│       └── banner_{timestamp}.{ext}
├── campaign/
│   └── {campaignId}/
│       └── banner_{timestamp}.{ext}
└── game/
    └── {gameId}/
        ├── logo_{timestamp}.{ext}
        ├── banner_{timestamp}.{ext}
        └── portrait_{timestamp}.{ext}
```

## 🧪 Test de l'Intégration

### Test avec cURL

```bash
# Test upload avatar
curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "avatar=@/path/to/avatar.jpg" \
  http://localhost:3000/api/v1/upload/cloudinary/user/user123/avatar

# Test upload image de jeu
curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "image=@/path/to/logo.png" \
  http://localhost:3000/api/v1/upload/cloudinary/game/gameId/logo
```

### Réponse Type

```json
{
  "success": true,
  "message": "Avatar uploadé avec succès",
  "data": {
    "userId": "user123",
    "public_id": "invoke/user/user123/avatar_1234567890",
    "secure_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/invoke/user/user123/avatar_1234567890.jpg",
    "width": 800,
    "height": 600,
    "bytes": 1024000,
    "format": "jpg",
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/invoke/user/user123/avatar_1234567890.jpg"
  }
}
```

## 🔧 Configuration Frontend

### Exemple d'utilisation avec fetch

```javascript
const uploadImage = async (file, type, id, imageType = null) => {
  const formData = new FormData();
  formData.append(type === 'user' ? 'avatar' : 'image', file);
  
  const endpoint = imageType 
    ? `/api/v1/upload/cloudinary/${type}/${id}/${imageType}`
    : `/api/v1/upload/cloudinary/${type}/${id}`;
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Image URL:', result.data.secure_url);
      return result.data.secure_url;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Erreur upload:', error);
    throw error;
  }
};

// Utilisation
const imageUrl = await uploadImage(file, 'user', userId);
const gameLogoUrl = await uploadImage(file, 'game', gameId, 'logo');
```

## 🚨 Gestion des Erreurs

### Erreurs Courantes

1. **Variables d'environnement manquantes**
   ```
   Error: Cloudinary configuration missing
   ```
   → Vérifiez que toutes les variables CLOUDINARY_* sont définies

2. **Clés API invalides**
   ```
   Error: Invalid API credentials
   ```
   → Vérifiez vos clés dans le Dashboard Cloudinary

3. **Fichier trop volumineux**
   ```
   Error: File too large. Maximum size is 5MB.
   ```
   → Réduisez la taille de l'image

## 🔄 Migration des Images Existantes

Si vous avez des images existantes en local, vous pouvez les migrer vers Cloudinary :

1. **Script de migration** (à créer si nécessaire)
2. **Mise à jour des URLs** dans la base de données
3. **Test des nouvelles URLs**

## 📊 Monitoring

### Dashboard Cloudinary

- **Usage** : Voir l'utilisation du stockage et de la bande passante
- **Analytics** : Statistiques d'utilisation des images
- **Transformations** : Voir les transformations appliquées

### Logs Serveur

Les logs incluent maintenant les informations Cloudinary :
```
[INFO] Upload Cloudinary: { public_id: '...', bytes: 1024000, format: 'jpg' }
[ERROR] Erreur upload Cloudinary: { error: '...' }
```

## 🎯 Prochaines Étapes

1. **Tester l'upload** avec les nouvelles routes
2. **Migrer le frontend** pour utiliser les routes Cloudinary
3. **Configurer les variables** sur Render
4. **Déployer** et tester en production

## 📚 Ressources

- [Documentation Cloudinary](https://cloudinary.com/documentation)
- [API Reference](https://cloudinary.com/documentation/image_upload_api_reference)
- [Transformations](https://cloudinary.com/documentation/image_transformations)
