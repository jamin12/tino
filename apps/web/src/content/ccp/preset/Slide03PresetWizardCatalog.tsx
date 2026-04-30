import {
  Badge,
  CcpDashboardLayout,
  ContentSection,
  FormActions,
  TextCell,
  createSideMenuItems,
} from "../_components";
import { Box, Check, ChevronRight, Folder } from "lucide-react";

import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-PRE-003",
  title: "프리셋 적용 - 프리셋 선택",
  section: "프리셋",
  subSection: "적용 마법사",
  links: [
    { type: "navigate", label: "이전", targetScreenId: "CCP-PRE-002" },
    { type: "navigate", label: "다음", targetScreenId: "CCP-PRE-004" },
  ],
  annotations: [
    {
      id: 1,
      label: "프리셋 카탈로그 (preset 조직)",
      description: "preset 조직 안에 등록된 모든 프리셋 레포 목록입니다. 각 카드는 해당 프리셋의 DB 메타(displayName/tags/플레이스홀더 개수)를 기준으로 렌더링됩니다.",
    },
    {
      id: 2,
      label: "선택된 프리셋",
      description: "선택 시 파란색 테두리와 체크 아이콘으로 강조 표시됩니다. 다음 단계에서 이 프리셋의 플레이스홀더 정의를 DB에서 조회해 폼이 구성됩니다.",
    },
    {
      id: 3,
      label: "프리셋 상세 패널",
      description: "선택한 프리셋의 메타정보, 정의된 플레이스홀더 목록, 포함 템플릿 구조를 표시합니다.",
    },
    {
      id: 4,
      label: "변수 마커 안내",
      description: "프리셋 템플릿 안의 식별자는 모두 {{변수}} 마커로 박혀있으며, 다음 단계에서 사용자가 결정하는 값으로 일괄 치환됩니다.",
    },
  ],
};

interface PresetCard {
  name: string;
  displayName: string;
  description: string;
  tags: string[];
  placeholderCount: number;
  selected?: boolean;
}

const presets: PresetCard[] = [
  {
    name: "preset-reactnpm-nginx",
    displayName: "React + npm + Nginx",
    description: "React 앱을 npm으로 빌드하고 Nginx 이미지에 패키징",
    tags: ["react", "npm", "nginx", "frontend"],
    placeholderCount: 6,
    selected: true,
  },
  {
    name: "preset-egovmaven-tomcat",
    displayName: "eGov + Maven + Tomcat",
    description: "eGovFrame 프로젝트를 Maven으로 빌드 후 Tomcat에 배포",
    tags: ["egovframe", "maven", "tomcat", "java"],
    placeholderCount: 7,
  },
  {
    name: "preset-egovmaven-core",
    displayName: "eGov + Maven Core",
    description: "eGovFrame Core 라이브러리 빌드 및 Nexus 배포",
    tags: ["egovframe", "maven", "library"],
    placeholderCount: 5,
  },
  {
    name: "preset-petgradle-boot",
    displayName: "Pet + Gradle + Spring Boot",
    description: "Pet 프로젝트 Gradle 빌드 및 Spring Boot 컨테이너 배포",
    tags: ["spring-boot", "gradle", "java"],
    placeholderCount: 6,
  },
];

