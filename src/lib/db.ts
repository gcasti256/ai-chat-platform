import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "chat.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    migrate(db);
  }
  return db;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT 'New Chat',
      model TEXT NOT NULL DEFAULT 'gpt-4o-mini',
      system_prompt TEXT NOT NULL DEFAULT 'You are a helpful assistant.',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
      content TEXT NOT NULL,
      model TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at);
  `);
}

// --- Conversation CRUD ---

export interface Conversation {
  id: string;
  title: string;
  model: string;
  system_prompt: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  model: string | null;
  created_at: string;
}

export function listConversations(): Conversation[] {
  return getDb()
    .prepare("SELECT * FROM conversations ORDER BY updated_at DESC")
    .all() as Conversation[];
}

export function getConversation(id: string): Conversation | undefined {
  return getDb()
    .prepare("SELECT * FROM conversations WHERE id = ?")
    .get(id) as Conversation | undefined;
}

export function createConversation(
  id: string,
  title: string,
  model: string,
  systemPrompt: string
): Conversation {
  getDb()
    .prepare(
      "INSERT INTO conversations (id, title, model, system_prompt) VALUES (?, ?, ?, ?)"
    )
    .run(id, title, model, systemPrompt);
  return getConversation(id)!;
}

export function updateConversationTitle(id: string, title: string) {
  getDb()
    .prepare("UPDATE conversations SET title = ?, updated_at = datetime('now') WHERE id = ?")
    .run(title, id);
}

export function deleteConversation(id: string) {
  getDb().prepare("DELETE FROM conversations WHERE id = ?").run(id);
}

// --- Message CRUD ---

export function getMessages(conversationId: string): Message[] {
  return getDb()
    .prepare("SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC")
    .all(conversationId) as Message[];
}

export function addMessage(
  id: string,
  conversationId: string,
  role: string,
  content: string,
  model?: string
): Message {
  getDb()
    .prepare(
      "INSERT INTO messages (id, conversation_id, role, content, model) VALUES (?, ?, ?, ?, ?)"
    )
    .run(id, conversationId, role, content, model || null);

  // Update conversation timestamp
  getDb()
    .prepare("UPDATE conversations SET updated_at = datetime('now') WHERE id = ?")
    .run(conversationId);

  return getDb().prepare("SELECT * FROM messages WHERE id = ?").get(id) as Message;
}
