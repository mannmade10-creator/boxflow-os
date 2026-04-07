'use client'
import React, { useState } from 'react'

export default function NDAPage() {
  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [printed, setPrinted] = useState(false)

  function printNDA() {
    setPrinted(true)
    setTimeout(() => window.print(), 300)
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
          <h1 style={{ fontSize: 48, fontWeight: 900, margin: '0 0 16px' }}>Mutual Non-Disclosure Agreement</h1>
          <p style={{ color: '#94a3b8', fontSize: 16 }}>Fill in the details below to generate your customized NDA.</p>
        </div>

        <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 32, marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 20px', color: '#60a5fa' }}>Customize Your NDA</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Their Company Name</label>
              <input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. International Paper Co." style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(2,6,23,0.5)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Their Representative Name</label>
              <input value={contactName} onChange={e => setContactName(e.target.value)} placeholder="e.g. John Smith" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(2,6,23,0.5)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Agreement Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(2,6,23,0.5)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button onClick={printNDA} style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
                🖨️ Print / Download PDF
              </button>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', color: '#000', borderRadius: 24, padding: '60px', fontFamily: 'Georgia, serif', lineHeight: 1.8 }} id="nda-document">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>MUTUAL NON-DISCLOSURE AGREEMENT</div>
            <div style={{ fontSize: 14, color: '#666' }}>Effective Date: {date || '[DATE]'}</div>
          </div>

          <p style={{ marginBottom: 20, fontSize: 15 }}>
            This Mutual Non-Disclosure Agreement (this <strong>"Agreement"</strong>) is entered into as of <strong>{date || '[DATE]'}</strong>, by and between:
          </p>

          <div style={{ background: '#f8f9fa', borderLeft: '4px solid #2563eb', padding: '20px 24px', marginBottom: 20, borderRadius: '0 8px 8px 0' }}>
            <strong>Party 1:</strong> BoxFlow OS LLC, a limited liability company organized under the laws of the State of Oklahoma, with its principal place of business in Oklahoma City, Oklahoma (<strong>"BoxFlow OS"</strong>)
          </div>

          <div style={{ background: '#f8f9fa', borderLeft: '4px solid #8b5cf6', padding: '20px 24px', marginBottom: 28, borderRadius: '0 8px 8px 0' }}>
            <strong>Party 2:</strong> {companyName || '[COMPANY NAME]'}, represented by {contactName || '[REPRESENTATIVE NAME]'} (<strong>"Receiving Party"</strong>)
          </div>

          <p style={{ marginBottom: 24, fontSize: 15 }}>Each of BoxFlow OS and Receiving Party may be referred to herein individually as a <strong>"Party"</strong> and collectively as the <strong>"Parties."</strong></p>

          {[
            {
              num: '1',
              title: 'Purpose',
              content: 'The Parties wish to explore a potential business relationship concerning the licensing, implementation, and/or customization of the BoxFlow OS enterprise operations platform (the "Purpose"). In connection with this Purpose, each Party may disclose to the other certain confidential and proprietary information.'
            },
            {
              num: '2',
              title: 'Definition of Confidential Information',
              content: '"Confidential Information" means any information disclosed by either Party to the other Party, either directly or indirectly, in writing, orally, or by inspection of tangible objects, that is designated as "Confidential," "Proprietary," or some similar designation, or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure. Confidential Information includes, without limitation: business plans, financial information, product roadmaps, software architecture, source code, client lists, pricing structures, operational data, and proprietary processes.'
            },
            {
              num: '3',
              title: 'Obligations of Receiving Party',
              content: 'Each Party agrees to: (a) hold the other Party's Confidential Information in strict confidence; (b) not disclose such Confidential Information to any third party without the prior written consent of the disclosing Party; (c) use the Confidential Information solely for the Purpose described herein; (d) protect the Confidential Information using the same degree of care it uses to protect its own confidential information, but in no event less than reasonable care; and (e) limit access to Confidential Information to those employees, contractors, or agents who have a need to know and who are bound by confidentiality obligations no less restrictive than those contained herein.'
            },
            {
              num: '4',
              title: 'Exclusions from Confidential Information',
              content: 'The obligations of confidentiality shall not apply to information that: (a) is or becomes publicly known through no breach of this Agreement; (b) was rightfully known to the receiving Party prior to disclosure; (c) is rightfully obtained from a third party without restriction; (d) is independently developed by the receiving Party without use of the Confidential Information; or (e) is required to be disclosed by law, regulation, or court order, provided the receiving Party gives prompt written notice to the disclosing Party.'
            },
            {
              num: '5',
              title: 'Term',
              content: 'This Agreement shall remain in effect for a period of three (3) years from the Effective Date. The confidentiality obligations with respect to Confidential Information disclosed during the term of this Agreement shall survive termination of this Agreement for a period of five (5) years.'
            },
            {
              num: '6',
              title: 'Return of Confidential Information',
              content: 'Upon the written request of the disclosing Party, the receiving Party shall promptly return or destroy all Confidential Information and any copies thereof, and shall certify in writing that it has done so.'
            },
            {
              num: '7',
              title: 'No License',
              content: 'Nothing in this Agreement shall be construed as granting any license or right in or to any Confidential Information, patent, copyright, trademark, or other intellectual property right of either Party.'
            },
            {
              num: '8',
              title: 'Remedies',
              content: 'Each Party acknowledges that a breach of this Agreement may cause irreparable harm for which monetary damages would be an inadequate remedy. Each Party therefore agrees that the other Party shall be entitled to seek injunctive relief and other equitable remedies in addition to any other remedies available at law or in equity.'
            },
            {
              num: '9',
              title: 'Governing Law',
              content: 'This Agreement shall be governed by and construed in accordance with the laws of the State of Oklahoma, without regard to its conflict of law principles. Any disputes arising under this Agreement shall be resolved exclusively in the state or federal courts located in Oklahoma City, Oklahoma.'
            },
            {
              num: '10',
              title: 'Entire Agreement',
              content: 'This Agreement constitutes the entire agreement between the Parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements, understandings, and representations, whether oral or written. This Agreement may not be amended except by a written instrument signed by both Parties.'
            },
          ].map(section => (
            <div key={section.num} style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 8 }}>{section.num}. {section.title}</div>
              <p style={{ margin: 0, fontSize: 14, color: '#333', lineHeight: 1.9 }}>{section.content}</p>
            </div>
          ))}

          <div style={{ marginTop: 48, paddingTop: 32, borderTop: '2px solid #000' }}>
            <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 32 }}>IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
              <div>
                <div style={{ fontWeight: 900, marginBottom: 24, fontSize: 15 }}>BoxFlow OS LLC</div>
                <div style={{ borderBottom: '1px solid #000', marginBottom: 8, height: 40 }}></div>
                <div style={{ fontSize: 13, color: '#666' }}>Signature</div>
                <div style={{ marginTop: 20, borderBottom: '1px solid #000', marginBottom: 8, paddingTop: 8 }}>BoxFlow OS Representative</div>
                <div style={{ fontSize: 13, color: '#666' }}>Printed Name & Title</div>
                <div style={{ marginTop: 20, borderBottom: '1px solid #000', marginBottom: 8, paddingTop: 8 }}>{date}</div>
                <div style={{ fontSize: 13, color: '#666' }}>Date</div>
              </div>
              <div>
                <div style={{ fontWeight: 900, marginBottom: 24, fontSize: 15 }}>{companyName || '[COMPANY NAME]'}</div>
                <div style={{ borderBottom: '1px solid #000', marginBottom: 8, height: 40 }}></div>
                <div style={{ fontSize: 13, color: '#666' }}>Signature</div>
                <div style={{ marginTop: 20, borderBottom: '1px solid #000', marginBottom: 8, paddingTop: 8 }}>{contactName || '[REPRESENTATIVE NAME]'}</div>
                <div style={{ fontSize: 13, color: '#666' }}>Printed Name & Title</div>
                <div style={{ marginTop: 20, borderBottom: '1px solid #000', marginBottom: 8, paddingTop: 8 }}>{date}</div>
                <div style={{ fontSize: 13, color: '#666' }}>Date</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 40, fontSize: 12, color: '#999', borderTop: '1px solid #eee', paddingTop: 20 }}>
            BoxFlow OS LLC • Oklahoma City, Oklahoma • legal@boxflowos.com
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32, color: '#334155', fontSize: 13 }}>
          <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 16 }}>⚠️ This NDA template is provided for informational purposes. We recommend having a licensed attorney review before signing.</p>
          <a href="/contact" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 700 }}>Need help? Contact our team →</a>
        </div>
      </div>
    </div>
  )
}