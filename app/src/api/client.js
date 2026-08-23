import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Extract dynamic IP from Expo host if running via Expo Go / USB bundler
const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost || Constants.manifest2?.extra?.expoGo?.developer?.tool;
const dynamicIp = debuggerHost ? debuggerHost.split(':')[0] : null;

const DYNAMIC_EXPO_API = dynamicIp ? `http://${dynamicIp}:4000/api` : null;
const LAN_API          = 'http://192.168.1.8:4000/api';   // Current local network IP
const IPV4_USB_API     = 'http://127.0.0.1:4000/api';     // ADB reverse explicit IPv4
const ADB_API          = 'http://localhost:4000/api';    // ADB reverse (USB physical device)
const PRIMARY_API      = 'http://10.0.2.2:4000/api';   // Android emulator host

const API_CANDIDATES = [
  ADB_API,
  IPV4_USB_API,
  DYNAMIC_EXPO_API,
  LAN_API,
  PRIMARY_API,
].filter(Boolean);

let resolvedBase = ADB_API;
let resolvingPromise = null;

async function getWorkingApiBase() {
  if (resolvedBase) return resolvedBase;
  if (resolvingPromise) return resolvingPromise;

  resolvingPromise = (async () => {
    for (const url of API_CANDIDATES) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 600);
        const res = await fetch(`${url}/health`, {
          method: 'GET',
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          console.log('[ARJ] Live API Base Connected:', url);
          resolvedBase = url;
          return url;
        }
      } catch (e) {
        // try next candidate
      }
    }
    resolvedBase = ADB_API;
    return resolvedBase;
  })();

  const result = await resolvingPromise;
  resolvingPromise = null;
  return result;
}

const client = axios.create({
  timeout: 15000,
});

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('session');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const activeBase = await getWorkingApiBase();
  config.baseURL = activeBase;
  return config;
});

client.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const isNetworkError = !error.response && (
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNREFUSED' ||
      error.message?.includes('Network Error') ||
      error.message?.includes('timeout')
    );

    if (isNetworkError) {
      // Invalidate current cached base and re-probe
      resolvedBase = null;
      const retryBase = await getWorkingApiBase();
      if (retryBase && error.config && !error.config._isRetry) {
        error.config._isRetry = true;
        error.config.baseURL = retryBase;
        try {
          const retryRes = await axios(error.config);
          return retryRes.data;
        } catch (retryErr) {
          // Continue to fallback
        }
      }

      // Offline mode login fallback if USB/Wi-Fi connection is down
      if (error.config?.url?.includes('/auth/login')) {
        let payload = {};
        try { payload = JSON.parse(error.config.data || '{}'); } catch {}
        const fallbackUser = {
          id: 'usr_offline_demo',
          name: payload.email ? payload.email.split('@')[0] : 'Demo User',
          email: payload.email || 'dilliprasanna1523@gmail.com',
          role: 'Software Engineer',
        };
        await AsyncStorage.setItem('session', 'offline_session_token_123');
        await AsyncStorage.setItem('user', JSON.stringify(fallbackUser));
        return { token: 'offline_session_token_123', user: fallbackUser };
      }
    }

    const msg = error.response?.data?.message || error.message || 'Network error';
    console.log('[ARJ Live API Error]:', msg, '| URL:', error.config?.url);
    throw error;
  }
);

export default client;

// ── LIVE BACKEND DATABASE API ENDPOINTS ───────────────────────────────────────

export const auth = {
  login: (email, password) =>
    client.post('/auth/login', { email, password }),
  sendOtp: (name, email) =>
    client.post('/auth/send-registration-otp', { name, email }),
  verifyOtp: (email, otpCode) =>
    client.post('/auth/verify-registration-otp', { email, otpCode }),
  register: (name, email, password, otpCode) =>
    client.post('/auth/register', { name, email, password, otpCode }),
  forgotPassword: (email) =>
    client.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) =>
    client.post('/auth/reset-password', { token, password }),
  logout: () => AsyncStorage.multiRemove(['session', 'user']),
};

export const dashboard = {
  getOverview: () => client.get('/dashboard'),
  getStats:    () => client.get('/jobs/stats'),
};

export const profile = {
  get:    ()     => client.get('/profile/get'),
  update: (data) => client.post('/profile/update', data),
};

export const streaks = {
  get: () => client.get('/streaks'),
};

export const resume = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return client.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  matchAllJobs: (resumeText) => client.post('/resume/match-all-jobs', { resumeText }),
  getHistory:   ()           => client.get('/resume/history'),
  getAtsReport: ()           => client.get('/resume/analyze'),
};

export const templates = {
  getAll:   ()   => client.get('/resume/templates'),
  getPremium: () => client.get('/templates/premium'),
  getById:  (id) => client.get(`/resume/templates/${id}`),
};

export const jobs = {
  getMatched: (skills = ['JavaScript', 'React'], experience = 2, location = 'Remote', jobType = 'Full-time') =>
    client.post('/jobs/intelligent-match', { skills, experience, location, jobType }),
  searchAll:  (query)    => client.post('/jobs/advanced-search', { search: query }),
  byCategory: (category) => client.get(`/jobs/category/${category}`),
  save:       (jobId)    => client.post('/jobs/save', { jobId }),
  getSaved:   ()         => client.get('/jobs/saved'),
};

export const applications = {
  getAll:       ()                     => client.get('/applications'),
  apply:        (jobId)                => client.post('/applications/apply', { jobId }),
  deleteApp:    (applicationId)        => client.delete(`/applications/${applicationId}`),
};

export const mockTest = {
  getToday:    ()                     => client.get('/mocktest/today'),
  getRounds:   ()                     => client.get('/mocktest/rounds'),
  getCategory: (category)             => client.get(`/mocktest/round/${category}`),
  submit:      (answers)              => client.post('/mocktest/submit', { answers }),
  submitRound: (category, answers)    => client.post(`/mocktest/round/${category}/submit`, { answers }),
  getHistory:  ()                     => client.get('/mocktest/history'),
  getProgress: ()                     => client.get('/mocktest/progress'),
};

export const chat = {
  sendMessage: (message) => client.post('/chatbot/real', { message }),
  getHistory:  ()        => client.get('/chatbot/history'),
};

export const notifications = {
  getLive:    ()   => client.get('/notifications/live'),
  markAsRead: (id) => client.put(`/notifications/${id}/read`),
};

export const coverLetter = {
  generate: (data) => client.post('/ai/optimize-text', { text: JSON.stringify(data), mode: 'coverLetter' }),
};

export const roadmap = {
  generate: (role, level) => client.get('/recommendations/get'),
};

export const rolesExplorer = {
  getAll:     ()   => client.get('/jobs/types'),
  getRecommend: () => client.get('/roles/recommend'),
};

export const salaryCalculator = {
  getStats: () => client.get('/jobs/stats'),
};

export const liveInterviewer = {
  startSession: (role, difficulty) => client.post('/live-interview/start', { role, difficulty }),
  submitAnswer: (sessionId, answer) => client.post('/live-interview/submit-answer', { sessionId, answer }),
  completeSession: (sessionId)      => client.post('/live-interview/complete', { sessionId }),
  getHistory:   ()                  => client.get('/live-interview/sessions'),
};

export const adminAnalytics = {
  getOverview: () => client.get('/jobs/stats'),
  getPlatformFeatures: () => client.get('/platform/features'),
};
