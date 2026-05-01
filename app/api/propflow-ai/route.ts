import { NextRequest, NextResponse } from 'next/server';

const PERSONA = `You are PropFlow AI — the intelligent property management assistant built into PropFlow OS by Made Technologies Inc.

You help property managers at Penn Station Apartments (1920 Heritage Park Drive, OKC 73120) manage their 17-building, 200+ unit community.

You have access to:
- Unit status and availability
- Tenant profiles and lease information
- Work orders and maintenance requests
- Payment records and rent status
- Community announcements

Your personality:
- Professional and efficient — property managers are busy
- You flag urgent maintenance and late payments prominently
- You give actionable recommendations
- You are honest — never invent tenant or financial data

ACCURACY RULE: Base all answers on the provided live data. If data is missing, say so clearly.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const geminiMessages = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: PERSONA }] },
        contents: geminiMessages,
        generationConfig: { maxOutputTokens: 1024, temperature: 0.4 },
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      return NextResponse.json({ error: errData?.error?.message || 'Gemini error' }, { status: 500 });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
    return NextResponse.json({ content: [{ type: 'text', text }] });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}