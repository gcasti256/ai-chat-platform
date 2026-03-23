# AI Chat Platform

![Build](https://github.com/gcasti256/ai-chat-platform/actions/workflows/ci.yml/badge.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A real-time AI chat application with streaming responses, multi-model support, conversation persistence, and a prompt engineering sandbox. Switch between OpenAI and Anthropic models on the fly, customize system prompts with quick presets, and watch responses stream in token by token -- all backed by a local SQLite database for zero-config persistence.

## Demo

<!-- Add screenshot here -->
<!-- ![AI Chat Platform](docs/screenshot.png) -->
_Screenshot: paste a browser capture of the chat interface into `docs/screenshot.png` and uncomment the line above._

## Features

- **Streaming Responses** — Real-time token-by-token output via Server-Sent Events
- **Multi-Model Support** — Switch between OpenAI (GPT-4o, GPT-4o Mini) and Anthropic (Claude Sonnet, Haiku)
- **Conversation Persistence** — SQLite-backed message storage with full conversation history
- **Prompt Engineering Panel** — Customize system prompts, switch models, and use quick presets
- **Responsive UI** — Collapsible sidebar, mobile-friendly design, dark theme

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
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
git clone https://github.com/gcasti256/ai-chat-platform.git
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
│   ├── ClientChat.tsx              # Client-side chat wrapper
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

MIT -- George Castillo
