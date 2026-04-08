import { readFileSync, writeFileSync } from 'fs';

// Fix 1: Analytics page - make grids stack on mobile
let analytics = readFileSync('app/analytics/page.tsx', 'utf8');
analytics = analytics.replace(
  "gridTemplateColumns: 'repeat(4, minmax(0, 1fr))'",
  "gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'"
);
analytics = analytics.replace(
  "gridTemplateColumns: '1fr 1fr'",
  "gridTemplateColumns: 'minmax(0,1fr)'"
);
writeFileSync('app/analytics/page.tsx', analytics, 'utf8');
console.log('Analytics fixed!');

// Fix 2: AI Panel - fix cost savings overflow
let executive = readFileSync('app/executive/page.tsx', 'utf8');
executive = executive.replace(
  "gridTemplateColumns: 'repeat(4, minmax(0, 1fr))'",
  "gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'"
);
executive = executive.replace(
  "gridTemplateColumns: '1fr 1fr'",
  "gridTemplateColumns: '1fr'"
);
writeFileSync('app/executive/page.tsx', executive, 'utf8');
console.log('AI Panel fixed!');

// Fix 3: Pitch page - fix overflow on mobile
let pitch = readFileSync('app/pitch/page.tsx', 'utf8');
pitch = pitch.replace(
  "padding: '40px 60px'",
  "padding: 'clamp(16px, 4vw, 60px)'"
);
pitch = pitch.replace(
  "fontSize: 80",
  "fontSize: 'clamp(32px, 7vw, 80px)'"
);
pitch = pitch.replace(
  "fontSize: 64",
  "fontSize: 'clamp(28px, 6vw, 64px)'"
);
pitch = pitch.replace(
  "fontSize: 56",
  "fontSize: 'clamp(24px, 5vw, 56px)'"
);
pitch = pitch.replace(
  "fontSize: 52",
  "fontSize: 'clamp(22px, 4vw, 52px)'"
);
pitch = pitch.replace(
  "fontSize: 48",
  "fontSize: 'clamp(20px, 4vw, 48px)'"
);
pitch = pitch.replace(
  "gridTemplateColumns: 'repeat(4, 1fr)'",
  "gridTemplateColumns: 'repeat(2, 1fr)'"
);
pitch = pitch.replace(
  "gridTemplateColumns: 'repeat(3, 1fr)'",
  "gridTemplateColumns: 'repeat(2, 1fr)'"
);
pitch = pitch.replace(
  "gridTemplateColumns: '1fr 1fr'",
  "gridTemplateColumns: '1fr'"
);
writeFileSync('app/pitch/page.tsx', pitch, 'utf8');
console.log('Pitch fixed!');

// Fix 4: IP Pitch - same fixes
let ipPitch = readFileSync('app/ip-pitch/page.tsx', 'utf8');
ipPitch = ipPitch.replace(
  "padding: '40px 60px'",
  "padding: 'clamp(16px, 4vw, 60px)'"
);
ipPitch = ipPitch.replace(/fontSize: 80/g, "fontSize: 'clamp(28px, 6vw, 80px)'");
ipPitch = ipPitch.replace(/fontSize: 64/g, "fontSize: 'clamp(24px, 5vw, 64px)'");
ipPitch = ipPitch.replace(/fontSize: 56/g, "fontSize: 'clamp(22px, 4vw, 56px)'");
ipPitch = ipPitch.replace(/fontSize: 52/g, "fontSize: 'clamp(20px, 4vw, 52px)'");
ipPitch = ipPitch.replace(/fontSize: 48/g, "fontSize: 'clamp(18px, 4vw, 48px)'");
ipPitch = ipPitch.replace(/fontSize: 44/g, "fontSize: 'clamp(18px, 4vw, 44px)'");
ipPitch = ipPitch.replace(
  "gridTemplateColumns: 'repeat(4, 1fr)'",
  "gridTemplateColumns: 'repeat(2, 1fr)'"
);
ipPitch = ipPitch.replace(
  "gridTemplateColumns: 'repeat(3, 1fr)'",
  "gridTemplateColumns: 'repeat(2, 1fr)'"
);
ipPitch = ipPitch.replace(
  "gridTemplateColumns: '1fr 1fr'",
  "gridTemplateColumns: '1fr'"
);
ipPitch = ipPitch.replace(
  "gridTemplateColumns: '1fr 2fr'",
  "gridTemplateColumns: '1fr'"
);
writeFileSync('app/ip-pitch/page.tsx', ipPitch, 'utf8');
console.log('IP Pitch fixed!');

console.log('All pages fixed!');