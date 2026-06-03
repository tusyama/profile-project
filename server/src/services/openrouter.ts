import type { Env } from '../config/env.js';
import { AiOutputRejectedError, OpenRouterError } from '../errors.js';
import { assertSafeOutput } from '../lib/safeOutput.js';
import { AI_SYSTEM_PROMPT, buildUserPrompt } from '../security/aiPrompt.js';

export async function improveComment(env: Env, draft: string): Promise<string> {
  const siteUrl = env.SITE_URL ?? env.CLIENT_URL;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': siteUrl,
      'X-Title': 'Developer Landing',
    },
    body: JSON.stringify({
      model: env.OPENROUTER_MODEL,
      temperature: 0.3,
      max_tokens: 600,
      messages: [
        { role: 'system', content: AI_SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(draft) },
      ],
    }),
  });

  if (!response.ok) {
    throw new OpenRouterError(`OpenRouter error: ${response.status}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new OpenRouterError('Empty AI response');
  }

  const guard = assertSafeOutput(content, draft.length);
  if (!guard.ok) {
    throw new AiOutputRejectedError(guard.reason);
  }

  return guard.text;
}
