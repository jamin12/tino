---
name: state-management
description: 상태 관리 규칙(TanStack Query 서버 상태, Zustand 클라이언트 상태, QueryKey 팩토리, invalidation 전략). 상태 관리 관련 코드 작성/수정 시 참조한다.
---

# 상태 관리 규칙

서버 상태는 TanStack Query, 클라이언트 상태는 Zustand로 관리한다. 두 상태의 역할을 혼용하지 않는다.

## 적용 시점

- Query/Mutation Hook 작성
- Zustand 스토어 작성
- 캐시 전략 결정
- 상태 관리 방식 선택

---

## 규칙 목록

### CRITICAL — 상태 분리

#### `state-separation`
서버 상태와 클라이언트 상태를 명확히 분리한다.

| 상태 유형 | 도구 | 위치 | 예시 |
|----------|------|------|------|
| 서버 상태 | TanStack Query | `entities/{도메인}/api/hooks.ts` | 프로젝트 목록, 사용자 정보 |
| 클라이언트 상태 | Zustand | `entities/{도메인}/model/useXxxStore.ts` | 인증 상태, UI 설정 |
| 로컬 UI 상태 | useState | 컴포넌트 내부 | 폼 열림/닫힘, 검색어 |

```tsx
// WRONG - 서버 데이터를 Zustand에 복사
const useProjectStore = create((set) => ({
  projects: [],
  fetchProjects: async () => {
    const data = await api.getProjects()
    set({ projects: data })  // 금지! TanStack Query 사용
  },
}))

// CORRECT - 서버 상태는 TanStack Query
export function useProjectList() {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: projectApi.getProjectList,
  })
}
```

### HIGH — QueryKey 팩토리

#### `state-querykey-factory`
QueryKey는 팩토리 패턴으로 관리한다. 문자열 직접 사용을 금지한다.

```tsx
export const projectKeys = {
  all: ['project'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (params: ListParams) => [...projectKeys.lists(), params] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
}
```

#### `state-mutation-invalidation`
Mutation 성공 시 관련 쿼리를 invalidate한다. features 레이어에서 처리한다.

```tsx
// features/create-project/model/useCreateProjectActions.ts
export function useCreateProjectActions() {
  const queryClient = useQueryClient()
  const mutation = useCreateProjectMutation()

  const createProject = async (data: CreateProjectInput) => {
    await mutation.mutateAsync(data)
    await queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
  }

  return { createProject, isCreating: mutation.isPending }
}
```

### HIGH — Zustand 스토어

#### `state-zustand-pattern`
Zustand 스토어는 `use{도메인}Store` 패턴을 따른다.

```tsx
// entities/auth/model/useAuthStore.ts
interface AuthState {
  token: string | null
  setToken: (token: string | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
}))
```

### MEDIUM — 상태 선택 가이드

#### `state-selection-guide`

| 데이터 | 도구 | 이유 |
|--------|------|------|
| API 응답 데이터 | TanStack Query | 캐싱, 재검증, 동기화 |
| 로그인 토큰 | Zustand | 클라이언트 전용 상태 |
| 폼 입력값 | useState | 로컬 UI 상태 |
| 다크모드 설정 | Zustand | 전역 클라이언트 설정 |
| URL 파라미터 | React Router | URL 동기화 |
