const path = require('path');
const cliBin = path.resolve(__dirname, 'node_modules', '@react-native-community', 'cli', 'build', 'bin.js');
console.log('CLI PATH:', cliBin);
try {
  require(cliBin);
  console.log('CLI REQUIRE OK');
} catch (e) {
  console.log('FAIL MSG:', e.message);
}
