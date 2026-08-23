const fs = require('fs');
const path = require('path');

const root = 'C:/Users/Prasanna/OneDrive/Desktop/career-ai/mobile-application';
const config = require('@react-native-community/cli-config');
const res = config.default(root);

const jsonStr = JSON.stringify(res, null, 2);
fs.writeFileSync(path.join(root, 'autolink_config.json'), jsonStr);
console.log('STATIC AUTOLINK CONFIG GENERATED! SIZE:', jsonStr.length);
