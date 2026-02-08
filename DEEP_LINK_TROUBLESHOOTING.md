# Deep Link Troubleshooting Guide

## 🔴 Problem

After approving consent in Setu, the redirect page shows "something went wrong" when clicking the "Open SmartBachat App" button.

## 🔍 Possible Causes

1. **App not in foreground** - Deep links work better when app is in background
2. **Browser security restrictions** - Some browsers block deep link redirects
3. **Expo Go limitations** - Expo Go may have different deep linking behavior than standalone apps
4. **Platform-specific issues** - Android vs iOS handle deep links differently

---

## ✅ Step-by-Step Debugging

### **Step 1: Verify Deep Linking Works**

Test the deep link directly while your app is running:

**For Android (using adb):**
```bash
adb shell am start -a android.intent.action.VIEW -d "smartbachat://consent?status=success"
```

**For iOS Simulator:**
```bash
xcrun simctl openurl booted "smartbachat://consent?status=success"
```

**Expected Result:**
- App should come to foreground
- You should see logs:
  ```
  Deep link received: {
    "url": "smartbachat://consent?status=success",
    "path": "consent",
    "queryParams": { "status": "success" }
  }
  Consent callback received: { "status": "success" }
  ```
- Success alert should appear

**If this doesn't work:** Deep linking is not configured properly in your app.

---

### **Step 2: Check Expo Go vs Development Build**

**Are you using Expo Go?**

Expo Go has limitations with deep linking. Try creating a development build:

```bash
# Create development build
npx expo prebuild

# For Android
npx expo run:android

# For iOS
npx expo run:ios
```

Development builds have full deep linking support.

---

### **Step 3: Test from Browser**

Open your phone's browser (Safari/Chrome) and manually enter:
```
smartbachat://consent?status=success
```

**Expected Result:**
- Browser should ask "Open in SmartBachat?"
- Tap "Open"
- App should open and show success

**If browser says "Cannot open page":**
- Deep link scheme is not registered
- Try restarting the app
- Try reinstalling the app

---

### **Step 4: Check App State**

Deep links work differently based on app state:

| App State | Behavior |
|-----------|----------|
| **Foreground** | `Linking.addEventListener` fires |
| **Background** | `Linking.addEventListener` fires |
| **Closed** | `Linking.getInitialURL` returns the URL |

**Make sure your app is in BACKGROUND (not closed) when testing!**

---

### **Step 5: Add More Logging**

Let's add debug logging to see what's happening:

**In `services/deepLinking.ts`, the `handleUrl` method already logs:**
```typescript
console.log('Deep link received:', { url, path, queryParams });
```

**Check your Expo logs for these messages!**

---

## 🔧 Alternative Solutions

### **Option 1: Use Polling Instead of Deep Link**

Instead of relying on deep links, poll the backend for consent status:

```typescript
// In ConsentScreen.tsx
const pollConsentStatus = async (consentId: string) => {
  const interval = setInterval(async () => {
    const status = await api.checkConsentStatus(consentId);
    if (status === 'ACTIVE') {
      clearInterval(interval);
      Alert.alert('Success!', 'Bank account connected');
    }
  }, 3000); // Check every 3 seconds
};
```

### **Option 2: Use Push Notifications**

Backend sends a push notification when consent is approved.

### **Option 3: Show Instructions to Return Manually**

Update the redirect page to tell users:
```
✅ Consent Approved!

Please return to the SmartBachat app manually.
```

---

## 🎯 Recommended Testing Flow

1. **Start all services:**
   ```bash
   # Terminal 1: Redirect server
   node redirect-server.js
   
   # Terminal 2: Cloudflare tunnel
   cloudflared tunnel --url http://localhost:3000
   
   # Terminal 3: Expo app
   npm start
   ```

2. **Put app in BACKGROUND** (don't close it!)
   - Press home button
   - Or switch to another app

3. **Test the consent flow:**
   - Open browser
   - Go to Setu consent page
   - Approve consent
   - Should redirect to Cloudflare URL
   - Should show redirect page
   - Should automatically open app

4. **Check logs in all terminals:**
   - Redirect server: Should show callback received
   - Expo: Should show deep link received
   - App: Should show success alert

---

## 📊 Expected Logs

**Redirect Server:**
```
📥 Received request: /consent-callback
📋 Query params: { status: 'success', consentId: '...' }
🔗 Redirecting to: smartbachat://consent?status=success&consentId=...
```

**Expo App:**
```
Deep link received: {
  "url": "smartbachat://consent?status=success",
  "path": "consent",
  "queryParams": { "status": "success" }
}
Consent callback received: { "status": "success" }
```

---

## 🚨 Common Issues

### Issue: "Cannot open page" in browser
**Solution:** App is not installed or deep link scheme not registered. Restart app.

### Issue: Deep link opens app but no alert
**Solution:** Handler not registered. Check ConsentScreen is mounted.

### Issue: Works from terminal but not from browser
**Solution:** Browser security. Try different browser or use development build.

### Issue: Works on Android but not iOS (or vice versa)
**Solution:** Platform-specific configuration. Check `app.json` intent filters.

---

## 🎯 Next Steps

1. **Test deep link from terminal** (Step 1)
2. **If that works:** Issue is with browser redirect
3. **If that doesn't work:** Issue is with app configuration
4. **Consider using development build** instead of Expo Go
5. **Consider alternative solutions** (polling, push notifications)

---

**Share the logs from all three terminals when testing!** 🔍

