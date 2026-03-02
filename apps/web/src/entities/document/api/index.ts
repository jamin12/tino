import { db } from "@shared/lib/db";
import type { TinoDocument } from "../types";

export async function getDocuments(): Promise<TinoDocument[]> {
  return db.documents.orderBy("metadata.updatedAt").reverse().toArray();
}

export async function getDocument(id: string): Promise<TinoDocument | undefined> {
  return db.documents.get(id);
}

export async function createDocument(doc: TinoDocument): Promise<string> {
  return db.documents.add(doc);
}

export async function updateDocument(id: string, changes: Partial<TinoDocument>): Promise<void> {
  const existing = await db.documents.get(id);
  if (!existing) return;

  const updated: TinoDocument = {
    ...existing,
    ...changes,
    metadata: {
      ...existing.metadata,
      ...changes.metadata,
      updatedAt: Date.now(),
    },
  };

  await db.documents.put(updated);
}

export async function deleteDocument(id: string): Promise<void> {
  await db.documents.delete(id);
}
