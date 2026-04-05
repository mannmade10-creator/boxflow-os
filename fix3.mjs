import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('app/api/route-snap/route.ts', 'utf8');
c = c.replace(
  '.filter(\n          (stop) =>',
  '.filter(\n          (stop: any) =>'
);
c = c.replace('.filter((stop) =>', '.filter((stop: any) =>');
writeFileSync('app/api/route-snap/route.ts', c, 'utf8');
console.log('Route snap fixed!');