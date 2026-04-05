import { writeFileSync, readFileSync } from 'fs';

// Fix AuthGate component
writeFileSync('components/AuthGate.tsx', `'use client'
import React from 'react'
export default function AuthGate({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
`, 'utf8');

// Fix alerts page - remove AuthGate wrapper
let alerts = readFileSync('app/alerts/page.tsx', 'utf8');
alerts = alerts.replace("import AuthGate from '../../components/AuthGate'", '');
alerts = alerts.replace("import AuthGate from '@/components/AuthGate'", '');
alerts = alerts.replace('<AuthGate>', '');
alerts = alerts.replace('</AuthGate>', '');
writeFileSync('app/alerts/page.tsx', alerts, 'utf8');

console.log('AuthGate and alerts fixed!');