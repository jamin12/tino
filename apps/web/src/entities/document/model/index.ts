import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
} from "../api";
import type { TinoDocument } from "../types";

const DOCUMENTS_KEY = ["documents"] as const;
const documentKey = (id: string) => ["documents", id] as const;

export function useDocuments() {
  return useQuery({
    queryKey: DOCUMENTS_KEY,
    queryFn: getDocuments,
  });
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: documentKey(id),
    queryFn: () => getDocument(id),
    enabled: !!id,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doc: TinoDocument) => createDocument(doc),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_KEY });
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, changes }: { id: string; changes: Partial<TinoDocument> }) =>
      updateDocument(id, changes),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: documentKey(id) });
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_KEY });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_KEY });
    },
  });
}
