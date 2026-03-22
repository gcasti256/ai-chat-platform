# AI Chat Platform

A real-time AI chat application with streaming responses, multi-model support, conversation persistence, and a prompt engineering sandbox.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Features

- **Streaming Responses** — Real-time token-by-token output via Server-Sent Events
- **Multi-Model Support** — Switch between OpenAI (GPT-4o, GPT-4o Mini) and Anthropic (Claude Sonnet, Haiku)
- **Conversation Persistence** — SQLite-backed message storage with full conversation history
- **Prompt Engineering Panel** — Customize system prompts, switch models, and use quick presets
- **Responsive UI** — Collapsible sidebar, mobile-friendly design, dark theme

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Database | SQLite (better-sqlite3) |
| AI | OpenAI API, Anthropic API |
| Streaming | Server-Sent Events |

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key and/or Anthropic API key

### Installation

```bash
git clone https://github.com/georgecastillo/ai-chat-platform.git
cd ai-chat-platform
npm install
cp .env.example .env.local
# Edit .env.local with your API keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # SSE streaming endpoint
│   │   └── conversations/          # CRUD for conversations
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Chat page
│   └── globals.css                 # Theme + Tailwind
├── components/
│   ├── ChatView.tsx                # Main chat orchestrator
│   ├── ChatMessage.tsx             # Message bubble component
│   ├── Sidebar.tsx                 # Conversation list
│   └── PromptPanel.tsx             # Settings/prompt panel
└── lib/
    ├── ai.ts                       # Multi-provider streaming client
    ├── db.ts                       # SQLite database layer
    └── models.ts                   # Model definitions
```

### Key Decisions

- **SSE over WebSockets**: Simpler for unidirectional streaming, works through proxies/load balancers
- **SQLite over PostgreSQL**: Zero-config local dev, portable, sufficient for demo/single-user
- **Raw fetch over SDK**: Direct API calls for full control over streaming behavior

## License

MIT
