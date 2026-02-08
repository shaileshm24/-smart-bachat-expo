# Network Request Failed - Troubleshooting Guide

## 🔍 Problem
Getting "Network request failed" error when trying to login or register.

## ✅ Solutions by Platform

### 1. **Android Emulator**
The API URL has been updated to use `http://10.0.2.2:8080` which is the special IP that Android emulator uses to access the host machine's localhost.

**No action needed** - The code now automatically detects Android and uses the correct URL.

### 2. **iOS Simulator**
iOS simulator can access `http://localhost:8080` directly.

**No action needed** - The code automatically uses localhost for iOS.

### 3. **Physical Device (Android/iOS)**
Physical devices cannot access `localhost` - they need your computer's actual IP address.

**Action Required:**

1. **Find your computer's IP address:**

   **On Mac:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
   
   **On Windows:**
   ```bash
   ipconfig
   ```
   
   **On Linux:**
   ```bash
   hostname -I
   ```

2. **Update the API URL in `services/api.ts`:**
   
   Find this line (around line 15):
   ```typescript
   return 'http://192.168.31.58:8080'; // Change this to your computer's IP
   ```
   
   Replace `192.168.31.58` with your actual IP address.

3. **Make sure your phone and computer are on the same WiFi network.**

### 4. **Web Browser**
If testing on web, it should use your current IP address.

**Update if needed:** Change line 15 in `services/api.ts` to your computer's IP.

## 🔧 Backend Configuration

### Verify Backend is Running

1. **Check if backend is running on port 8080:**
   ```bash
   curl http://localhost:8080/actuator/health
   ```
   
   Should return: `{"status":"UP"}`

2. **Check if auth endpoints are accessible:**
   ```bash
   curl -X POST http://localhost:8080/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"identifier":"test@example.com","password":"test123"}'
   ```

### Enable CORS (if needed)

If you're testing on web or physical device, you may need to enable CORS in your backend.

**Add to your Spring Boot application:**

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
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(false);
            }
        };
    }
}
```

## 🐛 Debugging Steps

### 1. Check Console Logs

Open the Expo development tools and check the console for detailed error messages:

```bash
npm start
# Then press 'j' to open debugger
```

### 2. Test API Directly

Test the backend API directly from your terminal:

```bash
# Test login endpoint
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "user@example.com",
    "password": "password123"
  }'

# Test register endpoint
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "mobileNumber": "1234567890",
    "password": "password123"
  }'
```

### 3. Enable API Logging

Add console logging to see what's happening. The API client already has logging enabled.

Check the Expo console for messages like:
- `API Request: POST /api/v1/auth/login`
- `API Response:` (with response data)
- `API Error:` (with error details)

## 📱 Quick Fix for Testing

### Option 1: Use ngrok (Recommended for Physical Devices)

1. **Install ngrok:**
   ```bash
   brew install ngrok  # Mac
   # or download from https://ngrok.com
   ```

2. **Start ngrok tunnel:**
   ```bash
   ngrok http 8080
   ```

3. **Update API URL in `services/api.ts`:**
   ```typescript
   return 'https://your-ngrok-url.ngrok.io';
   ```

### Option 2: Update IP Address

1. **Get your IP:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   # Example output: inet 192.168.1.100
   ```

2. **Update `services/api.ts` line 15:**
   ```typescript
   return 'http://192.168.1.100:8080';
   ```

## ✅ Verification

After making changes:

1. **Restart Expo:**
   ```bash
   # Press Ctrl+C to stop
   npm start
   ```

2. **Clear cache if needed:**
   ```bash
   npm start -- --clear
   ```

3. **Try login/register again**

## 🎯 Current Configuration

The API URL is automatically selected based on platform:
- **Android Emulator**: `http://10.0.2.2:8080`
- **iOS Simulator**: `http://localhost:8080`
- **Web/Physical Device**: `http://192.168.31.58:8080` (update this!)

---

**Need Help?** Check the Expo console logs for detailed error messages.

