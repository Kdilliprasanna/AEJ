const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'node_modules', 'lines-and-columns');
const destParent = path.join(__dirname, 'node_modules', '@react-native-community', 'cli-config', 'node_modules');
const dest = path.join(destParent, 'lines-and-columns');

fs.mkdirSync(destParent, { recursive: true });
if (fs.existsSync(src)) {
  fs.cpSync(src, dest, { recursive: true });
  console.log('SYNCED lines-and-columns SUCCESS!');
}
