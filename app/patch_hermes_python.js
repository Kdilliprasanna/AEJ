const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const pyScript = `
import zipfile
import os
import shutil

cache_dir = r"C:\\Users\\Prasanna\\.gradle\\caches\\modules-2\\files-2.1\\com.facebook.hermes\\hermes-android\\250829098.0.14"
aar_path = None
for root, dirs, files in os.walk(cache_dir):
    for f in files:
        if f == "hermes-android-250829098.0.14-release.aar":
            aar_path = os.path.join(root, f)
            break

print("Found AAR:", aar_path)
if not aar_path:
    exit(1)

# Step 1: Extract classes.jar from aar & handle libhermes.so alias
with zipfile.ZipFile(aar_path, 'r') as z_in:
    classes_jar_data = z_in.read('classes.jar')
    existing_names = set(z_in.namelist())

# Step 2: Remove AndroidUnicodeUtils.class from classes.jar
tmp_jar_in = "tmp_classes_in.jar"
tmp_jar_out = "tmp_classes_out.jar"
with open(tmp_jar_in, "wb") as f:
    f.write(classes_jar_data)

with zipfile.ZipFile(tmp_jar_in, 'r') as zin, zipfile.ZipFile(tmp_jar_out, 'w', zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        if item.filename != "com/facebook/hermes/unicode/AndroidUnicodeUtils.class":
            zout.writestr(item, zin.read(item.filename))

with open(tmp_jar_out, "rb") as f:
    new_classes_jar_data = f.read()

os.remove(tmp_jar_in)
os.remove(tmp_jar_out)

# Step 3: Rewrite AAR replacing classes.jar AND creating libhermes.so aliases for each ABI
tmp_aar_out = aar_path + ".tmp"
with zipfile.ZipFile(aar_path, 'r') as zin, zipfile.ZipFile(tmp_aar_out, 'w', zipfile.ZIP_DEFLATED) as zout:
    written = set()
    for item in zin.infolist():
        if item.filename not in written:
            if item.filename == "classes.jar":
                zout.writestr("classes.jar", new_classes_jar_data)
            else:
                zout.writestr(item, zin.read(item.filename))
            written.add(item.filename)

            if item.filename.endswith("/libhermesvm.so"):
                alias_name = item.filename.replace("libhermesvm.so", "libhermes.so")
                if alias_name not in existing_names and alias_name not in written:
                    zout.writestr(alias_name, zin.read(item.filename))
                    written.add(alias_name)
                    print(f"Created alias {alias_name} inside AAR")

shutil.move(tmp_aar_out, aar_path)
print("SUCCESSFULLY PATCHED AAR WITH LIBHERMES.SO ALIAS!")
`;

fs.writeFileSync('patch_hermes.py', pyScript);
console.log('Running Python patch script...');
execSync('python patch_hermes.py', { stdio: 'inherit' });
fs.unlinkSync('patch_hermes.py');

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
console.log('DONE!');
