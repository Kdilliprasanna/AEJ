const http = require('http');
const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'index.android.bundle');
fs.mkdirSync(path.dirname(target), { recursive: true });

const url = 'http://127.0.0.1:8081/index.bundle?platform=android&dev=false';

console.log('Downloading bundle from:', url);
const file = fs.createWriteStream(target);

http.get(url, (res) => {
  console.log('HTTP STATUS:', res.statusCode);
  if (res.statusCode !== 200) {
    console.log('BUNDLE FAILED WITH STATUS:', res.statusCode);
    return;
  }
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    const sz = fs.statSync(target).size;
    console.log('BUNDLE BUNDLED & SAVED SUCCESSFULLY! SIZE:', sz, 'bytes');
  });
}).on('error', (err) => {
  console.log('DOWNLOAD ERROR:', err.message);
});
