const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'src/labs/data');
const targetDir = path.join(__dirname, 'dist/labs/data');

if (!fs.existsSync(sourceDir)) {
  console.error('❌ Source lab data folder not found:', sourceDir);
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });
fs.cpSync(sourceDir, targetDir, { recursive: true });

console.log('✅ Lab JSON files copied to dist/');
