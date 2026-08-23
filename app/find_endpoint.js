const http = require('http');

const endpoints = [
  '/.expo/.virtual-metro-entry.bundle?platform=android&dev=true',
  '/index.bundle?platform=android&dev=true',
  '/node_modules/expo/AppEntry.bundle?platform=android&dev=true',
  '/index.android.bundle?platform=android&dev=true'
];

endpoints.forEach(ep => {
  http.get('http://127.0.0.1:8081' + ep, (res) => {
    console.log(`ENDPOINT: ${ep} => STATUS: ${res.statusCode}`);
  }).on('error', e => console.log(`ENDPOINT ERR: ${ep} => ${e.message}`));
});
