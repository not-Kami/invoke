# 🔒 Système de Sécurité - Double Vérification

## Vue d'ensemble

Ce projet implémente un système de sécurité à **double vérification** pour protéger l'interface d'administration et les fonctionnalités sensibles.

## 🛡️ Couches de Sécurité

### 1. **Route Level Security** (`SecureRoute`)
- **Première ligne de défense** au niveau des routes
- Vérifie les permissions avant le rendu des composants
- Redirige automatiquement en cas d'accès non autorisé

### 2. **Component Level Security** (`AdminSecurityWrapper`)
- **Deuxième ligne de défense** au niveau des composants
- Vérification supplémentaire dans les composants sensibles
- Affichage d'écrans de sécurité appropriés

### 3. **Hook Level Security** (`usePermissions`, `useAdminAuth`)
- **Troisième ligne de défense** au niveau de la logique
- Vérifications programmatiques dans les composants
- Gestion centralisée des permissions

### 4. **API Level Security** (Backend)
- **Quatrième ligne de défense** côté serveur
- Validation des tokens et rôles sur chaque endpoint
- Protection contre les attaques directes

## 🔐 Composants de Sécurité

### `SecureRoute`
```typescript
<SecureRoute requiredRole="admin" showSecurityInfo={true}>
  <AdminLayout>
    <AdminPage />
  </AdminLayout>
</SecureRoute>
```

**Fonctionnalités :**
- Vérification des rôles requis
- Vérification du statut MJ si nécessaire
- Redirection automatique
- Affichage d'informations de sécurité

### `AdminSecurityWrapper`
```typescript
<AdminSecurityWrapper>
  <AdminLayout>
    {children}
  </AdminLayout>
</AdminSecurityWrapper>
```

**Fonctionnalités :**
- Vérification admin stricte
- Écrans de sécurité personnalisés
- Logs de débogage
- Gestion des états de chargement

### `SecureAction`
```typescript
<SecureAction requiredRole="admin" action="delete" resource="user">
  <Button onClick={handleDelete}>Supprimer</Button>
</SecureAction>
```

**Fonctionnalités :**
- Sécurisation des actions sensibles
- Fallback pour actions non autorisées
- Indicateurs visuels de sécurité

## 🎯 Hooks de Sécurité

### `usePermissions`
```typescript
const { canViewAdminPanel, canManageUsers, isAdmin } = usePermissions();

if (!canViewAdminPanel) {
  return <AccessDenied />;
}
```

**Permissions disponibles :**
- `canViewAdminPanel()` - Accès au panel admin
- `canManageUsers()` - Gestion des utilisateurs
- `canManageSessions()` - Gestion des sessions
- `canManageCampaigns()` - Gestion des campagnes
- `canEditProfile()` - Édition des profils

### `useAdminAuth`
```typescript
const { user, loading, isAdmin, isAuthenticated } = useAdminAuth();

// Redirection automatique si non admin
```

**Fonctionnalités :**
- Vérification automatique des permissions admin
- Redirection automatique
- Gestion des états de chargement

## 🚨 Gestion des Accès Non Autorisés

### **Utilisateur non connecté :**
- Redirection vers `/login`
- Message d'erreur explicite
- Logs de sécurité

### **Utilisateur non admin :**
- Redirection vers `/`
- Affichage des permissions requises
- Informations sur le rôle actuel

### **Tentatives d'accès direct :**
- Protection au niveau des composants
- Vérification dans `useEffect`
- Affichage d'écrans de sécurité

## 📊 Logs de Sécurité

### **Console Logs :**
```typescript
console.log('AdminRoute Debug - User role:', user?.role);
console.log('useAdminAuth: User is not admin, redirecting to home');
console.log('AdminPage: Access denied - user is not admin');
```

### **Informations tracées :**
- Tentatives d'accès
- Rôles des utilisateurs
- Redirections effectuées
- Erreurs de permissions

## 🔧 Configuration

### **Variables d'environnement :**
```env
# Niveau de sécurité (development/production)
NODE_ENV=development

# Affichage des informations de sécurité
REACT_APP_SHOW_SECURITY_INFO=true
```

### **Personnalisation :**
```typescript
// Activer les informations de sécurité
<SecureRoute showSecurityInfo={true}>

// Redirection personnalisée
<SecureRoute redirectTo="/unauthorized">

// Permissions personnalisées
<SecureAction requiredRole="admin" requiredDM={true}>
```

## 🧪 Tests de Sécurité

### **Scénarios testés :**
1. **Utilisateur non connecté** → Redirection login
2. **Utilisateur user** → Accès refusé admin
3. **Utilisateur admin** → Accès autorisé
4. **Accès direct aux URLs** → Protection active
5. **Manipulation du state** → Vérification composant

### **Commandes de test :**
```bash
# Tester l'accès admin
curl -H "Cookie: session=..." http://localhost:5173/admin

# Tester les permissions
npm run test:security
```

## 🚀 Bonnes Pratiques

### **1. Toujours utiliser les composants de sécurité :**
```typescript
// ✅ Bon
<SecureRoute requiredRole="admin">
  <AdminPage />
</SecureRoute>

// ❌ Mauvais
<Route path="/admin" element={<AdminPage />} />
```

### **2. Vérifier les permissions dans les composants :**
```typescript
// ✅ Bon
const { canManageUsers } = usePermissions();
if (!canManageUsers) return null;

// ❌ Mauvais
// Pas de vérification
```

### **3. Utiliser les hooks de sécurité :**
```typescript
// ✅ Bon
const { isAdmin } = useAdminAuth();

// ❌ Mauvais
const { user } = useAuth();
if (user?.role === 'admin') // Vérification manuelle
```

## 🔍 Monitoring et Audit

### **Métriques de sécurité :**
- Tentatives d'accès non autorisées
- Redirections de sécurité
- Temps de vérification des permissions
- Erreurs de sécurité

### **Alertes :**
- Accès admin depuis des comptes non admin
- Tentatives répétées d'accès
- Modifications suspectes des permissions

---

**⚠️ Important :** Cette sécurité côté client est une première ligne de défense. La **vraie sécurité doit être implémentée côté serveur** avec validation des tokens et vérification des rôles sur chaque endpoint.
