import {
  CcpDashboardLayout,
  ContentSection,
  Button,
  Toggle,
  TextInput,
  SidebarDashboardIcon,
  SidebarNamespaceIcon,
  SidebarApplicationIcon,
  SidebarCicdIcon,
  SidebarSettingsIcon,
  SidebarGitopsIcon,
} from "../_components";
import type { SideMenuItem } from "../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-SET-001",
  title: "시스템 설정",
  section: "설정/권한",
  links: [],
  annotations: [
    {
      id: 1,
      label: "일반 설정 섹션",
      description:
        "세션 타임아웃 등 시스템 전반의 기본 동작을 제어하는 설정 그룹입니다.",
    },
    {
      id: 2,
      label: "세션 타임아웃 입력",
      description:
        "비활동 시 자동 로그아웃까지의 시간을 분 단위로 지정합니다. 보안 정책에 따라 적절한 값을 설정해야 합니다.",
    },
    {
      id: 3,
      label: "GitOps 설정 섹션",
      description:
        "GitOps 자동 동기화, 동기화 주기, 롤백 히스토리 등 GitOps 관련 동작을 제어하는 설정 그룹입니다.",
    },
    {
      id: 4,
      label: "GitOps 자동 동기화 토글",
      description:
        "활성화 시 Git 저장소 변경이 감지되면 클러스터에 자동으로 동기화합니다. 비활성화 시 수동 동기화만 가능합니다.",
    },
    {
      id: 5,
      label: "동기화 주기 입력",
      description:
        "자동 동기화가 활성화된 경우 Git 저장소를 폴링하는 간격을 초 단위로 설정합니다.",
    },
    {
      id: 6,
      label: "롤백 히스토리 입력",
      description:
        "앱별로 보관할 롤백 가능 리비전의 최대 개수를 지정합니다. 이 값을 초과하면 오래된 리비전부터 삭제됩니다.",
    },
    {
      id: 7,
      label: "보안 설정 섹션",
      description:
        "감사 로그 활성화 및 보관 기간 등 보안 관련 설정을 관리하는 그룹입니다.",
    },
    {
      id: 8,
      label: "감사 로그 토글",
      description:
        "활성화 시 사용자 활동 및 시스템 변경 사항을 기록합니다. 컴플라이언스 및 보안 감사에 필요합니다.",
    },
    {
      id: 9,
      label: "감사 로그 보관 기간 입력",
      description:
        "감사 로그를 자동 삭제 없이 보관하는 기간을 일 단위로 설정합니다.",
    },
    {
      id: 10,
      label: "초기화 버튼",
      description:
        "변경한 설정 값을 저장하기 전 기본값으로 되돌립니다.",
    },
    {
      id: 11,
      label: "설정 저장 버튼",
      description:
        "현재 화면에서 수정한 모든 설정 값을 서버에 반영합니다.",
    },
  ],
};

// ─── Side Menu ──────────────────────────────────────────────────────────────

const sideMenuItems: SideMenuItem[] = [
  {
    id: "dashboard",
    label: "대시보드",
    icon: <SidebarDashboardIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "namespace",
    label: "네임스페이스",
    icon: <SidebarNamespaceIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "application",
    label: "애플리케이션",
    icon: <SidebarApplicationIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "cicd",
    label: "CI/CD",
    icon: <SidebarCicdIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "gitops",
    label: "GitOps",
    icon: <SidebarGitopsIcon className="w-5 h-5" />,
    expandIcon: "plus",
  },
  {
    id: "settings",
    label: "설정/권한",
    icon: <SidebarSettingsIcon className="w-5 h-5" />,
    active: true,
    expanded: true,
    expandIcon: "minus",
    sections: [
      {
        label: "",
        items: [
          { label: "조직 관리" },
          { label: "프로젝트 관리" },
          { label: "멤버 관리" },
          { label: "시스템 설정", active: true },
        ],
      },
    ],
  },
];

// ─── 폼 행 (label : value) ──────────────────────────────────────────────────

function FormRow({
  label,
  children,
  description,
}: {
  label: string;
  children: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="flex items-start py-3 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-[#f0f0f0]">
      <div className="w-[180px] flex-shrink-0 pt-1">
        <span className="text-[13px] font-medium text-[#333]">{label}</span>
        {description && (
          <p className="text-[11px] text-[#999] mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Slide01SystemSettings() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "설정/권한" },
        { label: "시스템 설정" },
      ]}
      title="시스템 설정"
      sideMenuItems={sideMenuItems}
    >
      <ContentSection spacing="md">
        <div className="space-y-5">
          {/* 일반 설정 */}
          <div data-annotation-id="1" className="bg-white rounded-lg border border-[#e0e0e0] p-5">
            <h3 className="text-[14px] font-bold text-[#333] mb-3">일반 설정</h3>
            <div className="space-y-0">
              <FormRow label="세션 타임아웃" description="비활동 시 자동 로그아웃 (분)">
                <div data-annotation-id="2" className="flex items-center gap-2">
                  <TextInput type="number" defaultValue="30" className="w-[100px]" />
                  <span className="text-[13px] text-[#888]">분</span>
                </div>
              </FormRow>
            </div>
          </div>

          {/* GitOps 설정 */}
          <div data-annotation-id="3" className="bg-white rounded-lg border border-[#e0e0e0] p-5">
            <h3 className="text-[14px] font-bold text-[#333] mb-3">GitOps 설정</h3>
            <div className="space-y-0">
              <FormRow label="GitOps 자동 동기화" description="Git 변경 시 자동 클러스터 동기화">
                <div data-annotation-id="4"><Toggle checked={true} /></div>
              </FormRow>
              <FormRow label="동기화 주기" description="자동 동기화 간격">
                <div data-annotation-id="5" className="flex items-center gap-2">
                  <TextInput type="number" defaultValue="180" className="w-[100px]" />
                  <span className="text-[13px] text-[#888]">초</span>
                </div>
              </FormRow>
              <FormRow label="롤백 히스토리" description="앱별 롤백 가능 최대 리비전 수">
                <div data-annotation-id="6" className="flex items-center gap-2">
                  <TextInput type="number" defaultValue="10" className="w-[100px]" />
                  <span className="text-[13px] text-[#888]">개</span>
                </div>
              </FormRow>
            </div>
          </div>

          {/* 보안 설정 */}
          <div data-annotation-id="7" className="bg-white rounded-lg border border-[#e0e0e0] p-5">
            <h3 className="text-[14px] font-bold text-[#333] mb-3">보안 설정</h3>
            <div className="space-y-0">
              <FormRow label="감사 로그" description="사용자 활동 및 변경 사항 기록">
                <div data-annotation-id="8"><Toggle checked={true} /></div>
              </FormRow>
              <FormRow label="감사 로그 보관" description="자동 삭제까지의 보관 기간">
                <div data-annotation-id="9" className="flex items-center gap-2">
                  <TextInput type="number" defaultValue="90" className="w-[100px]" />
                  <span className="text-[13px] text-[#888]">일</span>
                </div>
              </FormRow>
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="flex justify-end gap-2 mt-1">
            <Button data-annotation-id="10" size="md" variant="ghost">초기화</Button>
            <Button data-annotation-id="11" size="md" variant="primary">설정 저장</Button>
          </div>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
