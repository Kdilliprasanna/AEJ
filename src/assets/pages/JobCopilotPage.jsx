import { useState } from 'react';
import { 
  Sparkles, 
  Briefcase, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  Save, 
  CalendarCheck, 
  HelpCircle
} from 'lucide-react';

export default function JobCopilotPage({ roles, request, setToast, setActivePage }) {
  const [jobTitle, setJobTitle] = useState('Senior Full Stack Engineer');
  const [company, setCompany] = useState('TechCorp Innovations');
  const [jobDescription, setJobDescription] = useState(
    'Seeking a Senior Full Stack Engineer proficient in React, Node.js, Express, and PostgreSQL. Responsible for designing scalable REST APIs, building glassmorphic UI components, optimizing database queries, and leading CI/CD deployment pipelines.'
  );
  const [busy, setBusy] = useState(false);
  const [copilotData, setCopilotData] = useState(null);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);
  const [savedToKanban, setSavedToKanban] = useState(false);

  async function runCopilotAnalysis(selectedJob) {
    const targetTitle = selectedJob ? selectedJob.title : jobTitle;
    const targetCompany = selectedJob ? selectedJob.company : company;
    const targetDesc = selectedJob ? (selectedJob.description || selectedJob.summary || '') : jobDescription;

    if (selectedJob) {
      setJobTitle(targetTitle);
      setCompany(targetCompany);
      if (targetDesc) setJobDescription(targetDesc);
    }

    setBusy(true);
    setSavedToKanban(false);
    try {
      const res = await request('/copilot/analyze-job', {
        method: 'POST',
        body: JSON.stringify({
          jobTitle: targetTitle,
          company: targetCompany,
          jobDescription: targetDesc,
          requiredSkills: selectedJob?.requiredSkills || ['React', 'Node.js', 'PostgreSQL', 'System Design']
        })
      });
      if (res && res.session) {
        setCopilotData(res.session.analysis);
        setToast(`Copilot analysis generated! ${res.session.matchScore}% Job Match`);
      }
    } catch (err) {
      setToast(err.message || 'Failed to run Copilot analysis');
    } finally {
      setBusy(false);
    }
  }

  async function saveToKanbanTracker() {
    if (!copilotData) return;
    try {
      await request('/applications/apply', {
        method: 'POST',
        body: JSON.stringify({
          jobId: 'copilot-' + Date.now(),
          jobData: {
            title: copilotData.jobTitle,
            company: copilotData.company,
            status: 'Applied'
          }
        })
      });
      setSavedToKanban(true);
      setToast(`Saved ${copilotData.jobTitle} at ${copilotData.company} to Kanban Tracker!`);
    } catch (err) {
      setToast(err.message || 'Failed to save application');
    }
  }

  function copyCoverLetter() {
    if (!copilotData?.coverLetterDraft) return;
    navigator.clipboard.writeText(copilotData.coverLetterDraft);
    setCopiedCoverLetter(true);
    setTimeout(() => setCopiedCoverLetter(false), 2500);
    setToast('Cover letter copied to clipboard!');
  }

  return (
    <div className="page-grid" style={{ gap: '24px' }}>
      {/* Header */}
      <div className="span-12" style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ background: 'var(--accent-gradient)', padding: '10px', borderRadius: '10px', color: 'white' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>AI Job Application Copilot</h1>
            <p className="muted" style={{ margin: 0, fontSize: '14px' }}>
              All-in-one target job analysis, ATS resume tailoring, cover letter drafting, and interview prep.
            </p>
          </div>
        </div>
      </div>

      {/* Input Panel */}
      <div className="span-5" style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Briefcase size={18} style={{ color: 'var(--accent)' }} /> Select or Paste Job
        </h3>

        {/* Quick select from recommended roles */}
        {roles && roles.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
              Quick Select from Recommended Jobs:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '110px', overflowY: 'auto' }}>
              {roles.slice(0, 5).map((role) => (
                <button
                  key={role.id || role.title}
                  type="button"
                  onClick={() => runCopilotAnalysis(role)}
                  className="secondary-button"
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                >
                  {role.title} @ {role.company}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Company Name</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. TechCorp"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Job Description / Requirements</label>
            <textarea
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste full job description here..."
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', resize: 'vertical' }}
            />
          </div>
          <button
            className="primary-button full-width"
            type="button"
            onClick={() => runCopilotAnalysis(null)}
            disabled={busy}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px' }}
          >
            <Sparkles size={18} />
            {busy ? 'Analyzing Position...' : 'Run Copilot Analysis'}
          </button>
        </div>
      </div>

      {/* Analysis Results Panel */}
      <div className="span-7" style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
        {copilotData ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Top Match Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--surface-hover)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>COPILOT MATCH RATING</span>
                <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--accent)' }}>{copilotData.jobTitle}</h2>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{copilotData.company}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '32px', fontWeight: '900', color: copilotData.matchScore >= 75 ? '#10b981' : '#f59e0b' }}>
                  {copilotData.matchScore}%
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ATS Alignment</span>
              </div>
            </div>

            {/* Skills & Compatibility */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> Matching Skills
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {copilotData.matchingSkills.map(s => (
                    <span key={s} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontWeight: '600' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <XCircle size={16} /> Missing Skills & Gaps
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {copilotData.missingSkills.map(s => (
                    <span key={s} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', fontWeight: '600' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Resume Optimization Bullet Points */}
            <div>
              <h4 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={16} style={{ color: 'var(--accent)' }} /> Optimized Resume Bullet Points for this Job
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {copilotData.tailoredBullets.map((bullet, idx) => (
                  <div key={idx} style={{ fontSize: '13px', padding: '10px', background: 'var(--bg)', borderRadius: '6px', borderLeft: '3px solid var(--accent)' }}>
                    {bullet}
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Preparation Plan */}
            <div>
              <h4 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HelpCircle size={16} style={{ color: '#3b82f6' }} /> Targeted Interview Questions & STAR Tips
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {copilotData.interviewPrepQuestions.map((q, idx) => (
                  <div key={idx} style={{ fontSize: '12px', padding: '10px', background: 'var(--bg)', borderRadius: '6px' }}>
                    <div style={{ fontWeight: '600', marginBottom: '2px' }}>Q{idx + 1}: {q.question}</div>
                    <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>💡 {q.tip}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
              <button
                type="button"
                className="primary-button"
                onClick={saveToKanbanTracker}
                disabled={savedToKanban}
                style={{ fontSize: '13px', padding: '8px 14px' }}
              >
                {savedToKanban ? <Check size={16} /> : <Save size={16} />}
                {savedToKanban ? 'Tracked in Applications' : 'Track Application'}
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={copyCoverLetter}
                style={{ fontSize: '13px', padding: '8px 14px' }}
              >
                {copiedCoverLetter ? <Check size={16} /> : <Copy size={16} />}
                {copiedCoverLetter ? 'Cover Letter Copied' : 'Copy Cover Letter'}
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setActivePage('interview')}
                style={{ fontSize: '13px', padding: '8px 14px' }}
              >
                <CalendarCheck size={16} /> Start Mock Interview
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Sparkles size={48} style={{ color: 'var(--accent)', marginBottom: '16px', opacity: 0.8 }} />
            <h3>Select or enter a job to launch Copilot</h3>
            <p style={{ maxWidth: '400px', margin: '0 auto', fontSize: '13px' }}>
              Copilot will instantly analyze the job requirements against your resume, calculate ATS match, build bullet optimizations, and draft interview prep.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
