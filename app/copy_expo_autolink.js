const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'node_modules', 'expo-modules-autolinking');
const nested = path.join(__dirname, 'node_modules', 'expo', 'node_modules', 'expo-modules-autolinking');

fs.mkdirSync(path.dirname(nested), { recursive: true });
fs.cpSync(root, nested, { recursive: true });
console.log('SYNCED TO NESTED EXPO MODULES SUCCESS!');
