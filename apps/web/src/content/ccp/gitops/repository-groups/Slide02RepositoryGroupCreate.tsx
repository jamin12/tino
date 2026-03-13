import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
} from "lucide-react";
import { useState } from "react";
import {
  Button,
  Checkbox,
  CcpDashboardLayout,
  ContentSection,
  InfoRow,
  TextInput,
  Tooltip,
} from "../../_components";
import type { SideMenuItem } from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-012",
  title: "저장소 그룹 생성",
  section: "GitOps 저장소 그룹",
  annotations: [
    {
      id: 1,
      label: "그룹 이름 입력",
      description:
        "저장소 그룹의 이름을 입력합니다. 영숫자, 하이픈(-), 밑줄(_), 마침표(.)만 사용 가능하며, 비영숫자로 시작하거나 끝날 수 없습니다. 입력 시 유효성 검증 툴팁이 표시됩니다.",
    },
    {
      id: 2,
      label: "공개 범위 선택",
      description:
        "그룹의 접근 범위를 공개, 제한(인증된 사용자만), 비공개(구성원만) 중 하나로 선택합니다. 기본값은 '비공개'이며, 선택에 따라 그룹 접근 가능 대상이 달라집니다.",
    },
    {
      id: 3,
      label: "팀 액세스 권한",
      description:
        "저장소 관리자가 팀에 대한 액세스 권한을 추가하거나 제거할 수 있는지 여부를 설정합니다. 기본적으로 활성화되어 있습니다.",
    },
    {
      id: 4,
      label: "취소 버튼",
      description:
        "그룹 생성을 취소하고 이전 화면(저장소 그룹 목록)으로 돌아갑니다. 입력한 내용은 저장되지 않습니다.",
    },
    {
      id: 5,
      label: "생성 버튼",
      description:
        "입력된 정보로 새 저장소 그룹을 생성합니다. 필수 입력값(그룹 이름)이 유효해야 활성화됩니다.",
    },
  ],
};

// ─── Side Menu Data ─────────────────────────────────────────────────────────

const sideMenuItems: SideMenuItem[] = [
  {
    id: "dashboard",
    label: "대시보드",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    id: "namespace",
    label: "네임스페이스",
    icon: <Layers className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "application",
    label: "애플리케이션",
    icon: <AppWindow className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "cicd",
    label: "CI/CD",
    icon: <GitBranch className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "gitops",
    label: "GitOps",
    icon: <GitCompare className="w-5 h-5" />,
    active: true,
    expanded: true,
    expandIcon: "minus",
    sections: [
      {
        label: "",
        items: [
          { label: "배포 애플리케이션" },
          { label: "배포 저장소" },
          { label: "소스 저장소" },
          { label: "저장소 그룹", active: true, bold: true },
        ],
      },
    ],
  },
  {
    id: "settings",
    label: "설정/권한",
    icon: <Settings className="w-5 h-5" />,
    expandIcon: "plus",
  },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide12RepositoryGroupCreate() {
  const [visibility, setVisibility] = useState<string>("private");

  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "GitOps" },
        { label: "저장소 그룹", isBold: true },
      ]}
      title="저장소 그룹 생성"
      sideMenuItems={sideMenuItems}
    >
      <ContentSection spacing="sm">
        <div className="bg-white rounded-sm shadow-[0px_0px_8px_rgba(0,0,0,0.08)] px-5 py-4 flex flex-col gap-5">
          {/* 그룹 이름 */}
          <div data-annotation-id="1">
          <InfoRow label="그룹 이름" labelWidth="120px">
            <div className="relative flex-1">
              <TextInput
                placeholder="영숫자, 하이픈(-), 밑줄(_), 마침표(.)만 사용"
                className="w-full"
              />
              <Tooltip className="absolute top-9 left-0 z-10">
                영숫자('0-9', 'a-z', 'A-Z'), 하이픈(-), 밑줄(_),
                마침표(.)만 사용할 수 있습니다.
                <br />
                비영숫자로 시작하거나 끝날 수 없으며, 연속된 비영숫자도
                허용되지 않습니다.
              </Tooltip>
            </div>
          </InfoRow>

          </div>

          <div className="text-[12px] text-[#888888] tracking-[-0.12px] -mt-3 ml-[132px]">
            저장소 그룹 이름은 짧고 기억하기 쉬워야 합니다.
          </div>

          {/* Divider */}
          <div className="border-t border-[#f0f0f0]" />

          {/* 공개 범위 */}
          <div data-annotation-id="2">
          <InfoRow label="공개 범위" labelWidth="120px" className="items-start">
            <div className="flex flex-col gap-2.5 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === "public"}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-4 h-4 accent-[#0077ff]"
                />
                <span className="text-[13px] text-[#333333] tracking-[-0.13px]">
                  공개
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="limited"
                  checked={visibility === "limited"}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-4 h-4 accent-[#0077ff]"
                />
                <span className="text-[13px] text-[#333333] tracking-[-0.13px]">
                  제한
                </span>
                <span className="text-[12px] text-[#888888] tracking-[-0.12px]">
                  (인증된 사용자만 볼 수 있음)
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === "private"}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-4 h-4 accent-[#0077ff]"
                />
                <span className="text-[13px] text-[#333333] tracking-[-0.13px]">
                  비공개
                </span>
                <span className="text-[12px] text-[#888888] tracking-[-0.12px]">
                  (저장소 그룹 구성원만 볼 수 있음)
                </span>
              </label>
            </div>
          </InfoRow>
          </div>

          {/* Divider */}
          <div className="border-t border-[#f0f0f0]" />

          {/* 권한 */}
          <div data-annotation-id="3">
          <InfoRow label="권한" labelWidth="120px">
            <Checkbox
              label="저장소 관리자는 팀에 대한 액세스 권한을 추가하거나 제거할 수 있습니다."
              defaultChecked
            />
          </InfoRow>
          </div>

        </div>
      </ContentSection>

      {/* 하단 고정 버튼 */}
      <ContentSection spacing="sm" className="absolute bottom-0 left-0 right-0 mx-0 px-8 py-3">
        <div className="flex items-center justify-end gap-1">
          <Button variant="gray-solid" size="md" data-annotation-id="4">취소</Button>
          <Button variant="primary" size="md" data-annotation-id="5">생성</Button>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
