import { useState, useEffect } from 'react';
import { Target, Sparkles, ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import { generateCareerRoadmap, getCareerRoadmaps } from '../../api';

export default function CareerRoadmapPage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState('Student / Fresher');
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer');
  const [activeRoadmap, setActiveRoadmap] = useState(null);

  async function fetchRoadmaps() {
    try {
      const res = await getCareerRoadmaps();
      if (res.ok) {
        setRoadmaps(res.roadmaps || []);
        if (res.roadmaps?.length > 0) {
          setActiveRoadmap(res.roadmaps[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRoadmaps();
  }, []);

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await generateCareerRoadmap({ currentRole, targetRole });
      if (res.ok) {
        setRoadmaps([res.roadmap, ...roadmaps]);
        setActiveRoadmap(res.roadmap);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={28} style={{ color: '#10b981' }} /> Visual AI Career Roadmap
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
          Interactive step-by-step career progression milestones tailored to your target role.
        </p>
      </header>

      {/* Generator Form */}
      <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '24px' }}>
        <form onSubmit={handleGenerate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Current Position</label>
            <input
              type="text"
              value={currentRole}
              onChange={e => setCurrentRole(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)', color: 'var(--text)' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Target Career Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)', color: 'var(--text)' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="primary-button"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '8px' }}
          >
            <Sparkles size={16} />
            {loading ? 'Building...' : 'Generate Roadmap'}
          </button>
        </form>
      </div>

      {/* Interactive Milestone View */}
      {activeRoadmap ? (
        <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {activeRoadmap.currentRole} <ArrowRight size={18} style={{ display: 'inline', margin: '0 8px' }} /> {activeRoadmap.targetRole}
              </h2>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Completion Progress: {activeRoadmap.progress || 35}%</span>
            </div>
            <div style={{ width: '200px', background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${activeRoadmap.progress || 35}%`, background: '#10b981', height: '100%' }}></div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(activeRoadmap.milestones || []).map((m, idx) => (
              <div key={m.id || idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div>
                  {m.status === 'completed' ? (
                    <CheckCircle2 size={24} style={{ color: '#10b981' }} />
                  ) : (
                    <Circle size={24} style={{ color: 'var(--text-muted)' }} />
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: m.status === 'completed' ? '#10b981' : 'var(--text)' }}>
                    Phase {idx + 1}: {m.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Click "Generate Roadmap" to create your personalized career path.
        </div>
      )}
    </div>
  );
}
