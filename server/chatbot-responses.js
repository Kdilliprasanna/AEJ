// Enhanced chatbot responses for ARJ

export const chatbotResponses = {
  resume: {
    notUploaded: `I don't see a resume yet. Upload or paste your resume in Resume Lab first. Then I can give you:
- Your ATS score (1-100)
- Missing keywords to add
- Weak sections to improve
- Specific recommendations`,
    
    weak: (score, weak, missing) => `Your ATS score is ${score}%. Good news: we can improve this!

**Weak sections:** ${weak.slice(0, 3).join(', ') || 'formatting and keywords'}

**Missing keywords:** Add ${missing.slice(0, 5).join(', ')} naturally in your summary, skills, and bullets.

**Quick wins:**
1. Add 3-5 achievement bullets with action verbs + metrics (e.g., "Increased login speed by 40%")
2. Include a skills section grouped by category (Languages, Frameworks, Tools, Soft Skills)
3. Add your portfolio/GitHub/LinkedIn link near your contact info
4. Use clear section headings (Summary, Skills, Education, Experience, Projects, Certifications)`,

    strong: (score) => `Your ATS score is ${score}% - strong foundation! Now focus on:
1. **Proof of impact** - Add metrics to every bullet (users, revenue, time saved, accuracy)
2. **Link alignment** - Ensure GitHub/portfolio links in resume match your target role
3. **Keywords** - Mirror top keywords from your target job description
4. **Brevity** - Keep each bullet to one clear achievement, not multiple`,
  },

  roles: {
    noProfile: `I need more info first:
✓ Upload or paste your resume
✓ Set a target role
✓ Add your key skills
✓ Enter your education & percentage

Then I can recommend roles matched to YOUR profile.`,

    rolesList: (topRole, topRoles) => `Your best match right now: **${topRole.title}** (${topRole.match}% match, ${topRole.chance} chance)

**Why it fits:** ${topRole.why}

**Your skill gaps:** ${topRole.missingSkills.slice(0, 4).join(', ') || 'No critical gaps detected'}
→ Learn these first, then apply through platforms in Roles & Jobs

**Next roles:**
${topRoles
  .slice(1, 4)
  .map((r) => `• ${r.title} - ${r.match}% match (${r.chance} chance)`)
  .join('\n')}

**Apply through:** LinkedIn, Naukri, Indeed, Internshala, Wellfound, RemoteOK, company career pages

I'll update matches as you improve skills and ATS score!`,
  },

  interview: {
    overview: `**Daily mock test strategy:**

**Monday-Friday (5 questions, ~15 min):**
1. One HR question (tell about yourself, challenges, achievements)
2. One technical deep-dive (system, project, concept)
3. One aptitude puzzle (math, logic, reasoning)
4. One communication scenario (present, disagree, explain)
5. One role-specific question (if you have a target role)

**Weekly progress:**
- Track your scores (aim for 70%+)
- Rewrite weak answers from previous days
- Review the hints and structure your answers better

**Monthly goals:**
- Reach 75+ average
- Build consistent 7-day streak
- Master 3-5 role-specific questions`,

    tips: `**Top interview tips:**

**For HR questions:**
- Start with STAR (Situation, Task, Action, Result)
- Use numbers when possible
- Show how you overcame challenges
- Connect to the role you're targeting

**For technical questions:**
- Explain your thinking as you go
- Draw diagrams or pseudocode if allowed
- Ask clarifying questions
- Admit what you don't know, then think through it

**For communication:**
- Practice speaking clearly and concisely
- Avoid filler words (um, uh, like)
- Pause briefly between thoughts
- Make eye contact (if video) or be animated

**For aptitude:**
- Show your working/calculation steps
- Double-check your answer
- Don't rush - speed isn't everything
- Ask if you can use a calculator`,
  },

  skills: {
    gap: (topRole, missing) => `**Skill gap for ${topRole.title}:**

**Must learn (high priority):**
${missing.slice(0, 3).map((m) => `• ${m} → Find 1 project using this skill`).join('\n')}

**Good to learn:**
${missing.slice(3, 6).map((m) => `• ${m} → Nice to have, learn after priority skills`).join('\n')}

**How to learn:**
- YouTube tutorials: 1-2 hours to basics
- Small project: 3-5 days to get hands-on
- Publish GitHub + LinkedIn: 2 hours to get noticed

**Pro tip:** Combine 2-3 skills in ONE project (e.g., React + Node + MongoDB). It's faster than learning separately.`,

    profile: `Your current skills: [Skills will load from your profile]

**To improve skills faster:**
1. Pick ONE target skill
2. Find a beginner-friendly 1-week learning plan
3. Build a small project using it
4. Add it to your resume & portfolio
5. Post about it on LinkedIn/Twitter
6. Repeat for next skill`,
  },

  projects: {
    ideas: (topRole) => `**Project ideas for ${topRole.title}:**

These projects work best because they combine multiple skills + visible proof:

**Beginner (2-3 weeks):**
- Resume analyzer (extract text, count keywords, grade sections)
- Job tracker (save, apply, track status across platforms)
- Personal portfolio website with projects and contact form

**Intermediate (4-6 weeks):**
- Authenticated task manager (signup, login, create/edit/delete tasks)
- Price comparison tool (fetch prices from multiple sources, compare)
- Analytics dashboard (pull data from API, create visualizations)

**Advanced (6-8 weeks):**
- AI chatbot (train on your resume data, answer interview questions)
- Recommendation engine (suggest jobs based on skills/profile)
- Real-time collaboration app (multiple users editing together)

**Project checklist:**
✓ Solves a real problem
✓ Uses 3+ technologies
✓ GitHub repo with clear README
✓ Live demo (Netlify, Vercel, Heroku)
✓ 2-3 achievement bullets for your resume`,

    portfolio: `**Making your portfolio shine:**

1. **GitHub:**
   - Write clear README files
   - Comment your code
   - Regular commits with meaningful messages
   - Add a "setup & run" guide

2. **Live demo:**
   - Deploy to Netlify (frontend) / Heroku (backend) - FREE
   - Include working features, not just mockups
   - Add a few sample accounts testers can use

3. **Resume bullets:**
   - "Built X tool using Y stack, deployed live, 500+ users"
   - "Created AI feature that improved Z by 40%"
   - Avoid generic: "Worked on a project" → Be specific

4. **LinkedIn/Twitter:**
   - Share your project launch
   - Show the before/after or problem/solution
   - Tag relevant communities`,
  },

  career: {
    growth: (targetRole, profile) => `**Accelerated path to ${targetRole.title}:**

**3 months:**
- [ ] Get ATS score to 75%+
- [ ] Learn top 3 missing skills
- [ ] Build 1 portfolio project
- [ ] Apply to 5-10 jobs/internships

**6 months:**
- [ ] Reach 85%+ ATS score
- [ ] Complete 2 portfolio projects
- [ ] Secure 3-5 interviews
- [ ] Build network (LinkedIn, GitHub stars)

**1 year:**
- [ ] Land first role/internship
- [ ] Contribute to open source
- [ ] Publish 1-2 articles/case studies
- [ ] Network with 50+ professionals

**Beyond:**
- Track progress in mock tests
- Improve interview skills monthly
- Keep resume updated with achievements
- Help others on your journey`,

    trajectory: `**Typical career trajectory:**

For **Engineers:**
Intern → Junior → Mid-level → Senior → Lead / Architect / Manager

For **Data:**
Analyst → Senior Analyst → Lead Analyst → Manager / Senior Data Scientist

For **Product:**
APM → Product Manager → Senior PM → Director → VP

For **Non-IT:**
Executive → Senior Executive → Manager → Director / VP

**Key insights:**
- Promotions usually every 2-3 years
- Salary jumps happen when you change roles/companies
- Build skills now, leverage them later
- Network continuously, not just when job hunting`,
  },

  general: {
    confused: `I'm here to help with:
- **Resume:** Upload to get your ATS score, keyword gaps, and improvements
- **Roles:** Find jobs matching your skills, education, and target role
- **Interview:** Daily mock tests + feedback + strategies
- **Skills:** Identify gaps and learning paths for your target role
- **Projects:** Get portfolio project ideas to build proof
- **Career:** Plan your 3-month, 6-month, 1-year growth

What would you like help with?`,

    firstSteps: `**Getting started with ARJ:**

1. **Complete your profile** (Profile tab)
   - Name, email, phone
   - Education & percentage
   - Skills (comma-separated)
   - Target role & preferred locations
   - LinkedIn/GitHub/Portfolio links

2. **Upload or paste your resume** (Resume Lab)
   - Get your ATS score instantly
   - See missing keywords & weak sections
   - Fix 1-2 things and re-analyze

3. **Generate role matches** (Roles & Jobs)
   - I'll find jobs matching YOUR profile
   - See skill gaps for each role
   - Browse applications across platforms

4. **Practice interviews** (Mock Test)
   - Do daily 5-question tests
   - Build a 7-day streak for rewards
   - Review feedback and improve

5. **Ask me anything** (AI Chat)
   - I learn from your profile, ATS report, and role matches
   - Ask about resume, roles, skills, interviews, or projects
   - Get personalized advice based on YOUR data`,
  },
};

