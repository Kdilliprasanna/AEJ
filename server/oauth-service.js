/**
 * CAREER AI (ARJ) — PRODUCTION-GRADE OAUTH AUTHENTICATION SERVICE
 * Implements Google & GitHub OAuth 2.0 with state validation, account linking,
 * JWT session creation, open-redirect defense, and graceful error handling.
 */

import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'arj-dev-secret';
const BACKEND_URL = process.env.BACKEND_URL || process.env.VITE_BACKEND_URL || 'http://localhost:4000';
const CLIENT_URL = (process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0].trim();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';

export function isGoogleOAuthConfigured() {
  return Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);
}

export function isGitHubOAuthConfigured() {
  return Boolean(GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET);
}

export function getOAuthStatus() {
  return {
    google: {
      configured: isGoogleOAuthConfigured(),
      clientId: GOOGLE_CLIENT_ID ? `${GOOGLE_CLIENT_ID.substring(0, 12)}...` : 'Not Configured'
    },
    github: {
      configured: isGitHubOAuthConfigured(),
      clientId: GITHUB_CLIENT_ID ? `${GITHUB_CLIENT_ID.substring(0, 8)}...` : 'Not Configured'
    },
    clientUrl: CLIENT_URL,
    backendUrl: BACKEND_URL
  };
}

/**
 * Validates that redirect URL matches trusted CLIENT_URL origin
 */
export function getSafeRedirectUrl(targetPath = '/dashboard', params = {}) {
  try {
    const base = new URL(CLIENT_URL);
    const safeUrl = new URL(targetPath, base.origin);
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        safeUrl.searchParams.set(key, String(val));
      }
    });
    return safeUrl.toString();
  } catch (e) {
    return `${CLIENT_URL}/login?error=invalid_redirect`;
  }
}

/**
 * Generates cryptographic state parameter for CSRF protection
 */
export function generateOAuthState(provider) {
  return jwt.sign(
    { provider, nonce: randomUUID(), ts: Date.now() },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
}

/**
 * Verifies OAuth state parameter against expected provider
 */
export function verifyOAuthState(state, expectedProvider) {
  if (!state) return false;
  try {
    const decoded = jwt.verify(state, JWT_SECRET);
    return decoded && decoded.provider === expectedProvider;
  } catch (err) {
    return false;
  }
}

/**
 * 1. GOOGLE OAUTH 2.0 IMPLEMENTATION
 */
export function getGoogleAuthorizationUrl(state) {
  if (!isGoogleOAuthConfigured()) {
    throw new Error('Google OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) are not configured.');
  }

  const redirectUri = `${BACKEND_URL}/api/auth/google/callback`;
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
    state
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeGoogleCode(code) {
  const redirectUri = `${BACKEND_URL}/api/auth/google/callback`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    })
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text().catch(() => '');
    throw new Error(`Google token exchange failed (${tokenRes.status}): ${errText.substring(0, 150)}`);
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!profileRes.ok) {
    throw new Error(`Google user info request failed (${profileRes.status})`);
  }

  const profile = await profileRes.json();

  return {
    provider: 'google',
    providerId: profile.id,
    email: profile.email ? profile.email.toLowerCase() : '',
    name: profile.name || profile.given_name || 'Google Candidate',
    picture: profile.picture || ''
  };
}

/**
 * 2. GITHUB OAUTH 2.0 IMPLEMENTATION
 */
export function getGitHubAuthorizationUrl(state) {
  if (!isGitHubOAuthConfigured()) {
    throw new Error('GitHub OAuth credentials (GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET) are not configured.');
  }

  const redirectUri = `${BACKEND_URL}/api/auth/github/callback`;
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: 'user:email',
    state
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export async function exchangeGitHubCode(code) {
  const redirectUri = `${BACKEND_URL}/api/auth/github/callback`;

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri
    })
  });

  if (!tokenRes.ok) {
    throw new Error(`GitHub token exchange failed (${tokenRes.status})`);
  }

  const tokenData = await tokenRes.json();
  if (tokenData.error) {
    throw new Error(`GitHub OAuth Error: ${tokenData.error_description || tokenData.error}`);
  }

  const accessToken = tokenData.access_token;

  // Fetch GitHub User Profile
  const profileRes = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'ARJ-Career-AI-Platform'
    }
  });

  if (!profileRes.ok) {
    throw new Error(`GitHub user info request failed (${profileRes.status})`);
  }

  const profile = await profileRes.json();

  // Fetch primary verified email if not public in profile
  let email = profile.email;
  if (!email) {
    try {
      const emailRes = await fetch('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'ARJ-Career-AI-Platform'
        }
      });
      if (emailRes.ok) {
        const emails = await emailRes.json();
        const primary = emails.find(e => e.primary && e.verified) || emails[0];
        if (primary) email = primary.email;
      }
    } catch (e) {
      // Fallback email
    }
  }

  return {
    provider: 'github',
    providerId: String(profile.id),
    email: email ? email.toLowerCase() : `github_${profile.id}@users.noreply.github.com`,
    name: profile.name || profile.login || 'GitHub Candidate',
    picture: profile.avatar_url || ''
  };
}

/**
 * 3. ACCOUNT LINKING & JWT SESSION CREATION
 */
export function processOAuthAccount(oauthProfile, db) {
  if (!oauthProfile || !oauthProfile.email) {
    throw new Error('OAuth provider did not return a valid email address.');
  }

  const email = oauthProfile.email.toLowerCase().trim();
  const providerKey = oauthProfile.provider === 'google' ? 'googleId' : 'githubId';

  if (!db.users) db.users = [];
  if (!db.profiles) db.profiles = [];

  // Search existing user account by email or provider ID
  let user = db.users.find(u =>
    (u.email && u.email.toLowerCase() === email) ||
    u[providerKey] === oauthProfile.providerId
  );

  let isNewUser = false;

  if (user) {
    // Existing Account Linking: attach provider ID if not present
    if (!user[providerKey]) {
      user[providerKey] = oauthProfile.providerId;
    }
  } else {
    // Create New Candidate Account
    isNewUser = true;
    user = {
      id: randomUUID(),
      email,
      name: oauthProfile.name,
      role: 'candidate',
      authProvider: oauthProfile.provider,
      [providerKey]: oauthProfile.providerId,
      createdAt: new Date().toISOString()
    };
    db.users.push(user);

    // Create Candidate Profile
    const profile = {
      id: randomUUID(),
      userId: user.id,
      name: oauthProfile.name,
      email,
      skills: ['JavaScript', 'Problem Solving'],
      targetRole: 'Software Engineer',
      createdAt: new Date().toISOString()
    };
    db.profiles.push(profile);
  }

  // Issue Session JWT Token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role || 'candidate' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const safeUserData = {
    id: user.id,
    email: user.email,
    name: user.name || oauthProfile.name,
    role: user.role || 'candidate',
    authProvider: user.authProvider || oauthProfile.provider
  };

  return {
    token,
    user: safeUserData,
    isNewUser
  };
}
