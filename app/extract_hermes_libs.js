const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = __dirname;
const jniDir = path.join(root, 'android', 'app', 'src', 'main', 'jniLibs');
const cacheDir = 'C:/Users/Prasanna/.gradle/caches/modules-2/files-2.1';

console.log('Extracting Hermes native .so libraries to jniLibs...');

const aarPaths = [];
function findAars(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) findAars(p);
      else if (e.name.includes('hermes') && e.name.endsWith('.aar')) aarPaths.push(p);
    }
  } catch (err) {}
}

findAars(cacheDir);
console.log('Found Hermes AARs:', aarPaths);

for (const aarPath of aarPaths) {
  const tmpDir = path.join(root, '_aar_tmp_' + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });
  try {
    execSync(`powershell -Command "Expand-Archive -Path '${aarPath}' -DestinationPath '${tmpDir}' -Force"`, { stdio: 'ignore' });
    const jniInAar = path.join(tmpDir, 'jni');
    if (fs.existsSync(jniInAar)) {
      const archs = fs.readdirSync(jniInAar);
      for (const arch of archs) {
        const srcArchDir = path.join(jniInAar, arch);
        const dstArchDir = path.join(jniDir, arch);
        fs.mkdirSync(dstArchDir, { recursive: true });
        const files = fs.readdirSync(srcArchDir);
        for (const f of files) {
          const srcFile = path.join(srcArchDir, f);
          const dstFile = path.join(dstArchDir, f);
          fs.copyFileSync(srcFile, dstFile);
          console.log(`Copied ${f} -> ${dstArchDir}`);
          // Also create alias libhermes.so if libhermesvm.so exists
          if (f === 'libhermesvm.so') {
            const aliasFile = path.join(dstArchDir, 'libhermes.so');
            fs.copyFileSync(srcFile, aliasFile);
            console.log(`Created alias libhermes.so -> ${dstArchDir}`);
          }
        }
      }
    }
  } catch (e) {
    console.error('Error extracting', aarPath, e.message);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

console.log('Extraction complete!');
