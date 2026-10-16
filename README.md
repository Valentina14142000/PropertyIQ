# PropertyIQ

**AI-assisted real estate investment analysis.** Track properties, see real return metrics, simulate mortgages, and get AI-written investment assessments and market outlooks.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Disclaimer:** AI output and calculators are for research and education only. They are not financial, tax or legal advice. Verify every figure before investing.

## What it does

| Feature | How it works |
| --- | --- |
| **Property tracker** | Add your own properties (price, rent, size, growth). Search, filter by type, and sort by price, yield or growth. Data is saved in your browser. |
| **Live dashboard** | Portfolio value, average gross yield, estimated monthly cash flow, a 5-year value projection, yield by property type and a ranked list of best opportunities, all computed from your properties. |
| **Return metrics** | Gross yield, cap rate, monthly cash flow and cash-on-cash return per property, using transparent assumptions shown in the app. |
| **AI investment analysis** | Gemini reviews a property and its metrics and returns a score, opportunities, risks, insights and a recommendation. |
| **AI market reports** | Pick a region, property type and horizon to get a structured market outlook you can copy. |
| **Calculators** | ROI (cash-on-cash after mortgage) and mortgage simulator with property tax, insurance and total interest. Open any property in the calculators with its numbers pre-filled. |

## Architecture

- **Next.js 15 (App Router)**, React 19, TypeScript, Tailwind CSS, shadcn/ui, Recharts.
- **Server routes** `/api/analyze` and `/api/market-report` validate input with Zod, rate-limit per IP, and call the Gemini REST API with retries, model fallback and automatic model discovery. The API key never reaches the browser.
- **No database or login required.** Properties live in `localStorage`; the app works for anyone immediately.

## Run locally

```bash
git clone https://github.com/Valentina14142000/PropertyIQ.git
cd PropertyIQ
npm install
cp .env.example .env.local
```

Edit `.env.local` and set `GEMINI_API_KEY` (free key: https://aistudio.google.com/app/apikey), then:

```bash
npm run dev
```

Open http://localhost:9002.

## Deploy to Vercel

1. Import the repository at https://vercel.com/new (framework preset: Next.js).
2. Add the environment variable `GEMINI_API_KEY`.
3. Deploy. If the site asks for a Vercel login, turn off **Deployment Protection** in Project Settings.

## Calculation assumptions

Used for per-property metrics (editable in `src/lib/metrics.ts`): 20% down, 6.5% interest, 30-year term, 5% vacancy, 1.2% property tax, 0.5% insurance, 1% maintenance (all as shown in the app).

## License

MIT
