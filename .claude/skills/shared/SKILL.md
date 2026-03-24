---
name: shared
description: shared 레이어 작성 규칙(api, ui, lib, config, types 서브 디렉토리 역할과 패턴). 공통 코드 작성/수정 시 참조한다.
---

# Shared 레이어 규칙

shared는 모든 레이어에서 사용하는 공통 인프라를 담당한다. 도메인에 의존하지 않는 순수 공통 코드만 포함한다.

## 적용 시점

- 공통 UI 컴포넌트 추가/수정
- axios 클라이언트 설정
- 유틸 함수 추가
- 환경 변수 설정
- 공통 타입 정의

---

## 규칙 목록

### CRITICAL — 원칙

#### `shared-no-domain`
shared에 도메인 의존 코드를 넣지 않는다. 특정 엔티티, 특정 API 엔드포인트에 종속되는 코드는 해당 entity에 위치한다.

```tsx
// WRONG - shared에 도메인 의존 코드
// shared/api/projectApi.ts
export const getProjects = () => apiClient.get('/api/projects')  // 금지!

// CORRECT - shared에는 도메인 무관 인프라만
// shared/api/client.ts
export const apiClient = axios.create({ baseURL: env.API_URL })
```

#### `shared-no-upper-import`
shared에서 상위 레이어(entities, features, widgets, pages)를 import하지 않는다.

```tsx
// WRONG
import { useProject } from '@entities/project'  // 금지!
```

### HIGH — 서브 디렉토리 역할

#### `shared-subdirectories`

| 디렉토리 | 역할 | 예시 |
|----------|------|------|
| `shared/api/` | axios 인스턴스, 인터셉터, 공통 헬퍼 | `client.ts` |
| `shared/ui/` | 도메인 무관 UI 컴포넌트, 레이아웃 | `components/`, `layouts/` |
| `shared/lib/` | 도메인 무관 유틸 함수 | `export-image.ts`, `export-svg.ts` |
| `shared/config/` | 환경 변수, 앱 설정 | `env.ts` |
| `shared/types/` | 도메인 무관 공통 타입 | `index.ts` |

#### `shared-ui-structure`
shared/ui는 디자인 시스템의 집이다. `design-system` 스킬의 규칙을 따른다.

```
shared/ui/
├── components/     # 재사용 UI (text, diagram 등)
├── layouts/        # 레이아웃 (AppLayout 등)
└── index.ts        # Public API
```

### MEDIUM — packages/shared와의 역할 분리

#### `shared-vs-packages`

| | `apps/web/src/shared/` | `packages/shared/` |
|---|---|---|
| **범위** | web 앱 전용 | 모노레포 전체 공유 |
| **포함** | api, ui, lib, config, types | types, utils, constants |
| **UI** | 포함 | 미포함 |
| **사용** | FSD 레이어에서 import | 모든 앱에서 import |
