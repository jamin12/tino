---
name: feature
description: features 레이어 작성 규칙(useXxxActions hook 패턴, 오케스트레이션, UI 로직 없음). use case hook 작성/수정 시 참조한다.
---

# Feature 레이어 규칙

features는 사용자 행동(use case)을 담당한다. 여러 entity의 API/mutation을 조합하여 비즈니스 로직을 오케스트레이션하는 커스텀 hook을 제공한다.

## 적용 시점

- 새 기능(use case) 추가
- 기존 feature hook 수정
- CRUD 오케스트레이션 로직 작성

---

## 규칙 목록

### CRITICAL — 구조

#### `feature-structure`
feature는 아래 구조를 따른다. UI 디렉토리는 만들지 않는다.

```
features/{기능}/
├── index.ts                    # Public API (필수, re-export only)
└── model/
    ├── index.ts                # re-export only
    └── use{동사}{도메인}Actions.ts  # Use case hook (필수)
```

#### `feature-hook-only`
feature에는 hook만 포함한다. UI 컴포넌트, 스타일 파일, 유틸 함수를 넣지 않는다.

```tsx
// WRONG - feature에 UI 컴포넌트
features/auth/
├── ui/
│   └── LoginForm.tsx     // 금지!

// CORRECT - UI는 widget에서 조합
widgets/auth/
└── ui/
    └── LoginForm.tsx
```

#### `feature-no-cross-import`
동일 레이어(features) 간 직접 import 금지. 두 feature를 조합하려면 상위 레이어(widgets)에서 수행한다.

### HIGH — Hook 패턴

#### `feature-actions-pattern`
feature hook은 `use{동사}{도메인}Actions` 패턴을 따른다. entity의 mutation을 조합하고, 부수 효과(toast, invalidation, 네비게이션)를 처리한다.

```tsx
// features/create-project/model/useCreateProjectActions.ts
import { useCreateProjectMutation, projectKeys } from '@entities/project'
import { useQueryClient } from '@tanstack/react-query'

export function useCreateProjectActions() {
  const queryClient = useQueryClient()
  const createMutation = useCreateProjectMutation()

  const createProject = async (data: CreateProjectInput) => {
    await createMutation.mutateAsync(data)
    await queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
  }

  return {
    createProject,
    isCreating: createMutation.isPending,
  }
}
```

#### `feature-refetch-param`
invalidation 대상이 동적일 경우 refetch 콜백을 파라미터로 받는다.

```tsx
export function useDeleteProjectActions(onSuccess?: () => void) {
  const deleteMutation = useDeleteProjectMutation()

  const deleteProject = async (id: string) => {
    await deleteMutation.mutateAsync(id)
    onSuccess?.()
  }

  return { deleteProject, isDeleting: deleteMutation.isPending }
}
```

### MEDIUM — Public API

#### `feature-public-api`
index.ts에서 hook만 export한다. 내부 유틸이나 타입은 노출하지 않는다.

```tsx
// features/create-project/index.ts
export { useCreateProjectActions } from './model/useCreateProjectActions'
```
