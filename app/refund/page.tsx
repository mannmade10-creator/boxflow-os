'use client'
import React from 'react'

export default function RefundPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #020617 0%, #0b1220 100%)', color: '#fff', fontFamily: 'Arial, sans-serif', padding: '60px 20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 40 }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 32, height: 32 }} />
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>BoxFlow OS</span>
        </a>
        <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 40 }}>
          <div style={{ color: '#60a5fa', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Legal</div>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 8px' }}>Refund Policy</h1>
          <p style={{ color: '#64748b', marginBottom: 40 }}>Last updated: April 1, 2026</p>
          
          {[
            { title: '14-Day Free Trial', content: 'All BoxFlow OS plans include a 14-day free trial with no credit card required. During the trial period, you have full access to all features of your selected plan. No charges will be made until the trial period ends.' },
            { title: 'Monthly Subscriptions', content: 'For monthly subscriptions, you may cancel at any time. Cancellations take effect at the end of the current billing period. We do not offer refunds for partial months of service. Your account will remain active until the end of the paid period.' },
            { title: 'Annual Subscriptions', content: 'Annual subscriptions may be cancelled within 30 days of purchase for a full refund minus a 10% processing fee. After 30 days, annual subscriptions are non-refundable but you may cancel to prevent renewal. Service continues until the end of the annual period.' },
            { title: 'Onboarding Fees', content: 'One-time onboarding and setup fees are non-refundable once onboarding has commenced. If onboarding has not yet started, a full refund may be issued within 7 days of purchase.' },
            { title: 'Service Outages', content: 'If BoxFlow OS experiences downtime exceeding our SLA commitments (99.9% for Enterprise, 99.5% for others), affected customers will receive service credits. Credits are calculated as 10x the hourly rate for each hour of excess downtime, applied to the next billing cycle.' },
            { title: 'How to Request a Refund', content: 'To request a refund, contact our billing team at billing@boxflowos.com with your account email and reason for the refund request. We will respond within 2 business days. Approved refunds are processed within 5-10 business days to the original payment method.' },
            { title: 'Exceptions', content: 'Refunds will not be issued for accounts terminated due to violation of our Terms of Service, including but not limited to: unauthorized use, abuse of the platform, or non-payment. Partial refunds may be considered at our discretion for extenuating circumstances.' },
            { title: 'Contact Billing', content: 'For all billing inquiries, contact us at billing@boxflowos.com. Our billing team is available Monday-Friday, 9am-5pm CST. For urgent billing issues, include "URGENT" in your email subject line.' },
          ].map(section => (
            <div key={section.title} style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#60a5fa', marginBottom: 12 }}>{section.title}</h2>
              <p style={{ color: '#94a3b8', lineHeight: 1.8, margin: 0 }}>{section.content}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40, color: '#334155', fontSize: 13 }}>
          <a href="/privacy" style={{ color: '#60a5fa', marginRight: 20, textDecoration: 'none' }}>Privacy Policy</a>
          <a href="/terms" style={{ color: '#60a5fa', marginRight: 20, textDecoration: 'none' }}>Terms of Service</a>
          <a href="/cookies" style={{ color: '#60a5fa', textDecoration: 'none' }}>Cookie Policy</a>
        </div>
      </div>
    </div>
  )
}