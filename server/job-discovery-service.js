/**
 * CAREER AI (ARJ) — PRODUCTION-GRADE REAL JOB DISCOVERY SERVICE
 * Integrates RapidAPI JSearch / external job search with internal catalog fallback,
 * caching, deduplication, input sanitization, and intelligent skill matching.
 */

import { expandedJobsDatabase } from './expanded-jobs-db-250.js';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || process.env.JSEARCH_API_KEY || '';
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'jsearch.p.rapidapi.com';
const TIMEOUT_MS = 10000;

// Simple in-memory search cache with 5-minute TTL
const searchCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

export function isRealJobDiscoveryConfigured() {
  return Boolean(RAPIDAPI_KEY && RAPIDAPI_KEY.length > 5);
}

export function getJobDiscoveryStatus() {
  return {
    provider: isRealJobDiscoveryConfigured() ? 'RapidAPI JSearch (Live Search)' : 'Expanded Internal Job Catalog (Fallback)',
    configured: isRealJobDiscoveryConfigured(),
    cacheEntries: searchCache.size
  };
}

/**
 * Sanitizes external job HTML and strings to prevent injection
 */
export function sanitizeJobText(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Deduplicates job array based on normalized title, company, and location
 */
export function deduplicateJobs(jobs) {
  const seen = new Set();
  const result = [];

  for (const job of jobs) {
    const key = `${(job.title || '').toLowerCase()}|${(job.company || '').toLowerCase()}|${(job.location || '').toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(job);
    }
  }
  return result;
}

/**
 * Computes intelligent match score and skill gaps against candidate profile
 */
export function calculateJobMatch(job, userProfile = {}) {
  const candidateSkills = (userProfile.skills || []).map(s => String(s).toLowerCase());
  const reqSkills = (job.requiredSkills || []).length > 0
    ? job.requiredSkills
    : ['JavaScript', 'React', 'Node.js', 'Problem Solving', 'Git'];

  const matchedSkills = reqSkills.filter(s => candidateSkills.includes(s.toLowerCase()));
  const missingSkills = reqSkills.filter(s => !matchedSkills.includes(s));

  let score = 50; // base score
  if (reqSkills.length > 0) {
    score += Math.round((matchedSkills.length / reqSkills.length) * 40);
  }

  // Location bonus
  if (userProfile.location && job.location && job.location.toLowerCase().includes(userProfile.location.toLowerCase())) {
    score += 8;
  }
  if (job.location && job.location.toLowerCase().includes('remote')) {
    score += 5;
  }

  const finalMatchScore = Math.min(98, Math.max(45, score));
  const relevanceLevel = finalMatchScore >= 80 ? 'Perfect Match' : finalMatchScore >= 65 ? 'Strong Match' : 'Relevant';

  return {
    matchScore: finalMatchScore,
    matchedSkills,
    missingSkills,
    relevanceLevel,
    skillGapRecommendations: missingSkills.map(s => `Consider acquiring ${s} proficiency to boost match score for ${job.title}.`)
  };
}

/**
 * Fetches jobs from external RapidAPI JSearch API
 */
async function fetchFromRapidApi(searchQuery, location, page = 1) {
  const query = `${searchQuery || 'Software Engineer'} in ${location || 'Remote'}`;
  const url = `https://${RAPIDAPI_HOST}/search?query=${encodeURIComponent(query)}&page=${page}&num_pages=1`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
      },
      signal: controller.signal
    });

    clearTimeout(timer);

    if (!res.ok) {
      throw new Error(`RapidAPI returned HTTP ${res.status}`);
    }

    const data = await res.json();
    const rawJobs = data.data || [];

    return rawJobs.map((j, index) => {
      const title = sanitizeJobText(j.job_title || 'Software Position');
      const company = sanitizeJobText(j.employer_name || 'Hiring Company');
      const jobLocation = sanitizeJobText(j.job_city ? `${j.job_city}, ${j.job_country || ''}` : j.job_is_remote ? 'Remote' : 'Various Locations');
      const description = sanitizeJobText(j.job_description || title);
      const skills = j.job_required_skills || ['React', 'Node.js', 'PostgreSQL', 'API Development'];

      return {
        id: j.job_id ? `rapidapi-${j.job_id}` : `rapidapi-${Date.now()}-${index}`,
        title,
        company,
        location: jobLocation,
        type: (j.job_employment_type || 'full-time').toLowerCase().includes('part') ? 'part-time' : j.job_employment_type?.toLowerCase().includes('intern') ? 'internship' : 'full-time',
        salary: j.job_min_salary ? `$${j.job_min_salary} - $${j.job_max_salary || j.job_min_salary + 20000}/yr` : '$85,000 - $130,000/yr',
        description: description.substring(0, 300) + '...',
        requiredSkills: skills,
        minExperience: j.job_required_experience_in_months ? Math.round(j.job_required_experience_in_months / 12) : 2,
        url: j.job_apply_link || 'https://www.linkedin.com/jobs',
        source: 'RapidAPI JSearch (Live)',
        posted: j.job_posted_at_datetime_utc || new Date().toISOString()
      };
    });
  } catch (err) {
    clearTimeout(timer);
    console.warn(`⚠️ RapidAPI search warning (${err.message}). Using Internal Job Catalog Fallback.`);
    return null;
  }
}

