# API Upload d'Images

Ce document décrit l'API de gestion des uploads d'images pour l'application Invoke.

## Structure des Dossiers

Les images sont organisées selon la structure suivante :

```
uploads/
├── user/
│   └── :userId/
│       └── avatar.{extension}
├── session/
│   └── :sessionId/
│       └── banner.{extension}
├── campaign/
│   └── :campaignId/
│       └── banner.{extension}
└── game/
    └── :gameName/
        ├── logo.{extension}
        ├── banner.{extension}
        └── portrait.{extension}
```

## Types de Fichiers Supportés

- **Images** : JPEG, JPG, PNG, WebP, GIF
- **Taille maximale** : 5MB par fichier

## Endpoints

### 1. Upload d'Avatar Utilisateur

**POST** `/api/v1/upload/user/:id/avatar`

**POST** `/api/v1/upload/user/avatar`

**Body (multipart/form-data):**
- `avatar` : Fichier image

**Paramètres:**
- `id` : ID de l'utilisateur (dans l'URL ou dans le body)

**Réponse:**
```json
{
  "success": true,
  "message": "Avatar uploadé avec succès",
  "data": {
    "userId": "user123",
    "filename": "avatar.jpg",
    "path": "uploads/user/user123/avatar.jpg",
    "size": 1024000,
    "mimetype": "image/jpeg",
    "url": "/uploads/user/user123/avatar.jpg"
  }
}
```

### 2. Upload de Bannière de Session

**POST** `/api/v1/upload/session/:id/banner`

**POST** `/api/v1/upload/session/banner`

**Body (multipart/form-data):**
- `banner` : Fichier image

**Paramètres:**
- `id` : ID de la session (dans l'URL ou dans le body)

### 3. Upload de Bannière de Campagne

**POST** `/api/v1/upload/campaign/:id/banner`

**POST** `/api/v1/upload/campaign/banner`

**Body (multipart/form-data):**
- `banner` : Fichier image

**Paramètres:**
- `id` : ID de la campagne (dans l'URL ou dans le body)

### 4. Upload d'Image de Jeu

**POST** `/api/v1/upload/game/:gameName/:imageType`

**POST** `/api/v1/upload/game/image`

**Body (multipart/form-data):**
- `image` : Fichier image
- `imageType` : Type d'image (logo, banner, portrait)

**Paramètres:**
- `gameName` : Nom du jeu (dans l'URL ou dans le body)
- `imageType` : Type d'image (dans l'URL ou dans le body)

### 5. Récupération d'Informations d'Image

**GET** `/api/v1/upload/:type/:id/:imageType?`

**Paramètres:**
- `type` : Type d'entité (user, session, campaign, game)
- `id` : ID de l'entité
- `imageType` : Type d'image (optionnel, pour les jeux)

**Réponse:**
```json
{
  "success": true,
  "data": {
    "filename": "avatar.jpg",
    "path": "uploads/user/user123/avatar.jpg",
    "size": 1024000,
    "created": "2024-01-01T00:00:00.000Z",
    "modified": "2024-01-01T00:00:00.000Z",
    "url": "/uploads/user/user123/avatar.jpg"
  }
}
```

### 6. Liste des Images par Type

**GET** `/api/v1/upload/list/:type`

**Paramètres:**
- `type` : Type d'entité (user, session, campaign, game)

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": "user123",
      "type": "user",
      "images": [
        {
          "filename": "avatar.jpg",
          "url": "/uploads/user/user123/avatar.jpg",
          "size": 1024000
        }
      ]
    }
  ]
}
```

### 7. Suppression d'Image

**DELETE** `/api/v1/upload/:type/:id/:imageType?`

**Paramètres:**
- `type` : Type d'entité (user, session, campaign, game)
- `id` : ID de l'entité
- `imageType` : Type d'image (optionnel, pour les jeux)

## Accès Direct aux Images

Les images sont accessibles directement via l'URL :
```
/uploads/:type/:id/:filename
```

Exemples :
- `/uploads/user/user123/avatar.jpg`
- `/uploads/session/session456/banner.png`
- `/uploads/campaign/campaign789/banner.webp`
- `/uploads/game/dnd5e/logo.png`

## Gestion des Erreurs

### Erreur de Type de Fichier
```json
{
  "success": false,
  "message": "Type de fichier non autorisé. Types acceptés: jpeg, jpg, png, webp, gif"
}
```

### Erreur de Taille de Fichier
```json
{
  "success": false,
  "message": "Fichier trop volumineux. Taille maximale: 5MB"
}
```

### Erreur de Validation
```json
{
  "success": false,
  "message": "ID utilisateur requis"
}
```

## Exemples d'Utilisation

### Upload d'Avatar avec cURL
```bash
curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "avatar=@/path/to/avatar.jpg" \
  http://localhost:3000/api/v1/upload/user/user123/avatar
```

### Upload de Bannière de Session avec cURL
```bash
curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "banner=@/path/to/banner.png" \
  http://localhost:3000/api/v1/upload/session/session456/banner
```

### Upload d'Image de Jeu avec cURL
```bash
curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "image=@/path/to/logo.png" \
  -F "imageType=logo" \
  http://localhost:3000/api/v1/upload/game/dnd5e/image
```

## Notes Importantes

1. **Remplacement automatique** : Lorsqu'une nouvelle image est uploadée, l'ancienne est automatiquement supprimée
2. **Création de dossiers** : Les dossiers sont créés automatiquement si ils n'existent pas
3. **Validation** : Seuls les fichiers image sont acceptés
4. **Sécurité** : Les fichiers sont stockés localement avec des noms prédéfinis
5. **Performance** : Les images sont servies directement par Express (pas de traitement supplémentaire)

## Intégration Frontend

Pour intégrer dans le frontend, utilisez `FormData` :

```javascript
const formData = new FormData();
formData.append('avatar', fileInput.files[0]);

fetch('/api/v1/upload/user/user123/avatar', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Image URL:', data.data.url);
  }
});
```
