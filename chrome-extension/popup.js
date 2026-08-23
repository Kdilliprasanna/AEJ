/**
 * CAREER AI COPILOT — POPUP INTERACTION CONTROLLER
 */

document.addEventListener('DOMContentLoaded', async () => {
  const statusBadge = document.getElementById('statusBadge');
  const authSection = document.getElementById('authSection');
  const copilotSection = document.getElementById('copilotSection');
  const loginForm = document.getElementById('loginForm');
  const authError = document.getElementById('authError');
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const logoutBtn = document.getElementById('logoutBtn');

  const scanPageBtn = document.getElementById('scanPageBtn');
  const analyzeJobBtn = document.getElementById('analyzeJobBtn');
  const jobTitleDisplay = document.getElementById('jobTitleDisplay');
  const companyDisplay = document.getElementById('companyDisplay');
  const locationDisplay = document.getElementById('locationDisplay');

  const analysisCard = document.getElementById('analysisCard');
  const scoreNumber = document.getElementById('scoreNumber');
  const matchingSkillsPills = document.getElementById('matchingSkillsPills');
  const missingSkillsPills = document.getElementById('missingSkillsPills');
  const resumeTipsList = document.getElementById('resumeTipsList');
  const coverLetterBox = document.getElementById('coverLetterBox');
  const saveJobBtn = document.getElementById('saveJobBtn');
  const trackAppBtn = document.getElementById('trackAppBtn');
  const actionFeedback = document.getElementById('actionFeedback');

  let currentExtractedJob = null;

  // Check Token Status
  chrome.storage.local.get(['arj_token', 'arj_user'], async (res) => {
    if (res.arj_token) {
      showCopilotView(res.arj_user?.name || 'Logged In');
      autoScanPage();
    } else {
      showAuthView();
    }
  });

  // Login Handler
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    authError.classList.add('hidden');

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    try {
      const response = await sendBgMessage('API_CALL', {
        endpoint: '/auth/login',
        method: 'POST',
        payload: { email, password }
      });

      if (response.ok && response.data.token) {
        chrome.storage.local.set({
          arj_token: response.data.token,
          arj_user: response.data.user
        }, () => {
          showCopilotView(response.data.user.name);
          autoScanPage();
        });
      } else {
        throw new Error(response.data?.error || response.error || 'Invalid credentials');
      }
    } catch (err) {
      authError.textContent = err.message;
      authError.classList.remove('hidden');
    }
  });

  // Logout Handler
  logoutBtn.addEventListener('click', () => {
    chrome.storage.local.remove(['arj_token', 'arj_user'], () => {
      showAuthView();
    });
  });

  // Scan Current Active Tab Page
  scanPageBtn.addEventListener('click', () => autoScanPage());

  function autoScanPage() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0]) return;
      const activeTab = tabs[0];

      chrome.tabs.sendMessage(activeTab.id, { action: 'EXTRACT_JOB_DETAILS' }, (res) => {
        if (chrome.runtime.lastError || !res || !res.ok) {
          // Script might not be injected on arbitrary tab, fallback to scripting execute
          chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            files: ['content.js']
          }, () => {
            chrome.tabs.sendMessage(activeTab.id, { action: 'EXTRACT_JOB_DETAILS' }, (retryRes) => {
              if (retryRes && retryRes.ok) {
                renderExtractedJob(retryRes.jobData);
              } else {
                jobTitleDisplay.textContent = activeTab.title || 'Page Job Listing';
                companyDisplay.textContent = 'Active Web Page';
                currentExtractedJob = {
                  title: activeTab.title,
                  company: 'Company',
                  location: 'Remote',
                  description: activeTab.title + ' job details...',
                  url: activeTab.url
                };
              }
            });
          });
        } else if (res.jobData) {
          renderExtractedJob(res.jobData);
        }
      });
    });
  }

  function renderExtractedJob(jobData) {
    currentExtractedJob = jobData;
    jobTitleDisplay.textContent = jobData.title || 'Job Listing';
    companyDisplay.textContent = jobData.company || '';
    locationDisplay.textContent = jobData.location || '';
  }

  // Run AI Copilot Analysis
  analyzeJobBtn.addEventListener('click', async () => {
    if (!currentExtractedJob) {
      alert('Please scan a job page first!');
      return;
    }

    analyzeJobBtn.textContent = '⏳ Analyzing Job Fit...';
    analyzeJobBtn.disabled = true;

    try {
      const response = await sendBgMessage('API_CALL', {
        endpoint: '/copilot/analyze-job',
        method: 'POST',
        payload: {
          jobTitle: currentExtractedJob.title,
          company: currentExtractedJob.company,
          jobDescription: currentExtractedJob.description,
          url: currentExtractedJob.url
        }
      });

      if (response.ok && response.data) {
        renderAnalysis(response.data);
      } else {
        throw new Error(response.error || 'Failed to analyze job');
      }
    } catch (err) {
      alert(`Analysis error: ${err.message}`);
    } finally {
      analyzeJobBtn.textContent = '🚀 Run AI Copilot Analysis';
      analyzeJobBtn.disabled = false;
    }
  });

  function renderAnalysis(data) {
    analysisCard.classList.remove('hidden');
    scoreNumber.textContent = `${data.matchScore || 85}%`;

    // Render Skills
    matchingSkillsPills.innerHTML = (data.matchingSkills || ['React', 'Node.js']).map(s => `<span class="pill match">✓ ${s}</span>`).join('');
    missingSkillsPills.innerHTML = (data.missingSkills || ['Kubernetes']).map(s => `<span class="pill missing">⚠ ${s}</span>`).join('');

    // Resume Tips
    resumeTipsList.innerHTML = (data.resumeTips || ['Highlight leadership experience']).map(tip => `<li>${tip}</li>`).join('');

    // Cover Letter Draft
    coverLetterBox.value = data.coverLetterDraft || 'Cover letter draft generated by Career AI...';
  }

  // Save Job to Dashboard
  saveJobBtn.addEventListener('click', async () => {
    if (!currentExtractedJob) return;
    saveJobBtn.disabled = true;

    try {
      const response = await sendBgMessage('API_CALL', {
        endpoint: '/jobs/save',
        method: 'POST',
        payload: {
          jobId: 'ext-' + Date.now(),
          title: currentExtractedJob.title,
          company: currentExtractedJob.company,
          jobData: currentExtractedJob
        }
      });

      if (response.ok) {
        showFeedback('📌 Job saved to Dashboard!');
      }
    } catch (err) {
      showFeedback('Error saving job');
    } finally {
      saveJobBtn.disabled = false;
    }
  });

  // Track Application
  trackAppBtn.addEventListener('click', async () => {
    if (!currentExtractedJob) return;
    trackAppBtn.disabled = true;

    try {
      const response = await sendBgMessage('API_CALL', {
        endpoint: '/applications',
        method: 'POST',
        payload: {
          title: currentExtractedJob.title,
          company: currentExtractedJob.company,
          platform: 'Chrome Extension',
          status: 'Applied'
        }
      });

      if (response.ok) {
        showFeedback('✅ Application tracked in Career AI!');
      }
    } catch (err) {
      showFeedback('Error tracking application');
    } finally {
      trackAppBtn.disabled = false;
    }
  });

  function showFeedback(msg) {
    actionFeedback.textContent = msg;
    setTimeout(() => { actionFeedback.textContent = ''; }, 3000);
  }

  function showAuthView() {
    statusBadge.textContent = 'Disconnected';
    statusBadge.style.color = 'var(--danger-red)';
    authSection.classList.remove('hidden');
    copilotSection.classList.add('hidden');
  }

  function showCopilotView(userName) {
    statusBadge.textContent = `Online: ${userName}`;
    statusBadge.style.color = 'var(--success-green)';
    authSection.classList.add('hidden');
    copilotSection.classList.remove('hidden');
  }

  function sendBgMessage(action, payload) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action, ...payload }, (response) => {
        resolve(response || { ok: false, error: 'No background worker response' });
      });
    });
  }
});
