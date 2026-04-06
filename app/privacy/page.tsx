'use client'
import React from 'react'

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #020617 0%, #0b1220 100%)', color: '#fff', fontFamily: 'Arial, sans-serif', padding: '60px 20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 40 }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 32, height: 32 }} />
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>BoxFlow OS</span>
        </a>
        <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 40 }}>
          <div style={{ color: '#60a5fa', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Legal</div>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 8px' }}>Privacy Policy</h1>
          <p style={{ color: '#64748b', marginBottom: 40 }}>Last updated: April 1, 2026</p>
          
          {[
            { title: '1. Information We Collect', content: 'We collect information you provide directly to us, such as when you create an account, subscribe to our service, or contact us for support. This includes: name, email address, company name, billing information, and usage data. We also automatically collect certain information when you use BoxFlow OS, including log data, device information, and cookies.' },
            { title: '2. How We Use Your Information', content: 'We use the information we collect to provide, maintain, and improve our services, process transactions, send technical notices and support messages, respond to your comments and questions, and send you information about products, services, and events. We may also use your information to monitor and analyze trends and usage.' },
            { title: '3. Information Sharing', content: 'We do not sell, trade, or rent your personal information to third parties. We may share your information with third-party vendors and service providers that perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.' },
            { title: '4. Data Security', content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All data is encrypted in transit using TLS and at rest using AES-256 encryption. We use Supabase enterprise-grade infrastructure for data storage.' },
            { title: '5. Data Retention', content: 'We retain your personal information for as long as your account is active or as needed to provide you services. You may request deletion of your personal data at any time by contacting us at privacy@boxflowos.com. We will respond to your request within 30 days.' },
            { title: '6. Cookies', content: 'We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. See our Cookie Policy for more details.' },
            { title: '7. Third-Party Services', content: 'Our service integrates with third-party services including Supabase (database), Mapbox (mapping), and Twilio (communications). These services have their own privacy policies, and we encourage you to review them.' },
            { title: '8. Your Rights', content: 'You have the right to access, update, or delete your personal information at any time. You may also object to processing of your personal information, request that we restrict processing of your personal information, and request portability of your personal information.' },
            { title: '9. Changes to This Policy', content: 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of the service after any changes constitutes your acceptance of the new Privacy Policy.' },
            { title: '10. Contact Us', content: 'If you have any questions about this Privacy Policy, please contact us at: privacy@boxflowos.com or BoxFlow OS, Enterprise Operations Suite, Oklahoma City, OK, United States.' },
          ].map(section => (
            <div key={section.title} style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#60a5fa', marginBottom: 12 }}>{section.title}</h2>
              <p style={{ color: '#94a3b8', lineHeight: 1.8, margin: 0 }}>{section.content}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40, color: '#334155', fontSize: 13 }}>
          <a href="/terms" style={{ color: '#60a5fa', marginRight: 20, textDecoration: 'none' }}>Terms of Service</a>
          <a href="/refund" style={{ color: '#60a5fa', marginRight: 20, textDecoration: 'none' }}>Refund Policy</a>
          <a href="/cookies" style={{ color: '#60a5fa', textDecoration: 'none' }}>Cookie Policy</a>
        </div>
      </div>
    </div>
  )
}