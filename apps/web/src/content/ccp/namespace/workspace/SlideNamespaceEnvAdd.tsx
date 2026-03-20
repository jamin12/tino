import {
  Badge,
  CcpDashboardLayout,
  Checkbox,
  ContentSection,
  FormActions,
  InfoRow,
  TextCell,
  createSideMenuItems,
} from "../../_components";

import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-NS-006",
  title: "Namespace 환경 추가",
  section: "네임스페이스",
  links: [],
  annotations: [
    { id: 1, label: "현재 환경 표시", description: "이 네임스페이스에 이미 생성된 배포 환경 목록입니다. 이미 존재하는 환경은 중복 추가할 수 없으므로 참고 정보로 표시됩니다." },
    { id: 2, label: "기존 환경 선택", description: "클러스터에 등록되어 있지만 이 NS에는 아직 추가되지 않은 환경 목록입니다. 체크하면 k8s-app-init 레포의 overlays/{env}/sample-{env}/ 폴더를 복제하여 overlays/{env}/{ns}-{env}/ 폴더가 생성되고, 내부 파일의 'sample'이 NS 이름으로 치환됩니다. 해당 환경의 kustomization.yaml에도 참조가 추가됩니다. CICD 파이프라인(k8s-cicd-init)은 이미 존재하므로 app-init 리소스만 생성됩니다." },
    { id: 3, label: "생성될 리소스 미리보기", description: "선택한 환경에 따라 k8s-app-init 레포에 실제로 생성될 파일 경로를 보여줍니다. sample 템플릿의 내용에 따라 파일 목록이 달라지며, 공통적으로 overlays/{env}/{ns}-{env}/ 폴더(sample-{env}/ 복제)가 생성되고, 해당 환경의 overlays/{env}/kustomization.yaml에 참조가 추가됩니다." },
  ],
};

// ─── Side Menu Data ─────────────────────────────────────────────────────────


// ─── Slide ──────────────────────────────────────────────────────────────────

export default function SlideNamespaceEnvAdd() {
  return (
    <CcpDashboardLayout
      gnbPreset="namespace"
      breadcrumbs={[
        { label: "네임스페이스" },
        { label: "워크스페이스" },
        { label: "sample" },
        { label: "환경 추가", isBold: true },
      ]}
      title="sample — 환경 추가"
      sideMenuItems={createSideMenuItems({ activeId: "namespace" })}
    >
      <ContentSection>
        <div className="max-w-[640px]">
          <div className="flex flex-col gap-5 bg-white rounded-lg border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] p-6">
            {/* 대상 네임스페이스 */}
            <InfoRow label="네임스페이스" labelWidth="100px">
              <TextCell bold color="#111" className="text-[14px]">sample</TextCell>
            </InfoRow>

            {/* 현재 환경 */}
            <div data-annotation-id="1">
              <InfoRow label="현재 환경" labelWidth="100px">
                <Badge variant="blue-label" size="sm">dev</Badge>
                <Badge variant="yellow-label" size="sm">stg</Badge>
                <Badge variant="green-label" size="sm">prd</Badge>
              </InfoRow>
            </div>

            {/* 구분선 */}
            <div className="border-t border-[#f0f0f0]" />

            {/* 기존 환경 선택 */}
            <div className="flex flex-col gap-2">
              <TextCell bold color="#111" className="text-[14px]">
                기존 환경 선택
              </TextCell>
              <TextCell color="#6d7073" className="text-[12px]">
                클러스터에 등록된 환경 중 아직 추가되지 않은 환경을 선택하세요.
              </TextCell>
            </div>

            <div className="flex flex-col gap-3 pl-1" data-annotation-id="2">
              <div className="flex items-center gap-3">
                <Checkbox label="qa" />
                <Badge variant="orange-label" size="sm">QA</Badge>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox label="perf" checked />
                <Badge variant="neutral" size="sm">성능 테스트</Badge>
              </div>
            </div>

            {/* 미리보기 */}
            <div className="border-t border-[#f0f0f0]" />
            <div className="flex flex-col gap-2" data-annotation-id="3">
              <TextCell bold color="#111" className="text-[13px]">
                생성될 리소스
              </TextCell>
              <div className="bg-[#f8f9fa] rounded-md p-4 flex flex-col gap-1">
                <TextCell color="#6d7073" className="text-[12px]">
                  overlays/perf/sample-perf/namespace.yaml
                </TextCell>
                <TextCell color="#6d7073" className="text-[12px]">
                  overlays/perf/sample-perf/kustomization.yaml
                </TextCell>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <FormActions
            left={<></>}
            actions={[
              { label: "취소", variant: "gray-solid" },
              { label: "추가", variant: "primary" },
            ]}
          />
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
