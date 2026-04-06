'use client'
import React from 'react'

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #020617 0%, #0b1220 100%)', color: '#fff', fontFamily: 'Arial, sans-serif', padding: '60px 20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 40 }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 32, height: 32 }} />
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>BoxFlow OS</span>
        </a>
        <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 40 }}>
          <div style={{ color: '#60a5fa', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Legal</div>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 8px' }}>Terms of Service</h1>
          <p style={{ color: '#64748b', marginBottom: 40 }}>Last updated: April 1, 2026</p>
          
          {[
            { title: '1. Acceptance of Terms', content: 'By accessing or using BoxFlow OS ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. These terms apply to all users, including browsers, vendors, customers, merchants, and contributors of content.' },
            { title: '2. Description of Service', content: 'BoxFlow OS is an enterprise operations management platform providing dispatch, fleet tracking, production management, HR tools, AI optimization, client portals, and analytics. The Service is provided on a subscription basis with plans as described on our pricing page.' },
            { title: '3. Account Registration', content: 'To use the Service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate. You are responsible for maintaining the confidentiality of your account credentials.' },
            { title: '4. Subscription and Billing', content: 'The Service is billed on a subscription basis. You will be billed in advance on a monthly or annual basis depending on your plan. All fees are non-refundable except as expressly set forth in our Refund Policy. We reserve the right to change our pricing with 30 days notice.' },
            { title: '5. Acceptable Use', content: 'You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, overburden, or impair the Service. You may not attempt to gain unauthorized access to any portion of the Service or any systems or networks connected to the Service.' },
            { title: '6. Intellectual Property', content: 'The Service and its original content, features, and functionality are owned by BoxFlow OS and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not copy, modify, distribute, or reverse engineer any part of the Service.' },
            { title: '7. Data Ownership', content: 'You retain ownership of all data you input into the Service. By using the Service, you grant BoxFlow OS a limited license to use your data solely to provide the Service to you. We will not sell or share your data with third parties except as described in our Privacy Policy.' },
            { title: '8. Service Availability', content: 'We strive to maintain 99.9% uptime for Enterprise plans and 99.5% for other plans. Scheduled maintenance will be announced 48 hours in advance. We are not liable for any service interruptions caused by circumstances beyond our reasonable control.' },
            { title: '9. Termination', content: 'Either party may terminate this agreement at any time. Upon termination, your right to use the Service will immediately cease. You may export your data within 30 days of termination. After 30 days, your data may be permanently deleted.' },
            { title: '10. Limitation of Liability', content: 'To the maximum extent permitted by law, BoxFlow OS shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues. Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim.' },
            { title: '11. Governing Law', content: 'These Terms shall be governed by and construed in accordance with the laws of the State of Oklahoma, United States, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of Oklahoma City, Oklahoma.' },
            { title: '12. Contact', content: 'For questions about these Terms, contact us at legal@boxflowos.com or BoxFlow OS, Enterprise Operations Suite, Oklahoma City, OK, United States.' },
          ].map(section => (
            <div key={section.title} style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#60a5fa', marginBottom: 12 }}>{section.title}</h2>
              <p style={{ color: '#94a3b8', lineHeight: 1.8, margin: 0 }}>{section.content}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40, color: '#334155', fontSize: 13 }}>
          <a href="/privacy" style={{ color: '#60a5fa', marginRight: 20, textDecoration: 'none' }}>Privacy Policy</a>
          <a href="/refund" style={{ color: '#60a5fa', marginRight: 20, textDecoration: 'none' }}>Refund Policy</a>
          <a href="/cookies" style={{ color: '#60a5fa', textDecoration: 'none' }}>Cookie Policy</a>
        </div>
      </div>
    </div>
  )
}