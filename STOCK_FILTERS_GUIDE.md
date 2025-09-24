# Guide des Filtres de Stock

## ✅ Problèmes Résolus

### 1. **Filtres User et Product transformés en champs de recherche**
- **Avant** : Dropdowns avec sélection par ID
- **Après** : Champs de saisie libre pour recherche par nom/téléphone

### 2. **Types et interfaces nettoyées**
- Suppression de `userId` et `productId` des filtres
- Ajout de `userNameLike` et `productNameLike`
- Interface `StockHistoryFilters` mise à jour

### 3. **Service API optimisé**
- Paramètres de recherche envoyés correctement au backend
- Fallback vers filtrage côté client si API indisponible
- Logs d'erreur améliorés

## 🎯 Fonctionnalités des Filtres

### **Filtres Disponibles :**

1. **User Search** (`userNameLike`)
   - Placeholder: "User name or phone..."
   - Recherche dans les noms d'utilisateurs et numéros de téléphone
   - Recherche insensible à la casse

2. **Product Search** (`productNameLike`)
   - Placeholder: "Product name..."
   - Recherche dans les noms marketing et modèles de produits
   - Recherche insensible à la casse

3. **Movement Type** (`movementType`)
   - Options: All Types, Purchase, Sale
   - Filtre par type de mouvement de stock

4. **Detection ID** (`detectionId`)
   - Recherche par ID de détection spécifique
   - Champ numérique

5. **Model Like** (`modelLike`)
   - Recherche par modèle de produit
   - Recherche partielle dans les noms de modèles

6. **Price Range** (`minPrice`, `maxPrice`)
   - Filtres de prix minimum et maximum
   - Champs numériques

7. **Quantity Range** (`minQuantity`, `maxQuantity`)
   - Filtres de quantité minimum et maximum
   - Champs numériques

8. **Date Range** (`createdFrom`, `createdTo`)
   - Filtres de date de création
   - Sélecteurs de date

## 🔧 Implémentation Technique

### **Fichiers Modifiés :**

1. **`components/stock/stock-filters.tsx`**
   - Interface utilisateur des filtres (2 lignes maximum)
   - Gestion des états et événements
   - Badges pour filtres actifs

2. **`lib/types.ts`**
   - Interface `StockHistoryFilters` nettoyée
   - Suppression des anciens champs ID

3. **`lib/services/stock-history.ts`**
   - Méthode `searchStockHistory` mise à jour
   - Paramètres corrects envoyés à l'API

4. **`app/dashboard/stock/page.tsx`**
   - Gestion d'état simplifiée
   - Fallback de filtrage côté client
   - Logs d'erreur améliorés

### **API Endpoint :**
```
GET /api/history-stock/search?userNameLike=nom&productNameLike=produit&movementType=Purchase
```

### **Filtrage Côté Client (Fallback) :**
- Si l'API backend n'est pas disponible
- Filtrage directement sur les données enrichies
- Recherche insensible à la casse
- Support de tous les types de filtres

## 🚀 Utilisation

1. **Recherche d'utilisateur :**
   - Tapez le nom ou numéro de téléphone dans "User Search"
   - Résultats filtrés automatiquement

2. **Recherche de produit :**
   - Tapez le nom du produit dans "Product Search"
   - Recherche dans noms marketing et modèles

3. **Filtres combinés :**
   - Tous les filtres peuvent être utilisés ensemble
   - Filtrage en temps réel

4. **Réinitialisation :**
   - Bouton "Clear Filters" pour tout effacer
   - Suppression individuelle via badges actifs

## ⚡ Performance

- **Filtrage API** : Préféré pour performance côté serveur
- **Fallback Client** : Utilisé si backend indisponible
- **États optimisés** : Évite les re-renders inutiles
- **Debouncing** : Peut être ajouté pour optimiser les requêtes

## 🐛 Résolution des Problèmes

### **Filtres ne marchent pas :**
1. Vérifiez que le backend est démarré sur `https://oraimosmartscan-cbdfada7brfyfwbg.francecentral-01.azurewebsites.net`
2. Consultez la console pour les erreurs API
3. Le fallback côté client devrait fonctionner automatiquement

### **Données manquantes :**
1. Vérifiez les fichiers mock dans `lib/mocks/`
2. Assurez-vous que `enrichStockHistory` est appelée
3. Vérifiez que userName et productMarketingName sont générés

### **Interface incorrecte :**
1. Vérifiez `StockHistoryFilters` dans `types.ts`
2. Assurez-vous que tous les champs sont optionnels
3. Vérifiez la cohérence entre service et composants