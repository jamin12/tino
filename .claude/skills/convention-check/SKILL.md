---
name: convention-check
description: 프로젝트 아키텍처/컨벤션 스킬들을 기준으로 코드를 검증하고 위반 사항을 리포트한다
user_invocable: true
---

# 컨벤션 검증

프로젝트에 정의된 아키텍처/컨벤션 스킬들을 **직접 읽어서** 대상 코드를 검증하고, 위반 사항을 리포트한다.

## 적용 시점

- 새 기능 구현 완료 후 셀프 리뷰
- PR 생성 전 컨벤션 점검
- "컨벤션 체크해줘", "검증해줘", "리뷰해줘" 요청 시
- 리팩토링 후 규칙 준수 확인

---

## 검증 절차

### 1단계: 대상 파일 수집
- 인자가 없으면 `git diff --name-only`로 변경된 파일 목록을 수집한다
- 인자로 파일/디렉토리 경로가 주어지면 해당 범위만 검증한다
- `.ts`, `.tsx` 소스 파일만 대상으로 한다 (설정 파일, SKILL.md 등 제외)

### 2단계: 카테고리 분류 및 스킬 파일 로드
파일 경로 패턴으로 해당 검증 카테고리를 결정한다. 하나의 파일이 여러 카테고리에 해당할 수 있다.

| 파일 경로 패턴 | 참조할 스킬 파일 |
|---------------|-----------------|
| `entities/**` | `entity/SKILL.md` |
| `features/**` | `feature/SKILL.md` |
| `widgets/**` | `widget/SKILL.md` |
| `pages/**` | `page/SKILL.md` |
| `shared/**` | `shared/SKILL.md` |
| `shared/ui/**` | `design-system/SKILL.md` (FSD 섹션) |
| `content/**/_components/**` | `design-system/SKILL.md` (Content 섹션) + `content-design-system/SKILL.md` |
| `content/**/Slide*.tsx` | `design-system/SKILL.md` (슬라이드 규칙) |
| 모든 `.tsx` 컴포넌트 | `component-style/SKILL.md` |
| `**/hooks.ts`, `**/use*.ts` | `state-management/SKILL.md` |
| 모든 파일 (공통) | `architecture/SKILL.md` (의존성 방향) |

### 3단계: 검증 실행
각 대상 파일을 읽고, 로드된 스킬의 규칙을 기준으로 위반 사항을 검출한다.

**검증 항목:**

| 카테고리 | 검증 내용 |
|----------|----------|
| **의존성 방향** | 역방향 import 없는가? 동일 레이어 cross-import 없는가? |
| **Public API** | index.ts가 re-export only인가? 깊은 경로 import 없는가? |
| **레이어 구조** | 디렉토리/파일 구조가 스킬 규칙을 따르는가? |
| **상태 관리** | 서버 상태 vs 클라이언트 상태 분리가 올바른가? |
| **컴포넌트 스타일** | function 선언, named export, Props interface 사용하는가? |
| **디자인 시스템** | 토큰 참조, 계층 의존 방향, raw HTML 금지 등 |

### 4단계: 리포트 출력

심각도별로 분류하여 출력한다.

```
## 컨벤션 검증 결과

### CRITICAL ❌
- `src/features/auth/model/useAuth.ts:3` — arch-no-cross-import 위반
  features/project를 직접 import하고 있음
  → 수정: widgets에서 두 feature를 조합

### HIGH ⚠️
- `src/widgets/dashboard/ui/DashboardWidget.tsx:15` — comp-function-declaration 위반
  const arrow function 사용
  → 수정: function 선언으로 변경

### MEDIUM 💡
- `src/entities/project/index.ts:5` — entity-public-api 개선
  내부 타입이 불필요하게 노출됨

### ✅ PASS (위반 없음)
- component-style: 3개 파일 통과
- state-management: 2개 파일 통과
```

---

## 심각도 기준

| 심각도 | 기준 | 예시 |
|--------|------|------|
| **CRITICAL** | 아키텍처 규칙 위반, 런타임 문제 가능 | 역방향 의존, cross-import, index.ts에 구현 코드 |
| **HIGH** | 컨벤션 위반, 유지보수 문제 | 네이밍 규칙, 상태 관리 혼용, 깊은 경로 import |
| **MEDIUM** | 개선 권장 | 불필요한 export, 타입 개선, 코드 정리 |
