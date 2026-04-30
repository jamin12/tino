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
  screenId: "CCP-PRE-001",
  title: "프리셋 적용 - 조직 선택",
  section: "프리셋",
  subSection: "적용 마법사",
  links: [
    {
      type: "navigate",
      label: "다음",
      targetScreenId: "CCP-PRE-002",
    },
  ],
  annotations: [
    {
      id: 1,
      label: "단계 인디케이터",
      description: "4단계 마법사 중 현재 위치를 표시합니다. 각 단계는 조직 → 앱 → 프리셋 → 확인 순서로 진행됩니다.",
    },
    {
      id: 2,
      label: "조직 통합 입력란 (Combobox)",
      description: "기존 조직을 검색하거나 새 조직 이름을 입력하는 단일 입력란입니다. 입력값에 따라 아래 드롭다운에서 매칭되는 기존 조직 또는 새로 만들기 옵션이 자동으로 표시됩니다.",
    },
    {
      id: 3,
      label: "기존 조직 매칭 결과",
      description: "입력값과 매칭되는 기존 소스 조직 목록입니다. 짝꿍 {org}-cicd 조직이 페어링되어 있는 조직만 표시됩니다. 클릭하면 해당 조직이 선택됩니다.",
    },
    {
      id: 4,
      label: "새 조직 만들기 옵션",
      description: "입력값과 정확히 일치하는 기존 조직이 없으면 표시되는 항목입니다. 클릭 시 입력값으로 {org}와 {org}-cicd 두 조직이 동시에 자동 생성됩니다. 둘 중 하나라도 충돌하면 비활성 처리됩니다.",
    },
    {
      id: 5,
      label: "선택 결과 미리보기",
      description: "기존 조직 선택 또는 신규 생성 시 결과로 사용될 조직 페어를 시각화합니다. '신규 생성' 뱃지로 새로 만들어지는 조직과 기존 조직을 구분합니다.",
    },
  ],
};

function StepIndicator() {
  const steps = [
    { num: 1, label: "조직", state: "active" as const },
    { num: 2, label: "앱", state: "idle" as const },
    { num: 3, label: "프리셋", state: "idle" as const },
    { num: 4, label: "플레이스홀더", state: "idle" as const },
    { num: 5, label: "확인", state: "idle" as const },
  ];
  return (
    <div className="flex items-center gap-2" data-annotation-id="1">
      {steps.map((s, i) => (
        <div key={s.num} className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium ${
              s.state === "active"
                ? "bg-[#0077ff] text-white"
                : "bg-[#f0f2f5] text-[#888]"
            }`}
          >
            <span
              className={`flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${
                s.state === "idle" ? "bg-white" : "bg-white/20"
              }`}
            >
              {s.num}
            </span>
            {s.label}
          </div>
          {i < steps.length - 1 && <span className="w-6 h-px bg-[#dcdfe3]" />}
        </div>
      ))}
    </div>
  );
}

interface OrgItem {
  name: string;
  pairOk: boolean;
  hint: string;
}

const matchedOrgs: OrgItem[] = [
  { name: "acme", pairOk: true, hint: "acme-cicd 페어 OK · 12개 레포" },
  { name: "acme-platform", pairOk: true, hint: "acme-platform-cicd 페어 OK · 4개 레포" },
];

export default function Slide01PresetWizardOrg() {
  const inputValue = "acme";

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
          <StepIndicator />
        </div>

        <div className="px-6 py-6">
          <div className="flex flex-col gap-5 bg-white rounded-lg border border-[#f0f0f0] shadow-[0px_0px_8px_#00000014] p-6">
            <div className="flex flex-col gap-1">
              <TextCell bold color="#111" className="text-[16px]">
                1단계 · 소스 조직
              </TextCell>
              <TextCell color="#6d7073" className="text-[12px]">
                기존 조직을 검색해서 선택하거나 새 조직 이름을 입력하세요. 짝꿍 cicd 조직(&#123;org&#125;-cicd)은 자동으로 페어링됩니다.
              </TextCell>
            </div>

            <div className="flex flex-col gap-2" data-annotation-id="2">
              <TextCell bold color="#333" className="text-[12px]">
                조직 이름
              </TextCell>
              <div className="flex items-center gap-2 px-3 h-[40px] bg-white border-2 border-[#0077ff] rounded shadow-[0_0_0_3px_#cfe5ff]">
                <Search className="w-4 h-4 text-[#888]" />
                <input
                  type="text"
                  defaultValue={inputValue}
                  placeholder="조직 검색 또는 새로 만들기"
                  className="flex-1 outline-none text-[13px] text-[#111] placeholder:text-[#999]"
                />
                <span className="text-[11px] text-[#999]">소문자 a-z, 0-9, 하이픈(-)</span>
              </div>

              {/* Inline dropdown (always shown for mock) */}
              <div className="bg-white border border-[#e0e0e0] rounded-lg shadow-[0_4px_12px_#00000010] overflow-hidden mt-1">
                <div className="px-3 pt-2.5 pb-1" data-annotation-id="3">
                  <TextCell color="#888" className="text-[11px] uppercase tracking-wide">
                    기존 조직
                  </TextCell>
                </div>
                <ul className="flex flex-col">
                  {matchedOrgs.map((org, i) => (
                    <li
                      key={org.name}
                      className={`flex items-center gap-2.5 px-3 py-2.5 cursor-pointer ${
                        i === 0 ? "bg-[#f0f7ff]" : "hover:bg-[#fafafa]"
                      }`}
                    >
                      <Folder className="w-4 h-4 text-[#0077ff]" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <TextCell bold color="#111" className="text-[13px]">
                            {org.name}
                          </TextCell>
                          <TextCell color="#7c3aed" className="text-[11px]">
                            ↔ {org.name}-cicd
                          </TextCell>
                        </div>
                        <TextCell color="#888" className="text-[11px] mt-0.5">
                          {org.hint}
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
                        + 새 조직 "{inputValue}" 만들기
                      </TextCell>
                      <TextCell color="#888" className="text-[11px] mt-0.5">
                        {inputValue}와 {inputValue}-cicd 두 조직이 동시에 생성됩니다 (4단계 적용 시)
                      </TextCell>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-[#f0f0f0]" data-annotation-id="5">
              <div className="flex items-center justify-between">
                <TextCell bold color="#111" className="text-[13px]">
                  선택된 조직 페어
                </TextCell>
                <Badge variant="primary" size="sm">
                  <Sparkles className="w-3 h-3" />
                  기존 조직 사용
                </Badge>
              </div>
              <div className="bg-[#f8f9fa] rounded-md p-4 flex items-center gap-3">
                <div className="flex-1 px-4 py-3 bg-white border border-[#e0e0e0] rounded">
                  <TextCell color="#999" className="text-[11px]">
                    소스 조직
                  </TextCell>
                  <div className="flex items-center gap-2 mt-1">
                    <TextCell bold color="#0077ff" className="text-[14px]">
                      {inputValue}
                    </TextCell>
                  </div>
                </div>
                <span className="text-[#888] text-[18px]">↔</span>
                <div className="flex-1 px-4 py-3 bg-white border border-[#e0e0e0] rounded">
                  <TextCell color="#999" className="text-[11px]">
                    배포(cicd) 조직
                  </TextCell>
                  <div className="flex items-center gap-2 mt-1">
                    <TextCell bold color="#7c3aed" className="text-[14px]">
                      {inputValue}-cicd
                    </TextCell>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FormActions
            left={<></>}
            actions={[
              { label: "취소", variant: "gray-solid" },
              { label: "다음", variant: "primary" },
            ]}
          />
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
