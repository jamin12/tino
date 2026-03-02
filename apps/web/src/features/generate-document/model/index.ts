import { useState } from "react";
import { useNavigate } from "react-router";
import { generateDocument } from "@entities/ai";
import { useCreateDocument } from "@entities/document";
import type { TinoDocument } from "@entities/document";

export function useGenerateDocument() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createDocument = useCreateDocument();
  const navigate = useNavigate();

  const generate = async (prompt: string) => {
    setIsGenerating(true);
    setError(null);

    try {
      const doc: TinoDocument = await generateDocument(prompt);
      await createDocument.mutateAsync(doc);
      navigate(`/document/${doc.id}`);
      return doc.id;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate document";
      setError(message);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generate, isGenerating, error };
}
