# Setu Redirect URL Setup - Deep Link Configuration

## 🎯 Problem

After approving consent in Setu's webview, the app redirects to GitHub instead of returning to your app.

## 💡 Root Cause

Setu dashboard **doesn't accept custom URL schemes** like `smartbachat://` - it only accepts HTTPS URLs.

## ✅ Solution: Use Redirect Server

Since Setu requires an HTTPS URL, we need a web server that receives the callback and redirects to your app.

### Quick Setup (For Testing - 5 minutes)

**Step 1: Start the Redirect Server**

```bash
# In your project directory
node redirect-server.js
```

You should see:
```
🚀 SmartBachat Redirect Server started!
📡 Server running at http://localhost:3000
```

**Step 2: Expose Server with Cloudflare Tunnel**

Open a **new terminal** and run:
```bash
cloudflared tunnel --url http://localhost:3000
```

You'll see output like:
```
Your quick Tunnel has been created! Visit it at:
https://abc-def-123.trycloudflare.com
```

**Copy the HTTPS URL** (e.g., `https://abc-def-123.trycloudflare.com`)

**Alternative: Using ngrok**
```bash
npx ngrok http 3000
# Copy the HTTPS URL from output
```

**Step 3: Update Setu Dashboard**

1. **Login to Setu Dashboard**: https://bridge.setu.co/

2. **Navigate to**: Settings → Redirect URL

3. **Enter the Cloudflare URL** with `/consent-callback`:
   ```
   https://abc-def-123.trycloudflare.com/consent-callback
   ```

4. **Save** the configuration

**Step 4: Test the Flow**

1. **Login** to your app
2. **Enter mobile number** on Consent Screen
3. **Tap "Connect Bank Account"**
4. **Approve consent** in Setu's webview
5. **You'll be redirected** to the ngrok URL
6. **The redirect page** will automatically open your app! 🎉

---

## 🔄 How It Works

```
User approves consent in Setu
         ↓
Setu redirects to: https://abc-def-123.trycloudflare.com/consent-callback?status=success
         ↓
Cloudflare Tunnel forwards to: http://localhost:3000/consent-callback
         ↓
Redirect server receives the callback
         ↓
Server sends HTML page with deep link: smartbachat://consent?status=success
         ↓
Browser/WebView opens the deep link
         ↓
Your app receives the deep link and shows success! ✅
```

---

## 📋 Production Setup (For Later)

For production, you'll need a permanent HTTPS URL. Options:

### Option 1: Deploy to Vercel/Netlify (Free)

Create `public/consent-callback.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0;url=smartbachat://consent">
  <script>
    const params = new URLSearchParams(window.location.search);
    const deepLink = 'smartbachat://consent?' + params.toString();
    window.location.href = deepLink;
  </script>
</head>
<body>Redirecting to app...</body>
</html>
```

Deploy and use: `https://yourdomain.com/consent-callback.html`

### Option 2: Use Your Backend

Add an endpoint to your Spring Boot backend:
```java
@GetMapping("/consent-callback")
public String consentCallback(@RequestParam Map<String, String> params) {
    String deepLink = "smartbachat://consent?" +
        params.entrySet().stream()
            .map(e -> e.getKey() + "=" + e.getValue())
            .collect(Collectors.joining("&"));

    return "redirect:" + deepLink;
}
```

---

## ✅ Verify Deep Link Configuration (Already Done!)

Your app is already configured to handle deep links:

**`app.json` - Custom Scheme:**
```json
{
  "expo": {
    "scheme": "smartbachat",
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [
            { "scheme": "smartbachat" }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

**`App.tsx` - Initialization:**
```typescript
useEffect(() => {
  initializeDeepLinking();  // ✅ Already initialized
}, []);
```

**`ConsentScreen.tsx` - Handler:**
```typescript
useEffect(() => {
  const handleConsentCallback = (params: DeepLinkParams) => {
    if (params.status === 'success' || params.status === 'ACTIVE') {
      Alert.alert('Success! 🎉', 'Bank account connected successfully.');
      onConsentComplete();
    }
  };
  
  registerDeepLinkHandler('consent', handleConsentCallback);  // ✅ Already registered
}, []);
```

### Step 3: Test the Flow

**1. Start the app:**
```bash
npm start
```

**2. Login and navigate to Consent Screen**

**3. Enter mobile number and tap "Connect Bank Account"**

**4. In Setu's webview:**
- Select your bank
- Approve the consent
- **Setu will redirect to:** `smartbachat://consent?status=success`

**5. Your app will:**
- Receive the deep link
- Parse the parameters
- Show success alert
- Navigate to dashboard

## 🔍 Debugging Deep Links

### Test Deep Link Manually (Android):

```bash
# Open terminal and run:
adb shell am start -W -a android.intent.action.VIEW -d "smartbachat://consent?status=success" com.smartbachat.app
```

### Test Deep Link Manually (iOS):

```bash
# Open terminal and run:
xcrun simctl openurl booted "smartbachat://consent?status=success"
```

### Check Logs:

When the deep link is received, you should see:
```
Deep link received: {
  "url": "smartbachat://consent?status=success",
  "path": "consent",
  "queryParams": { "status": "success" }
}
Consent callback received: { "status": "success" }
```

## 📊 Supported URL Formats

Your app supports these deep link formats:

### Custom Scheme (Recommended for Setu):
```
smartbachat://consent
smartbachat://consent?status=success
smartbachat://consent?status=success&consentId=123
```

### HTTPS Universal Links (Alternative):
```
https://smartbachat.com/consent
https://smartbachat.com/consent?status=success
```

## 🚨 Common Issues

### Issue 1: Deep link doesn't open the app
**Solution**: Make sure you've restarted the app after updating `app.json`

### Issue 2: App opens but handler doesn't fire
**Solution**: Check that the path matches exactly (`consent` not `/consent`)

### Issue 3: Still redirects to GitHub
**Solution**: Clear Setu's cache or use incognito mode in the webview

## 📝 Setu Configuration Examples

### If Setu asks for "Success URL":
```
smartbachat://consent?status=success
```

### If Setu asks for "Failure URL":
```
smartbachat://consent?status=failed
```

### If Setu asks for "Cancel URL":
```
smartbachat://consent?status=cancelled
```

### If Setu supports dynamic parameters:
```
smartbachat://consent?status={{status}}&consentId={{consentId}}
```

## ✅ Verification Checklist

- [ ] Updated redirect URL in Setu dashboard to `smartbachat://consent`
- [ ] Restarted Expo app
- [ ] Tested bank connection flow
- [ ] Verified deep link is received in logs
- [ ] Confirmed app returns from Setu webview

---

**After updating the Setu redirect URL, test the complete flow!** 🚀