export function generateChatbotReply(message, profile, latestReport, topRole, roles) {
  const lower = (message || '').toLowerCase();
  const hasProfile = profile && Object.keys(profile).length > 0;
  const hasResume = !!latestReport;
  const hasRoles = !!topRole && roles.length > 0;

  // Resume-related queries
  if (lower.includes('resume') || lower.includes('ats') || lower.includes('score')) {
    if (!hasResume) {
      return chatbotResponses.resume.notUploaded;
    }
    if (latestReport.score < 65) {
      return chatbotResponses.resume.weak(
        latestReport.score,
        latestReport.weakSections,
        latestReport.missingKeywords
      );
    }
    return chatbotResponses.resume.strong(latestReport.score);
  }

  // Job/Role queries
  if (lower.includes('job') || lower.includes('role') || lower.includes('recommend')) {
    if (!hasRoles) {
      return chatbotResponses.roles.noProfile;
    }
    return chatbotResponses.roles.rolesList(topRole, roles);
  }

  // Interview/Mock test queries
  if (lower.includes('interview') || lower.includes('mock') || lower.includes('test')) {
    if (lower.includes('tip') || lower.includes('how')) {
      return chatbotResponses.interview.tips;
    }
    return chatbotResponses.interview.overview;
  }

  // Skills/Gap queries
  if (lower.includes('skill') || lower.includes('gap') || lower.includes('learn')) {
    if (hasRoles && topRole?.missingSkills?.length > 0) {
      return chatbotResponses.skills.gap(topRole.title, topRole.missingSkills);
    }
    return chatbotResponses.skills.profile;
  }

  // Project queries
  if (lower.includes('project') || lower.includes('build') || lower.includes('portfolio')) {
    if (lower.includes('portfolio')) {
      return chatbotResponses.projects.portfolio;
    }
    if (hasRoles && topRole) {
      return chatbotResponses.projects.ideas(topRole.title);
    }
    return 'Set a target role first in your profile, then I can suggest projects matched to that role.';
  }

  // Career growth queries
  if (lower.includes('career') || lower.includes('growth') || lower.includes('trajectory') || lower.includes('path')) {
    if (lower.includes('trajectory')) {
      return chatbotResponses.career.trajectory;
    }
    if (hasRoles && topRole) {
      return chatbotResponses.career.growth(topRole.title, profile);
    }
    return 'Complete your profile and upload a resume first, then I can create your personalized growth plan.';
  }

  // First steps
  if (lower.includes('start') || lower.includes('first') || lower.includes('begin') || lower.includes('help')) {
    return chatbotResponses.general.firstSteps;
  }

  // Default: confused
  return chatbotResponses.general.confused;
}

export default chatbotResponses;
