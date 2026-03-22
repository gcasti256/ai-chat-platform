"use client";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  model?: string | null;
  isStreaming?: boolean;
}

export default function ChatMessage({ role, content, model, isStreaming }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0 mt-1">
          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 14.5M14.25 3.104c.251.023.501.05.75.082M19.8 14.5l-2.147 2.146a.75.75 0 01-.53.22H6.877a.75.75 0 01-.53-.22L4.2 14.5" />
          </svg>
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? "order-first" : ""}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-user-bubble text-white rounded-br-md"
              : "bg-ai-bubble border border-border-subtle text-text rounded-bl-md"
          }`}
        >
          {content ? (
            <div className="whitespace-pre-wrap break-words">{content}</div>
          ) : isStreaming ? (
            <div className="flex gap-1 py-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-text-muted"
                  style={{
                    animation: `pulse-dot 1.4s infinite ease-in-out`,
                    animationDelay: `${i * 0.16}s`,
                  }}
                />
              ))}
            </div>
          ) : null}
        </div>
        {!isUser && model && !isStreaming && (
          <div className="text-xs text-text-muted mt-1 ml-1">{model}</div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0 mt-1">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
          </svg>
        </div>
      )}
    </div>
  );
}
