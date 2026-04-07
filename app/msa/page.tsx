'use client'
import React, { useState } from 'react'

export default function MSAPage() {
  const [clientName, setClientName] = useState('')
  const [contactName, setContactName] = useState('')
  const [address, setAddress] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [plan, setPlan] = useState('Enterprise')
  const [annualFee, setAnnualFee] = useState('500,000')
  const [implementationFee, setImplementationFee] = useState('150,000')
  const [supportFee, setSupportFee] = useState('100,000')
  const [term, setTerm] = useState('1')

  const totalYear1 = (parseInt(annualFee.replace(/,/g,'')) + parseInt(implementationFee.replace(/,/g,'')) + parseInt(supportFee.replace(/,/g,''))).toLocaleString()

  function formatCurrency(val: string) {
    const num = parseInt(val.replace(/,/g,''))
    return isNaN(num) ? val : num.toLocaleString()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #020617 0%, #0b1220 100%)', color: '#fff', fontFamily: 'Arial, sans-serif', padding: '60px 20px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 40 }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 36, height: 36 }} />
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>BoxFlow OS</span>
        </a>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 999, background: 'rgba(37,99,235,0.14)', border: '1px solid rgba(96,165,250,0.24)', color: '#93c5fd', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Legal Document</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, margin: '0 0 16px' }}>Master Service Agreement</h1>
          <p style={{ color: '#94a3b8', fontSize: 16 }}>Generate a customized MSA for your enterprise client.</p>
        </div>

        <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 32, marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 20px', color: '#60a5fa' }}>Contract Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Client Company Name</label>
              <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g. International Paper Co." style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(2,6,23,0.5)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Client Representative</label>
              <input value={contactName} onChange={e => setContactName(e.target.value)} placeholder="e.g. John Smith, CTO" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(2,6,23,0.5)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Client Address</label>
              <input value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. Memphis, TN" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(2,6,23,0.5)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Agreement Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(2,6,23,0.5)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Service Plan</label>
              <select value={plan} onChange={e => setPlan(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(2,6,23,0.5)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}>
                <option>Starter</option>
                <option>Professional</option>
                <option>Enterprise</option>
                <option>Corporate Custom</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Contract Term (Years)</label>
              <select value={term} onChange={e => setTerm(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(2,6,23,0.5)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}>
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="3">3 Years</option>
                <option value="5">5 Years</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Annual License Fee ($)</label>
              <input value={annualFee} onChange={e => setAnnualFee(formatCurrency(e.target.value))} placeholder="500,000" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(2,6,23,0.5)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Implementation Fee ($)</label>
              <input value={implementationFee} onChange={e => setImplementationFee(formatCurrency(e.target.value))} placeholder="150,000" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(2,6,23,0.5)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Annual Support Fee ($)</label>
              <input value={supportFee} onChange={e => setSupportFee(formatCurrency(e.target.value))} placeholder="100,000" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(2,6,23,0.5)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button onClick={() => window.print()} style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
                🖨️ Print / Download PDF
              </button>
            </div>
          </div>

          <div style={{ marginTop: 24, padding: 20, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#86efac', fontWeight: 700, fontSize: 16 }}>Year 1 Total Contract Value</span>
            <span style={{ color: '#22c55e', fontWeight: 900, fontSize: 28 }}>${totalYear1}</span>
          </div>
        </div>

        <div style={{ background: '#fff', color: '#000', borderRadius: 24, padding: '60px', fontFamily: 'Georgia, serif', lineHeight: 1.8, fontSize: 14 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>MASTER SERVICE AGREEMENT</div>
            <div style={{ fontSize: 13, color: '#666' }}>Effective Date: {date || '[DATE]'}</div>
          </div>

          <p style={{ marginBottom: 20 }}>
            This Master Service Agreement (this <strong>"Agreement"</strong>) is entered into as of <strong>{date || '[DATE]'}</strong>, by and between <strong>BoxFlow OS LLC</strong>, a limited liability company organized under the laws of the State of Oklahoma (<strong>"Provider"</strong>), and <strong>{clientName || '[CLIENT COMPANY NAME]'}</strong>, located at {address || '[CLIENT ADDRESS]'}, represented by <strong>{contactName || '[REPRESENTATIVE]'}</strong> (<strong>"Client"</strong>).
          </p>

          {[
            {
              num: '1',
              title: 'Services',
              content: 'Provider agrees to provide Client with access to the BoxFlow OS enterprise operations platform (the "Platform") under the ' + plan + ' plan, including all modules described in the applicable Order Form. Services include: dispatch management, live fleet tracking, production floor management, HR and payroll tools, AI optimization engine, executive analytics dashboard, client portal, and real-time notification system. Provider shall use commercially reasonable efforts to make the Platform available 99.9% of the time, measured monthly, excluding scheduled maintenance.'
            },
            {
              num: '2',
              title: 'Term',
              content: 'This Agreement shall commence on the Effective Date and continue for a period of ' + term + ' year(s) (the "Initial Term"), unless earlier terminated in accordance with this Agreement. Following the Initial Term, this Agreement shall automatically renew for successive one-year periods unless either Party provides written notice of non-renewal at least sixty (60) days prior to the end of the then-current term.'
            },
            {
              num: '3',
              title: 'Fees and Payment',
              content: 'Client agrees to pay Provider the following fees: (a) Annual Platform License Fee of $' + annualFee + ' per year, invoiced annually in advance; (b) One-time Implementation and Onboarding Fee of $' + implementationFee + ', invoiced upon execution of this Agreement; (c) Annual Support and Maintenance Fee of $' + supportFee + ', invoiced annually in advance. Total Year 1 investment: $' + totalYear1 + '. All fees are due within thirty (30) days of invoice. Late payments shall accrue interest at 1.5% per month.'
            },
            {
              num: '4',
              title: 'Implementation and Onboarding',
              content: 'Provider shall assign a dedicated implementation team to configure the Platform for Client specific operational requirements. Implementation shall include: system configuration, data migration assistance, API integration with existing systems, user training for all modules, and a 30-day hypercare period following go-live. Provider targets a go-live date within sixty (60) days of Agreement execution, subject to Client timely provision of required information and access.'
            },
            {
              num: '5',
              title: 'Intellectual Property',
              content: 'Provider retains all right, title, and interest in and to the Platform, including all software, algorithms, AI models, and documentation. Client retains all right, title, and interest in and to Client data entered into the Platform. Provider is granted a limited license to use Client data solely to provide the Services. Upon termination, Provider shall provide Client with an export of all Client data within thirty (30) days.'
            },
            {
              num: '6',
              title: 'Confidentiality',
              content: 'Each Party agrees to keep confidential all non-public information received from the other Party and to use such information solely for purposes of this Agreement. This obligation shall survive termination of the Agreement for a period of five (5) years. Each Party may disclose Confidential Information to its employees, contractors, and advisors who have a need to know and are bound by equivalent confidentiality obligations.'
            },
            {
              num: '7',
              title: 'Data Security and Privacy',
              content: 'Provider shall implement and maintain commercially reasonable technical and organizational security measures to protect Client data, including encryption at rest and in transit, access controls, regular security audits, and incident response procedures. Provider shall notify Client within 48 hours of becoming aware of any data breach affecting Client data. Provider shall comply with all applicable data protection laws and regulations.'
            },
            {
              num: '8',
              title: 'Support and Service Levels',
              content: 'Provider shall provide technical support via email and phone during business hours (9am-6pm CST, Monday-Friday). Critical issues (Platform unavailable) shall receive a response within 2 hours and resolution within 8 hours. High priority issues shall receive a response within 4 hours. Client shall have access to a dedicated Customer Success Manager throughout the term of this Agreement.'
            },
            {
              num: '9',
              title: 'Limitation of Liability',
              content: 'In no event shall either Party be liable for any indirect, incidental, special, consequential, or punitive damages. Provider total cumulative liability under this Agreement shall not exceed the total fees paid by Client in the twelve (12) months preceding the event giving rise to the claim. These limitations shall not apply to breaches of confidentiality obligations or indemnification obligations.'
            },
            {
              num: '10',
              title: 'Termination',
              content: 'Either Party may terminate this Agreement: (a) upon thirty (30) days written notice if the other Party materially breaches this Agreement and fails to cure such breach within the notice period; (b) immediately if the other Party becomes insolvent or files for bankruptcy. Upon termination, Client obligations to pay fees through the end of the current term shall survive. Provider shall provide Client data export within 30 days of termination.'
            },
            {
              num: '11',
              title: 'Indemnification',
              content: 'Provider shall indemnify, defend, and hold harmless Client from any third-party claims alleging that the Platform infringes any intellectual property right. Client shall indemnify, defend, and hold harmless Provider from any third-party claims arising from Client use of the Platform in violation of this Agreement or applicable law.'
            },
            {
              num: '12',
              title: 'Governing Law and Dispute Resolution',
              content: 'This Agreement shall be governed by the laws of the State of Oklahoma. The Parties agree to attempt to resolve any dispute through good faith negotiation for thirty (30) days before initiating formal proceedings. Any unresolved disputes shall be submitted to binding arbitration in Oklahoma City, Oklahoma, under the rules of the American Arbitration Association.'
            },
            {
              num: '13',
              title: 'General Provisions',
              content: 'This Agreement, together with any Order Forms, constitutes the entire agreement between the Parties and supersedes all prior agreements relating to the subject matter. This Agreement may not be amended except by written instrument signed by authorized representatives of both Parties. If any provision is found unenforceable, the remaining provisions shall continue in full force. Neither Party may assign this Agreement without the prior written consent of the other Party, except in connection with a merger or acquisition.'
            },
          ].map(section => (
            <div key={section.num} style={{ marginBottom: 22 }}>
              <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 8 }}>Section {section.num}. {section.title}</div>
              <p style={{ margin: 0, color: '#333', lineHeight: 1.9, fontSize: 13 }}>{section.content}</p>
            </div>
          ))}

          <div style={{ marginTop: 48, paddingTop: 32, borderTop: '2px solid #000' }}>
            <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 32 }}>IN WITNESS WHEREOF, the Parties have executed this Master Service Agreement as of the date first written above.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
              <div>
                <div style={{ fontWeight: 900, marginBottom: 24, fontSize: 15 }}>BoxFlow OS LLC ("Provider")</div>
                <div style={{ borderBottom: '1px solid #000', marginBottom: 8, height: 48 }}></div>
                <div style={{ fontSize: 12, color: '#666' }}>Authorized Signature</div>
                <div style={{ marginTop: 20, borderBottom: '1px solid #000', marginBottom: 8, paddingTop: 8 }}>BoxFlow OS Representative</div>
                <div style={{ fontSize: 12, color: '#666' }}>Printed Name & Title</div>
                <div style={{ marginTop: 20, borderBottom: '1px solid #000', marginBottom: 8, paddingTop: 8 }}>{date}</div>
                <div style={{ fontSize: 12, color: '#666' }}>Date</div>
              </div>
              <div>
                <div style={{ fontWeight: 900, marginBottom: 24, fontSize: 15 }}>{clientName || '[CLIENT NAME]'} ("Client")</div>
                <div style={{ borderBottom: '1px solid #000', marginBottom: 8, height: 48 }}></div>
                <div style={{ fontSize: 12, color: '#666' }}>Authorized Signature</div>
                <div style={{ marginTop: 20, borderBottom: '1px solid #000', marginBottom: 8, paddingTop: 8 }}>{contactName || '[NAME & TITLE]'}</div>
                <div style={{ fontSize: 12, color: '#666' }}>Printed Name & Title</div>
                <div style={{ marginTop: 20, borderBottom: '1px solid #000', marginBottom: 8, paddingTop: 8 }}>{date}</div>
                <div style={{ fontSize: 12, color: '#666' }}>Date</div>
              </div>
            </div>
            <div style={{ marginTop: 40, padding: '16px 20px', background: '#f8f9fa', borderRadius: 8, fontSize: 12, color: '#666' }}>
              <strong>EXHIBIT A — Service Plan:</strong> {plan} | <strong>Annual License:</strong> ${annualFee} | <strong>Implementation:</strong> ${implementationFee} | <strong>Annual Support:</strong> ${supportFee} | <strong>Term:</strong> {term} Year(s) | <strong>Year 1 Total:</strong> ${totalYear1}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 32, fontSize: 11, color: '#999', borderTop: '1px solid #eee', paddingTop: 16 }}>
            BoxFlow OS LLC • Oklahoma City, Oklahoma • legal@boxflowos.com • boxflow-os.vercel.app
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 16 }}>This MSA template is provided for reference. Have a licensed attorney review before execution.</p>
          <a href="/contact" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 700 }}>Need help? Contact our team →</a>
        </div>
      </div>
    </div>
  )
}