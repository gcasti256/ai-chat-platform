"use client";

import { MODELS } from "@/lib/models";

interface PromptPanelProps {
  model: string;
  systemPrompt: string;
  onModelChange: (model: string) => void;
  onSystemPromptChange: (prompt: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function PromptPanel({
  model,
  systemPrompt,
  onModelChange,
  onSystemPromptChange,
  isOpen,
  onToggle,
}: PromptPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="w-80 border-l border-border bg-surface flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border-subtle">
        <h3 className="text-sm font-semibold text-text">Settings</h3>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-hover text-text-muted hover:text-text transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Model Selector */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
            Model
          </label>
          <div className="space-y-1">
            {MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => onModelChange(m.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  model === m.id
                    ? "bg-accent/10 text-accent border border-accent/30"
                    : "text-text-secondary hover:bg-hover border border-transparent"
                }`}
              >
                <div className="font-medium">{m.name}</div>
                <div className="text-xs text-text-muted mt-0.5">{m.provider}</div>
              </button>
            ))}
          </div>
        </div>

        {/* System Prompt */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
            System Prompt
          </label>
          <textarea
            value={systemPrompt}
            onChange={(e) => onSystemPromptChange(e.target.value)}
            rows={8}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg text-text text-sm placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none"
            placeholder="You are a helpful assistant..."
          />
          <p className="text-xs text-text-muted mt-2">
            The system prompt sets the AI's behavior and personality for this conversation.
          </p>
        </div>

        {/* Presets */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
            Quick Presets
          </label>
          <div className="space-y-1">
            {[
              { label: "General Assistant", prompt: "You are a helpful assistant." },
              { label: "Code Expert", prompt: "You are an expert software engineer. Write clean, well-documented code. Explain your reasoning." },
              { label: "Creative Writer", prompt: "You are a creative writing assistant. Help with storytelling, editing, and generating engaging content." },
              { label: "Data Analyst", prompt: "You are a data analysis expert. Help interpret data, suggest visualizations, and write queries." },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => onSystemPromptChange(preset.prompt)}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-hover hover:text-text transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
