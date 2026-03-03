# Agent Instruction

- 항상 Vercel 관련 스킬(`vercel-composition-patterns`, `vercel-react-best-practices`, `vercel-react-native-skills`)을 우선적으로 사용한다.


## 프로젝트 개요

pnpm 워크스페이스 기반 모노레포로 구성된 React 웹 애플리케이션.
Feature-Sliced Design(FSD)을 기반으로 **도메인, 행동, UI 조합을 명확히 분리**하여 확장성과 유지보수성을 확보한다.

---

## 레이어별 역할

### 1. app (Application Layer)

* 전역 설정 및 초기화
* Provider 구성 (Query, Router 등)
* 글로벌 스타일

```tsx
QueryProvider + RouterProvider 조합
```

---

### 2. pages (Page Layer)

* 라우트 단위 화면
* widgets를 조합하여 페이지 구성

```tsx
<ProjectPage>
  <ProjectDashboard />
</ProjectPage>
```

특징:

* 로직 없음
* 조립 역할만 수행 (widgets 조합)
* `shared` 레이어(예: 공통 Layout, UI 프레임, Config 등)를 직접 import 하여 페이지 뼈대 구성 가능

---

### 3. widgets (Widget Layer)

* 화면에서 사용하는 **UI 블록**
* 여러 features, entities, shared를 조합

```tsx
<ProjectDashboard>
  <ProjectTable />
  <ProjectFilter />
  <CreateProjectForm />
</ProjectDashboard>
```

특징:

* 조합 중심
* 비즈니스 로직 최소화

---

### 4. features (Feature Layer)

* 사용자 행동 (use case)
* 여러 API를 조합하여 기능 구현

구성:

```
features/
 ├── index.ts     # Public API (Re-export)
 ├── model/       # 순수 비즈니스 로직, Hooks, 상태(Zustand), 오케스트레이션
 ├── types/       # 해당 기능의 타입 및 인터페이스
 └── ui/          # 행동이 연결된 시각적 UI 컴포넌트
```

예:

- create-project
- deploy-rollout
- slide-viewer (상태 조작 및 키보드 네비게이션 Action 캡슐화)

특징:

- `model/index.ts`나 `types/index.ts` 같은 내부 진입점 안에는 직접적인 로직이나 타입 선언을 두지 않고, 반드시 `store.ts` 나 `use-feature.ts` 같은 파일을 생성하여 구현한 뒤 Re-export만 수행합니다.

---

### 5. entities (Entity Layer)

* 도메인 단위 데이터 관리
* API, 상태, 타입 정의

구성:

```
entities/
 ├── project/
 │    ├── api/     # 실제 API 호출
 │    ├── model/   # query (TanStack Query)
 │    └── types/
```

특징:

* 데이터 중심
* 재사용 가능

---

### 6. shared (Shared Layer)

* 전역 공통 코드
* 어떤 레이어에서도 사용 가능

구성:

```
shared/
 ├── api/      # axios client
 ├── ui/       # Button, Modal 등
 ├── lib/      # util 함수
 ├── config/   # 설정
 └── types/
```

규칙:

* 도메인 의존 금지
* 하위 레이어 import 금지

---

## 레이어 의존 규칙

```id="dep"
app → pages → widgets → features → entities → shared
```

* 단방향 의존만 허용 (상위 레이어가 하위 레이어를 의존하는 것은 허용됨)
* 역방향 import 금지 (하위 레이어가 상위 레이어를 참조하면 안 됨)
* **동일 레이어 간 참조 금지 (Cross-import 제한)**
  * 같은 레이어 내의 슬라이스끼리는 서로를 직접 참조(import)해서는 안 됩니다. (예: `features/auth`에서 `features/project` import 금지)
  * 두 개 이상의 기능이나 도메인이 결합되어야 한다면 상위 레이어(예: `widgets`)에서 **조합(Composition)**하여 해결해야 합니다.
  * (단, 가장 아래의 `shared` 레이어 내에서는 유틸리티 간 참조가 제한적으로 허용됩니다.)
* **모든 상위 레이어(`pages` 포함)에서 최하단 `shared` 레이어를 자유롭게 import 가능**

---

## 실행 및 데이터 흐름

사용자 액션은 내려가고(↓), 데이터는 올라옵니다(↑).

```id="dataflow"
1. pages/widgets: 버튼 클릭이나 화면 진입으로 동작 시작
   ↓ (요청)
2. features: 행동(UseCase) 로직 실행, entities의 query/mutation 호출
   ↓ (요청)
3. entities/model & api: TanStack Query와 axios를 통해 실제 서버 API 호출 (shared/api 사용)
   ↑ (응답)
4. 데이터가 캐싱(Query) 또는 상태(Zustand)에 반영
   ↑ (반환)
5. UI 구성요소들이 반응형으로 리렌더링
```

---

## packages/shared 구조

```
packages/shared/src/
├── types/
├── utils/
├── constants/
└── index.ts
```

역할:

* 앱 간 공통 로직 공유
* UI는 포함하지 않음 (UI는 app의 shared/ui에서 관리)

---

## Path Alias

| Alias               | 경로                        |
| ------------------- | ------------------------- |
| `@/*`               | `apps/web/src/*`          |
| `@app/*`            | `apps/web/src/app/*`      |
| `@pages/*`          | `apps/web/src/pages/*`    |
| `@widgets/*`        | `apps/web/src/widgets/*`  |
| `@features/*`       | `apps/web/src/features/*` |
| `@entities/*`       | `apps/web/src/entities/*` |
| `@shared/*`         | `apps/web/src/shared/*`   |
| `@workpulse/shared` | `packages/shared/src`     |

