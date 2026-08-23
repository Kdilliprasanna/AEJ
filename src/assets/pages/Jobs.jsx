import { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, Zap, ExternalLink, Link2 } from 'lucide-react';
import '../../index.css';

export default function RolesJobsPage({ request = () => {}, setToast = () => {} }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [platformLinks, setPlatformLinks] = useState([]);
  const [loadingLinks, setLoadingLinks] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setLoading(true);
    try {
      const data = await request('/jobs/intelligent-match', {
        method: 'POST',
        body: JSON.stringify({})
      });

      if (data && Array.isArray(data.jobs)) {
        const validJobs = data.jobs.filter(j => j && j.title);
        setJobs(validJobs);
        setToast(`Found ${validJobs.length} job opportunities!`);
      } else {
        setJobs([]);
        setToast('Unable to load jobs. Please complete your profile first.');
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      setToast(`Error: ${error.message}`);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  const refreshJobs = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
  };

  const applyForJob = async (job) => {
    try {
      const result = await request('/jobs/apply', {
        method: 'POST',
        body: JSON.stringify({
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          applicationUrl: job.url
        })
      });

      if (result.success) {
        setToast(`Applied for ${job.title} at ${job.company}!`);
        setSelectedRole(null);
        if (job.url) {
          window.open(job.url, '_blank');
        }
      }
    } catch (error) {
      console.error('Error recording application', error);
      setToast('Error recording application');
      if (job.url) {
        window.open(job.url, '_blank');
      }
    }
  };

  const handleShowPlatforms = async (job) => {
    setSelectedRole(job);
    setLoadingLinks(true);
    try {
      const links = [
        { name: 'LinkedIn', url: `https://www.linkedin.com/jobs/search?keywords=${encodeURIComponent(job.title)}` },
        { name: 'Indeed', url: `https://www.indeed.com/jobs?q=${encodeURIComponent(job.title)}` },
        { name: 'Glassdoor', url: `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent(job.title)}` },
      ];
      setPlatformLinks(links);
    } catch (error) {
      console.error('Failed to load platform links', error);
      setPlatformLinks([]);
    } finally {
      setLoadingLinks(false);
    }
  };

  const closePlatformModal = () => {
    setSelectedRole(null);
    setPlatformLinks([]);
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin text-4xl mb-4">🔄</div>
          <p className="text-gray-600">Loading real job opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Job Matches</h1>
          <p className="text-sm text-gray-600">Browse intelligent job matches and apply with curated platform links.</p>
        </div>
        <button onClick={refreshJobs} disabled={refreshing} className="secondary-button">
          {refreshing ? 'Refreshing...' : 'Refresh Jobs'}
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center">
          <p className="text-gray-600">No jobs available yet. Refresh to load your latest matches.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((role) => (
            <div key={role.id || `${role.title}-${role.company}`}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-2">
                    <span className="inline-flex items-center gap-1"><Briefcase size={16} /> {role.company || 'Unknown Company'}</span>
                    <span className="inline-flex items-center gap-1"><MapPin size={16} /> {role.location || 'Remote'}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">{role.title}</h2>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1"><DollarSign size={16} /> {role.salaryRange || 'Competitive'}</span>
                  <span className="inline-flex items-center gap-1"><Zap size={16} /> {role.match || role.matchScore || '85'}% match</span>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-600 line-clamp-3">{role.description || 'A strong role with growth potential. Apply to get started.'}</p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" onClick={() => handleShowPlatforms(role)} className="primary-button inline-flex items-center gap-2">
                  View Platforms <ExternalLink size={14} />
                </button>
                <button type="button" onClick={() => applyForJob(role)} className="secondary-button">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{selectedRole.title}</h3>
                <p className="text-sm text-slate-500">{selectedRole.company} • {selectedRole.location || 'Remote'}</p>
              </div>
              <button onClick={closePlatformModal} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3">
              {loadingLinks ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin">🔄</div>
                  <p className="mt-3 text-sm text-slate-600">Loading platform links...</p>
                </div>
              ) : platformLinks.length > 0 ? (
                <div className="space-y-3">
                  {platformLinks.map((platform, idx) => (
                    <a
                      key={idx}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 text-slate-900 hover:bg-slate-50"
                    >
                      <span className="inline-flex items-center gap-2"><Link2 size={18} /> {platform.name}</span>
                      <ExternalLink size={16} />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600">No platform links available for this role.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
