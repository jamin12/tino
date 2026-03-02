import { useCreateDocument } from "@entities/document";
import type { TinoDocument } from "@entities/document";
import { useNavigate } from "react-router";

export function useCreateNewDocument() {
  const createDocument = useCreateDocument();
  const navigate = useNavigate();

  const createEmpty = async (title: string) => {
    const id = crypto.randomUUID();
    const now = Date.now();

    const doc: TinoDocument = {
      id,
      title,
      slides: [
        {
          id: crypto.randomUUID(),
          title: "Untitled Slide",
          layout: "default",
          elements: [
            {
              id: crypto.randomUUID(),
              type: "heading" as const,
              level: 1,
              content: title,
            },
          ],
        },
      ],
      metadata: {
        createdAt: now,
        updatedAt: now,
        version: 1,
        tags: [],
      },
    };

    await createDocument.mutateAsync(doc);
    navigate(`/document/${id}`);
    return id;
  };

  return { createEmpty, isLoading: createDocument.isPending };
}
