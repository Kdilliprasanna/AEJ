// API Base URL - uses relative path for cross-origin/ngrok compatibility
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem('arj.session') || 'null');
  } catch {
    return null;
  }
}

export function saveSession(session) {
  localStorage.setItem('arj.session', JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem('arj.session');
}

export async function apiFetch(path, options = {}) {
  const session = getSession();
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };

  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export async function generateCoverLetter(payload) {
  return apiFetch('/cover-letters/generate', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getCoverLetters() {
  return apiFetch('/cover-letters');
}

export async function deleteCoverLetter(id) {
  return apiFetch(`/cover-letters/${id}`, { method: 'DELETE' });
}

export async function compareResumeJob(payload) {
  return apiFetch('/resume/compare-job', { method: 'POST', body: JSON.stringify(payload) });
}

export async function generateCareerRoadmap(payload) {
  return apiFetch('/career-roadmap/generate', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getCareerRoadmaps() {
  return apiFetch('/career-roadmap');
}

export async function evaluateStarAnswer(payload) {
  return apiFetch('/interview/eval-star', { method: 'POST', body: JSON.stringify(payload) });
}

export async function exportAccountData() {
  return apiFetch('/account/export', { method: 'POST' });
}

export async function deleteAccount() {
  return apiFetch('/account/delete', { method: 'POST' });
}

export async function requestPasswordReset(email) {
  return apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
}

export async function resetPassword(payload) {
  return apiFetch('/auth/reset-password', { method: 'POST', body: JSON.stringify(payload) });
}

export async function fetchPublicProfile(username) {
  return apiFetch(`/public/profile/${username}`);
}

export async function evaluateVoiceInterview(payload) {
  return apiFetch('/interview/voice-evaluate', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getInterviews() {
  return apiFetch('/interviews');
}

export async function createInterview(payload) {
  return apiFetch('/interviews', { method: 'POST', body: JSON.stringify(payload) });
}

export async function trackAnalyticsEvent(eventName, metadata = {}) {
  return apiFetch('/analytics/track', { method: 'POST', body: JSON.stringify({ eventName, metadata }) });
}

export async function getAnalyticsSummary() {
  return apiFetch('/analytics/summary');
}

export async function analyzeJobWithCopilot(payload) {
  return apiFetch('/copilot/analyze-job', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getCopilotSessions() {
  return apiFetch('/copilot/sessions');
}

export async function startLiveInterview(payload) {
  return apiFetch('/live-interview/start', { method: 'POST', body: JSON.stringify(payload) });
}

export async function submitLiveInterviewAnswer(payload) {
  return apiFetch('/live-interview/submit-answer', { method: 'POST', body: JSON.stringify(payload) });
}

export async function completeLiveInterview(sessionId) {
  return apiFetch('/live-interview/complete', { method: 'POST', body: JSON.stringify({ sessionId }) });
}

export async function getLiveInterviewSessions() {
  return apiFetch('/live-interview/sessions');
}

export async function getLiveInterviewSessionDetails(id) {
  return apiFetch(`/live-interview/session/${id}`);
}

export { API_BASE };
