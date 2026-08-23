import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Calculator,
  Code2,
  Cpu,
  MessageSquare,
  Clock,
  Check,
  X,
  ArrowRight,
  BarChart3,
  Bell,
  Bot,
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Download,
  Eye,
  ExternalLink,
  FileText,
  FileUp,
  Gauge,
  Globe2,
  GraduationCap,
  History,
  Home,
  Info,
  Link as LinkIcon,
  ListChecks,
  Lock,
  LogOut,
  Mail,
  Moon,
  RefreshCw,
  Save,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Target,
  Trophy,
  UploadCloud,
  User,
  XCircle,
  Zap,
} from 'lucide-react';
import { apiFetch, clearSession, getSession, saveSession } from './api';
import Notifications from './assets/pages/Notifications.jsx';
import ResumeLab from './assets/pages/ResumeLab.jsx';
import CoverLetterPage from './assets/pages/CoverLetterPage.jsx';
import CareerRoadmapPage from './assets/pages/CareerRoadmapPage.jsx';
import JobCopilotPage from './assets/pages/JobCopilotPage.jsx';
import LiveInterviewer from './components/LiveInterviewer.jsx';
import AdminUniversityDashboard from './components/AdminUniversityDashboard.jsx';
import SalaryInsightsCalculator from './components/SalaryInsightsCalculator.jsx';
import InterviewFlashcards from './components/InterviewFlashcards.jsx';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'copilot', label: 'AI Copilot', icon: Sparkles },
  { id: 'liveInterview', label: 'AI Live Interviewer', icon: CalendarCheck },
  { id: 'adminAnalytics', label: 'University Analytics', icon: ShieldCheck },
  { id: 'salary', label: 'Salary Insights', icon: Calculator },
  { id: 'flashcards', label: 'Interview Flashcards', icon: Code2 },
  { id: 'resume', label: 'Resume Lab', icon: FileText },
  { id: 'templates', label: 'Premium Templates', icon: Sparkles },
  { id: 'coverLetter', label: 'Cover Letter', icon: Mail },
  { id: 'roadmap', label: 'Career Roadmap', icon: Target },
  { id: 'roles', label: 'Roles & Jobs', icon: Briefcase },
  { id: 'interview', label: 'Mock Test', icon: CalendarCheck },
  { id: 'chat', label: 'AI Chat', icon: Bot },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'applications', label: 'Applications', icon: ClipboardList },
];

const defaultDashboard = {
  profile: null,
  latestReport: null,
  roles: [],
  weekly: [],
  streak: { current: 0, best: 0 },
  savedJobs: [],
  appliedJobs: [],
  recommendations: [],
  stats: { resumes: 0, reports: 0, chats: 0, mockTests: 0 },
};

const emptyProfile = {
  name: '',
  email: '',
  phone: '',
  educationField: '',
  degree: '',
  percentage: '',
  skills: [],
  preferredJobType: '',
  locations: [],
  targetRole: '',
  summary: '',
  links: { linkedin: '', github: '', portfolio: '' },
};

