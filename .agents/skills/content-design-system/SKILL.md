---
name: content-design-system
description: content 디렉토리의 디자인 시스템 Tokens+Tiers 디렉토리 구조 규칙. _components/ 내 컴포넌트 생성/이동 시 자동 적용.
user_invocable: false
---

# Content 디자인 시스템 구조 가이드

`apps/web/src/content/*/` 하위 프로젝트의 `_components/` 디자인 시스템은 Tokens + Tiers 구조를 따른다. CCP뿐 아니라 content 내 모든 프로젝트에 동일하게 적용한다.

## 적용 시점

- `content/*/_components/`에 새 컴포넌트를 추가할 때
- 기존 컴포넌트를 다른 계층으로 이동할 때
- 컴포넌트 간 import를 작성할 때
- 슬라이드에서 컴포넌트를 사용할 때

---

## 규칙 목록

### CRITICAL — 디렉토리 구조

#### `ds-directory-structure`

`_components/`는 다음 디렉토리 구조를 따른다. 새 컴포넌트는 반드시 적절한 하위 디렉토리에 생성한다.

```
_components/
├── tokens.ts              # 디자인 토큰 (색상, 타이포, 간격, 그림자, 반경)
├── cn.ts                  # clsx + tailwind-merge 유틸리티
├── primitives/            # 최소 단위 컴포넌트 (내부 의존 없음)
├── composites/            # primitives 조합 컴포넌트
├── form/                  # 폼 전용 컴포넌트
├── patterns/              # 복합 데이터 표시 컴포넌트
├── layouts/               # 페이지 뼈대 컴포넌트
├── icons/                 # 아이콘 컴포넌트 (선택)
└── index.ts               # 루트 barrel export
```

```
# WRONG — 루트에 직접 컴포넌트 생성
_components/MyNewButton.tsx

# CORRECT — 적절한 하위 디렉토리에 생성
_components/primitives/MyNewButton.tsx
```

모든 하위 디렉토리가 필수는 아니다. 프로젝트 규모에 따라 필요한 계층만 생성한다. 단, primitives/와 composites/는 항상 존재해야 한다.

#### `ds-dependency-direction`

의존 방향은 단방향이다. 상위 계층이 하위 계층만 참조할 수 있다.

```
tokens → primitives → composites → form/patterns → layouts
```

- `tokens.ts`, `cn.ts`는 모든 계층에서 참조 가능
- 같은 계층 간 참조 허용 (composites끼리, patterns끼리)
- 역방향 참조 금지

```tsx
// WRONG — primitive가 composite를 참조
// primitives/Badge.tsx
import { Card } from "../composites/Card";

// CORRECT — composite가 primitive를 참조
// composites/CellGroup.tsx
import { Badge } from "../primitives/Badge";
```

#### `ds-barrel-export`

각 하위 디렉토리는 `index.ts`로 barrel export한다. 루트 `index.ts`는 하위 디렉토리를 re-export한다. 외부(슬라이드)에서는 항상 루트 barrel을 통해 import한다.

```tsx
// WRONG — 슬라이드에서 하위 디렉토리 직접 import
import { Badge } from "../_components/primitives/Badge";

// CORRECT — 루트 barrel 통해 import
import { Badge } from "../_components";
```

새 컴포넌트를 추가하면 해당 디렉토리의 `index.ts`에 export를 추가해야 한다.

---

### HIGH — 계층 분류 기준

#### `ds-tier-primitives`

**primitives/**: 다른 _components 컴포넌트에 의존하지 않는 최소 단위. `cn.ts`와 `tokens.ts`만 참조 가능. 외부 라이브러리(lucide-react, cva 등)는 허용.

판별 기준: "이 컴포넌트가 다른 _components 파일을 import하는가?" → No → primitives

#### `ds-tier-composites`

**composites/**: primitives를 조합하거나, 범용 UI 패턴을 구현. 같은 계층(composites) 간 참조 허용.

판별 기준: "primitives나 다른 composites를 import하는가?" + "특정 도메인 데이터에 종속되지 않는가?" → composites

#### `ds-tier-form`

**form/**: 폼 입력과 폼 액션에 특화된 컴포넌트. primitives를 참조하거나 같은 form/ 내 참조 허용.

#### `ds-tier-patterns`

**patterns/**: 복합 데이터 표시에 특화. composites + primitives를 사용하여 도메인 데이터를 시각화.

판별 기준: "테이블, 차트, 파이프라인 등 복합 데이터를 표시하는가?" → patterns

#### `ds-tier-layouts`

**layouts/**: 페이지 뼈대와 네비게이션. 모든 하위 계층을 사용할 수 있다.

---

### HIGH — Import 경로 규칙

#### `ds-import-internal`

컴포넌트 내부에서 다른 계층을 참조할 때는 상대 경로를 사용한다.

```tsx
// cn, tokens 참조 (루트에 위치)
import { cn } from "../cn";
import { colors } from "../tokens";

// 다른 계층 참조
import { Badge } from "../primitives/Badge";
import { Tabs } from "../composites/Tabs";

// 같은 디렉토리 참조
import { Breadcrumb } from "./Breadcrumb";
```

#### `ds-import-external`

슬라이드 파일에서는 루트 `_components/index.ts`를 통해서만 import한다.

```tsx
// 슬라이드에서 사용
import {
  Badge,
  DataTable,
  colors,
} from "../_components";
```

---

### MEDIUM — 새 컴포넌트 추가 절차

#### `ds-add-component`

새 컴포넌트를 추가할 때는 다음 순서를 따른다:

1. 의존성 분석: 어떤 _components 파일을 import하는지 확인
2. 계층 결정: 의존성과 역할에 따라 적절한 디렉토리 선택
3. 파일 생성: 해당 디렉토리에 컴포넌트 파일 작성
4. index.ts 업데이트: 디렉토리의 index.ts에 export 추가
5. 루트 index.ts는 `export * from "./{디렉토리}"`로 자동 포함되므로 수정 불필요
