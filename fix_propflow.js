const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  let b = fs.readFileSync(filePath);
  if (b[0] === 0xEF && b[1] === 0xBB && b[2] === 0xBF) b = b.slice(3);
  let c = b.toString('utf8');
  c = c.replace(/â€"/g, '—');
  c = c.replace(/â€¢/g, '•');
  c = c.replace(/â†'/g, '→');
  c = c.replace(/â†"/g, '←');
  c = c.replace(/â€™/g, "'");
  c = c.replace(/â€œ/g, '"');
  c = c.replace(/â€/g, '"');
  c = c.replace(/Ã—/g, '×');
  c = c.replace(/ðŸ /g, '🏠');
  c = c.replace(/ðŸš/g, '🚗');
  c = c.replace(/ðŸ"§/g, '🔧');
  c = c.replace(/ðŸ'°/g, '💰');
  c = c.replace(/ðŸ"¢/g, '📢');
  c = c.replace(/ðŸŽ‰/g, '🎉');
  c = c.replace(/ðŸš¨/g, '🚨');
  c = c.replace(/ðŸš/g, '🚌');
  fs.writeFileSync(filePath, c, 'utf8');
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) walkDir(full);
    else if (f.endsWith('.tsx') || f.endsWith('.jsx') || f.endsWith('.ts')) fixFile(full);
  });
}

walkDir('app/propflow');
console.log('Done');