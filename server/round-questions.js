// Comprehensive MCQ Question Bank for Round-based Practice
// Contains Aptitude, Coding, Technical Assessment, and Communication/HR rounds

export const roundBasedQuestionBank = {
  aptitude: [
    {
      id: 'apt-1',
      question: 'A train 120 m long passes a telegraph post in 6 seconds. What is the speed of the train in km/h?',
      options: ['60 km/h', '72 km/h', '80 km/h', '90 km/h'],
      correctAnswer: 1, // '72 km/h'
      explanation: 'Speed = Distance / Time = 120 / 6 = 20 m/s. Convert to km/h: 20 * (18 / 5) = 72 km/h.'
    },
    {
      id: 'apt-2',
      question: 'If 15 men can complete a work in 20 days, how many days will 20 men take to complete the same work?',
      options: ['12 days', '15 days', '18 days', '10 days'],
      correctAnswer: 1, // '15 days'
      explanation: 'Using M1 * D1 = M2 * D2: 15 * 20 = 20 * D2 => D2 = 15 days.'
    },
    {
      id: 'apt-3',
      question: 'Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?',
      options: ['(1/3)', '(1/8)', '(2/8)', '(1/16)'],
      correctAnswer: 1, // '(1/8)'
      explanation: 'This is a geometric progression where each term is half of the preceding term. Half of 1/4 is 1/8.'
    },
    {
      id: 'apt-4',
      question: 'A shopkeeper sells an article for $300 at a profit of 25%. What was the cost price of the article?',
      options: ['$225', '$240', '$250', '$275'],
      correctAnswer: 1, // '$240'
      explanation: 'Cost Price = Selling Price / (1 + Profit%) = 300 / 1.25 = $240.'
    },
    {
      id: 'apt-5',
      question: 'The average of five numbers is 20. If one number is excluded, the average becomes 18. What is the excluded number?',
      options: ['24', '26', '28', '30'],
      correctAnswer: 2, // '28'
      explanation: 'Sum of 5 numbers = 5 * 20 = 100. Sum of 4 numbers = 4 * 18 = 72. Excluded number = 100 - 72 = 28.'
    },
    {
      id: 'apt-6',
      question: 'A cistern is normally filled in 8 hours but takes 2 hours longer to fill because of a leak in its bottom. If the cistern is full, in how many hours will the leak empty it?',
      options: ['30 hours', '40 hours', '50 hours', '60 hours'],
      correctAnswer: 1, // '40 hours'
      explanation: 'Filling rate = 1/8. Rate with leak = 1/10. Leak rate = 1/8 - 1/10 = 2/80 = 1/40 cistern per hour. Thus, the leak empties cistern in 40 hours.'
    },
    {
      id: 'apt-7',
      question: 'Find the odd one out: 3, 5, 11, 14, 17, 21',
      options: ['14', '21', '11', '17'],
      correctAnswer: 0, // '14'
      explanation: 'All numbers except 14 are odd prime/composite numbers. 14 is the only even number in the sequence.'
    },
    {
      id: 'apt-8',
      question: 'A sum of money doubles itself at simple interest in 10 years. In how many years will it triple itself?',
      options: ['15 years', '20 years', '25 years', '30 years'],
      correctAnswer: 1, // '20 years'
      explanation: 'Double sum means SI = P in 10 years. Triple sum means SI = 2P. At simple interest, SI accumulates linearly, so 2P interest takes 20 years.'
    }
  ],
  coding: [
    {
      id: 'cod-1',
      question: 'What is the time complexity of searching in a balanced binary search tree (BST)?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
      correctAnswer: 2, // 'O(log n)'
      explanation: 'For a balanced BST, each comparison discards half of the tree, yielding logarithmic search complexity.'
    },
    {
      id: 'cod-2',
      question: 'Which data structure follows the Last-In-First-Out (LIFO) principle?',
      options: ['Queue', 'Stack', 'Linked List', 'Heap'],
      correctAnswer: 1, // 'Stack'
      explanation: 'A stack is a LIFO data structure where the last item inserted is the first one removed.'
    },
    {
      id: 'cod-3',
      question: 'What is the output of `console.log(typeof NaN)` in JavaScript?',
      options: ['"number"', '"nan"', '"undefined"', '"object"'],
      correctAnswer: 0, // '"number"'
      explanation: 'In JavaScript, `NaN` (Not-a-Number) is historically defined as a special numeric value, so `typeof NaN` yields `"number"`.'
    },
    {
      id: 'cod-4',
      question: 'What is the space complexity of a recursive Fibonacci function without memoization?',
      options: ['O(1)', 'O(n) due to stack depth', 'O(2^n)', 'O(log n)'],
      correctAnswer: 1, // 'O(n) due to stack depth'
      explanation: 'The maximum recursion tree depth is O(n), which determines the maximum size of the execution call stack.'
    },
    {
      id: 'cod-5',
      question: 'Which of the following sorting algorithms has a guaranteed worst-case time complexity of O(n log n)?',
      options: ['Quick Sort', 'Bubble Sort', 'Merge Sort', 'Selection Sort'],
      correctAnswer: 2, // 'Merge Sort'
      explanation: 'Merge Sort always splits arrays in halves and merges them, guaranteeing O(n log n) in best, average, and worst cases.'
    },
    {
      id: 'cod-6',
      question: 'What is the result of the following Python expression: `[x for x in range(5) if x % 2 == 0]`?',
      options: ['[1, 3]', '[0, 2, 4]', '[2, 4]', '[0, 1, 2, 3, 4]'],
      correctAnswer: 1, // '[0, 2, 4]'
      explanation: 'This is a list comprehension filtering even values. `range(5)` contains 0, 1, 2, 3, 4. The even values are 0, 2, 4.'
    },
    {
      id: 'cod-7',
      question: 'What does the `break` statement do in a loop?',
      options: ['Skips the current iteration', 'Terminates the loop immediately', 'Exits the entire program', 'Restarts the loop'],
      correctAnswer: 1, // 'Terminates the loop immediately'
      explanation: 'The `break` statement instantly exits the innermost executing loop structure.'
    }
  ],
  technical: [
    {
      id: 'tech-1',
      question: 'Which of the following database concepts guarantees integrity during transaction failures?',
      options: ['Indexes', 'ACID properties', 'Normal forms', 'SQL schemas'],
      correctAnswer: 1, // 'ACID properties'
      explanation: 'ACID (Atomicity, Consistency, Isolation, Durability) guarantees reliable processing of database transactions.'
    },
    {
      id: 'tech-2',
      question: 'In computer networks, which layer of the OSI model handles routing and packet forwarding?',
      options: ['Data Link Layer', 'Network Layer', 'Transport Layer', 'Physical Layer'],
      correctAnswer: 1, // 'Network Layer'
      explanation: 'The Network Layer (Layer 3) handles addressing, routing, and packet forwarding across logical networks.'
    },
    {
      id: 'tech-3',
      question: 'What is the default port number for secure HTTP (HTTPS) connections?',
      options: ['80', '8080', '443', '22'],
      correctAnswer: 2, // '443'
      explanation: 'HTTPS connections communicate by default on secure TCP port 443, while standard HTTP uses port 80.'
    },
    {
      id: 'tech-4',
      question: 'What is the purpose of virtual memory in operating systems?',
      options: ['To speed up hard drive access', 'To allow programs to address more memory than physical RAM', 'To secure network data', 'To partition disk drives'],
      correctAnswer: 1, // 'To allow programs to address more memory than physical RAM'
      explanation: 'Virtual memory maps program addresses to physical RAM and swap space on disk, presenting an expanded memory view.'
    },
    {
      id: 'tech-5',
      question: 'Which normal form in database normalization eliminates partial dependencies on composite keys?',
      options: ['1NF', '2NF', '3NF', 'BCNF'],
      correctAnswer: 1, // '2NF'
      explanation: 'Second Normal Form (2NF) requires relations to be in 1NF and ensures all non-prime attributes are fully functionally dependent on the primary key.'
    },
    {
      id: 'tech-6',
      question: 'What is the main advantage of indexes in a database table?',
      options: ['Reduces storage space', 'Improves query execution speed', 'Secures data writes', 'Enforces unique relationships'],
      correctAnswer: 1, // 'Improves query execution speed'
      explanation: 'Indexes create search optimization nodes allowing database engines to locate records rapidly without full table scans.'
    }
  ],
  communication: [
    {
      id: 'comm-1',
      question: 'A client demands sudden out-of-scope feature additions right before the product release. What is the best response?',
      options: [
        'Decline directly, stating it was not part of the initial contract.',
        'Accept it immediately to maintain client satisfaction, working overtime.',
        'Acknowledge the requirement, explain the impact on timelines/cost, and propose handling it as a phase-2 addition.',
        'Ignore the client’s request until the product is successfully launched.'
      ],
      correctAnswer: 2,
      explanation: 'Best practice involves professional negotiation: acknowledge client needs, clarify project limits (timeline/cost), and suggest a phased approach.'
    },
    {
      id: 'comm-2',
      question: 'Your team lead assigns you a task involving a framework you have never used. How should you approach it?',
      options: [
        'Ask the lead to assign it to someone else since you do not know the framework.',
        'Accept it, research/learn fundamentals, prepare a plan, and ask for guidance on roadblocks.',
        'Pretend you know it, wait until the deadline, and declare you had problems.',
        'Work on it without asking questions, even if you make structural mistakes.'
      ],
      correctAnswer: 1,
      explanation: 'Demonstrates accountability and growth mindset: take ownership, learn on-the-job, and seek assistance responsibly.'
    },
    {
      id: 'comm-3',
      question: 'You notice a critical bug in a team member’s code right before deployment. How do you communicate this?',
      options: [
        'Blame them in the public Slack channel to ensure it gets fixed.',
        'Fix it yourself secretly without notifying them.',
        'Ping them privately, explain the issue constructively, and offer to work together to patch it.',
        'Report them to the Director of Engineering immediately.'
      ],
      correctAnswer: 2,
      explanation: 'Builds positive team collaboration: constructive private feedback prevents public embarrassment and keeps deployment stable.'
    },
    {
      id: 'comm-4',
      question: 'During a meeting, a peer disagrees strongly with your technical proposal. What is the most productive action?',
      options: [
        'Defend your approach aggressively and refuse to compromise.',
        'Accept their feedback blindly and drop your proposal.',
        'Listen actively to their concerns, compare both approaches objectively based on merits, and seek a team consensus.',
        'Walk out of the meeting to avoid further confrontation.'
      ],
      correctAnswer: 2,
      explanation: 'Reflects professional maturity and collaborative decision-making: weigh pros/cons objectively to build alignment.'
    }
  ]
};
