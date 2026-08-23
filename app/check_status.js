const http = require('http');

http.get('http://127.0.0.1:8081/status', (res) => {
  let text = '';
  res.on('data', c => text += c);
  res.on('end', () => console.log('METRO STATUS:', text));
}).on('error', err => console.log('ERR:', err.message));
