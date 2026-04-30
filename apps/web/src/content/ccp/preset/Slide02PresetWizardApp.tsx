import {
  Badge,
  CcpDashboardLayout,
  ContentSection,
  FormActions,
  TextCell,
  createSideMenuItems,
} from "../_components";
import { Search, Plus, Check, Folder, Sparkles } from "lucide-react";

import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-PRE-002",
  title: "프리셋 적용 - 앱 선택",
  section: "프리셋",
  subSection: "적용 마법사",
  links: [
    { type: "navigate", label: "이전", targetScreenId: "CCP-PRE-001" },
    { type: "navigate", label: "다음", targetScreenId: "CCP-PRE-003" },
  ],
  annotations: [
    {
      id: 1,
      label: "선택된 조직 표시",
      description: "1단계에서 선택/생성하기로 한 조직이 고정 표시됩니다. 변경하려면 이전 단계로 돌아가야 합니다.",
    },
    {
      id: 2,
      label: "앱 통합 입력란 (Combobox)",
      description: "기존 레포를 검색하거나 새 앱 이름을 입력하는 단일 입력란입니다. 입력값에 따라 매칭되는 기존 레포 또는 새로 만들기 옵션이 자동 표시됩니다.",
    },
    {
      id: 3,
      label: "기존 레포 매칭 결과",
      description: "선택된 조직 안의 레포지토리 중 입력값과 매칭되는 항목입니다. '파이프라인 보유' 뱃지는 짝꿍 -pipeline 레포가 이미 존재함을 의미하며, 선택 시 4단계에서 덮어쓰기 여부를 한 번 더 확인합니다.",
    },
    {
      id: 4,
      label: "새 앱 만들기 옵션",
      description: "정확 일치하는 기존 레포가 없을 때 표시됩니다. 클릭 시 입력값으로 빈 레포지토리가 4단계 적용 시점에 생성됩니다.",
    },
    {
      id: 5,
      label: "앱 선택 결과 미리보기",
      description: "선택/입력 결과를 기준으로 카탈로그의 sample 토큰이 어떻게 치환될지 미리 확인할 수 있습니다.",
    },
  ],
};

interface RepoItem {
  name: string;
  desc: string;
  hasPipeline: boolean;
}

const matchedRepos: RepoItem[] = [
  { name: "shop-front", desc: "쇼핑몰 프론트엔드 (React + Nginx)", hasPipeline: false },
  { name: "shop-front-mobile", desc: "쇼핑몰 모바일 웹뷰", hasPipeline: false },
  { name: "shop-api", desc: "쇼핑몰 백엔드 API (Spring Boot)", hasPipeline: true },
];

