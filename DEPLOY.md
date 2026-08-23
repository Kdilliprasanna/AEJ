Deployment instructions — create a permanent public URL

Option A — Deploy with Render (Docker)

1. Push this repository to GitHub.
2. In Render, create a new "Web Service" and choose "Docker".
3. Connect your GitHub repo, pick the branch, and set the build command to blank (Dockerfile used).
4. Set the port to `4000` (the API exposes 4000). Render will give you a public URL.

Option B — Deploy frontend to Vercel and API to Render/Heroku

- Frontend: Deploy the repo to Vercel — build command `npm run build` and output `dist`.
- API: Deploy `server/index.js` to Render as a Node service (select Node environment), start command `npm start`.

Option C — Use Docker on a VPS

- Build and run:
```bash
docker build -t career-ai:latest .
docker run -d -p 4000:4000 --name career-ai career-ai:latest
```

Notes:
- After deployment, Render/Vercel will provide a stable public URL that works even when your laptop is off.
- If you want, I can prepare a GitHub repo and push these changes for you to click-to-deploy (I need GitHub access).
