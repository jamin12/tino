export interface DocumentMeta {
  title: string;
  description?: string;
  createdAt: string; // ISO date string
  tags?: string[];
}

export interface SlideAnnotation {
  id: number;
  label: string;
  description: string;
  /** @deprecated data-annotation-id 속성을 사용하면 자동 계산됨 */
  x?: number;
  /** @deprecated data-annotation-id 속성을 사용하면 자동 계산됨 */
  y?: number;
}

/** 화면 간 연결 정보 */
export interface ScreenLink {
  /** 연결 대상 화면의 screenId */
  targetScreenId: string;
  /** 연결 유형 */
  type: "navigate" | "modal" | "tab" | "action";
  /** 연결 설명 (예: "행 클릭 → 상세 이동") */
  label?: string;
}

export interface SlideMeta {
  title?: string;
  section?: string;
  /** 섹션 내 시각적 서브 그룹 라벨 (접기/펼치기 없이 구분선 + 라벨만 표시) */
  subSection?: string;
  /** Spec 패널 상단에 표시할 설명 (???...??? 파란 박스 등 서식 지원) */
  description?: string;
  annotations?: SlideAnnotation[];
  /** 화면 고유 식별자 (예: "CCP-GIT-001") */
  screenId?: string;
  /** 이 화면에서 연결되는 다른 화면 목록 */
  links?: ScreenLink[];
}

export interface SlideWithMeta {
  component: React.ComponentType;
  meta: SlideMeta;
  /** 슬라이드 파일의 폴더 경로 (slug 이후 상대 경로, 예: "namespace/workspace/") */
  folder: string;
}

/** 역방향 링크 (자동 생성) */
export interface IncomingLink {
  fromScreenId: string;
  type: ScreenLink["type"];
  label?: string;
}

/** 특정 화면의 연결 정보 (outgoing + incoming) */
export interface ScreenNode {
  screenId: string;
  title?: string;
  section?: string;
  outgoing: ScreenLink[];
  incoming: IncomingLink[];
}

/** 전체 화면 연결 맵 */
export type ScreenLinkMap = Record<string, ScreenNode>;

export interface DocFile {
  /** 파일명 (확장자 제외) */
  name: string;
  /** 마크다운 원본 */
  content: string;
  /** docs/ 폴더의 상위 경로 (slug 이후 상대 경로, 예: "namespace/workspace/") */
  folder: string;
}

export interface DiscoveredDocument {
  slug: string;
  meta: DocumentMeta;
  slideCount: number;
}
