/**
 * CAREER AI (ARJ) — PRODUCTION-GRADE AI PROVIDER SERVICE
 * Centralized server-side AI provider with OpenAI API integration,
 * prompt injection protection, request timeout handling, and fallback resilience.
 */

const safeDate = () => new Date().toISOString();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const REQUEST_TIMEOUT_MS = 15000;

export function isRealAiConfigured() {
  return Boolean(OPENAI_API_KEY && OPENAI_API_KEY.startsWith('sk-'));
}

export function getAiProviderStatus() {
  return {
    activeProvider: isRealAiConfigured() ? 'OpenAI GPT (Production)' : 'Contextual AI Engine (Fallback)',
    model: isRealAiConfigured() ? OPENAI_MODEL : 'internal-contextual-v2',
    configured: isRealAiConfigured(),
    timeoutMs: REQUEST_TIMEOUT_MS
  };
}

/**
 * Sanitizes user input against prompt injection attacks & secret leakage
 */
export function sanitizeInput(input) {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/\[IGNORE\s+SYSTEM\s+INSTRUCTIONS?\]/gi, '[filtered]')
    .replace(/\[DISREGARD\s+PREVIOUS\s+INSTRUCTIONS?\]/gi, '[filtered]')
    .replace(/(system:|developer:|assistant:)/gi, '$1')
    .replace(/(password|jwt_secret|bearer\s+[a-z0-9._-]+)/gi, '[redacted_secret]')
    .trim();
}

/**
 * Low-level OpenAI API call handler with timeout & retry protection
 */
