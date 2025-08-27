# 🔒 Sécurité des Routes d'Upload - INVOKE

## 🚨 **PROBLÈME DE SÉCURITÉ IDENTIFIÉ**

### **Situation initiale (CRITIQUE)**
- **Routes d'upload non protégées** : Accessibles sans authentification
- **Upload d'avatar possible** par n'importe qui pour n'importe quel utilisateur
- **Modification d'images** de sessions/campagnes sans vérification des permissions
- **Risque de pollution** de la base de données et du stockage

### **Impact de sécurité**
- **Usurpation d'identité** : Upload d'avatars pour d'autres utilisateurs
- **Vandalisme** : Modification d'images de sessions/campagnes
- **Stockage abusif** : Utilisation du serveur comme stockage d'images malveillantes
- **Non-conformité RGPD** : Accès non autorisé aux ressources utilisateur

---

## ✅ **SOLUTIONS IMPLÉMENTÉES**

### **1. Protection globale des routes d'upload**
```javascript
// Dans upload.route.js
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// 🔒 PROTECTION GLOBALE - Toutes les routes d'upload nécessitent une authentification
router.use(protect);
```

**Résultat :** Aucune route d'upload n'est accessible sans token JWT valide.

### **2. Vérification des permissions par ressource**
```javascript
// Upload d'avatar utilisateur
export const uploadUserAvatar = async (req, res) => {
    const userId = req.params.id || req.body.userId;
    
    // Seul l'utilisateur lui-même ou un admin peut modifier l'avatar
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Non autorisé à modifier cet avatar'
        });
    }
    // ... reste du code
};
```

**Résultat :** Seuls les propriétaires ou admins peuvent modifier les ressources.

---

## 🔧 **CHANGEMENTS TECHNIQUES**

### **Routes protégées**
| Route | Protection | Permission requise |
|-------|------------|-------------------|
| `/upload/user/:id/avatar` | ✅ `protect` | Propriétaire ou admin |
| `/upload/session/:id/banner` | ✅ `protect` | Propriétaire ou admin (TODO) |
| `/upload/campaign/:id/banner` | ✅ `protect` | Propriétaire ou admin (TODO) |
| `/upload/game/*` | ✅ `protect` | Admin uniquement (TODO) |
| `/upload/delete/*` | ✅ `protect` | Admin uniquement (TODO) |

### **Middleware appliqué**
- **`protect`** : Vérification JWT et authentification
- **Vérification des permissions** : Logique métier dans les contrôleurs
- **Gestion des erreurs** : Réponses HTTP appropriées (401, 403)

---

## 🎯 **IMPACT SUR L'APPLICATION**

### **✅ Ce qui continue de fonctionner**
- **Upload d'avatar dans le profil** : Utilisateur connecté modifiant son propre avatar
- **Upload d'images par les admins** : Accès complet pour la gestion
- **Toutes les autres fonctionnalités** : Non impactées

### **❌ Ce qui ne fonctionne plus**
- **Upload d'avatar lors de l'inscription** : Utilisateur non connecté
- **Upload d'images par des utilisateurs non autorisés**
- **Accès aux routes d'upload sans authentification**

---

## 🚀 **PROCHAINES ÉTAPES**

### **Phase 1 : Sécurité immédiate (TERMINÉE) ✅**
- [x] Ajout du middleware `protect` sur toutes les routes
- [x] Vérification des permissions pour les avatars utilisateur
- [x] Tests de sécurité de base

### **Phase 2 : Permissions granulaires (EN COURS) 🔄**
- [ ] Vérification de propriété pour les sessions
- [ ] Vérification de propriété pour les campagnes
- [ ] Restriction des images de jeu aux admins uniquement
- [ ] Restriction de suppression aux admins uniquement

### **Phase 3 : Onboarding et UX (À FAIRE) ⏳**
- [ ] Retirer l'upload d'avatar de SignupPage
- [ ] Créer une page d'onboarding pour l'upload d'avatar
- [ ] Gérer la transition signup → onboarding → profil

---

## 🧪 **TESTS DE SÉCURITÉ**

### **Tests à effectuer**
1. **Accès sans token** : Vérifier que toutes les routes retournent 401
2. **Accès avec token invalide** : Vérifier le rejet des tokens expirés
3. **Modification d'avatar d'autrui** : Vérifier le rejet avec 403
4. **Upload par utilisateur non autorisé** : Vérifier les restrictions

### **Commandes de test**
```bash
# Test sans authentification (doit retourner 401)
curl -X POST http://localhost:3000/api/v1/upload/user/123/avatar

# Test avec token invalide (doit retourner 401)
curl -X POST \
  -H "Authorization: Bearer invalid_token" \
  http://localhost:3000/api/v1/upload/user/123/avatar

# Test avec token valide mais mauvais utilisateur (doit retourner 403)
curl -X POST \
  -H "Authorization: Bearer valid_token_for_user_456" \
  http://localhost:3000/api/v1/upload/user/123/avatar
```

---

## 📋 **CHECKLIST DE SÉCURITÉ**

### **✅ Implémenté**
- [x] Protection globale des routes d'upload
- [x] Vérification des permissions pour les avatars utilisateur
- [x] Middleware d'authentification JWT
- [x] Gestion des erreurs de sécurité

### **🔄 En cours**
- [ ] Vérification des permissions pour les sessions
- [ ] Vérification des permissions pour les campagnes
- [ ] Tests de sécurité complets

### **⏳ À faire**
- [ ] Vérification des permissions pour les jeux
- [ ] Audit de sécurité complet
- [ ] Monitoring des tentatives d'accès non autorisées

---

## 🔍 **MONITORING ET LOGS**

### **Logs de sécurité à surveiller**
- **Tentatives d'accès non authentifiées** : Routes d'upload sans token
- **Tentatives d'accès non autorisées** : Modifications de ressources d'autrui
- **Échecs d'authentification** : Tokens invalides ou expirés

### **Métriques de sécurité**
- **Nombre de tentatives d'accès non autorisées**
- **Taux de succès des uploads autorisés**
- **Temps de réponse des vérifications de permissions**

---

## 📚 **RÉFÉRENCES**

### **Fichiers modifiés**
- `server/src/resources/upload/upload.route.js` : Ajout de la protection globale
- `server/src/resources/upload/upload.controller.js` : Vérification des permissions

### **Documentation associée**
- `server/docs/AVATAR_UPLOAD.md` : Spécifications d'upload d'avatar
- `server/docs/UPLOAD_API.md` : Documentation de l'API d'upload

---

**Dernière mise à jour :** 15 août 2025  
**Statut :** Sécurité immédiate implémentée ✅  
**Prochaine étape :** Permissions granulaires et tests de sécurité 🔄


