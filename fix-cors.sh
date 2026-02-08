#!/bin/bash

# Script to check and display CORS configuration in backend services

echo "🔍 Checking CORS Configuration in Backend Services..."
echo ""

# Check UAM Service
echo "📋 UAM Service (Port 8081):"
if [ -f "../smart-bachat/uam-service/src/main/java/com/ametsa/smartbachat/uam/config/SecurityConfig.java" ]; then
    echo "✅ SecurityConfig.java found"
    echo ""
    echo "Current CORS configuration:"
    grep -A 15 "CorsConfigurationSource corsConfigurationSource" ../smart-bachat/uam-service/src/main/java/com/ametsa/smartbachat/uam/config/SecurityConfig.java | head -20
    echo ""
else
    echo "❌ SecurityConfig.java not found"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check Core Service
echo "📋 Core Service (Port 8080):"
CORE_CONFIG=$(find ../smart-bachat/bachat-core-service -name "*SecurityConfig.java" -o -name "*CorsConfig.java" 2>/dev/null | head -1)
if [ -n "$CORE_CONFIG" ]; then
    echo "✅ Config found: $CORE_CONFIG"
    echo ""
    echo "Current CORS configuration:"
    grep -A 15 "cors\|Cors\|CORS" "$CORE_CONFIG" | head -20
    echo ""
else
    echo "⚠️  No CORS config found (might not have CORS restrictions)"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check AI Service
echo "📋 AI Service (Port 8089):"
AI_CONFIG=$(find ../smart-bachat/ai-advisory-service -name "*SecurityConfig.java" -o -name "*CorsConfig.java" 2>/dev/null | head -1)
if [ -n "$AI_CONFIG" ]; then
    echo "✅ Config found: $AI_CONFIG"
    echo ""
    echo "Current CORS configuration:"
    grep -A 15 "cors\|Cors\|CORS" "$AI_CONFIG" | head -20
    echo ""
else
    echo "⚠️  No CORS config found (might not have CORS restrictions)"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Next Steps:"
echo ""
echo "1. Read BACKEND_CORS_FIX.md for detailed instructions"
echo "2. Update SecurityConfig.java in UAM service to allow all origins:"
echo "   configuration.setAllowedOriginPatterns(List.of(\"*\"));"
echo ""
echo "3. Rebuild and restart UAM service:"
echo "   cd ../smart-bachat/uam-service"
echo "   ./gradlew clean build"
echo "   ./gradlew bootRun"
echo ""
echo "4. Test from mobile app"
echo ""

