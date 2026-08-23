// Real Job Fetcher - Fetches actual jobs from multiple sources
const JOOBLE_API_KEY = process.env.JOOBLE_API_KEY || 'demo'; // Using demo key

export const realJobFetcher = {
  // Fetch from Jooble API (free tier)
  async fetchFromJooble(keywords, location = '', pageNum = 1) {
    try {
      const response = await fetch('https://us.jooble.org/api/positions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords,
          location,
          pageNum,
          limit: 25
        }),
        timeout: 8000
      });

      if (!response.ok) throw new Error(`Jooble API error: ${response.status}`);
      const data = await response.json();
      
      return (data.jobs || []).map(job => ({
        id: `jooble-${job.id}`,
        title: job.title,
        company: job.company,
        location: job.location || 'Remote',
        salary: job.salary || 'Competitive',
        description: job.snippet,
        url: job.link,
        posted: new Date(job.updated),
        source: 'Jooble',
        type: 'full-time'
      }));
    } catch (error) {
      console.error('Jooble fetch error:', error.message);
      return [];
    }
  },

  // Fetch from GitHub Jobs API (free, no auth required)
  async fetchFromGitHub(description, location = '') {
    try {
      const params = new URLSearchParams({
        description,
        full_time: 'true',
        markdown: 'true'
      });
      if (location) params.append('location', location);

      const response = await fetch(`https://jobs.github.com/positions.json?${params}`, {
        timeout: 8000
      });

      if (!response.ok) throw new Error(`GitHub Jobs API error: ${response.status}`);
      const data = await response.json();
      
      return (data || []).slice(0, 20).map(job => ({
        id: `github-${job.id}`,
        title: job.title,
        company: job.company,
        location: job.location || 'Remote',
        salary: 'Not specified',
        description: job.description?.substring(0, 300) || job.title,
        url: job.url,
        posted: new Date(job.created_at),
        source: 'GitHub Jobs',
        type: job.type
      }));
    } catch (error) {
      console.error('GitHub Jobs fetch error:', error.message);
      return [];
    }
  },

  // Fetch from Adzuna API (requires free API key)
  async fetchFromAdzuna(what = '', where = 'India') {
    try {
      const appId = process.env.ADZUNA_APP_ID || 'test';
      const apiKey = process.env.ADZUNA_API_KEY || 'test';
      
      const params = new URLSearchParams({
        app_id: appId,
        app_key: apiKey,
        results_per_page: 25,
        full_time: 1
      });

      const response = await fetch(
        `https://api.adzuna.com/v1/api/jobs/in/search/1?${params}&what=${encodeURIComponent(what)}&where=${encodeURIComponent(where)}`,
        { timeout: 8000 }
      );

      if (!response.ok) return [];
      const data = await response.json();
      
      return (data.results || []).map(job => ({
        id: `adzuna-${job.id}`,
        title: job.title,
        company: job.company?.display_name || 'Not specified',
        location: job.location?.display_name || where,
        salary: job.salary_min ? `₹${Math.round(job.salary_min / 100000)}L - ₹${Math.round(job.salary_max / 100000)}L` : 'Not specified',
        description: job.description?.substring(0, 300) || job.title,
        url: job.redirect_url,
        posted: new Date(job.created),
        source: 'Adzuna',
        type: 'full-time'
      }));
    } catch (error) {
      console.error('Adzuna fetch error:', error.message);
      return [];
    }
  },

  // Smart job fetcher - tries multiple sources
  async fetchRealJobs(keywords, location = '', maxResults = 50) {
    try {
      const jobs = [];
      
      // Try Jooble first (most reliable free source)
      try {
        const joobleJobs = await this.fetchFromJooble(keywords, location);
        jobs.push(...joobleJobs);
      } catch (e) {
        console.error('Jooble failed:', e.message);
      }

      // Add GitHub Jobs
      try {
        const githubJobs = await this.fetchFromGitHub(keywords, location);
        jobs.push(...githubJobs);
      } catch (e) {
        console.error('GitHub failed:', e.message);
      }

      // Remove duplicates by URL
      const unique = Array.from(
        new Map(jobs.map(job => [job.url, job])).values()
      );

      return unique.slice(0, maxResults);
    } catch (error) {
      console.error('Error fetching real jobs:', error.message);
      return [];
    }
  },

  // Fetch jobs for specific skill combinations
  async fetchJobsBySkills(skills = [], location = '') {
    const queries = [
      skills.slice(0, 2).join(' '),
      skills[0] || 'developer',
      'software engineer'
    ];

    let allJobs = [];
    
    for (const query of queries) {
      if (!query) continue;
      try {
        const jobs = await this.fetchRealJobs(query, location, 25);
        allJobs.push(...jobs);
      } catch (e) {
        console.error(`Error fetching for query "${query}":`, e.message);
      }
    }

    // Deduplicate and limit
    const unique = Array.from(
      new Map(allJobs.map(job => [job.url, job])).values()
    );

    return unique.slice(0, 50);
  }
};