/**
 * Primary Real Job Discovery Service API
 */
export async function discoverRealJobs(searchParams = {}, userProfile = {}) {
  const {
    search = '',
    location = 'all',
    jobType = 'all',
    page = 1,
    limit = 25,
    skills = [],
    sortBy = 'recent'
  } = searchParams;

  const cacheKey = `${search.toLowerCase()}|${location.toLowerCase()}|${jobType.toLowerCase()}|${page}`;
  
  // Check Cache
  if (searchCache.has(cacheKey)) {
    const cached = searchCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  let jobs = null;

  // Try RapidAPI when configured
  if (isRealJobDiscoveryConfigured()) {
    jobs = await fetchFromRapidApi(search, location === 'all' ? '' : location, page);
  }

  // Fallback to internal job database when RapidAPI is unconfigured or fails
  if (!jobs || jobs.length === 0) {
    jobs = expandedJobsDatabase.getAllJobs() || [];
  }

  // Apply internal filters & sanitization
  let filtered = jobs.map(j => ({
    ...j,
    title: sanitizeJobText(j.title),
    company: sanitizeJobText(j.company),
    description: sanitizeJobText(j.description)
  }));

  if (jobType !== 'all') {
    filtered = filtered.filter(j => j.type === jobType || (jobType === 'internship' && j.type === 'internship'));
  }

  if (location !== 'all') {
    const locLower = location.toLowerCase();
    filtered = filtered.filter(j => (j.location || '').toLowerCase().includes(locLower));
  }

  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(j =>
      (j.title || '').toLowerCase().includes(term) ||
      (j.company || '').toLowerCase().includes(term) ||
      (j.description || '').toLowerCase().includes(term)
    );
  }

  // Deduplicate
  filtered = deduplicateJobs(filtered);

  // Attach match scores
  const enriched = filtered.map(job => {
    const match = calculateJobMatch(job, userProfile);
    return {
      ...job,
      ...match
    };
  });

  // Sorting
  if (sortBy === 'salary') {
    enriched.sort((a, b) => parseInt(b.salary?.match(/\d+/)?.[0] || 0) - parseInt(a.salary?.match(/\d+/)?.[0] || 0));
  } else if (sortBy === 'match') {
    enriched.sort((a, b) => b.matchScore - a.matchScore);
  } else {
    enriched.sort((a, b) => new Date(b.posted) - new Date(a.posted));
  }

  // Pagination
  const pageNum = Math.max(1, parseInt(page));
  const pageSize = Math.min(100, Math.max(1, parseInt(limit)));
  const start = (pageNum - 1) * pageSize;
  const paginated = enriched.slice(start, start + pageSize);

  const responseData = {
    total: enriched.length,
    returned: paginated.length,
    page: pageNum,
    limit: pageSize,
    totalPages: Math.ceil(enriched.length / pageSize),
    provider: isRealJobDiscoveryConfigured() && jobs[0]?.source?.includes('RapidAPI') ? 'RapidAPI JSearch (Live)' : 'Internal Job Catalog (Fallback)',
    jobs: paginated
  };

  // Cache response
  searchCache.set(cacheKey, { timestamp: Date.now(), data: responseData });

  return responseData;
}
