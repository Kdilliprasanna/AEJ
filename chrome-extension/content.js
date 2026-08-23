/**
 * CAREER AI COPILOT — CONTENT SCRIPT
 * DOM job details extractor for top career portals (LinkedIn, Naukri, Indeed, Glassdoor, etc.)
 */

console.log('[Career AI Copilot] Content script loaded on job portal page.');

// Listen for extraction requests from extension popup or background worker
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'EXTRACT_JOB_DETAILS') {
    try {
      const jobData = extractJobDetails();
      sendResponse({ ok: true, jobData });
    } catch (err) {
      console.error('[Career AI Copilot] Extraction error:', err);
      sendResponse({ ok: false, error: err.message });
    }
  }
  return true; // Keep response channel open for async response
});

function extractJobDetails() {
  const host = window.location.hostname.toLowerCase();
  let title = '';
  let company = '';
  let location = '';
  let description = '';

  // 1. LINKEDIN PATTERN
  if (host.includes('linkedin.com')) {
    title = queryText(['.job-details-jobs-unified-top-card__job-title', '.jobs-unified-top-card__job-title', 'h1']);
    company = queryText(['.job-details-jobs-unified-top-card__company-name', '.jobs-unified-top-card__company-name']);
    location = queryText(['.job-details-jobs-unified-top-card__bullet', '.jobs-unified-top-card__bullet']);
    description = queryText(['#job-details', '.jobs-description__content', '.jobs-box__html-content']);
  }
  // 2. NAUKRI PATTERN
  else if (host.includes('naukri.com')) {
    title = queryText(['h1.styles_jd-header-title__4805E', 'h1.jd-header-title', 'h1']);
    company = queryText(['div.styles_jd-header-comp-name__M2_ee', 'a.pad-rt-8']);
    location = queryText(['span.styles_jheader-location__a8S3w', 'span.location']);
    description = queryText(['section.styles_job-desc-container__txpYf', 'div.danger-markup']);
  }
  // 3. INDEED PATTERN
  else if (host.includes('indeed.com')) {
    title = queryText(['h1.jobsearch-JobInfoHeader-title', 'h1']);
    company = queryText(['div[data-company-name="true"]', 'a.jobsearch-CompanyReviewLink']);
    location = queryText(['div[data-testid="inlineHeader-companyLocation"]', 'div.companyLocation']);
    description = queryText(['#jobDescriptionText', '.jobsearch-JobComponent-description']);
  }
  // 4. GLASSDOOR PATTERN
  else if (host.includes('glassdoor.com')) {
    title = queryText(['[data-test="jobTitle"]', 'h1']);
    company = queryText(['[data-test="employerName"]']);
    location = queryText(['[data-test="location"]']);
    description = queryText(['.jobDescriptionContent', '#JobDescription']);
  }
  // 5. GENERIC FALLBACK FOR ANY CAREER PORTAL OR LOCAL TESTING
  if (!title) {
    title = queryText(['h1', 'h2', 'head title']) || document.title || 'Target Job Position';
  }
  if (!company) {
    company = queryText(['[class*="company"]', '[class*="employer"]', '[class*="org"]']) || 'Hiring Company';
  }
  if (!description) {
    const mainEl = document.querySelector('main') || document.querySelector('article') || document.body;
    description = mainEl ? mainEl.innerText.substring(0, 4000) : 'Job description details...';
  }

  // Clean strings
  title = cleanText(title);
  company = cleanText(company);
  location = cleanText(location) || 'Remote / Unspecified';
  description = cleanText(description);

  // Extract skills from text
  const extractedSkills = extractSkillsFromText(description);

  return {
    url: window.location.href,
    title: title || 'Software Position',
    company: company || 'Tech Company',
    location,
    description: description || 'No detailed job description provided.',
    extractedSkills
  };
}

function queryText(selectors) {
  for (const selector of selectors) {
    try {
      const el = document.querySelector(selector);
      if (el && el.innerText && el.innerText.trim().length > 0) {
        return el.innerText.trim();
      }
    } catch (e) {}
  }
  return '';
}

function cleanText(str) {
  if (!str) return '';
  return str.replace(/\s+/g, ' ').replace(/[\r\n]+/g, ' ').trim();
}

function extractSkillsFromText(text) {
  const commonTech = [
    'React', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#',
    'PostgreSQL', 'MongoDB', 'SQL', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    'GraphQL', 'REST API', 'Git', 'CI/CD', 'Microservices', 'HTML', 'CSS', 'Tailwind',
    'Machine Learning', 'Data Analysis', 'System Design', 'Agile', 'Scrum', 'Figma'
  ];

  const lowerText = text.toLowerCase();
  return commonTech.filter(skill => lowerText.includes(skill.toLowerCase()));
}
