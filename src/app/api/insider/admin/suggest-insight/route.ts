/**
 * POST /api/insider/admin/suggest-insight — AI-powered "So What for Ironmark" suggestion
 *
 * secureRoute, require: 'admin'. Calls GPT-4o-mini with analytical CI voice system prompt.
 * Body: { body: string, category: InsiderCategory, competitors_mentioned?: string[] }
 * Response: { suggestion: string }
 */

import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { secureRoute } from '@/lib/secure-route';
import type { InsiderCategory } from '@/config/insider.config';

let _openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

const CATEGORY_CONTEXT: Record<InsiderCategory, string> = {
  competitor: 'competitor intelligence and competitive positioning',
  category: 'market category trends and dynamics',
  customer: 'customer and prospect intelligence',
  martech: 'marketing technology landscape and vendor moves',
};

export const POST = secureRoute(
  async (request) => {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const {
      body: postBody,
      category,
      competitors_mentioned,
    } = body as {
      body?: string;
      category?: InsiderCategory;
      competitors_mentioned?: string[];
    };

    if (!postBody || typeof postBody !== 'string') {
      return NextResponse.json(
        { error: 'Missing required field: body' },
        { status: 400 },
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Missing required field: category' },
        { status: 400 },
      );
    }

    const categoryContext = CATEGORY_CONTEXT[category] ?? category;
    const competitorLine =
      competitors_mentioned && competitors_mentioned.length > 0
        ? `Competitors mentioned: ${competitors_mentioned.join(', ')}.`
        : '';

    const systemPrompt = `You are a sharp B2B product strategist writing analytical competitive intelligence for Ironmark, a through-channel marketing platform targeting multi-unit franchise brands (QSR, healthcare, automotive, financial services).

Your task is to write a concise "So What for Ironmark" section — 2-4 sentences — that translates a market signal into a specific strategic implication for Ironmark's sales, product, or competitive positioning.

Tone: Direct, confident, analytical. No filler phrases. No "this shows that" constructions. Lead with the implication.
Focus area: ${categoryContext}.
${competitorLine}

Return only the "So What" text. No preamble, no headers.`;

    const userPrompt = `Here is the intelligence post body:\n\n${postBody}\n\nWrite the "So What for Ironmark" insight.`;

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 300,
      temperature: 0.4,
    });

    const suggestion = completion.choices[0]?.message?.content?.trim();

    if (!suggestion) {
      return NextResponse.json(
        { error: 'AI did not return a suggestion' },
        { status: 500 },
      );
    }

    return NextResponse.json({ suggestion });
  },
  { require: 'admin' },
);
