---
name: design-system
description: 통합 디자인 시스템 규칙. shared/ui/(FSD 앱 전체)와 content/_components/(슬라이드 전용) 두 영역의 토큰, 계층 구조, 컴포넌트 작성 규칙을 통합 관리한다.
---

# 통합 디자인 시스템 규칙

이 프로젝트에는 두 개의 디자인 시스템 영역이 공존한다.

| 영역 | 위치 | 소비자 | 용도 |
|------|------|--------|------|
| **FSD 디자인 시스템** | `apps/web/src/shared/ui/` | widgets, features, pages | 앱 전체 UI |
| **Content 디자인 시스템** | `content/{문서}/_components/` | 슬라이드 파일 (Slide*.tsx) | 슬라이드 목업 UI |

## 적용 시점

- shared/ui 컴포넌트 추가/수정
- content/_components 컴포넌트 추가/수정
- 디자인 토큰 변경
- 새로운 UI 패턴이 필요할 때
- 스타일 일관성 점검

---

## 규칙 목록

### CRITICAL — 공통 원칙

#### `ds-token-first`
색상, 간격, 타이포그래피, 그림자 등 시각적 속성은 반드시 토큰을 통해 참조한다. 하드코딩 금지.

```tsx
// WRONG - 색상 하드코딩
<div className="bg-[#0077ff] text-[#333333]">

// CORRECT (FSD) - Tailwind 시맨틱 또는 CSS 변수
<div className="bg-primary text-gray-900">

// CORRECT (Content) - tokens.ts 참조
import { colors } from '../../_components'
<div style={{ background: colors.primary, color: colors.neutral[900] }}>
```

#### `ds-no-raw-html-in-slides`
슬라이드 파일(.tsx)에서 raw HTML 태그를 직접 사용하지 않는다. 반드시 `_components/`의 컴포넌트로 조합한다.

```tsx
// WRONG - 슬라이드에서 raw HTML
export default function Slide01() {
  return (
    <div className="p-4 bg-white border border-[#e0e0e0] rounded-lg">
      <span className="text-[14px] font-bold">제목</span>
      <table className="w-full">...</table>
    </div>
  )
}

// CORRECT - _components 조합
import { ContentSection, DataTable, TextCell } from '../../_components'

export default function Slide01() {
  return (
    <ContentSection card>
      <DataTable columns={columns} data={data} />
    </ContentSection>
  )
}
```

#### `ds-no-interactive-html`
pages, widgets에서 인터랙티브/데이터 표시 HTML 태그를 직접 사용하지 않는다. `shared/ui`의 디자인 시스템 컴포넌트를 사용한다.

**금지 태그 (반드시 컴포넌트로 대체):**

| HTML 태그 | 대체 컴포넌트 |
|-----------|-------------|
| `<button>` | `Button` |
| `<input>`, `<textarea>` | `TextInput`, `Input` |
| `<select>` | `Select` |
| `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<td>` | `DataTable` |
| `<form>` | Form 컴포넌트 또는 widget 내부 Form 서브컴포넌트 |
| `<dialog>` | `Modal` |
| `<details>`, `<summary>` | `CollapsibleSection`, `Accordion` |
| `<a>` (스타일링된) | `Link`, `Button variant="ghost"` |

**허용 태그 (레이아웃/구조):**

`<div>`, `<section>`, `<main>`, `<header>`, `<footer>`, `<nav>`, `<aside>`, `<article>`, `<span>`, `<p>`, `<h1>`~`<h6>`, `<ul>`, `<ol>`, `<li>`

```tsx
// WRONG - widget에서 raw button
export function ProjectDashboardWidget() {
  return (
    <div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleCreate}>
        새 프로젝트
      </button>
      <table className="w-full">
        <thead><tr><th>이름</th></tr></thead>
      </table>
    </div>
  )
}

// CORRECT - 디자인 시스템 컴포넌트 사용
import { Button, DataTable } from '@shared/ui'

export function ProjectDashboardWidget() {
  return (
    <div>
      <Button variant="primary" onClick={handleCreate}>
        새 프로젝트
      </Button>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
```

> 레이아웃 태그(`div`, `section` 등)는 Tailwind flex/grid로 자유롭게 사용한다.
> 인터랙티브 태그는 스타일 일관성 + 접근성을 위해 반드시 컴포넌트로 대체한다.

#### `ds-new-pattern-component-first`
새로운 UI 패턴이 필요할 때, 해당 디자인 시스템 영역에 컴포넌트를 먼저 만들고, 소비자 코드에서 import하여 사용한다.

```
1. _components/ 또는 shared/ui/에 컴포넌트 생성
2. 토큰 값 사용
3. 소비자(슬라이드 또는 widget)에서 import하여 조합
```

### CRITICAL — 계층 구조 (양쪽 공통)

