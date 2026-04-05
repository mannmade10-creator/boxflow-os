import { readFileSync, writeFileSync, readdirSync } from 'fs';
const files = [
  'app/command-center/page.tsx',
  'app/orders/page.tsx',
  'app/dispatch/page.tsx',
  'app/executive/page.tsx',
  'app/settings/page.tsx',
  'app/hr/page.tsx',
  'app/client/page.tsx',
  'app/driver/page.tsx',
  'app/dashboard/page.tsx',
];
files.forEach(path => {
  try {
    let content = readFileSync(path, 'utf8');
    content = content.replace(import AuthGate from '@/components/AuthGate', import AppSidebar from '@/components/AppSidebar');
    content = content.replace(import AuthGate from '@/components/AuthGate', import AppSidebar from '@/components/AppSidebar');
    writeFileSync(path, content, 'utf8');
    console.log('Fixed: ' + path);
  } catch(e) {
    console.log('Skipped: ' + path);
  }
});
