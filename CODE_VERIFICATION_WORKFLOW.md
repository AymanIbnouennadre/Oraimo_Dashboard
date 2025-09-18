# 🔒 Workflow de Réinitialisation de Mot de Passe avec Code de Vérification

## 📋 Vue d'ensemble du nouveau système

Le nouveau système utilise un **code de vérification à 6 chiffres** envoyé par email au lieu d'un lien direct. Ce système est plus sécurisé car il nécessite une double vérification.

## 🔄 Flux complet en 3 étapes

### Étape 1: Demande du code de vérification
**Page:** `/forgot-password`
**API:** `POST /auth/forgot-password`

1. L'utilisateur saisit son email
2. Le backend génère un code à 6 chiffres
3. Le code est envoyé par email (pas de lien)
4. Redirection automatique vers `/verify-code?email=user@example.com`

### Étape 2: Vérification du code
**Page:** `/verify-code?email=user@example.com`
**API:** `POST /auth/verify-reset-code`

1. Interface avec 6 cases pour saisir le code
2. Auto-focus entre les cases
3. Support du paste d'un code complet
4. Bouton "Didn't receive?" pour renvoyer le code (avec countdown de 60s)
5. Vérification du code → retourne un token temporaire
6. Redirection vers `/reset-password?token=temp-token`

### Étape 3: Nouveau mot de passe
**Page:** `/reset-password?token=temp-token`
**API:** `POST /auth/reset-password`

1. Formulaire de nouveau mot de passe avec confirmation
2. Validation côté client
3. Utilise le token temporaire de l'étape 2
4. Succès → redirection vers login

## 🔧 APIs Backend requises

### 1. POST `/auth/forgot-password`
```json
// Request
{
  "email": "user@example.com"
}

// Response Success (200)
{
  "message": "Code de vérification envoyé par email"
}
```

### 2. POST `/auth/verify-reset-code` (NOUVEAU)
```json
// Request
{
  "email": "user@example.com",
  "code": "123456"
}

// Response Success (200)
{
  "message": "Code vérifié avec succès",
  "resetToken": "temp-token-uuid"
}

// Response Error (400)
{
  "error": "Code invalide ou expiré"
}
```

### 3. POST `/auth/reset-password`
```json
// Request
{
  "resetToken": "temp-token-uuid", // Token de l'étape 2
  "newPassword": "nouveau-mot-de-passe"
}

// Response Success (200)
{
  "message": "Mot de passe réinitialisé avec succès"
}
```

## ⚠️ Modifications Backend nécessaires

1. **Générer et stocker le code 6 chiffres** dans `/auth/forgot-password`
2. **Créer le endpoint `/auth/verify-reset-code`**
3. **Modifier l'email** pour envoyer seulement le code (pas de lien)

### Code Backend suggéré
```java
// Dans EmailService
public void sendPasswordResetEmail(String email, String resetCode) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(email);
    message.setSubject("Code de réinitialisation de mot de passe");
    message.setText("Votre code de vérification est: " + resetCode + 
                   "\n\nCe code expire dans 10 minutes." +
                   "\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.");
    mailSender.send(message);
}

// Dans UserService - nouvelle méthode
public String verifyResetCode(String email, String code) {
    // 1. Vérifier que le code existe et n'est pas expiré
    // 2. Si valide, générer un token temporaire (5 min d'expiration)
    // 3. Supprimer le code de vérification
    // 4. Retourner le token temporaire
    return temporaryToken;
}
```

## 🎨 Interface utilisateur

### Page de vérification du code
- **6 cases individuelles** pour saisir le code
- **Auto-focus** entre les cases
- **Support du paste** d'un code complet
- **Email masqué** (ex: u***@example.com)
- **Bouton "Renvoyer"** avec countdown
- **Validation temps réel**

### Fonctionnalités UX
- ✅ Auto-focus sur la case suivante
- ✅ Backspace pour revenir à la case précédente
- ✅ Paste d'un code complet
- ✅ Countdown pour limiter les renvois
- ✅ Messages d'erreur clairs
- ✅ Retour vers la page email

## 🔒 Sécurité

### Expirations recommandées
- **Code de vérification:** 10 minutes
- **Token temporaire:** 5 minutes (après vérification)

### Limitations
- **Tentatives limitées** pour le code
- **Rate limiting** sur les demandes de code
- **Token à usage unique**

## 📱 URLs de test

1. **Démarrer:** http://localhost:3001/forgot-password
2. **Vérification:** http://localhost:3001/verify-code?email=test@example.com
3. **Reset:** http://localhost:3001/reset-password?token=temp-token

## 🧪 Test du workflow complet

1. Aller sur `/forgot-password`
2. Entrer un email valide de votre base de données
3. Vérifier l'email reçu (code à 6 chiffres)
4. Être redirigé vers `/verify-code`
5. Saisir le code reçu
6. Être redirigé vers `/reset-password`
7. Changer le mot de passe
8. Se connecter avec le nouveau mot de passe

## 🎯 Avantages de cette approche

- ✅ **Plus sécurisé:** Double vérification email + code
- ✅ **Meilleure UX:** Interface claire et intuitive
- ✅ **Mobile-friendly:** Facile de copier-coller un code
- ✅ **Rate limiting:** Protection contre les abus
- ✅ **Audit trail:** Traçabilité des tentatives

Le système est maintenant prêt et sécurisé ! 🚀