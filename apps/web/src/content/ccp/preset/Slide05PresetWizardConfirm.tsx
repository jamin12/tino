import {
  Badge,
  CcpDashboardLayout,
  ContentSection,
  FormActions,
  TextCell,
  createSideMenuItems,
} from "../_components";
import { Check, Folder, Box } from "lucide-react";

import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-PRE-005",
  title: "프리셋 적용 - 확인 및 적용",
  section: "프리셋",
  subSection: "적용 마법사",
  links: [
    { type: "navigate", label: "이전", targetScreenId: "CCP-PRE-004" },
  ],
  annotations: [
    {
      id: 1,
      label: "선택값 요약",
      description: "1~3단계에서 결정한 조직, 앱, 프리셋을 한눈에 확인할 수 있는 요약 카드입니다.",
    },
    {
      id: 2,
      label: "결정된 플레이스홀더 값",
      description: "4단계에서 입력/확인한 모든 플레이스홀더의 최종값을 표시합니다. 환경 리스트, 도메인 등 카탈로그 작성자가 정의한 모든 변수가 포함됩니다.",
    },
    {
      id: 3,
      label: "변수 마커 치환 미리보기",
      description: "프리셋 템플릿 안의 {{변수}} 마커가 각각 어떤 값으로 치환될지 diff 형태로 표시합니다. 치환 알고리즘은 단순 마커 매칭이라 충돌 위험이 없습니다.",
    },
    {
      id: 4,
      label: "적용 처리 순서",
      description: "[적용] 클릭 시 시스템이 트랜잭션으로 수행할 작업 목록입니다. 환경 리스트 길이만큼 깡통 레포 생성 단계가 펼쳐지며, 실패 시 결과 페이지에서 롤백할 수 있습니다.",
    },
  ],
};

interface PlaceholderRow {
  marker: string;
  value: string;
  source: "1단계" | "2단계" | "4단계 입력" | "4단계 디폴트";
}

const placeholders: PlaceholderRow[] = [
  { marker: "{{org}}", value: "acme", source: "1단계" },
  { marker: "{{appName}}", value: "shop-front", source: "2단계" },
  { marker: "{{envs}}", value: "[dev, stg, prd]", source: "4단계 디폴트" },
  { marker: "{{domain}}", value: "cone-chain.net", source: "4단계 디폴트" },
  { marker: "{{nodeVersion}}", value: "21.1.0", source: "4단계 디폴트" },
  { marker: "{{nginxVersion}}", value: "1.26", source: "4단계 디폴트" },
];

interface DiffRow {
  marker: string;
  replacement: string;
  count: number;
}

const diffs: DiffRow[] = [
  { marker: "{{appName}}", replacement: "shop-front", count: 38 },
  { marker: "{{org}}", replacement: "acme", count: 22 },
  { marker: "{{env}}", replacement: "(환경별)", count: 14 },
  { marker: "{{domain}}", replacement: "cone-chain.net", count: 4 },
  { marker: "{{nodeVersion}}", replacement: "21.1.0", count: 1 },
  { marker: "{{nginxVersion}}", replacement: "1.26", count: 1 },
];

const envs = ["dev", "stg", "prd"];

