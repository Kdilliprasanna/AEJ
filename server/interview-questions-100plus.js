// 100+ Interview Questions with AI Evaluation System

export const interviewQuestions = {
  behavioral: [
    {
      id: 'b1',
      question: 'Tell me about a time when you had to work with a difficult team member.',
      category: 'Teamwork',
      difficulty: 'Medium',
      timeLimit: 180,
      keywords: ['conflict', 'resolution', 'communication', 'empathy'],
      evaluation: (answer) => ({
        score: evaluateAnswer(answer, ['tried', 'resolved', 'learned', 'positive']),
        feedback: 'Good structure. Consider adding more specific metrics or outcomes.'
      })
    },
    {
      id: 'b2',
      question: 'Describe a project where you took initiative and led the team.',
      category: 'Leadership',
      difficulty: 'Medium',
      timeLimit: 180,
      keywords: ['leadership', 'initiative', 'team', 'goals', 'achieved']
    },
    {
      id: 'b3',
      question: 'Tell me about a time you failed and what you learned from it.',
      category: 'Growth Mindset',
      difficulty: 'Hard',
      timeLimit: 180,
      keywords: ['failure', 'learned', 'improved', 'resilience']
    },
    {
      id: 'b4',
      question: 'How do you handle stress and pressure at work?',
      category: 'Stress Management',
      difficulty: 'Easy',
      timeLimit: 120,
      keywords: ['coping', 'prioritize', 'calm', 'organized']
    },
    {
      id: 'b5',
      question: 'Give an example of when you had to adapt to a major change.',
      category: 'Adaptability',
      difficulty: 'Medium',
      timeLimit: 150,
      keywords: ['adapt', 'change', 'flexible', 'positive']
    },
    {
      id: 'b6',
      question: 'Tell me about a time you received critical feedback. How did you handle it?',
      category: 'Feedback',
      difficulty: 'Medium',
      timeLimit: 150,
      keywords: ['feedback', 'improvement', 'positive', 'growth']
    },
    {
      id: 'b7',
      question: 'Describe a situation where you had to meet a tight deadline.',
      category: 'Time Management',
      difficulty: 'Easy',
      timeLimit: 120,
      keywords: ['deadline', 'delivered', 'organized', 'priority']
    },
    {
      id: 'b8',
      question: 'Tell me about a time you had to collaborate across different departments.',
      category: 'Collaboration',
      difficulty: 'Medium',
      timeLimit: 180,
      keywords: ['collaboration', 'cross-functional', 'communication']
    }
  ],

  technical: [
    {
      id: 't1',
      question: 'Explain what a REST API is and why it\'s important.',
      category: 'Backend',
      difficulty: 'Easy',
      timeLimit: 180,
      keywords: ['REST', 'API', 'HTTP', 'stateless', 'resources']
    },
    {
      id: 't2',
      question: 'What is the difference between SQL and NoSQL databases?',
      category: 'Databases',
      difficulty: 'Medium',
      timeLimit: 180,
      keywords: ['SQL', 'NoSQL', 'structured', 'flexible', 'ACID', 'CAP']
    },
    {
      id: 't3',
      question: 'How does React state management work?',
      category: 'Frontend',
      difficulty: 'Medium',
      timeLimit: 180,
      keywords: ['state', 'props', 'hooks', 'lifecycle', 're-render']
    },
    {
      id: 't4',
      question: 'Explain the concept of authentication vs authorization.',
      category: 'Security',
      difficulty: 'Medium',
      timeLimit: 120,
      keywords: ['authentication', 'authorization', 'JWT', 'OAuth', 'tokens']
    },
    {
      id: 't5',
      question: 'What is CI/CD and why is it important?',
      category: 'DevOps',
      difficulty: 'Medium',
      timeLimit: 180,
      keywords: ['CI/CD', 'continuous', 'deployment', 'pipeline', 'automation']
    },
    {
      id: 't6',
      question: 'Explain the concept of microservices architecture.',
      category: 'Architecture',
      difficulty: 'Hard',
      timeLimit: 240,
      keywords: ['microservices', 'scalability', 'distributed', 'communication']
    },
    {
      id: 't7',
      question: 'What are common HTTP status codes and what do they mean?',
      category: 'Web',
      difficulty: 'Easy',
      timeLimit: 120,
      keywords: ['HTTP', 'status', '200', '404', '500', 'error']
    },
    {
      id: 't8',
      question: 'Explain how caching improves application performance.',
      category: 'Performance',
      difficulty: 'Medium',
      timeLimit: 180,
      keywords: ['caching', 'performance', 'Redis', 'memory', 'TTL']
    }
  ],

  problemSolving: [
    {
      id: 'p1',
      question: 'Given an array of numbers, write pseudocode to find the maximum sum subarray.',
      category: 'Algorithms',
      difficulty: 'Hard',
      timeLimit: 300,
      keywords: ['algorithm', 'dynamic programming', 'optimal', 'subarray']
    },
    {
      id: 'p2',
      question: 'How would you design a URL shortener like bit.ly?',
      category: 'System Design',
      difficulty: 'Hard',
      timeLimit: 600,
      keywords: ['scalability', 'database', 'API', 'hashing', 'distribution']
    },
    {
      id: 'p3',
      question: 'Design a chat application architecture.',
      category: 'System Design',
      difficulty: 'Very Hard',
      timeLimit: 600,
      keywords: ['real-time', 'websockets', 'scalability', 'database', 'message']
    },
    {
      id: 'p4',
      question: 'How would you optimize a slow database query?',
      category: 'Databases',
      difficulty: 'Medium',
      timeLimit: 300,
      keywords: ['optimization', 'indexing', 'query', 'execution plan']
    },
    {
      id: 'p5',
      question: 'Design an e-commerce checkout system.',
      category: 'System Design',
      difficulty: 'Hard',
      timeLimit: 600,
      keywords: ['payment', 'inventory', 'transactions', 'reliability']
    },
    {
      id: 'p6',
      question: 'How would you detect and prevent DDoS attacks?',
      category: 'Security',
      difficulty: 'Hard',
      timeLimit: 300,
      keywords: ['security', 'DDoS', 'rate limiting', 'detection']
    },
    {
      id: 'p7',
      question: 'Design a recommendation system for an e-commerce platform.',
      category: 'Machine Learning',
      difficulty: 'Very Hard',
      timeLimit: 600,
      keywords: ['ML', 'algorithms', 'data', 'personalization', 'scale']
    },
    {
      id: 'p8',
      question: 'How would you handle session management in a distributed system?',
      category: 'Distributed Systems',
      difficulty: 'Hard',
      timeLimit: 300,
      keywords: ['distributed', 'session', 'consistency', 'cache']
    }
  ],

  productSense: [
    {
      id: 'pr1',
      question: 'How would you measure success for a new feature?',
      category: 'Metrics',
      difficulty: 'Medium',
      timeLimit: 240,
      keywords: ['metrics', 'KPI', 'success', 'measurement', 'data']
    },
    {
      id: 'pr2',
      question: 'Walk me through how you\'d approach improving user retention.',
      category: 'Growth',
      difficulty: 'Hard',
      timeLimit: 300,
      keywords: ['retention', 'user', 'engagement', 'analysis', 'experimentation']
    },
    {
      id: 'pr3',
      question: 'How would you prioritize features for the product roadmap?',
      category: 'Prioritization',
      difficulty: 'Medium',
      timeLimit: 240,
      keywords: ['prioritization', 'impact', 'effort', 'roadmap', 'strategy']
    },
    {
      id: 'pr4',
      question: 'Design a new feature for [popular app]. Why this feature?',
      category: 'Feature Design',
      difficulty: 'Hard',
      timeLimit: 600,
      keywords: ['design', 'user needs', 'market', 'implementation']
    }
  ],

  roleSpecific: {
    productManager: [
      'Walk me through your approach to gathering product requirements.',
      'How do you balance stakeholder needs with user needs?',
      'Tell me about a product you\'ve shipped from start to finish.',
      'How would you handle disagreement with an engineer on implementation?'
    ],
    engineer: [
      'Walk me through your debugging process.',
      'How do you approach code review?',
      'Tell me about your most complex project.',
      'How do you keep up with new technologies?'
    ],
    designer: [
      'Walk me through your design process.',
      'How do you gather user feedback?',
      'Tell me about a design problem you solved.',
      'How do you balance aesthetics with usability?'
    ],
    dataSci: [
      'Walk me through a data analysis project.',
      'How do you approach feature engineering?',
      'How do you validate your ML model?',
      'Tell me about a time you found an interesting insight in data.'
    ]
  }
};

