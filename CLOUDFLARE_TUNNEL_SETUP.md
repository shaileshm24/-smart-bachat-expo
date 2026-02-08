# Cloudflare Tunnel Setup - Quick Reference

## 🚀 Installation

### macOS (Homebrew):
```bash
brew install cloudflare/cloudflare/cloudflared
```

### macOS (Direct Download):
```bash
# Download the binary
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-amd64.tgz | tar -xz

# Move to PATH
sudo mv cloudflared /usr/local/bin/

# Verify installation
cloudflared --version
```

### Linux:
```bash
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
chmod +x cloudflared-linux-amd64
sudo mv cloudflared-linux-amd64 /usr/local/bin/cloudflared
```

### Windows:
Download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/

---

## 📋 Usage

### Start Tunnel (Quick Mode):
```bash
cloudflared tunnel --url http://localhost:3000
```

### Output:
```
+--------------------------------------------------------------------------------------------+
|  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable): |
|  https://abc-def-123.trycloudflare.com                                                    |
+--------------------------------------------------------------------------------------------+
```

### Copy the URL and use it in Setu:
```
https://abc-def-123.trycloudflare.com/consent-callback
```

---

## 🔄 Complete Workflow

### Terminal 1 - Start Redirect Server:
```bash
cd /Users/shaileshmali/work/Personal/smart-bachat-expo
node redirect-server.js
```

### Terminal 2 - Start Cloudflare Tunnel:
```bash
cloudflared tunnel --url http://localhost:3000
```

### Terminal 3 - Start Expo App:
```bash
npm start
```

---

## ✅ Advantages over ngrok

| Feature | Cloudflare Tunnel | ngrok |
|---------|------------------|-------|
| **Free tier** | Unlimited | 40 connections/min |
| **Speed** | Faster (Cloudflare CDN) | Slower |
| **Stability** | More stable | Can be flaky |
| **URL changes** | Yes (free tier) | Yes (free tier) |
| **Installation** | One-time install | npm package |
| **DDoS protection** | Built-in | Limited |

---

## 🔍 Troubleshooting

### Issue: "command not found: cloudflared"
**Solution**: Make sure it's in your PATH
```bash
# Check if installed
which cloudflared

# If not found, reinstall or add to PATH
export PATH="/usr/local/bin:$PATH"
```

### Issue: "Tunnel connection failed"
**Solution**: Check if port 3000 is already in use
```bash
# Check what's using port 3000
lsof -i :3000

# Kill the process if needed
kill -9 <PID>
```

### Issue: "URL not reachable"
**Solution**: Wait 10-30 seconds for the tunnel to be fully established

---

## 🎯 Testing the Tunnel

### Test if tunnel is working:
```bash
# In a new terminal
curl https://abc-def-123.trycloudflare.com/
```

You should see:
```html
<h1>✅ SmartBachat Redirect Server is Running</h1>
```

### Test the consent callback:
```bash
curl "https://abc-def-123.trycloudflare.com/consent-callback?status=success"
```

You should see HTML with the deep link redirect.

---

## 📝 For Production

For production, create a **named tunnel** (persistent URL):

### 1. Login to Cloudflare:
```bash
cloudflared tunnel login
```

### 2. Create a named tunnel:
```bash
cloudflared tunnel create smartbachat-redirect
```

### 3. Configure the tunnel:
Create `~/.cloudflared/config.yml`:
```yaml
tunnel: <TUNNEL-ID>
credentials-file: /Users/shaileshmali/.cloudflared/<TUNNEL-ID>.json

ingress:
  - hostname: redirect.smartbachat.com
    service: http://localhost:3000
  - service: http_status:404
```

### 4. Create DNS record:
```bash
cloudflared tunnel route dns smartbachat-redirect redirect.smartbachat.com
```

### 5. Run the tunnel:
```bash
cloudflared tunnel run smartbachat-redirect
```

Now you have a **permanent URL**: `https://redirect.smartbachat.com`

---

## 🚀 Quick Commands Reference

```bash
# Start quick tunnel
cloudflared tunnel --url http://localhost:3000

# Start with custom subdomain (requires login)
cloudflared tunnel --url http://localhost:3000 --name smartbachat

# Check version
cloudflared --version

# Update cloudflared
brew upgrade cloudflared

# View logs
cloudflared tunnel --url http://localhost:3000 --loglevel debug
```

---

## 📚 Resources

- Official Docs: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
- GitHub: https://github.com/cloudflare/cloudflared
- Troubleshooting: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/

---

**Now start the tunnel and update Setu!** 🚀

