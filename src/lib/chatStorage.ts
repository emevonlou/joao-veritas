import { ChatMessage } from "@/types/chat";

const STORAGE_PREFIX = "joao-veritas-chat:";

export function getChat(documentId: string): ChatMessage[] {
  if (typeof window === "undefined") {
    return [];
  }

  const data = localStorage.getItem(STORAGE_PREFIX + documentId);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data) as ChatMessage[];
  } catch {
    return [];
  }
}

export function saveChat(
  documentId: string,
  messages: ChatMessage[]
) {
  localStorage.setItem(
    STORAGE_PREFIX + documentId,
    JSON.stringify(messages)
  );
}

export function clearChat(documentId: string) {
  localStorage.removeItem(STORAGE_PREFIX + documentId);
}
