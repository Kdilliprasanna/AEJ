// Enhanced mock test questions for ARJ with daily rotation and difficulty levels
// Daily rotation ensures different questions each day of the week

export function getQuestionsForDate(date = new Date()) {
  // Get day of week (0-6) to select unique questions
  const dayOfWeek = date.getDay();
  const startIndex = (dayOfWeek * 5) % 50;
  return mockTestQuestionBank.slice(startIndex, startIndex + 5);
}

export const mockTestQuestionBank = [
  // ====== HR QUESTIONS (Easy, Medium, Hard) ======
  {
    id: 'hr-easy-1',
    category: 'HR',
    difficulty: 'Easy',
    question: 'Tell me about yourself in 2-3 minutes.',
    expectedKeywords: ['name', 'background', 'skills', 'goal'],
    hints: 'Start with your name, education, key skills, current role, and career goal.',
  },
  {
    id: 'hr-easy-2',
    category: 'HR',
    difficulty: 'Easy',
    question: 'Why are you interested in this role?',
    expectedKeywords: ['role', 'interest', 'skills', 'growth', 'company'],
    hints: 'Mention how your skills match the role and your career goals.',
  },
  {
    id: 'hr-medium-1',
    category: 'HR',
    difficulty: 'Medium',
    question: 'Describe a challenging situation you faced and how you handled it.',
    expectedKeywords: ['challenge', 'action', 'result', 'learned', 'overcame'],
    hints: 'Use STAR method: Situation, Task, Action, Result.',
  },
  {
    id: 'hr-medium-2',
    category: 'HR',
    difficulty: 'Medium',
    question: 'Tell me about a time you worked in a team and your contribution.',
    expectedKeywords: ['team', 'collaboration', 'contributed', 'result', 'learning'],
    hints: 'Highlight your specific role and measurable impact on the team.',
  },
  {
    id: 'hr-hard-1',
    category: 'HR',
    difficulty: 'Hard',
    question: 'How do you handle failure or rejection in your career?',
    expectedKeywords: ['failure', 'learned', 'improved', 'resilience', 'growth'],
    hints: 'Show emotional maturity and focus on lessons and improvement.',
  },
  {
    id: 'hr-hard-2',
    category: 'HR',
    difficulty: 'Hard',
    question: 'Where do you see yourself in 5 years? How does this role align?',
    expectedKeywords: ['career', 'growth', 'skills', 'leadership', 'alignment'],
    hints: 'Be specific about goals and show how this role is a step forward.',
  },

  // ====== TECHNICAL QUESTIONS (Easy, Medium, Hard) ======
  {
    id: 'tech-easy-1',
    category: 'Technical',
    difficulty: 'Easy',
    question: 'Explain what HTML, CSS, and JavaScript do in web development.',
    expectedKeywords: ['html', 'structure', 'css', 'styling', 'javascript', 'interactivity'],
    hints: 'HTML = structure, CSS = styling/design, JavaScript = interactivity/behavior.',
  },
  {
    id: 'tech-easy-2',
    category: 'Technical',
    difficulty: 'Easy',
    question: 'What is Git and why is it important for developers?',
    expectedKeywords: ['git', 'version control', 'collaboration', 'tracking', 'branches'],
    hints: 'Git tracks code changes, enables team collaboration, and maintains history.',
  },
  {
    id: 'tech-medium-1',
    category: 'Technical',
    difficulty: 'Medium',
    question: 'Describe the difference between relational and non-relational databases. Give one example each.',
    expectedKeywords: ['relational', 'sql', 'non-relational', 'nosql', 'mongodb', 'postgresql', 'structured'],
    hints: 'Relational (SQL): structured tables. Non-relational (NoSQL): flexible documents/keys.',
  },
  {
    id: 'tech-medium-2',
    category: 'Technical',
    difficulty: 'Medium',
    question: 'Explain what an API is and give a real-world example of how you used one.',
    expectedKeywords: ['api', 'interface', 'communication', 'request', 'response', 'data', 'example'],
    hints: 'API allows apps to communicate. E.g., Weather API returns weather data.',
  },
  {
    id: 'tech-hard-1',
    category: 'Technical',
    difficulty: 'Hard',
    question: 'Explain the concept of microservices vs monolithic architecture. When would you use each?',
    expectedKeywords: ['microservices', 'monolithic', 'scalability', 'independence', 'deployment', 'complexity'],
    hints: 'Monolithic = single unit (simple). Microservices = separate services (scalable but complex).',
  },
  {
    id: 'tech-hard-2',
    category: 'Technical',
    difficulty: 'Hard',
    question: 'Describe a project you built, including the problem, tech stack, your role, and the result.',
    expectedKeywords: ['problem', 'tech stack', 'role', 'developed', 'deployed', 'result', 'users', 'impact'],
    hints: 'Include: What problem did it solve? What technologies? What was your contribution? What was the outcome?',
  },

  // ====== COMMUNICATION QUESTIONS ======
  {
    id: 'comm-easy-1',
    category: 'Communication',
    difficulty: 'Easy',
    question: 'Describe a complex technical concept in simple terms for a non-technical person.',
    expectedKeywords: ['simple', 'analogy', 'clear', 'jargon-free', 'relatable'],
    hints: 'Use analogies, simple words, and avoid technical jargon.',
  },
  {
    id: 'comm-medium-1',
    category: 'Communication',
    difficulty: 'Medium',
    question: 'Tell me about a time you had to present your work or ideas to stakeholders.',
    expectedKeywords: ['presentation', 'stakeholders', 'clear', 'impact', 'feedback', 'result'],
    hints: 'Focus on clarity, preparation, and how you addressed concerns.',
  },
  {
    id: 'comm-hard-1',
    category: 'Communication',
    difficulty: 'Hard',
    question: 'How would you handle a disagreement with a senior colleague about the technical approach?',
    expectedKeywords: ['respect', 'listen', 'data-driven', 'discuss', 'solution', 'collaborative'],
    hints: 'Show respect for hierarchy while confidently presenting your data-driven perspective.',
  },

  // ====== APTITUDE QUESTIONS ======
  {
    id: 'aptitude-easy-1',
    category: 'Aptitude',
    difficulty: 'Easy',
    question: 'If a product costs 500 and has a 20% discount, what is the final price?',
    expectedKeywords: ['400', 'discount', 'calculation', 'percent'],
    hints: 'Discount = 500 * 20% = 100. Final price = 500 - 100 = 400.',
  },
  {
    id: 'aptitude-easy-2',
    category: 'Aptitude',
    difficulty: 'Easy',
    question: 'What is the next number in the sequence: 2, 4, 6, 8, ?',
    expectedKeywords: ['10', 'pattern', 'increment', 'sequence'],
    hints: 'Each number increases by 2. So next is 10.',
  },
  {
    id: 'aptitude-medium-1',
    category: 'Aptitude',
    difficulty: 'Medium',
    question: 'A test score improves from 60 to 78. What is the percentage increase?',
    expectedKeywords: ['30', 'percent', 'increase', 'calculation'],
    hints: 'Percentage increase = (78 - 60) / 60 * 100 = 18/60 * 100 = 30%.',
  },
  {
    id: 'aptitude-medium-2',
    category: 'Aptitude',
    difficulty: 'Medium',
    question: 'If 5 workers complete a task in 10 days, how many days will 10 workers take (same efficiency)?',
    expectedKeywords: ['5', 'days', 'inverse', 'workers', 'proportion'],
    hints: 'More workers = less time. 10 workers = 5 days (inverse proportion).',
  },
  {
    id: 'aptitude-hard-1',
    category: 'Aptitude',
    difficulty: 'Hard',
    question: "A company's revenue grows by 15% annually. Starting revenue is 10 lakhs. What will it be in 3 years?",
    expectedKeywords: ['compound', 'growth', 'calculation', 'lakhs', 'multiplier'],
    hints: 'Use compound growth: Final = 10 * (1.15)^3 ≈ 15.2 lakhs.',
  },

  // ====== ROLE-SPECIFIC QUESTIONS (Frontend) ======
  {
    id: 'role-frontend-easy-1',
    category: 'Role-specific',
    difficulty: 'Easy',
    question: 'What is the difference between margin and padding in CSS?',
    expectedKeywords: ['margin', 'outside', 'padding', 'inside', 'space', 'border'],
    hints: 'Margin = space outside an element. Padding = space inside an element.',
  },
  {
    id: 'role-frontend-medium-1',
    category: 'Role-specific',
    difficulty: 'Medium',
    question: 'What is responsive design? Why is it important?',
    expectedKeywords: ['responsive', 'mobile', 'flexible', 'user experience', 'devices', 'media query'],
    hints: 'Design adapts to different screen sizes. Important for mobile users (majority).',
  },
  {
    id: 'role-frontend-hard-1',
    category: 'Role-specific',
    difficulty: 'Hard',
    question: 'Explain React hooks like useState and useEffect, and when you would use each.',
    expectedKeywords: ['useState', 'state', 'useEffect', 'side effects', 'lifecycle', 'dependencies'],
    hints: 'useState = manage state. useEffect = handle side effects (API calls, subscriptions).',
  },

  // ====== ROLE-SPECIFIC QUESTIONS (Backend) ======
  {
    id: 'role-backend-easy-1',
    category: 'Role-specific',
    difficulty: 'Easy',
    question: 'What is a REST API and what HTTP methods are commonly used?',
    expectedKeywords: ['rest', 'api', 'http', 'get', 'post', 'put', 'delete'],
    hints: 'REST = Representational State Transfer. GET (read), POST (create), PUT (update), DELETE (delete).',
  },
  {
    id: 'role-backend-medium-1',
    category: 'Role-specific',
    difficulty: 'Medium',
    question: 'Explain database normalization and why it matters.',
    expectedKeywords: ['normalization', 'redundancy', 'efficiency', 'relationships', 'first normal form', 'second normal form'],
    hints: 'Reduces data redundancy, improves efficiency, and maintains data integrity.',
  },
  {
    id: 'role-backend-hard-1',
    category: 'Role-specific',
    difficulty: 'Hard',
    question: 'How would you optimize a slow database query that retrieves millions of records?',
    expectedKeywords: ['indexing', 'query optimization', 'caching', 'pagination', 'filtering', 'analysis'],
    hints: 'Use indexes, optimize queries, add caching, implement pagination, and analyze execution plans.',
  },

  // ====== ROLE-SPECIFIC QUESTIONS (Data) ======
  {
    id: 'role-data-easy-1',
    category: 'Role-specific',
    difficulty: 'Easy',
    question: 'What is the difference between mean, median, and mode?',
    expectedKeywords: ['mean', 'average', 'median', 'middle', 'mode', 'frequent'],
    hints: 'Mean = average. Median = middle value. Mode = most frequent value.',
  },
  {
    id: 'role-data-medium-1',
    category: 'Role-specific',
    difficulty: 'Medium',
    question: 'How do you identify and handle outliers in a dataset?',
    expectedKeywords: ['outliers', 'detection', 'iqr', 'z-score', 'removal', 'business context'],
    hints: 'Use IQR (Interquartile Range) or Z-score. Investigate before removing; they may be valuable.',
  },
  {
    id: 'role-data-hard-1',
    category: 'Role-specific',
    difficulty: 'Hard',
    question: 'Explain the concept of statistical significance and when you would use it in analysis.',
    expectedKeywords: ['significance', 'p-value', 'hypothesis', 'confidence', 'reliable', 'chance'],
    hints: 'Determines if results are due to real effect or chance. P-value < 0.05 is typically significant.',
  },

  // ====== ROLE-SPECIFIC QUESTIONS (Product Manager) ======
  {
    id: 'role-pm-easy-1',
    category: 'Role-specific',
    difficulty: 'Easy',
    question: 'What is a product roadmap and why is it important?',
    expectedKeywords: ['roadmap', 'strategy', 'priorities', 'timeline', 'stakeholders', 'vision'],
    hints: 'Roadmap = strategic plan showing features, priorities, and timeline for stakeholders alignment.',
  },
  {
    id: 'role-pm-medium-1',
    category: 'Role-specific',
    difficulty: 'Medium',
    question: 'How do you prioritize features for a product? What frameworks would you use?',
    expectedKeywords: ['prioritization', 'impact', 'effort', 'moscow', 'weighted scoring', 'user value'],
    hints: 'Use MOSCOW (Must/Should/Could/Won\'t), impact-effort matrix, or weighted scoring.',
  },
  {
    id: 'role-pm-hard-1',
    category: 'Role-specific',
    difficulty: 'Hard',
    question: 'How would you measure if a feature launch was successful?',
    expectedKeywords: ['metrics', 'kpi', 'adoption', 'engagement', 'retention', 'revenue', 'hypothesis'],
    hints: 'Define KPIs (adoption rate, engagement, retention, revenue impact) before launch.',
  },
];

