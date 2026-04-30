---
name: component-style
description: React 컴포넌트 작성 규칙(함수형, props 정의, Tailwind CSS 스타일링, 네이밍 컨벤션). 컴포넌트 코드 작성/수정 시 참조한다.
---

# React 컴포넌트 & 스타일 규칙

React 함수형 컴포넌트와 Tailwind CSS를 사용한다.

## 적용 시점

- React 컴포넌트 작성/수정
- 스타일링 작업
- Props 인터페이스 정의
- 컴포넌트 네이밍

---

## 규칙 목록

### CRITICAL — 컴포넌트 작성

#### `comp-function-declaration`
컴포넌트는 `function` 선언으로 작성한다. `React.FC`, `const = () =>` 패턴을 사용하지 않는다.

```tsx
// WRONG - React.FC
const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => { ... }

// WRONG - const arrow function
const ProjectCard = ({ project }: ProjectCardProps) => { ... }

// CORRECT - function 선언
export function ProjectCard({ project }: ProjectCardProps) { ... }
```

#### `comp-named-export`
컴포넌트는 named export를 사용한다. default export는 슬라이드 파일(`Slide*.tsx`)과 `meta.ts`에서만 허용한다.

```tsx
// WRONG
export default function ProjectCard() { ... }

// CORRECT
export function ProjectCard() { ... }

// EXCEPTION - 슬라이드 파일은 default export
// content/ccp/project/Slide01.tsx
export default function Slide01() { ... }
```

#### `comp-props-interface`
Props는 interface로 정의한다. 컴포넌트 파일 상단에 위치한다.

```tsx
interface ProjectCardProps {
  project: Project
  onSelect?: (id: string) => void
  className?: string
}

export function ProjectCard({ project, onSelect, className }: ProjectCardProps) {
  // ...
}
```

### HIGH — 스타일링

#### `comp-tailwind-inline`
Tailwind CSS 클래스를 인라인으로 사용한다. 별도 CSS 파일을 만들지 않는다.

```tsx
// WRONG - 별도 CSS 파일
import './ProjectCard.css'

// CORRECT - Tailwind 인라인
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
```

#### `comp-conditional-class`
조건부 클래스는 `cn()` 유틸리티를 사용한다 (clsx + tailwind-merge).

```tsx
import { cn } from '../cn'  // 또는 해당 프로젝트의 cn 경로

<div className={cn(
  "px-4 py-2 rounded-md",
  variant === "primary" && "bg-blue-500 text-white",
  variant === "danger" && "bg-red-500 text-white",
  disabled && "opacity-50 cursor-not-allowed",
  className,
)} />
```

#### `comp-cva-variants`
변형이 3개 이상인 컴포넌트는 class-variance-authority(CVA)를 사용한다.

```tsx
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium",
  {
    variants: {
      variant: {
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        danger: "bg-red-500 text-white hover:bg-red-600",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode
}

export function Button({ className, variant, size, children, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </button>
  )
}
```

### MEDIUM — 네이밍

#### `comp-naming`

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `ProjectCard.tsx` |
| Hook 파일 | camelCase, `use` 접두사 | `useProjectList.ts` |
| 유틸 파일 | camelCase | `formatDate.ts` |
| 타입 파일 | camelCase | `types.ts` |
| 디렉토리 | kebab-case | `project-dashboard/` |
| Interface | PascalCase + Props/State 등 | `ProjectCardProps` |
| Type | PascalCase | `Project`, `ListParams` |
