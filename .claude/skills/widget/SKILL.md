---
name: widget
description: widgets 레이어 작성 규칙(features + entities 조합, 로컬 UI 상태 관리, 내장 Form/Modal 패턴). 화면 블록 컴포넌트 작성/수정 시 참조한다.
---

# Widget 레이어 규칙

widgets는 화면에서 사용하는 UI 블록을 담당한다. features와 entities를 조합하여 실제 동작하는 화면 단위를 구성한다.

## 적용 시점

- 새 화면 블록(widget) 추가
- 기존 widget 수정
- feature + entity 조합 컴포넌트 작성

---

## 규칙 목록

### CRITICAL — 구조

#### `widget-structure`
widget은 아래 구조를 따른다.

```
widgets/{위젯}/
├── index.ts                    # Public API (필수, re-export only)
└── ui/
    ├── {위젯}Widget.tsx        # 메인 위젯 (필수)
    └── {서브컴포넌트}.tsx       # 내부 전용 (선택)
```

#### `widget-no-model-api`
widget에 `model/`, `api/` 디렉토리를 만들지 않는다. 데이터는 entities에서, 행동은 features에서 가져온다.

```tsx
// WRONG - widget에 api 디렉토리
widgets/project-dashboard/
├── api/
│   └── hooks.ts    // 금지!

// CORRECT - entities와 features를 import하여 조합
import { useProjectList } from '@entities/project'
import { useCreateProjectActions } from '@features/create-project'
```

#### `widget-no-cross-import`
동일 레이어(widgets) 간 직접 import 금지. 두 widget을 조합하려면 pages에서 수행한다.

### HIGH — 조합 패턴

#### `widget-composition`
widget은 feature hook과 entity query를 조합하여 UI 블록을 구성한다.

```tsx
// widgets/project-dashboard/ui/ProjectDashboardWidget.tsx
import { useProjectList } from '@entities/project'
import { useCreateProjectActions } from '@features/create-project'
import { useDeleteProjectActions } from '@features/delete-project'
import { Button, DataTable } from '@shared/ui'

export function ProjectDashboardWidget() {
  const { data: projects } = useProjectList()
  const { createProject, isCreating } = useCreateProjectActions()
  const { deleteProject } = useDeleteProjectActions()

  return (
    <>
      <Button onClick={() => createProject()} loading={isCreating}>
        새 프로젝트
      </Button>
      <DataTable data={projects} />
    </>
  )
}
```

#### `widget-local-ui-state`
위젯 내부의 UI 상태(모달 열림/닫힘, 선택 항목 등)는 `useState`로 관리한다.

```tsx
export function ProjectDashboardWidget() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  // ...
}
```

#### `widget-internal-form-modal`
Form과 Modal은 위젯 내부 서브컴포넌트로 작성한다. 별도 widget으로 분리하지 않는다.

```
widgets/project-dashboard/
└── ui/
    ├── ProjectDashboardWidget.tsx  # 메인
    ├── CreateProjectForm.tsx       # 내부 전용 Form
    └── DeleteProjectModal.tsx      # 내부 전용 Modal
```

### MEDIUM — 네이밍

#### `widget-naming`
- 디렉토리: kebab-case (`project-dashboard`)
- 메인 컴포넌트: PascalCase + `Widget` 접미사 (`ProjectDashboardWidget`)
- index.ts에서 메인 위젯만 export

```tsx
// widgets/project-dashboard/index.ts
export { ProjectDashboardWidget } from './ui/ProjectDashboardWidget'
```
