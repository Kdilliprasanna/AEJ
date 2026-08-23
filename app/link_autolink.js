const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'node_modules', 'expo-modules-autolinking');
const destParent = path.join(__dirname, 'node_modules', 'expo', 'node_modules');
const dest = path.join(destParent, 'expo-modules-autolinking');

fs.mkdirSync(destParent, { recursive: true });

if (fs.existsSync(src)) {
  console.log('Copying expo-modules-autolinking to expo/node_modules...');
  fs.cpSync(src, dest, { recursive: true });
  console.log('COPY COMPLETE!');
} else {
  console.log('SRC NOT FOUND:', src);
}
