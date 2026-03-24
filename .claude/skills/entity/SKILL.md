---
name: entity
description: entities 레이어 작성 규칙(API 함수, TanStack Query Hook, 타입 정의, QueryKey 팩토리). 도메인 데이터 관련 코드 작성/수정 시 참조한다.
---

# Entity 레이어 규칙

entities는 도메인 단위 데이터 관리를 담당한다. API 호출, 서버 상태 관리(TanStack Query), 타입 정의를 포함한다.

## 적용 시점

- 새 도메인 엔티티 추가
- API 함수, Query/Mutation Hook 작성
- 엔티티 타입 정의
- 기존 엔티티 수정

---

## 규칙 목록

### CRITICAL — 디렉토리 구조

#### `entity-structure`
모든 엔티티는 아래 구조를 따른다.

```
entities/{도메인}/
├── index.ts            # Public API (필수, re-export only)
├── api/
│   ├── index.ts        # Raw API 함수
│   └── hooks.ts        # TanStack Query Hook
├── model/
│   └── types.ts        # 도메인 타입
└── types/              # 선택: 복잡한 타입이 많을 경우
    └── index.ts
```

#### `entity-no-orchestration`
엔티티에 비즈니스 오케스트레이션 로직을 넣지 않는다. 여러 API를 조합하는 로직은 features에서 수행한다.

```tsx
// WRONG - entity에서 오케스트레이션
export function useCreateAndDeployProject() {
  const createMutation = useCreateProject()
  const deployMutation = useDeploy()
  // 두 mutation 조합... 금지!
}

// CORRECT - entity는 단일 도메인 API만
export function useCreateProject() {
  return useMutation({ mutationFn: projectApi.create })
}
```

### HIGH — API 함수

#### `entity-api-naming`
API 함수명은 HTTP 동사 기반으로 작성한다.

| HTTP | 함수명 패턴 | 예시 |
|------|-----------|------|
| GET (목록) | `getXxxList` | `getProjectList` |
| GET (단건) | `getXxx` | `getProject` |
| POST | `createXxx` | `createProject` |
| PUT/PATCH | `updateXxx` | `updateProject` |
| DELETE | `deleteXxx` | `deleteProject` |

### HIGH — QueryKey 팩토리

#### `entity-querykey-factory`
QueryKey는 팩토리 패턴으로 관리한다. 문자열 직접 사용을 금지한다.

```tsx
// WRONG
useQuery({ queryKey: ['projects', id] })

// CORRECT
export const projectKeys = {
  all: ['project'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (params: ListParams) => [...projectKeys.lists(), params] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
}

useQuery({ queryKey: projectKeys.detail(id) })
```

### HIGH — Query/Mutation Hook

#### `entity-hook-pattern`
Query Hook은 `useXxx`, Mutation Hook은 `useXxxMutation` 패턴을 따른다.

```tsx
// Query Hook
export function useProjectList(params: ListParams) {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: () => projectApi.getProjectList(params),
  })
}

// Mutation Hook
export function useCreateProjectMutation() {
  return useMutation({
    mutationFn: projectApi.createProject,
  })
}
```

### MEDIUM — Public API

#### `entity-public-api`
index.ts에서 외부에 필요한 것만 re-export한다.

```tsx
// entities/project/index.ts
export { useProjectList, useProject } from './api/hooks'
export { useCreateProjectMutation, useDeleteProjectMutation } from './api/hooks'
export { projectKeys } from './api/hooks'
export type { Project, ProjectListParams } from './model/types'
```
