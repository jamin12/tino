---
name: slide-annotation
description: CCP 슬라이드에 Spec 어노테이션(번호 마커 + 설명 패널)을 추가하는 가이드
user_invocable: true
---

# 슬라이드 어노테이션 가이드

슬라이드 컴포넌트에 번호 마커와 Spec 설명 패널을 추가하는 방법을 안내한다.

## 적용 시점

- 슬라이드에 UI 요소 설명(Spec)을 추가할 때
- 기존 어노테이션을 수정하거나 새로 만들 때
- "설명 달아줘", "어노테이션 추가", "spec 추가" 등의 요청

---

## 규칙 목록

### CRITICAL — 어노테이션 등록

#### `anno-meta-definition`
`slideMeta.annotations` 배열에 어노테이션을 정의한다. `id`, `label`, `description`만 필요하며 **x/y 좌표는 지정하지 않는다**.

```tsx
// WRONG — x/y 좌표 수동 지정
export const slideMeta: SlideMeta = {
  annotations: [
    { id: 1, label: "버튼", description: "설명", x: 1850, y: 450 },
  ],
};

// CORRECT — 좌표 없이 정의 (위치는 data-annotation-id로 자동 계산)
export const slideMeta: SlideMeta = {
  annotations: [
    { id: 1, label: "버튼", description: "설명" },
  ],
};
```

#### `anno-target-binding`
어노테이션 마커의 위치는 슬라이드 JSX에서 대상 요소에 `data-annotation-id` 속성을 부여하여 결정한다. 시스템이 해당 요소를 자동으로 찾아 우상단 근처에 마커를 배치한다.

```tsx
// WRONG — 어디에 마커가 붙는지 알 수 없음 (x/y 추측)
<Button>생성</Button>

// CORRECT — 대상 요소에 직접 속성 부여
<Button data-annotation-id="1">생성</Button>
<Overlay data-annotation-id="2" top={100} right={0}>...</Overlay>
```

`slideMeta.annotations`의 `id` 값과 `data-annotation-id` 값이 반드시 일치해야 한다.

---

### HIGH — 컴포넌트별 바인딩 방법

#### `anno-html-native`
일반 HTML 요소나 `data-*` 속성을 pass-through하는 컴포넌트는 직접 `data-annotation-id`를 추가한다.

```tsx
<Button data-annotation-id="1">생성</Button>
<Overlay data-annotation-id="2" top={100} right={0}>...</Overlay>
<DataTable data-annotation-id="3" columns={columns} data={data} />
```

지원 컴포넌트: `Button`, `Overlay`, `DataTable` 등 rest props(`...rest`)를 DOM에 전달하는 컴포넌트.

#### `anno-action-menu-item`
ActionMenu의 개별 메뉴 항목에 마커를 붙이려면 `annotationId` prop을 사용한다. `data-annotation-id`가 아닌 `annotationId`이다.

```tsx
// WRONG — ActionMenu 항목에 data-annotation-id 직접 사용 불가
const items: ActionMenuEntry[] = [
  { key: "edit", label: "편집", "data-annotation-id": "1" },
];

// CORRECT — annotationId prop 사용
const items: ActionMenuEntry[] = [
  { key: "edit", label: "편집", icon: <Settings2 />, disabled: true, annotationId: 2 },
  { key: "manage", label: "관리 시작", icon: <ShieldCheck />, annotationId: 3 },
];
```

#### `anno-unsupported-component`
`data-*` 속성을 pass-through하지 않는 컴포넌트에 어노테이션을 붙이려면, 해당 컴포넌트의 Props 인터페이스에 `data-*` 지원을 추가하거나 래퍼 `<div>`로 감싼다.

```tsx
// 방법 1: 컴포넌트에 rest props 추가
interface MyComponentProps {
  // 기존 props...
  [key: `data-${string}`]: string | undefined;  // data-* 지원
}

// 방법 2: 래퍼 div 사용
<div data-annotation-id="1">
  <MyComponent />
</div>
```

---

### MEDIUM — 작성 패턴

#### `anno-description-style`
description은 해당 UI 요소의 **동작, 조건, 이유**를 명확히 설명한다. 단순 라벨 반복이 아닌 맥락을 제공해야 한다.

```tsx
// WRONG — 라벨을 반복하는 설명
{ id: 1, label: "편집", description: "편집 버튼입니다." }

// CORRECT — 동작과 조건을 설명
{
  id: 1,
  label: "편집 / 삭제 제한",
  description: "CCP에서 관리되지 않는 리소스는 편집과 삭제가 비활성화됩니다. '관리 시작'을 통해 CCP 관리 대상으로 등록하면 편집 및 삭제가 활성화됩니다.",
}
```

#### `anno-id-sequential`
어노테이션 id는 1부터 순차적으로 부여한다. Spec 사이드 패널에서 번호순으로 표시되므로 빈 번호 없이 연속해야 한다.

```tsx
// WRONG — 번호 건너뜀
annotations: [
  { id: 1, label: "A", description: "..." },
  { id: 3, label: "B", description: "..." },
]

// CORRECT
annotations: [
  { id: 1, label: "A", description: "..." },
  { id: 2, label: "B", description: "..." },
  { id: 3, label: "C", description: "..." },
]
```

---

### LOW — 동작 방식 참고

#### `anno-rendering-mechanism`
어노테이션 시스템은 `SlidePresenter` 위젯에서 동작한다:

1. Spec 버튼 클릭 시 URL에 `?spec=1` 파라미터가 추가되어 새로고침해도 유지됨
2. `AnnotationMarkers`가 `querySelectorAll('[data-annotation-id]')`로 대상 요소를 탐색
3. 대상 요소의 `getBoundingClientRect()`로 위치를 자동 계산하여 마커 배치
4. `ResizeObserver`로 리사이즈 시 위치 재계산
5. `data-annotation-id`가 없는 어노테이션은 명시적 `x`/`y` 값으로 폴백 (레거시 지원)

#### `anno-file-locations`
관련 파일 위치:

| 파일 | 역할 |
|------|------|
| `entities/document/types/document.ts` | `SlideAnnotation` 타입 정의 |
| `widgets/slide-presenter/SlidePresenter.tsx` | `AnnotationMarkers`, `AnnotationSidePanel` 컴포넌트 |
| `content/ccp/_components/ActionMenu.tsx` | `annotationId` prop 지원 |
| `content/ccp/_components/Overlay.tsx` | `data-*` pass-through 지원 |
| `content/ccp/_components/DataTable.tsx` | `data-*` pass-through 지원 |
