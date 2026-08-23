# CAREER AI (ARJ) — PRODUCTION DEPLOYMENT GUIDE

This document provides a step-by-step guide for deploying **Career AI (ARJ)** to production with high availability, security isolation, and database resilience.

---

## 📋 1. ARCHITECTURE OVERVIEW

* **Frontend:** React 19 + Vite (Deployable to **Vercel**, **Netlify**, or **Cloudflare Pages**).
* **Backend:** Node.js + Express 5 (Deployable to **Railway**, **Render**, **Fly.io**, or **Docker VPS**).
* **Database:** **Supabase PostgreSQL** with Row Level Security (RLS) policies + local JSON fallback storage.
* **Authentication:** JWT sessions with BCrypt password hashing.

---

## 🔑 2. ENVIRONMENT VARIABLE REFERENCE MATRIX

Never commit actual secret values into repository files. Copy `.env.example` to `.env` in production.

| Variable Name | Required | Default / Example Value | Description |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Yes | `production` | Enables production optimizations |
| `PORT` | Yes | `4000` | Port for Express API server |
| `CLIENT_URL` | Yes | `https://your-app.vercel.app` | Allowed CORS origins (comma-separated) |
| `JWT_SECRET` | Yes | `secure_random_string` | Secret key for signing user JWT tokens |
| `SUPABASE_URL` | Optional | `https://xyz.supabase.co` | Supabase PostgreSQL project URL |
| `SUPABASE_ANON_KEY` | Optional | `ey...` | Supabase public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | `ey...` | Supabase admin key (server-side only!) |
| `OPENAI_API_KEY` | Optional | `sk-proj-...` | Enables OpenAI GPT-powered features |
| `RAPIDAPI_KEY` | Optional | `key_...` | Enables JSearch live job scraping |
| `GOOGLE_CLIENT_ID` | Optional | `id_...` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Optional | `sec_...` | Google OAuth Client Secret |
| `GITHUB_CLIENT_ID` | Optional | `id_...` | GitHub OAuth Client ID |
| `GITHUB_CLIENT_SECRET` | Optional | `sec_...` | GitHub OAuth Client Secret |
| `SMTP_HOST` | Optional | `smtp.resend.com` | Outbound email server host |
| `SMTP_USER` | Optional | `resend` | SMTP username |
| `SMTP_PASS` | Optional | `pass_...` | SMTP password |

---

## 🔒 2.5 ENVIRONMENT DATABASE PERSISTENCE POLICIES

To guarantee user data isolation and system integrity, Career AI (ARJ) enforces strict database persistence policies based on `NODE_ENV`:

* **LOCAL DEVELOPMENT (`NODE_ENV=development`):**
  - Local JSON storage fallback (`server/data/dev-db.json`) is allowed for rapid offline development.
  - Supabase PostgreSQL can be optionally connected when credentials are present in `.env`.

* **TESTING ENVIRONMENT (`NODE_ENV=test`):**
  - Automated test runners use isolated, non-destructive test storage.
  - Production data is strictly isolated and never mutated during test runs.

* **PRODUCTION ENVIRONMENT (`NODE_ENV=production`):**
  - **Supabase PostgreSQL Cloud is MANDATORY.**
  - The server outputs explicit configuration warnings if started in production without Supabase credentials (`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_ANON_KEY`).
  - `/api/db-status` returns `ok: false` and HTTP status `503` if Supabase PostgreSQL is missing in production mode, preventing public multi-user operation on a local JSON file.

---

## 🗄️ 3. DATABASE SETUP (SUPABASE CLOUD)

1. Create a new project in [Supabase Cloud](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Paste and execute the contents of `supabase/schema.sql`.
4. Verify that Row Level Security (RLS) is enabled on all 20 tables:
   `profiles`, `resumes`, `ats_reports`, `applications`, `mock_test_results`, `streaks`, `chat_messages`, `saved_jobs`, `interview_events`, `public_profiles`, `analytics_events`, `copilot_sessions`, etc.
5. Copy your Project URL, Anon Key, and Service Role Key into your backend environment variables.

---

## 🚀 4. BACKEND DEPLOYMENT (RAILWAY / RENDER / DOCKER)

### Option A: Deployment via Railway
1. Connect your GitHub repository to [Railway](https://railway.app).
2. Create a new service from your repository.
3. Configure Environment Variables (`PORT=4000`, `JWT_SECRET`, `CLIENT_URL`, etc.).
4. Set the Start Command: `npm start` (or let Railway use the included `Dockerfile`).

### Option B: Deployment via Render
1. Connect your repository to [Render](https://render.com) as a **Web Service**.
2. Set Environment to **Node**.
3. Build Command: `npm ci`
4. Start Command: `npm start`
5. Configure Environment Variables in the Render Dashboard.

---

## ⚡ 5. FRONTEND DEPLOYMENT (VERCEL / NETLIFY)

### Option A: Deployment via Vercel
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add Environment Variable:
   ```env
   VITE_API_URL=https://your-backend-service.railway.app/api
   ```
6. Click **Deploy**.

---

## 🛡️ 6. CORS & SECURITY VERIFICATION

Once both frontend and backend are deployed:
1. Ensure your backend `CLIENT_URL` environment variable includes your frontend domain (e.g. `https://your-app.vercel.app`).
2. Test authentication by creating a test account and verifying that JWT tokens are properly attached in headers.

---

## 🔍 7. HEALTH VERIFICATION & MONITORING

Execute an HTTP GET request to verify server operational health:
```bash
curl https://your-backend-service.railway.app/api/health
```
Expected response:
```json
{
  "ok": true,
  "app": "ARJ - Career Acceleration Platform",
  "version": "2.0"
}
```

Check database connectivity:
```bash
curl https://your-backend-service.railway.app/api/db-status
```
