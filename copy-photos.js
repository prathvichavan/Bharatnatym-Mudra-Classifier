const fs = require('fs');
const path = require('path');

const source = 'team member photos';
const dest = 'public/team';

// Create destination directory
if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
}

// Files to copy with their new names
const files = {
  'prathviraj chavan.jpg': 'prathviraj-chavan.jpg',
  'pooja choudhary.png': 'pooja-choudhary.png',
  'shubi upadhyay.jpeg': 'shubhi-upadhyay.jpeg',
  'saniya devarsi.jpeg': 'saniya-devarshi.jpeg'
};

// Copy each file
Object.entries(files).forEach(([src, name]) => {
  const srcPath = path.join(source, src);
  const destPath = path.join(dest, name);
  
  try {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✓ Copied ${src} -> ${name}`);
  } catch (err) {
    console.error(`✗ Failed to copy ${src}: ${err.message}`);
  }
});

console.log('\nAll team photos copied successfully!');
