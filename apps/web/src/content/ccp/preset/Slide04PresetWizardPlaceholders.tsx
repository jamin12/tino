import {
  Badge,
  CcpDashboardLayout,
  ContentSection,
  FormActions,
  TextCell,
  TextInput,
  createSideMenuItems,
} from "../_components";
import { Check, Lock, Plus, X, Info } from "lucide-react";

import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-PRE-004",
  title: "프리셋 적용 - 플레이스홀더 확인",
  section: "프리셋",
  subSection: "적용 마법사",
  links: [
    { type: "navigate", label: "이전", targetScreenId: "CCP-PRE-003" },
    { type: "navigate", label: "다음", targetScreenId: "CCP-PRE-005" },
  ],
  annotations: [
    {
      id: 1,
      label: "자동 매핑 플레이스홀더",
      description: "1단계의 조직, 2단계의 앱 이름이 자동으로 매핑된 플레이스홀더입니다. 자물쇠 아이콘으로 잠겨있어 이 단계에서는 수정할 수 없으며, 변경하려면 해당 단계로 돌아가야 합니다.",
    },
    {
      id: 2,
      label: "환경 리스트 플레이스홀더",
      description: "프리셋이 펼쳐질 환경 리스트를 태그 형태로 입력합니다. 디폴트는 카탈로그가 제공한 dev/stg/prd이며, 사용자는 자유롭게 추가/삭제할 수 있습니다 (예: qa, uat, prod 등). 입력한 환경 개수만큼 폴더와 깡통 artifact 레포가 생성됩니다.",
    },
    {
      id: 3,
      label: "일반 플레이스홀더",
      description: "카탈로그 작성자가 정의한 그 외 변수입니다. DB에 저장된 디폴트값으로 자동 채워지며 사용자가 필요 시 수정할 수 있습니다. 각 변수의 라벨/설명/디폴트는 프리셋마다 다릅니다.",
    },
    {
      id: 4,
      label: "치환 미리보기 토글",
      description: "현재 입력값으로 치환된 결과의 일부를 즉시 미리보기로 확인할 수 있습니다. 4단계에서 값을 바꿀 때마다 갱신됩니다.",
    },
  ],
};

interface Placeholder {
  marker: string;
  label: string;
  description: string;
  value: string;
  source: "1단계" | "2단계" | "디폴트";
  locked?: boolean;
}

const lockedPlaceholders: Placeholder[] = [
  {
    marker: "{{org}}",
    label: "조직",
    description: "namespace, 호스트, 이미지 레지스트리 조직 prefix",
    value: "acme",
    source: "1단계",
    locked: true,
  },
  {
    marker: "{{appName}}",
    label: "앱 이름",
    description: "K8s 리소스 이름과 이미지 prefix",
    value: "shop-front",
    source: "2단계",
    locked: true,
  },
];

const editablePlaceholders: Placeholder[] = [
  {
    marker: "{{domain}}",
    label: "서비스 도메인",
    description: "Ingress 호스트 (예: {{org}}.cone-chain.net)",
    value: "cone-chain.net",
    source: "디폴트",
  },
  {
    marker: "{{nodeVersion}}",
    label: "Node 버전",
    description: "빌드 시 사용할 Node.js 버전",
    value: "21.1.0",
    source: "디폴트",
  },
  {
    marker: "{{nginxVersion}}",
    label: "Nginx 버전",
    description: "런타임 Nginx 베이스 이미지 버전",
    value: "1.26",
    source: "디폴트",
  },
  {
    marker: "{{buildScriptName}}",
    label: "빌드 스크립트 이름",
    description: "package.json scripts 항목 (실제 실행: npm run {{buildScriptName}}:{{env}})",
    value: "build",
    source: "디폴트",
  },
];

const envs = ["dev", "stg", "prd"];

