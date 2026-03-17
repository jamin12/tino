import { useState } from "react";
import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  HelpCircle,
  Users,
  Search,
  Plus,
  ChevronLeft,
} from "lucide-react";
import {
  Badge,
  Button,
  Checkbox,
  CcpDashboardLayout,
  ContentSection,
  Tabs,
  TextInput,
  SidebarTenantIcon,
  SidebarConnectionIcon,
  SidebarServiceMeshIcon,
  createSideMenuItems,
} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-015",
  title: "저장소 그룹 팀 편집",
  section: "GitOps 저장소 그룹",
  annotations: [
    {
      id: 1,
      label: "탭 네비게이션",
      description:
        "기본정보, 저장소, 팀 탭을 전환합니다. 현재 '팀' 탭이 활성화되어 팀 관리 뷰를 표시합니다.",
    },
    {
      id: 2,
      label: "팀 목록 패널",
      description:
        "기존 팀 목록을 좌측에 표시합니다. 현재 편집 중인 'backend-developers' 팀이 파란색 테두리로 강조 표시됩니다.",
    },
    {
      id: 3,
      label: "뒤로 가기",
      description:
        "팀 편집 폼을 닫고 팀 목록 뷰로 돌아갑니다. 저장하지 않은 변경사항은 유실됩니다.",
    },
    {
      id: 4,
      label: "팀 이름 입력",
      description:
        "팀의 이름을 수정합니다. 필수 입력 항목이며, 기존 값('backend-developers')이 미리 채워져 있습니다.",
    },
    {
      id: 5,
      label: "설명 입력",
      description:
        "팀의 목적이나 역할 설명을 수정합니다. 기존 값('백엔드 개발 팀')이 미리 채워져 있습니다.",
    },
    {
      id: 6,
      label: "접근 설정",
      description:
        "팀의 저장소 접근 범위를 변경합니다. '특정 저장소' 또는 '전체 저장소' 중 선택하며, 저장소 생성 권한을 별도로 토글할 수 있습니다. 현재 저장소 생성이 활성화되어 있습니다.",
    },
    {
      id: 7,
      label: "권한 설정",
      description:
        "팀 멤버의 권한 수준을 변경합니다. '일반 접근'은 아래 권한 테이블로 세부 제어하며, '관리자 액세스'는 풀/푸시 및 공동 작업자 추가 권한을 부여합니다.",
    },
    {
      id: 8,
      label: "저장소 섹션 접근 허용 테이블",
      description:
        "각 저장소 섹션별 접근 권한을 개별 수정합니다. 기존 설정값(코드/이슈/풀 리퀘스트는 쓰기, 릴리즈/위키 등은 읽기, 패키지는 접근 불가)이 반영되어 있습니다.",
    },
    {
      id: 9,
      label: "취소 / 저장 버튼",
      description:
        "취소 버튼은 변경사항을 폐기하고 이전 화면으로 돌아갑니다. 저장 버튼은 수정된 팀 설정을 저장합니다.",
    },
  ],
};

// ─── Team List Data ────────────────────────────────────────────────────────

interface TeamRow {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

const teamData: TeamRow[] = [
  { id: "t-001", name: "platform-admins", description: "플랫폼 관리자 팀", memberCount: 3 },
  { id: "t-002", name: "devops-team", description: "DevOps 엔지니어링 팀", memberCount: 5 },
  { id: "t-003", name: "backend-developers", description: "백엔드 개발 팀", memberCount: 12 },
  { id: "t-004", name: "frontend-developers", description: "프론트엔드 개발 팀", memberCount: 8 },
  { id: "t-005", name: "qa-team", description: "QA 및 테스트 팀", memberCount: 4 },
  { id: "t-006", name: "security-auditors", description: "보안 감사 팀", memberCount: 2 },
];

// ─── TeamListItem ──────────────────────────────────────────────────────────

function TeamListItem({ team, active }: { team: TeamRow; active: boolean }) {
  return (
    <div
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg text-left transition-all ${
        active
          ? "bg-[#0077ff0a] border border-[#0077ff] shadow-[0_0_0_1px_rgba(0,119,255,0.1)]"
          : "border border-[#eee] bg-white hover:bg-[#f8f9fb] hover:border-[#d8dde3]"
      }`}
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#f0f4f8] flex items-center justify-center">
        <Users className="w-4.5 h-4.5 text-[#5a6a7e]" />
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-[13px] font-bold truncate block ${active ? "text-[#0077ff]" : "text-[#222]"}`}>
          {team.name}
        </span>
        <span className="text-[12px] text-[#888] truncate block">{team.description}</span>
      </div>
      <span className="text-[12px] text-[#999] flex-shrink-0">{team.memberCount}명</span>
    </div>
  );
}

