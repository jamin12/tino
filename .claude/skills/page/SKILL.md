---
name: page
description: pages 레이어 작성 규칙(thin composition, widgets 조합, 라우트 단위 화면). 페이지 컴포넌트 작성/수정 시 참조한다.
---

# Page 레이어 규칙

pages는 라우트 단위 화면을 담당한다. widgets를 조합하여 페이지를 구성하며, 자체 로직은 최소화한다.

## 적용 시점

- 새 페이지 추가
- 기존 페이지 수정
- 라우트 구조 변경

---

## 규칙 목록

### CRITICAL — 원칙

#### `page-thin`
페이지는 최대한 얇게 유지한다. 비즈니스 로직, API 호출, 복잡한 상태 관리를 포함하지 않는다.

```tsx
// BEST - 단순 re-export
export { ProjectDashboardWidget as ProjectPage } from '@widgets/project-dashboard'

// GOOD - 탭 전환 정도의 조합
export function ProjectPage() {
  const [tab, setTab] = useState('overview')
  return (
    <Layout>
      <Tabs value={tab} onChange={setTab} />
      {tab === 'overview' && <ProjectOverviewWidget />}
      {tab === 'settings' && <ProjectSettingsWidget />}
    </Layout>
  )
}

// WRONG - 페이지에 비즈니스 로직
export function ProjectPage() {
  const { data } = useProjectList()            // 금지!
  const { createProject } = useCreateActions()  // 금지!
  // ...
}
```

#### `page-widget-composition`
페이지는 widgets 조합만 수행한다. shared 레이어(Layout, UI 프레임)를 직접 import하여 페이지 뼈대를 구성할 수 있다.

```tsx
import { AppLayout } from '@shared/ui'
import { ProjectDashboardWidget } from '@widgets/project-dashboard'

export function ProjectPage() {
  return (
    <AppLayout>
      <ProjectDashboardWidget />
    </AppLayout>
  )
}
```

### HIGH — 라우트 가드

#### `page-auth-in-router`
인증/권한 가드는 페이지 컴포넌트가 아닌 라우터에서 처리한다.

```tsx
// WRONG - 페이지에서 인증 체크
export function AdminPage() {
  const { isAdmin } = useAuth()
  if (!isAdmin) return <Navigate to="/" />  // 금지!
}

// CORRECT - 라우터에서 처리
{ path: '/admin', element: <AdminPage />, loader: requireAdmin }
```

### MEDIUM — 네이밍

#### `page-naming`
- 디렉토리: kebab-case (`project-detail`)
- 컴포넌트: PascalCase + `Page` 접미사 (`ProjectDetailPage`)

```
pages/
├── project-list/
│   ├── index.ts
│   └── ui/
│       └── ProjectListPage.tsx
└── project-detail/
    ├── index.ts
    └── ui/
        └── ProjectDetailPage.tsx
```
