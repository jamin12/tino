import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  ChevronLeft,
} from "lucide-react";
import {
  Button,
  CcpDashboardLayout,
  ContentSection,
  InfoRow,
  Select,
  Tabs,
  Toggle,
  SidebarTenantIcon,
  SidebarConnectionIcon,
  SidebarServiceMeshIcon,
  createSideMenuItems,
} from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-030",
  title: "소스 저장소 상세 (웹훅 추가)",
  section: "GitOps 소스 저장소",
  annotations: [
    {
      id: 1,
      label: "설정 탭 (웹훅)",
      description:
        "설정 탭의 웹훅 하위 메뉴가 활성화된 상태에서 웹훅 추가 폼을 표시합니다.",
    },
    {
      id: 2,
      label: "뒤로가기",
      description:
        "웹훅 목록(CCP-GIT-029) 화면으로 돌아갑니다.",
    },
    {
      id: 3,
      label: "타입 선택",
      description:
        "웹훅 타입을 선택합니다. Gitea, Slack, Discord, DingTalk 등 다양한 타입을 지원합니다. 필수 입력 항목입니다.",
    },
    {
      id: 4,
      label: "대상 URL",
      description:
        "웹훅 이벤트를 수신할 대상 엔드포인트 URL을 입력합니다. 필수 입력 항목입니다.",
    },
    {
      id: 5,
      label: "HTTP Method",
      description:
        "웹훅 호출 시 사용할 HTTP 메서드를 선택합니다. POST, GET, PUT, DELETE를 지원합니다.",
    },
    {
      id: 6,
      label: "Content Type",
      description:
        "웹훅 페이로드의 콘텐츠 타입을 지정합니다. JSON 또는 Form URL 인코딩을 선택할 수 있습니다.",
    },
    {
      id: 7,
      label: "비밀",
      description:
        "웹훅 서명 검증에 사용할 시크릿 키를 설정합니다. 선택사항이며, 설정 시 수신 측에서 페이로드 무결성을 검증할 수 있습니다.",
    },
    {
      id: 8,
      label: "트리거 이벤트",
      description:
        "웹훅을 트리거할 이벤트를 선택합니다. 현재 '푸시' 이벤트가 체크되어 있으며, 필요한 이벤트를 추가로 선택할 수 있습니다.",
    },
    {
      id: 9,
      label: "Branch filter",
      description:
        "웹훅이 반응할 브랜치를 glob 패턴으로 지정합니다. 비어있거나 '*'이면 모든 브랜치의 이벤트가 전송됩니다.",
    },
    {
      id: 10,
      label: "Authorization Header",
      description:
        "웹훅 요청에 포함할 Authorization 헤더 값을 설정합니다. Bearer 토큰 등의 인증 정보를 입력합니다.",
    },
    {
      id: 11,
      label: "활성 토글",
      description:
        "웹훅의 활성/비활성 상태를 전환합니다. 비활성화하면 이벤트 발생 시 웹훅이 호출되지 않습니다.",
    },
    {
      id: 12,
      label: "하단 액션 버튼",
      description:
        "취소 버튼은 변경사항을 폐기하고 목록으로 돌아갑니다. '웹훅 추가' 버튼은 입력한 정보로 새 웹훅을 등록합니다.",
    },
  ],
};

// ─── Event Options ──────────────────────────────────────────────────────────

interface TriggerEvent {
  label: string;
  description: string;
  checked: boolean;
}