// ─── Permission Table Data ──────────────────────────────────────────────────

interface PermissionUnit {
  id: string;
  label: string;
  description: string;
  value: "none" | "read" | "write";
}

const defaultPermissions: PermissionUnit[] = [
  { id: "code", label: "코드", description: "소스 코드 접근 파일, 커밋 그리고 브랜치", value: "write" },
  { id: "issues", label: "이슈", description: "버그 리포트, 작업 및 마일스톤 관리.", value: "write" },
  { id: "pulls", label: "풀 리퀘스트", description: "풀 리퀘스트 및 코드 리뷰 활성화.", value: "write" },
  { id: "releases", label: "릴리즈", description: "프로젝트 버전 및 다운로드 추적.", value: "read" },
  { id: "wiki", label: "위키", description: "공동 작업자들과 문서 작성 및 공유.", value: "read" },
  { id: "projects", label: "프로젝트", description: "프로젝트 보드에서 이슈와 풀 리퀘스트 관리.", value: "read" },
  { id: "packages", label: "패키지", description: "저장소 패키지 관리.", value: "none" },
  { id: "actions", label: "액션", description: "액션 관리", value: "read" },
];

// ─── Radio 컴포넌트 ─────────────────────────────────────────────────────────

function Radio({
  name,
  value,
  checked,
  onChange,
  label,
  description,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer py-1">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="w-4 h-4 mt-0.5 accent-[#0077ff] flex-shrink-0"
      />
      <div>
        <span className="text-[13px] font-medium text-[#333]">{label}</span>
        {description && (
          <p className="text-[12px] text-[#888] mt-0.5 leading-[1.5]">{description}</p>
        )}
      </div>
    </label>
  );
}

// ─── Permission Table ───────────────────────────────────────────────────────

function PermissionTable({
  permissions,
  onChange,
}: {
  permissions: PermissionUnit[];
  onChange: (id: string, value: "none" | "read" | "write") => void;
}) {
  return (
    <div className="border border-[#e0e0e0] rounded-lg overflow-hidden">
      {/* 헤더 */}
      <div className="grid grid-cols-[1fr_120px_120px_120px] bg-[#f3f6f9] border-b border-[#e0e0e0]">
        <div className="px-4 py-2.5">
          <span className="text-[12px] font-bold text-[#333]">항목</span>
        </div>
        <div className="px-4 py-2.5 text-center">
          <span className="text-[12px] font-bold text-[#333] inline-flex items-center gap-1">
            접근 불가
            <HelpCircle className="w-3.5 h-3.5 text-[#999]" />
          </span>
        </div>
        <div className="px-4 py-2.5 text-center">
          <span className="text-[12px] font-bold text-[#333] inline-flex items-center gap-1">
            읽음
            <HelpCircle className="w-3.5 h-3.5 text-[#999]" />
          </span>
        </div>
        <div className="px-4 py-2.5 text-center">
          <span className="text-[12px] font-bold text-[#333] inline-flex items-center gap-1">
            쓰기
            <HelpCircle className="w-3.5 h-3.5 text-[#999]" />
          </span>
        </div>
      </div>

      {/* 행 */}
      {permissions.map((unit, idx) => (
        <div
          key={unit.id}
          className={`grid grid-cols-[1fr_120px_120px_120px] items-center ${
            idx !== permissions.length - 1 ? "border-b border-[#f0f0f0]" : ""
          } hover:bg-[#fafbfc] transition-colors`}
        >
          <div className="px-4 py-3">
            <span className="text-[13px] font-bold text-[#333]">{unit.label}</span>
            <span className="text-[12px] text-[#888] ml-1.5">{unit.description}</span>
          </div>
          <div className="flex justify-center">
            <input
              type="radio"
              name={`perm-${unit.id}`}
              checked={unit.value === "none"}
              onChange={() => onChange(unit.id, "none")}
              className="w-4 h-4 accent-[#0077ff] cursor-pointer"
            />
          </div>
          <div className="flex justify-center">
            <input
              type="radio"
              name={`perm-${unit.id}`}
              checked={unit.value === "read"}
              onChange={() => onChange(unit.id, "read")}
              className="w-4 h-4 accent-[#0077ff] cursor-pointer"
            />
          </div>
          <div className="flex justify-center">
            <input
              type="radio"
              name={`perm-${unit.id}`}
              checked={unit.value === "write"}
              onChange={() => onChange(unit.id, "write")}
              className="w-4 h-4 accent-[#0077ff] cursor-pointer"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Slide05RepositoryGroupEditTeam() {
  const [repoAccess, setRepoAccess] = useState("specific");
  const [createRepo, setCreateRepo] = useState(true);
  const [permissionType, setPermissionType] = useState("general");
  const [permissions, setPermissions] = useState<PermissionUnit[]>(defaultPermissions);

  const handlePermissionChange = (id: string, value: "none" | "read" | "write") => {
    setPermissions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, value } : p))
    );
  };

  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "GitOps" },
        { label: "저장소 그룹", isBold: true },
      ]}
      title={
        <span className="inline-flex items-center gap-2">
          <span>app-cicd</span>
          <Badge variant="neutral">Private</Badge>
        </span>
      }
      sideMenuItems={createSideMenuItems({ activeId: "gitops", activeLabel: "저장소 그룹" })}
    >
      {/* 탭 */}
      <ContentSection>
        <div data-annotation-id="1">
        <Tabs
          items={[
            { id: "basic", label: "기본정보" },
            { id: "repos", label: "저장소" },
            { id: "teams", label: "팀" },
          ]}
          activeId="teams"
          className="mb-0"
        />
        </div>
      </ContentSection>

      {/* 팀 목록 + 팀 편집 폼 */}
      <ContentSection spacing="md">
        <div className="flex gap-5 items-start">

          {/* ── 좌측: 팀 목록 ──────────────────────────── */}
          <div className="w-[280px] flex-shrink-0 space-y-2" data-annotation-id="2">
            <div className="flex items-center justify-between mb-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#999]" />
                <input
                  type="text"
                  placeholder="팀 검색"
                  className="w-full h-[32px] pl-8 pr-3 text-[13px] text-[#333] bg-white rounded border border-[#ddd] outline-none placeholder:text-[#999] focus:border-[#0077ff]"
                />
              </div>
              <Button size="sm" variant="primary" className="ml-2">
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
            {teamData.map((team) => (
              <TeamListItem key={team.id} team={team} active={team.id === "t-003"} />
            ))}
          </div>

          {/* ── 우측: 팀 편집 폼 ──────────────────────────── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#f0f0f0] text-[#555] cursor-pointer"
                title="뒤로"
                data-annotation-id="3"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-[15px] font-bold text-[#111]">backend-developers 팀 편집</h3>
            </div>

            <div className="bg-white rounded-sm shadow-[0px_0px_8px_rgba(0,0,0,0.08)] px-5 py-4 flex flex-col gap-5">

              {/* ── 팀 이름 ────────────────────────────────── */}
              <div data-annotation-id="4">
                <label className="block text-[13px] font-bold text-[#333] mb-1.5">
                  팀 이름<span className="text-[#da1e28] ml-0.5">*</span>
                </label>
                <TextInput placeholder="" defaultValue="backend-developers" className="w-full" />
                <p className="text-[12px] text-[#888] mt-1">
                  팀 이름은 짧고 기억하기 쉬워야 합니다.
                </p>
              </div>

              {/* ── 설명 ──────────────────────────────────── */}
              <div data-annotation-id="5">
                <label className="block text-[13px] font-bold text-[#333] mb-1.5">
                  설명
                </label>
                <TextInput placeholder="" defaultValue="백엔드 개발 팀" className="w-full" />
                <p className="text-[12px] text-[#888] mt-1">
                  팀의 목적이나 역할을 설명하세요.
                </p>
              </div>

              {/* ── 구분선 ─────────────────────────────────── */}
              <div className="border-t border-[#f0f0f0]" />

              {/* ── 접근 ─────────────────────── */}
              <div data-annotation-id="6">
                <h3 className="text-[13px] font-bold text-[#333] mb-3">접근</h3>
                <div className="flex flex-col gap-1.5">
                  <Radio
                    name="repo-access"
                    value="specific"
                    checked={repoAccess === "specific"}
                    onChange={setRepoAccess}
                    label="특정 저장소"
                    description="멤버는 팀에 명시적으로 추가된 저장소에만 접근할 수 있습니다. 이 옵션을 선택해도 '전체 저장소'로 이미 추가된 저장소는 자동으로 제거되지 않습니다."
                  />
                  <Radio
                    name="repo-access"
                    value="all"
                    checked={repoAccess === "all"}
                    onChange={setRepoAccess}
                    label="전체 저장소"
                    description="팀이 모든 저장소에 접근할 수 있습니다. 이 옵션을 선택하면 기존의 모든 저장소가 팀에 추가됩니다."
                  />
                  <div className="mt-2 ml-0.5">
                    <Checkbox
                      label="저장소 생성"
                      checked={createRepo}
                      onChange={() => setCreateRepo(!createRepo)}
                    />
                    <p className="text-[12px] text-[#888] mt-0.5 ml-6">
                      멤버가 조직 내에 새 저장소를 생성할 수 있습니다. 생성자는 새 저장소에 대한 관리자 권한을 부여받습니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* ── 구분선 ─────────────────────────────────── */}
              <div className="border-t border-[#f0f0f0]" />

              {/* ── 권한 ──────────────────────────────────── */}
              <div data-annotation-id="7">
                <h3 className="text-[13px] font-bold text-[#333] mb-3">권한</h3>
                <div className="flex flex-col gap-1.5">
                  <Radio
                    name="permission-type"
                    value="general"
                    checked={permissionType === "general"}
                    onChange={setPermissionType}
                    label="일반 접근"
                    description="멤버의 권한은 아래 권한 테이블에 의해 결정됩니다."
                  />
                  <Radio
                    name="permission-type"
                    value="admin"
                    checked={permissionType === "admin"}
                    onChange={setPermissionType}
                    label="관리자 액세스"
                    description="멤버가 팀 저장소에 풀/푸시할 수 있으며, 공동 작업자를 추가할 수 있습니다."
                  />
                </div>
              </div>

              {/* ── 구분선 ─────────────────────────────────── */}
              <div className="border-t border-[#f0f0f0]" />

              {/* ── 저장소 섹션 접근 허용 ───── */}
              <div data-annotation-id="8">
                <h3 className="text-[13px] font-bold text-[#333] mb-1">
                  저장소 섹션 접근 허용
                  <span className="text-[#da1e28] ml-0.5">*</span>
                </h3>
                <div className="mt-3">
                  <PermissionTable
                    permissions={permissions}
                    onChange={handlePermissionChange}
                  />
                </div>
              </div>

              {/* ── 하단 버튼 ─────────────────────────────── */}
              <div className="flex items-center justify-end gap-1 pt-2" data-annotation-id="9">
                <Button variant="gray-solid" size="md">취소</Button>
                <Button variant="primary" size="md">저장</Button>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>
    </CcpDashboardLayout>
  );
}
