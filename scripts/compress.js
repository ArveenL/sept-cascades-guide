const sharp = require('sharp');
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');

const ORIGINALS_DIR = path.join(__dirname, '..', 'images', 'originals');
const OPTIMIZED_DIR = path.join(__dirname, '..', 'images', 'optimized');
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const WEBP_QUALITY = 80;

// Ensure output directory exists
if (!fs.existsSync(OPTIMIZED_DIR)) {
  fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
}

async function compressImage(filePath) {
  const filename = path.basename(filePath);
  const ext = path.extname(filename).toLowerCase();
  const nameWithoutExt = path.basename(filename, ext);
  const outputFilename = `${nameWithoutExt}.webp`;
  const outputPath = path.join(OPTIMIZED_DIR, outputFilename);

  // Skip if already compressed
  if (fs.existsSync(outputPath)) {
    console.log(`  skip  ${filename} (already compressed)`);
    return;
  }

  // Skip unsupported files
  if (!SUPPORTED_EXTENSIONS.includes(ext)) {
    console.log(`  skip  ${filename} (unsupported format)`);
    return;
  }

  try {
    const inputStats = fs.statSync(filePath);
    const inputSizeMB = (inputStats.size / (1024 * 1024)).toFixed(2);

    await sharp(filePath)
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);

    const outputStats = fs.statSync(outputPath);
    const outputSizeMB = (outputStats.size / (1024 * 1024)).toFixed(2);
    const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

    console.log(`  done  ${filename} → ${outputFilename}  ${inputSizeMB}MB → ${outputSizeMB}MB  (-${savings}%)`);
  } catch (err) {
    console.error(`  error ${filename}: ${err.message}`);
  }
}

async function processExistingFiles() {
  const files = fs.readdirSync(ORIGINALS_DIR);
  let count = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (SUPPORTED_EXTENSIONS.includes(ext)) {
      await compressImage(path.join(ORIGINALS_DIR, file));
      count++;
    }
  }

  return count;
}

// One-time mode: compress existing files and exit
if (process.argv.includes('--once')) {
  console.log('Compressing existing images...\n');
  processExistingFiles().then((count) => {
    console.log(`\nDone. Processed ${count} image(s).`);
    process.exit(0);
  });
} else {
  // Watch mode: monitor for new files
  console.log('Watching for new images...\n');
  console.log(`  Drop JPG/PNG into: ${ORIGINALS_DIR}`);
  console.log(`  WebP output goes to: ${OPTIMIZED_DIR}`);
  console.log('  Press Ctrl+C to stop.\n');

  // Process any existing files first
  processExistingFiles().then(() => {
    // Start watching
    const watcher = chokidar.watch(ORIGINALS_DIR, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 1000,
        pollInterval: 100
      }
    });

    watcher.on('add', (filePath) => {
      const filename = path.basename(filePath);
      console.log(`\n  new   ${filename}`);
      compressImage(filePath);
    });

    watcher.on('error', (error) => {
      console.error(`Watcher error: ${error}`);
    });
  });
}
