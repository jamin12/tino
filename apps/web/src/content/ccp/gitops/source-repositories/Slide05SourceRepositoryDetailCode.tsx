import {
  LayoutDashboard,
  Layers,
  AppWindow,
  GitBranch,
  Settings,
  GitCompare,
  Folder,
  FileText,
  Pencil,
  Eye,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  ContentSection,
  CodeEditor,
  SplitPanel,
  Tabs,
  ContextMenu,
  Overlay,
} from "../../_components";
import type { SideMenuItem, ContextMenuEntry } from "../../_components";
import type { SlideMeta } from "@entities/document";

export const slideMeta: SlideMeta = {
  screenId: "CCP-GIT-023",
  title: "소스 저장소 상세 (파일)",
  section: "GitOps 소스 저장소",
  annotations: [
    {
      id: 1,
      label: "탭 내비게이션",
      description:
        "소스 저장소 상세의 하위 탭입니다. 기본정보, 파일, 브랜치/태그, 커밋 이력, 설정으로 구성되며, 현재 '파일' 탭이 활성화되어 소스 코드 브라우징 화면을 표시합니다.",
    },
    {
      id: 2,
      label: "브랜치 · 커밋 정보",
      description:
        "현재 선택된 브랜치(main)와 최근 커밋 해시, 작성자, 메시지를 표시합니다. 브랜치 배지를 클릭하면 다른 브랜치로 전환할 수 있습니다.",
    },
    {
      id: 3,
      label: "파일 트리",
      description:
        "저장소의 디렉토리 구조를 트리 형태로 탐색합니다. 폴더를 펼치면 하위 파일이 표시되며, 파일을 클릭하면 우측 코드 뷰어에 내용이 로드됩니다. 각 항목에 마지막 변경 시간이 함께 표시됩니다.",
    },
    {
      id: 4,
      label: "코드 뷰어 (Read Only)",
      description:
        "선택한 파일의 소스 코드를 구문 강조(Syntax Highlighting)와 줄 번호와 함께 읽기 전용으로 표시합니다. 상단에 파일 경로가 breadcrumb 형태로 나타납니다.\n!!!* 소스 저장소에 직접 커밋 & 푸시 기능은 없습니다.!!!",
    },
    {
      id: 5,
      label: "더보기 메뉴",
      description:
        "저장소 그룹에 대한 추가 작업을 수행할 수 있는 컨텍스트 메뉴를 표시합니다.",
    },
    {
      id: 6,
      label: "컨텍스트 메뉴",
      description:
        "더보기 아이콘 클릭 시 표시되는 팝업 메뉴입니다.\n• 저장소 그룹 편집: 저장소 그룹의 이름, 설명 등을 수정합니다.\n• 저장소 그룹 삭제: 저장소 그룹을 삭제합니다. 그룹 내 저장소가 존재하면 삭제할 수 없습니다.",
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
          { label: "소스 저장소", active: true, bold: true },
          { label: "저장소 그룹" },
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

// ─── Context Menu ───────────────────────────────────────────────────────────

const repoGroupContextMenu: ContextMenuEntry[] = [
  { id: "settings", label: "설정", icon: <Settings className="w-4 h-4" /> },
  { id: "divider", type: "divider" },
  {
    id: "delete",
    label: "삭제",
    icon: <Trash2 className="w-4 h-4" />,
    textColor: "text-[#da1e28]",
  },
];

// ─── Code Sample ────────────────────────────────────────────────────────────

const sampleCode = `package com.example.app1.controller;

import com.example.app1.dto.UserResponse;
import com.example.app1.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(
            @PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @RequestBody CreateUserRequest request) {
        return ResponseEntity.ok(userService.create(request));
    }
}`;

// ─── File Tree ──────────────────────────────────────────────────────────────

interface FileTreeItem {
  name: string;
  type: "folder" | "file";
  active?: boolean;
  indent?: number;
  date: string;
}

const fileTree: FileTreeItem[] = [
  { name: "src", type: "folder", indent: 0, date: "2일 전" },
  { name: "main", type: "folder", indent: 1, date: "2일 전" },
  { name: "java", type: "folder", indent: 2, date: "2일 전" },
  { name: "com.example.app1", type: "folder", indent: 3, date: "2일 전" },
  { name: "controller", type: "folder", indent: 4, date: "2일 전" },
  {
    name: "UserController.java",
    type: "file",
    active: true,
    indent: 5,
    date: "2일 전",
  },
  { name: "service", type: "folder", indent: 4, date: "3일 전" },
  { name: "dto", type: "folder", indent: 4, date: "3일 전" },
  { name: "resources", type: "folder", indent: 2, date: "5일 전" },
  { name: "test", type: "folder", indent: 1, date: "1주 전" },
  { name: "build.gradle", type: "file", indent: 0, date: "1주 전" },
  { name: "Dockerfile", type: "file", indent: 0, date: "5일 전" },
  { name: "README.md", type: "file", indent: 0, date: "3일 전" },
];

// ─── Slide ──────────────────────────────────────────────────────────────────

export default function Slide05SourceRepositoryDetailCode() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "홈" },
        { label: "GitOps" },
        { label: "소스 저장소", isBold: true },
      ]}
      title="app1-backend"
      sideMenuItems={sideMenuItems}
      headerActions={
        <button
          data-annotation-id="5"
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#f0f0f0] text-[#666]"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      }
      overlay={
        <Overlay data-annotation-id="6" top={100} right={80}>
          <ContextMenu items={repoGroupContextMenu} className="w-[200px]" />
        </Overlay>
      }
    >
      <ContentSection>
        <Tabs
          data-annotation-id="1"
          items={[
            { id: "basic", label: "기본정보" },
            { id: "files", label: "파일" },
            { id: "branches", label: "브랜치/태그" },
            { id: "commits", label: "커밋 이력" },
            { id: "settings", label: "설정" },
          ]}
          activeId="files"
          className="mb-0"
        />
      </ContentSection>

      <ContentSection>
        {/* Branch & commit info */}
        <div data-annotation-id="2" className="flex items-center gap-3 mb-3">
          <Badge variant="neutral" className="!px-3 !py-1">
            <GitBranch className="w-3 h-3 mr-1" />
            main
          </Badge>
          <div className="flex items-center gap-2 text-[12px] text-[#555]">
            <span className="font-semibold text-[#333]">cicdmanager</span>
            <Badge variant="neutral" className="!text-[11px] !px-1.5 font-mono">
              5628ab1c8b
            </Badge>
            <span>Initial commit from template</span>
            <span className="text-[#999]">· 17시간 전</span>
          </div>
        </div>

        {/* File tree + Code viewer */}
        <SplitPanel
          leftWidth="240px"
          height="520px"
          left={
            <div data-annotation-id="3" className="border border-[#e0e0e0] rounded bg-white h-full overflow-auto">
              {fileTree.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-[13px] border-b border-[#f0f0f0] ${
                    item.active
                      ? "bg-[#e8f0fe] text-[#0077ff] font-semibold"
                      : "text-[#333] hover:bg-[#f6f8fa]"
                  }`}
                  style={{ paddingLeft: `${12 + (item.indent || 0) * 16}px` }}
                >
                  {item.type === "folder" ? (
                    <Folder className="w-4 h-4 text-[#dea600] shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 text-[#666] shrink-0" />
                  )}
                  <span className="flex-1 truncate">{item.name}</span>
                  <span className="text-[11px] text-[#999] shrink-0">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          }
          right={
            <div data-annotation-id="4" className="flex flex-col h-full">
              {/* File tab header */}
              <div className="flex items-center justify-between px-3 py-2 bg-[#f6f8fa] border border-[#e0e0e0] rounded-t">
                <div className="flex items-center gap-2 text-[13px] text-[#555]">
                  <span>src/main/java/com/example/app1/controller</span>
                  <span className="text-[#999]">/</span>
                  <span className="font-semibold text-[#333]">
                    UserController.java
                  </span>
                </div>
              </div>
              {/* Code editor */}
              <CodeEditor
                code={sampleCode}
                language="java"
                theme="light"
                fontSize={13}
                showLineNumbers={true}
                wordWrap={true}
                className="flex-1 !rounded-t-none !border-t-0"
              />
            </div>
          }
        />
      </ContentSection>
    </CcpDashboardLayout>
  );
}
