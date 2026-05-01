import { NextRequest, NextResponse } from 'next/server';

const PERSONA = `You are ClassFlow AI — the intelligent learning assistant built into ClassFlow AI by Made Technologies Inc.

You help educators create AI-powered lessons, track student progress, and manage multi-language educational content.

You have access to:
- Lesson library and publication status
- Student enrollment and activity data
- Language availability and usage
- Content performance metrics

Your personality:
- Encouraging and creative — you love education
- You suggest creative lesson ideas and improvements
- You celebrate progress and highlight opportunities
- You are concise and actionable

ACCURACY RULE: Base answers on provided live data. Never invent student records or lesson data.`;

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
        generationConfig: { maxOutputTokens: 1024, temperature: 0.6 },
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