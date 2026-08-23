
# ARJ

ARJ is a full-stack career acceleration platform for resume ATS scoring, role recommendations, job platform links, daily mock interviews, streak tracking, AI-guided chat, profile management, resume templates, and application tracking.

## Run In VS Code

Open a terminal in this folder:

```bash
cd career-ai
```

Install packages if needed:

```bash
npm install
```

Run frontend and backend together:

```bash
npm run dev:full
```

Open:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:4000/api/health
```

## Demo Login

```text
Email: test@gmail.com
Password: 1234
```

## Main Features

- Email/password sign up and login
- Forgot password and reset password flow
- Protected dashboard after login
- User profile with education, percentage/CGPA, skills, target role, preferred job type, and locations
- Resume upload for PDF, DOCX, and TXT
- ATS score with section-wise scoring, missing keywords, weak sections, formatting issues, and improvement suggestions
- Resume templates with preview and PDF print/export
- Role recommendations with match percentage, chance level, role meaning, salary range, skill gap, roadmap, and project ideas
- Job platform links for LinkedIn, Naukri, Apna, Indeed, Glassdoor, Internshala, Wellfound, RemoteOK, and company career pages
- Saved jobs and applied jobs tracker
- AI-style career chatbot with saved chat history
- Daily mock interview test with scoring, feedback, weekly progress, badges, and streaks
- AI recommendations for skills, projects, resume improvements, interviews, and career direction
- Dark/light mode and responsive mobile layout

## Database

The app works immediately with a local development database:

```text
server/data/dev-db.json
```

It seeds the demo user automatically. You can optionally add MongoDB later by copying `.env.example` to `.env` and setting `MONGO_URI`.

## Useful Commands

```bash
npm run dev
npm run api
npm run dev:full
npm run build
npm run lint
```

## Environment

Create `.env` from `.env.example` when you want custom settings:

```text
PORT=4000
CLIENT_URL=http://localhost:5173
JWT_SECRET=change-this-in-production
MONGO_URI=
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
AI_API_KEY=
```

If SMTP is not configured, password reset generates a development reset token on screen.
