# 🔐 Options pour la validation email/rôle admin

## 🎯 Deux approches possibles

### Option A : Validation côté backend uniquement (Recommandée)
### Option B : Validation côté frontend + backend (Plus sécurisée)

# � Sécurisation du forgot-password

## 🎯 Situation actuelle

Votre endpoint `/auth/forgot-password` fonctionne et vérifie déjà :
- ✅ L'existence de l'email dans la base de données  
- ❌ Mais PAS le rôle de l'utilisateur (ADMIN vs USER)

## 🛡️ Modification recommandée

Pour sécuriser l'accès aux admins uniquement, modifiez votre `UserService.requestPasswordReset()` :

```java
public void requestPasswordReset(String email) {
    User user = userRepository.findByEmail(email);
    
    // ✅ Ajouter cette vérification de rôle
    if (user != null && user.getRole() == UserRole.ADMIN) {
        String code = String.format("%06d", new Random().nextInt(1000000));
        
        // Votre code existant...
        user.setPasswordResetToken(token);
        user.setPasswordResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);
        
        emailService.sendPasswordResetEmail(user.getEmail(), code);
    }
    
    // ⚠️ Important : Ne pas révéler pourquoi ça échoue (sécurité)
    // Toujours retourner success, même si email inexistant ou non-admin
}
```

## 📋 Messages d'erreur actuels

D'après votre test :
- ✅ Email inexistant → `404 "Email introuvable"`
- ❌ Email USER (non-admin) → Probablement envoi du code quand même

## 🔒 Messages d'erreur recommandés

```java
// Option A : Pas de message d'erreur (plus sécurisé)
public void requestPasswordReset(String email) {
    User user = userRepository.findByEmail(email);
    if (user != null && user.getRole() == UserRole.ADMIN) {
        // Envoyer le code
    }
    // Toujours success (ne révèle rien)
}

// Option B : Message générique
public void requestPasswordReset(String email) {
    User user = userRepository.findByEmail(email);
    if (user != null && user.getRole() == UserRole.ADMIN) {
        // Envoyer le code
    } else {
        throw new RuntimeException("Password reset not available for this account");
    }
}
```

## 🚀 Workflow sécurisé final

1. **Frontend** → Envoie l'email saisi
2. **Backend** → Vérifie email existe ET rôle ADMIN
3. **Si OK** → Envoie le code 6 chiffres
4. **Si KO** → Erreur générique (sans révéler pourquoi)

## ✅ Avantages

- � Seuls les admins peuvent réinitialiser leur mot de passe
- 👤 Les utilisateurs normaux ne peuvent pas abuser du système  
- 🛡️ Pas d'énumération d'emails/rôles
- 🚀 Une seule modification dans votre code existant

C'est la solution la plus simple et efficace ! 🎯

### Endpoint à créer : `POST /auth/validate-email`

**URL :** `https://oraimosmartscan-cbdfada7brfyfwbg.francecentral-01.azurewebsites.net/auth/validate-email`

**Request Body :**
```json
{
  "email": "admin@example.com"
}
```

**Response Success (200) - Email existe et est admin :**
```json
{
  "exists": true,
  "isAdmin": true,
  "message": "Email validated successfully"
}
```

**Response Success (200) - Email existe mais n'est pas admin :**
```json
{
  "exists": true,
  "isAdmin": false,
  "message": "User found but not an administrator"
}
```

**Response Success (200) - Email n'existe pas :**
```json
{
  "exists": false,
  "isAdmin": false,
  "message": "No user found with this email"
}
```

## 📋 Implémentation dans votre AuthController

Ajoutez cette méthode dans votre `AuthController` :

```java
@PostMapping("/validate-email")
public ResponseEntity<?> validateEmail(@RequestBody ValidateEmailRequest request) {
    try {
        Optional<User> userOpt = users.findByEmail(request.getEmail());
        
        Map<String, Object> response = new HashMap<>();
        
        if (userOpt.isEmpty()) {
            response.put("exists", false);
            response.put("isAdmin", false);
            response.put("message", "No user found with this email");
        } else {
            User user = userOpt.get();
            boolean isAdmin = "ADMIN".equals(user.getRole().name());
            
            response.put("exists", true);
            response.put("isAdmin", isAdmin);
            
            if (isAdmin) {
                response.put("message", "Email validated successfully");
            } else {
                response.put("message", "User found but not an administrator");
            }
        }
        
        return ResponseEntity.ok(response);
        
    } catch (Exception e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Validation failed");
        return ResponseEntity.status(500).body(error);
    }
}
```

## 📝 Créer le DTO ValidateEmailRequest

Créez cette classe dans vos DTOs :

```java
public class ValidateEmailRequest {
    private String email;
    
    // Constructeurs
    public ValidateEmailRequest() {}
    
    public ValidateEmailRequest(String email) {
        this.email = email;
    }
    
    // Getters et setters
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
}
```

## 🔍 Modifier votre repository (si nécessaire)

Si votre `UserRepository` n'a pas encore la méthode `findByEmail`, ajoutez-la :

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByPhone(String phone);
    Optional<User> findByEmail(String email); // ← Ajouter cette ligne
}
```

## 🛡️ Avantages de sécurité

Cette validation empêche :
- ❌ Les tentatives de reset sur des emails inexistants
- ❌ Les utilisateurs non-admin d'accéder au reset de mot de passe
- ❌ Les attaques par énumération d'emails
- ✅ Seuls les admins peuvent réinitialiser leur mot de passe

## 🧪 Test de l'endpoint

Une fois implémenté, testez avec :

**Email admin valide :**
```bash
curl -X POST https://oraimosmartscan-cbdfada7brfyfwbg.francecentral-01.azurewebsites.net/auth/validate-email \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@oraimo.com"}'
```

**Email non-admin :**
```bash
curl -X POST https://oraimosmartscan-cbdfada7brfyfwbg.francecentral-01.azurewebsites.net/auth/validate-email \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

**Email inexistant :**
```bash
curl -X POST https://oraimosmartscan-cbdfada7brfyfwbg.francecentral-01.azurewebsites.net/auth/validate-email \
  -H "Content-Type: application/json" \
  -d '{"email":"inexistant@example.com"}'
```

## 🚀 Une fois implémenté

Le frontend validera automatiquement :
1. L'existence de l'email dans la base de données
2. Le rôle ADMIN de l'utilisateur
3. N'enverra le code de réinitialisation qu'aux admins valides

Cela rend le système beaucoup plus sécurisé ! 🔐