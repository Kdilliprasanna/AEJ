const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // Use expo-modules-autolinking command or react-native cli command
  const root = __dirname;
  console.log('Generating autolink config...');
  // We can construct the json structure directly or run react-native cli config
  const out = execSync('npx @react-native-community/cli config', { encoding: 'utf8', cwd: root });
  fs.writeFileSync(path.join(root, 'autolink-config.json'), out);
  console.log('SUCCESSFULLY GENERATED autolink-config.json! Size:', out.length);
} catch (e) {
  console.log('GEN ERR STDOUT:', e.stdout);
  console.log('GEN ERR STDERR:', e.stderr);
}
