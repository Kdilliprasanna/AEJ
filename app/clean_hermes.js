const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function processZip(filePath) {
  try {
    const pStr = filePath.replace(/\\/g, '/');
    const psCmd = `powershell -Command "Add-Type -Assembly 'System.IO.Compression'; Add-Type -Assembly 'System.IO.Compression.FileSystem'; $zip = [System.IO.Compression.ZipFile]::Open('${pStr}', [System.IO.Compression.ZipArchiveMode]::Update); $entry = $zip.Entries | Where-Object { $_.FullName -like '*AndroidUnicodeUtils*' }; if ($entry) { Write-Host 'Removing entry from ${pStr}'; $entry.Delete() }; $zip.Dispose()"`;
    execSync(psCmd, { stdio: 'inherit' });
  } catch (e) {
    console.error('Error processing zip:', e.message);
  }
}

function walk(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (let e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        walk(full);
      } else if ((e.name.endsWith('.jar') || e.name.endsWith('.aar')) && full.includes('hermes-android')) {
        processZip(full);
      }
    }
  } catch (err) {}
}

walk('C:/Users/Prasanna/.gradle/caches');
console.log('Clean complete.');
