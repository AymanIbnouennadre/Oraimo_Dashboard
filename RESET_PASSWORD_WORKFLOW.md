# Password Reset Workflow - Testing Guide

## 🔄 Complete Workflow

### Step 1: Request Password Reset
1. Go to `/forgot-password`
2. Enter email address
3. Click "Send Reset Link"
4. Check email for reset link

### Step 2: Reset Password
1. Click the link in email (format: `/reset-password?token=UUID`)
2. Enter new password
3. Confirm new password
4. Click "Reset Password"
5. Redirected to login with success message

## 📡 API Endpoints

### POST `/auth/forgot-password`
```json
{
  "email": "user@example.com"
}
```

### POST `/auth/reset-password`
```json
{
  "token": "uuid-token-from-email",
  "newPassword": "new-password"
}
```

## 🧪 Testing URLs

- Forgot Password: http://localhost:3001/forgot-password
- Reset Password (example): http://localhost:3001/reset-password?token=sample-uuid-token
- Login: http://localhost:3001/login

## ⚠️ Error Handling

- Invalid token: Shows error page with option to request new link
- Expired token: Same as invalid token
- Network errors: Shows connection error message
- Validation errors: Password too short, passwords don't match

## 🔒 Security Features

- Token expires after 1 hour
- Token is single-use (deleted after password reset)
- Password validation (minimum 6 characters)
- Password confirmation required
- CORS enabled for frontend domain