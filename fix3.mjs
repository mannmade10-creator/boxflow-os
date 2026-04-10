import { writeFileSync } from 'fs';
import { readFileSync } from 'fs';
const code = readFileSync('fix_fleet.txt', 'utf8');
writeFileSync('app/fleet-map/page.tsx', code, 'utf8');
console.log('Fleet map rebuilt!');
