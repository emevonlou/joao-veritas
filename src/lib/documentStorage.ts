import { SavedDocument } from "@/types/document";

const STORAGE_KEY = "joao-veritas-documents";

export function getDocuments(): SavedDocument[] {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveDocument(document: SavedDocument) {
  const documents = getDocuments();

  const filtered = documents.filter(
    (doc) => doc.id !== document.id
  );

  filtered.unshift(document);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(filtered)
  );
}
export function deleteDocument(id: string) {
  const documents = getDocuments();

  const updatedDocuments = documents.filter(
    (document) => document.id !== id
  );

  localStorage.setItem(
    "joao-veritas-documents",
    JSON.stringify(updatedDocuments)
  );
}