#### `ds-tier-hierarchy`
두 디자인 시스템 모두 동일한 계층 구조를 따른다.

```
tokens          → 색상, 간격, 타이포, 그림자 등 디자인 값
  ↓
primitives      → 최소 단위 (Badge, Button, TextCell, Divider 등)
  ↓
composites      → 복합 조합 (Card, Modal, FilterBar, ContentSection 등)
  ↓
patterns        → 데이터 표시 패턴 (DataTable, StatusSummary 등)
  ↓
layouts         → 페이지 구조 (AppLayout, DashboardLayout 등)
```

**의존 방향**: 상위 계층만 하위 계층을 import. 역방향 금지.

```tsx
// WRONG - primitive이 composite를 import
// primitives/Badge.tsx
import { Card } from '../composites/Card'  // 금지!

// CORRECT - composite가 primitive를 import
// composites/Card.tsx
import { Badge } from '../primitives/Badge'
```

### HIGH — FSD 디자인 시스템 (shared/ui/)

#### `ds-fsd-structure`
FSD 디자인 시스템의 디렉토리 구조:

```
shared/ui/
├── components/         # 재사용 UI 컴포넌트
│   ├── text/           # 텍스트 계열 (Heading, Paragraph, BulletList 등)
│   ├── diagram/        # 다이어그램 (Flowchart, MindMap)
│   └── index.ts
├── layouts/            # 레이아웃 (AppLayout)
│   └── index.ts
└── index.ts            # Public API
```

#### `ds-fsd-domain-free`
shared/ui 컴포넌트는 도메인에 의존하지 않는다. 특정 entity나 feature에 종속되는 UI는 해당 widget에서 작성한다.

```tsx
// WRONG - shared/ui에 도메인 의존 컴포넌트
// shared/ui/components/ProjectCard.tsx  // 금지!

// CORRECT - 도메인 무관 컴포넌트만
// shared/ui/components/text/Heading.tsx  // OK
```

### HIGH — Content 디자인 시스템 (_components/)

#### `ds-content-structure`
Content 디자인 시스템의 디렉토리 구조:

```
content/{문서}/_components/
├── tokens.ts           # 디자인 토큰
├── cn.ts               # clsx + tailwind-merge 유틸
├── index.ts            # Barrel export (모든 컴포넌트 + 토큰)
├── primitives/         # Badge, Button, TextCell, Toggle 등
├── composites/         # Card, ContentSection, FilterBar, Modal 등
├── patterns/           # DataTable, StatusSummary, PipelineGraph 등
├── layouts/            # CcpDashboardLayout, GlobalNav, SideMenu 등
├── form/               # TextInput, FormBanner, KeyValueEditor 등
└── icons/              # 아이콘 컴포넌트
```

#### `ds-content-token-usage`
Content 컴포넌트는 `tokens.ts`의 값을 사용한다.

```tsx
// tokens.ts에서 정의
export const colors = { primary: '#0077ff', ... }
export const fontSize = { sm: '13px', ... }
export const shadow = { card: '0px 0px 8px #00000014', ... }

// 컴포넌트에서 사용
import { colors, shadow } from '../tokens'

export function Card({ children }: CardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden"
         style={{ boxShadow: shadow.card }}>
      {children}
    </div>
  )
}
```

#### `ds-content-render-components`
DataTable의 column render 함수 내부도 `TextCell`, `Badge`, `Button` 등 컴포넌트만 사용한다. raw HTML 금지.

```tsx
// WRONG
{ render: (row) => <span style={{ color: '#333' }}>{row.name}</span> }

// CORRECT
{ render: (row) => <TextCell bold>{row.name}</TextCell> }
```

### MEDIUM — 두 시스템의 관계

#### `ds-coexistence`
두 디자인 시스템은 독립적으로 공존한다.

| | FSD (shared/ui) | Content (_components) |
|---|---|---|
| **토큰** | Tailwind config / CSS 변수 | tokens.ts |
| **소비자** | FSD 레이어 (widgets, pages) | 슬라이드 파일 (Slide*.tsx) |
| **도메인** | 무관 | 해당 문서 전용 |
| **스타일** | Tailwind 클래스 | Tailwind + tokens.ts inline |

Content 컴포넌트가 shared/ui 컴포넌트를 import하는 것은 허용되지만, 반대는 금지.

```tsx
// content/_components에서 shared/ui 사용 — OK (하위 레이어)
import { Heading } from '@shared/ui/components/text'

// shared/ui에서 content/_components 사용 — 금지!
import { Badge } from '../../content/ccp/_components'  // 금지!
```

#### `ds-upgrade-path`
앱이 확장되어 shared/ui를 모노레포 전체에서 공유해야 할 경우:

```
현재: apps/web/src/shared/ui/
미래: packages/ui/src/  (독립 패키지로 승격)
```

승격 시 content/_components는 영향 없이 유지된다.