async function callOpenAI(systemPrompt, userPrompt, isJson = false) {
  if (!isRealAiConfigured()) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const cleanSystem = sanitizeInput(systemPrompt);
  const cleanUser = sanitizeInput(userPrompt);

  const payload = {
    model: OPENAI_MODEL,
    messages: [
      { role: 'system', content: cleanSystem },
      { role: 'user', content: cleanUser }
    ],
    temperature: 0.7,
    max_tokens: 1500,
    ...(isJson ? { response_format: { type: 'json_object' } } : {})
  };

  let attempts = 0;
  while (attempts < 2) {
    attempts++;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`OpenAI API returned status ${response.status}: ${errorText.substring(0, 200)}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      return content;
    } catch (err) {
      clearTimeout(timer);
      if (attempts >= 2) {
        console.warn(`⚠️ OpenAI call failed after ${attempts} attempts (${err.message}). Falling back to Contextual Engine.`);
        throw err;
      }
    }
  }
}

// ============================================================================
// AI FEATURE PROVIDER METHODS (WITH CONTEXTUAL ENGINE FALLBACKS)
// ============================================================================

/**
 * 1. AI CAREER COACH CHATBOT
 */
export async function generateChatbotReply(message, profile = {}, targetRole = null) {
  const cleanMsg = sanitizeInput(message);
  
  if (isRealAiConfigured()) {
    try {
      const systemPrompt = `You are ARJ AI Career Coach, a professional, encouraging career advisor.
User Profile: Name: ${profile.name || 'Candidate'}, Target Role: ${profile.targetRole || targetRole?.title || 'Tech Professional'}, Skills: ${(profile.skills || []).join(', ')}.
Provide direct, actionable career advice. Keep responses under 250 words.`;
      
      const reply = await callOpenAI(systemPrompt, cleanMsg);
      if (reply && reply.length > 10) {
        return reply;
      }
    } catch (e) {
      // Fallback
    }
  }

  // Fallback Contextual Engine
  return generateContextualChatFallback(cleanMsg, profile, targetRole);
}

function generateContextualChatFallback(message, profile, targetRole) {
  const lowerMsg = message.toLowerCase();
  const name = profile?.name || 'Candidate';
  const role = profile?.targetRole || targetRole?.title || 'your target role';
  const skills = profile?.skills || ['Software Engineering', 'System Design'];

  if (lowerMsg.includes('resume') || lowerMsg.includes('cv')) {
    return `Hello ${name}! For ${role}, your resume should prominently feature top skills like ${skills.slice(0, 3).join(', ')}. Ensure every bullet point starts with an action verb and quantifies impact (e.g. 'Improved API response speed by 35%').`;
  }
  if (lowerMsg.includes('interview') || lowerMsg.includes('prepare')) {
    return `Great question! When interviewing for ${role}, prepare 3-4 STAR stories (Situation, Task, Action, Result). Highlight how you applied ${skills[0] || 'core technical skills'} to solve complex challenges.`;
  }
  if (lowerMsg.includes('salary') || lowerMsg.includes('negotiate')) {
    return `Salary negotiation for ${role} requires data. Research market benchmarks on Glassdoor/LinkedIn, emphasize your key skills in ${skills.slice(0, 2).join(' & ')}, and always negotiate total compensation including benefits.`;
  }
  return `As your AI Career Coach for ${role}, I recommend focusing on mastering ${skills.slice(0, 2).join(' & ')}, building portfolio projects, and applying daily using our Job Matcher! What specific challenge can I help you with today?`;
}

/**
 * 2. AI COVER LETTER GENERATOR
 */
export async function generateCoverLetterAi({ role, company, profile = {}, jobDescription = '' }) {
  if (isRealAiConfigured()) {
    try {
      const systemPrompt = `You are an expert executive cover letter writer. Output a compelling 3-paragraph professional cover letter without markdown wrappers.`;
      const userPrompt = `Role: ${role}\nCompany: ${company}\nApplicant: ${profile.name || 'Candidate'}\nSkills: ${(profile.skills || []).join(', ')}\nJob Description snippet: ${jobDescription.substring(0, 400)}`;

      const letter = await callOpenAI(systemPrompt, userPrompt);
      if (letter && letter.length > 50) {
        return letter;
      }
    } catch (e) {
      // Fallback
    }
  }

  // Contextual Engine Fallback
  return `Dear Hiring Manager at ${company},

I am writing to express my strong interest in the ${role} position. With my background in ${(profile.skills || ['technology', 'software development']).slice(0, 3).join(', ')} and proven track record of solving technical challenges, I am confident in my ability to deliver immediate value to ${company}.

Throughout my career, I have focused on building scalable, reliable solutions and continuously sharpening my skills. My experience aligns closely with your team's goal of engineering modern, high-impact products.

I would welcome the opportunity to discuss how my technical expertise and enthusiasm align with the goals of ${company}. Thank you for your time and consideration.

Sincerely,
${profile.name || 'Candidate'}`;
}

/**
 * 3. AI STAR METHOD EVALUATOR
 */
export async function evaluateStarMethodAi({ situation, task, action, result, role = 'Software Engineer' }) {
  if (isRealAiConfigured()) {
    try {
      const systemPrompt = `You are a Senior Technical Interviewer. Analyze the STAR interview response and output JSON with keys: score (number 0-100), feedback (string), strengths (array of strings), improvements (array of strings).`;
      const userPrompt = `Target Role: ${role}\nSituation: ${situation}\nTask: ${task}\nAction: ${action}\nResult: ${result}`;

      const rawJson = await callOpenAI(systemPrompt, userPrompt, true);
      const parsed = JSON.parse(rawJson);
      if (parsed && typeof parsed.score === 'number') {
        return {
          score: Math.min(100, Math.max(0, parsed.score)),
          feedback: parsed.feedback || 'Good structure.',
          strengths: parsed.strengths || ['Clear situation description'],
          improvements: parsed.improvements || ['Quantify final metric impact']
        };
      }
    } catch (e) {
      // Fallback
    }
  }

  // Contextual Fallback
  const score = Math.min(95, 60 + (action.length > 40 ? 15 : 5) + (result.length > 20 ? 15 : 5));
  return {
    score,
    feedback: `Solid STAR presentation for ${role}. Ensure your Result section explicitly includes measurable metrics (e.g., % improvement, revenue saved).`,
    strengths: ['Clear action steps taken', 'Structured narrative format'],
    improvements: ['Include quantifiable metrics in result', 'Highlight team collaboration']
  };
}

/**
 * 4. AI JOB APPLICATION COPILOT ANALYSIS
 */
export async function analyzeJobCopilotAi({ jobTitle, company, jobDescription, profile = {}, resumeText = '' }) {
  if (isRealAiConfigured()) {
    try {
      const systemPrompt = `You are Career AI Application Copilot. Analyze candidate fit for a job. Output JSON with keys: matchScore (number 0-100), keyStrengths (array of strings), missingSkills (array of strings), resumeTips (array of strings), coverLetterDraft (string).`;
      const userPrompt = `Job: ${jobTitle} at ${company}\nJob Description: ${jobDescription.substring(0, 500)}\nProfile Skills: ${(profile.skills || []).join(', ')}\nResume snippet: ${resumeText.substring(0, 400)}`;

      const rawJson = await callOpenAI(systemPrompt, userPrompt, true);
      const parsed = JSON.parse(rawJson);
      if (parsed && typeof parsed.matchScore === 'number') {
        return parsed;
      }
    } catch (e) {
      // Fallback
    }
  }

  // Contextual Fallback Calculation
  const candSkills = (profile.skills || []).map(s => String(s).toLowerCase());
  const reqSkills = ['React', 'Node.js', 'PostgreSQL', 'System Design', 'Git', 'REST API'];
  const matching = reqSkills.filter(s => candSkills.includes(s.toLowerCase()) || jobDescription.toLowerCase().includes(s.toLowerCase()));
  const missing = reqSkills.filter(s => !matching.includes(s));
  const score = Math.min(96, Math.max(55, matching.length * 12 + 45));

  return {
    matchScore: score,
    matchingSkills: matching,
    missingSkills: missing,
    keyStrengths: matching.length > 0 ? [`Demonstrated alignment in ${matching.slice(0, 2).join(', ')}`] : ['Relevant background'],
    resumeTips: [
      `Feature top keywords like ${reqSkills.slice(0, 3).join(', ')} near the summary header.`,
      `Quantify technical outcomes achieved using ${matching[0] || 'core skills'}.`
    ],
    coverLetterDraft: `I am writing to express my enthusiasm for the ${jobTitle} position at ${company}. My expertise in ${matching.slice(0, 3).join(', ') || 'software engineering'} aligns strongly with your team's goals.`
  };
}

