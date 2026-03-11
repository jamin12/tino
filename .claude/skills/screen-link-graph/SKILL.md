---
name: screen-link-graph
description: CCP 슬라이드의 slideMeta.links(화면 연결 그래프) 작성 규칙. 슬라이드에 screenId나 links를 추가/수정할 때 자동 적용.
user_invocable: false
---

# 화면 연결 그래프(Screen Link Graph) 작성 규칙

슬라이드의 `slideMeta.links`는 Screen Map(화면 연결 그래프)의 데이터 소스이다. 이 그래프는 사용자가 버튼을 눌러 화면을 이동하는 **앞으로 가는 흐름(forward flow)**을 시각화한다.

## 적용 시점

- 슬라이드에 `slideMeta`의 `screenId`, `links`를 추가하거나 수정할 때
- 새 슬라이드를 생성할 때
- 슬라이드를 삭제할 때 (고아 노드 점검)

---

## 규칙 목록

### CRITICAL — 앞으로 가는 흐름만 기록

#### `link-forward-only`
`slideMeta.links`에는 **앞으로 가는 흐름(forward navigation)**만 기록한다. 역방향 링크는 시스템이 `incoming`으로 자동 추적하므로 명시하지 않는다.

```tsx
// WRONG — 역방향 링크 포함
export const slideMeta: SlideMeta = {
  screenId: "CCP-STR-001-D1",
  links: [
    { targetScreenId: "CCP-STR-001-D2", type: "tab", label: "Parameters 탭" },
    { targetScreenId: "CCP-STR-001", type: "navigate", label: "목록으로 돌아가기" },  // ❌ 역방향
  ],
};

// CORRECT — 앞으로 가는 흐름만
export const slideMeta: SlideMeta = {
  screenId: "CCP-STR-001-D1",
  links: [
    { targetScreenId: "CCP-STR-001-D2", type: "tab", label: "Parameters 탭" },
  ],
};
```

**금지 패턴 (역방향 링크):**
- `"목록으로 돌아가기"` — 상위 목록으로 복귀
- `"취소 → 목록"` — 작업 취소 후 복귀
- `"생성 완료 → 목록"` / `"연결 완료 → 목록"` — 작업 완료 후 복귀
- `"편집 완료 → ..."` — 편집 완료 후 복귀
- 기타 상위 depth로 올라가는 모든 링크

---

### CRITICAL — 사이드메뉴 네비게이션 금지

#### `link-no-sidebar`
사이드메뉴를 통한 섹션 간 이동 링크는 `slideMeta.links`에 포함하지 않는다. 실질적인 화면 흐름과 무관한 글로벌 네비게이션이다.

```tsx
// WRONG — 사이드메뉴 링크 포함
export const slideMeta: SlideMeta = {
  screenId: "CCP-STR-001",
  links: [
    { targetScreenId: "CCP-STR-001-D1", type: "navigate", label: "행 클릭 → 상세" },
    { targetScreenId: "CCP-DSH-001", type: "navigate", label: "사이드메뉴 → 대시보드" },  // ❌
    { targetScreenId: "CCP-GIT-001", type: "navigate", label: "사이드메뉴 → GitOps" },    // ❌
  ],
};

// CORRECT — 해당 화면의 실질적 흐름만
export const slideMeta: SlideMeta = {
  screenId: "CCP-STR-001",
  links: [
    { targetScreenId: "CCP-STR-001-D1", type: "navigate", label: "행 클릭 → 상세" },
  ],
};
```

---

### CRITICAL — 고아 노드 방지

#### `link-no-orphan`
슬라이드를 삭제할 때, 해당 화면의 하위 상세/생성 슬라이드도 함께 삭제하거나 다른 화면에 연결해야 한다. 어떤 노드에서도 도달할 수 없는 고아 노드가 그래프에 남으면 안 된다.

**점검 방법:**
1. 삭제 대상의 `screenId` (예: `CCP-STR-002`)를 확인
2. 해당 ID를 접두사로 갖는 하위 노드 (예: `CCP-STR-002-D1`, `CCP-STR-002-C2`) 검색
3. 하위 노드를 참조하는 다른 화면이 없으면 함께 삭제
4. 다른 화면의 `links`에서 삭제된 `targetScreenId` 참조도 제거

---

### HIGH — 허용하는 링크 유형

#### `link-allowed-types`
`slideMeta.links`에 포함할 수 있는 링크는 아래 유형만 해당한다. 모두 **앞으로 가는 흐름**이어야 한다.

| type | 용도 | 예시 label |
|------|------|-----------|
| `navigate` | 행 클릭, 버튼 클릭으로 다른 화면 이동 | `"행 클릭 → 상세(프로비저너)"` |
| `modal` | 모달/다이얼로그 열기 | `"생성 버튼 → 생성 다이얼로그"` |
| `tab` | 같은 화면 내 탭 전환 | `"Parameters 탭"`, `"코드 보기 탭"` |
| `action` | 특정 액션으로 인한 화면 전환 | `"위젯 편집 모드"` |

---

### MEDIUM — Focus 모드 레이아웃

#### `link-focus-layout`
Screen Map의 Focus 모드에서 노드 배치:

- **왼쪽**: 나를 연결한 노드 (incoming) — 자동 추적, 명시 불필요
- **중앙**: 현재 포커스 노드
- **오른쪽**: 내가 연결한 노드 (outgoing) — `slideMeta.links`에 기록한 대상

양방향 연결(A→B, B→A)이 있어도 오른쪽(outgoing)으로 분류된다. 역방향 링크를 제거하면 양방향 자체가 발생하지 않으므로 depth가 깔끔하게 표현된다.

---

### LOW — 파일 위치 참고

#### `link-file-locations`

| 파일 | 역할 |
|------|------|
| `entities/document/types/document.ts` | `ScreenLink`, `SlideMeta`, `ScreenLinkMap` 타입 |
| `entities/document/api/content-api.ts` | `buildScreenLinkMap()` — outgoing + incoming 자동 생성 |
| `features/screen-graph/model/use-screen-graph.ts` | React Flow 노드/엣지 변환, Focus 레이아웃 |
| `widgets/screen-graph-viewer/ScreenGraphViewer.tsx` | 그래프 뷰어 UI |
| `pages/document/DocumentPage.tsx` | Screen Map 탭에서 그래프 뷰어 사용 |
