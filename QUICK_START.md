# ⚡ Quick Start Guide - Career AI

## Start Your Application

### Step 1: Open Terminal in `career-ai` folder

```bash
cd career-ai
```

### Step 2: Run Full Development
```bash
npm run dev:full
```

This starts:
- ✅ Backend API on port 4000
- ✅ Frontend on port 5176
- ✅ Mock database (dev-db.json)

You'll see:
```
🚀 ARJ API RUNNING on port 4000
✅ Frontend ready at http://localhost:5176
```

### Step 3: Open in Browser
Go to: **http://localhost:5176**

---

## 🎯 Test New Features (In Order)

### 1️⃣ Complete Your Profile
1. Click "Profile" in sidebar
2. Fill all fields:
   - Name, Email, Phone
   - Education (Degree, Field, CGPA)
   - Skills (add 5-10 skills)
   - Target Role
   - Job Type Preference
   - Locations
3. Click "Save"

### 2️⃣ Upload Resume & Get Notifications
1. Click "Resume Lab"
2. Click "Upload Resume"
3. Select any PDF file
4. System automatically:
   - Analyzes resume
   - Calculates ATS score
   - Finds matching jobs
   - Creates notifications
5. Click "Notifications" → See new job matches!

### 3️⃣ Explore Job Opportunities
1. Click "Roles & Jobs"
2. See list of jobs with match percentages
3. Click any job card
4. Modal shows 10 platforms to apply:
   - LinkedIn ✅
   - Naukri ✅
   - Indeed ✅
   - Apna ✅
   - Internshala ✅
   - + more!
5. Click any platform to search for that role

### 4️⃣ Try Resume Templates
1. Click "Premium Templates"
2. Select different templates from gallery
3. See live preview on right
4. Click "Download PDF" to save

### 5️⃣ Check All Notifications
1. Click "Notifications" in sidebar
2. Filter by: All, Unread, Job Matches, Resume
3. See all opportunities
4. Mark as read or delete

### 6️⃣ Try AI Chat
1. Click "AI Chat"
2. Ask questions like:
   - "How to improve my resume?"
   - "What skills should I learn for X role?"
   - "How to prepare for interview?"
3. Get instant answers

### 7️⃣ Take Mock Test
1. Click "Mock Test"
2. Answer questions
3. Get evaluated results
4. See improvements

---

## 🌐 Access from Other Devices

### Option A: ngrok (EASY - 5 minutes)

**Step 1:** Download ngrok
- Go to https://ngrok.com/download
- Download for your OS
- Extract it

**Step 2:** Get auth token
- Go to https://dashboard.ngrok.com
- Copy your authtoken

**Step 3:** Setup ngrok
```bash
# Windows:
ngrok config add-authtoken YOUR_TOKEN

# Mac/Linux:
./ngrok config add-authtoken YOUR_TOKEN
```

**Step 4:** Start tunnels (two terminals)
```bash
# Terminal 1:
ngrok http 5176

# Terminal 2:
ngrok http 4000
```

You'll see:
```
Frontend: https://xxxxx-ngrok-url.ngrok.io
Backend: https://yyyyy-ngrok-url.ngrok.io
```

**Step 5:** Update `.env`
Create/edit `career-ai/.env.local`:
```
VITE_API_URL=https://yyyyy-ngrok-url.ngrok.io/api
```

**Step 6:** Access from anywhere
- Open frontend URL on phone/laptop
- Share the URL with anyone
- Works from any WiFi or mobile data!

### Option B: Local Network (No setup needed)
```
http://10.139.216.115:5176
```
Works on any device on your WiFi network

---

## 📋 Checklist

- [ ] Run `npm run dev:full`
- [ ] Open http://localhost:5176
- [ ] Complete profile
- [ ] Upload resume (triggers notifications)
- [ ] View job opportunities
- [ ] Try all 10 templates
- [ ] Check notifications
- [ ] Try chat
- [ ] Take mock test
- [ ] Setup ngrok for public access (optional)

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot reach API" | Make sure `npm run dev:full` is running |
| No jobs showing | Complete profile first, then upload resume |
| No notifications | Refresh page, check Notifications tab |
| Templates not showing | Reload page with `Ctrl+F5` |
| ngrok not working | Check auth token, restart ngrok |

---

## 💡 Pro Tips

1. **Fastest way to test:**
   - Complete profile → Upload PDF → Check notifications → Try templates

2. **Best resume template for ATS:**
   - "ATS Universal" template (highest compatibility)

3. **Best looking template:**
   - "Executive Premium" or "Creative Designer"

4. **For internships:**
   - Filter in Roles & Jobs to see internship opportunities

5. **Export PDF:**
   - Templates → Select → Download PDF → Print to PDF

---

## 📞 Need Help?

1. Check FEATURE_UPDATES.md for detailed info
2. Check PUBLIC_ACCESS_SETUP.md for access guide
3. Open browser console (F12) for errors
4. Check that backend is running

---

**Everything is ready! Happy job hunting! 🚀**
