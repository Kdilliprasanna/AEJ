# Public Access Setup Guide

## Option 1: Using ngrok (Recommended - Easiest)

### What is ngrok?
ngrok creates a secure tunnel from your local machine to the internet, making your app accessible from anywhere.

### Step 1: Download ngrok
- Go to https://ngrok.com/download
- Download for your OS (Windows/Mac/Linux)
- Extract the file

### Step 2: Setup ngrok
```bash
# On Windows (PowerShell or Command Prompt):
cd path\to\ngrok
./ngrok config add-authtoken YOUR_AUTH_TOKEN

# On Mac/Linux:
cd path/to/ngrok
./ngrok config add-authtoken YOUR_AUTH_TOKEN
```
Get your auth token from https://dashboard.ngrok.com/auth/your-authtoken

### Step 3: Start ngrok tunnels
Run these in separate terminals:

#### For Backend (Port 4000):
```bash
ngrok http 4000
```
This will show something like:
```
Forwarding                    https://xxxxx-xx-xxxxx-xxx.ngrok.io -> http://localhost:4000
```

#### For Frontend (Port 5176):
```bash
ngrok http 5176
```

### Step 4: Update your app
After getting ngrok URLs, update your `.env` file:

```
VITE_API_URL=https://xxxxx-xx-xxxxx-xxx.ngrok.io/api
```

Replace the URL with your actual ngrok backend URL.

### Step 5: Access from anywhere
Open the ngrok frontend URL in any browser, from any device!

Example: `https://yyyyy-yy-yyyyy-yyy.ngrok.io`

---

## Option 2: Using Cloudflare Tunnel

### Step 1: Install Cloudflare Tunnel
- Go to https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/
- Download the `cloudflared` binary
- Set up an account on Cloudflare

### Step 2: Authenticate
```bash
cloudflared tunnel login
```

### Step 3: Create tunnel
```bash
cloudflared tunnel create my-app
```

### Step 4: Route traffic
Create a `Tunnel.yaml` file:
```yaml
tunnel: my-app
credentials-file: /path/to/credentials.json

ingress:
  - hostname: app.example.com
    service: http://localhost:5176
  - hostname: api.example.com
    service: http://localhost:4000
  - service: http_status:404
```

### Step 5: Run tunnel
```bash
cloudflared tunnel run my-app
```

---

## Option 3: Deploy to Cloud (Most Reliable)

### Deploy Backend to Heroku/Railway
```bash
npm run build
# Follow platform-specific deployment steps
```

### Deploy Frontend to Vercel
- Connect your GitHub repo
- Set `VITE_API_URL` to your backend URL
- Deploy automatically on each push

---

## Quick Troubleshooting

### "Connection refused" error?
- Make sure backend (`npm run dev:full`) is running locally
- Check firewall settings
- Verify port numbers (4000 for API, 5176 for Frontend)

### ngrok URL keeps changing?
- Get a pro ngrok account for persistent URLs
- Use `--region` flag to get consistent URLs

### CORS errors?
- Check backend CORS settings
- Ensure API URL is correct in `.env`

---

## Test Connectivity
```bash
# Test backend
curl https://your-ngrok-url/api/auth/check

# Test frontend
Open https://your-frontend-url in browser
```

---

## Access from Mobile
1. Get your ngrok frontend URL
2. Open in mobile browser
3. If using iOS/Android, may need to add SSL exception (tap "Visit anyway")

**For production: Get proper SSL certificate**

---

## Environment Variables for Public Access

Update `.env.local`:
```
VITE_API_URL=https://your-ngrok-backend-url/api
```

Update `server/.env`:
```
ALLOWED_ORIGINS=https://your-ngrok-frontend-url,https://your-mobile-domain
```

