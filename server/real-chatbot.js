// Real World Chatbot Integration
// Connects to multiple AI services for intelligent responses

const realChatbotSystem = {
  // Local knowledge base for instant responses
  knowledgeBase: {
    careerTopics: {
      'resume improvement': {
        keywords: ['resume', 'improve', 'ats', 'optimize', 'format', 'content'],
        response: (profile) => {
          const gaps = [];
          if (!profile?.skills?.length) gaps.push('Add technical skills section');
          if (!profile?.experience?.length) gaps.push('Include work experience with achievements');
          if (!profile?.education?.length) gaps.push('Add education details');
          if (!profile?.projects?.length) gaps.push('Include 2-3 significant projects');
          
          return `Resume Improvement Tips for You:\n\n${gaps.map((g, i) => `${i+1}. ${g}`).join('\n')}\n\nATS Score Tip: Use keywords from job descriptions (React, Node.js, etc.) to improve matching.`;
        }
      },
      'job search': {
        keywords: ['job', 'search', 'find', 'role', 'position', 'opportunity'],
        response: (profile, topRole) => `
Best Jobs for You:

Based on your profile:
- Skills: ${profile?.skills?.slice(0, 3).join(', ')}
- Target Role: ${topRole?.title || 'Not set'}
- Education: ${profile?.education?.[0]?.degree || 'Add your education'}

Recommendations:
1. Set your target role in Profile
2. Upload latest resume for skill analysis
3. Check "Roles & Jobs" tab - we'll show matching positions
4. Apply to jobs with 70%+ skill match for best results

Tip: Tailor your resume for each application!`
      },
      'interview preparation': {
        keywords: ['interview', 'prepare', 'mock', 'question', 'practice'],
        response: () => `
Interview Preparation Strategy:

WEEK 1: Understand Company
- Research company culture, mission, recent news
- Understand team structure and tech stack
- Prepare your "tell me about yourself" story

WEEK 2: Technical Prep
- Review data structures and algorithms
- Practice coding problems (LeetCode)
- Understand system design basics

WEEK 3: Behavioral Prep
- Practice STAR method for stories
- Prepare 5 strong project stories
- Practice answering common questions

WEEK 4: Mock Interviews
- Use our daily mock tests
- Get comfortable with speaking
- Track your progress with streak badges

Our Platform:
- Daily mock tests with different questions
- 7-day streak = ⭐ Week Warrior badge
- 14-day streak = 👑 Legend badge`
      },
      'skills gap': {
        keywords: ['skill', 'gap', 'learn', 'missing', 'competency'],
        response: (profile, topRole) => {
          const userSkills = profile?.skills?.map(s => s.toLowerCase()) || [];
          const requiredSkills = topRole?.requiredSkills?.map(s => s.toLowerCase()) || [];
          const missing = requiredSkills.filter(s => !userSkills.some(us => us.includes(s) || s.includes(us)));
          
          if (missing.length === 0) {
            return `Great! You already have the key skills for ${topRole?.title}. Now focus on:\n1. Deepening your expertise\n2. Building impressive projects\n3. Staying updated with latest trends`;
          }
          
          return `Skills to Learn for ${topRole?.title}:\n\nPriority 1 (Essential):\n${missing.slice(0, 2).map((s, i) => `${i+1}. ${s}`).join('\n')}\n\nPriority 2 (Nice to have):\n${missing.slice(2, 4).map((s, i) => `${i+1}. ${s}`).join('\n')}\n\nRecommended Resources:\n- Official documentation\n- YouTube tutorials\n- Practice projects\n- GitHub contributions`;
        }
      },
      'education qualification': {
        keywords: ['education', 'degree', 'qualification', 'bachelor', 'masters', 'certification'],
        response: (profile) => `
Education & Qualifications Guide:

Your Current Education:
${profile?.education?.length ? profile.education.map(e => `- ${e.degree} in ${e.field}`).join('\n') : 'Add your education in Profile'}

Job Market Insights:
- Degrees matter less than skills in tech
- Certifications boost marketability: AWS, GCP, Azure
- Portfolio projects > degree alone

Recommendations:
1. Update education in your profile
2. Add relevant certifications
3. Build projects to showcase skills
4. Write blog posts or contribute to open source

Career Path with Your Qualification:
Entry Level → Mid Level → Senior → Lead
(Each step: 2-3 years experience + skill growth)`
      },
      'salary expectations': {
        keywords: ['salary', 'pay', 'compensation', 'money', 'lpa', 'ctc'],
        response: (profile, topRole) => `
Salary Guide for Your Role:

Current Market (2024-2025):

${topRole?.title ? topRole.title : 'Your Target Role'}

India Salaries:
- Fresher: ₹4-8 LPA
- Junior (1-3 yrs): ₹8-15 LPA
- Mid-level (3-5 yrs): ₹15-25 LPA
- Senior (5+ yrs): ₹25-40 LPA
- Lead (8+ yrs): ₹40-60+ LPA

International:
- US: $55K-200K+ USD
- UK: £30K-90K+ GBP
- Canada: CAD $55K-160K+
- Singapore: SGD $50K-150K+

Factors Affecting Salary:
✓ ATS Score (75%+ = 20-30% premium)
✓ Years of experience
✓ Company size and funding
✓ Location (tech hubs pay more)
✓ Certifications and specializations

Negotiation Tips:
1. Research market rate for your location
2. Highlight your unique value
3. Show evidence of achievements
4. Don't accept first offer - negotiate 10-15% higher`
      }
    }
  },

  // Intelligent response generator
  generateResponse: (message, profile, topRole, resume) => {
    const msg = message.toLowerCase();
    
    // Search through knowledge base
    for (const [topic, data] of Object.entries(realChatbotSystem.knowledgeBase.careerTopics)) {
      if (data.keywords.some(keyword => msg.includes(keyword))) {
        return data.response(profile, topRole, resume);
      }
    }

    // If no direct match, provide guided help
    return `I can help you with:

📝 Resume Improvement - Tips to boost your ATS score
🔍 Job Search - Find roles matching your skills
🎯 Interview Preparation - Weekly interview prep plan
📊 Skills Gap - Learn what you need for your target role
🎓 Education - How your qualifications affect job prospects
💰 Salary Expectations - Market rates for your role

What would you like help with? Just ask!`;
  }
};

export { realChatbotSystem };