export function getRandomQuestions(profile = {}, count = 5) {
  // Daily rotation: same questions each day for each user
  const today = new Date().toISOString().slice(0, 10);
  const seed = today + (profile.userId || 'demo');
  
  // Simple hash function for deterministic random selection
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Mix of difficulties
  const difficulties = ['Easy', 'Easy', 'Medium', 'Medium', 'Hard'];
  const questions = [];

  difficulties.forEach((difficulty) => {
    const filtered = mockTestQuestionBank.filter((q) => q.difficulty === difficulty);
    if (filtered.length === 0) return;

    const index = (Math.abs(hash) + questions.length) % filtered.length;
    questions.push(filtered[index]);
  });

  return questions.slice(0, count);
}

export function evaluateMockTestEnhanced(questions, answers = {}) {
  const feedback = [];
  let total = 0;

  questions.forEach((item) => {
    const answer = (answers[item.id] || '').trim().toLowerCase();
    
    // Scoring breakdown
    const length = answer.split(/\s+/).filter(Boolean).length;
    const lengthScore = length < 20 ? 10 : length < 50 ? 30 : length < 100 ? 50 : 70;

    const keywordMatches = item.expectedKeywords.filter(
      (keyword) => answer.includes(keyword.toLowerCase())
    ).length;
    const keywordScore = (keywordMatches / Math.max(item.expectedKeywords.length, 1)) * 20;

    const structure =
      /because|for example|result|therefore|first|then|next|finally|action|outcome/.test(answer) ? 10 : 0;

    const score = Math.round(lengthScore + keywordScore + structure);
    const clamped = Math.max(0, Math.min(100, score));
    total += clamped;

    const note =
      clamped >= 80
        ? 'Excellent! Well-structured and comprehensive answer.'
        : clamped >= 60
          ? 'Good foundation. Add more specific examples or measurable results.'
          : clamped >= 40
            ? 'Decent attempt. Expand with concrete examples and key concepts.'
            : 'Needs improvement. Use the hint and add specific, detailed examples.';

    feedback.push({
      questionId: item.id,
      category: item.category,
      difficulty: item.difficulty,
      score: clamped,
      note,
      hint: item.hints,
    });
  });

  const averageScore = Math.round(total / Math.max(questions.length, 1));

  return {
    score: averageScore,
    feedback,
    dailyKey: new Date().toISOString().slice(0, 10),
  };
}

export default mockTestQuestionBank;
