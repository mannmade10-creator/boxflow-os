import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('app/equipment/page.tsx', 'utf8');

c = c.replace(
  `<img src={'/machines/' + machine.id.toLowerCase() + '.png'} alt={machine.lineName} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 12, border: '2px solid rgba(148,163,184,0.3)', marginBottom: 12 }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />`,
  `<div style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: statusColor(machine.status) + '22', border: '2px solid ' + statusColor(machine.status) }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={statusColor(machine.status)} strokeWidth="1.5">
                    <rect x="2" y="7" width="14" height="10" rx="1" />
                    <path d="M16 10h3l3 3v4h-6" />
                    <circle cx="6.5" cy="18" r="1.8" />
                    <circle cx="17.5" cy="18" r="1.8" />
                  </svg>
                </div>`
);

writeFileSync('app/equipment/page.tsx', c, 'utf8');
console.log('Machine photos replaced with icon placeholders!');