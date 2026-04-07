import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('app/globals.css', 'utf8');
c += `
@media (max-width: 768px) {
  .map-toggle-btn {
    display: block !important;
  }
}
`;
writeFileSync('app/globals.css', c, 'utf8');
console.log('Mobile CSS added!');