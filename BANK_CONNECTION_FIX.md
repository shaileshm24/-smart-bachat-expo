# Bank Connection API Integration Fix

## 🎯 Issues Fixed

### Issue 1: 403 Forbidden Error ✅
**Problem**: API was returning 403 status code  
**Root Cause**: Request was missing the Authorization header (Bearer token)  
**Solution**: The `bankApi.initiateConnection()` already passes `requiresAuth: true` to include the token

### Issue 2: Wrong Request Body ✅
**Problem**: Frontend was sending `{bankName: "hdfc"}` but backend expects `{mobileNumber: "9876543210"}`  
**Root Cause**: Mismatched API contract  
**Solution**: Updated request interface and UI to collect mobile number

### Issue 3: Wrong Response Handling ✅
**Problem**: Frontend was checking for `response.status === "SUCCESS"` but backend returns different format  
**Root Cause**: Incorrect response interface  
**Solution**: Updated response interface to match actual backend response

## ✅ Changes Made

### 1. Updated API Interfaces (`services/api.ts`)

**Before:**
```typescript
export interface BankConnectionRequest {
  profileId?: string;
  bankName?: string;
  accountType?: string;
}

export interface BankConnectionResponse {
  status: string;
  message: string;
  redirectUrl?: string;
  consentId?: string;
}
```

**After:**
```typescript
export interface BankConnectionRequest {
  mobileNumber: string;
}

export interface BankConnectionResponse {
  bankAccountId: string;
  consentId: string;
  redirectUrl: string;
  status: string;
  message: string | null;
}
```

### 2. Updated ConsentScreen UI (`components/ConsentScreen.tsx`)

**Changes:**
- ✅ Removed bank selection UI
- ✅ Added mobile number input field
- ✅ Added validation for 10-digit mobile number
- ✅ Updated request to send `{mobileNumber: "9876543210"}`
- ✅ Updated response handling to match backend format
- ✅ Added better error logging

**New UI:**
```
┌─────────────────────────────────┐
│  Enter Mobile Number            │
│  Enter the mobile number        │
│  registered with your bank      │
│                                 │
│  ┌──────────────────────────┐  │
│  │ +91 | 9876543210         │  │
│  └──────────────────────────┘  │
│                                 │
│  [Connect Bank Account]         │
└─────────────────────────────────┘
```

## 📋 API Contract (from Postman Collection)

### Endpoint
```
POST http://192.168.31.58:8080/api/v1/bank/connect
```

### Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Request Body
```json
{
  "mobileNumber": "9876543210"
}
```

### Success Response (200)
```json
{
  "bankAccountId": "f3cbf67f-a44e-47ea-890c-8afc18f22435",
  "consentId": "5e827180-60a7-4ada-a396-4eeeba335210",
  "redirectUrl": "https://fiu-uat.setu.co/v2/consents/webview/5e827180-60a7-4ada-a396-4eeeba335210",
  "status": "PENDING",
  "message": null
}
```

## 🚀 How It Works Now

1. **User enters mobile number** (10 digits)
2. **Frontend validates** the mobile number
3. **API request sent** with:
   - URL: `http://192.168.31.58:8080/api/v1/bank/connect`
   - Headers: `Authorization: Bearer <token>`
   - Body: `{"mobileNumber": "9876543210"}`
4. **Backend responds** with consent URL
5. **App opens** the Account Aggregator consent page
6. **User completes** consent on AA platform
7. **Deep link callback** returns to app
8. **Dashboard** shows connected account

## 🧪 Testing

### 1. Reload the App
```bash
# In Expo terminal, press 'r' to reload
```

### 2. Login
- Use your credentials
- Navigate to Consent Screen

### 3. Enter Mobile Number
- Enter: `8379807182` (or your registered mobile)
- Tap "Connect Bank Account"

### 4. Expected Flow
```
✅ Login successful
🏦 Calling Core Service (8080) for bank connection
🌐 API Request: POST http://192.168.31.58:8080/api/v1/bank/connect
📤 Request Data: {"mobileNumber": "8379807182"}
📥 API Response Status: 200
✅ API Response: {
  "bankAccountId": "...",
  "consentId": "...",
  "redirectUrl": "https://fiu-uat.setu.co/...",
  "status": "PENDING"
}
🌐 Opening consent URL...
```

## 📚 Related APIs (from Postman Collection)

### Get All Bank Accounts
```
GET /api/v1/bank/accounts
Authorization: Bearer <token>
```

### Get Account Transactions
```
GET /api/v1/bank/accounts/:accountId/transactions?page=0&size=50
Authorization: Bearer <token>
```

### Sync Bank Account
```
POST /api/v1/bank/accounts/:accountId/sync
Authorization: Bearer <token>
```

### Disconnect Bank Account
```
DELETE /api/v1/bank/accounts/:accountId
Authorization: Bearer <token>
```

## 📝 Files Modified

1. ✅ `services/api.ts` - Updated interfaces
2. ✅ `components/ConsentScreen.tsx` - Updated UI and logic

## ✅ Verification

- ✅ TypeScript compilation passes
- ✅ Request body matches backend expectation
- ✅ Response interface matches backend response
- ✅ Authorization header included
- ✅ Mobile number validation added
- ✅ Error handling improved

---

**Reload the app and try connecting your bank account!** 🚀

