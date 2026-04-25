import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const geminiMessages = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: "You are MedFlow AI, an intelligent pharmacy operations assistant. Analyze the provided data and give clear actionable recommendations. Prioritize patient safety." }]
        },
        contents: geminiMessages,
        generationConfig: { maxOutputTokens: 1024 },
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      return NextResponse.json({ error: errData?.error?.message || "Gemini error" }, { status: 500 });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    return NextResponse.json({ content: [{ type: "text", text }] });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

