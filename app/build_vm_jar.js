const { execSync } = require('child_process');
const fs = require('fs');

const javac = '"C:\\Program Files\\Android\\Android Studio\\jbr\\bin\\javac.exe"';
const jar = '"C:\\Program Files\\Android\\Android Studio\\jbr\\bin\\jar.exe"';

if (fs.existsSync('C:\\tmp\\dummy_classes')) {
  fs.rmSync('C:\\tmp\\dummy_classes', { recursive: true, force: true });
}
fs.mkdirSync('C:\\tmp\\dummy_classes', { recursive: true });

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = `${dir}/${file}`;
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith('.java')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const javaFiles = getAllFiles('C:/tmp/dummy_src').join(' ');

console.log('Compiling:', javaFiles);
execSync(`${javac} -source 17 -target 17 -d C:\\tmp\\dummy_classes ${javaFiles}`);
execSync(`${jar} cf C:\\tmp\\vm-interface.jar -C C:\\tmp\\dummy_classes .`);
console.log('Successfully generated C:\\tmp\\vm-interface.jar!');
