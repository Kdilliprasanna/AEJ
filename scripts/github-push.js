/**
 * ARJ Career AI — GitHub Push via REST API
 * Pushes the full project to https://github.com/Kdilliprasanna/ARJ2026
 * No Git installation required — uses GitHub REST API over HTTPS
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

// === CONFIG ===
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.argv[2] || '';
const OWNER = 'Kdilliprasanna';
const REPO = 'ARJ2026';
const BRANCH = 'main';
const API_BASE = 'https://api.github.com';

// Files/folders to SKIP (sensitive or unnecessary)
const SKIP_PATTERNS = [
  'node_modules',
  '.env',
  'dist',
  '.git',
  'server/data',
  'eslint-report.json',
  'eslint-report.log',
  'eslint-errors.txt',
  'transcript_messages_extracted.json',
  'android_log_dump.txt',
  'adb_logcat.txt',
  'adb_devices.txt',
  'ARJ-full-code.doc',
  'ARJ-full-code.txt',
  'README_FINAL_SUMMARY.txt',
  '.idea',
  '.vercel',
  'Vulnerability Test Results',
  'package-lock.json', // large - regenerated via npm install
];

// Max file size to upload (500KB)
const MAX_FILE_SIZE = 500 * 1024;

if (!GITHUB_TOKEN) {
  console.error('❌ ERROR: GitHub token required!');
  console.error('Usage: node scripts/github-push.js YOUR_GITHUB_TOKEN');
  console.error('Get token at: https://github.com/settings/tokens/new (select repo scope)');
  process.exit(1);
}

async function githubRequest(method, endpoint, body = null) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'arj-career-ai-deploy'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  
  if (!res.ok && res.status !== 404 && res.status !== 422) {
    const err = await res.text();
    throw new Error(`GitHub API ${method} ${endpoint} failed ${res.status}: ${err}`);
  }
  return res.json();
}

function shouldSkip(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  return SKIP_PATTERNS.some(pattern => 
    normalized.includes(pattern) || normalized.startsWith(pattern)
  );
}

function getAllFiles(dir, baseDir = dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
    
    if (shouldSkip(relativePath) || shouldSkip(entry.name)) continue;
    
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir));
    } else {
      const stat = fs.statSync(fullPath);
      if (stat.size > MAX_FILE_SIZE) {
        console.log(`⏭️  Skipping large file (${Math.round(stat.size/1024)}KB): ${relativePath}`);
        continue;
      }
      files.push({ fullPath, relativePath, size: stat.size });
    }
  }
  return files;
}

async function getExistingFileSha(filePath) {
  try {
    const data = await githubRequest('GET', `/repos/${OWNER}/${REPO}/contents/${filePath}?ref=${BRANCH}`);
    return data.sha || null;
  } catch {
    return null;
  }
}

async function uploadFile(filePath, content, existingSha = null) {
  const body = {
    message: `🚀 ARJ Career AI: Deploy ${filePath}`,
    content: Buffer.from(content).toString('base64'),
    branch: BRANCH
  };
  if (existingSha) body.sha = existingSha;
  
  return githubRequest('PUT', `/repos/${OWNER}/${REPO}/contents/${filePath}`, body);
}

async function ensureRepoExists() {
  console.log(`\n📦 Checking repository ${OWNER}/${REPO}...`);
  const repo = await githubRequest('GET', `/repos/${OWNER}/${REPO}`);
  
  if (repo.message === 'Not Found') {
    console.log('🔨 Repository not found. Please create it manually at https://github.com/new');
    process.exit(1);
  }
  
  console.log(`✅ Repository found: ${repo.full_name} (${repo.private ? 'private' : 'public'})`);
  return repo;
}

async function main() {
  console.log('🚀 ARJ Career AI — GitHub Push Script');
  console.log('=====================================');
  console.log(`📁 Project: ${PROJECT_ROOT}`);
  console.log(`🎯 Target: https://github.com/${OWNER}/${REPO}`);
  console.log(`🌿 Branch: ${BRANCH}\n`);

  await ensureRepoExists();

  // Collect all files
  console.log('📂 Collecting files...');
  const files = getAllFiles(PROJECT_ROOT);
  console.log(`✅ Found ${files.length} files to push\n`);

  let uploaded = 0;
  let failed = 0;
  let skipped = 0;

  for (const file of files) {
    try {
      const content = fs.readFileSync(file.fullPath);
      
      // Check if it's a text or binary file
      let fileContent;
      try {
        fileContent = content.toString('utf-8');
        // Check for null bytes (binary indicator)
        if (fileContent.includes('\0')) {
          fileContent = content; // treat as binary
        }
      } catch {
        fileContent = content; // binary
      }

      const existingSha = await getExistingFileSha(file.relativePath);
      await uploadFile(file.relativePath, fileContent, existingSha);
      
      uploaded++;
      const action = existingSha ? 'Updated' : 'Created';
      console.log(`✅ [${uploaded}/${files.length}] ${action}: ${file.relativePath}`);
      
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 100));
      
    } catch (err) {
      failed++;
      console.error(`❌ Failed: ${file.relativePath} — ${err.message}`);
    }
  }

  console.log('\n=====================================');
  console.log(`📊 Push Complete!`);
  console.log(`   ✅ Uploaded: ${uploaded} files`);
  console.log(`   ❌ Failed:   ${failed} files`);
  console.log(`   ⏭️  Skipped:  ${skipped} files`);
  console.log(`\n🌐 View repository: https://github.com/${OWNER}/${REPO}`);
  
  if (failed > 0) {
    console.log(`\n⚠️  Some files failed to upload. Re-run the script to retry.`);
  }
}

main().catch(err => {
  console.error('❌ Push failed:', err.message);
  process.exit(1);
});
