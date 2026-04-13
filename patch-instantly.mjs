import { readFileSync, writeFileSync } from 'fs';

const INSTANTLY_API_KEY = 'N2RjYTJlOGYtMWE2NC00NGU1LTg0OTUtOThiOTA3MTkxYWU3OkZUV1hrZVhxb2dCQg==';
const CAMPAIGN_ID = '03855a25-fb18-40e1-9aea-dd58f4cf5a32';

let c = readFileSync('app/leads/page.tsx', 'utf8');

// ─── STEP 1: Replace mailto anchor with modal trigger button ───────────────────
c = c.replace(
  `<a href={'mailto:Kenneth.Covington@boxflowos.com?subject=BoxFlow OS Demo for ' + lead.company + '&body=Hi ' + lead.contact + ',%0A%0AI would like to schedule a demo of BoxFlow OS for ' + lead.company + '.%0A%0ABoxFlow OS replaces McLeod, Samsara, SAP, Oracle, and 6+ other platforms in one system saving companies up to $14.5M per year.%0A%0AThe platform is live: https://boxflow-os.vercel.app%0A%0AWould you be open to a 20-minute call this week?%0A%0AKenneth Covington%0ABoxFlow OS%0AKenneth.Covington@boxflowos.com'} style={{ padding: '5px 10px', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: 2, color: '#b4c5ff', fontSize: 10, fontWeight: 700, letterSpacing: 1, textDecoration: 'none', textAlign: 'center' }}>ðŸ"§ EMAIL</a>`,
  `<button onClick={() => { setEmailLead(lead); setEmailSending(false); setEmailSent(false); setEmailError(''); }} style={{ padding: '5px 10px', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: 2, color: '#b4c5ff', fontSize: 10, fontWeight: 700, letterSpacing: 1, cursor: 'pointer', width: '100%' }}>📧 EMAIL</button>`
);

// ─── STEP 2: Add state variables after editNotes state ────────────────────────
c = c.replace(
  "const [editNotes, setEditNotes] = useState('')",
  `const [editNotes, setEditNotes] = useState('')
  const [emailLead, setEmailLead] = useState<typeof initialLeads[0] | null>(null)
  const [emailSending, setEmailSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState('')`
);

// ─── STEP 3: Add the Instantly.ai send function ───────────────────────────────
// Insert before the return statement
c = c.replace(
  `return (`,
  `const sendViaInstantly = async (lead: typeof initialLeads[0], body: string) => {
    setEmailSending(true)
    setEmailError('')
    try {
      const nameParts = (lead.contact || '').trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      const payload = {
        api_key: '${INSTANTLY_API_KEY}',
        campaign_id: '${CAMPAIGN_ID}',
        email: lead.email,
        first_name: firstName,
        last_name: lastName,
        company_name: lead.company,
        personalization: body,
      }

      const res = await fetch('https://api.instantly.ai/api/v1/lead/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        updateStatus(lead.id, 'Emailed')
        setEmailSent(true)
      } else {
        const errText = await res.text()
        setEmailError('Instantly.ai error: ' + errText)
      }
    } catch (err: any) {
      setEmailError('Network error: ' + (err?.message || String(err)))
    } finally {
      setEmailSending(false)
    }
  }

  return (`
);