/**
 * 5. AI LIVE INTERVIEWER — QUESTION GENERATOR & FOLLOW-UP STREAM
 */
export async function generateLiveInterviewQuestion({ role = 'Software Engineer', difficulty = 'Mid-Level', turnIndex = 0, previousTurns = [], resumeText = '', jobDescription = '' }) {
  if (isRealAiConfigured()) {
    try {
      const systemPrompt = `You are a Lead Hiring Manager interviewing a candidate for a ${difficulty} ${role} position. Generate the next realistic interview question.
Consider candidate resume snippet: "${resumeText.substring(0, 300)}" and job description snippet: "${jobDescription.substring(0, 300)}".
If turnIndex > 0, ask an insightful follow-up question based on candidate's previous response. Output JSON: { "question": string, "category": string, "expectedKeywords": array of strings }.`;

      const userPrompt = `Turn: ${turnIndex + 1}\nPrevious turns: ${JSON.stringify(previousTurns.slice(-2))}`;
      const rawJson = await callOpenAI(systemPrompt, userPrompt, true);
      const parsed = JSON.parse(rawJson);
      if (parsed && parsed.question) {
        return parsed;
      }
    } catch (e) {
      // Fallback
    }
  }

  // Contextual Engine Questions Generator
  const bank = [
    {
      question: `Welcome to the ${difficulty} ${role} interview! To start off, tell me about a complex project you recently worked on that best demonstrates your technical skills.`,
      category: 'Behavioral & Experience',
      expectedKeywords: ['architecture', 'impact', 'challenges', 'results']
    },
    {
      question: `In your role as a ${role}, how do you ensure high code quality, system scalability, and robust error handling under tight deadlines?`,
      category: 'Technical Best Practices',
      expectedKeywords: ['testing', 'scalability', 'code review', 'monitoring']
    },
    {
      question: `Tell me about a situation where you encountered a major production bug or system failure. How did you diagnose, resolve, and prevent it from recurring?`,
      category: 'Problem Solving & Incident Response',
      expectedKeywords: ['debugging', 'root cause', 'post-mortem', 'monitoring']
    },
    {
      question: `How do you handle disagreements with engineering teammates or product managers regarding technical architecture trade-offs?`,
      category: 'Communication & Collaboration',
      expectedKeywords: ['collaboration', 'trade-offs', 'alignment', 'data-driven']
    },
    {
      question: `Looking back at your recent work, what technical decision would you make differently today, and what did you learn from that experience?`,
      category: 'Growth & Reflection',
      expectedKeywords: ['reflection', 'learnings', 'refATOR', 'architecture']
    }
  ];

  if (turnIndex < bank.length) {
    return bank[turnIndex];
  }

  // Dynamic follow-up fallback
  const lastTurn = previousTurns[previousTurns.length - 1];
  const lastAnswer = lastTurn?.answer || '';

  return {
    question: `That's an interesting approach. Follow-up for ${role}: how would you scale that solution if traffic or data volume increased 10x?`,
    category: 'Scalability & Follow-up',
    expectedKeywords: ['caching', 'sharding', 'horizontal scaling', 'load balancing']
  };
}