export default function Slide05PresetWizardConfirm() {
  const steps = [
    { num: 1, label: "조직", state: "done" as const },
    { num: 2, label: "앱", state: "done" as const },
    { num: 3, label: "프리셋", state: "done" as const },
    { num: 4, label: "플레이스홀더", state: "done" as const },
    { num: 5, label: "확인", state: "active" as const },
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
              5단계 · 확인 및 적용
            </TextCell>
            <TextCell color="#6d7073" className="text-[12px]">
              아래 내용을 검토 후 [적용] 버튼을 클릭하면 시스템이 조직 생성 → 레포 생성 → 템플릿 복제 → 변수 치환 → 푸시까지 트랜잭션으로 자동 처리합니다.
            </TextCell>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6" data-annotation-id="1">
            <div className="bg-white border border-[#e0e0e0] rounded-lg p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Folder className="w-3.5 h-3.5 text-[#0077ff]" />
                <TextCell color="#888" className="text-[11px]">
                  조직 페어
                </TextCell>
              </div>
              <TextCell bold color="#111" className="text-[14px]">
                acme
              </TextCell>
              <TextCell color="#7c3aed" className="text-[12px] mt-0.5">
                ↔ acme-cicd
              </TextCell>
            </div>

            <div className="bg-white border border-[#e0e0e0] rounded-lg p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Folder className="w-3.5 h-3.5 text-[#0077ff]" />
                <TextCell color="#888" className="text-[11px]">
                  앱 (소스 코드)
                </TextCell>
              </div>
              <TextCell bold color="#111" className="text-[14px]">
                shop-front
              </TextCell>
              <TextCell color="#888" className="text-[11px] mt-0.5">
                acme/shop-front (기존)
              </TextCell>
            </div>

            <div className="bg-white border border-[#e0e0e0] rounded-lg p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Box className="w-3.5 h-3.5 text-[#0077ff]" />
                <TextCell color="#888" className="text-[11px]">
                  프리셋
                </TextCell>
              </div>
              <TextCell bold color="#111" className="text-[14px]">
                React + npm + Nginx
              </TextCell>
              <TextCell color="#888" className="text-[11px] mt-0.5 font-mono">
                preset/preset-reactnpm-nginx
              </TextCell>
            </div>
          </div>

          <div className="bg-white border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] rounded-lg p-6 mb-4">
            <div className="flex flex-col gap-2 mb-5" data-annotation-id="2">
              <div className="flex items-center justify-between">
                <TextCell bold color="#111" className="text-[13px]">
                  결정된 플레이스홀더 값
                </TextCell>
                <Badge variant="primary" size="sm">
                  4단계 결과
                </Badge>
              </div>
              <TextCell color="#6d7073" className="text-[12px]">
                각 변수의 최종값입니다. 1·2단계 입력값은 자동 매핑, 그 외는 4단계에서 결정한 값.
              </TextCell>
              <div className="bg-[#fafbfc] rounded border border-[#e0e0e0] mt-1">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#e0e0e0] text-[11px] font-semibold text-[#555]">
                      <th className="px-3 py-2 w-[180px]">변수 마커</th>
                      <th className="px-3 py-2">값</th>
                      <th className="px-3 py-2 w-[110px]">출처</th>
                    </tr>
                  </thead>
                  <tbody>
                    {placeholders.map((p, i) => (
                      <tr
                        key={p.marker}
                        className={i < placeholders.length - 1 ? "border-b border-[#f0f0f0]" : ""}
                      >
                        <td className="px-3 py-2 font-mono text-[12px] text-[#7c3aed]">{p.marker}</td>
                        <td className="px-3 py-2 font-mono text-[12px] text-[#111]">{p.value}</td>
                        <td className="px-3 py-2 text-[11px] text-[#888]">{p.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-5 border-t border-[#f0f0f0]" data-annotation-id="3">
              <div className="flex items-center justify-between mb-3">
                <TextCell bold color="#111" className="text-[13px]">
                  변수 마커 치환 미리보기 ({diffs.reduce((s, d) => s + d.count, 0)}곳 변경)
                </TextCell>
                <span className="text-[11px] text-[#0077ff] cursor-pointer">접기</span>
              </div>
              <div className="bg-[#0d1117] rounded p-3 font-mono text-[11px] flex flex-col gap-1">
                {diffs.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[#888] w-7 text-right">{d.count}×</span>
                    <span className="text-[#ff7b72]">- {d.marker}</span>
                    <span className="text-[#888]">→</span>
                    <span className="text-[#7ee787]">+ {d.replacement}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-[#f0f0f0]" data-annotation-id="4">
              <TextCell bold color="#111" className="text-[13px] mb-2">
                적용 시 처리 순서
              </TextCell>
              <ol className="flex flex-col gap-2">
                {[
                  { skip: true, text: "조직 생성 (acme + acme-cicd)" },
                  { skip: true, text: "소스 레포 생성 (acme/shop-front)" },
                  { skip: false, text: "preset/preset-reactnpm-nginx 템플릿 임시 영역 복제" },
                  { skip: false, text: "모든 파일에서 {{변수}} 마커 → 결정된 값으로 치환" },
                  { skip: false, text: "환경 리스트(envs)만큼 폴더 펼치기 (env 단위 N번 렌더링)" },
                  { skip: false, text: "acme-cicd/shop-front-pipeline 레포 생성 + 푸시" },
                  { skip: false, text: "acme-cicd/shop-front-gitops 레포 생성 + 푸시" },
                  ...envs.map((env) => ({
                    skip: false,
                    text: `acme-cicd/shop-front-${env} 깡통 artifact 레포 생성`,
                  })),
                  { skip: false, text: "결과 페이지로 이동 (생성된 레포 링크 + 다음 단계 안내)" },
                ].map((step, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${
                        step.skip
                          ? "bg-[#f0f2f5] text-[#999]"
                          : "bg-[#0077ff] text-white"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <TextCell
                      color={step.skip ? "#999" : "#333"}
                      className="text-[12px]"
                    >
                      {step.text}
                      {step.skip && (
                        <Badge variant="neutral" size="sm" className="ml-2">
                          기존 활용
                        </Badge>
                      )}
                    </TextCell>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <FormActions
            left={<></>}
            actions={[
              { label: "이전", variant: "gray-solid" },
              { label: "적용", variant: "primary" },
            ]}
          />
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