export default function Slide03PresetWizardCatalog() {
  const steps = [
    { num: 1, label: "조직", state: "done" as const },
    { num: 2, label: "앱", state: "done" as const },
    { num: 3, label: "프리셋", state: "active" as const },
    { num: 4, label: "플레이스홀더", state: "idle" as const },
    { num: 5, label: "확인", state: "idle" as const },
  ];

  const selectedPreset = presets.find((p) => p.selected)!;

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
          <div className="flex items-center justify-between mb-5">
            <div className="flex flex-col gap-1">
              <TextCell bold color="#111" className="text-[16px]">
                3단계 · 파이프라인 프리셋 선택
              </TextCell>
              <TextCell color="#6d7073" className="text-[12px]">
                preset 조직에 등록된 카탈로그에서 적용할 기술 스택 프리셋을 선택하세요.
              </TextCell>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f0f7ff] border border-[#cfe5ff] rounded">
              <Folder className="w-3.5 h-3.5 text-[#0077ff]" />
              <TextCell bold color="#0077ff" className="text-[12px]">
                preset 조직
              </TextCell>
              <TextCell color="#888" className="text-[11px]">
                · {presets.length}개 프리셋
              </TextCell>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_360px] gap-5">
            <div className="grid grid-cols-2 gap-3" data-annotation-id="1">
              {presets.map((p) => (
                <div
                  key={p.name}
                  className={`relative bg-white rounded-lg border p-4 cursor-pointer ${
                    p.selected
                      ? "border-[#0077ff] shadow-[0px_0px_0px_3px_#cfe5ff]"
                      : "border-[#e0e0e0] hover:border-[#999]"
                  }`}
                  data-annotation-id={p.selected ? "2" : undefined}
                >
                  {p.selected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#0077ff] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded bg-[#f0f7ff] flex items-center justify-center">
                      <Box className="w-4 h-4 text-[#0077ff]" />
                    </div>
                    <div className="flex flex-col">
                      <TextCell bold color="#111" className="text-[14px]">
                        {p.displayName}
                      </TextCell>
                      <TextCell color="#888" className="text-[10px] font-mono">
                        preset/{p.name}
                      </TextCell>
                    </div>
                  </div>
                  <TextCell color="#6d7073" className="text-[12px] mb-3 leading-snug">
                    {p.description}
                  </TextCell>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="px-1.5 py-0.5 bg-[#f6f8fa] border border-[#e0e0e0] rounded text-[11px] text-[#555]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 mt-3 pt-3 border-t border-[#f0f0f0]">
                    <TextCell color="#999" className="text-[11px]">
                      플레이스홀더
                    </TextCell>
                    <Badge variant="neutral" size="sm">
                      {p.placeholderCount}개
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="bg-[#fafbfc] border border-[#e0e0e0] rounded-lg p-4 flex flex-col gap-4 self-start"
              data-annotation-id="3"
            >
              <div className="flex items-start gap-2">
                <div className="w-9 h-9 rounded bg-[#0077ff] flex items-center justify-center shrink-0">
                  <Box className="w-5 h-5 text-white" />
                </div>
                <div>
                  <TextCell bold color="#111" className="text-[14px]">
                    {selectedPreset.displayName}
                  </TextCell>
                  <TextCell color="#6d7073" className="text-[11px] font-mono mt-0.5">
                    preset/{selectedPreset.name}
                  </TextCell>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <TextCell bold color="#555" className="text-[12px]">
                  정의된 플레이스홀더
                </TextCell>
                <div className="bg-white border border-[#e0e0e0] rounded p-3 flex flex-col gap-1 font-mono text-[11px] text-[#7c3aed]">
                  <div>{`{{org}}`}<span className="text-[#888] ml-1.5 font-sans">자동 매핑</span></div>
                  <div>{`{{appName}}`}<span className="text-[#888] ml-1.5 font-sans">자동 매핑</span></div>
                  <div>{`{{envs}}`}<span className="text-[#888] ml-1.5 font-sans">디폴트 dev/stg/prd</span></div>
                  <div>{`{{domain}}`}<span className="text-[#888] ml-1.5 font-sans">디폴트</span></div>
                  <div>{`{{nodeVersion}}`}<span className="text-[#888] ml-1.5 font-sans">디폴트</span></div>
                  <div>{`{{nginxVersion}}`}<span className="text-[#888] ml-1.5 font-sans">디폴트</span></div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <TextCell bold color="#555" className="text-[12px]">
                  템플릿 구조
                </TextCell>
                <div className="bg-white border border-[#e0e0e0] rounded p-3 flex flex-col gap-0.5 font-mono text-[11px] text-[#555]">
                  <div>pipeline/</div>
                  <div className="pl-2 text-[#888]">{`{{env}}/`} (env마다 펼쳐짐)</div>
                  <div className="pl-4">build-cj.yaml ...</div>
                  <div className="pl-4">deploy-pr.yaml ...</div>
                  <div className="pl-2 text-[#888]">kustomization.yaml</div>
                  <div>gitops/</div>
                  <div className="pl-2 text-[#888]">base/</div>
                  <div className="pl-2 text-[#888]">overlays/{`{{env}}/`}</div>
                </div>
              </div>

              <div className="flex flex-col gap-1" data-annotation-id="4">
                <TextCell bold color="#555" className="text-[12px]">
                  변수 마커 치환
                </TextCell>
                <div className="bg-white border border-[#e0e0e0] rounded p-3 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-1.5 py-0.5 bg-[#fdf2f2] border border-[#fadcdc] rounded text-[11px] font-mono text-[#da1e28]">
                      {`{{appName}}`}
                    </span>
                    <ChevronRight className="w-3 h-3 text-[#888]" />
                    <span className="px-1.5 py-0.5 bg-[#f0fdf4] border border-[#bbf7d0] rounded text-[11px] font-mono text-[#00b30e]">
                      shop-front
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-1.5 py-0.5 bg-[#fdf2f2] border border-[#fadcdc] rounded text-[11px] font-mono text-[#da1e28]">
                      {`{{org}}`}
                    </span>
                    <ChevronRight className="w-3 h-3 text-[#888]" />
                    <span className="px-1.5 py-0.5 bg-[#f0fdf4] border border-[#bbf7d0] rounded text-[11px] font-mono text-[#00b30e]">
                      acme
                    </span>
                  </div>
                  <TextCell color="#888" className="text-[11px]">
                    다음 단계에서 모든 변수의 값을 확인/수정합니다
                  </TextCell>
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
