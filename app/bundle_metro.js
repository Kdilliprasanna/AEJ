const Metro = require('metro');
const path = require('path');
const fs = require('fs');
const terser = require('terser');
const babel = require('@babel/core');

function findAndReplaceBundles(dir, sourceFile) {
  if (!fs.existsSync(dir)) return;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        findAndReplaceBundles(fullPath, sourceFile);
      } else if (entry.name === 'index.android.bundle' || entry.name === 'index.android.bundle.js') {
        try {
          fs.copyFileSync(sourceFile, fullPath);
          console.log('Updated bundle at:', fullPath);
        } catch (err) {
          console.warn('Failed to copy to:', fullPath, err.message);
        }
      }
    }
  } catch (e) {
    // ignore
  }
}

async function build() {
  console.log('Starting Metro Bundle Build...');
  const root = __dirname;

  const targetFiles = [
    path.join(root, 'android', 'app', 'src', 'main', 'assets', 'index.android.bundle'),
    path.join(root, 'android', 'app', 'src', 'main', 'assets', 'index.android.bundle.js'),
    path.join(root, 'android', 'app', 'build', 'generated', 'assets', 'react', 'debug', 'index.android.bundle'),
    path.join(root, 'android', 'app', 'build', 'generated', 'assets', 'react', 'release', 'index.android.bundle'),
    path.join(root, 'android', 'app', 'build', 'generated', 'assets', 'createBundleDebugJsAndAssets', 'index.android.bundle'),
    path.join(root, 'android', 'app', 'build', 'generated', 'assets', 'createBundleReleaseJsAndAssets', 'index.android.bundle')
  ];

  const mapDirs = [
    path.join(root, 'android', 'app', 'build', 'intermediates', 'sourcemaps', 'react', 'debug'),
    path.join(root, 'android', 'app', 'build', 'generated', 'sourcemaps', 'react', 'debug'),
    path.join(root, 'android', 'app', 'build', 'intermediates', 'sourcemaps', 'react', 'release'),
    path.join(root, 'android', 'app', 'build', 'generated', 'sourcemaps', 'react', 'release')
  ];

  for (const dir of mapDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const mapNames = [
      'index.android.bundle.map',
      'index.android.bundle.packager.map',
      'index.android.bundle.compiler.map'
    ];
    const validMap = JSON.stringify({ version: 3, sources: ['index.js'], mappings: '' });
    for (const name of mapNames) {
      const mapFile = path.join(dir, name);
      fs.writeFileSync(mapFile, validMap);
    }
  }

  const config = await Metro.loadConfig({ configFile: path.join(root, 'metro.config.js') });

  const mainBundle = targetFiles[0];
  fs.mkdirSync(path.dirname(mainBundle), { recursive: true });

  await Metro.runBuild(config, {
    entry: path.join(root, 'index.js'),
    out: mainBundle,
    platform: 'android',
    dev: false,
    minify: false,
    sourceMap: false
  });

  console.log('Transforming JS bundle via Babel for ES5 / JSC compatibility...');
  const rawCode = fs.readFileSync(mainBundle, 'utf8');

  const transformed = await babel.transformAsync(rawCode, {
    filename: mainBundle,
    compact: true,
    plugins: [
      [require.resolve('@babel/plugin-transform-class-properties'), { loose: true }],
      [require.resolve('@babel/plugin-transform-private-methods'), { loose: true }],
      [require.resolve('@babel/plugin-transform-private-property-in-object'), { loose: true }],
      require.resolve('@babel/plugin-transform-optional-chaining'),
      require.resolve('@babel/plugin-transform-nullish-coalescing-operator'),
      require.resolve('@babel/plugin-transform-numeric-separator'),
      require.resolve('@babel/plugin-transform-logical-assignment-operators')
    ]
  });

  let finalCode = transformed.code;

  console.log('Downleveling JS bundle to ES5 using Terser...');
  const minified = await terser.minify(finalCode, {
    ecma: 5,
    safari10: true,
    compress: false,
    mangle: false,
  });

  if (minified.code) {
    finalCode = minified.code;
    console.log('Terser ES5 transformation complete!');
  }

  for (const file of targetFiles) {
    try {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, finalCode);
      console.log('Wrote bundle to:', file);
    } catch(err) {
      console.warn('Failed writing to:', file, err.message);
    }
  }

  // Replace all bundle copies in android/app/build and assets
  findAndReplaceBundles(path.join(root, 'android', 'app', 'build'), mainBundle);
  findAndReplaceBundles(path.join(root, 'android', 'app', 'src', 'main', 'assets'), mainBundle);

  console.log('All Bundle Copies Generated Successfully!');
}

build().catch(err => {
  console.error('Metro Build Error:', err);
  process.exit(1);
});
