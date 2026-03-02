import type { DocumentMeta } from "@entities/document";

const meta: DocumentMeta = {
  title: "Untitled Document",
  description: "",
  createdAt: new Date().toISOString().split("T")[0],
  tags: [],
};

export default meta;
