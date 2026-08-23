# 🎯 Career-AI v2.0 - QUICK START (Open on Another PC)

## 🚀 INSTANT ACCESS

### On Another PC (Any device on your network):

Open your browser and go to:
```
http://172.23.20.100:5173
```

### Login Info:
```
Email: test@gmail.com
Password: 1234
```

**That's it!** You now have full access to:
✅ Resume Lab
✅ Intelligent Job Matching
✅ Professional Resume Templates
✅ Real-World Chatbot
✅ Application Tracking
✅ Mock Tests
✅ Live Notifications

---

## 🎯 TOP 5 FEATURES TO TRY FIRST

### 1. Upload Your Resume
1. Click **Resume Lab**
2. Upload your resume (PDF/DOC/TXT)
3. ATS score calculated instantly

### 2. See Jobs Matched to YOUR Skills
1. Click **Roles & Jobs**
2. See jobs filtered by YOUR resume skills
3. Jobs show % match for you specifically

### 3. Talk to Real Chatbot
1. Click **AI Chat**
2. Ask any career question:
   - "How to improve my resume?"
   - "What jobs match me?"
   - "How to prepare for interviews?"
3. Get intelligent responses

### 4. Apply & Delete Jobs
1. Click **Roles & Jobs**
2. Find a job and apply
3. Click **Applications**
4. See applied jobs + **DELETE if you want**

### 5. Professional Resume Templates
1. Click **Resume Lab**
2. Try different templates
3. Generate professional HTML resume
4. Print or save as PDF

---

## 📊 NEW FEATURES EXPLAINED

### Intelligent Job Matching
**How it works:**
- Reads YOUR resume
- Checks job requirements
- Calculates match score:
  - 40% = Your skills match
  - 20% = Your education match
  - 20% = Your experience level
  - 20% = Your target role match
- Shows jobs 40%+ match

**Example:**
```
Your resume: React, Node.js, MongoDB
↓
Amazon job: React, Node.js, AWS, Docker
Match: 75% (3 out of 4 skills match)

Google job: Python, TensorFlow, ML
Match: 0% (no matching skills)
→ NOT SHOWN
```

### Real Chatbot
**Not templates - real responses:**
```
You: "What skills should I learn?"
Bot: Analyzes YOUR resume → "Based on your React/Node 
skills, you should learn: Docker, Kubernetes, AWS. 
Docker is most in-demand right now."
```

### Professional Resume Templates (Code-Based)
**Like Overleaf for resumes:**
- Modern ATS-friendly format
- Contemporary tech design
- Creative minimal style
- Data metrics emphasis

**Output:** Clean HTML/PDF exactly like real job applications

### Application Tracking
**Now with DELETE:**
- Click **Applications**
- See all jobs you applied to
- **DELETE ones you don't want anymore**
- Track status (applied, interview, offer)
- See company feedback

### Live Notifications
**Real-time updates:**
- New jobs matching your skills
- Application status changes
- Interview reminders
- Trending roles in your field

---

## 🌐 NETWORK SETUP

Your PC is sharing the app on:
```
Local IP: 172.23.20.100
Frontend Port: 5173
API Port: 4000
```

### Access from:
- **This PC**: http://localhost:5173
- **Other PCs**: http://172.23.20.100:5173
- **Same Database**: ✅ Yes (all connected)
- **Real-time Sync**: ✅ Yes

---

## 📱 BROWSER SUPPORT

Works on:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Any modern browser

---

## 🔧 ENDPOINTS (For Developers)

### Chatbot
```
POST http://172.23.20.100:4000/api/chatbot/real
Body: { "message": "Your question" }
```

### Job Matching
```
POST http://172.23.20.100:4000/api/jobs/intelligent-match
```

### Resumes
```
GET http://172.23.20.100:4000/api/resumes/professional-templates
POST http://172.23.20.100:4000/api/resumes/render-professional
```

### Applications
```
POST http://172.23.20.100:4000/api/applications/apply
GET http://172.23.20.100:4000/api/applications
DELETE http://172.23.20.100:4000/api/applications/:id
```

### Notifications
```
GET http://172.23.20.100:4000/api/notifications/live
POST http://172.23.20.100:4000/api/notifications/:id/read
```

---

## ⚡ QUICK TIPS

1. **Upload Resume First**
   - Jobs won't match without your resume
   - All features unlock after upload

2. **Set Target Role**
   - Goes to Profile
   - Better job matching
   - Personalized recommendations

3. **Use Real Chatbot**
   - Ask specific questions
   - Gets smarter with your profile data
   - Best for career advice

4. **Track Applications**
   - Apply to jobs from "Roles & Jobs"
   - Delete if not interested anymore
   - Monitor status updates

5. **Try All Templates**
   - 4 different resume styles
   - See which looks best for you
   - Export as PDF ready

---

## 🆘 TROUBLESHOOTING

### "Can't connect to 172.23.20.100"
- Make sure you're on same Wi-Fi network
- Check if main PC has ports 5173 & 4000 open
- Try: http://localhost:5173 from main PC

### "API offline" shows
- Backend might be running slow
- Click "Refresh" button
- Restart backend if needed

### "No jobs showing"
- Upload resume first
- Wait 2-3 seconds
- Check if you have skills in profile

### "Login doesn't work"
- Use exact credentials:
  - Email: `test@gmail.com`
  - Password: `1234`
- Clear browser cache

---

## 📋 FILES YOU HAVE

### Backend Modules
1. **real-chatbot.js** - Intelligent responses
2. **intelligent-job-matcher.js** - Smart matching
3. **professional-resumes.js** - Resume templates
4. **application-manager.js** - Track apps + delete
5. **live-notifications.js** - Real-time notifications

### Documentation
1. **PRODUCTION-GUIDE.md** - Full technical docs
2. **FINAL-SUMMARY.md** - Feature overview
3. **QUICK-START.md** - Getting started
4. **This file** - Quick reference

---

## ✅ WHAT'S RUNNING

| Service | Status | URL |
|---------|--------|-----|
| Backend API | ✅ Running | http://172.23.20.100:4000 |
| Frontend | ✅ Running | http://172.23.20.100:5173 |
| Database | ✅ Local JSON | server/data/dev-db.json |
| Chatbot | ✅ Active | Real-world responses |
| Jobs | ✅ Active | 15+ job listings |
| Templates | ✅ Active | 4 professional formats |

---

## 🎉 READY TO GO!

### Right Now:
1. Open browser on another PC
2. Go to: **http://172.23.20.100:5173**
3. Login: **test@gmail.com / 1234**
4. Explore all features!

### Share with Team:
- Give them this URL: **http://172.23.20.100:5173**
- They can test on their PC/phone
- Same account = shared data
- Real-time notifications for all

---

**Version**: 2.0.0
**Status**: 🟢 Live and Ready
**Access**: http://172.23.20.100:5173
