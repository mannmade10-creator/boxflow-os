'use client'
import Link from 'next/link'

export default function TermsPage() {
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
          <h1 style={{ fontSize: 42, fontWeight: 900, margin: '0 0 12px', letterSpacing: -1 }}>Terms of Service</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Last updated: January 1, 2026</p>
        </div>

        {[
          { title: '1. Acceptance of Terms', body: 'By accessing or using any Made Technologies Inc platform including BoxFlow OS, MedFlow OS, PropFlow OS, or ClassFlow AI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.' },
          { title: '2. Description of Service', body: 'Made Technologies Inc provides enterprise software platforms for logistics, healthcare, property management, and education. Our services are provided on a subscription basis and include access to our web-based platforms, APIs, and related support services.' },
          { title: '3. Account Registration', body: 'To use our services, you must create an account and provide accurate, complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.' },
          { title: '4. Subscription and Payment', body: 'Our services are billed on a monthly or annual subscription basis. Payment is due at the beginning of each billing period. If payment fails, your access may be suspended until payment is received. All fees are non-refundable except as described in our Refund Policy.' },
          { title: '5. Acceptable Use', body: 'You agree to use our services only for lawful purposes and in accordance with these terms. You may not use our services to violate any laws, infringe on intellectual property rights, transmit harmful or offensive content, or attempt to gain unauthorized access to our systems or other users accounts.' },
          { title: '6. Data Ownership', body: 'You retain ownership of all data you input into our platforms. We do not claim ownership of your data. By using our services, you grant us a limited license to process your data solely for the purpose of providing our services to you.' },
          { title: '7. Intellectual Property', body: 'All content, features, and functionality of our platforms — including software, text, graphics, logos, and interfaces — are owned by Made Technologies Inc and are protected by intellectual property laws. You may not copy, modify, or distribute our software or content without express written permission.' },
          { title: '8. Service Availability', body: 'We strive to maintain 99.9% uptime for our platforms. Scheduled maintenance will be communicated in advance. We are not liable for any downtime caused by factors outside our control including internet outages, force majeure events, or third-party service failures.' },
          { title: '9. Limitation of Liability', body: 'To the maximum extent permitted by law, Made Technologies Inc shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.' },
          { title: '10. Termination', body: 'Either party may terminate this agreement at any time. We may terminate or suspend your access immediately if you violate these terms. Upon termination, your right to use our services will cease immediately. You may export your data within 30 days of termination.' },
          { title: '11. Governing Law', body: 'These terms shall be governed by the laws of the State of Oklahoma, United States, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of Oklahoma County, Oklahoma.' },
          { title: '12. Contact', body: 'For questions about these terms, contact us at legal@boxflowos.com or through our contact page at boxflowos.com/contact.' },
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
          {[['Privacy', '/privacy'], ['Refund', '/refund'], ['Terms', '/terms']].map(([l, h]) => (
            <Link key={h} href={h} style={{ color: '#334155', fontSize: 12, textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}