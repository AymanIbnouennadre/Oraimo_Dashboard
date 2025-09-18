# 🔧 Backend Implementation Required

## 🚨 ENDPOINT MANQUANT

Votre frontend essaie d'appeler un endpoint qui n'existe pas encore dans votre backend Spring Boot.

### Endpoint à créer : `POST /auth/verify-reset-code`

**URL :** `http://localhost:8080/auth/verify-reset-code`

**Request Body :**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response Success (200) :**
```json
{
  "message": "Code vérifié avec succès",
  "resetToken": "temporary-reset-token-uuid"
}
```

**Response Error (400) :**
```json
{
  "error": "Code invalide ou expiré"
}
```

**Response Error (404) :**
```json
{
  "error": "Aucune demande de réinitialisation trouvée pour cet email"
}
```

## 📋 Modifications à apporter au backend

### 1. Modifier la table de réinitialisation de mot de passe

Ajoutez une colonne pour stocker le code à 6 chiffres :

```sql
ALTER TABLE password_reset_tokens 
ADD COLUMN verification_code VARCHAR(6);
```

### 2. Modifier le service EmailService

```java
@Service
public class EmailService {
    
    public void sendPasswordResetEmail(String email, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Code de réinitialisation de votre mot de passe");
        message.setText("Votre code de vérification est: " + code + 
                       "\n\nCe code expire dans 10 minutes." +
                       "\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.");
        
        mailSender.send(message);
    }
}
```

### 3. Créer le controller pour vérifier le code

```java
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3001")
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/verify-reset-code")
    public ResponseEntity<?> verifyResetCode(@RequestBody VerifyCodeRequest request) {
        try {
            String resetToken = passwordResetService.verifyCode(request.getEmail(), request.getCode());
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Code vérifié avec succès");
            response.put("resetToken", resetToken);
            
            return ResponseEntity.ok(response);
            
        } catch (InvalidCodeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Code invalide ou expiré");
            return ResponseEntity.badRequest().body(error);
            
        } catch (NoResetRequestException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Aucune demande de réinitialisation trouvée pour cet email");
            return ResponseEntity.status(404).body(error);
        }
    }
}
```

### 4. Créer la classe VerifyCodeRequest

```java
public class VerifyCodeRequest {
    private String email;
    private String code;
    
    // Getters et setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
}
```

### 5. Modifier le service PasswordResetService

```java
@Service
public class PasswordResetService {

    @Autowired
    private PasswordResetTokenRepository tokenRepository;
    
    @Autowired
    private EmailService emailService;

    public void createResetRequest(String email) {
        // Générer un code à 6 chiffres
        String code = String.format("%06d", new Random().nextInt(1000000));
        
        // Créer le token de réinitialisation
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setEmail(email);
        resetToken.setVerificationCode(code);
        resetToken.setToken(UUID.randomUUID().toString());
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(10));
        
        tokenRepository.save(resetToken);
        
        // Envoyer l'email avec le code
        emailService.sendPasswordResetEmail(email, code);
    }
    
    public String verifyCode(String email, String code) throws InvalidCodeException, NoResetRequestException {
        PasswordResetToken token = tokenRepository.findByEmailAndVerificationCode(email, code)
            .orElseThrow(() -> new NoResetRequestException("Aucune demande trouvée"));
            
        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new InvalidCodeException("Code expiré");
        }
        
        // Générer un token temporaire pour l'étape suivante
        String tempToken = UUID.randomUUID().toString();
        token.setTempResetToken(tempToken);
        token.setTempTokenExpiry(LocalDateTime.now().plusMinutes(5));
        tokenRepository.save(token);
        
        return tempToken;
    }
}
```

## 🔗 Workflow complet

1. **POST /auth/forgot-password** → Génère un code 6 chiffres et l'envoie par email
2. **POST /auth/verify-reset-code** → Vérifie le code et retourne un token temporaire
3. **POST /auth/reset-password** → Utilise le token temporaire pour changer le mot de passe

## 📧 Format de l'email

L'email envoyé doit contenir SEULEMENT le code :

```
Sujet: Code de réinitialisation de votre mot de passe

Bonjour,

Votre code de vérification est: 123456

Ce code expire dans 10 minutes.

Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.

Cordialement,
L'équipe Oraimo
```

## 🚀 Une fois implémenté

Après avoir ajouté cet endpoint dans votre backend Spring Boot, le workflow frontend fonctionnera parfaitement !

Le code frontend est déjà prêt et attendra votre implémentation backend.