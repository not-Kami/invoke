# 🎨 Composant Button - Variantes et Utilisation

## 📋 Variantes Disponibles

### **1. Primary (Défaut)**
```tsx
<Button variant="primary">
  Bouton Principal
</Button>
```
- **Style** : Dégradé violet-bleu avec ombre
- **Texte** : Blanc
- **Hover** : Dégradé plus foncé
- **Usage** : Actions principales, CTA

### **2. Secondary**
```tsx
<Button variant="secondary">
  Bouton Secondaire
</Button>
```
- **Style** : Dégradé gris-slate avec ombre
- **Texte** : Blanc
- **Hover** : Dégradé plus foncé
- **Usage** : Actions secondaires

### **3. Outline**
```tsx
<Button variant="outline">
  Bouton Contour
</Button>
```
- **Style** : Bordure blanche transparente, fond transparent
- **Texte** : Blanc
- **Hover** : Fond blanc semi-transparent
- **Usage** : Actions alternatives, navigation

### **4. Ghost**
```tsx
<Button variant="ghost">
  Bouton Fantôme
</Button>
```
- **Style** : Texte gris, pas de fond
- **Texte** : Gris clair → Blanc au hover
- **Hover** : Fond blanc semi-transparent
- **Usage** : Actions discrètes, navigation

### **5. Danger**
```tsx
<Button variant="danger">
  Supprimer
</Button>
```
- **Style** : Dégradé rouge-rose avec ombre
- **Texte** : Blanc
- **Hover** : Dégradé plus foncé
- **Usage** : Actions destructives, suppressions

### **6. White (Nouveau)**
```tsx
<Button variant="white">
  Bouton Blanc
</Button>
```
- **Style** : Fond blanc semi-transparent avec ombre
- **Texte** : Gris foncé (contraste garanti)
- **Hover** : Fond blanc opaque
- **Usage** : Boutons sur fond sombre, contraste élevé

### **7. Glass (Nouveau)**
```tsx
<Button variant="glass">
  Bouton Verre
</Button>
```
- **Style** : Fond blanc semi-transparent, bordure blanche
- **Texte** : Blanc
- **Hover** : Fond plus opaque
- **Usage** : Boutons élégants, effet glassmorphism

## 🎯 Tailles Disponibles

### **Small (sm)**
```tsx
<Button size="sm">Petit</Button>
```
- **Padding** : `px-3 py-1.5`
- **Texte** : `text-sm`

### **Medium (md) - Défaut**
```tsx
<Button size="md">Moyen</Button>
```
- **Padding** : `px-4 py-2`
- **Texte** : `text-sm`

### **Large (lg)**
```tsx
<Button size="lg">Grand</Button>
```
- **Padding** : `px-6 py-3`
- **Texte** : `text-base`

## ✨ Fonctionnalités

### **Loading State**
```tsx
<Button loading>
  Chargement...
</Button>
```
- Affiche un spinner animé
- Désactive le bouton automatiquement

### **Disabled State**
```tsx
<Button disabled>
  Désactivé
</Button>
```
- Opacité réduite
- Curseur non-allowed
- Pas d'interaction possible

### **Custom Classes**
```tsx
<Button className="w-full bg-red-500">
  Personnalisé
</Button>
```
- Classes Tailwind personnalisées
- Override des styles par défaut

## 🎨 Exemples d'Utilisation

### **Navigation Principale**
```tsx
<div className="flex gap-4">
  <Button variant="primary" size="lg">
    <Sword className="h-5 w-5 mr-2" />
    Commencer l'Aventure
  </Button>
  <Button variant="glass" size="lg">
    <BookOpen className="h-5 w-5 mr-2" />
    En savoir plus
  </Button>
</div>
```

### **Actions dans Cards**
```tsx
<Card>
  <CardContent>
    <Button variant="glass" className="w-full justify-start">
      <Settings className="h-4 w-4 mr-2" />
      Modifier le Profil
    </Button>
  </CardContent>
</Card>
```

### **Boutons de Navigation**
```tsx
<Button variant="ghost" className="text-gray-300 hover:text-white">
  <ArrowRight className="h-4 w-4 ml-2" />
  Voir tout
</Button>
```

## 🔧 Résolution des Problèmes

### **Contraste Texte/Fond**
- **Problème** : Texte blanc sur fond blanc
- **Solution** : Utiliser `variant="white"` pour un contraste garanti
- **Alternative** : Utiliser `variant="glass"` pour un effet transparent

### **Visibilité sur Fond Sombre**
- **Problème** : Boutons peu visibles
- **Solution** : Utiliser `variant="primary"` ou `variant="white"`
- **Alternative** : Ajouter des ombres avec `shadow-lg`

### **Cohérence Visuelle**
- **Problème** : Styles incohérents
- **Solution** : Utiliser les variantes prédéfinies
- **Alternative** : Personnaliser avec `className`

## 🚀 Bonnes Pratiques

1. **Utiliser les variantes appropriées** selon le contexte
2. **Maintenir la cohérence** dans toute l'interface
3. **Tester la lisibilité** sur différents fonds
4. **Éviter les overrides** complexes dans `className`
5. **Privilégier l'accessibilité** avec des contrastes suffisants

---

**💡 Astuce** : Pour les boutons sur fond sombre, utilisez `variant="white"` pour garantir un contraste parfait !
