import { NextRequest } from "next/server";
import {
  listConversations,
  getConversation,
  getMessages,
  deleteConversation,
  updateConversationTitle,
} from "@/lib/db";

export async function GET() {
  const conversations = listConversations();
  return Response.json(conversations);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  deleteConversation(id);
  return Response.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const { id, title } = await req.json();
  if (!id || !title) return Response.json({ error: "id and title required" }, { status: 400 });
  updateConversationTitle(id, title);
  return Response.json({ ok: true });
}
