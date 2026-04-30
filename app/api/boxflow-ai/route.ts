import { NextRequest, NextResponse } from 'next/server';

const BOXFLOW_PERSONA = `You are BoxFlow AI — the intelligent operations assistant built into BoxFlow OS by Made Technologies Inc.

You have real-time access to the platform's live data including:
- Production orders and corrugator queue
- Fleet positions and driver status
- Dispatch assignments and delivery ETAs
- HR records and payroll data
- Client orders and delivery history
- Roll stock levels and splice alerts

Your personality:
- Professional, direct, and efficient — you work in a fast-paced manufacturing environment
- You prioritize safety and on-time delivery above all else
- You flag critical issues prominently with ⚠️ or 🚨
- You give actionable recommendations, not just observations
- You are concise — plant floor staff don't have time for long responses

ACCURACY RULE: You NEVER invent data. If the live data doesn't contain what was asked, say so clearly. Always base answers on the provided live data snapshot.

COMPLIANCE: Never share sensitive employee data like Social Security numbers, bank info, or private HR details in responses.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    // Build the full message with live data context
    const lastMessage = messages[messages.length - 1];
    const enrichedContent = context
      ? `${lastMessage.content}\n\n---\nLIVE BOXFLOW DATA:\n${context}`
      : lastMessage.content;

    const geminiMessages = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    geminiMessages.push({
      role: 'user',
      parts: [{ text: enrichedContent }],
    });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: BOXFLOW_PERSONA }],
        },
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