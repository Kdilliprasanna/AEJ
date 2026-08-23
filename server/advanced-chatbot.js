// Advanced AI Chatbot with Resume Context Awareness
// Provides intelligent career coaching based on user's profile and resume

const advancedChatbotResponses = {
  // Resume-contextual advice
  resumeContextual: {
    improveResume: (profile, latestReport) => {
      const suggestions = [];
      if (!latestReport?.atsScore || latestReport.atsScore < 75) {
        suggestions.push(`Your ATS score is ${latestReport?.atsScore || 'not yet evaluated'}. Try adding more keywords like: ${(latestReport?.missingKeywords || []).slice(0, 5).join(', ')}`);
      }
      if (!profile?.skills?.length) {
        suggestions.push('Add technical skills to your profile for better job matches');
      }
      if (!profile?.experience?.length) {
        suggestions.push('Include work experience to increase recruiter visibility');
      }
      return suggestions.length > 0 ? suggestions.join('\n') : 'Your resume looks good! Keep it updated with latest projects.';
    },

    skillGaps: (profile, topRole) => {
      const userSkills = profile?.skills || [];
      const roleSkills = topRole?.requiredSkills || [];
      const missing = roleSkills.filter(s => !userSkills.some(us => us.toLowerCase().includes(s.toLowerCase())));
      
      if (missing.length === 0) {
        return `Great! You have all key skills for ${topRole?.title || 'this role'}. Now focus on projects and experience.`;
      }
      
      return `To land ${topRole?.title || 'your target role'}, you should learn: ${missing.slice(0, 3).join(', ')}. Start with ${missing[0]} - it's in high demand.`;
    },

    projectIdeas: (profile) => {
      const skills = profile?.skills || [];
      const ideas = {
        react: 'Build a SaaS dashboard with React + Node backend',
        node: 'Create a REST API for a real problem you face daily',
        python: 'Develop a machine learning model on a public dataset',
        aws: 'Deploy a full-stack app on AWS with auto-scaling',
        devops: 'Build a CI/CD pipeline for a GitHub project'
      };
      
      const suggestions = Object.entries(ideas)
        .filter(([key]) => skills.some(s => s.toLowerCase().includes(key)))
        .map(([, idea]) => `• ${idea}`)
        .slice(0, 3);
      
      return `Project ideas for your stack:\n${suggestions.join('\n') || '• Build something useful - anything helps!'}`;
    },

    interviewPrep: (profile, topRole) => {
      return `Interview Prep for ${topRole?.title || 'your target role'}:

**Week 1:** Understand company culture & recent news
**Week 2:** Practice behavioral questions (STAR method)
**Week 3:** Dive deep into technical concepts
**Week 4:** Mock interviews with our daily test

Key questions you'll face:
1. Tell me about a project using ${profile?.skills?.[0] || 'your tech stack'}
2. How would you improve ${topRole?.title?.toLowerCase() || 'this product'}?
3. Your biggest technical challenge and how you solved it
4. Where do you see yourself in 5 years?

Tip: Use our daily mock tests to practice these exact questions!`;
    }
  },

  // Job and role matching
  jobMatching: {
    rolesForYou: (profile, roles) => {
      const userSkills = profile?.skills || [];
      const matched = roles
        .map(role => ({
          role,
          match: Math.round((role.requiredSkills?.filter(s => userSkills.some(us => us.toLowerCase().includes(s.toLowerCase()))).length || 0) / (role.requiredSkills?.length || 1) * 100)
        }))
        .filter(r => r.match >= 40)
        .sort((a, b) => b.match - a.match)
        .slice(0, 5);

      if (matched.length === 0) {
        return 'No exact matches yet, but any of these roles could work: Full Stack Dev, Backend Engineer, DevOps Engineer - depends on your interests!';
      }

      return `Perfect roles for you based on YOUR skills:\n${matched.map(m => `• ${m.role.title} (${m.match}% match) - ${m.role.description}`).join('\n')}`;
    },

    jobAdvice: (topRole) => {
      if (!topRole) return 'Update your profile to get personalized job advice!';
      
      return `Getting hired for ${topRole.title}:

**Resume Focus:**
✓ Highlight projects that use ${topRole.requiredSkills?.[0] || 'required technologies'}
✓ Quantify achievements (not "built website" but "improved performance 40%")
✓ Include links to GitHub/portfolio

**Interview Tips:**
✓ Research company's tech stack beforehand
✓ Prepare 3 strong project stories
✓ Ask about mentorship opportunities
✓ Practice system design questions (if senior role)

**Salary Negotiation:**
${topRole.salaryRange || 'Market rate varies by location and experience'}
Never accept first offer - negotiate 10-15% higher`;
    }
  },

  // Market insights
  marketContext: {
    jobTrends: () => `Market Trends Right Now:

Hot Roles (2024-2025):
1. GenAI/LLM Engineer - 3x salary growth potential
2. Full-Stack Developer (React + Node) - 500+ openings daily
3. Cloud DevOps Engineer - AWS/Azure certified = +40% salary
4. Data Scientist - $80-150K USD roles abundant
5. AI/ML Engineer - highest growth trajectory

Highest Paying:
• ML Engineer: Rs.18-35 LPA (India) or $120-200K (US)
• Senior DevOps: Rs.20-32 LPA or $110-180K
• Cloud Architect: Rs.22-40 LPA or $130-200K

Fastest Growing Skills:
• Prompt Engineering
• MLOps  
• Cloud-Native Development
• Full Stack AI Applications`,

    salaryInsights: (role) => `Salary Data for ${role?.title || 'Your Role'}:

India Breakdown (Fresher to Senior):
Fresher: Rs.4-8 LPA
Junior: Rs.8-15 LPA
Mid-level: Rs.15-25 LPA
Senior: Rs.25-40 LPA
Lead/Architect: Rs.40-60+ LPA

International (Fresher to Senior):
US: $55K - $180K+ USD
UK: GBP 30K - GBP 90K+
Canada: CAD $55K - $160K+
Singapore: SGD $50K - $150K+

What affects salary?
✓ ATS Score (75%+ = 20-30% premium)
✓ Portfolio projects (proven skills)
✓ Certifications (AWS, GCP, Azure)
✓ Work experience
✓ Interview performance`
  },

  // Personalized career paths
  careerAcceleration: {
    thirtyDayPlan: (profile, topRole) => `Your 30-60-90 Day Career Plan:

First 30 Days:
[ ] Get ATS score to 75%+ (add 15-20 keywords)
[ ] Learn top 2 missing skills for ${topRole?.title || 'target role'}
[ ] Contribute to 2 GitHub projects
[ ] Apply to 10 jobs matching your skills
[ ] Take our daily mock tests for 7 consecutive days

Next 30 Days:
[ ] Build one impressive portfolio project
[ ] Get 3 informational interviews with engineers at target companies
[ ] Increase GitHub contributions
[ ] Apply to 15 more jobs
[ ] Practice for interviews (aim for 80%+ on mock tests)

Last 30 Days:
[ ] Complete portfolio project (deploy it!)
[ ] Take final interview prep push
[ ] Network on LinkedIn (connect with 50 people)
[ ] Interview at target companies (aim for 3+ interviews)
[ ] Negotiate offer and celebrate!

Milestones to hit:
Day 7: Consistent mock test streak ⭐
Day 14: Updated resume + portfolio 📄
Day 30: First job interview 🎯
Day 60: Multiple offers 🎉`,

    careerPath: (profile) => `Your Career Growth Path:

Next 1-2 Years: Junior Developer
→ Focus: Master core technologies
→ Goal: Complete 3-5 real projects
→ Timeline: Build strong foundation

Next 2-5 Years: Mid-Level Developer
→ Focus: Leadership, system design, mentoring
→ Goal: Own features end-to-end
→ Timeline: Become go-to person for 1-2 areas

Next 5-10 Years: Senior Developer/Tech Lead
→ Focus: Architecture, team building, strategy
→ Goal: Make technical decisions for teams
→ Timeline: Recognized expert in your domain

Long-term (10+ Years): Principal/Architect/Manager
→ Focus: Direction setting, innovation
→ Goal: Shape company's technical future
→ Timeline: Strategic technology leader

To accelerate: Build projects, contribute to open source, write technical content`,

    weeklyGoals: (streak) => `This Week's Goals (You're on ${streak || 1}-day streak!):

✅ Take daily mock test (aim for 5 consecutive days for badge)
✅ Apply to 2-3 relevant jobs
✅ Learn one new skill (30 min/day)
✅ Build or improve one project
✅ Network: Connect with 5 professionals on LinkedIn

Bonus Activities:
🎯 Write about what you learned (blog post/LinkedIn)
🎯 Contribute to open source
🎯 Practice system design (for senior roles)
🎯 Do a tech talk or mentoring

Track Progress:
- Mock test streak: ${streak || 1} days
- Jobs applied: ____ (target: 15/week)
- Projects worked: ____ (target: 1/week)
- Skills learned: ____ (target: 3/week)`
  },

  // General help and guidance
  generalHelp: {
    getStarted: () => `Getting Started on Career-AI:

Step 1: Complete Your Profile
- Add your current role and target role
- List all technical skills
- Add work experience and education
- Upload your resume (PDF/DOC/TXT)

Step 2: Get Feedback
- Check your ATS score
- See resume improvement tips
- Find your skill gaps

Step 3: Explore Opportunities  
- View jobs matched to your skills
- Apply to relevant positions
- Save jobs for later

Step 4: Prep Daily
- Take daily mock test (different questions each day!)
- Build your streak (earn badges!)
- Practice interview questions

Step 5: Track Progress
- Check your improvements weekly
- Review mock test performance
- Celebrate milestones and badges!`,

    howToUse: () => `How to Use Career-AI Effectively:

Resume Lab:
- Upload different resume versions
- Get instant ATS feedback
- Use code-based templates like Overleaf

Roles & Jobs:
- View jobs filtered to YOUR skills
- Apply to matching opportunities
- Save jobs for later reference

AI Chat:
- Ask questions about your career
- Get personalized advice
- Learn market trends

Mock Test:
- Take daily practice tests
- Different questions each day
- Build streak for badges

Dashboard:
- Track all your progress
- Monitor improvements
- Celebrate achievements

Pro Tips:
✓ Update profile frequently for better matches
✓ Take mock tests consistently (streaks unlock badges!)
✓ Ask chatbot specific questions about your role
✓ Save and apply to relevant jobs regularly`,

    troubleshoot: () => `Troubleshooting Guide:

Issue: "Jobs not showing"
→ Make sure you've uploaded a resume
→ Check that your profile has skills listed

Issue: "ATS score is low"  
→ Add more industry keywords
→ Use longer descriptions in experience
→ Include hard skills section

Issue: "Already completed today's test"
→ That's correct! Only 1 test per day
→ New questions tomorrow with different topics
→ Build your streak by coming back daily!

Issue: "Can't find relevant jobs"
→ Update your skills in profile
→ Try different resume versions
→ Skills must match job requirements

Issue: "Chat responses not helpful"
→ Be specific in your questions
→ Include your target role/skills
→ Ask about specific topics`,

    contactSupport: () => `Need Help?

For Technical Issues:
- Check browser console (F12)
- Clear cache and refresh
- Try different browser

For Feature Questions:
- See QUICK-START.md guide
- Check UPGRADE-GUIDE.md for features
- Ask in the AI Chat

For Bugs/Issues:
- Screenshot the problem
- Note what you were doing
- Report with your test account

Remember: This is a learning platform. Spend time on mock tests and practice! The more you use it, the better the recommendations.`
  }
};

