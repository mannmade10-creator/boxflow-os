import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('app/layout.tsx', 'utf8');
// Remove ALL Metadata/Viewport imports and re-add clean ones
c = c.replace(/import type \{ Metadata \} from 'next'\n/g, '');
c = c.replace(/import type \{ Metadata, Viewport \} from 'next'\n/g, '');
c = c.replace(/import '\.\/globals\.css'\n/g, '');
// Add clean imports at the top
c = "import './globals.css'\nimport type { Metadata, Viewport } from 'next'\n" + c;
writeFileSync('app/layout.tsx', c, 'utf8');
console.log('Layout rewritten! First 5 lines:');
c.split('\n').slice(0,5).forEach(l => console.log(l));