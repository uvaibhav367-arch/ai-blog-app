import { config } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

const SYSTEM_PROMPT = `You are a senior technical blog writer.
Write a well-structured article draft in Markdown using ## headings, short paragraphs and occasional bullet lists.
Do not invent statistics or cite sources. Do not add a title - the writer supplies their own.`;

async function generateWithOpenAI(prompt) {
  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.openaiApiKey}`,
    },
    body: JSON.stringify({
      model: config.openaiModel,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 700,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${detail}`);
  }

  const payload = await response.json();
  const draft = payload?.choices?.[0]?.message?.content;
  if (!draft) throw new Error('OpenAI returned an empty draft');
  return draft.trim();
}

function generateLocally(prompt) {
  const topic = prompt.trim().replace(/\s+/g, ' ').replace(/[.!?]+$/, '');
  const subject = topic.charAt(0).toUpperCase() + topic.slice(1);
  const keywords = topic
    .split(' ')
    .filter((word) => word.length > 4)
    .slice(0, 4);

  return [
    `## What is ${subject}`,
    `${subject} is one of the topics that comes up repeatedly when people talk about building software that has to hold up over time. The interesting part is not the theory but the set of trade-offs you accept along the way.`,
    '',
    `## Why it matters`,
    `Understanding ${subject} changes how you structure a project. Once the underlying model is clear, the rest of the code tends to fall into place on its own, and the decisions you make later become easier to justify.`,
    '',
    '## Key points',
    ...keywords.map(
      (word) =>
        `- **${word.charAt(0).toUpperCase() + word.slice(1)}** - worth understanding before you build on top of it.`,
    ),
    '',
    `## How to apply it`,
    `Start with the simplest version that works. Measure before you optimise, keep the interface small, and change one thing at a time so you always know what moved the needle.`,
    '',
    `## Wrap up`,
    `Treat ${subject} as a tool rather than a rule. The goal is a working system that a team can reason about, and that means being deliberate about the parts you choose to keep simple.`,
  ].join('\n');
}

export async function generateDraft(prompt) {
  const cleaned = String(prompt || '').trim();

  if (!cleaned) {
    throw ApiError.badRequest('A prompt is required');
  }

  if (config.openaiApiKey) {
    try {
      const draft = await generateWithOpenAI(cleaned);
      return { draft, source: 'openai', model: config.openaiModel };
    } catch (error) {
      console.error(`[ai] OpenAI call failed, using the local generator: ${error.message}`);
      return { draft: generateLocally(cleaned), source: 'local-fallback', model: null };
    }
  }

  return { draft: generateLocally(cleaned), source: 'local-fallback', model: null };
}
