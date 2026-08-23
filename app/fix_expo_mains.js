const fs = require('fs');
const path = require('path');

const nmDir = path.join(__dirname, 'node_modules');
const entries = fs.readdirSync(nmDir);

let fixedCount = 0;
for (const entry of entries) {
  if (entry.startsWith('expo-') || entry.startsWith('@expo')) {
    const pkgDir = path.join(nmDir, entry);
    if (fs.statSync(pkgDir).isDirectory()) {
      checkPkg(pkgDir);
    }
  }
}

function checkPkg(pkgDir) {
  const pkgJsonPath = path.join(pkgDir, 'package.json');
  if (!fs.existsSync(pkgJsonPath)) return;
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    let mainFile = pkg.main || 'index.js';
    let fullMainPath = path.join(pkgDir, mainFile);
    
    if (!fs.existsSync(fullMainPath) && !fs.existsSync(fullMainPath + '.ts') && !fs.existsSync(fullMainPath + '.js')) {
      // Look for src/index.ts or src/index.js
      if (fs.existsSync(path.join(pkgDir, 'src', 'index.ts'))) {
        pkg.main = 'src/index.ts';
        fs.writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2));
        console.log(`Updated ${pkg.name}: main -> src/index.ts`);
        fixedCount++;
      } else if (fs.existsSync(path.join(pkgDir, 'src', 'index.js'))) {
        pkg.main = 'src/index.js';
        fs.writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2));
        console.log(`Updated ${pkg.name}: main -> src/index.js`);
        fixedCount++;
      } else if (fs.existsSync(path.join(pkgDir, 'index.js'))) {
        pkg.main = 'index.js';
        fs.writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2));
        console.log(`Updated ${pkg.name}: main -> index.js`);
        fixedCount++;
      }
    }
  } catch (err) {}
}

console.log(`Finished checking packages. Fixed ${fixedCount} package mains.`);
