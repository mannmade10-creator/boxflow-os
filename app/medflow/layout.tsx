'use client';

import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  { icon: '▦',  label: 'Dashboard',   path: '/medflow/dashboard'   },
  { icon: '🌡', label: 'Temperature', path: '/medflow/temperature' },
  { icon: '💊', label: 'Inventory',   path: '/medflow/inventory'   },
  { icon: '⚗',  label: 'Compounding', path: '/medflow/compounding' },
  { icon: '❄',  label: 'Cold Chain',  path: '/medflow/coldchain'   },
  { icon: '🏥', label: 'Hospital',    path: '/medflow/hospital'    },
  { icon: '⬡',  label: 'Cleanrooms',  path: '/medflow/cleanrooms'  },
  { icon: '✦',  label: 'AI Panel',    path: '/medflow/ai-panel', badge: 2 },
  { icon: '📋', label: 'Compliance',  path: '/medflow/compliance'  },
  { icon: '⚙',  label: 'Settings',   path: '/medflow/settings'    },
];

export default function MedFlowLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Outfit', sans-serif", background: '#070F18' }}>
      <aside style={{ width: 210, minWidth: 210, background: '#09131F', borderRight: '1px solid #152840', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid #152840' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
            <div style={{ width: 29, height: 29, borderRadius: 8, flexShrink: 0, background: 'linear-gradient(135deg, #14D2C2, #0891B2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>⚕</div>
            <span style={{ fontSize: 19, fontWeight: 800, color: '#EEF6FB', letterSpacing: -0.5 }}>MedFlow<span style={{ color: '#14D2C2' }}>OS</span></span>
          </div>
          <div style={{ fontSize: 9, color: '#4A7090', letterSpacing: 2.5, fontFamily: 'monospace' }}>PHARMACY COMMAND CENTER</div>
        </div>

        <nav style={{ flex: 1, padding: '8px', overflowY: 'auto' }}>
          {NAV.map(item => {
            const active = pathname === item.path;
            return (
              <div key={item.path} onClick={() => router.push(item.path)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 13px', borderRadius: 9, cursor: 'pointer', marginBottom: 2, color: active ? '#14D2C2' : '#4A7090', background: active ? 'rgba(20,210,194,0.09)' : 'transparent', borderLeft: active ? '2px solid #14D2C2' : '2px solid transparent', fontSize: 13, fontWeight: 500, transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && <span style={{ fontSize: 9, background: '#F43F5E', color: '#fff', borderRadius: 4, padding: '1px 5px', fontFamily: 'monospace', fontWeight: 600 }}>{item.badge}</span>}
              </div>
            );
          })}
        </nav>

        <div style={{ padding: '12px 14px', borderTop: '1px solid #152840' }}>
          <button onClick={() => router.push('/dashboard')}
            style={{ width: '100%', background: 'transparent', border: '1px solid #152840', borderRadius: 8, color: '#4A7090', fontSize: 11, padding: '9px', cursor: 'pointer', fontFamily: 'monospace', letterSpacing: 1 }}>
            ← Back to BoxFlow OS
          </button>
        </div>

        <div style={{ padding: '13px 14px', borderTop: '1px solid #152840' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #14D2C2, #A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>R</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#EEF6FB' }}>Dr. Rivera</div>
              <div style={{ fontSize: 10, color: '#4A7090', fontFamily: 'monospace' }}>Head Pharmacist</div>
            </div>
          </div>
        </div>
      </aside>

      <div style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}