# Backend CORS Configuration Fix

## 🔴 Problem Identified

The UAM service has CORS configured to only allow:
- `http://localhost:3000`
- `http://localhost:8080`

But the React Native app is trying to connect from different origins, which are being blocked.

## ✅ Solution

Update the CORS configuration in the UAM service to allow requests from the mobile app.

### File to Update

**Path**: `../smart-bachat/uam-service/src/main/java/com/ametsa/smartbachat/uam/config/SecurityConfig.java`

### Current CORS Configuration (Lines ~60-70)

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:8080"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
    configuration.setExposedHeaders(List.of("Authorization"));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

### Updated CORS Configuration (For Development)

Replace the `corsConfigurationSource()` method with:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    
    // Allow all origins for development (mobile app testing)
    configuration.setAllowedOriginPatterns(List.of("*"));
    
    // Or specify exact origins:
    // configuration.setAllowedOrigins(Arrays.asList(
    //     "http://localhost:3000",
    //     "http://localhost:8080",
    //     "http://localhost:8082",      // Expo dev server
    //     "http://10.0.2.2:8082",       // Android emulator
    //     "http://192.168.31.58:8082"   // Physical device
    // ));
    
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

### Alternative: Disable CORS for Development Only

For quick testing, you can temporarily disable CORS:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.addAllowedOriginPattern("*");  // Allow all origins
    configuration.addAllowedMethod("*");          // Allow all methods
    configuration.addAllowedHeader("*");          // Allow all headers
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

## 🔧 Steps to Apply Fix

### 1. Update UAM Service

```bash
cd ../smart-bachat/uam-service
```

Edit `src/main/java/com/ametsa/smartbachat/uam/config/SecurityConfig.java` and update the `corsConfigurationSource()` method.

### 2. Update Core Service (if needed)

Check if the Core service also has CORS restrictions:

```bash
cd ../smart-bachat/bachat-core-service
find . -name "*SecurityConfig.java" -o -name "*CorsConfig.java"
```

Apply the same CORS fix if found.

### 3. Update AI Service (if needed)

```bash
cd ../smart-bachat/ai-advisory-service
find . -name "*SecurityConfig.java" -o -name "*CorsConfig.java"
```

Apply the same CORS fix if found.

### 4. Rebuild and Restart Services

```bash
# UAM Service
cd ../smart-bachat/uam-service
./gradlew clean build
./gradlew bootRun

# Core Service
cd ../smart-bachat/bachat-core-service
./gradlew clean build
./gradlew bootRun

# AI Service
cd ../smart-bachat/ai-advisory-service
./gradlew clean build
./gradlew bootRun
```

## 🧪 Test the Fix

After restarting the services, test from command line:

```bash
# Test with OPTIONS preflight request
curl -X OPTIONS http://localhost:8081/api/v1/auth/login \
  -H "Origin: http://localhost:8082" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

# Should return CORS headers like:
# Access-Control-Allow-Origin: *
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
```

## ⚠️ Production Considerations

**Important**: The `setAllowedOriginPatterns(List.of("*"))` configuration is for **development only**.

For production, specify exact origins:

```java
configuration.setAllowedOrigins(Arrays.asList(
    "https://yourdomain.com",
    "https://app.yourdomain.com"
));
```

Or use environment variables:

```java
@Value("${cors.allowed.origins}")
private String allowedOrigins;

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
    // ... rest of configuration
}
```

In `application.properties`:
```properties
# Development
cors.allowed.origins=http://localhost:3000,http://localhost:8082,http://10.0.2.2:8082

# Production
# cors.allowed.origins=https://yourdomain.com,https://app.yourdomain.com
```

## 📝 Summary

1. ✅ Update `SecurityConfig.java` in UAM service
2. ✅ Change `setAllowedOrigins` to `setAllowedOriginPatterns(List.of("*"))`
3. ✅ Rebuild and restart the service
4. ✅ Test from the mobile app

This will allow the React Native app to connect to the backend! 🎉

---

**Next**: After applying this fix, restart your backend services and try login/register again from the mobile app.