/**
 * 6. AI LIVE INTERVIEWER — ANSWER EVALUATOR & STAR METRICS
 */
export async function evaluateLiveInterviewAnswer({ question, answer = '', role = 'Software Engineer', difficulty = 'Mid-Level', turnIndex = 0 }) {
  const cleanAnswer = sanitizeInput(answer);

  if (isRealAiConfigured()) {
    try {
      const systemPrompt = `You are a Senior Technical Interview Evaluator analyzing a candidate's live answer for a ${difficulty} ${role} position.
Question: "${question}"
Evaluate answer and output JSON:
{
  "overallScore": number (0-100),
  "starScore": number (0-100),
  "technicalScore": number (0-100),
  "communicationScore": number (0-100),
  "confidenceScore": number (0-100),
  "starBreakdown": { "situation": boolean, "task": boolean, "action": boolean, "result": boolean },
  "feedback": string,
  "keyStrengths": array of strings,
  "areasToImprove": array of strings
}`;

      const userPrompt = `Answer: "${cleanAnswer}"`;
      const rawJson = await callOpenAI(systemPrompt, userPrompt, true);
      const parsed = JSON.parse(rawJson);
      if (parsed && typeof parsed.overallScore === 'number') {
        return parsed;
      }
    } catch (e) {
      // Fallback
    }
  }

  // Contextual Answer Evaluation Fallback
  const wordCount = cleanAnswer.split(/\s+/).filter(Boolean).length;
  const lowerAns = cleanAnswer.toLowerCase();

  const hasSituation = lowerAns.includes('when') || lowerAns.includes('project') || lowerAns.includes('at my') || lowerAns.includes('company');
  const hasTask = lowerAns.includes('task') || lowerAns.includes('needed to') || lowerAns.includes('goal') || lowerAns.includes('responsible');
  const hasAction = lowerAns.includes('i built') || lowerAns.includes('i implemented') || lowerAns.includes('i used') || lowerAns.includes('i led') || lowerAns.includes('designed');
  const hasResult = lowerAns.includes('%') || lowerAns.includes('improved') || lowerAns.includes('reduced') || lowerAns.includes('result') || lowerAns.includes('achieved');

  const starFoundCount = [hasSituation, hasTask, hasAction, hasResult].filter(Boolean).length;
  const starScore = Math.min(100, Math.max(40, starFoundCount * 22 + (wordCount > 30 ? 12 : 5)));

  const technicalKeywords = ['api', 'database', 'system', 'scale', 'test', 'async', 'react', 'node', 'architecture', 'performance', 'code', 'optimization', 'deploy'];
  const techMatches = technicalKeywords.filter(k => lowerAns.includes(k)).length;
  const technicalScore = Math.min(98, Math.max(50, techMatches * 10 + (wordCount > 25 ? 40 : 20)));

  const communicationScore = Math.min(95, Math.max(45, (wordCount >= 20 && wordCount <= 180 ? 40 : 20) + (starScore > 60 ? 35 : 20) + 15));
  const confidenceScore = Math.min(96, Math.max(50, (wordCount > 15 ? 40 : 20) + (hasAction ? 30 : 15) + (hasResult ? 25 : 10)));
  const overallScore = Math.round((starScore * 0.3) + (technicalScore * 0.3) + (communicationScore * 0.2) + (confidenceScore * 0.2));

  return {
    overallScore,
    starScore,
    technicalScore,
    communicationScore,
    confidenceScore,
    starBreakdown: {
      situation: hasSituation,
      task: hasTask,
      action: hasAction,
      result: hasResult
    },
    feedback: `Solid answer for ${role}. ${hasResult ? 'Great inclusion of results!' : 'Tip: Include quantified results to strengthen impact.'}`,
    keyStrengths: [
      hasAction ? 'Clear personal contribution' : 'Direct response to prompt',
      techMatches > 0 ? `Relevant technical terminology (${techMatches}+ terms)` : 'Articulate phrasing'
    ],
    areasToImprove: [
      !hasResult ? 'Quantify the outcome (e.g. % performance increase, time saved)' : 'Provide additional technical depth on edge cases',
      wordCount < 25 ? 'Elaborate more on technical implementation details' : 'Keep answer structured using STAR framework'
    ]
  };
}

