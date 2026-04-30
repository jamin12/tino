---
name: planning-docs
description: 기획 변경이나 신규 기획 시 슬라이드 폴더/docs에 기획 문서를 작성하는 규칙
user_invocable: false
---

# 기획 문서 작성 규칙

기획 변경이나 신규 기획이 있을 때, 해당 슬라이드 폴더 내 `docs/` 디렉토리에 마크다운 파일로 기획 배경과 방향을 기록한다.

## 적용 시점

- 기존 기획이 변경될 때 (메뉴 이동, 구조 개편 등)
- 새로운 화면/기능이 기획될 때
- Dooray 태스크에 기획 내용을 작성할 때 (병행 기록)

---

## 규칙 목록

### CRITICAL — 파일 위치와 구조

#### `plan-file-location`
기획 문서는 해당 기획의 슬라이드 폴더 내부 `docs/` 디렉토리에 작성한다.

```
# WRONG — 프로젝트 루트나 별도 위치
docs/plans/네임스페이스-통합.md
apps/web/src/content/ccp/기획문서.md

# CORRECT — 슬라이드 폴더 내 docs/
apps/web/src/content/ccp/cicd/namespace/docs/네임스페이스-대메뉴-통합.md
apps/web/src/content/ccp/gitops/repositories/docs/저장소-권한-개편.md
```

#### `plan-file-naming`
파일명은 한글 kebab-case로, 기획의 핵심 내용을 나타낸다.

```
# WRONG
docs/plan.md
docs/20260318.md
docs/README.md

# CORRECT
docs/네임스페이스-대메뉴-통합.md
docs/소스저장소-웹훅-추가.md
```

#### `plan-dooray-reference`
Dooray 태스크가 있는 경우 문서 상단에 태스크 번호를 기록한다.

```markdown
# 기획 제목

> Dooray: CONE-Chain-Portal/367
> 작성일: 2026-03-18
```

---

### HIGH — 문서 구성

#### `plan-required-sections`
기획 문서는 다음 순서로 구성한다. 모든 섹션이 필수는 아니며, 기획 규모에 맞게 선택한다.

```markdown
## 1. 배경
왜 이 기획을 하게 되었는지. 현재 구조의 문제점.

## 2. 변경 방향
어떻게 바꿀 것인지. AS-IS → TO-BE 비교.

## 3. 상세
구체적인 구현 내용, 리소스 목록, 프로비저닝 플로우 등.

## 4. 영향 범위
변경으로 인해 수정이 필요한 파일, 컴포넌트, 메뉴 설정 등.

## 5. 기대 효과
변경 후 어떤 개선이 이루어지는지.
```

#### `plan-visual-structure`
메뉴 구조, 플로우 등은 코드 블록이나 테이블로 시각화한다. 텍스트만으로 설명하지 않는다.

```markdown
# WRONG — 텍스트만으로 설명
대시보드 아래에 네임스페이스가 있고 그 아래에 워크스페이스와 네임스페이스 리소스가 있다.

# CORRECT — 트리 구조로 시각화
​```
├─ 대시보드
├─ 네임스페이스
│   ├─ 워크스페이스
│   └─ 네임스페이스 리소스
├─ CI/CD
└─ ...
​```
```

---

### MEDIUM — 기록 원칙

#### `plan-decision-rationale`
주요 결정(네이밍, 구조, 범위 등)에는 반드시 **근거**를 함께 기록한다. 나중에 "왜 이렇게 했지?"를 추적할 수 있어야 한다.

```markdown
# WRONG — 결정만 기록
하위 메뉴를 "워크스페이스"로 명명한다.

# CORRECT — 근거 포함
### 네이밍 결정 근거
- "워크스페이스": namespace 하나가 아니라 작업에 필요한 모든 리소스가
  세트로 생성되므로, "작업 공간"이라는 의미가 정확히 부합
- "네임스페이스 리소스": 대메뉴와의 이름 충돌을 피하기 위해 "리소스" 접미어 추가
```

#### `plan-dooray-sync`
Dooray 태스크에도 기획 내용을 작성하되, `docs/` 문서가 더 상세한 원본이 된다. Dooray에는 배경과 방향 요약을, docs에는 상세 내용을 기록한다.
