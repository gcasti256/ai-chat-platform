"use client";

import dynamic from "next/dynamic";

const ChatView = dynamic(() => import("./ChatView"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-bg text-text-muted">
      Loading...
    </div>
  ),
});

export default function ClientChat() {
  return <ChatView />;
}