// ─── STEP 4: Replace the email modal (before the selectedLead modal) ──────────
c = c.replace(
  `{selected && selectedLead && (`,
  `{emailLead && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#151b2d', borderRadius: 4, padding: 32, width: 620, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#dce1fb', fontFamily: 'monospace' }}>⚡ Send via Instantly.ai</div>
                <div style={{ fontSize: 13, color: 'rgba(195,198,215,0.4)', marginTop: 4 }}>{emailLead.company} — {emailLead.contact}</div>
              </div>
              <button onClick={() => { setEmailLead(null); setEmailSent(false); setEmailError(''); }} style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            {/* Success State */}
            {emailSent ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#22c55e', marginBottom: 8 }}>Lead Added to Instantly!</div>
                <div style={{ fontSize: 14, color: 'rgba(195,198,215,0.5)', marginBottom: 24 }}>
                  {emailLead.contact} at {emailLead.company} has been added to your campaign and will be emailed automatically.
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button
                    onClick={() => { setEmailLead(null); setEmailSent(false); }}
                    style={{ padding: '10px 24px', background: '#22c55e', border: 'none', borderRadius: 3, color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}
                  >
                    ✓ Done
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* To */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: 'rgba(195,198,215,0.4)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>To</div>
                  <div style={{ padding: '10px 14px', background: 'rgba(12,19,36,0.5)', borderRadius: 3, fontSize: 14, color: '#dce1fb', border: '1px solid rgba(180,197,255,0.1)' }}>
                    {emailLead.contact} — <span style={{ color: '#b4c5ff' }}>{emailLead.email || <em style={{ color: '#ef4444' }}>No email on record</em>}</span>
                  </div>
                </div>

                {/* Campaign */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: 'rgba(195,198,215,0.4)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Campaign</div>
                  <div style={{ padding: '10px 14px', background: 'rgba(12,19,36,0.5)', borderRadius: 3, fontSize: 13, color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)', fontFamily: 'monospace' }}>
                    ⚡ ${CAMPAIGN_ID}
                  </div>
                </div>

                {/* Subject */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: 'rgba(195,198,215,0.4)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Subject (set in Instantly campaign)</div>
                  <div style={{ padding: '10px 14px', background: 'rgba(12,19,36,0.5)', borderRadius: 3, fontSize: 14, color: '#dce1fb', border: '1px solid rgba(180,197,255,0.1)', fontFamily: 'monospace' }}>
                    Cutting {emailLead.company} Software Costs by 96%
                  </div>
                </div>

                {/* Personalization Body */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: 'rgba(195,198,215,0.4)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Personalization / Email Body</div>
                  <textarea
                    id="emailBody"
                    rows={10}
                    defaultValue={"Hi " + emailLead.contact.split(' ')[0] + ",\\n\\nI want to be direct with you.\\n\\nThe average logistics and manufacturing company pays $10-16 million per year for disconnected software — McLeod, Samsara, SAP, Oracle, TMW, and Fishbowl — none of which talk to each other.\\n\\nI built BoxFlow OS to replace all of it with one platform. One login. One source of truth. Every operation on one screen.\\n\\nCompanies switching to BoxFlow OS save up to $14.5 million per year — a 96% cost reduction.\\n\\nThe platform is live right now:\\nboxflow-os.vercel.app\\n\\nWould you be open to a 20-minute demo this week?\\n\\nKenneth Covington\\nFounder, BoxFlow OS\\nKenneth.Covington@boxflowos.com\\nboxflow-os.vercel.app"}
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(12,19,36,0.6)', border: '1px solid rgba(180,197,255,0.15)', borderRadius: 3, color: '#dce1fb', fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'Inter, Arial, sans-serif', lineHeight: 1.6 }}
                  />
                </div>

                {/* Error */}
                {emailError && (
                  <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 3, color: '#ef4444', fontSize: 13 }}>
                    ⚠️ {emailError}
                  </div>
                )}

                {/* Send Button */}
                <button
                  disabled={emailSending || !emailLead.email}
                  onClick={() => {
                    const body = (document.getElementById('emailBody') as HTMLTextAreaElement)?.value || ''
                    sendViaInstantly(emailLead, body)
                  }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: emailSending ? 'rgba(37,99,235,0.4)' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    border: 'none',
                    borderRadius: 3,
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 15,
                    cursor: emailSending ? 'not-allowed' : 'pointer',
                    letterSpacing: 1,
                    opacity: !emailLead.email ? 0.5 : 1,
                  }}
                >
                  {emailSending ? '⏳ Sending to Instantly...' : '⚡ ADD TO INSTANTLY CAMPAIGN'}
                </button>

                {!emailLead.email && (
                  <div style={{ marginTop: 10, textAlign: 'center', fontSize: 12, color: '#ef4444' }}>
                    ⚠️ This lead has no email address on record. Add one to their profile first.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {selected && selectedLead && (`
);

writeFileSync('app/leads/page.tsx', c, 'utf8');
console.log('✅ Instantly.ai email integration patched successfully!');
