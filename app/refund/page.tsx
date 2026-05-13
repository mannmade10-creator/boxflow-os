'use client'
import Link from 'next/link'

export default function RefundPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#020818 0%,#070f24 100%)', color: '#f0f6ff', fontFamily: 'system-ui,sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, background: 'rgba(2,8,24,0.9)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#0A6E68,#14D2C2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#fff' }}>M</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>Made Technologies</div>
            <div style={{ fontSize: 8, color: '#14D2C2', letterSpacing: 2, textTransform: 'uppercase' }}>Enterprise Suite</div>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['About', '/about'], ['Pricing', '/pricing'], ['Contact', '/contact']].map(([l, h]) => <Link key={h} href={h} style={{ color: '#64748b', fontSize: 13, textDecoration: 'none' }}>{l}</Link>)}
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px 100px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: '#14D2C2', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16, fontWeight: 700 }}>Legal</div>
          <h1 style={{ fontSize: 42, fontWeight: 900, margin: '0 0 12px', letterSpacing: -1 }}>Refund Policy</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Last updated: January 1, 2026</p>
        </div>

        <div style={{ background: 'rgba(20,210,194,0.06)', border: '1px solid rgba(20,210,194,0.2)', borderRadius: 16, padding: 28, marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#14D2C2', marginBottom: 10 }}>Our Commitment</h2>
          <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.8, margin: 0 }}>We stand behind our products. If you are not satisfied with your Made Technologies subscription, we want to make it right. Our refund policy is designed to be fair, transparent, and easy to understand.</p>
        </div>

        {[
          { title: '14-Day Free Trial', body: 'All new subscriptions include a 14-day free trial. You will not be charged during your trial period. You can cancel at any time during your trial without any obligation. No credit card is required to start your trial.' },
          { title: 'Monthly Subscriptions', body: 'Monthly subscriptions may be cancelled at any time. Your service will continue until the end of your current billing period. We do not provide prorated refunds for partial months. If you cancel within the first 7 days of a new billing period and have not used the platform during that period, you may request a full refund for that period.' },
          { title: 'Annual Subscriptions', body: 'Annual subscriptions cancelled within 30 days of the initial purchase are eligible for a full refund, minus any setup fees. Annual subscriptions cancelled after 30 days are not eligible for a refund for the remaining months. You will retain access to the platform until the end of your paid period.' },
          { title: 'Service Outages', body: 'If our platform experiences downtime exceeding 99.9% monthly uptime SLA, you may be eligible for service credits. Credits are calculated as a percentage of your monthly fee based on the duration of the outage and are applied to your next billing cycle.' },
          { title: 'How to Request a Refund', body: 'To request a refund, contact us at billing@boxflowos.com with your account email, the reason for your request, and the amount you are requesting. We review all refund requests within 3-5 business days and process approved refunds within 5-10 business days.' },
          { title: 'Non-Refundable Items', body: 'Setup fees, professional services fees, custom integration fees, and add-on services are non-refundable. Refunds are not available for accounts that have violated our Terms of Service.' },
          { title: 'Questions', body: 'If you have any questions about our refund policy, please contact our billing team at billing@boxflowos.com or through our contact page. We are committed to resolving any billing issues quickly and fairly.' },
        ].map((s, i) => (
          <div key={i} style={{ borderLeft: '2px solid rgba(20,210,194,0.2)', paddingLeft: 24, marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f0f6ff', marginBottom: 10 }}>{s.title}</h2>
            <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.8, margin: 0 }}>{s.body}</p>
          </div>
        ))}
      </div>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 12, color: '#334155' }}>© 2026 Made Technologies Inc. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Refund', '/refund']].map(([l, h]) => (
            <Link key={h} href={h} style={{ color: '#334155', fontSize: 12, textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}