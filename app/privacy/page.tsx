'use client'
import Link from 'next/link'

const NAV = [['About', '/about'], ['Pricing', '/pricing'], ['Demo', '/demo'], ['Contact', '/contact']]

export default function PrivacyPage() {
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
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {NAV.map(([l, h]) => <Link key={h} href={h} style={{ color: '#64748b', fontSize: 13, textDecoration: 'none' }}>{l}</Link>)}
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px 100px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: '#14D2C2', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16, fontWeight: 700 }}>Legal</div>
          <h1 style={{ fontSize: 42, fontWeight: 900, margin: '0 0 12px', letterSpacing: -1 }}>Privacy Policy</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Last updated: January 1, 2026</p>
        </div>

        {[
          { title: '1. Information We Collect', body: 'We collect information you provide directly to us when you create an account, use our platforms, or contact us for support. This includes your name, email address, company name, phone number, and payment information. We also collect information automatically when you use our services, including log data, device information, and usage data.' },
          { title: '2. How We Use Your Information', body: 'We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, respond to your comments and questions, and send you marketing communications (with your consent). We also use your information to monitor and analyze usage patterns and improve user experience.' },
          { title: '3. Information Sharing', body: 'We do not sell, trade, or otherwise transfer your personal information to outside parties except as described in this policy. We may share your information with trusted third parties who assist us in operating our platform, conducting our business, or servicing you, as long as those parties agree to keep this information confidential.' },
          { title: '4. Data Security', body: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All data is encrypted in transit using TLS and at rest using AES-256 encryption. We conduct regular security audits and penetration testing.' },
          { title: '5. Data Retention', body: 'We retain your personal information for as long as your account is active or as needed to provide you services. You may request deletion of your data at any time by contacting us. We will delete or anonymize your information within 30 days of your request, subject to legal obligations.' },
          { title: '6. Your Rights', body: 'You have the right to access, correct, or delete your personal information. You may also object to or restrict certain processing of your data. To exercise these rights, contact us at privacy@boxflowos.com. We will respond to your request within 30 days.' },
          { title: '7. Cookies', body: 'We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some parts of our service may not function properly.' },
          { title: '8. Third-Party Services', body: 'Our platforms may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of those third parties. We encourage you to review the privacy policies of any third-party services you use in connection with our platforms.' },
          { title: '9. Children\'s Privacy', body: 'Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child, we will take steps to delete such information.' },
          { title: '10. Changes to This Policy', body: 'We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.' },
          { title: '11. Contact Us', body: 'If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@boxflowos.com or by mail at Made Technologies Inc, Enterprise Software Suite.' },
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
          {[['Terms', '/terms'], ['Refund', '/refund'], ['Privacy', '/privacy']].map(([l, h]) => (
            <Link key={h} href={h} style={{ color: '#334155', fontSize: 12, textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}