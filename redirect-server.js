/**
 * Simple redirect server for Setu consent callback
 * This server receives the callback from Setu and redirects to the app's deep link
 * 
 * Usage:
 * 1. Run: node redirect-server.js
 * 2. In another terminal: npx ngrok http 3000
 * 3. Copy the ngrok HTTPS URL (e.g., https://abc123.ngrok.io)
 * 4. In Setu dashboard, set redirect URL to: https://abc123.ngrok.io/consent-callback
 */

const http = require('http');
const url = require('url');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  console.log(`📥 Received request: ${pathname}`);
  console.log(`📋 Query params:`, query);

  if (pathname === '/consent-callback') {
    // Extract parameters from Setu callback
    const status = query.status || 'success';
    const consentId = query.consentId || '';
    const error = query.error || '';

    // Build deep link URL
    let deepLink = 'smartbachat://consent';
    const params = [];
    
    if (status) params.push(`status=${encodeURIComponent(status)}`);
    if (consentId) params.push(`consentId=${encodeURIComponent(consentId)}`);
    if (error) params.push(`error=${encodeURIComponent(error)}`);
    
    if (params.length > 0) {
      deepLink += '?' + params.join('&');
    }

    console.log(`🔗 Redirecting to: ${deepLink}`);

    // Send HTML response with meta refresh and JavaScript redirect
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redirecting to SmartBachat...</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
            color: white;
            padding: 20px;
          }
          .container {
            text-align: center;
            max-width: 400px;
            width: 100%;
          }
          .icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            animation: bounce 2s infinite;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
          }
          .subtitle {
            font-size: 1rem;
            opacity: 0.9;
            margin-bottom: 2rem;
          }
          .button {
            display: inline-block;
            background: white;
            color: #2e7d32;
            padding: 1rem 2rem;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: transform 0.2s, box-shadow 0.2s;
            margin: 0.5rem;
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.3);
          }
          .button:active {
            transform: translateY(0);
          }
          .info {
            margin-top: 2rem;
            padding: 1rem;
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            font-size: 0.9rem;
            line-height: 1.6;
          }
          .spinner {
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 1rem auto;
            display: none;
          }
          .spinner.active {
            display: block;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .status {
            margin-top: 1rem;
            font-size: 0.9rem;
            opacity: 0.8;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">✅</div>
          <div class="title">Consent ${status === 'success' ? 'Approved!' : 'Processed'}</div>
          <div class="subtitle">Your bank account has been connected successfully!</div>

          <div class="spinner active" id="spinner"></div>

          <a href="${deepLink}" class="button" id="openButton" style="display:none;">
            📱 Try to Open App
          </a>

          <div class="info" id="info" style="display:none;">
            <strong>📱 Return to SmartBachat App</strong><br><br>
            <strong>For Expo Go users:</strong><br>
            1. Switch back to the Expo Go app<br>
            2. Your bank account is now connected!<br>
            3. You can close this browser tab<br><br>
            <strong>Or tap the button above to try automatic redirect</strong>
          </div>

          <div class="status" id="status">Attempting to open app...</div>
        </div>
        <script>
          const deepLink = '${deepLink}';
          let attemptCount = 0;
          const maxAttempts = 3;

          function updateStatus(message) {
            document.getElementById('status').textContent = message;
          }

          function showButton() {
            document.getElementById('spinner').classList.remove('active');
            document.getElementById('openButton').style.display = 'inline-block';
            document.getElementById('info').style.display = 'block';
            updateStatus('Tap the button above to open the app');
          }

          function attemptRedirect() {
            attemptCount++;
            updateStatus(\`Attempt \${attemptCount}/\${maxAttempts}...\`);

            // Try to open the deep link
            window.location.href = deepLink;

            // Check if we're still here after a delay
            setTimeout(() => {
              if (attemptCount < maxAttempts) {
                attemptRedirect();
              } else {
                showButton();
              }
            }, 1000);
          }

          // Start attempting redirects
          setTimeout(attemptRedirect, 500);

          // Also show button after 3 seconds regardless
          setTimeout(showButton, 3000);

          // Handle visibility change (user switched apps)
          document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
              // User likely switched to the app
              updateStatus('Opening app...');
            }
          });

          // Handle button click
          document.getElementById('openButton').addEventListener('click', (e) => {
            e.preventDefault();
            updateStatus('Opening app...');
            window.location.href = deepLink;

            // Show success message after a delay
            setTimeout(() => {
              updateStatus('If the app didn\\'t open, please open it manually');
            }, 2000);
          });
        </script>
      </body>
      </html>
    `);
  } else if (pathname === '/') {
    // Health check endpoint
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>SmartBachat Redirect Server</title>
      </head>
      <body>
        <h1>✅ SmartBachat Redirect Server is Running</h1>
        <p>Consent callback endpoint: <code>/consent-callback</code></p>
        <p>Server is ready to receive Setu callbacks.</p>
      </body>
      </html>
    `);
  } else {
    // 404 for other paths
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log('🚀 SmartBachat Redirect Server started!');
  console.log(`📡 Server running at http://localhost:${PORT}`);
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. In another terminal, run: npx ngrok http 3000');
  console.log('2. Copy the ngrok HTTPS URL (e.g., https://abc123.ngrok.io)');
  console.log('3. In Setu dashboard, set redirect URL to: https://abc123.ngrok.io/consent-callback');
  console.log('');
  console.log('🔍 Waiting for callbacks...');
});

