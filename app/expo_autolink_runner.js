const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = 'C:/Users/Prasanna/OneDrive/Desktop/career-ai/mobile-application';
process.chdir(root);

const buildIndex = path.join(root, 'node_modules', 'expo-modules-autolinking', 'build', 'index.js');

try {
  if (!fs.existsSync(buildIndex)) {
    const srcIndex = path.join(root, 'node_modules', 'expo-modules-autolinking', 'src', 'index.ts');
    fs.mkdirSync(path.dirname(buildIndex), { recursive: true });
    execSync(`npx esbuild "${srcIndex}" --bundle --platform=node --outfile="${buildIndex}"`, { cwd: root });
  }

  const autolinking = require(buildIndex);
  autolinking(process.argv.slice(2));
} catch (e) {
  console.error('RUNNER ERROR:', e.stack || e.message);
  process.exit(1);
}
