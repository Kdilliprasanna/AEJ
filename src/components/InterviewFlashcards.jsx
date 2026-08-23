import React, { useState } from 'react';
import { HelpCircle, Eye, EyeOff, ThumbsUp, ChevronLeft, ChevronRight, Sparkles, BookOpen, Filter } from 'lucide-react';

const flashcards = [
  {
    category: 'Frontend & React',
    question: 'What is Virtual DOM in React and how does reconciliation work?',
    answer: 'The Virtual DOM is a lightweight JS representation of the real DOM. When state changes, React creates a new Virtual DOM tree, diffs it with the previous tree using a heuristic diffing algorithm (O(n)), and updates only the changed nodes in the real DOM (Reconciliation).',
    difficulty: 'Intermediate',
  },
  {
    category: 'Frontend & React',
    question: 'Explain the difference between useMemo and useCallback.',
    answer: 'useMemo caches the RESULT of a calculation between renders, while useCallback caches a FUNCTION DEFINITION between renders to prevent unnecessary child component re-renders when passed as a prop.',
    difficulty: 'Intermediate',
  },
  {
    category: 'Backend & Node.js',
    question: 'How does the Node.js Event Loop work?',
    answer: 'Node.js relies on an event-driven, non-blocking I/O model supported by libuv. The Event Loop executes callbacks through phases: Timers, Pending I/O, Idle/Prepare, Poll (I/O execution), Check (setImmediate), and Close callbacks.',
    difficulty: 'Advanced',
  },
  {
    category: 'Backend & Node.js',
    question: 'What is database indexing and when should you avoid it?',
    answer: 'An index is a data structure (usually B-Tree or Hash) that speeds up data retrieval operations. Avoid indexing on tables with frequent WRITE/INSERT operations, low-cardinality columns (e.g. boolean fields), or small tables where full scans are cheap.',
    difficulty: 'Intermediate',
  },
  {
    category: 'System Design',
    question: 'How do you handle microservice communication and event delivery guaranteed once?',
    answer: 'Use the Outbox Pattern paired with message queues (Kafka, RabbitMQ) and idempotent receivers using unique message IDs to deduplicate incoming messages on the receiving service side.',
    difficulty: 'Advanced',
  },
  {
    category: 'Behavioral & STAR',
    question: 'Describe a time you faced a major technical disagreement with a team member.',
    answer: 'Structure with STAR: Situation (deadline/architectural debate), Task (align team on scalable path), Action (benchmarked both approaches with data/POCs), Result (chose optimal solution objectively without ego).',
    difficulty: 'Behavioral',
  },
];

export default function InterviewFlashcards() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [mastered, setMastered] = useState(new Set());

  const categories = ['All', 'Frontend & React', 'Backend & Node.js', 'System Design', 'Behavioral & STAR'];

  const filteredCards = activeCategory === 'All'
    ? flashcards
    : flashcards.filter((c) => c.category === activeCategory);

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const toggleMastered = (questionText) => {
    const next = new Set(mastered);
    if (next.has(questionText)) next.delete(questionText);
    else next.add(questionText);
    setMastered(next);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card card-gradient">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600/20 text-purple-400 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Interview Flashcards & Question Bank</h2>
              <p className="text-sm text-gray-400">Master core technical & behavioral questions with instant reveal and self-rating.</p>
            </div>
          </div>
          <span className="badge badge-info">
            {mastered.size} / {flashcards.length} Mastered
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setCurrentIndex(0);
              setShowAnswer(false);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeCategory === cat
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'bg-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Flashcard Container */}
      {currentCard && (
        <div className="card bg-slate-900 border border-slate-800 p-8 min-h-[320px] flex flex-col justify-between relative shadow-2xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-4 border-b border-slate-800 pb-3">
            <span className="badge badge-primary">{currentCard.category}</span>
            <span className="text-gray-400">Question {currentIndex + 1} of {filteredCards.length}</span>
          </div>

          <div className="space-y-4 my-auto">
            <h3 className="text-xl font-bold text-white leading-snug flex items-start gap-3">
              <HelpCircle className="w-6 h-6 text-purple-400 shrink-0 mt-0.5" />
              {currentCard.question}
            </h3>

            {showAnswer ? (
              <div className="p-4 bg-slate-800/80 border border-purple-900/50 rounded-xl text-gray-200 text-sm leading-relaxed animate-fade-in space-y-2">
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block">Model Answer & Key Concepts:</span>
                <p>{currentCard.answer}</p>
              </div>
            ) : (
              <div className="p-8 border border-dashed border-slate-700/60 rounded-xl text-center text-gray-400 text-sm">
                Click "Reveal Answer" below to test your recall.
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={handlePrev}
              className="btn btn-secondary text-sm flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="btn btn-primary text-sm flex items-center gap-2"
              >
                {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
              </button>

              <button
                onClick={() => toggleMastered(currentCard.question)}
                className={`btn text-sm flex items-center gap-1.5 ${
                  mastered.has(currentCard.question)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-gray-400 hover:text-white'
                }`}
              >
                <ThumbsUp className="w-4 h-4" /> {mastered.has(currentCard.question) ? 'Mastered' : 'Mark Mastered'}
              </button>
            </div>

            <button
              onClick={handleNext}
              className="btn btn-secondary text-sm flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
