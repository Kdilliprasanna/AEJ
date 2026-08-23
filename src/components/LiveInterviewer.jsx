import { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Play,
  Send,
  CheckCircle,
  AlertTriangle,
  Award,
  BarChart2,
  RefreshCw,
  Sparkles,
  Zap,
  Briefcase,
  History
} from 'lucide-react';
import {
  startLiveInterview,
  submitLiveInterviewAnswer,
  completeLiveInterview,
  getLiveInterviewSessions
} from '../api';

export default function LiveInterviewer() {
  // Configuration State
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState('Mid-Level');
  const [company, setCompany] = useState('Tech Leader');
  const [jobDescription, setJobDescription] = useState('');

  // Active Session State
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastTurnEvaluation, setLastTurnEvaluation] = useState(null);
  const [sessionReport, setSessionReport] = useState(null);
  const [historySessions, setHistorySessions] = useState([]);
  const [activeTab, setActiveTab] = useState('interview'); // 'interview' | 'history'

  const recognitionRef = useRef(null);

  const loadHistory = async () => {
    try {
      const res = await getLiveInterviewSessions();
      if (res.ok && res.sessions) {
        setHistorySessions(res.sessions);
      }
    } catch (e) {
      console.warn('Failed to load session history:', e.message);
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadHistory();
    };

    void load();

    // Initialize Web Speech Recognition if supported by browser
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setAnswerText((prev) => prev + ' ' + transcript);
        }
      };

      rec.onerror = () => setIsRecording(false);
      rec.onend = () => setIsRecording(false);

      recognitionRef.current = rec;
    }
  }, []);

  const handleStartSession = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setLastTurnEvaluation(null);
    setSessionReport(null);
    setAnswerText('');

    try {
      const res = await startLiveInterview({
        targetRole,
        difficulty,
        company,
        jobDescription
      });

      if (res.ok && res.session) {
        setSession(res.session);
        setCurrentQuestion(res.initialQuestion);
        setActiveTab('interview');
      }
    } catch (err) {
      alert(`Failed to start interview session: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. You can type your answer directly in the text area.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch {
        setIsRecording(false);
      }
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    setLoading(true);

    try {
      const res = await submitLiveInterviewAnswer({
        sessionId: session.id,
        answer: answerText,
        responseType: isRecording ? 'voice' : 'text'
      });

      if (res.ok) {
        setLastTurnEvaluation(res.evaluation);
        setAnswerText('');

        if (res.isComplete) {
          setSessionReport(res.report);
          setSession((prev) => ({ ...prev, status: 'completed' }));
          loadHistory();
        } else {
          setCurrentQuestion(res.nextQuestion);
          setSession((prev) => ({
            ...prev,
            currentTurnIndex: res.turnIndex + 1,
            turns: [...prev.turns, { turnIndex: res.turnIndex + 1, question: res.nextQuestion.question }]
          }));
        }
      }
    } catch (err) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishEarly = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await completeLiveInterview(session.id);
      if (res.ok && res.report) {
        setSessionReport(res.report);
        setSession((prev) => ({ ...prev, status: 'completed' }));
        loadHistory();
      }
    } catch (e) {
      console.warn(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="live-interviewer-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px', color: '#f8fafc' }}>
      
      {/* HEADER BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <Sparkles style={{ width: '28px', height: '28px', color: '#38bdf8' }} />
            AI Live Technical & Behavioral Interviewer
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px', margin: 0 }}>
            Real-time interactive voice & text interview simulation with STAR evaluation, dynamic follow-ups, and hiring analysis.
          </p>
        </div>

        {/* TABS SWITCHER */}
        <div style={{ display: 'flex', gap: '8px', background: '#0f172a', padding: '4px', borderRadius: '8px', border: '1px solid #334155' }}>
          <button
            onClick={() => setActiveTab('interview')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              background: activeTab === 'interview' ? '#0284c7' : 'transparent',
              color: activeTab === 'interview' ? '#ffffff' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Zap style={{ width: '16px', height: '16px' }} /> Live Session
          </button>
          <button
            onClick={() => setActiveTab('history')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              background: activeTab === 'history' ? '#0284c7' : 'transparent',
              color: activeTab === 'history' ? '#ffffff' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <History style={{ width: '16px', height: '16px' }} /> History ({historySessions.length})
          </button>
        </div>
      </div>

      {activeTab === 'history' ? (
        /* HISTORY TAB */
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#38bdf8', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History style={{ width: '20px', height: '20px' }} /> Previous Practice Sessions
          </h3>

          {historySessions.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No previous interview sessions found. Start a new live simulation session to practice!</p>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {historySessions.map((s) => (
                <div key={s.id} style={{ background: '#0f172a', borderRadius: '8px', padding: '16px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '16px' }}>{s.targetRole} <span style={{ fontSize: '12px', color: '#38bdf8', background: '#0284c722', padding: '2px 8px', borderRadius: '4px' }}>{s.difficulty}</span></h4>
                    <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0 0' }}>Company: {s.company || 'Tech Leader'} &bull; {new Date(s.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {s.report?.overallScore && (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: s.report.overallScore >= 80 ? '#4ade80' : '#facc15' }}>
                          {s.report.overallScore}/100
                        </div>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{s.report.verdict}</span>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setSession(s);
                        setSessionReport(s.report || null);
                        setActiveTab('interview');
                      }}
                      style={{ background: '#334155', color: '#f8fafc', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                    >
                      View Report &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* LIVE INTERVIEW TAB */
        <div>
          {!session || session.status === 'completed' ? (
            /* CONFIG & SETUP STAGE */
            <div style={{ display: 'grid', gridTemplateColumns: sessionReport ? '1fr' : '1fr 1fr', gap: '24px' }}>
              
              {/* CONFIG FORM */}
              <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155' }}>
                <h3 style={{ color: '#38bdf8', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Briefcase style={{ width: '20px', height: '20px' }} /> Configure Live Interview Simulation
                </h3>

                <form onSubmit={handleStartSession}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>Target Job Role</label>
                    <select
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', borderRadius: '6px', fontSize: '14px' }}
                    >
                      <option value="Software Engineer">Software Engineer</option>
                      <option value="Frontend Developer">Frontend Developer</option>
                      <option value="Backend Engineer">Backend Engineer</option>
                      <option value="Full Stack Developer">Full Stack Developer</option>
                      <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
                      <option value="Data Scientist">Data Scientist</option>
                      <option value="Product Manager">Product Manager</option>
                      <option value="System Architect">System Architect</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>Difficulty Level</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                      {['Entry', 'Mid-Level', 'Senior', 'Lead'].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setDifficulty(level)}
                          style={{
                            padding: '8px',
                            background: difficulty === level ? '#0284c7' : '#0f172a',
                            color: difficulty === level ? '#ffffff' : '#94a3b8',
                            border: '1px solid #334155',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>Target Company (Optional)</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Google, Amazon, Microsoft, Startup"
                      style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', borderRadius: '6px', fontSize: '14px' }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>Job Description Keywords (Optional)</label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste key responsibilities or required skills for customized questions..."
                      rows={3}
                      style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', borderRadius: '6px', fontSize: '13px' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '15px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
                    }}
                  >
                    {loading ? <RefreshCw style={{ animation: 'spin 1s linear infinite' }} /> : <Play style={{ width: '18px', height: '18px' }} />}
                    Start Live AI Interview Session
                  </button>
                </form>
              </div>

              {/* REPORT DISPLAY IF JUST COMPLETED */}
              {sessionReport ? (
                <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ color: '#38bdf8', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Award style={{ width: '22px', height: '22px' }} /> Final Interview Evaluation Report
                    </h3>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontWeight: '700',
                      fontSize: '13px',
                      background: sessionReport.verdict === 'Strong Hire' || sessionReport.verdict === 'Hire' ? '#052e16' : '#422006',
                      color: sessionReport.verdict === 'Strong Hire' || sessionReport.verdict === 'Hire' ? '#4ade80' : '#facc15',
                      border: '1px solid #334155'
                    }}>
                      Verdict: {sessionReport.verdict}
                    </span>
                  </div>

                  {/* SCORE GAUGE */}
                  <div style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155', textAlign: 'center', marginBottom: '16px' }}>
                    <div style={{ fontSize: '36px', fontWeight: '800', color: sessionReport.overallScore >= 80 ? '#4ade80' : '#facc15' }}>
                      {sessionReport.overallScore}<span style={{ fontSize: '18px', color: '#94a3b8' }}>/100</span>
                    </div>
                    <p style={{ color: '#cbd5e1', fontSize: '13px', margin: '4px 0 0 0' }}>{sessionReport.summary}</p>
                  </div>

                  {/* CATEGORY BREAKDOWN */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
                    {Object.entries(sessionReport.categoryScores || {}).map(([cat, score]) => (
                      <div key={cat} style={{ background: '#0f172a', padding: '10px', borderRadius: '6px', textAlign: 'center', border: '1px solid #334155' }}>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{cat}</div>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#38bdf8' }}>{score}%</div>
                      </div>
                    ))}
                  </div>

                  {/* STRENGTHS */}
                  <div style={{ marginBottom: '14px' }}>
                    <h4 style={{ fontSize: '13px', color: '#4ade80', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle style={{ width: '14px', height: '14px' }} /> Key Technical & Behavioral Strengths
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '13px' }}>
                      {(sessionReport.topStrengths || []).map((s, idx) => <li key={idx} style={{ marginBottom: '4px' }}>{s}</li>)}
                    </ul>
                  </div>

                  {/* RECOMMENDATIONS */}
                  <div>
                    <h4 style={{ fontSize: '13px', color: '#facc15', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle style={{ width: '14px', height: '14px' }} /> Actionable Recommendations
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '13px' }}>
                      {(sessionReport.actionableRecommendations || []).map((r, idx) => <li key={idx} style={{ marginBottom: '4px' }}>{r}</li>)}
                    </ul>
                  </div>
                </div>
              ) : (
                /* INFORMATION SIDEBAR */
                <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155' }}>
                  <h3 style={{ color: '#38bdf8', marginTop: 0, marginBottom: '16px' }}>How Live Interviewer Works</h3>
                  <div style={{ display: 'grid', gap: '14px', color: '#cbd5e1', fontSize: '13px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ background: '#0284c7', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', shrink: 0 }}>1</span>
                      <div><strong>Dynamic Question Stream:</strong> AI generates questions tailored to your resume and selected difficulty.</div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ background: '#0284c7', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', shrink: 0 }}>2</span>
                      <div><strong>Voice & Text Speech Analysis:</strong> Speak into your microphone or type your responses in real time.</div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ background: '#0284c7', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', shrink: 0 }}>3</span>
                      <div><strong>Multi-Dimensional Scoring:</strong> Receives immediate STAR framework evaluation, technical correctness score, and confidence metrics.</div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* ACTIVE INTERVIEW SIMULATION STAGE */
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
              
              {/* MAIN INTERVIEWER CHAT & INPUT */}
              <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155' }}>
                
                {/* PROGRESS COUNTER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>
                    Question {session.currentTurnIndex + 1} of {session.maxTurns}
                  </span>
                  <span style={{ background: '#0284c722', color: '#38bdf8', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                    {currentQuestion?.category || 'Technical'}
                  </span>
                </div>

                {/* AI INTERVIEWER AVATAR & QUESTION */}
                <div style={{ background: '#0f172a', padding: '20px', borderRadius: '10px', border: '1px solid #334155', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Sparkles style={{ width: '18px', height: '18px', color: '#fff' }} />
                    </div>
                    <div>
                      <strong style={{ color: '#f8fafc', fontSize: '14px' }}>Lead Technical Interviewer</strong>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{session.company || 'Tech Leader'} &bull; {session.targetRole}</div>
                    </div>
                  </div>
                  <p style={{ color: '#f8fafc', fontSize: '16px', lineHeight: '1.5', margin: 0, fontWeight: '500' }}>
                    "{currentQuestion?.question}"
                  </p>
                </div>

                {/* ANSWER INPUT AREA */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#cbd5e1' }}>Your Answer Response</label>
                    <button
                      type="button"
                      onClick={handleToggleRecording}
                      style={{
                        background: isRecording ? '#ef4444' : '#334155',
                        color: '#ffffff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {isRecording ? <MicOff style={{ width: '14px', height: '14px' }} /> : <Mic style={{ width: '14px', height: '14px' }} />}
                      {isRecording ? 'Stop Recording' : 'Use Speech-to-Text Mic'}
                    </button>
                  </div>

                  <textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="Type or speak your answer here... (Tip: Structure using Situation, Task, Action, Result)"
                    rows={6}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0f172a',
                      border: isRecording ? '2px solid #ef4444' : '1px solid #334155',
                      color: '#f8fafc',
                      borderRadius: '8px',
                      fontSize: '14px',
                      lineHeight: '1.5'
                    }}
                  />
                  <div style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'right', marginTop: '4px' }}>
                    Word count: {answerText.trim().split(/\s+/).filter(Boolean).length} words
                  </div>
                </div>

                {/* ACTIONS */}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <button
                    onClick={handleFinishEarly}
                    disabled={loading}
                    style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                  >
                    Complete Interview & Report
                  </button>

                  <button
                    onClick={handleSubmitAnswer}
                    disabled={loading || !answerText.trim()}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '700',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      opacity: loading || !answerText.trim() ? 0.6 : 1
                    }}
                  >
                    {loading ? <RefreshCw style={{ animation: 'spin 1s linear infinite' }} /> : <Send style={{ width: '16px', height: '16px' }} />}
                    Submit Response & Continue &rarr;
                  </button>
                </div>
              </div>

              {/* EVALUATION SIDEBAR PANEL */}
              <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                <h3 style={{ color: '#38bdf8', marginTop: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BarChart2 style={{ width: '18px', height: '18px' }} /> Real-time Answer Feedback
                </h3>

                {lastTurnEvaluation ? (
                  <div>
                    {/* TURN SCORE */}
                    <div style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155', textAlign: 'center', marginBottom: '14px' }}>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>Last Answer Score</span>
                      <div style={{ fontSize: '28px', fontWeight: '800', color: lastTurnEvaluation.overallScore >= 80 ? '#4ade80' : '#facc15' }}>
                        {lastTurnEvaluation.overallScore}%
                      </div>
                    </div>

                    {/* STAR BREAKDOWN BADGES */}
                    <div style={{ marginBottom: '14px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>STAR Framework Structure:</span>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                        {Object.entries(lastTurnEvaluation.starBreakdown || {}).map(([key, found]) => (
                          <span
                            key={key}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '600',
                              background: found ? '#052e16' : '#1e293b',
                              color: found ? '#4ade80' : '#64748b',
                              border: '1px solid #334155',
                              textTransform: 'capitalize'
                            }}
                          >
                            {found ? '✓' : '✗'} {key}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* FEEDBACK & IMPROVEMENTS */}
                    <div style={{ fontSize: '12px', color: '#cbd5e1', background: '#0f172a', padding: '10px', borderRadius: '6px', border: '1px solid #334155', marginBottom: '12px' }}>
                      <strong>Feedback:</strong> {lastTurnEvaluation.feedback}
                    </div>

                    {lastTurnEvaluation.areasToImprove?.length > 0 && (
                      <div style={{ fontSize: '11px', color: '#facc15' }}>
                        <strong>Improvement Tip:</strong> {lastTurnEvaluation.areasToImprove[0]}
                      </div>
                    )}
                  </div>
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '13px' }}>
                    Submit your answer to view real-time STAR evaluation metrics, technical correctness, and follow-up guidance.
                  </p>
                )}
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
}
