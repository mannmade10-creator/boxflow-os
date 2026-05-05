const fs = require('fs');
const files = [
  'app/login/page.tsx',
  'app/medflow-login/page.tsx',
  'app/propflow-login/page.tsx',
  'app/classflow-login/page.tsx'
];
files.forEach(f => {
  let b = fs.readFileSync(f);
  if(b[0]===0xEF && b[1]===0xBB && b[2]===0xBF) b = b.slice(3);
  let c = b.toString('utf8');
  c = c.replace(/Â·/g, '·');
  c = c.replace(/â€¢/g, '•');
  c = c.replace(/â†'/g, '→');
  c = c.replace(/â†/g, '←');
  c = c.replace(/â€"/g, '—');
  c = c.replace(/â€˜/g, "'");
  c = c.replace(/â€™/g, "'");
  c = c.replace(/â€œ/g, '"');
  c = c.replace(/â€/g, '"');
  c = c.replace(/âœ"/g, '✓');
  c = c.replace(/Â·/g, '·');
  c = c.replace(/placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"/g, 'placeholder="••••••••"');
  fs.writeFileSync(f, c, 'utf8');
  console.log('Fixed:', f);
});