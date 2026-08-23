/**
 * clean_hermes_dex.js
 * Scans the Gradle transform cache for hermes-android-250829098 dex dirs
 * and deletes AndroidUnicodeUtils.class from them, then patches the dex
 * by simply deleting the entire duplicate transform entry so Gradle re-transforms
 * the (now-deleted) file. 
 *
 * Since we can't easily edit a .dex file without dextools, the better approach
 * is to patch the source .aar - removing the class from the jar inside the aar.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const GRADLE_CACHE = 'C:/Users/Prasanna/.gradle/caches';
const TARGET_CLASS = 'com/facebook/hermes/unicode/AndroidUnicodeUtils.class';

// 1. Find the hermes-android-250829098 .aar in the module cache
const hermesModuleDir = path.join(GRADLE_CACHE, 'modules-2/files-2.1/com.facebook.hermes/hermes-android');

function findAarFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) results.push(...findAarFiles(fp));
    else if (e.name.endsWith('.aar')) results.push(fp);
  }
  return results;
}

const aarFiles = findAarFiles(hermesModuleDir);
console.log('Found hermes .aar files:', aarFiles);

for (const aarPath of aarFiles) {
  console.log('Processing:', aarPath);
  // Use jar to remove the class
  try {
    // Check if the class exists inside first
    const listOut = execSync(`jar tf "${aarPath}" 2>&1`, { encoding: 'utf8' });
    if (listOut.includes('AndroidUnicodeUtils')) {
      console.log('  -> Found AndroidUnicodeUtils, removing...');
      execSync(`jar df "${aarPath}" ${TARGET_CLASS} 2>&1`, { encoding: 'utf8' });
      console.log('  -> Removed!');
    } else {
      console.log('  -> AndroidUnicodeUtils NOT in this aar (already clean or in classes.jar inside)');
      // The class may be inside classes.jar inside the .aar
      // Extract, patch, re-pack
      const tmpDir = path.join(process.cwd(), '_hermes_tmp_' + Date.now());
      fs.mkdirSync(tmpDir, { recursive: true });
      execSync(`jar xf "${aarPath}"`, { cwd: tmpDir, encoding: 'utf8' });
      const classesJar = path.join(tmpDir, 'classes.jar');
      if (fs.existsSync(classesJar)) {
        const classesOut = execSync(`jar tf "${classesJar}"`, { encoding: 'utf8' });
        if (classesOut.includes('AndroidUnicodeUtils')) {
          console.log('  -> Found AndroidUnicodeUtils in classes.jar, removing...');
          execSync(`jar df "${classesJar}" ${TARGET_CLASS}`, { encoding: 'utf8' });
          console.log('  -> Removed from classes.jar, repacking aar...');
          execSync(`jar cf "${aarPath}" .`, { cwd: tmpDir, encoding: 'utf8' });
          console.log('  -> Repacked!');
        }
      }
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  } catch(e) {
    console.error('Error processing', aarPath, ':', e.message);
  }
}

// 2. Delete all transform cache dirs for hermes-android-250829098
const transformsDir = path.join(GRADLE_CACHE, '8.13/transforms');
if (fs.existsSync(transformsDir)) {
  const dirs = fs.readdirSync(transformsDir);
  for (const d of dirs) {
    const full = path.join(transformsDir, d);
    if (!fs.statSync(full).isDirectory()) continue;
    try {
      const subentries = fs.readdirSync(full, { recursive: true });
      if (subentries.some(e => typeof e === 'string' && e.includes('hermes-android-250829098'))) {
        console.log('Deleting transform dir:', full);
        fs.rmSync(full, { recursive: true, force: true });
      }
    } catch(e) {}
  }
}

console.log('Clean complete!');