export default function Slide02PresetWizardApp() {
  const inputValue = "shop-front";
  const steps = [
    { num: 1, label: "조직", state: "done" as const },
    { num: 2, label: "앱", state: "active" as const },
    { num: 3, label: "프리셋", state: "idle" as const },
    { num: 4, label: "플레이스홀더", state: "idle" as const },
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
          <div className="flex flex-col gap-5 bg-white rounded-lg border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] p-6">
            <div className="flex flex-col gap-1">
              <TextCell bold color="#111" className="text-[16px]">
                2단계 · 앱(레포)
              </TextCell>
              <TextCell color="#6d7073" className="text-[12px]">
                기존 레포를 검색해서 선택하거나 새 앱 이름을 입력하세요. 카탈로그의 sample 토큰이 이 이름으로 치환됩니다.
              </TextCell>
            </div>

            <div className="pt-4 border-t border-[#f0f0f0]" data-annotation-id="1">
              <div className="flex items-center gap-3">
                <TextCell bold color="#333" className="text-[12px]">
                  선택 조직
                </TextCell>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f0f7ff] border border-[#cfe5ff] rounded">
                  <Folder className="w-3.5 h-3.5 text-[#0077ff]" />
                  <TextCell bold color="#0077ff" className="text-[13px]">
                    acme
                  </TextCell>
                  <TextCell color="#888" className="text-[11px]">
                    ↔ acme-cicd
                  </TextCell>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-[#f0f0f0]" data-annotation-id="2">
              <TextCell bold color="#333" className="text-[12px]">
                앱 이름
              </TextCell>
              <div className="flex items-center gap-2 px-3 h-[40px] bg-white border-2 border-[#0077ff] rounded shadow-[0_0_0_3px_#cfe5ff]">
                <Search className="w-4 h-4 text-[#888]" />
                <input
                  type="text"
                  defaultValue={inputValue}
                  placeholder="앱 검색 또는 새로 만들기"
                  className="flex-1 outline-none text-[13px] text-[#111] placeholder:text-[#999]"
                />
                <span className="text-[11px] text-[#999]">소문자 a-z, 0-9, 하이픈(-)</span>
              </div>

              {/* Inline dropdown */}
              <div className="bg-white border border-[#e0e0e0] rounded-lg shadow-[0_4px_12px_#00000010] overflow-hidden mt-1">
                <div className="px-3 pt-2.5 pb-1" data-annotation-id="3">
                  <TextCell color="#888" className="text-[11px] uppercase tracking-wide">
                    기존 레포 (acme 조직)
                  </TextCell>
                </div>
                <ul className="flex flex-col">
                  {matchedRepos.map((repo, i) => (
                    <li
                      key={repo.name}
                      className={`flex items-center gap-2.5 px-3 py-2.5 cursor-pointer ${
                        i === 0 ? "bg-[#f0f7ff]" : "hover:bg-[#fafafa]"
                      }`}
                    >
                      <Folder className="w-4 h-4 text-[#888]" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <TextCell bold color="#111" className="text-[13px]">
                            {repo.name}
                          </TextCell>
                          {repo.hasPipeline && (
                            <Badge variant="warning" size="sm">
                              파이프라인 보유
                            </Badge>
                          )}
                        </div>
                        <TextCell color="#888" className="text-[11px] mt-0.5">
                          {repo.desc}
                        </TextCell>
                      </div>
                      {i === 0 && <Check className="w-4 h-4 text-[#0077ff]" />}
                    </li>
                  ))}
                </ul>

                <div className="h-px bg-[#f0f0f0]" />

                <div className="px-3 pt-2.5 pb-1">
                  <TextCell color="#888" className="text-[11px] uppercase tracking-wide">
                    새로 만들기
                  </TextCell>
                </div>
                <ul>
                  <li
                    className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer hover:bg-[#fafafa]"
                    data-annotation-id="4"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#f0fdf4] flex items-center justify-center">
                      <Plus className="w-3.5 h-3.5 text-[#00b30e]" />
                    </div>
                    <div className="flex-1">
                      <TextCell bold color="#00b30e" className="text-[13px]">
                        + 새 앱 "{inputValue}" 만들기
                      </TextCell>
                      <TextCell color="#888" className="text-[11px] mt-0.5">
                        acme/{inputValue} 빈 레포지토리가 4단계 적용 시 생성됩니다
                      </TextCell>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-[#f0f0f0]" data-annotation-id="5">
              <div className="flex items-center justify-between">
                <TextCell bold color="#111" className="text-[13px]">
                  선택된 앱 미리보기
                </TextCell>
                <Badge variant="primary" size="sm">
                  <Sparkles className="w-3 h-3" />
                  기존 레포 사용
                </Badge>
              </div>
              <div className="bg-[#f8f9fa] rounded-md p-4 flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <TextCell color="#888" className="text-[12px] w-[180px]">
                    소스 코드 레포
                  </TextCell>
                  <TextCell bold color="#0077ff" className="text-[13px]">
                    acme/{inputValue}
                  </TextCell>
                </div>
                <div className="flex items-center gap-2">
                  <TextCell color="#888" className="text-[12px] w-[180px]">
                    파이프라인 레포 (4단계 생성)
                  </TextCell>
                  <TextCell bold color="#7c3aed" className="text-[13px]">
                    acme-cicd/{inputValue}-pipeline
                  </TextCell>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <TextCell color="#888" className="text-[12px] w-[180px]">
                    카탈로그 토큰 치환
                  </TextCell>
                  <span className="px-2 py-0.5 bg-white border border-[#e0e0e0] rounded text-[12px] font-mono text-[#da1e28]">
                    sample-reactnpm-nginx
                  </span>
                  <span className="text-[#888]">→</span>
                  <span className="px-2 py-0.5 bg-white border border-[#e0e0e0] rounded text-[12px] font-mono text-[#00b30e]">
                    {inputValue}
                  </span>
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
