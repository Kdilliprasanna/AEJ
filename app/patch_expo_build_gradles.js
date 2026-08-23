const fs = require('fs');
const path = require('path');

const nmDir = path.join(__dirname, 'node_modules');

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fullPath = path.join(dir, f);
    if (f === 'node_modules' && dir !== __dirname) continue;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (f === 'build.gradle') {
      patchGradle(fullPath);
    }
  }
}

function patchGradle(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Clean up any mistakenly injected compileOnly inside buildscript
  content = content.replace(/buildscript\s*\{[\s\S]*?dependencies\s*\{\s*compileOnly files\('C:\/tmp\/vm-interface\.jar'\)/g, (match) => {
    return match.replace("compileOnly files('C:/tmp/vm-interface.jar')", "");
  });

  // Replace legacy react-native:+ or react-native or react-android dependency with react-android:0.76.9
  content = content.replace(/['"]com\.facebook\.react:react-native:\+?['"]/g, "'com.facebook.react:react-android:0.76.9'");
  content = content.replace(/['"]com\.facebook\.react:react-native['"]/g, "'com.facebook.react:react-android:0.76.9'");
  content = content.replace(/['"]com\.facebook\.react:react-android['"]/g, "'com.facebook.react:react-android:0.76.9'");
  
  // Use hermes-android:0.76.9
  content = content.replace(/\/\/\s*implementation\s+['"]com\.facebook\.react:hermes-android.*['"]/g, "implementation 'com.facebook.react:hermes-android:0.76.9'");
  content = content.replace(/implementation\s+['"]com\.facebook\.react:hermes-android(?::[^'"]+)?['"]/g, "implementation 'com.facebook.react:hermes-android:0.76.9'");

  // Fix duplicate version strings if any
  content = content.replace(/'com\.facebook\.react:react-android:0\.76\.9:0\.76\.9'/g, "'com.facebook.react:react-android:0.76.9'");
  content = content.replace(/'com\.facebook\.react:hermes-android:0\.76\.9:0\.76\.9'/g, "'com.facebook.react:hermes-android:0.76.9'");

  // Add compileOnly vm-interface.jar for target UI modules in project dependencies block (last index)
  const isTargetModule = filePath.includes('react-native-safe-area-context') ||
                         filePath.includes('react-native-gesture-handler') ||
                         filePath.includes('react-native-screens');

  if (isTargetModule && !content.includes('vm-interface.jar')) {
    const lastDepIndex = content.lastIndexOf('dependencies {');
    if (lastDepIndex !== -1) {
      content = content.slice(0, lastDepIndex) + "dependencies {\n    compileOnly files('C:/tmp/vm-interface.jar')" + content.slice(lastDepIndex + 'dependencies {'.length);
    }
  }

  if (content.includes('expo-module-gradle-plugin') || content.includes('expo-autolinking')) {
    content = content.replace(/apply plugin:\s*['"]expo-module-gradle-plugin['"]/g, '// apply plugin: expo-module-gradle-plugin');
    content = content.replace(/apply plugin:\s*['"]expo-autolinking['"]/g, '// apply plugin: expo-autolinking');
    content = content.replace(/id\s+['"]expo-module-gradle-plugin['"]/g, '// id "expo-module-gradle-plugin"');
    content = content.replace(/id\s+['"]expo-autolinking['"]/g, '// id "expo-autolinking"');
  }

  if (content.includes('expoModule {')) {
    content = content.replace(/expoModule\s*\{[\s\S]*?\}/g, '/* expoModule commented out */');
  }

  if (content.includes("apply plugin: 'org.jetbrains.kotlin.plugin.compose'")) {
    content = content.replace("apply plugin: 'org.jetbrains.kotlin.plugin.compose'", "// apply plugin: 'org.jetbrains.kotlin.plugin.compose'");
  }

  if (content.includes('compose true')) {
    content = content.replace('compose true', 'compose false');
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Patched Gradle: ${filePath}`);
  }
}

walkDir(nmDir);

// Also patch android/app/build.gradle to use compileOnly files('C:/tmp/vm-interface.jar')
const appGradle = path.join(__dirname, 'android', 'app', 'build.gradle');
if (fs.existsSync(appGradle)) {
  let content = fs.readFileSync(appGradle, 'utf8');
  let original = content;
  content = content.replace(/\/\/\s*implementation\s*\(\s*['"]com\.facebook\.react:hermes-android['"]\s*\)/g, 'implementation("com.facebook.react:hermes-android:0.76.9")');
  content = content.replace(/implementation\s*\(\s*['"]com\.facebook\.react:hermes-android.*['"]\s*\)/g, 'implementation("com.facebook.react:hermes-android:0.76.9")');
  
  // Convert any implementation files('C:/tmp/vm-interface.jar') to compileOnly files('C:/tmp/vm-interface.jar')
  content = content.replace(/implementation\s+files\('C:\/tmp\/vm-interface\.jar'\)/g, "compileOnly files('C:/tmp/vm-interface.jar')");
  
  if (!content.includes('vm-interface.jar')) {
    const lastDepIndex = content.lastIndexOf('dependencies {');
    if (lastDepIndex !== -1) {
      content = content.slice(0, lastDepIndex) + "dependencies {\n    compileOnly files('C:/tmp/vm-interface.jar')" + content.slice(lastDepIndex + 'dependencies {'.length);
    }
  }
  if (content !== original) {
    fs.writeFileSync(appGradle, content, 'utf8');
    console.log(`Patched app build.gradle: ${appGradle}`);
  }
}

console.log("Done patching module build.gradle files.");
