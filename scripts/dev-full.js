import { spawn } from 'child_process';

const isWindows = process.platform === 'win32';
const npmCommand = isWindows ? 'npm.cmd' : 'npm';

const processes = [
  spawn(npmCommand, ['run', 'api'], { stdio: 'inherit', shell: true }),
  spawn(npmCommand, ['run', 'dev'], { stdio: 'inherit', shell: true }),
];

function stopAll(signal) {
  for (const child of processes) {
    if (!child.killed) {
      child.kill(signal);
    }
  }
}

process.on('SIGINT', () => {
  stopAll('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopAll('SIGTERM');
  process.exit(0);
});

for (const child of processes) {
  child.on('exit', (code) => {
    if (code && code !== 0) {
      stopAll('SIGTERM');
      process.exit(code);
    }
  });
}
