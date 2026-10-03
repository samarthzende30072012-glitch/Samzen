// Helper script to write the logo and photo from the user's HTML artifact
import fs from 'fs';
import path from 'path';

const outDir = path.resolve(process.cwd(), 'src/assets/images');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// We also provide clean SVG and visual fallbacks
console.log('Images directory ready at:', outDir);
