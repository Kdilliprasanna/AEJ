import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Award,
  BarChart3,
  TrendingUp,
  FileCheck,
  Briefcase,
  Lock,
  RefreshCw,
  AlertTriangle,
  UserCheck,
  Activity,
  Zap
} from 'lucide-react';
import { apiFetch } from '../api';

export default function AdminUniversityDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('metrics'); // 'metrics' | 'audit'

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      // 1. Fetch Aggregated Anonymized University Analytics
      const res = await apiFetch('/admin/university-analytics');
      if (res.ok && res.analytics) {
        setAnalytics(res.analytics);
      } else {
        throw new Error(res.error || 'Failed to fetch analytics data');
      }

      // 2. Fetch System Audit Logs (Attempts if platform admin)
      try {
        const auditRes = await apiFetch('/admin/audit-logs');
        if (auditRes.ok && auditRes.auditLogs) {
          setAuditLogs(auditRes.auditLogs);
        }
      } catch {
        // Non-platform admin will get 403, which is expected behavior
      }
    } catch (err) {
      setError(err.message || 'Access denied or server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadDashboardData();
    };

    void load();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
        <RefreshCw style={{ animation: 'spin 1s linear infinite', width: '32px', height: '32px', margin: '0 auto 12px auto', display: 'block', color: '#38bdf8' }} />
        <span>Loading Anonymized University Analytics Dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', background: '#1e293b', borderRadius: '12px', padding: '32px', border: '1px solid #f87171', color: '#f8fafc', textAlign: 'center' }}>
        <AlertTriangle style={{ width: '48px', height: '48px', color: '#f87171', margin: '0 auto 16px auto', display: 'block' }} />
        <h3 style={{ fontSize: '20px', margin: '0 0 8px 0', color: '#f87171' }}>Access Restricted</h3>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
          {error}. Authorized Administrator credentials (`university_admin` or `platform_admin`) are required to view cohort metrics.
        </p>
        <button
          onClick={loadDashboardData}
          style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
        >
          Retry Authorization Check
        </button>
      </div>
    );
  }

  const {
    totalRegisteredStudents = 0,
    resumeCompletionRate = 0,
    avgAtsScore = 0,
    totalApplicationsSubmitted = 0,
    interviewsReached = 0,
    topSkillGaps = [],
    placementReadiness = { highReadiness: 0, moderateReadiness: 0, needsSupport: 0 }
  } = analytics || {};

  return (
    <div className="admin-dashboard-container" style={{ maxWidth: '1150px', margin: '0 auto', padding: '24px 16px', color: '#f8fafc' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <ShieldCheck style={{ width: '28px', height: '28px', color: '#38bdf8' }} />
            University & Institutional Analytics Dashboard
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px', margin: 0 }}>
            Aggregated cohort performance, placement readiness, ATS score trends, and skill gap intelligence.
          </p>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '8px', background: '#0f172a', padding: '4px', borderRadius: '8px', border: '1px solid #334155' }}>
          <button
            onClick={() => setActiveTab('metrics')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              background: activeTab === 'metrics' ? '#0284c7' : 'transparent',
              color: activeTab === 'metrics' ? '#ffffff' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <BarChart3 style={{ width: '16px', height: '16px' }} /> Cohort Metrics
          </button>
          {auditLogs.length > 0 && (
            <button
              onClick={() => setActiveTab('audit')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                background: activeTab === 'audit' ? '#0284c7' : 'transparent',
                color: activeTab === 'audit' ? '#ffffff' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Activity style={{ width: '16px', height: '16px' }} /> Audit Logs ({auditLogs.length})
            </button>
          )}
        </div>
      </div>

      {/* PRIVACY & SECURITY BANNER */}
      <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '10px', padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Lock style={{ width: '22px', height: '22px', color: '#38bdf8', shrink: 0 }} />
        <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.4' }}>
          <strong style={{ color: '#38bdf8' }}>Strict Data Privacy Enforced:</strong> All metrics displayed below represent aggregated cohort data. No individual candidate PII (names, emails, passwords, private resume contents, or AI chat logs) are stored in this view or exposed to administrators.
        </div>
      </div>

      {activeTab === 'audit' ? (
        /* AUDIT LOGS TAB */
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#38bdf8', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity style={{ width: '20px', height: '20px' }} /> Security & System Audit Logs
          </h3>
          <div style={{ background: '#0f172a', borderRadius: '8px', border: '1px solid #334155', maxHeight: '500px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#1e293b', borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                  <th style={{ padding: '10px 14px' }}>Timestamp</th>
                  <th style={{ padding: '10px 14px' }}>User ID</th>
                  <th style={{ padding: '10px 14px' }}>Role</th>
                  <th style={{ padding: '10px 14px' }}>Action</th>
                  <th style={{ padding: '10px 14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '10px 14px', color: '#94a3b8' }}>{new Date(log.timestamp).toLocaleString()}</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#38bdf8' }}>{log.userId?.slice(0, 8)}...</td>
                    <td style={{ padding: '10px 14px', textTransform: 'capitalize', color: '#cbd5e1' }}>{log.role}</td>
                    <td style={{ padding: '10px 14px', fontWeight: '600' }}>{log.action}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '700',
                        background: log.status.includes('DENIED') ? '#422006' : '#052e16',
                        color: log.status.includes('DENIED') ? '#facc15' : '#4ade80'
                      }}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* METRICS TAB */
        <div>
          {/* KPI CARDS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat( auto-fit, minmax(170px, 1fr) )', gap: '16px', marginBottom: '24px' }}>
            
            <div style={{ background: '#1e293b', padding: '18px', borderRadius: '10px', border: '1px solid #334155' }}>
              <div style={{ color: '#94a3b8', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Users style={{ width: '16px', height: '16px', color: '#38bdf8' }} /> Registered Students
              </div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#f8fafc' }}>{totalRegisteredStudents}</div>
              <div style={{ fontSize: '11px', color: '#4ade80', marginTop: '4px' }}>Active Cohort Count</div>
            </div>

            <div style={{ background: '#1e293b', padding: '18px', borderRadius: '10px', border: '1px solid #334155' }}>
              <div style={{ color: '#94a3b8', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <FileCheck style={{ width: '16px', height: '16px', color: '#38bdf8' }} /> Resume Completion
              </div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#38bdf8' }}>{resumeCompletionRate}%</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Uploaded & Analyzed</div>
            </div>

            <div style={{ background: '#1e293b', padding: '18px', borderRadius: '10px', border: '1px solid #334155' }}>
              <div style={{ color: '#94a3b8', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Award style={{ width: '16px', height: '16px', color: '#38bdf8' }} /> Avg Cohort ATS Score
              </div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: avgAtsScore >= 75 ? '#4ade80' : '#facc15' }}>{avgAtsScore}%</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Automated Assessment</div>
            </div>

            <div style={{ background: '#1e293b', padding: '18px', borderRadius: '10px', border: '1px solid #334155' }}>
              <div style={{ color: '#94a3b8', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Briefcase style={{ width: '16px', height: '16px', color: '#38bdf8' }} /> Applications Tracked
              </div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#f8fafc' }}>{totalApplicationsSubmitted}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Across Portals</div>
            </div>

            <div style={{ background: '#1e293b', padding: '18px', borderRadius: '10px', border: '1px solid #334155' }}>
              <div style={{ color: '#94a3b8', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <TrendingUp style={{ width: '16px', height: '16px', color: '#4ade80' }} /> Interviews Reached
              </div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#4ade80' }}>{interviewsReached}</div>
              <div style={{ fontSize: '11px', color: '#4ade80', marginTop: '4px' }}>Interview Rate</div>
            </div>

          </div>

          {/* LOWER SECTION: READINESS DISTRIBUTION & SKILL GAP FREQUENCY */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            {/* PLACEMENT READINESS CARD */}
            <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155' }}>
              <h3 style={{ color: '#38bdf8', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                <UserCheck style={{ width: '20px', height: '20px' }} /> Placement Readiness Distribution
              </h3>

              <div style={{ display: 'grid', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ color: '#4ade80', fontWeight: '600' }}>High Readiness (ATS Score &ge; 80%)</span>
                    <strong style={{ color: '#4ade80' }}>{placementReadiness.highReadiness} Candidates</strong>
                  </div>
                  <div style={{ background: '#0f172a', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ background: '#4ade80', height: '100%', width: `${(placementReadiness.highReadiness / (totalRegisteredStudents || 1)) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ color: '#facc15', fontWeight: '600' }}>Moderate Readiness (60% &le; ATS &lt; 80%)</span>
                    <strong style={{ color: '#facc15' }}>{placementReadiness.moderateReadiness} Candidates</strong>
                  </div>
                  <div style={{ background: '#0f172a', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ background: '#facc15', height: '100%', width: `${(placementReadiness.moderateReadiness / (totalRegisteredStudents || 1)) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ color: '#f87171', fontWeight: '600' }}>Needs Support (&lt; 60% or No Resume)</span>
                    <strong style={{ color: '#f87171' }}>{placementReadiness.needsSupport} Candidates</strong>
                  </div>
                  <div style={{ background: '#0f172a', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ background: '#f87171', height: '100%', width: `${(placementReadiness.needsSupport / (totalRegisteredStudents || 1)) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* TOP SKILL GAPS FREQUENCY */}
            <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155' }}>
              <h3 style={{ color: '#38bdf8', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                <Zap style={{ width: '20px', height: '20px' }} /> Cohort Skill Gap Trends (Top Missing Skills)
              </h3>

              <div style={{ display: 'grid', gap: '10px' }}>
                {topSkillGaps.map((item, idx) => (
                  <div key={item.skill} style={{ background: '#0f172a', padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ background: '#334155', color: '#38bdf8', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' }}>{idx + 1}</span>
                      <span style={{ textTransform: 'capitalize', fontWeight: '600', color: '#f8fafc', fontSize: '14px' }}>{item.skill}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#facc15', background: '#422006', padding: '4px 10px', borderRadius: '4px', border: '1px solid #334155' }}>
                      Missing in {item.count} resumes
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