// Main function to generate contextual responses
function generateAdvancedChatbotReply(message, profile, latestReport, topRole, roles, recentJobs, mockTestProgress) {
  const msg = message.toLowerCase();

  // Detect user intent and route to appropriate response
  
  // Resume-related queries
  if (msg.includes('improve') && msg.includes('resume')) {
    return advancedChatbotResponses.resumeContextual.improveResume(profile, latestReport);
  }
  if (msg.includes('skill') && msg.includes('gap')) {
    return advancedChatbotResponses.resumeContextual.skillGaps(profile, topRole);
  }
  if (msg.includes('project') && msg.includes('idea')) {
    return advancedChatbotResponses.resumeContextual.projectIdeas(profile);
  }
  if (msg.includes('interview')) {
    return advancedChatbotResponses.resumeContextual.interviewPrep(profile, topRole);
  }

  // Job and role queries
  if (msg.includes('role') && msg.includes('match')) {
    return advancedChatbotResponses.jobMatching.rolesForYou(profile, roles || []);
  }
  if (msg.includes('job') && msg.includes('advice')) {
    return advancedChatbotResponses.jobMatching.jobAdvice(topRole);
  }

  // Market and salary queries
  if (msg.includes('trend') || msg.includes('market')) {
    return advancedChatbotResponses.marketContext.jobTrends();
  }
  if (msg.includes('salary')) {
    return advancedChatbotResponses.marketContext.salaryInsights(topRole);
  }

  // Career planning queries
  if (msg.includes('30') && msg.includes('day')) {
    return advancedChatbotResponses.careerAcceleration.thirtyDayPlan(profile, topRole);
  }
  if (msg.includes('career') && msg.includes('path')) {
    return advancedChatbotResponses.careerAcceleration.careerPath(profile);
  }
  if (msg.includes('goal') && msg.includes('week')) {
    return advancedChatbotResponses.careerAcceleration.weeklyGoals(mockTestProgress?.streak);
  }

  // General help
  if (msg.includes('start') || msg.includes('begin')) {
    return advancedChatbotResponses.generalHelp.getStarted();
  }
  if (msg.includes('how') && msg.includes('use')) {
    return advancedChatbotResponses.generalHelp.howToUse();
  }
  if (msg.includes('problem') || msg.includes('issue')) {
    return advancedChatbotResponses.generalHelp.troubleshoot();
  }
  if (msg.includes('help') || msg.includes('support')) {
    return advancedChatbotResponses.generalHelp.contactSupport();
  }

  // Fallback response
  return `I can help with:
- "Improve my resume" - Get specific improvements
- "What roles match me?" - See suitable positions
- "Skill gaps" - Learn what you need
- "Market trends?" - See hot skills and salaries
- "30-60-90 plan" - Your personalized roadmap
- "Interview prep" - Get ready for interviews
- "Project ideas" - Build your portfolio
- "How to use?" - Learn the platform

What would you like to know?`;
}

export {
  advancedChatbotResponses,
  generateAdvancedChatbotReply
};
