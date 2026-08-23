import { useState, useEffect } from 'react';
import { Mail, Sparkles, Copy, Check, FileText, Trash2 } from 'lucide-react';
import { generateCoverLetter, getCoverLetters, deleteCoverLetter } from '../../api';

export default function CoverLetterPage() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState('Professional');
  const [activeLetter, setActiveLetter] = useState(null);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState('');

  async function fetchLetters() {
    try {
      const res = await getCoverLetters();
      if (res.ok) {
        setLetters(res.coverLetters || []);
        if (res.coverLetters?.length > 0) {
          setActiveLetter(res.coverLetters[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLetters();
  }, []);

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const res = await generateCoverLetter({ jobTitle, company, jobDescription, tone });
      if (res.ok) {
        setLetters([res.coverLetter, ...letters]);
        setActiveLetter(res.coverLetter);
        setStatus('Cover letter generated successfully!');
      }
    } catch (err) {
      setStatus(err.message || 'Generation failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteCoverLetter(id);
      const updated = letters.filter(l => l.id !== id);
      setLetters(updated);
      if (activeLetter?.id === id) {
        setActiveLetter(updated[0] || null);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function handleCopy() {
    if (activeLetter?.content) {
      navigator.clipboard.writeText(activeLetter.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Mail size={28} style={{ color: '#3b82f6' }} /> AI Cover Letter Generator
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
          Generate tailored, high-converting cover letters using your profile and target job description.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Generator Form */}
        <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={18} style={{ color: '#eab308' }} /> Target Role & Details
          </h2>

          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Job Title</label>
              <input
                type="text"
                placeholder="e.g. Senior Frontend Developer"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)', color: 'var(--text)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Company Name</label>
              <input
                type="text"
                placeholder="e.g. Acme Corp"
                value={company}
                onChange={e => setCompany(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)', color: 'var(--text)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Tone</label>
              <select
                value={tone}
                onChange={e => setTone(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)', color: 'var(--text)' }}
              >
                <option value="Professional">Professional & Standard</option>
                <option value="Confident">Confident & Impactful</option>
                <option value="Creative">Creative & Engaging</option>
                <option value="Concise">Concise & Direct</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Job Description (Optional)</label>
              <textarea
                rows={4}
                placeholder="Paste key responsibilities or requirements..."
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)', color: 'var(--text)', fontFamily: 'inherit' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="primary-button"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '8px', marginTop: '8px' }}
            >
              <Sparkles size={16} />
              {loading ? 'Generating Cover Letter...' : 'Generate AI Cover Letter'}
            </button>

            {status && <p style={{ fontSize: '13px', color: '#10b981', marginTop: '4px' }}>{status}</p>}
          </form>
        </div>

        {/* Display Cover Letter */}
        <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          {activeLetter ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border)', pb: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>{activeLetter.jobTitle || activeLetter.job_title}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{activeLetter.company} • {activeLetter.tone}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleCopy} className="secondary-button" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '6px' }}>
                    {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button onClick={() => handleDelete(activeLetter.id)} className="secondary-button" style={{ color: '#ef4444', padding: '6px 12px', borderRadius: '6px' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div style={{ flex: 1, whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', fontFamily: 'serif', lineHeight: '1.6', fontSize: '14px', overflowY: 'auto' }}>
                {activeLetter.content}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)' }}>
              <FileText size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <p>No cover letter selected or generated yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