const triggerEvents: TriggerEvent[] = [
  { label: "푸시", description: "저장소로 푸시", checked: true },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide11SourceRepositoryDetailWebhookAdd() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "GitOps" },
        { label: "소스 저장소", isBold: true },
      ]}
      title="app1-backend"
      sideMenuItems={createSideMenuItems({ activeId: "gitops", activeLabel: "소스 저장소" })}
    >
      <ContentSection>
        <div data-annotation-id="1">
        <Tabs
          items={[
            { id: "basic", label: "기본정보" },
            { id: "files", label: "파일" },
            { id: "branches", label: "브랜치/태그" },
            { id: "commits", label: "커밋 이력" },
            { id: "settings", label: "설정" },
          ]}
          activeId="settings"
          className="mb-0"
        />
        </div>
      </ContentSection>

      <ContentSection>
        {/* 설정 하위 메뉴 */}
        <div className="flex gap-2 mb-4">
          {["일반", "웹훅"].map((item) => (
            <button
              key={item}
              type="button"
              className={`px-3 py-1.5 text-[13px] rounded border ${
                item === "웹훅"
                  ? "bg-[#0077ff] text-white border-[#0077ff] font-semibold"
                  : "bg-white text-[#555] border-[#ddd] hover:bg-[#f6f8fa]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </ContentSection>

      <ContentSection>
        <div className="flex items-center gap-2 mb-4">
          <button
            data-annotation-id="2"
            type="button"
            className="flex items-center justify-center w-7 h-7 rounded hover:bg-[#f0f0f0] text-[#555]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-[14px] font-semibold text-[#333]">
            웹훅 추가
          </h3>
        </div>

        <div className="bg-white border border-[#e0e0e0] rounded-lg p-5 space-y-5">
          {/* 타입 */}
          <InfoRow
            label={
              <span>
                타입<span className="text-[#da1e28]">*</span>
              </span>
            }
            labelWidth="140px"
          >
            <div data-annotation-id="3">
            <Select
              label=""
              options={[
                { value: "gitea", label: "Gitea" },
                { value: "slack", label: "Slack" },
                { value: "discord", label: "Discord" },
                { value: "dingtalk", label: "DingTalk" },
                { value: "telegram", label: "Telegram" },
                { value: "msteams", label: "Microsoft Teams" },
                { value: "feishu", label: "Feishu" },
                { value: "wechatwork", label: "WeChatWork" },
                { value: "packagist", label: "Packagist" },
              ]}
            />
            </div>
          </InfoRow>

          {/* 대상 URL */}
          <InfoRow
            label={
              <span>
                대상 URL<span className="text-[#da1e28]">*</span>
              </span>
            }
            labelWidth="140px"
          >
            <input
              data-annotation-id="4"
              type="text"
              placeholder="http://..."
              className="w-full border border-[#ddd] rounded px-3 py-1.5 text-[13px] text-[#333] bg-white"
            />
          </InfoRow>

          {/* HTTP Method */}
          <InfoRow label="HTTP Method" labelWidth="140px">
            <div data-annotation-id="5">
            <Select
              label=""
              options={[
                { value: "POST", label: "POST" },
                { value: "GET", label: "GET" },
                { value: "PUT", label: "PUT" },
                { value: "DELETE", label: "DELETE" },
              ]}
            />
            </div>
          </InfoRow>

          {/* Content Type */}
          <InfoRow label="Content Type" labelWidth="140px">
            <div data-annotation-id="6">
            <Select
              label=""
              options={[
                { value: "json", label: "application/json" },
                { value: "form", label: "application/x-www-form-urlencoded" },
              ]}
            />
            </div>
          </InfoRow>

          {/* 비밀 */}
          <InfoRow label="비밀" labelWidth="140px">
            <input
              data-annotation-id="7"
              type="password"
              placeholder="선택사항"
              className="w-full border border-[#ddd] rounded px-3 py-1.5 text-[13px] text-[#333] bg-white"
            />
          </InfoRow>

          <div className="border-t border-[#e5e5e5]" />

          {/* 트리거 이벤트 */}
          <div data-annotation-id="8">
            <span className="text-[13px] font-semibold text-[#333] mb-3 block">
              트리거 이벤트
            </span>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
              {triggerEvents.map((event) => (
                <label key={event.label} className="flex items-start gap-2.5 cursor-pointer py-1.5">
                  <input
                    type="checkbox"
                    defaultChecked={event.checked}
                    className="w-3.5 h-3.5 rounded border-[#ccc] text-[#0077ff] accent-[#0077ff] mt-0.5 shrink-0"
                  />
                  <div>
                    <span className="text-[13px] font-medium text-[#333] block">{event.label}</span>
                    <span className="text-[11px] text-[#888] block leading-snug">{event.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-[#e5e5e5]" />

          {/* Branch filter */}
          <InfoRow label="Branch filter" labelWidth="140px">
            <div data-annotation-id="9">
              <input
                type="text"
                defaultValue="dev"
                className="w-full border border-[#ddd] rounded px-3 py-1.5 text-[13px] text-[#333] bg-white font-mono"
              />
              <p className="text-[11px] text-[#999] mt-1.5 leading-relaxed">
                Branch whitelist for push, branch creation and branch deletion
                events, specified as glob pattern. If empty or *, events for all
                branches are reported.
              </p>
            </div>
          </InfoRow>

          {/* Authorization Header */}
          <InfoRow label="Authorization Header" labelWidth="140px">
            <input
              data-annotation-id="10"
              type="text"
              placeholder="Bearer token123456"
              className="w-full border border-[#ddd] rounded px-3 py-1.5 text-[13px] text-[#333] bg-white"
            />
          </InfoRow>

          <div className="border-t border-[#e5e5e5]" />

          {/* 활성화 */}
          <InfoRow label="활성" labelWidth="140px">
            <div data-annotation-id="11">
            <Toggle checked={true} />
            </div>
          </InfoRow>
        </div>
      </ContentSection>

      {/* Bottom action bar */}
      <div data-annotation-id="12" className="sticky bottom-0 left-0 right-0 px-8 py-3 flex justify-end gap-2 mt-4">
        <Button variant="ghost" size="md">
          취소
        </Button>
        <Button variant="primary" size="md">
          웹훅 추가
        </Button>
      </div>
    </CcpDashboardLayout>
  );
}
