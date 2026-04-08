import {
  Button,
  CcpDashboardLayout,
  ContentSection,
  InfoRow,
  TextCell,
  TextInput,
  Toggle,
  FormActions,
  createSideMenuItems,
} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-NSR-005",
  title: "Namespace 리소스 수정",
  section: "네임스페이스",
  subSection: "리스트 보기",
  links: [],
  annotations: [
    {
      id: 1,
      label: "YAML 모드 토글",
      description: "활성화하면 폼 대신 YAML 에디터가 표시됩니다. 현재 namespace의 전체 YAML을 직접 수정할 수 있으며, `kubectl edit ns`와 동일한 방식입니다.",
    },
    {
      id: 2,
      label: "기본 정보 (읽기 전용)",
      description: "namespace 이름, 클러스터, 상태는 수정할 수 없는 읽기 전용 필드입니다. namespace 이름을 변경하려면 삭제 후 재생성해야 합니다.",
    },
    {
      id: 3,
      label: "Labels 편집",
      description: "namespace의 K8s Labels를 수정합니다. key=value 쌍을 추가/수정/삭제할 수 있습니다.\n\n!!!시스템이 자동으로 부여한 Label(예: `kubernetes.io/metadata.name`)은 수정 시 주의가 필요합니다.!!!",
    },
    {
      id: 4,
      label: "Annotations 편집",
      description: "namespace의 K8s Annotations를 수정합니다. key=value 쌍을 추가/수정/삭제할 수 있습니다.",
    },
    {
      id: 5,
      label: "검증",
      description: "수정 전 사전 검증을 수행합니다. Labels/Annotations의 key 형식이 K8s 규격에 맞는지 확인합니다.",
    },
    {
      id: 6,
      label: "저장",
      description: "검증을 통과한 후 K8s API(`kubectl patch ns`)를 호출하여 namespace 메타데이터를 업데이트합니다.",
    },
  ],
};

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide04NamespaceResourceEdit() {
  return (
    <CcpDashboardLayout
      gnbPreset="namespace"
      breadcrumbs={[
        { label: "네임스페이스" },
        { label: "default" },
        { label: "수정", isBold: true },
      ]}
      title="네임스페이스 수정"
      sideMenuItems={createSideMenuItems({ activeId: "namespace" })}
    >
      <ContentSection card>
        {/* YAML 토글 */}
        <ContentSection className="flex items-center justify-end w-full px-6 pt-2">
          <Toggle label="YAML 모드" data-annotation-id="1" />
        </ContentSection>

        <ContentSection className="flex flex-col gap-5 px-6 pt-2">
          {/* ── 기본 정보 (읽기 전용) ── */}
          <div data-annotation-id="2">
            <TextCell bold color="#111" className="text-[14px] mb-3">
              기본 정보
            </TextCell>
            <div className="flex flex-col gap-3 bg-[#f8f9fa] rounded-md p-4">
              <InfoRow label="이름" labelWidth="120px">
                <TextCell color="#333" className="text-[13px]">default</TextCell>
              </InfoRow>
              <InfoRow label="클러스터" labelWidth="120px">
                <TextCell color="#333" className="text-[13px]">dev-cluster</TextCell>
              </InfoRow>
              <InfoRow label="상태" labelWidth="120px">
                <TextCell color="#333" className="text-[13px]">Active</TextCell>
              </InfoRow>
            </div>
          </div>

          {/* ── Labels ── */}
          <div data-annotation-id="3">
            <TextCell bold color="#111" className="text-[14px] mb-3">
              Labels
            </TextCell>
            <div className="flex flex-col gap-3">
              <InfoRow label="키" labelWidth="120px">
                <ContentSection className="flex items-center gap-2 flex-1">
                  <TextInput defaultValue="kubernetes.io/metadata.name" className="flex-1" />
                  <TextInput defaultValue="default" className="flex-1" />
                  <Button variant="ghost" size="sm">
                    삭제
                  </Button>
                </ContentSection>
              </InfoRow>
              <InfoRow label="" labelWidth="120px">
                <ContentSection className="flex items-center gap-2 flex-1">
                  <TextInput placeholder="key" className="flex-1" />
                  <TextInput placeholder="value" className="flex-1" />
                  <Button variant="blue-solid" size="sm">
                    추가
                  </Button>
                </ContentSection>
              </InfoRow>
            </div>
          </div>

          {/* ── Annotations ── */}
          <div data-annotation-id="4">
            <TextCell bold color="#111" className="text-[14px] mb-3">
              Annotations
            </TextCell>
            <div className="flex flex-col gap-3">
              <InfoRow label="" labelWidth="120px">
                <ContentSection className="flex items-center gap-2 flex-1">
                  <TextInput placeholder="key" className="flex-1" />
                  <TextInput placeholder="value" className="flex-1" />
                  <Button variant="blue-solid" size="sm">
                    추가
                  </Button>
                </ContentSection>
              </InfoRow>
            </div>
          </div>
        </ContentSection>

        <FormActions
          actions={[
            { label: "취소", variant: "gray-solid" },
            { label: "검증", variant: "blue-solid", annotationId: 5 },
            { label: "저장", variant: "primary", annotationId: 6 },
          ]}
        />
      </ContentSection>
    </CcpDashboardLayout>
  );
}
