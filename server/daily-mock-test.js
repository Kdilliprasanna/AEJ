// Daily Mock Test System with Rotation & Persistence
// Different questions each day, upgrades over time, daily streaks

export const advancedMockTestSystem = {
  // Extended question bank organized by level and category
  questionBank: [
    // ===== LEVEL 1 - FRESHERS (Easy) =====
    {
      id: 'q1-hr-001',
      level: 'Beginner',
      category: 'HR',
      question: 'Tell me about yourself in 2-3 minutes.',
      expectedKeywords: ['name', 'background', 'skills', 'interest', 'goal'],
      hints: 'Follow this structure: Name → Education → Skills → Current interest → Career goal',
      sample_answer: `Hi, I'm [Name], graduated with a degree in [Field] in [Year]. I have [X years/months] of experience in [Field/Role]. 
My key strengths are [Skill 1], [Skill 2], and [Skill 3]. I'm particularly interested in [Company/Role] because [Reason]. 
I'm excited to grow my skills in [Technology] and contribute to impactful projects.`,
      timeLimit: 180,
      difficulty_rating: 1,
    },
    {
      id: 'q1-hr-002',
      level: 'Beginner',
      category: 'HR',
      question: 'Why are you interested in this position?',
      expectedKeywords: ['role', 'company', 'growth', 'skills', 'mission', 'products'],
      hints: 'Mention: 1) Why the company matters to you, 2) How the role aligns with your goals, 3) Your specific interest in their product',
      sample_answer: `I'm excited about this position because [Company] is leading in [Industry/Technology]. 
I admire their [Product/Initiative] and the impact it has. This role would allow me to leverage my [Skill] while learning [New Skill]. 
I'm particularly drawn to your company's culture of [Value] and commitment to [Mission].`,
      timeLimit: 120,
      difficulty_rating: 1,
    },
    {
      id: 'q1-tech-001',
      level: 'Beginner',
      category: 'Technical',
      question: 'Explain HTML, CSS, and JavaScript and their roles in web development.',
      expectedKeywords: ['html', 'structure', 'css', 'styling', 'javascript', 'interactivity', 'dom'],
      hints: `HTML = Structure (skeleton)
CSS = Styling (how it looks)
JavaScript = Behavior (how it works)
Give an analogy: Building structure like a house frame, CSS like interior design, JavaScript like electricity and appliances`,
      sample_answer: `HTML (HyperText Markup Language) creates the structure and content of a web page using tags like <div>, <p>, <button>, etc.
CSS (Cascading Style Sheets) controls the visual presentation - colors, fonts, layouts, animations - transforming plain HTML into beautiful designs.
JavaScript adds interactivity - handling clicks, form submissions, updating content dynamically without page refresh.
Together: HTML is the skeleton, CSS is the appearance, JavaScript is the behavior and intelligence.`,
      timeLimit: 120,
      difficulty_rating: 1,
    },
    {
      id: 'q1-tech-002',
      level: 'Beginner',
      category: 'Technical',
      question: 'What is Git and why is it important for developers?',
      expectedKeywords: ['version control', 'tracking changes', 'collaboration', 'branches', 'merge', 'history'],
      hints: 'Explain: 1) What it does (track changes), 2) Why (team collaboration), 3) Key features (branches, merge, history)',
      sample_answer: `Git is a version control system that tracks changes to code over time. It allows developers to:
- Save snapshots of code (commits) with descriptions
- Work on different features simultaneously (branches)
- Merge changes from multiple developers
- Revert to previous versions if needed
- Collaborate safely on the same project

Without Git, multiple developers would overwrite each other's code. With Git, everyone's work is tracked and conflicts are resolved systematically.`,
      timeLimit: 120,
      difficulty_rating: 1,
    },
    {
      id: 'q1-apt-001',
      level: 'Beginner',
      category: 'Aptitude',
      question: 'If a train travels at 60 km/h for 2.5 hours, how far does it travel?',
      expectedKeywords: ['distance', 'speed', 'time', 'formula', '150km'],
      hints: 'Use formula: Distance = Speed × Time. 60 km/h × 2.5 h = ?',
      sample_answer: `Using the formula: Distance = Speed × Time
Speed = 60 km/h
Time = 2.5 hours
Distance = 60 × 2.5 = 150 km

The train travels 150 kilometers.`,
      timeLimit: 120,
      difficulty_rating: 1,
    },

    // ===== LEVEL 2 - INTERMEDIATE =====
    {
      id: 'q2-hr-001',
      level: 'Intermediate',
      category: 'HR',
      question: 'Tell me about a time you faced a challenge and how you overcame it.',
      expectedKeywords: ['challenge', 'action', 'result', 'learned', 'problem-solving'],
      hints: `Use STAR method:
Situation: What was the challenge?
Task: What was your role?
Action: What specific steps did you take?
Result: What was the quantified outcome?`,
      sample_answer: `SITUATION: While building a web app, our API response time was 5+ seconds, causing poor user experience.
TASK: I was responsible for performance optimization.
ACTION: I identified unnecessary database queries using DevTools, optimized queries, added caching with Redis, and implemented lazy loading.
RESULT: Reduced response time to 800ms (85% improvement), which increased user engagement by 40% and reduced bounce rate.

This experience taught me the importance of monitoring performance metrics and systematic optimization.`,
      timeLimit: 180,
      difficulty_rating: 2,
    },
    {
      id: 'q2-tech-001',
      level: 'Intermediate',
      category: 'Technical',
      question: 'Explain the difference between SQL and NoSQL databases. Give examples.',
      expectedKeywords: ['sql', 'relational', 'postgresql', 'structured', 'nosql', 'mongodb', 'flexible', 'schemaless'],
      hints: `SQL: Structured tables, rows, columns, relationships, ACID compliance
NoSQL: Flexible documents, key-value pairs, less rigid structure, eventual consistency`,
      sample_answer: `SQL (Relational) Databases:
- Structured data in tables with fixed schemas
- Examples: PostgreSQL, MySQL, Oracle
- Use ACID properties (Atomicity, Consistency, Isolation, Durability)
- Best for: Traditional apps, banking, complex queries
- Scaling: Vertical (add more resources to one server)

NoSQL Databases:
- Flexible, document-based (JSON-like), no fixed schema
- Examples: MongoDB, Firebase, Cassandra
- Use eventual consistency
- Best for: Real-time apps, IoT, massive scale
- Scaling: Horizontal (add more servers)

Example:
User table (SQL):
| id | name | email | age |
NoSQL document:
{ id: 1, name: "John", email: "john@example.com", age: 25, projects: [...] }`,
      timeLimit: 150,
      difficulty_rating: 2,
    },
    {
      id: 'q2-tech-002',
      level: 'Intermediate',
      category: 'Technical',
      question: 'What is REST API and provide a real-world example.',
      expectedKeywords: ['api', 'http', 'methods', 'endpoints', 'request', 'response', 'json'],
      hints: `REST = Representational State Transfer
Explain: Concept, HTTP methods (GET, POST, PUT, DELETE), endpoints, JSON responses
Example: Twitter API getting tweets, posting tweets, deleting tweets`,
      sample_answer: `REST API (Representational State Transfer) allows applications to communicate over HTTP using standard methods.

HTTP Methods:
- GET: Retrieve data (getting tweets)
- POST: Create data (posting a new tweet)
- PUT: Update data (editing a tweet)
- DELETE: Remove data (deleting a tweet)

Example - Twitter API:
GET /api/tweets/123 → Returns tweet with id 123
POST /api/tweets → Creates a new tweet
PUT /api/tweets/123 → Updates tweet 123
DELETE /api/tweets/123 → Deletes tweet 123

Response format (JSON):
{
  "id": 123,
  "content": "Hello world!",
  "author": "John",
  "likes": 100
}

REST APIs use standard conventions, making them predictable and easy to use across different platforms.`,
      timeLimit: 150,
      difficulty_rating: 2,
    },
    {
      id: 'q2-apt-001',
      level: 'Intermediate',
      category: 'Aptitude',
      question: 'A shop owner bought 100 items for Rs. 1000. He sold 60 items at Rs. 15 each. What is the profit/loss?',
      expectedKeywords: ['cost price', 'selling price', 'profit', 'loss', 'calculation'],
      hints: `Cost price per item = 1000/100 = Rs. 10
Selling price for 60 items = 60 × 15 = ?
Profit per item = Selling price - Cost price
Total profit = Profit per item × number of items sold`,
      sample_answer: `Cost Price Calculation:
Cost price per item = 1000 ÷ 100 = Rs. 10

Selling Price Calculation:
60 items sold at Rs. 15 each = 60 × 15 = Rs. 900

Profit Calculation:
Profit per item = 15 - 10 = Rs. 5
Total profit for 60 items = 5 × 60 = Rs. 300

Total profit = Rs. 300 (or 30% profit)`,
      timeLimit: 120,
      difficulty_rating: 2,
    },

    // ===== LEVEL 3 - ADVANCED =====
    {
      id: 'q3-hr-001',
      level: 'Advanced',
      category: 'HR',
      question: 'Where do you see yourself in 5 years? How does this role align with your career goals?',
      expectedKeywords: ['career growth', 'leadership', 'skills', 'impact', 'alignment', 'learning'],
      hints: 'Be specific, realistic, and show how this role is a stepping stone. Show ambition but also humility.',
      sample_answer: `In 5 years, I see myself as a Senior Engineer or Tech Lead, leading a team of developers and mentoring juniors.
I aim to have deep expertise in full-stack development with exposure to system design and architectural decisions.

This role aligns perfectly because:
1. I'll master [Core Technology] working on real-world scale problems
2. I'll learn from senior engineers and expand my system design knowledge
3. The company's [Culture/Tech Stack] matches my growth trajectory
4. Within 1-2 years, I aim for a Lead role to mentor others
5. Eventually, transition to Technical Management or continue as an Architect

I'm committed to continuous learning - currently taking courses in [Skill], contributing to open source, and building side projects.
My goal is not just to be a good developer, but a developer who creates impact and grows others.`,
      timeLimit: 180,
      difficulty_rating: 3,
    },
    {
      id: 'q3-tech-001',
      level: 'Advanced',
      category: 'Technical',
      question: 'Design a system to handle millions of users accessing data simultaneously. Explain your approach.',
      expectedKeywords: ['scalability', 'database', 'caching', 'load balancing', 'microservices', 'cdn'],
      hints: `Think about:
1. Database optimization (sharding, replication)
2. Caching layers (Redis, CDN)
3. Load balancing
4. Microservices architecture
5. Monitoring and alerting`,
      sample_answer: `System Design for Millions of Concurrent Users:

1. DATABASE LAYER:
- Use NoSQL (MongoDB) for horizontal scalability
- Implement database sharding (partition data by user ID)
- Add read replicas for read-heavy operations
- Use connection pooling

2. CACHING:
- Redis/Memcached for frequently accessed data
- Cache popular products, user preferences
- Reduces database load by 80%+

3. LOAD BALANCING:
- Use Nginx or HAProxy to distribute requests
- Route requests to multiple servers
- Ensures no single server bottleneck

4. MICROSERVICES:
- Separate services: User Service, Product Service, Order Service
- Each independently scalable
- Communication via APIs

5. CDN:
- Serve static assets (images, CSS, JS) from CDN
- Faster delivery, reduced server load

6. MESSAGE QUEUES:
- Use RabbitMQ/Kafka for async operations
- Prevents blocking, improves response time

7. MONITORING:
- Track response times, error rates, server load
- Auto-scaling triggers if load increases

This architecture handles millions of users by distributing load across multiple systems.`,
      timeLimit: 300,
      difficulty_rating: 3,
    },

    // ===== ADDITIONAL QUESTIONS FOR VARIETY =====
    {
      id: 'q-comm-001',
      level: 'Intermediate',
      category: 'Communication',
      question: 'Your manager disagrees with your technical approach. How do you handle it?',
      expectedKeywords: ['listen', 'understand', 'explain', 'compromise', 'respect', 'decision'],
      hints: 'Show maturity: Listen, explain your reasoning calmly, understand their perspective, reach consensus.',
      sample_answer: `I would:
1. Listen carefully to understand their concerns and perspective
2. Ask clarifying questions to understand their reasoning
3. Explain my approach calmly with specific reasoning and data
4. Acknowledge valid points in their approach
5. Propose compromise if possible (A/B test both approaches)
6. If they decide to go their way, support fully and learn from the decision

Example: If they want REST API but I suggested GraphQL:
- I'd explain GraphQL benefits (flexible queries, reduced over-fetching)
- Understand their concerns (complexity, team expertise)
- Propose: Try GraphQL for new service, REST for existing
- If they decide REST, I'd implement it well and perhaps suggest GraphQL for future projects

This shows: Confidence in ideas + respect for authority + team player mentality`,
      timeLimit: 150,
      difficulty_rating: 2,
    },
  ],

  // Daily rotation system
  generateTodaysQuestions: function (userProfile, completedDates = []) {
    const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
    const daysSinceStart = Math.floor((new Date(today) - new Date(completedDates[0] || today)) / (1000 * 60 * 60 * 24));

    // Prevent same-day retakes
    if (completedDates.includes(today)) {
      return {
        status: 'already_completed',
        message: 'You have already completed today\'s test. Come back tomorrow for new questions!',
        next_available: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10),
      };
    }

    // Determine difficulty level based on streak
    let difficulty = 'Beginner';
    const streak = this.calculateStreak(completedDates);
    if (streak >= 7) difficulty = 'Advanced';
    else if (streak >= 3) difficulty = 'Intermediate';

    // Get questions for today - use date as seed for consistent randomization
    const seed = this.hashDate(today);
    const filteredQuestions = this.questionBank.filter((q) => q.level === difficulty);
    const selectedQuestions = this.selectQuestionsForDay(filteredQuestions, seed, 5);

    return {
      status: 'ready',
      date: today,
      difficulty,
      streak,
      questions: selectedQuestions,
      timeLimit: 900, // 15 minutes total
      message: `Day ${daysSinceStart + 1} - ${difficulty} Level Questions`,
    };
  },

  // Calculate current streak
  calculateStreak: function (completedDates = []) {
    if (completedDates.length === 0) return 0;

    const sortedDates = completedDates.sort().reverse();
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < sortedDates.length; i++) {
      const date = new Date(sortedDates[i]);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);

      // Check if date matches expected consecutive day
      if (date.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  },

  // Hash date to seed random selection
  hashDate: function (dateStr) {
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      const char = dateStr.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  },

  // Select diverse questions for the day
  selectQuestionsForDay: function (questions, seed, count = 5) {
    const selected = [];
    const categories = ['HR', 'Technical', 'Aptitude', 'Communication'];
    let index = seed % questions.length;

    // Ensure diversity of categories
    for (const category of categories) {
      const categoryQuestions = questions.filter((q) => q.category === category);
      if (categoryQuestions.length > 0) {
        const qIndex = (index + category.charCodeAt(0)) % categoryQuestions.length;
        selected.push(categoryQuestions[qIndex]);
        index++;
      }
    }

    // Fill remaining with random
    while (selected.length < count && questions.length > 0) {
      const randomIndex = (index + Math.random() * 1000) % questions.length;
      const q = questions[Math.floor(randomIndex)];
      if (!selected.includes(q)) {
        selected.push(q);
      }
      index++;
    }

    return selected.slice(0, count);
  },

  // Evaluate answers
  evaluateAnswers: function (answers = {}, questions = []) {
    let totalScore = 0;
    const feedback = {};

    for (const question of questions) {
      const userAnswer = (answers[question.id] || '').toLowerCase();
      const keywords = (question.expectedKeywords || []).map((k) => k.toLowerCase());

      // Count keyword matches
      let matchCount = 0;
      for (const keyword of keywords) {
        if (userAnswer.includes(keyword)) {
          matchCount++;
        }
      }

      const keywordMatchPercentage = (matchCount / keywords.length) * 100;
      const answerLength = userAnswer.split(' ').length;
      const lengthScore = Math.min((answerLength / 50) * 100, 100); // Expects ~50 words
      const score = (keywordMatchPercentage * 0.6 + lengthScore * 0.4) / 100 * 100;

      totalScore += score;
      feedback[question.id] = {
        score: Math.round(score),
        matched_keywords: matchCount,
        total_keywords: keywords.length,
        hint: question.hints,
        suggestion: score < 50 ? 'Try to include more specific terms. Use the hint!' : score < 75 ? 'Good start! Be more detailed.' : 'Excellent answer!',
      };
    }

    const averageScore = Math.round(totalScore / questions.length);

    return {
      total_score: averageScore,
      feedback,
      performance_level: averageScore >= 80 ? 'Excellent 🌟' : averageScore >= 60 ? 'Good 👍' : 'Needs Improvement 📈',
      next_day_difficulty: averageScore >= 80 ? 'Advanced' : averageScore >= 60 ? 'Intermediate' : 'Beginner',
    };
  },

  // Upgrade questions over time
  getUpgradedQuestions: function (completedTestCount) {
    if (completedTestCount % 7 === 0 && completedTestCount > 0) {
      return {
        upgrade_type: 'weekly_challenge',
        message: `🎉 You've completed ${completedTestCount} tests! Here's a special challenge set.`,
        bonus: 'Complete this week\'s challenge to unlock badges!',
      };
    }
    return null;
  },
};

export default advancedMockTestSystem;
