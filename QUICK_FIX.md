# Quick Fix for "Network request failed" Error

## 🎯 What I Fixed

1. **Updated API URL configuration** to automatically detect platform
2. **Added detailed logging** to help debug network issues
3. **Created troubleshooting guide** with all solutions

## 🚀 Quick Solutions

### If you're using **Android Emulator**:
✅ **Already fixed!** The app now uses `http://10.0.2.2:8080` automatically.

### If you're using **iOS Simulator**:
✅ **Already fixed!** The app uses `http://localhost:8080` automatically.

### If you're using a **Physical Device**:
⚠️ **Action Required:**

1. **Find your computer's IP address:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
   Example output: `inet 192.168.1.100`

2. **Update `services/api.ts` line 15:**
   ```typescript
   return 'http://YOUR_IP_HERE:8080'; // Replace with your actual IP
   ```

3. **Make sure your phone and computer are on the same WiFi**

## 🔍 How to Debug

### 1. Check the Console Logs

After the fix, you'll see detailed logs in the Expo console:

```
🌐 API Request: POST http://10.0.2.2:8080/api/v1/auth/login
📤 Request Data: { "username": "...", "password": "..." }
📥 API Response Status: 200 OK
✅ API Response: { "status": "SUCCESS", ... }
```

Or if there's an error:
```
❌ Network Error: Failed to fetch
🔍 Error Details: { endpoint: "/api/v1/auth/login", ... }
```

### 2. Restart the App

After making changes:
```bash
# Stop the current server (Ctrl+C)
npm start
```

### 3. Clear Cache (if needed)

```bash
npm start -- --clear
```

## 📱 Platform-Specific URLs

The app now automatically uses different ports for each service:

### UAM Service (Authentication) - Port 8081
| Platform | URL | Notes |
|----------|-----|-------|
| Android Emulator | `http://10.0.2.2:8081` | ✅ Auto-configured |
| iOS Simulator | `http://localhost:8081` | ✅ Auto-configured |
| Physical Device | `http://192.168.31.58:8081` | ⚠️ Update with your IP |
| Web Browser | `http://192.168.31.58:8081` | ⚠️ Update with your IP |

### Core Service (Bank/AA) - Port 8080
| Platform | URL | Notes |
|----------|-----|-------|
| Android Emulator | `http://10.0.2.2:8080` | ✅ Auto-configured |
| iOS Simulator | `http://localhost:8080` | ✅ Auto-configured |
| Physical Device | `http://192.168.31.58:8080` | ⚠️ Update with your IP |
| Web Browser | `http://192.168.31.58:8080` | ⚠️ Update with your IP |

### AI Advisory Service - Port 8089
| Platform | URL | Notes |
|----------|-----|-------|
| Android Emulator | `http://10.0.2.2:8089` | ✅ Auto-configured |
| iOS Simulator | `http://localhost:8089` | ✅ Auto-configured |
| Physical Device | `http://192.168.31.58:8089` | ⚠️ Update with your IP |
| Web Browser | `http://192.168.31.58:8089` | ⚠️ Update with your IP |

## ✅ Verify Backend Services are Running

```bash
# Check UAM Service (Port 8081)
curl http://localhost:8081/actuator/health

# Check Core Service (Port 8080)
curl http://localhost:8080/actuator/health

# Check AI Service (Port 8089)
curl http://localhost:8089/actuator/health

# All should return: {"status":"UP"}
```

## 🆘 Still Not Working?

### Check these:

1. **Backend is running** on port 8080
   ```bash
   curl http://localhost:8080/actuator/health
   ```

2. **Firewall allows connections** (especially on physical devices)

3. **Same WiFi network** (for physical devices)

4. **Correct IP address** in `services/api.ts` line 15

5. **CORS enabled** in backend (for web/physical devices)

### Enable CORS in Backend

Add this to your Spring Boot application:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("*")
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*");
            }
        };
    }
}
```

## 📚 More Help

See `NETWORK_TROUBLESHOOTING.md` for detailed troubleshooting steps.

---

**TL;DR:**
- ✅ Android Emulator: Fixed automatically (all 3 services)
- ✅ iOS Simulator: Fixed automatically (all 3 services)
- ⚠️ Physical Device: Update IP in `services/api.ts` line 15
- 🔍 Check console logs for detailed error messages
- 🎯 UAM (auth): Port 8081, Core (bank): Port 8080, AI: Port 8089

