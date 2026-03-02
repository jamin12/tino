import Dexie, { type Table } from "dexie";
import type { TinoDocument } from "@entities/document";

class TinoDB extends Dexie {
  documents!: Table<TinoDocument>;

  constructor() {
    super("TinoDB");
    this.version(1).stores({
      documents: "id, title, metadata.createdAt, metadata.updatedAt, *metadata.tags",
    });
  }
}

export const db = new TinoDB();
