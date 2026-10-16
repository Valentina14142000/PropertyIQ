import { NextResponse } from 'next/server';
import { z } from 'zod';
import { geminiJson } from '@/lib/gemini';
import { clientIp, rateLimited } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 60;

const Input = z.object({
  region: z.string().min(2).max(100),
  propertyType: z.string().min(2).max(60),
  timeframe: z.string().min(2).max(60),
});

const Output = z.object({
  headline: z.string(),
  executiveSummary: z.string(),
  trends: z.array(z.object({ title: z.string(), detail: z.string() })).min(1).max(6),
  shifts: z.array(z.object({ title: z.string(), detail: z.string() })).max(5).default([]),
  forecast: z.string(),
  opportunities: z.array(z.string()).max(6).default([]),
  risks: z.array(z.string()).max(6).default([]),
});

export async function POST(req: Request) {
  if (rateLimited(clientIp(req))) return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 });
  let parsed;
  try {
    parsed = Input.safeParse(await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
  if (!parsed.success) return NextResponse.json({ error: 'Invalid report settings.' }, { status: 400 });
  const { region, propertyType, timeframe } = parsed.data;

  const prompt = `You are a real estate market analyst writing for investors. Write a market outlook for:
- Region: ${region}
- Property type: ${propertyType}
- Forecast period: ${timeframe}

Be concrete about drivers (interest rates, inventory, rents, migration, policy, construction), but do not quote precise statistics you cannot be sure of; use ranges or directional language and say that figures should be verified against current local data.

Return JSON exactly in this shape:
{"headline": string, "executiveSummary": string (3-4 sentences), "trends": [{"title": string, "detail": string}] (4-5 items), "shifts": [{"title": string, "detail": string}] (2-3 items), "forecast": string (one paragraph for the forecast period), "opportunities": string[3-4], "risks": string[3-4]}`;

  try {
    const out = Output.safeParse(await geminiJson(prompt));
    if (!out.success) return NextResponse.json({ error: 'The AI returned an unexpected answer. Please try again.' }, { status: 502 });
    return NextResponse.json({ ...out.data, region, propertyType, timeframe, generatedAt: new Date().toISOString() });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Report failed.' }, { status: 502 });
  }
}
