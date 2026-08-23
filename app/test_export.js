const { execSync } = require('child_process');
try {
  const out = execSync('node node_modules/@expo/cli/build/bin/cli.js export:embed --platform android --dev false --entry-file node_modules/expo/AppEntry.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res', {
    encoding: 'utf8',
    cwd: __dirname
  });
  console.log('EXPORT SUCCESS:', out);
} catch (e) {
  const errText = String(e.stderr || e.stdout || e.message);
  const match = errText.match(/Cannot find module ['"]([^'"]+)['"]/);
  if (match) {
    console.log('EXACT MISSING MODULE:', match[1]);
  } else {
    console.log('ERR:', errText.slice(0, 300));
  }
}
