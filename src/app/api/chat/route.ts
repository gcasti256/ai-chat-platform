import { NextRequest } from "next/server";
import { streamChat } from "@/lib/ai";
import { addMessage, getMessages, getConversation, createConversation } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    message,
    conversationId,
    model = "gpt-4o-mini",
    systemPrompt = "You are a helpful assistant.",
  } = body as {
    message: string;
    conversationId?: string;
    model?: string;
    systemPrompt?: string;
  };

  if (!message?.trim()) {
    return Response.json({ error: "Message is required" }, { status: 400 });
  }

  // Get or create conversation
  let convId = conversationId;
  if (!convId || !getConversation(convId)) {
    convId = crypto.randomUUID();
    const title = message.slice(0, 60) + (message.length > 60 ? "..." : "");
    createConversation(convId, title, model, systemPrompt);
  }

  // Save user message
  addMessage(crypto.randomUUID(), convId, "user", message);

  // Build message history for API
  const history = getMessages(convId).map((m) => ({
    role: m.role as "user" | "assistant" | "system",
    content: m.content,
  }));

  // Stream response via SSE
  const encoder = new TextEncoder();
  let fullResponse = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Send conversation ID first
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "meta", conversationId: convId })}\n\n`)
        );

        for await (const chunk of streamChat(model, history, systemPrompt)) {
          fullResponse += chunk;
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "chunk", content: chunk })}\n\n`)
          );
        }

        // Save assistant message
        const msgId = crypto.randomUUID();
        addMessage(msgId, convId!, "assistant", fullResponse, model);

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "done", messageId: msgId })}\n\n`
          )
        );
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "error", error: errorMsg })}\n\n`
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
