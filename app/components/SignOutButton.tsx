'use client'

import { supabase } from '../../lib/supabase'

export default function SignOutButton({
  block = false,
}: {
  block?: boolean
}) {
  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <button
      onClick={handleSignOut}
      style={{
        display: block ? 'block' : 'inline-block',
        width: block ? '100%' : 'auto',
        textAlign: 'center',
        background: 'rgba(239,68,68,0.16)',
        color: '#fecaca',
        border: '1px solid rgba(239,68,68,0.26)',
        padding: '12px 14px',
        borderRadius: block ? 12 : 999,
        fontWeight: 800,
        cursor: 'pointer',
      }}
    >
      Sign Out
    </button>
  )
}