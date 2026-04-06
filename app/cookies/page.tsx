'use client'
import React from 'react'

export default function CookiesPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #020617 0%, #0b1220 100%)', color: '#fff', fontFamily: 'Arial, sans-serif', padding: '60px 20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 40 }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 32, height: 32 }} />
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>BoxFlow OS</span>
        </a>
        <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 40 }}>
          <div style={{ color: '#60a5fa', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Legal</div>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 8px' }}>Cookie Policy</h1>
          <p style={{ color: '#64748b', marginBottom: 40 }}>Last updated: April 1, 2026</p>
          
          {[
            { title: 'What Are Cookies', content: 'Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.' },
            { title: 'How We Use Cookies', content: 'BoxFlow OS uses cookies to keep you logged in, remember your preferences, understand how you use our platform, and improve your experience. We use both session cookies (which expire when you close your browser) and persistent cookies (which remain on your device).' },
            { title: 'Essential Cookies', content: 'These cookies are necessary for the platform to function and cannot be switched off. They include authentication cookies that keep you logged in, security cookies that protect against CSRF attacks, and session cookies that maintain your session state.' },
            { title: 'Analytics Cookies', content: 'We use analytics cookies to understand how users interact with BoxFlow OS. This helps us improve the platform. These cookies collect information anonymously and report website trends without identifying individual visitors.' },
            { title: 'Preference Cookies', content: 'These cookies remember your settings and preferences, such as your sidebar state, dashboard layout, and notification preferences. They make your experience more personalized and efficient.' },
            { title: 'Third-Party Cookies', content: 'Some features of BoxFlow OS use third-party services that may set their own cookies. These include Mapbox for fleet mapping, Supabase for real-time data, and payment processors for billing. We do not control these third-party cookies.' },
            { title: 'Managing Cookies', content: 'You can control and manage cookies in your browser settings. Please note that removing or blocking cookies may impact your user experience and parts of the platform may no longer be fully accessible. Most browsers allow you to refuse cookies or delete specific cookies.' },
            { title: 'Contact Us', content: 'If you have questions about our use of cookies, please contact us at privacy@boxflowos.com.' },
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
          <a href="/refund" style={{ color: '#60a5fa', textDecoration: 'none' }}>Refund Policy</a>
        </div>
      </div>
    </div>
  )
}