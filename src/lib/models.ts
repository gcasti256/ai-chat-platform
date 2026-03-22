export interface ModelConfig {
  id: string;
  name: string;
  provider: "openai" | "anthropic";
  apiModel: string;
}

export const MODELS: ModelConfig[] = [
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "openai", apiModel: "gpt-4o-mini" },
  { id: "gpt-4o", name: "GPT-4o", provider: "openai", apiModel: "gpt-4o" },
  { id: "claude-sonnet", name: "Claude Sonnet", provider: "anthropic", apiModel: "claude-sonnet-4-20250514" },
  { id: "claude-haiku", name: "Claude Haiku", provider: "anthropic", apiModel: "claude-haiku-4-5-20251001" },
];
