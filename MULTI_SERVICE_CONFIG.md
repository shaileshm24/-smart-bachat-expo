# Multi-Service API Configuration

## 🎯 Overview

The SmartBachat backend consists of three microservices running on different ports. The Expo frontend now correctly routes API calls to the appropriate service.

## 🏗️ Backend Architecture

### 1. UAM Service (Port 8081)
**Purpose**: User Access Management - Authentication & Authorization

**Endpoints**:
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Token refresh

**Used by**:
- LoginScreen
- RegisterScreen
- AuthContext (token refresh)

### 2. Core Service (Port 8080)
**Purpose**: Bank Connection & Account Aggregator Integration

**Endpoints**:
- `POST /api/v1/bank/connect` - Initiate bank connection
- `GET /api/v1/bank/accounts` - Get connected accounts
- `POST /api/v1/consent/*` - Consent management

**Used by**:
- ConsentScreen
- Dashboard (account data)

### 3. AI Advisory Service (Port 8089)
**Purpose**: AI-powered financial advice

**Endpoints**:
- `POST /api/v1/ai/advice` - Get financial advice
- (Add more endpoints as needed)

**Used by**:
- Future AI advisory features

## 📱 Frontend Configuration

### Platform-Aware URL Generation

The app automatically detects the platform and uses the correct URL:

```typescript
const getServiceUrl = (port: number) => {
  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${port}`;      // Android Emulator
  } else if (Platform.OS === 'ios') {
    return `http://localhost:${port}`;      // iOS Simulator
  } else {
    return `http://192.168.31.58:${port}`; // Physical Device/Web
  }
};
```

### Service URLs

```typescript
const UAM_SERVICE_URL = getServiceUrl(8081);   // Authentication
const CORE_SERVICE_URL = getServiceUrl(8080);  // Bank/AA
const AI_SERVICE_URL = getServiceUrl(8089);    // AI Advisory
```

### API Clients

Three separate API clients are created:

```typescript
const uamClient = new ApiClient(UAM_SERVICE_URL);
const coreClient = new ApiClient(CORE_SERVICE_URL);
const aiClient = new ApiClient(AI_SERVICE_URL);
```

## 🔍 Request Routing

### Authentication Requests → UAM Service (8081)
```typescript
authApi.login()     → http://10.0.2.2:8081/api/v1/auth/login
authApi.register()  → http://10.0.2.2:8081/api/v1/auth/register
authApi.logout()    → http://10.0.2.2:8081/api/v1/auth/logout
```

### Bank Requests → Core Service (8080)
```typescript
bankApi.initiateConnection() → http://10.0.2.2:8080/api/v1/bank/connect
bankApi.getAccounts()        → http://10.0.2.2:8080/api/v1/bank/accounts
```

### AI Requests → AI Service (8089)
```typescript
aiApi.getAdvice() → http://10.0.2.2:8089/api/v1/ai/advice
```

## 🧪 Testing

### Verify All Services are Running

```bash
# UAM Service (8081)
curl http://localhost:8081/actuator/health

# Core Service (8080)
curl http://localhost:8080/actuator/health

# AI Service (8089)
curl http://localhost:8089/actuator/health
```

### Test Authentication Flow

```bash
# Register (UAM Service - 8081)
curl -X POST http://localhost:8081/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "mobileNumber": "1234567890",
    "password": "password123"
  }'

# Login (UAM Service - 8081)
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test@example.com",
    "password": "password123"
  }'
```

### Test Bank Connection (Core Service - 8080)

```bash
curl -X POST http://localhost:8080/api/v1/bank/connect \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "bankId": "HDFC",
    "accountType": "SAVINGS"
  }'
```

## 📊 Console Logging

The app now logs which service is being called:

```
🔐 Calling UAM Service (8081) for login
🌐 API Request: POST http://10.0.2.2:8081/api/v1/auth/login
📤 Request Data: { "username": "...", "password": "..." }
📥 API Response Status: 200 OK
✅ API Response: { "status": "SUCCESS", ... }
```

```
🏦 Calling Core Service (8080) for bank connection
🌐 API Request: POST http://10.0.2.2:8080/api/v1/bank/connect
📤 Request Data: { "bankId": "HDFC", ... }
📥 API Response Status: 200 OK
✅ API Response: { "status": "SUCCESS", ... }
```

## ⚙️ Configuration for Physical Devices

If testing on a physical device, update line 15 in `services/api.ts`:

```typescript
return `http://YOUR_COMPUTER_IP:${port}`;
```

Find your IP:
```bash
# Mac/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

## ✅ Summary

- ✅ **UAM Service (8081)**: All authentication endpoints
- ✅ **Core Service (8080)**: All bank/AA endpoints
- ✅ **AI Service (8089)**: All AI advisory endpoints
- ✅ **Platform Detection**: Automatic URL configuration
- ✅ **Detailed Logging**: Easy debugging
- ✅ **TypeScript**: Full type safety

---

**Last Updated**: February 7, 2026  
**Status**: ✅ Multi-Service Configuration Complete

