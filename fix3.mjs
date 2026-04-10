import { readFileSync, writeFileSync } from 'fs'; const code = readFileSync('fix_fleet.txt', 'utf8'); writeFileSync('app/production/page.tsx', code, 'utf8'); console.log('Production page rebuilt!');