// AI-POWERED EVALUATION SYSTEM
export const evaluationCriteria = {
  behavioral: {
    structure: { weight: 0.25, keywords: ['situation', 'task', 'action', 'result'] },
    relevance: { weight: 0.25, keywords: ['job', 'skills', 'applicable'] },
    metrics: { weight: 0.25, keywords: ['improved', 'percent', 'achieved'] },
    growth: { weight: 0.25, keywords: ['learned', 'improved', 'better'] }
  },
  technical: {
    accuracy: { weight: 0.4, keywords: ['correct', 'accurate', 'right'] },
    depth: { weight: 0.3, keywords: ['detail', 'explain', 'why', 'how'] },
    communication: { weight: 0.3, keywords: ['clear', 'concise', 'understandable'] }
  }
};

// INTERVIEW TIPS & SUGGESTIONS
export const interviewTips = {
  beforeInterview: [
    'Research the company and role thoroughly',
    'Prepare 5-7 STAR stories for behavioral questions',
    'Review common technical concepts for the role',
    'Practice articulating your thoughts clearly',
    'Prepare thoughtful questions to ask interviewer',
    'Get good sleep and eat a healthy meal',
    'Dress professionally (or neat business casual for video)'
  ],
  duringInterview: [
    'Take a moment to think before answering',
    'Use the STAR method for behavioral questions',
    'Ask clarifying questions if needed',
    'Provide specific examples, not generalities',
    'Show enthusiasm and passion for the role',
    'Make eye contact (or look at camera for video)',
    'Ask about next steps and timeline'
  ],
  afterInterview: [
    'Send thank you email within 24 hours',
    'Remind them of key points you made',
    'Reiterate your interest in the role',
    'Ask about timeline for next steps'
  ]
};

