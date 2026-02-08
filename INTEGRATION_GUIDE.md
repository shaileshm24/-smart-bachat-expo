# SmartBachat API Integration Guide

## 🎉 Overview

This guide documents the integration of the SmartBachat Java backend APIs with the Expo frontend application. The integration includes authentication (login/register) and bank account consent management screens.

## 📁 New Files Created

### 1. **services/api.ts**
API service layer with:
- API client configuration
- Authentication endpoints (login, register, logout)
- Bank connection endpoints
- Storage helpers for token management
- TypeScript interfaces for API requests/responses

### 2. **components/LoginScreen.tsx**
Beautiful login screen with:
- 🔐 Email/password input fields
- 👁️ Show/hide password toggle
- ✅ Form validation
- 🎨 Matching app theme (green #2e7d32)
- 💰 Emoji and icon decorations
- 🔄 Loading states
- ⚠️ Error handling

### 3. **components/RegisterScreen.tsx**
Registration screen with:
- 📝 First name, last name, email, mobile, password fields
- 🔒 Password confirmation
- ✅ Client-side validation
- 🎯 Matches backend RegisterRequest DTO
- 🎨 Consistent theme and styling
- 🚀 Emoji illustrations

### 4. **components/ConsentScreen.tsx**
Bank connection consent screen with:
- 🏦 Bank selection (HDFC, ICICI, SBI, Axis, Kotak)
- 🔒 Security benefits display
- 🤖 AI-powered features showcase
- ✅ Account Aggregator integration
- ⏭️ Skip option for later
- 🎨 Beautiful card-based UI

### 5. **contexts/AuthContext.tsx**
Authentication context for:
- 👤 User state management
- 🔐 Login/logout functions
- 🔄 Token persistence
- ✅ Authentication checks

## 🔄 Updated Files

### **App.tsx**
Enhanced with:
- New app states: `login`, `register`, `consent`
- Navigation flow: Splash → Loading → Login → Register → Consent → Dashboard
- Handler functions for screen transitions
- User state management

## 🎨 Design Features

All new screens follow the existing SmartBachat theme:
- **Primary Color**: Green (#2e7d32)
- **Background**: Light gray (#f8f8f8)
- **Cards**: White with subtle shadows
- **Icons**: Lucide React Native icons
- **Emojis**: Used throughout for visual appeal
- **Typography**: Clean, readable fonts

## 🔌 Backend API Integration

### Authentication Endpoints

#### Login
```typescript
POST /api/v1/auth/login
Request: { username: string, password: string }
Response: { status, message, accessToken, refreshToken, user }
```

#### Register
```typescript
POST /api/v1/auth/register
Request: { 
  email: string, 
  password: string,
  firstName?: string,
  lastName?: string,
  mobileNumber?: string
}
Response: { status, message, accessToken, refreshToken, user }
```

#### Logout
```typescript
POST /api/v1/auth/logout
Response: { status, message }
```

### Bank Connection Endpoints

#### Initiate Connection
```typescript
POST /api/v1/bank/connect
Request: { profileId?, bankName?, accountType? }
Response: { status, message, redirectUrl?, consentId? }
```

#### Get Accounts
```typescript
GET /api/v1/bank/accounts
Response: Array of bank accounts
```

## 🚀 App Flow

1. **Splash Screen** (2 seconds)
2. **Loading Screen** (1.5 seconds)
3. **Login Screen** (if not authenticated)
   - Option to navigate to Register
4. **Register Screen** (for new users)
   - Option to navigate back to Login
5. **Consent Screen** (after successful auth)
   - Connect bank account
   - Or skip for later
6. **Dashboard** (main app)

## 🔧 Configuration

Update the API base URL in `services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:8080'; // Change to your backend URL
```

For production:
```typescript
const API_BASE_URL = 'https://api.smartbachat.com';
```

## 🧪 Testing

To test the complete flow:

1. Start the backend service:
```bash
cd ../smart-bachat
./gradlew bootRun
```

2. Start the Expo app:
```bash
npm start
```

3. Test the flow:
   - Register a new account
   - Login with credentials
   - Connect a bank account (or skip)
   - Navigate through the app

## 📱 Features

### Login Screen
- ✅ Email/mobile validation
- ✅ Password visibility toggle
- ✅ Error messages
- ✅ Loading states
- ✅ Navigation to register

### Register Screen
- ✅ Multi-field form
- ✅ Password confirmation
- ✅ Email validation
- ✅ Minimum password length check
- ✅ Error handling

### Consent Screen
- ✅ Bank selection
- ✅ Benefits showcase
- ✅ Security information
- ✅ Skip option
- ✅ RBI AA framework mention

## 🎯 Next Steps

1. **Token Refresh**: Implement automatic token refresh
2. **Biometric Auth**: Add fingerprint/face ID
3. **Deep Linking**: Handle consent redirect URLs
4. **Offline Support**: Cache user data
5. **Analytics**: Track user journey
6. **Error Tracking**: Integrate Sentry or similar

## 🐛 Known Issues

- Storage uses localStorage (web only) - needs AsyncStorage for mobile
- Token validation not implemented
- Consent redirect URL handling is mocked

## 📚 Resources

- [Backend Repository](../smart-bachat)
- [Expo Documentation](https://docs.expo.dev)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Lucide Icons](https://lucide.dev)

