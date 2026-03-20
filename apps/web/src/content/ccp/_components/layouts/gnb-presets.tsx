import { Building2, FolderOpen, Braces, Server } from "lucide-react";
import type { NavSelector } from "./GlobalNav";

// ─── Preset Types ────────────────────────────────────────────────────────────

/**
 * GNB 프리셋 키 — Figma "GNB" 섹션의 각 서브섹션에 1:1 대응
 *
 * | 프리셋        | Figma 섹션   | selectors                          | actionButton     |
 * |--------------|-------------|-------------------------------------|-----------------|
 * | dashboard    | 대시보드      | 클러스터 + 네임스페이스                 | -               |
 * | namespace    | 네임스페이스   | 클러스터                              | -               |
 * | application  | 애플리케이션   | 조직 + 프로젝트 + 네임스페이스           | -               |
 * | cicd         | CI/CD        | 클러스터 + 네임스페이스                 | YAML 가져오기     |
 * | gitops       | GitOps       | 클러스터 + 네임스페이스                 | -               |
 * | tenant       | 테넌트        | 조직 + 프로젝트 + 네임스페이스           | -               |
 * | settings     | 설정         | (GNB 없음)                           | -               |
 * | connection   | 연결         | (GNB 없음)                           | -               |
 * | service-mesh | 서비스 메시   | (GNB 없음)                           | -               |
 */
export type GnbPresetKey =
  | "dashboard"
  | "namespace"
  | "application"
  | "cicd"
  | "gitops"
  | "tenant"
  | "settings"
  | "connection"
  | "service-mesh";

export interface GnbPresetConfig {
  selectors: NavSelector[];
  actionButton?: { label: string };
}

// ─── Shared Selectors ────────────────────────────────────────────────────────

const clusterSelector: NavSelector = {
  label: "클러스터",
  value: "dev-cluster",
  icon: <Server className="w-4 h-4" />,
};

const namespaceSelector: NavSelector = {
  label: "네임스페이스",
  value: "전체 네임스페이스",
  icon: <Braces className="w-4 h-4" />,
};

const orgSelector: NavSelector = {
  label: "조직",
  value: "NHN Cloud",
  icon: <Building2 className="w-4 h-4" />,
};

const projectSelector: NavSelector = {
  label: "프로젝트",
  value: "Project-Dummy-1",
  icon: <FolderOpen className="w-4 h-4" />,
};

// ─── Presets ─────────────────────────────────────────────────────────────────

export const gnbPresets: Record<GnbPresetKey, GnbPresetConfig | null> = {
  dashboard: {
    selectors: [clusterSelector, namespaceSelector],
  },
  namespace: null,
  application: {
    selectors: [orgSelector, projectSelector, namespaceSelector],
  },
  cicd: {
    selectors: [clusterSelector, namespaceSelector],
    actionButton: { label: "YAML 가져오기" },
  },
  gitops: {
    selectors: [clusterSelector, namespaceSelector],
  },
  tenant: {
    selectors: [orgSelector, projectSelector, namespaceSelector],
  },
  settings: null,
  connection: null,
  "service-mesh": null,
};
