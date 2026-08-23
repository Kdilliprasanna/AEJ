const { execSync } = require('child_process');
try {
  const out = execSync('npx expo export:embed --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res', {
    encoding: 'utf8',
    cwd: __dirname,
    stdio: 'pipe'
  });
  console.log('EXPO EMBED SUCCESS:', out);
} catch (e) {
  console.log('EXPO EMBED STDOUT:', e.stdout);
  console.log('EXPO EMBED STDERR:', e.stderr);
}
