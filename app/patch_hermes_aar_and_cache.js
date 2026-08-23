const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const cacheDir = 'C:/Users/Prasanna/.gradle/caches/modules-2/files-2.1/com.facebook.hermes/hermes-android/250829098.0.14';
let targetAar = '';

function findAar(d) {
  try {
    fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
      const p = path.join(d, e.name);
      if (e.isDirectory()) findAar(p);
      else if (e.name === 'hermes-android-250829098.0.14-release.aar') targetAar = p;
    });
  } catch (err) {}
}

findAar(cacheDir);
console.log('Target AAR:', targetAar);

if (!targetAar) {
  console.error('Target AAR not found!');
  process.exit(1);
}

const workDir = path.join(__dirname, '_patch_aar_work');
fs.rmSync(workDir, { recursive: true, force: true });
fs.mkdirSync(workDir, { recursive: true });

// Copy AAR as zip
const tmpZip = path.join(workDir, 'aar.zip');
fs.copyFileSync(targetAar, tmpZip);

// Unzip AAR
const unzippedAar = path.join(workDir, 'unzipped');
fs.mkdirSync(unzippedAar, { recursive: true });
execSync(`powershell -Command "Expand-Archive -Path '${tmpZip}' -DestinationPath '${unzippedAar}' -Force"`);

// Check classes.jar
const classesJar = path.join(unzippedAar, 'classes.jar');
if (fs.existsSync(classesJar)) {
  console.log('classes.jar found in AAR, checking contents...');
  const jarZip = path.join(workDir, 'classes.zip');
  const jarUnzipped = path.join(workDir, 'jar_unzipped');
  fs.copyFileSync(classesJar, jarZip);
  fs.mkdirSync(jarUnzipped, { recursive: true });
  execSync(`powershell -Command "Expand-Archive -Path '${jarZip}' -DestinationPath '${jarUnzipped}' -Force"`);

  // Remove duplicate class file
  const unicodeDir = path.join(jarUnzipped, 'com', 'facebook', 'hermes', 'unicode');
  const duplicateClass = path.join(unicodeDir, 'AndroidUnicodeUtils.class');
  if (fs.existsSync(duplicateClass)) {
    fs.unlinkSync(duplicateClass);
    console.log('REMOVED AndroidUnicodeUtils.class from classes.jar!');
  } else {
    console.log('AndroidUnicodeUtils.class not found in classes.jar (already removed)');
  }

  // Re-compress classes.jar
  fs.unlinkSync(classesJar);
  const classesZipTmp = path.join(workDir, 'classes_new.zip');
  execSync(`powershell -Command "Compress-Archive -Path '${jarUnzipped}\\*' -DestinationPath '${classesZipTmp}' -Force"`);
  fs.copyFileSync(classesZipTmp, classesJar);
}

// Re-compress AAR
fs.unlinkSync(targetAar);
const aarZipTmp = path.join(workDir, 'aar_new.zip');
execSync(`powershell -Command "Compress-Archive -Path '${unzippedAar}\\*' -DestinationPath '${aarZipTmp}' -Force"`);
fs.copyFileSync(aarZipTmp, targetAar);
console.log('Successfully patched AAR at:', targetAar);

// Clear Gradle transform cache
const transformsDir = 'C:/Users/Prasanna/.gradle/caches/8.13/transforms';
if (fs.existsSync(transformsDir)) {
  fs.readdirSync(transformsDir).forEach(td => {
    const full = path.join(transformsDir, td);
    try {
      if (fs.statSync(full).isDirectory()) {
        const sub = fs.readdirSync(full, { recursive: true });
        if (sub.some(s => typeof s === 'string' && s.includes('hermes-android-250829098'))) {
          fs.rmSync(full, { recursive: true, force: true });
          console.log('Cleared stale transform:', full);
        }
      }
    } catch (e) {}
  });
}

fs.rmSync(workDir, { recursive: true, force: true });
console.log('PATCH COMPLETE!');
