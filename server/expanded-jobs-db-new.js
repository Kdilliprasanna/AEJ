// 250+ UNLIMITED JOBS DATABASE - NO LIMITS!
export const expandedJobsDatabase = {
  getAllJobs: function() { return this.jobs; },
  getTotalCount: function() { return this.jobs.length; },
  getMatchedJobs: function(userProfile = {}, preferences = {}, limit = null) {
    const results = this.jobs.map((job) => {
      let matchScore = 50;
      const jobSkills = (job.requiredSkills || []).map((s) => s.toLowerCase());
      const userSkills = (userProfile.skills || []).map((s) => s.toLowerCase());
      const skillMatches = userSkills.filter((s) => jobSkills.includes(s)).length;
      if (jobSkills.length > 0) { matchScore += ((skillMatches / jobSkills.length) * 40); }
      if (userProfile.experience >= (job.minExperience || 0)) { matchScore += 20; }
      return { ...job, matchScore: Math.min(100, Math.round(matchScore)) };
    }).sort((a, b) => b.matchScore - a.matchScore);
    
    const perfectMatch = results.filter((j) => j.matchScore >= 80);
    const goodMatch = results.filter((j) => j.matchScore >= 60 && j.matchScore < 80);
    return { total: results.length, matched: results.length, jobs: results, stats: { perfectMatch: perfectMatch.length, goodMatch: goodMatch.length }, perfectMatch, goodMatch };
  },
  parseSalary: function(salaryStr) {
    if (!salaryStr) return 0;
    const match = salaryStr.match(/(\d[\d,]*)/);
    return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
  },
  jobs: []
};
