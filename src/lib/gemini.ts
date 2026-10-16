// Minimal Gemini REST client with retries, model fallback and model discovery.
// The API key is read on the server only.

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const BASE = 'https://generativelanguage.googleapis.com/v1beta';

type GenResponse = { candidates?: { content?: { parts?: { text?: string }[] } }[] };

async function discoverModels(key: string): Promise<string[]> {
  try {
    const res = await fetch(`${BASE}/models?pageSize=100`, {
      headers: { 'x-goog-api-key': key },
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return [];
    const j = (await res.json()) as { models?: { name: string; supportedGenerationMethods?: string[] }[] };
    return (j.models ?? [])
      .filter((m) => m.supportedGenerationMethods?.includes('generateContent') && /flash/i.test(m.name) && !/(image|tts|live|thinking|lite|preview|exp)/i.test(m.name))
      .map((m) => m.name.replace(/^models\//, ''))
      .sort()
      .reverse();
  } catch {
    return [];
  }
}

async function tryModel(model: string, key: string, body: string, deadline: number): Promise<{ data: unknown } | { skip: true } | { fatal: string }> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const left = deadline - Date.now();
    if (left < 2_000) return { skip: true };
    let res: Response;
    try {
      res = await fetch(`${BASE}/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
        body,
        signal: AbortSignal.timeout(Math.min(25_000, left)),
      });
    } catch {
      await sleep(500);
      continue;
    }
    if (res.ok) {
      const j = (await res.json()) as GenResponse;
      const text = j.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
      try {
        return { data: JSON.parse(text.replace(/^\s*```(?:json)?\s*|\s*```\s*$/g, '').trim()) };
      } catch {
        await sleep(300);
        continue;
      }
    }
    const detail = (await res.text().catch(() => '')).slice(0, 200);
    if (res.status === 404) return { skip: true };
    if (res.status === 400 && /not found|not supported|unsupported/i.test(detail)) return { skip: true };
    if (res.status === 401 || res.status === 403 || /api key/i.test(detail)) return { fatal: 'The AI provider rejected the API key. Check GEMINI_API_KEY in your environment settings.' };
    if (res.status === 429) return { fatal: 'The AI service is busy (rate limit). Try again in a minute.' };
    await sleep(700 * (attempt + 1));
  }
  return { skip: true };
}

export async function geminiJson(prompt: string): Promise<unknown> {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) throw new Error('AI is not configured: the server is missing GEMINI_API_KEY.');
  const body = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json', temperature: 0.35 },
  });
  const deadline = Date.now() + 50_000;
  const tried = new Set<string>();
  const queue = [process.env.GEMINI_MODEL, 'gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.0-flash'].filter((m): m is string => !!m);
  let discovered = false;
  while (queue.length) {
    const model = queue.shift()!;
    if (tried.has(model)) continue;
    tried.add(model);
    const r = await tryModel(model, key, body, deadline);
    if ('data' in r) return r.data;
    if ('fatal' in r) throw new Error(r.fatal);
    if (!queue.length && !discovered) {
      discovered = true;
      queue.push(...(await discoverModels(key)).slice(0, 4));
    }
  }
  throw new Error('The AI service is unavailable right now. Try again in a moment.');
}
