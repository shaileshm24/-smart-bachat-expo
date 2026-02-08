# Network Error Diagnosis & Fix

## 🔍 Current Status

Based on the test results:

### ✅ What's Working:
- UAM Service is running on port 8081
- Login endpoint IS responding (returns 400 "Invalid credentials")
- CORS is configured and working
- Core Service (8080) is UP and healthy

### ❌ What's NOT Working:
- UAM Service health check returns 503/DOWN
- React Native app getting "Network request failed" error

## 🎯 Root Cause

The UAM service is **partially working**:
- ✅ The API endpoints are accessible
- ❌ The health check is failing (likely database issue)

The "Network request failed" error from React Native could be due to:
1. **iOS Simulator networking quirks** with localhost
2. **Response handling issues** in the fetch API
3. **The service being unhealthy** (even though endpoints work)

## ✅ Fixes Applied

### 1. Changed iOS URL from `localhost` to `127.0.0.1`

**File**: `services/api.ts`

```typescript
// Before
return `http://localhost:${port}`;

// After  
return `http://127.0.0.1:${port}`;
```

**Why**: iOS Simulator sometimes has issues resolving `localhost`, but `127.0.0.1` works more reliably.

### 2. Added Detailed Logging

Added comprehensive logging to help debug:
- Request options
- Raw response text
- JSON parse errors
- Better error messages

### 3. Improved Error Handling

- Parse response as text first, then JSON
- Show first 200 chars of raw response
- Provide helpful error messages

## 🔧 Next Steps to Fix

### Option 1: Fix the UAM Service Health Check (Recommended)

The service is working but unhealthy. This is likely a database issue.

**Check the UAM service logs**:
```bash
cd ../smart-bachat/uam-service
./gradlew bootRun
```

Look for errors like:
- `Connection refused` - Database not running
- `Authentication failed` - Wrong database credentials
- `Unknown database` - Database doesn't exist

**Common fixes**:

1. **Start PostgreSQL** (if not running):
   ```bash
   # Mac with Homebrew
   brew services start postgresql
   
   # Or check if it's running
   pg_isready
   ```

2. **Check database configuration** in `application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/smartbachat_uam
   spring.datasource.username=postgres
   spring.datasource.password=your_password
   ```

3. **Create the database** (if it doesn't exist):
   ```bash
   psql -U postgres
   CREATE DATABASE smartbachat_uam;
   \q
   ```

### Option 2: Disable Health Check Temporarily

If you just want to test the app, you can disable the health check requirement.

**In `application.properties`**:
```properties
management.health.defaults.enabled=false
management.endpoint.health.show-details=always
```

### Option 3: Test with Core Service First

Since Core Service (8080) is healthy, you could temporarily test with it:

1. Check if Core Service has auth endpoints
2. Or just test the bank connection flow (which uses Core Service)

## 🧪 Testing

### 1. Restart the Expo App

After the fixes:
```bash
# Stop current server (Ctrl+C)
npm start
```

### 2. Try Login Again

You should now see much more detailed logs:
```
🔐 Calling UAM Service (8081) for login
🌐 API Request: POST http://127.0.0.1:8081/api/v1/auth/login
📤 Request Data: { "username": "...", "password": "..." }
🔧 Fetch options: { "method": "POST", "headers": {...}, "hasBody": true }
📥 API Response Status: 400 Bad Request
📄 Raw Response: {"status":"FAILED","message":"Invalid credentials"}
✅ API Response: { "status": "FAILED", "message": "Invalid credentials" }
```

### 3. Check for Specific Errors

If you still get "Network request failed", the logs will now show:
- The exact URL being called
- The fetch options
- Any parse errors
- Stack trace

## 📊 Verification Commands

Run these to verify everything:

```bash
# 1. Check if services are running
./test-backend-connection.sh

# 2. Test UAM service directly
curl -X POST http://127.0.0.1:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test@example.com","password":"test123"}'

# 3. Check database connection
psql -U postgres -d smartbachat_uam -c "SELECT 1;"
```

## 🎯 Expected Outcome

After fixing the database issue, you should see:

```bash
curl http://localhost:8081/actuator/health
# {"status":"UP"}
```

Then the React Native app will work perfectly!

## 📝 Summary

1. ✅ Changed iOS URL to use `127.0.0.1` instead of `localhost`
2. ✅ Added detailed logging for debugging
3. ✅ Improved error handling
4. ⚠️ **UAM Service database needs to be fixed** - This is the main issue
5. ✅ CORS is already configured correctly

**Next Action**: Fix the UAM service database connection, then restart the app!

---

**Quick Test**: Try this curl command. If it works, the app should work too:
```bash
curl -X POST http://127.0.0.1:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test@example.com","password":"test123"}'
```

If you see `{"status":"FAILED","message":"Invalid credentials"}`, the service is working! The app should connect now with the updated URL.

