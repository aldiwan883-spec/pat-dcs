import { NextResponse } from "next/server";
import { company } from "@/data/site";

export const runtime = "nodejs";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

/** Best-effort per-instance rate limit; put a WAF / Turnstile in front for more. */
function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot filled in: pretend success, send nothing.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 60);
  const org = clean(body.company, 160);
  const message = clean(body.message, 5000);
  const locale = clean(body.locale, 5);

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_input" }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? `PAT Website <no-reply@patdcs.com>`,
      to: [process.env.CONTACT_TO ?? company.email],
      reply_to: email,
      subject: `Website inquiry from ${name}${org ? ` (${org})` : ""}`,
      text: [`Name: ${name}`, `Email: ${email}`, `Phone: ${phone || "-"}`, `Company: ${org || "-"}`, `Language: ${locale || "-"}`, "", message].join("\n"),
    }),
  });

  if (!res.ok) return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
