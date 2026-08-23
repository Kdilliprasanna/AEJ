/**
 * CAREER AI COPILOT — BACKGROUND SERVICE WORKER (Manifest V3)
 * Handles API communication, token storage, and secure extension routing.
 */

const DEFAULT_API_BASE = 'http://localhost:4000/api';

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'API_CALL') {
    handleApiCall(request.endpoint, request.method, request.payload)
      .then((res) => sendResponse({ ok: true, data: res }))
      .catch((err) => sendResponse({ ok: false, error: err.message }));
    return true; // Keep channel open for async response
  }

  if (request.action === 'GET_API_BASE') {
    getApiBase().then((apiBase) => sendResponse({ apiBase }));
    return true;
  }

  if (request.action === 'SET_API_BASE') {
    chrome.storage.local.set({ apiBase: request.apiBase }, () => sendResponse({ ok: true }));
    return true;
  }
});

async function getApiBase() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['apiBase'], (res) => {
      resolve(res.apiBase || DEFAULT_API_BASE);
    });
  });
}

async function getToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['arj_token'], (res) => {
      resolve(res.arj_token || null);
    });
  });
}

async function handleApiCall(endpoint, method = 'GET', payload = null) {
  const apiBase = await getApiBase();
  const token = await getToken();

  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers
  };

  if (payload && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(payload);
  }

  const url = `${apiBase}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

  const response = await fetch(url, options);

  let responseData;
  try {
    responseData = await response.json();
  } catch (e) {
    responseData = { message: await response.text() };
  }

  if (!response.ok) {
    throw new Error(responseData.error || responseData.message || `API Error: Status ${response.status}`);
  }

  return responseData;
}
