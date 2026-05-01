const fs = require('fs');
let b = fs.readFileSync('app/propflow/dashboard/page.tsx');
if(b[0]===0xEF && b[1]===0xBB && b[2]===0xBF) b = b.slice(3);
let c = b.toString('utf8');
const lines = c.split('\r\n');
const line = lines[63];
console.log('Full line bytes:');
for(let i=0;i<line.length;i++){
  process.stdout.write(line.charCodeAt(i) + ':' + line[i] + ' ');
}
console.log('');