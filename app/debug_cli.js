const path = require('path');
const { execSync } = require('child_process');

const root = 'C:\\Users\\Prasanna\\OneDrive\\Desktop\\career-ai\\mobile-application';

const isBundle = process.argv.includes('export:embed') || process.argv.includes('bundle');

if (!isBundle) {
  const config = {
    root: root,
    reactNativePath: path.join(root, 'node_modules', 'react-native'),
    dependencies: {
      'react-native-gesture-handler': {
        name: 'react-native-gesture-handler',
        root: path.join(root, 'node_modules', 'react-native-gesture-handler'),
        platforms: {
          android: {
            sourceDir: path.join(root, 'node_modules', 'react-native-gesture-handler', 'android'),
            packageImportPath: 'import com.swmansion.gesturehandler.RNGestureHandlerPackage;',
            packageInstance: 'new RNGestureHandlerPackage()',
            buildTypes: [],
            componentDescriptors: [],
            cmakeListsPath: path.join(root, 'node_modules', 'react-native-gesture-handler', 'android', 'build', 'generated', 'source', 'codegen', 'jni', 'CMakeLists.txt'),
            cxxModuleCMakeListsModuleName: null,
            cxxModuleCMakeListsPath: null,
            cxxModuleHeaderName: null
          }
        }
      },
      'react-native-reanimated': {
        name: 'react-native-reanimated',
        root: path.join(root, 'node_modules', 'react-native-reanimated'),
        platforms: {
          android: {
            sourceDir: path.join(root, 'node_modules', 'react-native-reanimated', 'android'),
            packageImportPath: 'import com.swmansion.reanimated.ReanimatedPackage;',
            packageInstance: 'new ReanimatedPackage()',
            buildTypes: [],
            componentDescriptors: [],
            cmakeListsPath: path.join(root, 'node_modules', 'react-native-reanimated', 'android', 'build', 'generated', 'source', 'codegen', 'jni', 'CMakeLists.txt'),
            cxxModuleCMakeListsModuleName: null,
            cxxModuleCMakeListsPath: null,
            cxxModuleHeaderName: null
          }
        }
      },
      'react-native-safe-area-context': {
        name: 'react-native-safe-area-context',
        root: path.join(root, 'node_modules', 'react-native-safe-area-context'),
        platforms: {
          android: {
            sourceDir: path.join(root, 'node_modules', 'react-native-safe-area-context', 'android'),
            packageImportPath: 'import com.th3rdwave.safeareacontext.SafeAreaContextPackage;',
            packageInstance: 'new SafeAreaContextPackage()',
            buildTypes: [],
            componentDescriptors: [],
            cmakeListsPath: path.join(root, 'node_modules', 'react-native-safe-area-context', 'android', 'build', 'generated', 'source', 'codegen', 'jni', 'CMakeLists.txt'),
            cxxModuleCMakeListsModuleName: null,
            cxxModuleCMakeListsPath: null,
            cxxModuleHeaderName: null
          }
        }
      },
      'react-native-screens': {
        name: 'react-native-screens',
        root: path.join(root, 'node_modules', 'react-native-screens'),
        platforms: {
          android: {
            sourceDir: path.join(root, 'node_modules', 'react-native-screens', 'android'),
            packageImportPath: 'import com.swmansion.rnscreens.RNScreensPackage;',
            packageInstance: 'new RNScreensPackage()',
            buildTypes: [],
            componentDescriptors: [],
            cmakeListsPath: path.join(root, 'node_modules', 'react-native-screens', 'android', 'build', 'generated', 'source', 'codegen', 'jni', 'CMakeLists.txt'),
            cxxModuleCMakeListsModuleName: null,
            cxxModuleCMakeListsPath: null,
            cxxModuleHeaderName: null
          }
        }
      }
    },
    commands: [],
    assets: [],
    project: {
      android: {
        sourceDir: path.join(root, 'android'),
        appName: 'app',
        packageName: 'com.careeraiapp.jobs',
        mainFilePath: path.join(root, 'android', 'app', 'src', 'main', 'java', 'com', 'careeraiapp', 'jobs', 'MainApplication.kt'),
        dependencyConfiguration: 'implementation'
      }
    }
  };

  console.log(JSON.stringify(config));
  process.exit(0);
} else {
  console.log("Bundle requested by Gradle - executing Expo export:embed...");
  const rawArgs = process.argv.slice(2).filter(a => a !== 'export:embed');
  const bundleCmd = `npx expo export:embed ${rawArgs.join(' ')}`;
  try {
    execSync(bundleCmd, { 
      cwd: root, 
      stdio: 'inherit',
      env: { ...process.env, EXPO_NO_TYPESCRIPT_RESOLVER: '1', EXPO_USE_COMMUNITY_AUTOLINKING: '1' } 
    });
    console.log("Bundle generated successfully! Post-transforming bundle for hermesc...");

    const fs = require('fs');
    const bundleFile = path.join(root, 'android', 'app', 'build', 'generated', 'assets', 'react', 'release', 'index.android.bundle');
    if (fs.existsSync(bundleFile)) {
      const babel = require('@babel/core');
      const rawCode = fs.readFileSync(bundleFile, 'utf8');
      const transformed = babel.transformSync(rawCode, {
        filename: bundleFile,
        compact: true,
        plugins: [
          [require.resolve('@babel/plugin-transform-class-properties'), { loose: true }],
          [require.resolve('@babel/plugin-transform-private-methods'), { loose: true }],
          [require.resolve('@babel/plugin-transform-private-property-in-object'), { loose: true }],
          [require.resolve('@babel/plugin-transform-classes'), { loose: true }]
        ]
      });
      if (transformed && transformed.code) {
        fs.writeFileSync(bundleFile, transformed.code);
        console.log("Post-transformed release bundle for hermesc successfully!");
      }
    }

    process.exit(0);
  } catch (e) {
    console.error('Bundle error:', e.message);
    process.exit(1);
  }
}