---

## 주요 규칙

### 1. API 위치

* 모든 API 호출은 `entities/api`에 정의

### 2. 상태 관리

* 서버 상태: entities/model (TanStack Query)
* 클라이언트 상태: shared 또는 entities (Zustand)

### 3. Public API (index.ts) 사용을 통한 캡슐화

* 라우팅 타겟인 `pages`를 제외한 각 모듈(features, widgets, entities)은 루트의 `index.ts`를 통해서만 외부로 API 컴포넌트, 훅, 타입을 노출해야 합니다.
* 외부 레이어에서는 다른 레이어의 깊은 경로(`deep/path`)를 직접 import 하는 것을 엄격히 금지합니다.
  * ✅ 좋은 예: `import { LoginForm } from '@features/auth'`
  * ❌ 나쁜 예: `import { LoginForm } from '@features/auth/ui/components/LoginForm'`

### 4. 역할 분리

| 레이어      | 역할  |
| -------- | --- |
| entities | 데이터 |
| features | 행동  |
| widgets  | 조합  |
| pages    | 화면  |

---

## 주요 명령어

```bash
pnpm dev
pnpm build
pnpm lint
pnpm preview
```

---

## 핵심 설계 원칙

* UI, 데이터, 행동을 분리한다
* 페이지는 최대한 얇게 유지한다
* widgets는 조합만 수행한다
* features는 use case를 담당한다
* entities는 도메인 단위로 분리한다

---

## 슬라이드 디자인 시스템 가이드

이 섹션은 외부 AI(Claude Code, Antigravity 등)가 Tino 슬라이드를 자동 생성할 때 참조하는 가이드입니다.

### 문서 구조

문서는 `apps/web/src/content/` 디렉토리의 폴더로 관리됩니다.

```
src/content/
├── my-document/          # 문서 = 디렉토리 (폴더명 = URL slug)
│   ├── meta.ts           # 메타데이터
│   ├── Slide01.tsx       # 슬라이드 1
│   ├── Slide02.tsx       # 슬라이드 2
│   └── Slide03.tsx       # 슬라이드 3
└── _template/            # 스타터 템플릿 (_로 시작하면 목록에서 제외)
```

### 네이밍 규칙

- 폴더명: kebab-case (`my-project-plan`)
- 슬라이드: `Slide` + 2자리 숫자 (`Slide01.tsx`, `Slide02.tsx`, ...)
- 각 슬라이드는 `export default function SlideNN()` 형태

### meta.ts

```ts
import type { DocumentMeta } from "@entities/document";

const meta: DocumentMeta = {
  title: "문서 제목",
  description: "문서 설명 (선택)",
  createdAt: "2025-01-15",    // ISO 날짜
  tags: ["tag1", "tag2"],     // 선택
};

export default meta;
```

### 슬라이드 파일 (.tsx)

```tsx
import { Heading, Paragraph } from "@shared/ui/components/text";

export default function Slide01() {
  return (
    <div className="space-y-6">
      <Heading level={1} content="제목" />
      <Paragraph content="**마크다운** 지원 텍스트" />
    </div>
  );
}
```

### 사용 가능한 컴포넌트

#### Text 컴포넌트 (`@shared/ui/components/text`)

| 컴포넌트 | Props | 설명 |
|----------|-------|------|
| `Heading` | `level: 1-6`, `content: string` | 제목 (h1~h6) |
| `Paragraph` | `content: string` | 마크다운 지원 본문 |
| `BulletList` | `ordered: boolean`, `items: string[]` | 목록 (순서/비순서) |
| `Callout` | `variant: "info"\|"warning"\|"tip"\|"error"`, `title?: string`, `content: string` | 강조 박스 |
| `CodeBlock` | `language: string`, `code: string` | 코드 블록 |
| `DataTable` | `headers: string[]`, `rows: string[][]` | 테이블 |
| `Quote` | `content: string`, `author?: string` | 인용문 |

#### Diagram 컴포넌트 (`@shared/ui/components/diagram`)

| 컴포넌트 | Props | 설명 |
|----------|-------|------|
| `Flowchart` | `nodes: FlowchartNode[]`, `edges: FlowchartEdge[]` | 플로우차트 |
| `MindMap` | `root: MindmapNode` | 마인드맵 |

**FlowchartNode:**
```ts
{ id: string; label: string; position: { x: number; y: number }; shape?: "rectangle" | "diamond" | "circle"; color?: string }
```

**FlowchartEdge:**
```ts
{ id: string; source: string; target: string; label?: string; type?: "default" | "step" | "smoothstep" }
```

**MindmapNode (재귀):**
```ts
{ id: string; label: string; children?: MindmapNode[] }
```

### 슬라이드 작성 규칙

1. 각 슬라이드는 `<div className="space-y-6">` 래퍼를 사용
2. 첫 슬라이드에는 반드시 `<Heading level={1}>` 포함
3. 이후 슬라이드는 `<Heading level={2}>` 사용
4. 컴포넌트 import는 반드시 `@shared/ui/components/text` 또는 `@shared/ui/components/diagram`에서
5. Tailwind CSS 클래스 사용 가능
6. Vite HMR로 저장 시 즉시 브라우저에 반영
