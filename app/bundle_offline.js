const Metro = require('metro');
const path = require('path');
const fs = require('fs');

async function buildBundle() {
  const target = path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'index.android.bundle');
  fs.mkdirSync(path.dirname(target), { recursive: true });

  console.log('Building Metro offline bundle...');
  const config = await Metro.loadConfig();
  await Metro.runBuild(config, {
    entry: 'index.js',
    platform: 'android',
    dev: false,
    out: target,
    minify: true
  });
  console.log('BUNDLE BUILT SUCCESSFULLY! SIZE:', fs.statSync(target).size, 'bytes');
}

buildBundle().catch(err => {
  console.error('BUNDLE BUILD FAILED:', err.stack || err.message);
});
