# Debugging 403 Forbidden Error

## 🔴 Current Issue

You're getting **403 Forbidden** with an empty response body when trying to connect bank account.

**Evidence from logs:**
```
📥 API Response Status: 403
📄 Raw Response: (empty)
🔧 Fetch options: {
  "headers": {
    "Content-Type": "application/json"  ← Missing Authorization header!
  }
}
```

## 🔍 Root Cause

The **Authorization header is missing** from the request. This means either:
1. The token wasn't saved during login
2. The token isn't being retrieved from storage
3. The `requiresAuth` flag isn't being passed correctly

## ✅ Debug Logging Added

I've added logging to help diagnose the issue:

### 1. Token Retrieval Logging
```typescript
private async getAuthHeaders(): Promise<HeadersInit> {
  const token = await storage.getItem('accessToken');
  console.log('🔑 Retrieved token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN FOUND');
  // ...
}
```

### 2. Request Options Logging
```typescript
console.log('🔧 Fetch options:', {
  method: options.method,
  headers: options.headers,
  hasBody: !!options.body,
  requiresAuth  // ← Shows if auth is required
});
```

## 🧪 Testing Steps

### 1. Reload the App
```bash
# Press 'r' in Expo terminal
```

### 2. Login Again
- This will save a fresh token
- Watch for: `✅ Login successful!`

### 3. Try Bank Connection
- Enter mobile number
- Tap "Connect Bank Account"

### 4. Check the Logs

You should now see:
```
🔑 Retrieved token: eyJhbGciOiJIUzM4NCJ9... ← Token found!
🔧 Fetch options: {
  "method": "POST",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGci..." ← Token included!
  },
  "hasBody": true,
  "requiresAuth": true
}
```

## 🎯 Expected Outcomes

### Scenario 1: Token Not Found
```
🔑 Retrieved token: NO TOKEN FOUND
```
**Solution**: Login again to save the token

### Scenario 2: Token Found but Not Sent
```
🔑 Retrieved token: eyJhbGci...
🔧 Fetch options: {
  "headers": {
    "Content-Type": "application/json"  ← Still missing!
  },
  "requiresAuth": false  ← This is the problem!
}
```
**Solution**: Check if `bankApi.initiateConnection()` is passing `requiresAuth: true`

### Scenario 3: Token Sent Successfully
```
🔑 Retrieved token: eyJhbGci...
🔧 Fetch options: {
  "headers": {
    "Authorization": "Bearer eyJhbGci..."  ← Present!
  },
  "requiresAuth": true
}
📥 API Response Status: 200  ← Success!
```

## 🔧 Quick Fixes

### If Token Not Saved
The token should be saved in LoginScreen.tsx (line 50):
```typescript
await storage.setItem("accessToken", response.accessToken);
```

### If Token Not Retrieved
Check the storage implementation in `services/storage.ts`

### If requiresAuth Not Passed
Check `bankApi.initiateConnection()` in `services/api.ts` (line 409):
```typescript
return coreClient.post<BankConnectionResponse>(
  '/api/v1/bank/connect', 
  data, 
  true  // ← requiresAuth should be true
);
```

## 📋 Next Steps

1. **Reload the app**
2. **Login again** (to save fresh token)
3. **Try bank connection**
4. **Share the new logs** - especially the lines with:
   - `🔑 Retrieved token:`
   - `🔧 Fetch options:`
   - `📥 API Response Status:`

This will tell us exactly where the token is getting lost!

---

**Reload the app now and try again!** 🚀

