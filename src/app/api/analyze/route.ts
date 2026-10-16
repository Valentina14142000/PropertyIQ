import { NextResponse } from 'next/server';
import { z } from 'zod';
import { geminiJson } from '@/lib/gemini';
import { clientIp, rateLimited } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 60;

const Input = z.object({
  address: z.string().min(3).max(200),
  price: z.number().positive().max(1e10),
  type: z.string().min(2).max(80),
  bedrooms: z.number().min(0).max(100),
  bathrooms: z.number().min(0).max(100),
  sqft: z.number().positive().max(1e7),
  yearBuilt: z.number().int().min(1600).max(2100),
  description: z.string().max(2000).default(''),
  neighborhood: z.string().max(500).default(''),
  estimatedRent: z.number().min(0).max(1e7),
  growthRate: z.number().min(-50).max(100),
  metrics: z.object({
    grossYield: z.number(),
    capRate: z.number(),
    monthlyCashflow: z.number(),
    cashOnCash: z.number(),
  }),
});

const Output = z.object({
  overallSummary: z.string(),
  score: z.number().min(0).max(100),
  opportunities: z.array(z.string()).min(1).max(8),
  risks: z.array(z.string()).min(1).max(8),
  keyInvestmentInsights: z.array(z.string()).max(8).default([]),
  recommendation: z.string(),
});

export async function POST(req: Request) {
  if (rateLimited(clientIp(req))) return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 });
  let parsed;
  try {
    parsed = Input.safeParse(await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
  if (!parsed.success) return NextResponse.json({ error: 'Invalid property data.' }, { status: 400 });
  const p = parsed.data;

  const prompt = `You are a careful real estate investment analyst. Analyse the property below for a buy-and-hold rental investor.
Use only the facts given. Do not invent comparable sales or statistics; when you lack data say what should be verified.

Property
- Address: ${p.address}
- Type: ${p.type}
- Asking price: $${p.price}
- Bedrooms / bathrooms: ${p.bedrooms} / ${p.bathrooms}
- Size: ${p.sqft} sqft, built ${p.yearBuilt}
- Listing description: ${p.description || 'n/a'}
- Neighbourhood: ${p.neighborhood || 'n/a'}
- Estimated monthly rent: $${p.estimatedRent}
- Assumed annual appreciation: ${p.growthRate}%

Computed metrics (assume 20% down, 6.5% rate, 30 years, 5% vacancy, 1.2% tax, 0.5% insurance, 1% maintenance)
- Gross yield: ${p.metrics.grossYield.toFixed(2)}%
- Cap rate: ${p.metrics.capRate.toFixed(2)}%
- Monthly cash flow: $${Math.round(p.metrics.monthlyCashflow)}
- Cash-on-cash return: ${p.metrics.cashOnCash.toFixed(2)}%

Return JSON exactly in this shape:
{"overallSummary": string (2-3 sentences), "score": integer 0-100 investment attractiveness, "opportunities": string[3-5], "risks": string[3-5], "keyInvestmentInsights": string[2-4] referencing the metrics, "recommendation": string (one short sentence starting with a clear verdict)}`;

  try {
    const out = Output.safeParse(await geminiJson(prompt));
    if (!out.success) return NextResponse.json({ error: 'The AI returned an unexpected answer. Please try again.' }, { status: 502 });
    return NextResponse.json(out.data);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Analysis failed.' }, { status: 502 });
  }
}