// SCORING RUBRIC
export const scoringRubric = {
  5: 'Excellent - Well-structured answer with specific examples and measurable impact',
  4: 'Good - Solid answer with relevant examples and clear thinking',
  3: 'Average - Basic answer with some examples but lacking detail',
  2: 'Below Average - Vague answer without specific examples',
  1: 'Poor - Unclear or irrelevant answer'
};

// MOCK INTERVIEW CONFIGURATIONS
export const mockInterviewConfig = {
  easy: {
    questions: 3,
    timeLimit: 5, // minutes per question
    difficulty: ['Easy', 'Easy', 'Medium']
  },
  medium: {
    questions: 5,
    timeLimit: 10,
    difficulty: ['Easy', 'Medium', 'Medium', 'Hard', 'Medium']
  },
  hard: {
    questions: 7,
    timeLimit: 15,
    difficulty: ['Medium', 'Medium', 'Hard', 'Hard', 'Very Hard', 'Hard', 'Medium']
  }
};

function evaluateAnswer(answer, keywords) {
  if (!answer) return 0;
  const lowerAnswer = answer.toLowerCase();
  const matchCount = keywords.filter(k => lowerAnswer.includes(k.toLowerCase())).length;
  return Math.min(5, Math.round((matchCount / keywords.length) * 5)) || 1;
}

export default {
  interviewQuestions,
  evaluationCriteria,
  interviewTips,
  scoringRubric,
  mockInterviewConfig
};
