# CAREER AI (ARJ) — CHROME EXTENSION (JOB APPLICATION COPILOT)

The **Career AI Job Application Copilot Chrome Extension** brings real-time ATS match scoring, missing skill gap analysis, resume optimization suggestions, cover letter generation, and 1-click job application tracking directly into your browser while browsing job portals (LinkedIn, Naukri, Indeed, Glassdoor, Wellfound, Internshala).

---

## 🌟 FEATURES

1. **Automatic Job DOM Detection:** Detects job title, company, location, and job descriptions on leading job portals.
2. **AI Fit & Match Scoring:** Sends job details securely to the Career AI backend and calculates instant fit scores (0-100%).
3. **Skill Gap Identification:** Highlights matching vs. missing technical skills required for the job.
4. **Resume Optimization Tips:** Provides concrete bullet points to include in your resume header.
5. **AI Cover Letter Snippets:** Generates customized cover letter drafts directly inside the extension popup.
6. **1-Click Save & Application Tracking:** Seamlessly saves jobs to your Career AI Dashboard and logs applications in your tracker.
7. **Manifest V3 Compliant & Secure:** Minimal permissions, zero exposed API keys, and encrypted JWT storage in `chrome.storage.local`.

---

## 🚀 1. LOCAL INSTALLATION (DEVELOPER MODE)

1. Open **Google Chrome**.
2. Navigate to `chrome://extensions/` in the address bar.
3. Enable **Developer mode** using the toggle in the top-right corner.
4. Click **Load unpacked** in the top-left toolbar.
5. Select the `chrome-extension/` directory from this repository:
   ```text
   career-ai/chrome-extension/
   ```
6. The **Career AI — Job Application Copilot** icon will now appear in your Chrome Extensions toolbar!

---

## 🛠️ 2. DEVELOPMENT & LOCAL BACKEND TESTING

1. Ensure the Career AI backend server is running locally:
   ```bash
   npm run dev:full
   # or node server/index.js (Running on http://localhost:4000)
   ```

2. Open the extension popup by clicking the Career AI icon in your browser toolbar.
3. Sign in using your Career AI credentials (e.g. `alex@example.com` / `Password123!`).
4. Navigate to any job posting on LinkedIn, Naukri, or Indeed.
5. Click **"🔍 Scan Current Page"** and **"🚀 Run AI Copilot Analysis"**.

---

## 📦 3. PRODUCTION PACKAGING FOR CHROME WEB STORE

To package the extension into a production `.zip` bundle ready for upload to the Chrome Developer Dashboard:

1. Open your terminal in the project root.
2. Ensure no scratch files or temporary build artifacts exist in `chrome-extension/`.
3. Compress the contents of `chrome-extension/`:
   - On Windows PowerShell:
     ```powershell
     Compress-Archive -Path chrome-extension\* -DestinationPath career-ai-copilot-extension.zip -Force
     ```
   - On Mac/Linux:
     ```bash
     zip -r career-ai-copilot-extension.zip chrome-extension/
     ```
4. Upload `career-ai-copilot-extension.zip` to the [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole).

---

## 🔒 4. SECURITY & PRIVACY SPECIFICATIONS

* **Permissions:** Restricted strictly to `storage`, `activeTab`, and `scripting`.
* **Zero Client Secrets:** No OpenAI or JWT secrets reside in extension code. All processing takes place via authenticated API requests to your Career AI server.
* **Privacy:** Extracts job text solely when triggered by user interaction. No background browsing history or private credentials are stored or collected.
