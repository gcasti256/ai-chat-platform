export type ModelProvider = "openai" | "anthropic";

export interface ModelConfig {
  id: string;
  name: string;
  provider: ModelProvider;
  apiModel: string;
}

export const MODELS: ModelConfig[] = [
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "openai", apiModel: "gpt-4o-mini" },
  { id: "gpt-4o", name: "GPT-4o", provider: "openai", apiModel: "gpt-4o" },
  { id: "claude-sonnet", name: "Claude Sonnet", provider: "anthropic", apiModel: "claude-sonnet-4-20250514" },
  { id: "claude-haiku", name: "Claude Haiku", provider: "anthropic", apiModel: "claude-haiku-4-5-20251001" },
];

export function getModel(id: string): ModelConfig | undefined {
  return MODELS.find((m) => m.id === id);
}

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/** Stream a chat completion, yielding text chunks. */
export async function* streamChat(
  modelId: string,
  messages: ChatMessage[],
  systemPrompt: string
): AsyncGenerator<string> {
  const model = getModel(modelId);
  if (!model) throw new Error(`Unknown model: ${modelId}`);

  if (model.provider === "openai") {
    yield* streamOpenAI(model, messages, systemPrompt);
  } else if (model.provider === "anthropic") {
    yield* streamAnthropic(model, messages, systemPrompt);
  }
}

async function* streamOpenAI(
  model: ModelConfig,
  messages: ChatMessage[],
  systemPrompt: string
): AsyncGenerator<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model.apiModel,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${err}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;
      const data = trimmed.slice(6);
      if (data === "[DONE]") return;

      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) yield content;
      } catch {
        // skip malformed JSON
      }
    }
  }
}

async function* streamAnthropic(
  model: ModelConfig,
  messages: ChatMessage[],
  systemPrompt: string
): AsyncGenerator<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: model.apiModel,
      max_tokens: 4096,
      stream: true,
      system: systemPrompt,
      messages: messages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API error: ${response.status} ${err}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;

      try {
        const parsed = JSON.parse(trimmed.slice(6));
        if (parsed.type === "content_block_delta" && parsed.delta?.text) {
          yield parsed.delta.text;
        }
      } catch {
        // skip
      }
    }
  }
}
