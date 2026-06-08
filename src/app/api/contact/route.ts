import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EMAIL } from "@/lib/data";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Email service not configured." }, { status: 500 });
  }

  // Rate limit: max 3 submissions per IP per minute.
  const rl = rateLimit(`contact:${clientIp(req)}`, 3, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();
  const subject = String(data.subject ?? "").trim();
  const message = String(data.message ?? "").trim();
  const honeypot = String(data.company ?? "").trim(); // bots fill hidden field

  // Silently accept bots (don't send) so they don't retry.
  if (honeypot) return NextResponse.json({ ok: true });

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }
  if (message.length > 5000 || name.length > 200 || subject.length > 300) {
    return NextResponse.json({ error: "Input too long." }, { status: 400 });
  }

  const resend = new Resend(apiKey);
  try {
    const { error } = await resend.emails.send({
      // Use onboarding@resend.dev until you verify ossamaelhakki.com in Resend,
      // then switch to e.g. "Portfolio <contact@ossamaelhakki.com>".
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: EMAIL,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: `
        <h2>New message from your portfolio</h2>
        <p><strong>Name:</strong> ${esc(name)}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Subject:</strong> ${esc(subject)}</p>
        <hr />
        <p style="white-space:pre-wrap">${esc(message)}</p>
      `,
    });
    if (error) {
      return NextResponse.json({ error: "Failed to send. Try again later." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to send. Try again later." }, { status: 502 });
  }
}
