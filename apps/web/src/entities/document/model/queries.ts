import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDocuments, getDocument, buildScreenLinkMap } from "../api";
import type { ScreenLinkMap } from "../types";

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

/** 문서의 전체 화면 연결 맵을 반환 */
export function useScreenLinks(slug: string): ScreenLinkMap | undefined {
  const { data } = useDocument(slug);
  return useMemo(
    () => (data?.slides ? buildScreenLinkMap(data.slides) : undefined),
    [data?.slides],
  );
}
