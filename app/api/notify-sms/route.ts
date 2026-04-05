import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, to } = body;

    if (!message || !to) {
      return NextResponse.json(
        { error: "Missing message or phone number." },
        { status: 400 }
      );
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID!;
    const authToken = process.env.TWILIO_AUTH_TOKEN!;
    const from = process.env.TWILIO_PHONE_NUMBER!;

    const client = twilio(accountSid, authToken);

    const result = await client.messages.create({
      body: message,
      from,
      to,
    });

    return NextResponse.json({ success: true, sid: result.sid });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "SMS send failed." },
      { status: 500 }
    );
  }
}