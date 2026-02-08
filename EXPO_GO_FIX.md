# Expo Go Network Fix

## 🔴 Problem Identified

You're running the app on **Expo Go** (physical device or simulator), which reports as iOS but needs to use your computer's network IP address (`192.168.31.58`), not `localhost`.

### Evidence:
```
Deep link: exp://192.168.31.58:8082  ← Running on network IP
API Request: http://localhost:8081   ← Trying to use localhost ❌
```

This mismatch causes "Network request failed" because:
- Expo Go runs on your phone/device
- `localhost` on your phone refers to the phone itself, not your computer
- The backend is running on your computer at `192.168.31.58`

## ✅ Fix Applied

Updated `services/api.ts` to automatically detect Expo Go and use the correct IP address.

### How It Works:

1. **Detects Expo Go** using `Constants.expoConfig.hostUri`
2. **Extracts the host IP** from the debugger host (e.g., "192.168.31.58:8082")
3. **Uses that IP** for all backend requests

### Code Changes:

```typescript
import Constants from 'expo-constants';

const getServiceUrl = (port: number) => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  
  // If running on Expo Go, use the host IP
  if (debuggerHost) {
    const hostIP = debuggerHost.split(':')[0];  // Extract "192.168.31.58"
    return `http://${hostIP}:${port}`;
  }
  
  // Otherwise use platform-specific URLs
  // ...
};
```

## 🚀 What to Do Now

### 1. Restart the Expo App

```bash
# Stop the current server (Ctrl+C)
npm start
```

### 2. Reload the App

- Shake your device
- Press "Reload" or "r" in the terminal

### 3. Try Login Again

You should now see in the logs:
```
🔧 Platform Detection: {
  os: "ios",
  debuggerHost: "192.168.31.58:8082",
  hostUri: "192.168.31.58:8082"
}
📱 Detected Expo Go, using host IP: http://192.168.31.58:8081
🌐 API Request: POST http://192.168.31.58:8081/api/v1/auth/login
```

## 📊 Expected Behavior

### Before Fix:
```
Platform: iOS (Expo Go)
URL Used: http://localhost:8081 ❌
Result: Network request failed
```

### After Fix:
```
Platform: iOS (Expo Go)
Detected: hostUri = "192.168.31.58:8082"
URL Used: http://192.168.31.58:8081 ✅
Result: Request reaches backend!
```

## 🧪 Verification

After restarting, check the console logs. You should see:

1. **Platform detection**:
   ```
   📱 Detected Expo Go, using host IP: http://192.168.31.58:8081
   ```

2. **Service URLs**:
   ```
   🌐 Service URLs configured: {
     UAM: "http://192.168.31.58:8081",
     CORE: "http://192.168.31.58:8080",
     AI: "http://192.168.31.58:8089"
   }
   ```

3. **API Request**:
   ```
   🌐 API Request: POST http://192.168.31.58:8081/api/v1/auth/login
   ```

## 🎯 Platform Support

The fix now supports all scenarios:

| Scenario | Platform.OS | URL Used |
|----------|-------------|----------|
| Expo Go (any device) | any | `http://192.168.31.58:PORT` ✅ |
| Android Emulator | android | `http://10.0.2.2:PORT` ✅ |
| iOS Simulator | ios | `http://127.0.0.1:PORT` ✅ |
| Web Browser | web | `http://192.168.31.58:PORT` ✅ |
| Physical Device (standalone) | any | `http://192.168.31.58:PORT` ✅ |

## ⚠️ Important Notes

### 1. Same WiFi Network
Make sure your phone and computer are on the **same WiFi network**.

### 2. Firewall
If it still doesn't work, check your computer's firewall:

**Mac:**
```bash
# Allow incoming connections on ports 8080, 8081, 8089
# System Preferences > Security & Privacy > Firewall > Firewall Options
```

**Windows:**
```bash
# Windows Defender Firewall > Allow an app
```

### 3. Backend Must Be Running
Verify all services are running:
```bash
./test-backend-connection.sh
```

## 📝 Summary

- ✅ Fixed Expo Go detection
- ✅ Automatically uses correct IP address
- ✅ Works on all platforms (Expo Go, simulators, web)
- ✅ Added detailed logging for debugging

**Next**: Restart the app and try login again! It should work now! 🚀

