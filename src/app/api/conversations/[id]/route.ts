import { NextRequest } from "next/server";
import { getConversation, getMessages } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const conversation = getConversation(id);
  if (!conversation) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  const messages = getMessages(id);
  return Response.json({ ...conversation, messages });
}
