/**
 * ARJ Career AI — GitHub Push via REST API (No Git Required)
 * Pushes the full project to https://github.com/Kdilliprasanna/ARJ2026
 *
 * Usage:
 *   node scripts/push-to-github.mjs YOUR_GITHUB_TOKEN
 *
 * Get your token at: https://github.com/settings/tokens/new
 * Select scope: [x] repo (Full control of private repositories)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// ============================
// CONFIGURATION
// ============================
const GITHUB_TOKEN = process.argv[2] || process.env.GITHUB_TOKEN || '';
const OWNER = 'Kdilliprasanna';
const REPO = 'ARJ2026';
const BRANCH = 'main';

// Files and folders to NEVER push
const SKIP_LIST = [
  'node_modules', '.env', '.env.local', '.env.production',
  'dist', '.git', '.gitignore.bak',
  'server/data',
  'eslint-report.json', 'eslint-report.log', 'eslint-errors.txt',
  'transcript_messages_extracted.json',
  'android_log_dump.txt', 'adb_logcat.txt', 'adb_devices.txt',
  'ARJ-full-code.doc', 'ARJ-full-code.txt', 'README_FINAL_SUMMARY.txt',
  '.idea', '.vercel',
  'Vulnerability Test Results',
  'package-lock.json',
  'Thumbs.db', '.DS_Store',
  'scripts/push-to-github.mjs', // don't push itself
];

// Max file size: 1MB
const MAX_SIZE = 1 * 1024 * 1024;

// ============================
// HELPERS
// ============================
async function api(method, path, body) {
  const r = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'arj-career-ai-deploy',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await r.text();
  try { return { status: r.status, data: JSON.parse(text) }; }
  catch { return { status: r.status, data: text }; }
}

function shouldSkip(relPath) {
  const p = relPath.replace(/\\/g, '/');
  return SKIP_LIST.some(skip => p === skip || p.startsWith(skip + '/') || p.includes('/' + skip + '/'));
}

function walk(dir, base = dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(base, full).replace(/\\/g, '/');
    if (shouldSkip(rel) || shouldSkip(entry.name)) continue;
    if (entry.isDirectory()) {
      walk(full, base, list);
    } else {
      const size = fs.statSync(full).size;
      if (size > MAX_SIZE) {
        console.log(`⏭  SKIP (too large ${Math.round(size/1024)}KB): ${rel}`);
        continue;
      }
      list.push({ full, rel });
    }
  }
  return list;
}

// ============================
// MAIN
// ============================
if (!GITHUB_TOKEN) {
  console.error('\n❌ No GitHub token provided!\n');
  console.error('Usage:  node scripts/push-to-github.mjs YOUR_TOKEN\n');
  console.error('Get a token: https://github.com/settings/tokens/new');
  console.error('Required scope: [x] repo\n');
  process.exit(1);
}

console.log('\n🚀 ARJ Career AI — GitHub Push');
console.log('================================');
console.log(`📁 Source: ${PROJECT_ROOT}`);
console.log(`🎯 Target: https://github.com/${OWNER}/${REPO}`);
console.log(`🌿 Branch: ${BRANCH}\n`);

// Verify token works
const me = await api('GET', '/user');
if (!me.data.login) {
  console.error('❌ GitHub token is invalid or expired. Please generate a new one.');
  process.exit(1);
}
console.log(`✅ Authenticated as: ${me.data.login}\n`);

// Collect files
console.log('📂 Scanning project files...');
const files = walk(PROJECT_ROOT);
console.log(`📋 Found ${files.length} files to push\n`);

let pushed = 0, updated = 0, failed = 0;

for (const file of files) {
  try {
    const content = fs.readFileSync(file.full);
    const b64 = content.toString('base64');

    // Check if file exists (get current SHA)
    const existing = await api('GET', `/repos/${OWNER}/${REPO}/contents/${file.rel}?ref=${BRANCH}`);
    const sha = existing.status === 200 ? existing.data.sha : null;

    const result = await api('PUT', `/repos/${OWNER}/${REPO}/contents/${file.rel}`, {
      message: `🚀 ARJ Career AI Website`,
      content: b64,
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    });

    if (result.status === 200 || result.status === 201) {
      const action = sha ? 'Updated' : 'Created';
      if (sha) updated++; else pushed++;
      process.stdout.write(`✅ ${action}: ${file.rel}\n`);
    } else {
      console.error(`❌ Failed (${result.status}): ${file.rel}`);
      if (result.data?.message) console.error('   →', result.data.message);
      failed++;
    }

    // Rate limit: ~30ms between requests (GitHub allows ~5000 req/hr)
    await new Promise(r => setTimeout(r, 50));

  } catch (err) {
    console.error(`❌ Error: ${file.rel} — ${err.message}`);
    failed++;
  }
}

console.log('\n================================');
console.log('📊 Push Complete!');
console.log(`   ✅ Created:  ${pushed} files`);
console.log(`   🔄 Updated:  ${updated} files`);
console.log(`   ❌ Failed:   ${failed} files`);
console.log(`\n🌐 Repository: https://github.com/${OWNER}/${REPO}`);
console.log('================================\n');
