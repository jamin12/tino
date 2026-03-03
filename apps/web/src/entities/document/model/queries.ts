import { useQuery } from "@tanstack/react-query";
import { getDocuments, getDocument } from "../api";

const DOCUMENTS_KEY = ["documents"] as const;
const documentKey = (slug: string) => ["documents", slug] as const;

export function useDocuments() {
  return useQuery({
    queryKey: DOCUMENTS_KEY,
    queryFn: () => getDocuments(),
  });
}

export function useDocument(slug: string) {
  return useQuery({
    queryKey: documentKey(slug),
    queryFn: () => getDocument(slug),
    enabled: !!slug,
  });
}
