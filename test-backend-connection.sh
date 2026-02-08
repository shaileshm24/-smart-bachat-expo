#!/bin/bash

echo "🔍 Testing Backend Services Connection..."
echo ""

# Test UAM Service
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 UAM Service (Port 8081)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "1️⃣ Testing with localhost:8081..."
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:8081/actuator/health
echo ""

echo "2️⃣ Testing with 127.0.0.1:8081..."
curl -s -o /dev/null -w "Status: %{http_code}\n" http://127.0.0.1:8081/actuator/health
echo ""

echo "3️⃣ Testing login endpoint with localhost..."
curl -s -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test@example.com","password":"test123"}' \
  -w "\nHTTP Status: %{http_code}\n"
echo ""

echo "4️⃣ Testing login endpoint with 127.0.0.1..."
curl -s -X POST http://127.0.0.1:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test@example.com","password":"test123"}' \
  -w "\nHTTP Status: %{http_code}\n"
echo ""

echo "5️⃣ Testing CORS preflight (OPTIONS request)..."
curl -s -X OPTIONS http://127.0.0.1:8081/api/v1/auth/login \
  -H "Origin: http://localhost:8082" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v 2>&1 | grep -i "access-control"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Core Service (Port 8080)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "1️⃣ Testing with localhost:8080..."
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:8080/actuator/health
echo ""

echo "2️⃣ Testing with 127.0.0.1:8080..."
curl -s -o /dev/null -w "Status: %{http_code}\n" http://127.0.0.1:8080/actuator/health
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Process Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Processes listening on ports:"
lsof -i :8081 -i :8080 -i :8089 | grep LISTEN
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

UAM_STATUS=$(curl -s http://localhost:8081/actuator/health | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
CORE_STATUS=$(curl -s http://localhost:8080/actuator/health | grep -o '"status":"[^"]*"' | cut -d'"' -f4)

echo "UAM Service (8081): $UAM_STATUS"
echo "Core Service (8080): $CORE_STATUS"
echo ""

if [ "$UAM_STATUS" = "DOWN" ]; then
    echo "⚠️  UAM Service is DOWN - This is why you're getting network errors!"
    echo ""
    echo "Possible causes:"
    echo "  1. Database is not running"
    echo "  2. Database connection configuration is wrong"
    echo "  3. Service is still starting up"
    echo ""
    echo "Check the UAM service logs for errors:"
    echo "  cd ../smart-bachat/uam-service"
    echo "  ./gradlew bootRun"
    echo ""
elif [ "$UAM_STATUS" = "UP" ]; then
    echo "✅ UAM Service is UP and healthy!"
    echo ""
    echo "If you're still getting network errors in the app:"
    echo "  1. Make sure CORS is configured (see BACKEND_CORS_FIX.md)"
    echo "  2. Try using 127.0.0.1 instead of localhost"
    echo "  3. Restart the Expo app"
    echo ""
else
    echo "❓ UAM Service status unknown: $UAM_STATUS"
fi

