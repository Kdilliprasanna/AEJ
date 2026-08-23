const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = __dirname;
const cacheDir = 'C:/Users/Prasanna/.gradle/caches/modules-2/files-2.1';
let aar = '';

function walk(d) {
  try {
    fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === 'hermes-android-250829098.0.14-release.aar') aar = p;
    });
  } catch (err) {}
}

walk(cacheDir);
console.log('AAR found:', aar);

if (!aar) {
  console.error('AAR not found!');
  process.exit(1);
}

const jniLibs = path.join(root, 'android', 'app', 'src', 'main', 'jniLibs');
const tmp = path.join(root, '_aar_tmp');
fs.rmSync(tmp, { recursive: true, force: true });
fs.mkdirSync(tmp, { recursive: true });

const tmpZip = path.join(root, '_aar_tmp.zip');
fs.copyFileSync(aar, tmpZip);
execSync(`powershell -Command "Expand-Archive -Path '${tmpZip}' -DestinationPath '${tmp}' -Force"`, { stdio: 'inherit' });
fs.rmSync(tmpZip, { force: true });

const jni = path.join(tmp, 'jni');
if (fs.existsSync(jni)) {
  fs.readdirSync(jni).forEach(arch => {
    const sDir = path.join(jni, arch);
    const dDir = path.join(jniLibs, arch);
    fs.mkdirSync(dDir, { recursive: true });
    fs.readdirSync(sDir).forEach(f => {
      const s = path.join(sDir, f);
      const d = path.join(dDir, f);
      fs.copyFileSync(s, d);
      console.log(`Copied ${f} -> ${dDir}`);
      if (f === 'libhermesvm.so') {
        fs.copyFileSync(s, path.join(dDir, 'libhermes.so'));
        fs.copyFileSync(s, path.join(dDir, 'libhermestooling.so'));
        console.log('Created aliases libhermes.so and libhermestooling.so');
      }
    });
  });
}

fs.rmSync(tmp, { recursive: true, force: true });
console.log('DONE EXTRACTING NATIVE LIBS!');
