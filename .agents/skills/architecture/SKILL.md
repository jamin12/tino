---
name: architecture
description: FSD(Feature-Sliced Design) 레이어 구조, 의존성 방향 규칙, Public API(index.ts) 캡슐화. 새 기능 추가, 리팩토링, 아키텍처 관련 작업 시 참조한다.
---

# FSD 아키텍처 & 의존성 방향 규칙

## 레이어 구조

```
apps/web/src/
├── app/                        # 앱 초기화 및 전역 설정
│   ├── providers/              # QueryProvider, RouterProvider
│   ├── router/                 # 라우트 정의
│   └── styles/                 # 글로벌 스타일
├── pages/                      # 라우트 단위 화면 (조립)
│   └── {페이지}/
│       ├── index.ts
│       └── ui/
├── widgets/                    # 화면 블록 (조합)
│   └── {위젯}/
│       ├── index.ts
│       └── ui/
├── features/                   # 사용자 행동 (use case)
│   └── {기능}/
│       ├── index.ts
│       └── model/
├── entities/                   # 도메인 (데이터 + API)
│   └── {도메인}/
│       ├── index.ts
│       ├── api/
│       ├── model/
│       └── types/
├── shared/                     # 전역 공통 (도메인 무관)
│   ├── api/
│   ├── ui/
│   ├── lib/
│   ├── config/
│   └── types/
└── content/                    # 슬라이드 콘텐츠 (FSD 외부)
    └── {문서}/
        ├── meta.ts
        ├── Slide01.tsx
        └── _components/        # 콘텐츠 전용 디자인 시스템
```

## 적용 시점

- 새 기능/모듈 추가
- 리팩토링
- import 경로 결정
- 코드 리뷰

---

## 규칙 목록

### CRITICAL — 의존성 방향

#### `arch-dependency-direction`
의존성은 반드시 단방향이다. 상위 레이어만 하위 레이어를 import할 수 있다.

```
app → pages → widgets → features → entities → shared
```

```tsx
// WRONG - entities에서 features import
// entities/project/model/hooks.ts
import { useCreateProjectActions } from '@features/create-project'  // 금지!

// CORRECT - features에서 entities import
// features/create-project/model/useCreateProjectActions.ts
import { projectApi } from '@entities/project'
```

#### `arch-no-cross-import`
동일 레이어 내 슬라이스 간 직접 import 금지. 조합이 필요하면 상위 레이어에서 수행한다.

```tsx
// WRONG - feature 간 직접 import
// features/auth/model/useAuthActions.ts
import { useProjectActions } from '@features/project'  // 금지!

// CORRECT - widget에서 두 feature를 조합
// widgets/dashboard/ui/DashboardWidget.tsx
import { useAuthActions } from '@features/auth'
import { useProjectActions } from '@features/project'
```

### CRITICAL — Public API 캡슐화

#### `arch-public-api`
pages를 제외한 모든 모듈은 `index.ts`를 통해서만 외부 API를 노출한다. index.ts에는 re-export만 작성한다.

```tsx
// WRONG - 깊은 경로 직접 import
import { LoginForm } from '@features/auth/ui/components/LoginForm'

// CORRECT - index.ts를 통한 import
import { LoginForm } from '@features/auth'
```

#### `arch-index-reexport-only`
index.ts에는 로직, 컴포넌트 구현, 타입 선언을 직접 작성하지 않는다. 오직 re-export만 수행한다.

```tsx
// WRONG - index.ts에 구현 코드
export const useAuth = () => { ... }

// CORRECT - index.ts는 re-export만
export { useAuth } from './model/useAuth'
export type { AuthState } from './types/auth'
```

### HIGH — content 레이어 위치

#### `arch-content-outside-fsd`
`content/` 디렉토리는 FSD 레이어 외부이다. 슬라이드 콘텐츠는 `shared/ui`의 컴포넌트를 사용하거나, 각 문서 폴더의 `_components/`에서 자체 디자인 시스템을 구성한다.

```tsx
// content에서 shared 사용 — OK
import { Heading } from '@shared/ui/components/text'

// content에서 _components 사용 — OK
import { DataTable, Badge } from '../../_components'

// content에서 features/entities 직접 사용 — 금지
import { useProjectActions } from '@features/project'  // 금지!
```

### MEDIUM — 생성 순서

#### `arch-creation-order`
새 기능 추가 시 아래 순서를 따른다:

1. `entities/{도메인}` — 타입, API, Query Hook
2. `features/{기능}` — Use case Hook
3. `widgets/{위젯}` — UI 조합
4. `pages/{페이지}` — 라우트 연결