const statusOptions = ['Saved', 'Applied', 'Interviewing', 'Rejected', 'Offered'];

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function formatDate(value) {
  if (!value) return 'Not yet';
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function toCsv(items = []) {
  return Array.isArray(items) ? items.join(', ') : items || '';
}

function fromCsv(value = '') {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function scoreTone(score = 0) {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  return 'needs-work';
}

function printHtml(title, html) {
  const win = window.open('', '_blank', 'width=900,height=1100');
  if (!win) return;
  win.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Inter, Arial, sans-serif; color: #111827; margin: 40px; line-height: 1.5; }
          h1, h2, h3 { color: #0f172a; }
          .muted { color: #64748b; }
          .section { border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 18px; }
          .pill { display: inline-block; border: 1px solid #cbd5e1; border-radius: 999px; padding: 4px 10px; margin: 3px; font-size: 12px; }
          @media print { button { display: none; } body { margin: 22mm; } }
        </style>
      </head>
      <body>
        <button onclick="window.print()">Save as PDF</button>
        ${html}
      </body>
    </html>
  `);
  win.document.close();
}

function App() {
  const [session, setSession] = useState(() => getSession());
  const [activePage, setActivePage] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('arj.theme') || 'dark');
  const [dashboard, setDashboard] = useState(defaultDashboard);
  const [profile, setProfile] = useState(emptyProfile);
  const [resumeHistory, setResumeHistory] = useState({ resumes: [], reports: [] });
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('classic-ats');
  const [chatMessages, setChatMessages] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [roles, setRoles] = useState([]);
  const [mockTest, setMockTest] = useState({ questions: [] });
  const [mockAnswers, setMockAnswers] = useState({});
  const [mockResult, setMockResult] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [apiOnline, setApiOnline] = useState(true);
  const [showDbModal, setShowDbModal] = useState(false);
  const [dbStatus, setDbStatus] = useState({ ok: true, provider: 'JSON DB' });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('arj.theme', theme);
  }, [theme]);

  useEffect(() => {
    if (session?.token) {
      loadWorkspace();
    }
  }, [session?.token]);

  async function request(path, options, fallbackMessage = 'Unable to reach the API. Start it with npm run api or npm run dev:full.') {
    try {
      setApiOnline(true);
      const data = await apiFetch(path, options);
      return data;
    } catch (error) {
      if (error.message === 'Invalid or expired session' || error.message === 'Authentication required') {
        handleLogout();
      }
      setApiOnline(false);
      throw new Error(error.message || fallbackMessage, { cause: error });
    }
  }

  async function loadWorkspace() {
    setLoading(true);
    try {
      const [dashboardData, profileData, historyData, templatesData, chatData, savedData, applicationsData, notificationsData, dbStatusData] = await Promise.all([
        request('/dashboard'),
        request('/profile/get'),
        request('/resume/history'),
        request('/templates/premium'),
        request('/chatbot/history'),
        request('/jobs/saved'),
        request('/applications'),
        request('/notifications/live?limit=5'),
        request('/db-status').catch(() => ({ ok: true, provider: 'JSON DB' })),
      ]);

      const profilePayload = { ...emptyProfile, ...dashboardData.profile, ...profileData.profile };
      setDashboard(dashboardData);
      setProfile(profilePayload);
      setResumeHistory(historyData);
      setTemplates(templatesData.templates);
      setChatMessages(chatData.messages);
      setSavedJobs(savedData.jobs);
      setAppliedJobs(applicationsData.applications);
      setRoles(dashboardData.roles || []);
      setRecommendations(dashboardData.recommendations || []);
      setNotifications(notificationsData.notifications || []);
      setUnreadCount(notificationsData.unreadCount || 0);
      setDbStatus(dbStatusData);

      const jobMatchPayload = {
        jobType: profilePayload.preferredJobType || 'Any',
        location: profilePayload.locations?.[0] || 'Remote',
        education: profilePayload.education || [profilePayload.degree || profilePayload.educationField].filter(Boolean),
        skills: profilePayload.skills || [],
        targetRole: profilePayload.targetRole || ''
      };

      const matchData = await request('/jobs/intelligent-match', {
        method: 'POST',
        body: JSON.stringify(jobMatchPayload),
      });

      setRoles(matchData.jobs || []);
    } catch (error) {
      setToast(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(payload) {
    saveSession(payload);
    setSession(payload);
    setActivePage('dashboard');
  }

  async function handleLogout() {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // Local logout should still happen even if the API is offline.
    }
    clearSession();
    setSession(null);
    setDashboard(defaultDashboard);
  }

  if (!session?.token) {
    return (
      <AuthScreen
        theme={theme}
        setTheme={setTheme}
        onLogin={handleLogin}
        apiOnline={apiOnline}
        setApiOnline={setApiOnline}
      />
    );
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} />
      <main className="workspace">
        <Topbar
          profile={profile}
          theme={theme}
          setTheme={setTheme}
          loading={loading}
          apiOnline={apiOnline}
          onRefresh={loadWorkspace}
          unreadCount={unreadCount}
          dbStatus={dbStatus}
          onOpenDbModal={() => setShowDbModal(true)}
        />

        {showDbModal && (
          <DatabaseModal
            onClose={() => setShowDbModal(false)}
            dbStatus={dbStatus}
            request={request}
          />
        )}

        {toast && (
          <div className="toast" role="status">
            <span>{toast}</span>
            <button type="button" onClick={() => setToast('')} title="Close">
              <XCircle size={18} />
            </button>
          </div>
        )}

        {activePage === 'dashboard' && (
          <DashboardPage
            dashboard={dashboard}
            notifications={notifications}
            unreadCount={unreadCount}
            setActivePage={setActivePage}
            onRefresh={loadWorkspace}
          />
        )}

        {activePage === 'resume' && (
          <ResumePage
            profile={profile}
            latestReport={dashboard.latestReport}
            resumeHistory={resumeHistory}
            setDashboard={setDashboard}
            setResumeHistory={setResumeHistory}
            setToast={setToast}
            request={request}
            refresh={loadWorkspace}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'copilot' && (
          <JobCopilotPage
            profile={profile}
            roles={roles}
            request={request}
            setToast={setToast}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'templates' && (
          <ResumeLab 
            profile={profile}
            setToast={setToast}
            refresh={loadWorkspace}
          />
        )}

        {activePage === 'coverLetter' && (
          <CoverLetterPage />
        )}

        {activePage === 'roadmap' && (
          <CareerRoadmapPage />
        )}

        {activePage === 'roles' && (
          <RolesJobsPage
            profile={profile}
            roles={roles}
            setRoles={setRoles}
            savedJobs={savedJobs}
            setSavedJobs={setSavedJobs}
            appliedJobs={appliedJobs}
            setAppliedJobs={setAppliedJobs}
            request={request}
            setToast={setToast}
          />
        )}

        {activePage === 'liveInterview' && (
          <LiveInterviewer />
        )}

        {activePage === 'adminAnalytics' && (
          <AdminUniversityDashboard />
        )}

        {activePage === 'salary' && (
          <SalaryInsightsCalculator />
        )}

        {activePage === 'flashcards' && (
          <InterviewFlashcards />
        )}

        {activePage === 'interview' && (
          <InterviewPage
            mockTest={mockTest}
            setMockTest={setMockTest}
            mockAnswers={mockAnswers}
            setMockAnswers={setMockAnswers}
            mockResult={mockResult}
            setMockResult={setMockResult}
            weekly={dashboard.weekly}
            streak={dashboard.streak}
            request={request}
            refresh={loadWorkspace}
            setToast={setToast}
          />
        )}

        {activePage === 'chat' && (
          <ChatPage
            messages={chatMessages}
            setMessages={setChatMessages}
            request={request}
            setToast={setToast}
          />
        )}

        {activePage === 'notifications' && (
          <Notifications />
        )}

        {activePage === 'profile' && (
          <ProfilePage
            key={profile?.id || profile?.email || 'profile'}
            profile={profile}
            setProfile={setProfile}
            request={request}
            refresh={loadWorkspace}
            setToast={setToast}
            recommendations={recommendations}
            setRecommendations={setRecommendations}
          />
        )}

        {activePage === 'applications' && (
          <ApplicationsPage
            savedJobs={savedJobs}
            appliedJobs={appliedJobs}
            setAppliedJobs={setAppliedJobs}
            request={request}
            setToast={setToast}
          />
        )}
      </main>
      <MobileNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
}

function AuthScreen({ theme, setTheme, onLogin, apiOnline, setApiOnline }) {
  const resetTokenFromUrl = new URLSearchParams(window.location.search).get('token') || '';
  const [mode, setMode] = useState(resetTokenFromUrl ? 'reset' : 'login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    token: resetTokenFromUrl,
  });
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    try {
      if (mode === 'login') {
        const data = await apiFetch('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        setApiOnline(true);
        onLogin(data);
      }

      if (mode === 'signup') {
        const data = await apiFetch('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
        });
        setApiOnline(true);
        onLogin(data);
      }

      if (mode === 'forgot') {
        const data = await apiFetch('/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email: form.email }),
        });
        setApiOnline(true);
        setMessage(data.resetToken ? `${data.message} Token: ${data.resetToken}` : data.message);
        if (data.resetToken) {
          setForm((current) => ({ ...current, token: data.resetToken }));
          setMode('reset');
        }
      }

      if (mode === 'reset') {
        const data = await apiFetch('/auth/reset-password', {
          method: 'POST',
          body: JSON.stringify({ token: form.token, password: form.password }),
        });
        setApiOnline(true);
        setMessage(data.message);
        setMode('login');
      }
    } catch (error) {
      setApiOnline(false);
      setMessage(error.message || 'Start the backend with npm run api.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-visual" aria-label="ARJ Overview">
        <div className="brand-mark">
          <Sparkles size={22} />
          ARJ
        </div>
        <h1>Career acceleration platform for resumes, roles, interviews, and job tracking.</h1>
        <p>
          Score your resume ATS quality, discover perfect-fit roles with AI, practice daily interviews with streak rewards, and track applications across platforms - all from one powerful workspace.
        </p>
        <div className="auth-stats">
          <MetricMini label="ATS scoring" value="100" />
          <MetricMini label="Daily mock tests" value="7d" />
          <MetricMini label="Role match" value="AI" />
        </div>
      </section>

      <section className="auth-card">
        <div className="auth-card-head">
          <div>
            <p className="eyebrow">{mode === 'signup' ? 'Create account' : mode === 'forgot' ? 'Recover account' : mode === 'reset' ? 'Reset password' : 'Welcome back'}</p>
            <h2>{mode === 'signup' ? 'Sign up' : mode === 'forgot' ? 'Forgot password' : mode === 'reset' ? 'Set new password' : 'Sign in'}</h2>
          </div>
          <button className="icon-button" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <form className="auth-form" onSubmit={submit}>
          {mode === 'signup' && (
            <label>
              Full name
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" />
            </label>
          )}

          {mode !== 'reset' && (
            <label>
              Email
              <span className="input-wrap">
                <Mail size={17} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="you@example.com"
                  required
                />
              </span>
            </label>
          )}

          {mode === 'reset' && (
            <label>
              Reset token
              <input value={form.token} onChange={(event) => setForm({ ...form, token: event.target.value })} required />
            </label>
          )}

          {mode !== 'forgot' && (
            <label>
              Password
              <span className="input-wrap">
                <Lock size={17} />
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  placeholder="Password"
                  required
                />
              </span>
            </label>
          )}

          {message && <p className={cx('form-message', apiOnline ? 'success' : 'error')}>{message}</p>}

          <button className="primary-button" type="submit" disabled={busy}>
            {busy ? 'Please wait' : mode === 'signup' ? 'Create account' : mode === 'forgot' ? 'Send reset link' : mode === 'reset' ? 'Reset password' : 'Sign in'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-actions">
          {mode !== 'login' && <button type="button" onClick={() => setMode('login')}>Back to sign in</button>}
          {mode === 'login' && <button type="button" onClick={() => setMode('signup')}>Create account</button>}
          {mode === 'login' && <button type="button" onClick={() => setMode('forgot')}>Forgot password</button>}
        </div>
      </section>
    </main>
  );
}

const navCategories = [
  {
    title: 'Core Workspace',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'profile', label: 'My Profile', icon: User },
      { id: 'notifications', label: 'Notifications', icon: Bell },
    ]
  },
  {
    title: 'AI Intelligence',
    items: [
      { id: 'copilot', label: 'AI Copilot', icon: Sparkles },
      { id: 'liveInterview', label: 'AI Live Interviewer', icon: CalendarCheck },
      { id: 'chat', label: 'AI Career Chat', icon: Bot },
      { id: 'salary', label: 'Salary Insights', icon: Calculator },
      { id: 'flashcards', label: 'Interview Flashcards', icon: Code2 },
    ]
  },
  {
    title: 'Resume & Documents',
    items: [
      { id: 'resume', label: 'Resume Lab', icon: FileText },
      { id: 'templates', label: 'Premium Templates', icon: Sparkles },
      { id: 'coverLetter', label: 'Cover Letter', icon: Mail },
    ]
  },
  {
    title: 'Career & Placement',
    items: [
      { id: 'roadmap', label: 'Career Roadmap', icon: Target },
      { id: 'roles', label: 'Roles & Jobs', icon: Briefcase },
      { id: 'interview', label: 'Mock Tests', icon: CalendarCheck },
      { id: 'applications', label: 'Applications Tracker', icon: ClipboardList },
      { id: 'adminAnalytics', label: 'University Analytics', icon: ShieldCheck },
    ]
  }
];

function Sidebar({ activePage, setActivePage, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="logo-tile"><Sparkles size={19} /></span>
        <div>
          <strong>CareerAI Pro</strong>
          <small>Career Acceleration Platform</small>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navCategories.map((category) => (
          <div key={category.title} className="sidebar-category">
            <span className="sidebar-category-title">{category.title}</span>
            <div className="sidebar-category-items">
              {category.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    className={cx('sidebar-item', isActive && 'active')}
                    type="button"
                    onClick={() => setActivePage(item.id)}
                  >
                    <Icon size={17} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="status-card">
          <Zap size={18} />
          <span>AI Engine Active & Connected</span>
        </div>
        <button className="logout-button" type="button" onClick={onLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

function MobileNav({ activePage, setActivePage }) {
  return (
    <nav className="mobile-nav">
      {navItems.slice(0, 5).map((item) => {
        const Icon = item.icon;
        return (
          <button key={item.id} type="button" className={cx(activePage === item.id && 'active')} onClick={() => setActivePage(item.id)} title={item.label}>
            <Icon size={20} />
          </button>
        );
      })}
    </nav>
  );
}

function Topbar({ profile, theme, setTheme, loading, apiOnline, onRefresh, unreadCount, dbStatus, onOpenDbModal }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Today</p>
        <h1>{profile?.name && profile.name !== 'Admin User' && profile.name !== 'admin' ? `Welcome, ${profile.name}` : 'Welcome back'}</h1>
      </div>
      <div className="topbar-actions">
        <button 
          className={cx('api-pill', dbStatus?.ok ? 'online' : 'offline')}
          type="button"
          onClick={onOpenDbModal}
          title="Database Diagnostics & Connectivity check"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: 'none',
            background: 'rgba(255, 255, 255, 0.05)',
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '20px',
            fontFamily: 'inherit',
            fontSize: '12px',
            color: 'var(--text)'
          }}
        >
          <ShieldCheck size={14} style={{ color: dbStatus?.ok ? '#10b981' : '#ef4444' }} />
          <span>{dbStatus?.provider === 'MongoDB' ? 'Mongo DB' : 'JSON DB'}</span>
        </button>
        <span className={cx('api-pill', apiOnline ? 'online' : 'offline')}>
          <Activity size={14} />
          {apiOnline ? 'API online' : 'API offline'}
        </span>
        <button className="icon-button" type="button" onClick={onRefresh} disabled={loading} title="Refresh">
          <RefreshCw size={18} className={loading ? 'spin' : ''} />
        </button>
        <button className="icon-button" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="icon-button" type="button" title="Notifications">
          <Bell size={18} />
          {unreadCount ? <span className="badge">{unreadCount}</span> : null}
        </button>
      </div>
    </header>
  );
}

function DashboardPage({ dashboard, notifications, unreadCount, setActivePage, onRefresh }) {
  const latest = dashboard.latestReport;
  const topRole = dashboard.roles?.[0];
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    let isMounted = true;
    apiFetch('/analytics/summary')
      .then((res) => {
        if (isMounted && res && res.summary) {
          setAnalytics(res.summary);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="page-grid">
      <PageHeader
        eyebrow="Dashboard"
        title="Your career progress in one place"
        description="Resume health, role fit, interview streaks, applications, and AI recommendations update as you use the app."
        action={<button className="secondary-button" type="button" onClick={onRefresh}><RefreshCw size={17} /> Refresh</button>}
      />

      <div className="metric-grid">
        <MetricCard icon={Gauge} label="ATS estimate" value={latest ? `${latest.score}%` : '—'} helper={latest ? latest.confidence || 'Latest resume report' : 'Upload resume'} tone={scoreTone(latest?.score || 0)} />
        <MetricCard icon={Target} label="Best role match" value={topRole && latest ? `${topRole.match}%` : '—'} helper={topRole?.title || 'Complete profile'} tone="good" />
        <MetricCard icon={Trophy} label="Mock streak" value={`${dashboard.streak?.current || 0}d`} helper={`Best ${dashboard.streak?.best || 0} days`} tone="excellent" />
        <MetricCard icon={ClipboardList} label="Applications" value={dashboard.appliedJobs?.length || 0} helper={`${dashboard.savedJobs?.length || 0} saved jobs`} tone="neutral" />
      </div>

      <Panel className="span-7" title="ATS snapshot" icon={FileText} action={<button type="button" onClick={() => setActivePage('resume')}>Open Resume Lab <ChevronRight size={16} /></button>}>
        {latest ? (
          <div className="ats-snapshot">
            <ScoreRing score={latest.score} />
            <div>
              <h3>{latest.score >= 80 ? 'Strong resume foundation' : latest.score >= 60 ? 'Good, but not complete' : 'Needs focused improvement'}</h3>
              <p className="muted">Weak sections: {latest.weakSections?.join(', ') || 'No major weak section detected'}.</p>
              <InlineList items={(latest.missingKeywords || []).slice(0, 8)} empty="No missing keywords detected" />
            </div>
          </div>
        ) : (
          <EmptyState icon={UploadCloud} title="Upload a resume to unlock scoring" text="PDF, DOCX, or TXT resumes are accepted by the backend analyzer." action={<button className="primary-button" type="button" onClick={() => setActivePage('resume')}>Analyze resume <ArrowRight size={17} /></button>} />
        )}
      </Panel>

      <Panel className="span-5" title="Weekly mock progress" icon={BarChart3} action={<button type="button" onClick={() => setActivePage('interview')}>Practice <ChevronRight size={16} /></button>}>
        <Sparkline data={dashboard.weekly || []} />
      </Panel>

      {analytics && (
        <Panel className="span-12" title="Platform Analytics & Funnel Insights" icon={BarChart3}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div style={{ background: 'var(--surface-hover)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Registered Candidates</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--accent)' }}>{analytics.totalUsers || 1}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{analytics.newUsersThisWeek || 1} new this week</div>
            </div>
            <div style={{ background: 'var(--surface-hover)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Active Candidates</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#10b981' }}>{analytics.activeUsersThisWeek || 1}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>7-day activity window</div>
            </div>
            <div style={{ background: 'var(--surface-hover)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Resume Upload Rate</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#3b82f6' }}>{analytics.conversionRates?.resumeUploadRate || 100}%</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{analytics.funnel?.resumeUploaded || 0} resumes scanned</div>
            </div>
            <div style={{ background: 'var(--surface-hover)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Job Application Rate</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#f59e0b' }}>{analytics.conversionRates?.jobApplicationRate || 0}%</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{analytics.funnel?.appliedJobs || 0} applications sent</div>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} style={{ color: '#10b981' }} />
            <span>Privacy Guarantee: Analytics events are strictly aggregated and anonymized. Sensitive resume content is never stored or exposed.</span>
          </div>
        </Panel>
      )}

      <Panel className="span-6" title="Recommended roles" icon={Briefcase} action={<button type="button" onClick={() => setActivePage('roles')}>View all <ChevronRight size={16} /></button>}>
        <div className="stack-list">
          {(dashboard.roles || []).slice(0, 4).map((role) => (
            <RoleRow key={role.id || role.title} role={role} />
          ))}
          {(!dashboard.roles || dashboard.roles.length === 0) && <EmptyState icon={Briefcase} title="No role matches yet" text="Complete profile details and upload a resume." />}
        </div>
      </Panel>

      <Panel className="span-6" title="AI recommendations" icon={Sparkles}>
        <div className="recommendation-list">
          {(dashboard.recommendations || []).slice(0, 5).map((item) => (
            <RecommendationItem key={`${item.type}-${item.title}`} item={item} />
          ))}
        </div>
      </Panel>

      <Panel className="span-6" title={`Notifications ${unreadCount ? `(${unreadCount} unread)` : ''}`} icon={Bell} action={<button type="button" onClick={() => setActivePage('notifications')}>View all <ChevronRight size={16} /></button>}>
        {notifications.length > 0 ? (
          <div className="stack-list">
            {notifications.map((item) => (
              <div key={item.id} className={cx('notification-row', item.unread && 'unread')}>
                <strong>{item.title}</strong>
                <p>{item.message || item.description}</p>
                <span className="notification-date">{formatDate(item.date || item.createdAt)}</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={Bell} title="No notifications yet" text="Live job alerts, application updates, and role recommendations appear here." />
        )}
      </Panel>
    </section>
  );
}

function ResumePage({ profile, latestReport, resumeHistory, setDashboard, setResumeHistory, setToast, request, refresh, setActivePage }) {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [busy, setBusy] = useState(false);

  async function uploadResume(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDescription);
      const data = await request('/resume/upload', { method: 'POST', body: formData });
      setDashboard((current) => ({ ...current, latestReport: data.report }));
      setToast('Resume uploaded and analyzed. Your ATS score is ready.');
      await refresh();
    } catch (error) {
      setToast(error.message);
    } finally {
      setBusy(false);
      event.target.value = '';
    }
  }

  async function analyzeText() {
    if (!resumeText.trim()) {
      setToast('Paste resume text first.');
      return;
    }
    setBusy(true);
    try {
      const data = await request('/resume/analyze', {
        method: 'POST',
        body: JSON.stringify({ text: resumeText, fileName: 'Pasted resume', jobDescription }),
      });
      setDashboard((current) => ({ ...current, latestReport: data.report }));
      const history = await request('/resume/history');
      setResumeHistory(history);
      setToast('Resume text analyzed.');
    } catch (error) {
      setToast(error.message);
    } finally {
      setBusy(false);
    }
  }

  function exportAtsReport() {
    if (!latestReport) return;
    const sectionRows = Object.entries(latestReport.sections || {})
      .map(([key, value]) => `<li><strong>${key}</strong>: ${value}%</li>`)
      .join('');
    printHtml(
      'ARJ ATS Report',
      `<h1>ARJ ATS Report</h1>
       <p class="muted">Generated from your latest resume analysis.</p>
       <h2>Overall score: ${latestReport.score}%</h2>
       ${latestReport.rawScore !== undefined ? `<p class="muted">Internal score: ${latestReport.rawScore}%</p>` : ''}
       ${latestReport.scoreNote ? `<p class="muted">${latestReport.scoreNote}</p>` : ''}
       <p>${latestReport.confidence || ''}</p>
       <p class="muted">${latestReport.scoringModel || ''}</p>
       <div class="section"><h3>Section scores</h3><ul>${sectionRows}</ul></div>
       <div class="section"><h3>Missing keywords</h3><p>${(latestReport.missingKeywords || []).join(', ') || 'None'}</p></div>
       <div class="section"><h3>Matched keywords</h3><p>${(latestReport.matchedKeywords || []).join(', ') || 'None'}</p></div>
       <div class="section"><h3>Recommendations</h3><ul>${(latestReport.recommendations || []).map((item) => `<li>${item}</li>`).join('')}</ul></div>`,
    );
  }

  function exportResumeTemplate() {
    const skills = toCsv(profile.skills);
    printHtml(
      'ARJ Resume',
      `<h1>${profile.name || 'Your Name'}</h1>
       <p class="muted">${profile.email || ''} ${profile.phone ? ` | ${profile.phone}` : ''}</p>
       <p>${profile.summary || 'Career-focused candidate with project experience and strong learning momentum.'}</p>
       <div class="section"><h2>Skills</h2><p>${skills}</p></div>
       <div class="section"><h2>Education</h2><p>${profile.degree || ''} - ${profile.educationField || ''} ${profile.percentage ? `(${profile.percentage})` : ''}</p></div>
       <div class="section"><h2>Projects</h2><ul><li>ARJ-ready project bullet with technology, action, and measurable outcome.</li><li>Portfolio project with live demo, GitHub repository, and recruiter-friendly summary.</li></ul></div>`,
    );
  }

  return (
    <section className="page-grid">
      <PageHeader
        eyebrow="Resume Lab"
        title="Analyze, improve, and rebuild your resume"
        description="Upload PDF, DOCX, or TXT, paste resume text, add a target job description, compare report history, and preview professional templates."
      />

      <Panel className="span-5" title="Upload resume" icon={FileUp}>
        <label className="upload-zone">
          <UploadCloud size={34} />
          <strong>{busy ? 'Analyzing...' : 'Drop in your resume'}</strong>
          <span>PDF, DOCX, or TXT up to 8 MB</span>
          <input type="file" accept=".pdf,.docx,.txt" onChange={uploadResume} disabled={busy} />
        </label>
        <textarea
          className="resume-textarea"
          value={resumeText}
          onChange={(event) => setResumeText(event.target.value)}
          placeholder="Paste resume text here for instant analysis..."
        />
        <textarea
          className="resume-textarea compact"
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          placeholder="Optional but recommended: paste the target job description here for a more genuine ATS estimate..."
        />
        <button className="primary-button full-width" type="button" onClick={analyzeText} disabled={busy}>
          <Sparkles size={17} />
          Analyze pasted resume
        </button>
      </Panel>

      <Panel className="span-7" title="Latest ATS estimate" icon={Gauge} action={latestReport && <button type="button" onClick={exportAtsReport}><Download size={16} /> Export PDF</button>}>
        {latestReport ? (
          <div className="report-layout">
            <ScoreRing score={latestReport.score} />
            <div className="report-detail">
              <h3>Section scoring</h3>
              <p className="muted">{latestReport.confidence}</p>
              {latestReport.scoreNote && (
                <p className="muted" style={{ marginBottom: '12px' }}>{latestReport.scoreNote}</p>
              )}
              <div className="section-score-grid">
                {Object.entries(latestReport.sections || {}).map(([key, value]) => (
                  <div key={key} className="section-score">
                    <span>{key}</span>
                    <ProgressBar value={value} />
                  </div>
                ))}
              </div>
              <div className="report-summary">
                <strong>Weak sections:</strong> {latestReport.weakSections?.length ? latestReport.weakSections.join(', ') : 'None detected'}
              </div>
              {latestReport.formattingIssues?.length > 0 && (
                <div className="report-summary">
                  <strong>Formatting tips:</strong> {(latestReport.formattingIssues || []).slice(0, 3).join(' ')}
                </div>
              )}
            </div>
            <div className="report-notes">
              <div>
                <h3>Missing keywords</h3>
                <InlineList items={(latestReport.missingKeywords || []).slice(0, 12)} empty="No missing keywords detected" />
              </div>
              <div>
                <h3>Matched keywords</h3>
                <InlineList items={(latestReport.matchedKeywords || []).slice(0, 10)} empty="No target keywords matched yet" />
              </div>
              <div>
                <h3>Improve next</h3>
                <ul className="plain-list">
                  {(latestReport.recommendations || []).slice(0, 4).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div>
                <h3>Scoring model</h3>
                <p className="muted">{latestReport.scoringModel || 'Weighted resume score based on sections, keywords, achievements, and formatting.'}</p>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState icon={Gauge} title="No report yet" text="Your ATS score and missing keyword analysis will appear here." />
        )}
      </Panel>

      <Panel className="span-12" title="Get Premium Resume Templates" icon={Star} action={<button type="button" onClick={() => setActivePage('templates')}><Download size={16} /> Go to Templates <ChevronRight size={16} /></button>}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Sparkles size={32} style={{ color: 'var(--accent)', marginBottom: '12px' }} />
          <h3>Professional resume templates with AI formatting</h3>
          <p className="muted">Access 182+ premium templates, real-time preview, and one-click downloads in the Templates section.</p>
          <button className="primary-button" type="button" style={{ marginTop: '12px' }} onClick={() => setActivePage('templates')}>View All Templates <ArrowRight size={16} /></button>
        </div>
      </Panel>

      <Panel className="span-5" title="Version history" icon={History}>
        <div className="stack-list">
          {(resumeHistory.reports || []).slice(0, 8).map((report) => {
            const resume = (resumeHistory.resumes || []).find((item) => item.id === report.resumeId);
            return (
              <div className="history-row" key={report.id}>
                <div>
                  <strong>{resume?.fileName || 'Resume'}</strong>
                  <span>{formatDate(report.createdAt)}</span>
                </div>
                <span className={cx('score-badge', scoreTone(report.score))}>{report.score}%</span>
              </div>
            );
          })}
          {(resumeHistory.reports || []).length === 0 && <EmptyState icon={History} title="No versions yet" text="Each upload creates a saved resume version and ATS report." />}
        </div>
      </Panel>
    </section>
  );
}

function TemplatesPage({ profile, templates, selectedTemplate, setSelectedTemplate, setToast, request }) {
  const [busy, setBusy] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (selectedTemplate && !currentTemplate) {
      const template = templates.find((t) => t.id === selectedTemplate);
      if (template) setCurrentTemplate(template);
    }
  }, [selectedTemplate, templates]);

  const categories = useMemo(() => {
    const cats = new Set(templates.map(t => t.category || 'General'));
    return ['All', ...Array.from(cats).sort()];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    return (templates || []).filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchQuery, selectedCategory]);

  async function renderTemplate(templateId) {
    if (!templateId) {
      setToast('Select a template first.');
      return;
    }

    setBusy(true);
    try {
      const data = await request('/resumes/render-professional', {
        method: 'POST',
        body: JSON.stringify({ templateId }),
      });

      printHtml(data.template.name || 'Premium Resume', data.html);
      setToast('Resume template generated!');
    } catch (error) {
      setToast(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="page-grid">
      <PageHeader
        eyebrow="Premium Templates"
        title="Professional resume templates with AI formatting"
        description={`Browse ${templates.length}+ templates across ${categories.length - 1} categories. All ATS-optimized with 82-96% scores.`}
      />

      <Panel className="span-12" title="Search & Filter" icon={Search}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <input
              type="text"
              placeholder="Search templates by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '6px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {categories.slice(0, 6).map(cat => (
              <button
                key={cat}
                type="button"
                className={cx('secondary-button', selectedCategory === cat && 'primary')}
                onClick={() => setSelectedCategory(cat)}
                style={{ fontSize: '13px', padding: '6px 12px' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      <Panel className="span-9" title={`Template Gallery (${filteredTemplates.length})`} icon={FileText}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              className={cx('template-card premium', currentTemplate?.id === template.id && 'selected')}
              onClick={() => setCurrentTemplate(template)}
              style={{
                padding: '12px',
                border: currentTemplate?.id === template.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                background: currentTemplate?.id === template.id ? 'var(--accent-subtle)' : 'var(--surface)',
                transition: 'all 200ms'
              }}
            >
              <div style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '900', marginBottom: '6px' }}>⭐ {template.atsScore}%</div>
              <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>{template.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{template.category}</div>
            </button>
          ))}
        </div>
      </Panel>

      <Panel className="span-3" title="Template Details" icon={Info}>
        {currentTemplate ? (
          <div>
            <h3 style={{ marginTop: 0, marginBottom: '12px' }}>{currentTemplate.name}</h3>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong>ATS Score</strong>
                <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{currentTemplate.atsScore}%</span>
              </div>
              <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${currentTemplate.atsScore}%`, background: 'var(--accent)' }} />
              </div>
            </div>
            <p className="muted" style={{ marginBottom: '16px', fontSize: '13px' }}>{currentTemplate.description || 'ATS-optimized professional resume template'}</p>
            <div style={{ marginBottom: '16px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '12px' }}>Category:</strong>
              <p className="muted" style={{ fontSize: '13px' }}>{currentTemplate.category}</p>
            </div>
            <button className="primary-button full-width" type="button" onClick={() => renderTemplate(currentTemplate.id)} disabled={busy} style={{ marginBottom: '8px' }}>
              {busy ? 'Generating...' : 'Download PDF'} <Download size={16} />
            </button>
            <button className="secondary-button full-width" type="button" onClick={() => setSearchQuery(currentTemplate.category)}>
              Similar Templates <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          <EmptyState icon={Star} title="Select a template" text={`Choose from ${filteredTemplates.length} templates to preview and download.`} />
        )}
      </Panel>

      <Panel className="span-12" title="Live Preview" icon={Eye}>
        {profile?.name ? (
          <div style={{ maxHeight: '600px', overflow: 'auto', background: 'var(--surface)', padding: '20px', borderRadius: '8px' }}>
            <ResumePreview profile={profile} template={currentTemplate} />
          </div>
        ) : (
          <EmptyState icon={FileText} title="Complete your profile first" text="Add your details in the Profile section to see the resume preview." />
        )}
      </Panel>
    </section>
  );
}

function RolesJobsPage({ profile, roles, setRoles, savedJobs, setSavedJobs, appliedJobs, setAppliedJobs, request, setToast }) {
  const [linksByRole, setLinksByRole] = useState({});
  const [openLinks, setOpenLinks] = useState({});
  const [loadingLinks, setLoadingLinks] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeKind, setActiveKind] = useState('All');
  const jobBuckets = useMemo(() => {
    const safeRoles = (roles || []).filter(r => r && r.title);
    const countBy = (kind) => safeRoles.filter((role) => (role.opportunityKind || role.jobType || '').toLowerCase().includes(kind.toLowerCase())).length;
    return [
      { label: 'All', count: safeRoles.length },
      { label: 'Jobs', count: safeRoles.filter((role) => (role.opportunityKind || role.jobType || '').toLowerCase().includes('job')).length },
      { label: 'Internship', count: countBy('internship') },
      { label: 'Part-time', count: countBy('part-time') },
      { label: 'Full-time', count: safeRoles.filter((role) => (role.jobType || '').toLowerCase().includes('full-time')).length },
    ];
  }, [roles]);
  const filteredRoles = useMemo(
    () =>
      (roles || []).filter((role) => {
        if (!role || !role.title) return false;
        const matchesSearch = (role.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (role.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (role.location || '').toLowerCase().includes(searchQuery.toLowerCase());
        const kindText = `${role.opportunityKind || ''} ${role.jobType || ''}`.toLowerCase();
        const matchesKind =
          activeKind === 'All' ||
          (activeKind === 'Jobs' ? kindText.includes('job') : kindText.includes(activeKind.toLowerCase()));
        return matchesSearch && matchesKind;
      }),
    [roles, searchQuery, activeKind],
  );

  // Auto-refresh roles based on profile changes
  useEffect(() => {
    refreshRoles();
  }, [profile?.email]); // Refresh on page load and profile changes

  async function refreshRoles() {
    try {
      const hasProfileData = profile?.targetRole || profile?.skills?.length > 0 || profile?.degree || profile?.educationField;
      
      if (hasProfileData) {
        // Get intelligent role matches based on profile
        const data = await request('/jobs/intelligent-match', {
          method: 'POST',
          body: JSON.stringify({
            jobType: profile.preferredJobType || 'Any',
            location: profile.locations?.[0] || 'Remote',
            education: profile.education || [profile.degree || profile.educationField].filter(Boolean),
            skills: profile.skills || [],
            targetRole: profile.targetRole || '',
          }),
        });
        setRoles(data.jobs || []);
        setToast('Role recommendations updated based on your profile.');
      } else {
        // Get all available roles if no profile data
        const data = await request('/jobs/all?limit=250', {
          method: 'GET',
        });
        setRoles(data.jobs || []);
        setToast('Showing all available roles. Update your profile for personalized matches.');
      }
    } catch (error) {
      // Fallback: try to get all roles
      try {
        const data = await request('/jobs/all?limit=250', {
          method: 'GET',
        });
        setRoles(data.jobs || []);
      } catch {
        setToast(error.message || 'Unable to fetch roles');
      }
    }
  }

  async function loadLinks(role) {
    if (openLinks[role.title]) {
      setOpenLinks(current => ({ ...current, [role.title]: false }));
      return;
    }

    if (linksByRole[role.title]) {
      setOpenLinks(current => ({ ...current, [role.title]: true }));
      return;
    }

    setLoadingLinks(current => ({ ...current, [role.title]: true }));
    try {
      const location = profile.locations?.[0] || 'Remote';
      const data = await request('/jobs/search-links', {
        method: 'POST',
        body: JSON.stringify({ role: role.title, location })
      });
      setLinksByRole((current) => ({ ...current, [role.title]: data.platforms }));
      setOpenLinks((current) => ({ ...current, [role.title]: true }));
    } catch (error) {
      setToast(error.message);
    } finally {
      setLoadingLinks(current => ({ ...current, [role.title]: false }));
    }
  }

  async function saveJob(role, platform = 'ARJ') {
    try {
      const data = await request('/jobs/save', {
        method: 'POST',
        body: JSON.stringify({ job: { title: role.title, company: 'Open market', location: profile.locations?.[0] || 'Remote', platform, match: role.match } }),
      });
      setSavedJobs([data.job, ...savedJobs]);
      setToast('Job saved.');
    } catch (error) {
      setToast(error.message);
    }
  }

  async function applyJob(role, platform = 'ARJ') {
    try {
      const data = await request('/applications/apply', {
        method: 'POST',
        body: JSON.stringify({
          jobId: role.id || `${role.title}-${role.company || 'ARJ'}`,
          jobData: {
            title: role.title,
            company: role.company || 'Open market',
            location: profile.locations?.[0] || 'Remote',
            platform,
            match: role.match,
            status: 'Applied',
          },
        }),
      });
      setAppliedJobs([data.application, ...appliedJobs]);
      setToast('Application tracked.');
    } catch (error) {
      setToast(error.message);
    }
  }

  return (
    <section className="page-grid">
      <PageHeader
        eyebrow="Roles & Jobs"
        title="Role matches with application links"
        description="Each role includes match percentage, skill gap, roadmap, salary context, and national plus international platforms."
        action={<button className="secondary-button" type="button" onClick={refreshRoles}><RefreshCw size={17} /> Update roles</button>}
      />

      <div className="toolbar span-12">
        <div className="search-box">
          <Search size={18} />
          <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search roles by title, location, or skills..." />
        </div>
        <span>{filteredRoles.length} roles</span>
        <span>{savedJobs.length} saved</span>
        <span>{appliedJobs.length} applied</span>
      </div>

      <div className="job-bucket-grid span-12">
        {jobBuckets.map((bucket) => (
          <button
            key={bucket.label}
            type="button"
            className={cx(activeKind === bucket.label && 'active')}
            onClick={() => setActiveKind(bucket.label)}
          >
            <strong>{bucket.count}</strong>
            <span>{bucket.label}</span>
          </button>
        ))}
      </div>

      {filteredRoles.map((role) => (
        <Panel className="span-6" key={role.title} title={role.title} icon={Briefcase} action={<span className={cx('chance-pill', (role.chance || '').toLowerCase())}>{role.chance || 'Unknown'} chance</span>}>
          <div className="role-card-body">
            <div className="role-score-line">
              <ProgressBar value={role.match} />
              <strong>{role.match}%</strong>
            </div>
            <p className="muted">{role.description}</p>
            <p>{role.why}</p>
            <div className="role-meta">
              <span><GraduationCap size={15} /> {role.field}</span>
              <span><Globe2 size={15} /> {role.availability?.slice(0, 3).join(', ')}</span>
              <span><Target size={15} /> {role.opportunityKind || role.jobType}</span>
              <span><Briefcase size={15} /> {role.jobType}</span>
            </div>
            <div>
              <h3>Skill gap</h3>
              <InlineList items={(role.skillGap || []).map((item) => `${item.skill} - ${item.priority}`)} empty="No critical skill gap" />
            </div>
            <div>
              <h3>Roadmap</h3>
              <ol className="roadmap-list">
                {(role.roadmap || []).slice(0, 5).map((item) => <li key={item}>{item}</li>)}
              </ol>
            </div>
            <p className="salary-text">{role.salary}</p>
            <div className="button-row">
              <button type="button" onClick={() => saveJob(role)}><Save size={16} /> Save</button>
              <button type="button" onClick={() => applyJob(role)}><CheckCircle2 size={16} /> Mark applied</button>
              <button 
                type="button" 
                className={cx(openLinks[role.title] && 'active')} 
                onClick={() => loadLinks(role)} 
                disabled={loadingLinks[role.title]}
              >
                {loadingLinks[role.title] ? (
                  'Loading...'
                ) : (
                  <>
                    <LinkIcon size={16} /> {openLinks[role.title] ? 'Hide Platforms' : 'Platforms'}
                  </>
                )}
              </button>
            </div>
            {openLinks[role.title] && linksByRole[role.title] && (
              <div className="platform-grid">
                {linksByRole[role.title].map((link) => (
                  <a key={link.platform} href={link.url} target="_blank" rel="noreferrer">
                    {link.platform}
                    <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </Panel>
      ))}

      {filteredRoles.length === 0 && (
        <Panel className="span-12" title="No roles found" icon={Search}>
          <EmptyState icon={Briefcase} title="Refresh recommendations" text="Upload a resume or update profile details to generate better role matches." action={<button className="primary-button" type="button" onClick={refreshRoles}>Generate roles <Sparkles size={17} /></button>} />
        </Panel>
      )}
    </section>
  );
}

function InterviewPage({ mockTest, setMockTest, mockAnswers, setMockAnswers, mockResult, setMockResult, weekly, streak, request, refresh, setToast }) {
  const [mode, setMode] = useState('selection'); // 'selection', 'mcq', 'free-text', 'result'
  const [activeCategory, setActiveCategory] = useState(null);
  const [mcqQuestions, setMcqQuestions] = useState([]);
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [mcqResult, setMcqResult] = useState(null);
  
  const [loadingTest, setLoadingTest] = useState(false);
  const [submittingTest, setSubmittingTest] = useState(false);

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedHistoryResult, setSelectedHistoryResult] = useState(null);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [hoveredCard, setHoveredCard] = useState(null);

  // Load practice history
  async function loadHistory() {
    setHistoryLoading(true);
    try {
      const data = await request('/mocktest/history');
      setHistory(data.history || []);
    } catch (error) {
      console.error('Failed to load mock history:', error);
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
    // Check if there is an unfinished MCQ test state saved in localStorage
    const savedCategory = localStorage.getItem('career-ai.active-mcq-category');
    const savedAnswers = localStorage.getItem('career-ai.active-mcq-answers');
    const savedQuestions = localStorage.getItem('career-ai.active-mcq-questions');
    if (savedCategory && savedAnswers && savedQuestions) {
      try {
        setActiveCategory(savedCategory);
        setMcqAnswers(JSON.parse(savedAnswers));
        setMcqQuestions(JSON.parse(savedQuestions));
        setMode('mcq');
        setCurrentQuestion(0);
      } catch (e) {
        localStorage.removeItem('career-ai.active-mcq-category');
        localStorage.removeItem('career-ai.active-mcq-answers');
        localStorage.removeItem('career-ai.active-mcq-questions');
      }
    }
  }, []);

  // Save active answers to localStorage to prevent data loss on page reload
  useEffect(() => {
    if (mode === 'mcq' && activeCategory && mcqQuestions.length) {
      localStorage.setItem('career-ai.active-mcq-category', activeCategory);
      localStorage.setItem('career-ai.active-mcq-questions', JSON.stringify(mcqQuestions));
      localStorage.setItem('career-ai.active-mcq-answers', JSON.stringify(mcqAnswers));
    }
  }, [mcqAnswers, mode, activeCategory, mcqQuestions]);

  // Clear saved test state from localStorage
  function clearSavedState() {
    localStorage.removeItem('career-ai.active-mcq-category');
    localStorage.removeItem('career-ai.active-mcq-answers');
    localStorage.removeItem('career-ai.active-mcq-questions');
  }

  // Load questions for an MCQ round
  async function startMcqRound(categoryId) {
    setLoadingTest(true);
    try {
      const data = await request(`/mocktest/round/${categoryId}`);
      setMcqQuestions(data.questions || []);
      setMcqAnswers({});
      setActiveCategory(categoryId);
      setCurrentQuestion(0);
      setMcqResult(null);
      setMode('mcq');
    } catch (error) {
      setToast(error.message);
    } finally {
      setLoadingTest(false);
    }
  }

  // Submit MCQ Answers
  async function submitMcqTest() {
    setSubmittingTest(true);
    try {
      const data = await request(`/mocktest/round/${activeCategory}/submit`, {
        method: 'POST',
        body: JSON.stringify({ answers: mcqAnswers })
      });
      setMcqResult(data.result);
      clearSavedState();
      setToast('✅ Practice round completed successfully!');
      setMode('result');
      await refresh();
      await loadHistory();
    } catch (error) {
      setToast(error.message);
    } finally {
      setSubmittingTest(false);
    }
  }

  // Load today's written test
  async function startDailyMixed() {
    setLoadingTest(true);
    try {
      const data = await request('/mocktest/today');
      setMockTest(data);
      setMockAnswers({});
      setMockResult(null);
      setCurrentQuestion(0);
      setMode('free-text');
    } catch (error) {
      setToast(error.message);
    } finally {
      setLoadingTest(false);
    }
  }

  async function submitDailyMixed() {
    if (mockAnswers && Object.values(mockAnswers).every(a => !a?.trim())) {
      setToast('Please answer at least one question before submitting.');
      return;
    }

    setSubmittingTest(true);
    try {
      const data = await request('/mocktest/submit', {
        method: 'POST',
        body: JSON.stringify({
          answers: mockAnswers,
          questions: mockTest.questions,
          category: mockTest.difficulty || 'Mixed',
        }),
      });
      setMockResult(data.result);
      setToast('✅ Mock test submitted! Check your feedback.');
      setMode('result');
      await refresh();
      await loadHistory();
    } catch (error) {
      setToast(error.message);
    } finally {
      setSubmittingTest(false);
    }
  }

  // Written test progress calculation
  const writtenProgress = mockTest?.questions?.length > 0 
    ? Math.round((Object.keys(mockAnswers || {}).filter(k => mockAnswers[k]?.trim()).length / mockTest?.questions?.length) * 100)
    : 0;

  // Render Selection Dashboard
  if (mode === 'selection') {
    return (
      <section className="page-grid">
        <PageHeader
          eyebrow="Interview Practice Rounds"
          title="Choose your assessment round"
          description="Prepare with targeted MCQ rounds for Aptitude, Coding, Technical Assessment, and Communication, or take the AI-generated Daily Mixed Test."
        />

        <div className="metric-grid span-12">
          <MetricCard 
            icon={Trophy} 
            label="Current streak" 
            value={`${streak?.current || 0}d`} 
            helper={`Best: ${streak?.best || 0}d`} 
            tone="excellent" 
          />
          <MetricCard 
            icon={BarChart3} 
            label="Average Score" 
            value={history.length ? `${Math.round(history.reduce((sum, item) => sum + item.score, 0) / history.length)}%` : '0%'} 
            helper="All rounds" 
            tone="good" 
          />
          <MetricCard 
            icon={Star} 
            label="Total Practices" 
            value={history.length} 
            helper="Completed tests" 
            tone="neutral" 
          />
          <MetricCard 
            icon={ListChecks} 
            label="Streak Badge" 
            value={(streak?.current || 0) >= 7 ? '🥈 Silver' : (streak?.current || 0) >= 3 ? '🥉 Bronze' : '🌟 Start'} 
            helper="Consistency reward" 
            tone="neutral" 
          />
        </div>

        <div className="span-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {[
            { id: 'aptitude', name: 'Aptitude Practice', desc: 'Quantitative aptitude, logical reasoning, sequence completion, and arithmetic analysis.', icon: Calculator, color: '#3b82f6', format: 'MCQ Assessment' },
            { id: 'coding', name: 'Coding Assessment', desc: 'Syntax evaluation, data structures, recursion complexity, and sorting algorithms.', icon: Code2, color: '#10b981', format: 'MCQ Assessment' },
            { id: 'technical', name: 'Technical Assessment', desc: 'Core CS concepts, operating system internals, database normalization, and networking protocols.', icon: Cpu, color: '#8b5cf6', format: 'MCQ Assessment' },
            { id: 'communication', name: 'Communication & HR', desc: 'Situational judgment, out-of-scope negotiations, peer reviews, and behavioral scenarios.', icon: MessageSquare, color: '#ec4899', format: 'MCQ Assessment' },
          ].map(round => (
            <div key={round.id} style={{
              background: 'var(--panel)',
              border: hoveredCard === round.id ? `1px solid ${round.color}` : '1px solid var(--border)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transform: hoveredCard === round.id ? 'translateY(-4px)' : 'none',
              boxShadow: hoveredCard === round.id ? '0 10px 20px rgba(0,0,0,0.15)' : 'none'
            }}
            onMouseEnter={() => setHoveredCard(round.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => startMcqRound(round.id)}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '60px',
                background: `radial-gradient(circle, ${round.color}15 0%, transparent 70%)`,
                borderRadius: '0 0 0 100%'
              }} />
              <div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `${round.color}15`,
                  color: round.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <round.icon size={24} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: round.color, background: `${round.color}10`, padding: '2px 8px', borderRadius: '12px', textTransform: 'uppercase' }}>
                    {round.format}
                  </span>
                </div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>{round.name}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', height: '60px', overflow: 'hidden' }}>{round.desc}</p>
              </div>
              <button type="button" className="primary-button" style={{ marginTop: '20px', width: '100%', background: round.color, border: 'none' }} onClick={(e) => { e.stopPropagation(); startMcqRound(round.id); }}>
                Start Practice →
              </button>
            </div>
          ))}
        </div>

        <div className="span-12" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '24px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--panel) 0%, rgba(59, 130, 246, 0.05) 100%)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ flex: '1 1 500px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--accent)', background: 'var(--accent-subtle)', padding: '2px 8px', borderRadius: '12px', textTransform: 'uppercase' }}>
                  Written Assessment
                </span>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#f59e0b', background: '#f59e0b10', padding: '2px 8px', borderRadius: '12px' }}>
                  AI Graded
                </span>
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600' }}>Daily Comprehensive Written Test</h3>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Take our signature daily mixed assessment covering HR, coding logic, and situational judgment. Answer using free-text paragraphs to get personalized, granular AI suggestions on metrics, clarity, and keyword optimization.
              </p>
            </div>
            <button className="primary-button" style={{ height: '48px', padding: '0 24px' }} onClick={startDailyMixed}>
              <CalendarCheck size={18} style={{ marginRight: '8px' }} /> Start Written Test
            </button>
          </div>
        </div>

        <Panel className="span-12" title="Practice History & Past Results" icon={History}>
          {historyLoading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <RefreshCw size={24} className="spin" style={{ color: 'var(--accent)', marginBottom: '8px' }} />
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>Loading history...</p>
            </div>
          ) : history.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '13px' }}>
                    <th style={{ padding: '12px 16px' }}>Date</th>
                    <th style={{ padding: '12px 16px' }}>Round</th>
                    <th style={{ padding: '12px 16px' }}>Format</th>
                    <th style={{ padding: '12px 16px' }}>Score</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border)', fontSize: '14px' }} className="table-row-hover">
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Clock size={14} />
                          {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: '600' }}>{item.category}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 'bold',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: item.type === 'MCQ' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          color: item.type === 'MCQ' ? '#3b82f6' : '#f59e0b'
                        }}>
                          {item.type === 'MCQ' ? 'MCQ Practice' : 'Written response'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: 'bold',
                          color: item.score >= 80 ? '#10b981' : item.score >= 50 ? '#f59e0b' : '#ef4444'
                        }}>
                          {item.score}%
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <button type="button" className="secondary-button" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => {
                          setSelectedHistoryResult(item);
                          setMode('result');
                        }}>
                          <Eye size={14} style={{ marginRight: '6px' }} /> Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState icon={ClipboardList} title="No practice records yet" text="Your completed assessment scores, scores by round, and AI suggestions will be listed here." />
          )}
        </Panel>
      </section>
    );
  }

  // Render MCQ Practice Interface
  if (mode === 'mcq') {
    const activeQuestion = mcqQuestions[currentQuestion];
    const totalQ = mcqQuestions.length;
    const progressPercent = totalQ > 0 ? Math.round((Object.keys(mcqAnswers).length / totalQ) * 100) : 0;

    return (
      <section className="page-grid">
        <PageHeader
          eyebrow={`${activeCategory ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1) : ''} Practice`}
          title="Multiple Choice Assessment"
          description="Read each question carefully and select the best option. Submit your answers at the end for immediate feedback."
        />

        <Panel className="span-7" title={`Question ${currentQuestion + 1} of ${totalQ}`} icon={ListChecks} 
          action={
            <button type="button" className="secondary-button" style={{ border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', fontSize: '12px' }} onClick={() => {
              if (window.confirm("Are you sure you want to exit? Your progress in this round will be saved.")) {
                setMode('selection');
              }
            }}>
              Exit Round
            </button>
          }
        >
          {loadingTest ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <RefreshCw size={24} className="spin" style={{ color: 'var(--accent)', marginBottom: '8px' }} />
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>Loading questions...</p>
            </div>
          ) : activeQuestion ? (
            <div>
              {/* Progress Bar */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <small style={{ fontWeight: 'bold' }}>Progress: {progressPercent}%</small>
                  <small style={{ color: 'var(--text-muted)' }}>{Object.keys(mcqAnswers).length} of {totalQ} answered</small>
                </div>
                <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--accent)', transition: 'width 200ms' }} />
                </div>
              </div>

              {/* Question Text */}
              <div style={{
                background: 'var(--surface)',
                padding: '24px',
                borderRadius: '12px',
                marginBottom: '24px',
                border: '1px solid var(--border)'
              }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', lineHeight: '1.6' }}>
                  {activeQuestion.question}
                </h3>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {activeQuestion.options.map((option, idx) => {
                  const isSelected = mcqAnswers[activeQuestion.id] === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMcqAnswers({ ...mcqAnswers, [activeQuestion.id]: idx })}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '16px 20px',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                        background: isSelected ? 'var(--accent-subtle)' : 'var(--panel)',
                        color: 'var(--text)',
                        fontSize: '15px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'border-color 0.2s, background-color 0.2s',
                        fontWeight: isSelected ? '600' : 'normal'
                      }}
                    >
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: isSelected ? '2px solid var(--accent)' : '1px solid var(--text-muted)',
                        background: isSelected ? 'var(--accent)' : 'transparent',
                        color: isSelected ? 'white' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <div>{option}</div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="secondary-button"
                  style={{ opacity: currentQuestion === 0 ? 0.5 : 1 }}
                >
                  ← Previous
                </button>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {mcqQuestions.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentQuestion(idx)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        border: 'none',
                        background: idx === currentQuestion 
                          ? 'var(--accent)' 
                          : mcqAnswers[mcqQuestions[idx]?.id] !== undefined 
                            ? 'var(--accent-subtle)' 
                            : 'var(--border)',
                        color: idx === currentQuestion ? 'white' : 'var(--text)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentQuestion(Math.min(totalQ - 1, currentQuestion + 1))}
                  disabled={currentQuestion === totalQ - 1}
                  className="secondary-button"
                  style={{ opacity: currentQuestion === totalQ - 1 ? 0.5 : 1 }}
                >
                  Next →
                </button>
              </div>
            </div>
          ) : (
            <EmptyState icon={ListChecks} title="No questions loaded" text="An error occurred while loading this practice round." />
          )}
        </Panel>

        <Panel className="span-5" title="Practice Summary" icon={BarChart3}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                This practice contains <strong>{totalQ} questions</strong> testing core skills in {activeCategory}. Take your time to choose the correct options.
              </p>
              <div style={{
                background: 'var(--surface)',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '13px',
                border: '1px solid var(--border)',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Answered:</span>
                  <strong>{Object.keys(mcqAnswers).length} / {totalQ}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Unanswered:</span>
                  <strong>{totalQ - Object.keys(mcqAnswers).length}</strong>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="primary-button full-width"
              style={{ height: '48px' }}
              disabled={submittingTest}
              onClick={submitMcqTest}
            >
              {submittingTest ? (
                <>
                  <RefreshCw size={16} className="spin" style={{ marginRight: '8px' }} /> Evaluating...
                </>
              ) : (
                <>
                  <Send size={16} style={{ marginRight: '8px' }} /> Submit Answers
                </>
              )}
            </button>
          </div>
        </Panel>
      </section>
    );
  }

  // Render Written Test Interface (Free text)
  if (mode === 'free-text') {
    return (
      <section className="page-grid">
        <PageHeader
          eyebrow="Daily comprehensive mock test"
          title="Practice written assessments"
          description="Answer HR, technical, aptitude, and role-specific questions with detailed answers to get semantic keyword grading."
          action={
            <button type="button" className="secondary-button" style={{ border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', fontSize: '12px' }} onClick={() => {
              if (window.confirm("Are you sure you want to exit? Your progress in this round will not be saved.")) {
                setMode('selection');
              }
            }}>
              Exit Round
            </button>
          }
        />

        <div className="metric-grid span-12">
          <MetricCard 
            icon={Trophy} 
            label="Current streak" 
            value={`${streak?.current || 0}d`} 
            helper={`Best: ${streak?.best || 0}d`} 
            tone="excellent" 
          />
          <MetricCard 
            icon={BarChart3} 
            label="Last score" 
            value={mockResult ? `${mockResult.score}%` : `${weekly?.filter((item) => item.score).at(-1)?.score || 0}%`} 
            helper="Daily average" 
            tone="good" 
          />
          <MetricCard 
            icon={Star} 
            label="Streak Badge" 
            value={(streak?.current || 0) >= 7 ? '🥈 Silver' : (streak?.current || 0) >= 3 ? '🥉 Bronze' : '🌟 Start'} 
            helper="Consistency reward" 
            tone="neutral" 
          />
          <MetricCard 
            icon={ListChecks} 
            label="Questions" 
            value={mockTest.questions?.length || 0} 
            helper={`${writtenProgress}% answered`} 
            tone="neutral" 
          />
        </div>

        <Panel className="span-7" title={`Written Questions (${currentQuestion + 1}/${mockTest.questions?.length || 0})`} icon={CalendarCheck}>
          {mockTest.questions && mockTest.questions.length > 0 ? (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <small style={{ fontWeight: 'bold' }}>Progress: {writtenProgress}%</small>
                  <small style={{ color: 'var(--text-muted)' }}>{Object.keys(mockAnswers || {}).filter(k => mockAnswers[k]?.trim()).length} answered</small>
                </div>
                <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${writtenProgress}%`, background: 'var(--accent)', transition: 'width 200ms' }} />
                </div>
              </div>

              <div style={{
                background: 'var(--surface)',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '20px',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <span style={{
                    display: 'inline-block',
                    background: 'var(--accent)',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    {mockTest.questions[currentQuestion]?.category || 'Mixed'}
                  </span>
                </div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', lineHeight: '1.5' }}>
                  {currentQuestion + 1}. {mockTest.questions[currentQuestion]?.question}
                </h3>
                {mockTest.questions[currentQuestion]?.hints && (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', background: 'var(--panel)', padding: '10px 12px', borderRadius: '6px', borderLeft: '3px solid var(--accent)', margin: '0 0 12px 0' }}>
                    <strong>Hint:</strong> {mockTest.questions[currentQuestion]?.hints}
                  </p>
                )}
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                  Take your time. Quality answers matter more than speed.
                </p>
              </div>

              <textarea
                value={mockAnswers[mockTest.questions[currentQuestion]?.id] || ''}
                onChange={(event) => setMockAnswers({ ...mockAnswers, [mockTest.questions[currentQuestion]?.id]: event.target.value })}
                placeholder="Type your detailed answer here. Include examples and specific outcomes for better scoring..."
                style={{
                  width: '100%',
                  height: '240px',
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  resize: 'vertical',
                  marginBottom: '16px'
                }}
              />

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="secondary-button"
                  style={{ opacity: currentQuestion === 0 ? 0.5 : 1 }}
                >
                  ← Previous
                </button>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {mockTest?.questions?.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentQuestion(idx)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        border: 'none',
                        background: idx === currentQuestion ? 'var(--accent)' : mockAnswers[mockTest?.questions?.[idx]?.id]?.trim() ? 'var(--accent-subtle)' : 'var(--border)',
                        color: idx === currentQuestion ? 'white' : 'var(--text)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentQuestion(Math.min(mockTest?.questions?.length - 1, currentQuestion + 1))}
                  disabled={currentQuestion === (mockTest?.questions?.length || 1) - 1}
                  className="secondary-button"
                  style={{ opacity: currentQuestion === (mockTest?.questions?.length || 1) - 1 ? 0.5 : 1 }}
                >
                  Next →
                </button>
              </div>
            </div>
          ) : (
            <EmptyState icon={CalendarCheck} title="Load today's test" text="Click 'Today's test' button above to start your daily interview practice." />
          )}
        </Panel>

        <Panel className="span-5" title="Submit Assessment" icon={BarChart3}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', justifyContent: 'space-between' }}>
            <div>
              <Sparkline data={weekly || []} />
              <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Grades are based on keyword matching and detailed length check. Answer all questions to get the most accurate AI score.
              </p>
            </div>
            <button
              type="button"
              className="primary-button full-width"
              style={{ height: '48px' }}
              disabled={submittingTest}
              onClick={submitDailyMixed}
            >
              {submittingTest ? (
                <>
                  <RefreshCw size={16} className="spin" style={{ marginRight: '8px' }} /> Grading...
                </>
              ) : (
                <>
                  <Send size={16} style={{ marginRight: '8px' }} /> Submit Written Test
                </>
              )}
            </button>
          </div>
        </Panel>
      </section>
    );
  }

  // Render Result / Review Report Interface
  if (mode === 'result' && (mcqResult || selectedHistoryResult)) {
    const result = selectedHistoryResult || mcqResult;
    const isMcq = result.type === 'MCQ';

    return (
      <section className="page-grid">
        <PageHeader
          eyebrow="Assessment Report"
          title={result.category}
          description={`Completed on ${new Date(result.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
          action={
            <button type="button" className="primary-button" onClick={() => {
              setMode('selection');
              setMcqResult(null);
              setSelectedHistoryResult(null);
            }}>
              Back to Selection
            </button>
          }
        />

        <div className="metric-grid span-12">
          <MetricCard 
            icon={Trophy} 
            label="Assessment Score" 
            value={`${result.score}%`} 
            helper={result.score >= 80 ? 'Excellent performance! 🌟' : result.score >= 50 ? 'Good effort! 👍' : 'Keep practicing! 📈'} 
            tone={result.score >= 80 ? 'excellent' : result.score >= 50 ? 'good' : 'caution'} 
          />
          <MetricCard 
            icon={ListChecks} 
            label="Format" 
            value={isMcq ? 'Multiple Choice' : 'Written response'} 
            helper={isMcq ? 'Direct option mapping' : 'AI semantic evaluation'} 
            tone="neutral" 
          />
          <MetricCard 
            icon={Star} 
            label="Round Status" 
            value={result.score >= 80 ? 'Passed' : result.score >= 50 ? 'Cleared' : 'Retry recommended'} 
            helper="Competency rating" 
            tone={result.score >= 50 ? 'good' : 'neutral'} 
          />
        </div>

        {isMcq ? (
          /* MCQ Review Panel */
          <Panel className="span-12" title="Question-by-Question Review" icon={ListChecks}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {(result.feedback || []).map((item, index) => {
                const hasSelected = item.selectedOption !== null && item.selectedOption !== undefined;
                return (
                  <div key={item.id || index} style={{
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '20px',
                    background: 'var(--panel)',
                    position: 'relative'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        background: item.isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: item.isCorrect ? '#10b981' : '#ef4444',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {item.isCorrect ? <Check size={12} /> : <X size={12} />}
                        {item.isCorrect ? 'Correct' : hasSelected ? 'Incorrect' : 'Skipped'}
                      </span>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Q{index + 1}</span>
                    </div>

                    <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', lineHeight: '1.5' }}>
                      {item.question}
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginBottom: '16px' }}>
                      {(item.options || []).map((option, oIdx) => {
                        const isUserSelected = item.selectedOption === oIdx;
                        const isCorrectOption = item.correctOption === oIdx;
                        
                        let optionBg = 'var(--surface)';
                        let optionBorder = 'var(--border)';
                        let optionIcon = null;

                        if (isCorrectOption) {
                          optionBg = 'rgba(16, 185, 129, 0.08)';
                          optionBorder = '#10b981';
                          optionIcon = <Check size={14} style={{ color: '#10b981' }} />;
                        } else if (isUserSelected && !item.isCorrect) {
                          optionBg = 'rgba(239, 68, 68, 0.08)';
                          optionBorder = '#ef4444';
                          optionIcon = <X size={14} style={{ color: '#ef4444' }} />;
                        }

                        return (
                          <div key={oIdx} style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: `1px solid ${optionBorder}`,
                            background: optionBg,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '14px'
                          }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <span style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: isCorrectOption ? '#10b981' : isUserSelected ? '#ef4444' : 'var(--border)',
                                color: isCorrectOption || isUserSelected ? 'white' : 'var(--text-muted)',
                                fontSize: '10px',
                                fontWeight: 'bold'
                              }}>
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span style={{
                                fontWeight: isCorrectOption || isUserSelected ? '600' : 'normal',
                                color: isCorrectOption ? '#10b981' : isUserSelected ? '#ef4444' : 'var(--text)'
                              }}>
                                {option}
                              </span>
                            </div>
                            {optionIcon}
                          </div>
                        );
                      })}
                    </div>

                    {item.explanation && (
                      <div style={{
                        padding: '14px 16px',
                        background: 'rgba(59, 130, 246, 0.05)',
                        borderRadius: '8px',
                        borderLeft: '4px solid #3b82f6',
                        fontSize: '13px',
                        lineHeight: '1.5'
                      }}>
                        <strong>Explanation:</strong> {item.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Panel>
        ) : (
          /* Written response Review Panel */
          <>
            <Panel className="span-7" title="Your Written Responses & Analysis" icon={ListChecks}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(result.feedback || []).map((item, idx) => (
                  <div key={idx} style={{
                    padding: '16px',
                    background: 'var(--panel)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{
                        display: 'inline-block',
                        background: 'var(--accent-subtle)',
                        color: 'var(--accent)',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}>
                        {item.category}
                      </span>
                      <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '13px' }}>Score: {item.score || item.score}%</span>
                    </div>
                    <p style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>Q: {item.question}</p>
                    {result.answers?.[item.id] && (
                      <div style={{
                        padding: '12px',
                        background: 'var(--surface)',
                        borderRadius: '8px',
                        fontSize: '13px',
                        color: 'var(--text-muted)',
                        marginBottom: '12px',
                        borderLeft: '3px solid var(--border)',
                        fontStyle: 'italic'
                      }}>
                        "{result.answers[item.id]}"
                      </div>
                    )}
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                      <strong>AI Suggestion:</strong> {item.note || item.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>
            
            <Panel className="span-5" title="Score Breakdown" icon={BarChart3}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'conic-gradient(var(--accent) 0deg ' + (result.score * 3.6) + 'deg, var(--border) ' + (result.score * 3.6) + 'deg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  color: 'white',
                  fontSize: '32px',
                  fontWeight: 'bold'
                }}>
                  {result.score}%
                </div>
                <p style={{ marginTop: '12px', fontSize: '14px', color: 'var(--text-muted)' }}>Overall Score</p>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', textAlign: 'center' }}>
                Your responses were graded using semantic keyword matching and comprehensive structural analysis. Build your streak daily to unlock advanced questions!
              </p>
            </Panel>
          </>
        )}
      </section>
    );
  }

  return null;
}

function ChatPage({ messages, setMessages, request, setToast }) {
  const [input, setInput] = useState('');
  const prompts = ['Improve my resume', 'What roles suit me?', 'Show my skill gap', 'Plan interview prep'];

  async function sendMessage(text = input) {
    if (!text.trim()) return;
    const idSeed = messages.length + text.length;
    const localUser = { id: `local-${idSeed}`, role: 'user', text, createdAt: new Date().toISOString() };
    setMessages((current) => [...current, localUser]);
    setInput('');

    try {
      const data = await request('/chatbot/real', {
        method: 'POST',
        body: JSON.stringify({ message: text }),
      });
      setMessages((current) => [...current, { id: `ai-${idSeed}`, role: 'ai', text: data.reply, createdAt: new Date().toISOString() }]);
    } catch (error) {
      setToast(error.message);
    }
  }

  return (
    <section className="page-grid">
      <PageHeader
        eyebrow="AI Chat"
        title="Ask career, resume, role, and interview doubts"
        description="The chatbot uses your saved profile, latest ATS report, role recommendations, and mock-test progress."
      />

      <Panel className="span-8 chat-panel" title="Career assistant" icon={Bot}>
        <div className="quick-prompts">
          {prompts.map((prompt) => (
            <button key={prompt} type="button" onClick={() => sendMessage(prompt)}>
              <Sparkles size={15} />
              {prompt}
            </button>
          ))}
        </div>
        <div className="chat-feed">
          {messages.map((message) => (
            <div key={message.id || `${message.role}-${message.createdAt}-${message.text}`} className={cx('chat-message', message.role)}>
              <span>{message.role === 'ai' ? 'ARJ' : 'You'}</span>
              <p>{message.text}</p>
            </div>
          ))}
          {messages.length === 0 && <EmptyState icon={Bot} title="Start with a career question" text="Ask about resumes, jobs, internships, skills, projects, or interview preparation." />}
        </div>
        <div className="chat-composer">
          <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && sendMessage()} placeholder="Ask a doubt..." />
          <button className="primary-button" type="button" onClick={() => sendMessage()}><Send size={17} /> Send</button>
        </div>
      </Panel>

      <Panel className="span-4" title="Chat memory" icon={History}>
        <div className="stack-list">
          {messages.filter((item) => item.role === 'user').slice(-6).map((item) => (
            <div className="history-row" key={item.id || item.createdAt}>
              <div>
                <strong>{item.text}</strong>
                <span>{formatDate(item.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function ProfilePage({ profile, setProfile, request, refresh, setToast, recommendations, setRecommendations }) {
  const [form, setForm] = useState(profile);
  const [saveStatus, setSaveStatus] = useState('');

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateLink(field, value) {
    setForm((current) => ({ ...current, links: { ...(current.links || {}), [field]: value } }));
  }

  async function saveProfile() {
    setSaveStatus('Saving changes...');
    const start = Date.now();
    try {
      const payload = {
        ...form,
        skills: Array.isArray(form.skills) ? form.skills : fromCsv(form.skills),
        locations: Array.isArray(form.locations) ? form.locations : fromCsv(form.locations),
      };
      const data = await request('/profile/update', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      setProfile(data.profile);
      const elapsed = Date.now() - start;
      setSaveStatus(`💾 Saved to Database (${elapsed}ms)`);
      setTimeout(() => setSaveStatus(''), 4000);
      await refresh();
    } catch (error) {
      setSaveStatus('❌ Failed to save');
      setToast(error.message);
    }
  }

  async function loadRecommendations() {
    try {
      const data = await request('/recommendations/get');
      setRecommendations(data.recommendations);
      setToast('Recommendations refreshed.');
    } catch (error) {
      setToast(error.message);
    }
  }

  return (
    <section className="page-grid">
      <PageHeader
        eyebrow="Profile"
        title="Your saved career profile"
        description="This data powers resume scoring, role matches, skill gaps, mock-test questions, and job platform links."
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {saveStatus && <span style={{ fontSize: '13px', color: '#10b981', fontWeight: '500' }}>{saveStatus}</span>}
            <button className="secondary-button" type="button" onClick={saveProfile}><Save size={17} /> Save profile</button>
          </div>
        }
      />

      <Panel className="span-7" title="Personal and education" icon={User}>
        <div className="form-grid">
          <label>Name<input value={form.name || ''} onChange={(event) => updateField('name', event.target.value)} /></label>
          <label>Email<input value={form.email || ''} onChange={(event) => updateField('email', event.target.value)} /></label>
          <label>Phone<input value={form.phone || ''} onChange={(event) => updateField('phone', event.target.value)} /></label>
          <label>Education field<input value={form.educationField || ''} onChange={(event) => updateField('educationField', event.target.value)} /></label>
          <label>Degree/course<input value={form.degree || ''} onChange={(event) => updateField('degree', event.target.value)} /></label>
          <label>Percentage/CGPA<input value={form.percentage || ''} onChange={(event) => updateField('percentage', event.target.value)} /></label>
          <label>Preferred type
            <select value={form.preferredJobType || 'All opportunities'} onChange={(event) => updateField('preferredJobType', event.target.value)}>
              <option>All opportunities</option>
              <option>Jobs</option>
              <option>Internship</option>
              <option>Part-time</option>
              <option>Full-time</option>
            </select>
          </label>
          <label>Target role<input value={form.targetRole || ''} onChange={(event) => updateField('targetRole', event.target.value)} /></label>
          <label className="wide">Skills<input value={toCsv(form.skills)} onChange={(event) => updateField('skills', event.target.value)} /></label>
          <label className="wide">Preferred countries/locations<input value={toCsv(form.locations)} onChange={(event) => updateField('locations', event.target.value)} /></label>
          <label className="wide">Summary<textarea value={form.summary || ''} onChange={(event) => updateField('summary', event.target.value)} /></label>
        </div>
      </Panel>

      <Panel className="span-5" title="Links and AI plan" icon={LinkIcon} action={<button type="button" onClick={loadRecommendations}><Sparkles size={16} /> Refresh AI</button>}>
        <div className="form-grid one-column">
          <label>LinkedIn<input value={form.links?.linkedin || ''} onChange={(event) => updateLink('linkedin', event.target.value)} /></label>
          <label>GitHub<input value={form.links?.github || ''} onChange={(event) => updateLink('github', event.target.value)} /></label>
          <label>Portfolio<input value={form.links?.portfolio || ''} onChange={(event) => updateLink('portfolio', event.target.value)} /></label>
        </div>
        <div className="recommendation-list">
          {(recommendations || []).slice(0, 4).map((item) => <RecommendationItem key={`${item.type}-${item.title}`} item={item} />)}
        </div>
      </Panel>
    </section>
  );
}

function ApplicationsPage({ savedJobs, appliedJobs, setAppliedJobs, request, setToast }) {
  async function updateStatus(job, status) {
    try {
      const data = await request(`/jobs/applied/${job.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setAppliedJobs(appliedJobs.map((item) => (item.id === job.id ? data.job : item)));
    } catch (error) {
      setToast(error.message);
    }
  }

  async function deleteApplication(jobId) {
    try {
      await request(`/applications/${jobId}`, {
        method: 'DELETE',
      });
      setAppliedJobs(appliedJobs.filter((item) => item.id !== jobId));
      setToast('Application deleted.');
    } catch (error) {
      setToast(error.message);
    }
  }

  return (
    <section className="page-grid">
      <PageHeader
        eyebrow="Applications"
        title="Previously saved and applied jobs"
        description="Track application status across LinkedIn, Naukri, Apna, Internshala, Indeed, remote boards, and company career pages."
      />

      <Panel className="span-5" title="Saved jobs" icon={Save}>
        <div className="stack-list">
          {savedJobs.map((job) => <JobRow key={job.id} job={job} />)}
          {savedJobs.length === 0 && <EmptyState icon={Save} title="No saved jobs" text="Save roles from the Roles & Jobs page." />}
        </div>
      </Panel>

      <Panel className="span-7" title="Applied jobs" icon={ClipboardList}>
        <div className="application-table">
          <div className="application-head">
            <span>Role</span>
            <span>Platform</span>
            <span>Status</span>
          </div>
          {appliedJobs.map((job) => (
            <div className="application-row" key={job.id}>
              <div>
                <strong>{job.title}</strong>
                <span>{job.company} - {job.location}</span>
              </div>
              <span>{job.platform}</span>
              <select value={job.status} onChange={(event) => updateStatus(job, event.target.value)}>
                {statusOptions.map((status) => <option key={status}>{status}</option>)}
              </select>
              <button type="button" className="text-button danger" onClick={() => deleteApplication(job.id)}>Delete</button>
            </div>
          ))}
          {appliedJobs.length === 0 && <EmptyState icon={ClipboardList} title="No applications yet" text="Mark a role as applied to build your tracker." />}
        </div>
      </Panel>
    </section>
  );
}

function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="page-header span-12">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action && <div className="page-action">{action}</div>}
    </div>
  );
}

function Panel({ title, icon: Icon, action, className, children }) {
  return (
    <section className={cx('panel', className)}>
      <header className="panel-header">
        <div>
          {Icon && <Icon size={18} />}
          <h2>{title}</h2>
        </div>
        {action && <div className="panel-action">{action}</div>}
      </header>
      {children}
    </section>
  );
}

function MetricCard({ icon: Icon, label, value, helper, tone = 'neutral' }) {
  return (
    <div className={cx('metric-card', tone)}>
      <div className="metric-icon"><Icon size={20} /></div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{helper}</small>
    </div>
  );
}

function MetricMini({ label, value }) {
  return (
    <div className="metric-mini">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function ScoreRing({ score = 0, compact = false }) {
  return (
    <div className={cx('score-ring', compact && 'compact')} style={{ '--score': `${clampScore(score) * 3.6}deg` }}>
      <div>
        <strong>{score}</strong>
        <span>ATS</span>
      </div>
    </div>
  );
}

function clampScore(score) {
  return Math.max(0, Math.min(100, Number(score) || 0));
}

function ProgressBar({ value = 0 }) {
  return (
    <div className="progress-track">
      <span style={{ width: `${clampScore(value)}%` }} />
    </div>
  );
}

function Sparkline({ data = [] }) {
  const max = Math.max(100, ...data.map((item) => item.score || 0));
  return (
    <div className="sparkline">
      {data.map((item) => (
        <div className="spark-day" key={item.date}>
          <div className="spark-bar">
            <span style={{ height: `${((item.score || 0) / max) * 100}%` }} />
          </div>
          <small>{item.label}</small>
          <strong>{item.score || '-'}</strong>
        </div>
      ))}
    </div>
  );
}

function InlineList({ items = [], empty = 'None' }) {
  if (!items.length) return <p className="muted">{empty}</p>;
  return (
    <div className="pill-list">
      {items.map((item) => <span key={item}>{item}</span>)}
    </div>
  );
}

function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="empty-state">
      <Icon size={28} />
      <strong>{title}</strong>
      <p>{text}</p>
      {action}
    </div>
  );
}

function RoleRow({ role }) {
  return (
    <div className="role-row">
      <div>
        <strong>{role.title}</strong>
        <span>{role.jobType} - {role.chance} chance</span>
      </div>
      <div className="mini-progress">
        <ProgressBar value={role.match} />
        <span>{role.match}%</span>
      </div>
    </div>
  );
}

function RecommendationItem({ item }) {
  return (
    <div className="recommendation-item">
      <span>{item.type}</span>
      <strong>{item.title}</strong>
      <p>{item.detail}</p>
    </div>
  );
}

function ResumePreview({ profile, template }) {
  const layout = template?.layout || template?.id || 'classic-ats';
  const sections =
    layout === 'student'
      ? ['Education', 'Projects', 'Skills', 'Certifications']
      : layout === 'project'
        ? ['Projects', 'Skills', 'Education', 'Links']
        : layout === 'analytics'
          ? ['Tools', 'Dashboards', 'Metrics', 'Experience']
          : layout === 'grid'
            ? ['Technical Skills', 'Projects', 'Experience', 'Education']
            : ['Summary', 'Skills', 'Experience', 'Education'];
  return (
    <div className={cx('resume-preview', layout)} style={{ '--template-accent': template?.accent || '#0f172a' }}>
      <div className="resume-preview-head">
        <div>
          <h3>{profile.name || 'Your Name'}</h3>
          <p>{profile.targetRole || 'Target Role'} - {profile.educationField || 'Education Field'}</p>
        </div>
        <span>{template?.name || 'Classic ATS'}</span>
      </div>
      <div className="resume-preview-body">
        <aside>
          <strong>Contact</strong>
          <p>{profile.email || 'email@example.com'}</p>
          <p>{profile.phone || 'Phone'}</p>
          <strong>Skills</strong>
          <InlineList items={Array.isArray(profile.skills) ? profile.skills : fromCsv(profile.skills || '')} empty="Add skills in profile" />
        </aside>
        <main>
          <p>{profile.summary || 'A concise professional summary will appear here.'}</p>
          {sections.map((section) => (
            <div className="resume-preview-section" key={section}>
              <strong>{section}</strong>
              <p>
                {section.toLowerCase().includes('education')
                  ? `${profile.degree || 'Degree'} - ${profile.percentage || 'Percentage/CGPA'}`
                  : 'ATS-friendly bullet with action, skill, and measurable outcome.'}
              </p>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

function JobRow({ job }) {
  return (
    <div className="job-row">
      <div>
        <strong>{job.title}</strong>
        <span>{job.company} - {job.location}</span>
      </div>
      <span>{job.platform}</span>
    </div>
  );
}

function DatabaseModal({ onClose, dbStatus, request }) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  async function runVerification() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await request('/db-verify', { method: 'POST' });
      setTestResult(res);
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message,
        auditLogs: ['[ERROR] Verification aborted: ' + error.message]
      });
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="modal-backdrop" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="modal-container" style={{
        background: 'var(--panel)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '540px',
        padding: '30px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text)',
            cursor: 'pointer',
            opacity: 0.7
          }}
          title="Close"
        >
          <XCircle size={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <span style={{
            background: 'rgba(59, 130, 246, 0.1)',
            padding: '10px',
            borderRadius: '12px',
            color: 'var(--accent)'
          }}>
            <ShieldCheck size={28} />
          </span>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: 'var(--text)' }}>Database Diagnostics</h2>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Connection status and integrity checks</p>
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Storage Provider</span>
            <strong style={{ fontSize: '14px', color: 'var(--text)' }}>
              {dbStatus?.provider || 'JSON Database'}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Connection Status</span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '13px',
              color: '#10b981',
              fontWeight: '600'
            }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }}></span>
              Connected
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Database File Path</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', wordBreak: 'break-all', maxWidth: '60%' }}>
              {dbStatus?.filePath || 'server/data/dev-db.json'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Database File Size</span>
            <strong style={{ fontSize: '14px', color: 'var(--text)' }}>{dbStatus?.fileSizeKB || '0'} KB</strong>
          </div>
        </div>

        <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: 'var(--text)' }}>Storage Inventory Count</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          marginBottom: '24px'
        }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Users</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px', color: 'var(--text)' }}>{dbStatus?.counts?.users || 0}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Resumes</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px', color: 'var(--text)' }}>{dbStatus?.counts?.resumes || 0}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Applied</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px', color: 'var(--text)' }}>{dbStatus?.counts?.appliedJobs || 0}</div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <button
            onClick={runVerification}
            disabled={testing}
            className="primary-button"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <RefreshCw size={16} className={testing ? 'spin' : ''} />
            {testing ? 'Verifying Write/Read Latency...' : 'Run Live DB Verification Test'}
          </button>

          {testResult && (
            <div style={{
              background: testResult.success ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
              border: `1px solid ${testResult.success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
              borderRadius: '16px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: testResult.success ? '#10b981' : '#ef4444' }}>
                  {testResult.success ? '✅ Test Passed' : '❌ Test Failed'}
                </span>
                {testResult.latencyMs && (
                  <span style={{ fontSize: '13px', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text)' }}>
                    Latency: {testResult.latencyMs}ms
                  </span>
                )}
              </div>
              <div style={{
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '8px',
                padding: '10px',
                maxHeight: '120px',
                overflowY: 'auto',
                fontFamily: 'monospace',
                fontSize: '11px',
                color: 'var(--text-muted)',
                lineHeight: '1.5',
                textAlign: 'left'
              }}>
                {(testResult.auditLogs || []).map((logLine, idx) => (
                  <div key={idx}>{logLine}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
