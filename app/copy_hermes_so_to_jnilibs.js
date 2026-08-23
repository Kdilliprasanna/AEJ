const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const cacheDir = 'C:/Users/Prasanna/.gradle/caches/modules-2/files-2.1/com.facebook.hermes/hermes-android/250829098.0.14';
let aarPath = '';

function findAar(d) {
  try {
    fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
      const p = path.join(d, e.name);
      if (e.isDirectory()) findAar(p);
      else if (e.name === 'hermes-android-250829098.0.14-release.aar') aarPath = p;
    });
  } catch (err) {}
}

findAar(cacheDir);
console.log('AAR path:', aarPath);

const pyScript = `
import zipfile
import os

aar_path = r"${aarPath.replace(/\\/g, '\\\\')}"
jni_dir = r"${path.join(__dirname, 'android', 'app', 'src', 'main', 'jniLibs').replace(/\\/g, '\\\\')}"

with zipfile.ZipFile(aar_path, 'r') as z:
    for name in z.namelist():
        if name.startswith('jni/') and name.endswith('.so'):
            parts = name.split('/')
            arch = parts[1]
            fname = parts[2]
            target_dir = os.path.join(jni_dir, arch)
            os.makedirs(target_dir, exist_ok=True)
            
            data = z.read(name)
            target_file = os.path.join(target_dir, fname)
            with open(target_file, 'wb') as f:
                f.write(data)
            print(f"Copied {fname} -> {target_dir}")
            
            if fname == 'libhermesvm.so' or fname == 'libhermes.so':
                alias_file = os.path.join(target_dir, 'libhermes.so')
                with open(alias_file, 'wb') as f:
                    f.write(data)
                print(f"Copied alias libhermes.so -> {target_dir}")

print("NATIVE LIBS COPIED TO JNILIBS!")
`;

fs.writeFileSync('copy_hermes.py', pyScript);
execSync('python copy_hermes.py', { stdio: 'inherit' });
fs.unlinkSync('copy_hermes.py');