/**
 * 7. AI LIVE INTERVIEWER — FINAL EVALUATION REPORT
 */
export async function generateLiveInterviewFinalReport({ session, turns = [] }) {
  if (!turns || turns.length === 0) {
    return {
      overallScore: 70,
      verdict: 'Hire',
      summary: 'Session completed with basic responses.',
      categoryScores: { STAR: 70, Technical: 70, Communication: 70, Confidence: 70 },
      topStrengths: ['Completed interview session'],
      actionableRecommendations: ['Practice structuring answers with STAR framework']
    };
  }

  const avgScore = Math.round(turns.reduce((sum, t) => sum + (t.evaluation?.overallScore || 70), 0) / turns.length);
  const avgStar = Math.round(turns.reduce((sum, t) => sum + (t.evaluation?.starScore || 70), 0) / turns.length);
  const avgTech = Math.round(turns.reduce((sum, t) => sum + (t.evaluation?.technicalScore || 70), 0) / turns.length);
  const avgComm = Math.round(turns.reduce((sum, t) => sum + (t.evaluation?.communicationScore || 70), 0) / turns.length);
  const avgConf = Math.round(turns.reduce((sum, t) => sum + (t.evaluation?.confidenceScore || 70), 0) / turns.length);

  let verdict = 'Strong Hire';
  if (avgScore < 65) verdict = 'Needs Improvement';
  else if (avgScore < 78) verdict = 'Lean Hire';
  else if (avgScore < 88) verdict = 'Hire';

  return {
    overallScore: avgScore,
    verdict,
    summary: `Completed ${turns.length}-question ${session?.difficulty || 'Mid-Level'} ${session?.targetRole || 'Software Engineer'} AI interview simulation. Overall candidate performance rated as ${verdict} (${avgScore}/100).`,
    categoryScores: {
      STAR: avgStar,
      Technical: avgTech,
      Communication: avgComm,
      Confidence: avgConf
    },
    topStrengths: [
      `Demonstrated ${avgTech >= 75 ? 'strong' : 'solid'} technical alignment for ${session?.targetRole || 'Software Engineer'}`,
      `Consistently structured answers with ${avgStar}% STAR rating`,
      'Engaged clearly in live follow-up interviewer questions'
    ],
    actionableRecommendations: [
      'Quantify results in every behavioral story using explicit percentage or revenue metrics',
      'Provide deeper architectural trade-off explanations during technical questions',
      'Maintain steady pace and clear vocal confidence throughout complex questions'
    ]
  };
}
