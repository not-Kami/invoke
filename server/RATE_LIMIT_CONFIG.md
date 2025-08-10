# 🚀 Configuration du Rate Limiting

## 📋 Variables d'Environnement

### **Désactiver le Rate Limiting**

Pour désactiver complètement le rate limiting, ajoutez dans votre fichier `.env` :

```env
# Désactiver le rate limiting
DISABLE_RATE_LIMIT=true

# Ou utiliser le mode développement
NODE_ENV=development
```

### **Configuration Complète**

```env
# Configuration de l'environnement
NODE_ENV=development

# Configuration du serveur
PORT=3000

# Configuration de la base de données
MONGODB_URI=mongodb://localhost:27017/invoke

# Configuration JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Configuration CORS
FRONTEND_URLS=http://localhost:5173,http://localhost:3000

# Configuration du Rate Limiting
# Mettre à "true" pour désactiver complètement le rate limiting
DISABLE_RATE_LIMIT=true
```

## 🔧 Logique de Désactivation

Le rate limiting est automatiquement désactivé si :

1. **`NODE_ENV=development`** (mode développement)
2. **`DISABLE_RATE_LIMIT=true`** (désactivation explicite)

## 🚀 Redémarrage du Serveur

Après modification du fichier `.env`, redémarrez le serveur :

```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
npm run dev
```

## 📊 Vérification du Statut

Au démarrage du serveur, vous verrez :

```
🔄 Rate limiting désactivé: {
  reason: 'explicitement désactivé',
  environment: 'development'
}
```

## 🛡️ Réactivation pour la Production

Pour la production, assurez-vous que :

```env
NODE_ENV=production
DISABLE_RATE_LIMIT=false  # ou supprimez cette ligne
```

## 📝 Notes de Sécurité

- **Développement** : Rate limiting désactivé pour faciliter les tests
- **Production** : Rate limiting activé pour protéger contre les abus
- **Override** : `DISABLE_RATE_LIMIT=true` force la désactivation même en production

---

**⚠️ Attention** : Ne jamais désactiver le rate limiting en production sauf en cas d'urgence !