export default function Slide04PresetWizardPlaceholders() {
  const steps = [
    { num: 1, label: "조직", state: "done" as const },
    { num: 2, label: "앱", state: "done" as const },
    { num: 3, label: "프리셋", state: "done" as const },
    { num: 4, label: "플레이스홀더", state: "active" as const },
    { num: 5, label: "확인", state: "idle" as const },
  ];

  return (
    <CcpDashboardLayout
      gnbPreset="cicd"
      breadcrumbs={[
        { label: "CI/CD" },
        { label: "카탈로그" },
        { label: "프리셋 적용", isBold: true },
      ]}
      title="프리셋 적용"
      sideMenuItems={createSideMenuItems({ activeId: "cicd", activeLabel: "카탈로그" })}
    >
      <ContentSection card>
        <div className="px-6 py-5 border-b border-[#f0f0f0]">
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium ${
                    s.state === "active"
                      ? "bg-[#0077ff] text-white"
                      : s.state === "done"
                        ? "bg-[#00b30e] text-white"
                        : "bg-[#f0f2f5] text-[#888]"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${
                      s.state === "idle" ? "bg-white" : "bg-white/20"
                    }`}
                  >
                    {s.state === "done" ? <Check className="w-3 h-3" /> : s.num}
                  </span>
                  {s.label}
                </div>
                {i < steps.length - 1 && <span className="w-6 h-px bg-[#dcdfe3]" />}
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="flex flex-col gap-1 mb-5">
            <TextCell bold color="#111" className="text-[16px]">
              4단계 · 플레이스홀더 확인
            </TextCell>
            <TextCell color="#6d7073" className="text-[12px]">
              이 프리셋이 요구하는 변수입니다. 1·2단계 입력값은 자동 매핑되어 있고, 나머지는 카탈로그 디폴트가 채워져 있습니다. 필요한 값만 수정하세요.
            </TextCell>
          </div>

          <div className="grid grid-cols-[1fr_360px] gap-5">
            <div className="flex flex-col gap-4">
              {/* 자동 매핑 영역 */}
              <div className="bg-white border border-[#f0f0f0] rounded-lg p-5" data-annotation-id="1">
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="w-3.5 h-3.5 text-[#888]" />
                  <TextCell bold color="#111" className="text-[13px]">
                    자동 매핑 (이전 단계 결과)
                  </TextCell>
                </div>
                <div className="flex flex-col gap-3">
                  {lockedPlaceholders.map((p) => (
                    <div key={p.marker} className="grid grid-cols-[200px_1fr] gap-3 items-start">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <TextCell bold color="#333" className="text-[12px]">
                            {p.label}
                          </TextCell>
                          <Badge variant="neutral" size="sm">
                            {p.source}
                          </Badge>
                        </div>
                        <TextCell color="#888" className="text-[11px] mt-0.5 font-mono">
                          {p.marker}
                        </TextCell>
                      </div>
                      <div className="flex items-center gap-2 px-3 h-[34px] bg-[#fafbfc] border border-[#e0e0e0] rounded">
                        <Lock className="w-3 h-3 text-[#888]" />
                        <span className="font-mono text-[13px] text-[#111] flex-1">{p.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 환경 리스트 */}
              <div className="bg-white border border-[#f0f0f0] rounded-lg p-5" data-annotation-id="2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-col">
                    <TextCell bold color="#111" className="text-[13px]">
                      환경 리스트 (envs)
                    </TextCell>
                    <TextCell color="#888" className="text-[11px] mt-0.5">
                      카탈로그가 환경 단위로 N번 펼쳐집니다. 이름은 자유롭게 정할 수 있습니다.
                    </TextCell>
                  </div>
                  <Badge variant="primary" size="sm">
                    디폴트: dev/stg/prd
                  </Badge>
                </div>
                <div className="flex items-center flex-wrap gap-2 px-3 py-2.5 bg-[#fafbfc] border border-[#e0e0e0] rounded min-h-[40px]">
                  {envs.map((env) => (
                    <span
                      key={env}
                      className="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-[#cfe5ff] rounded text-[12px] text-[#0077ff]"
                    >
                      <span className="font-mono">{env}</span>
                      <button
                        type="button"
                        className="text-[#888] hover:text-[#da1e28]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 px-2 py-1 border border-dashed border-[#cfd4d9] rounded text-[12px] text-[#888] hover:bg-white"
                  >
                    <Plus className="w-3 h-3" />
                    환경 추가
                  </button>
                </div>
                <div className="flex items-start gap-2 mt-2">
                  <Info className="w-3.5 h-3.5 text-[#888] mt-0.5 shrink-0" />
                  <TextCell color="#888" className="text-[11px]">
                    각 환경마다 acme-cicd/shop-front-&#123;env&#125; 깡통 artifact 레포가 함께 생성됩니다.
                  </TextCell>
                </div>
              </div>

              {/* 일반 플레이스홀더 */}
              <div className="bg-white border border-[#f0f0f0] rounded-lg p-5" data-annotation-id="3">
                <div className="flex items-center justify-between mb-3">
                  <TextCell bold color="#111" className="text-[13px]">
                    그 외 플레이스홀더 ({editablePlaceholders.length}개)
                  </TextCell>
                  <Badge variant="neutral" size="sm">
                    카탈로그 디폴트
                  </Badge>
                </div>
                <div className="flex flex-col gap-4">
                  {editablePlaceholders.map((p) => (
                    <div key={p.marker} className="grid grid-cols-[200px_1fr] gap-3 items-start">
                      <div className="flex flex-col">
                        <TextCell bold color="#333" className="text-[12px]">
                          {p.label}
                        </TextCell>
                        <TextCell color="#888" className="text-[11px] mt-0.5 font-mono">
                          {p.marker}
                        </TextCell>
                        <TextCell color="#888" className="text-[11px] mt-1 leading-snug">
                          {p.description}
                        </TextCell>
                      </div>
                      <TextInput defaultValue={p.value} className="w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 우측: 즉시 미리보기 */}
            <div
              className="bg-[#fafbfc] border border-[#e0e0e0] rounded-lg p-4 self-start"
              data-annotation-id="4"
            >
              <TextCell bold color="#111" className="text-[13px] mb-2">
                치환 미리보기
              </TextCell>
              <TextCell color="#888" className="text-[11px] mb-3">
                현재 값 기준 일부 결과를 즉시 보여줍니다.
              </TextCell>

              <div className="bg-[#0d1117] rounded p-3 font-mono text-[11px] flex flex-col gap-2">
                <div>
                  <span className="text-[#888]">metadata.name:</span>
                  <br />
                  <span className="text-[#7ee787]">shop-front-dev-build-pr</span>
                </div>
                <div>
                  <span className="text-[#888]">namespace:</span>
                  <br />
                  <span className="text-[#7ee787]">acme-cicd</span>
                </div>
                <div>
                  <span className="text-[#888]">app-namespace:</span>
                  <br />
                  <span className="text-[#7ee787]">acme-dev</span>
                </div>
                <div>
                  <span className="text-[#888]">image:</span>
                  <br />
                  <span className="text-[#7ee787] break-all">
                    harbor.cone-chain.net/acme-prd/acme/shop-front
                  </span>
                </div>
                <div>
                  <span className="text-[#888]">host:</span>
                  <br />
                  <span className="text-[#7ee787]">acme.cone-chain.net</span>
                </div>
                <div>
                  <span className="text-[#888]">build-script:</span>
                  <br />
                  <span className="text-[#7ee787]">npm run build:dev</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#e0e0e0]">
                <TextCell color="#888" className="text-[11px] mb-1.5">
                  생성될 환경별 깡통 레포
                </TextCell>
                <div className="flex flex-col gap-1 font-mono text-[11px] text-[#555]">
                  {envs.map((env) => (
                    <div key={env}>📦 acme-cicd/shop-front-{env}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <FormActions
            left={<></>}
            actions={[
              { label: "이전", variant: "gray-solid" },
              { label: "다음", variant: "primary" },
            ]}
          />
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
