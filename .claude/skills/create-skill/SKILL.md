---
name: create-skill
description: 새 스킬(.claude/skills/{스킬명}/SKILL.md) 작성 시 일관된 포맷과 구조를 따르기 위한 가이드라인
user_invocable: true
---

# 스킬 작성 가이드라인

새 스킬 파일을 생성할 때 이 가이드라인을 따른다.
Vercel agent-skills 포맷(https://github.com/vercel-labs/agent-skills)을 기반으로 한다.

## 적용 시점

- 새 스킬 파일 생성
- 기존 스킬 구조 리팩토링
- 스킬 포맷 검증

---

## 규칙 목록

### CRITICAL — 필수 구조

#### `meta-frontmatter`
모든 스킬 파일은 YAML frontmatter로 시작해야 한다. `name`, `description`, `user_invocable` 세 필드는 필수이다.

```yaml
# WRONG — 필수 필드 누락
---
name: my-skill
---

# CORRECT
---
name: my-skill
description: 스킬이 하는 일을 한 줄로 설명
user_invocable: true
---
```

- `name`: 스킬 식별자. 디렉토리명과 일치해야 한다.
- `description`: 스킬의 목적을 한 줄로 설명한다.
- `user_invocable`: 사용자가 `/스킬명`으로 직접 호출 가능한지 여부.

#### `meta-file-location`
스킬은 `.claude/skills/{스킬명}/SKILL.md` 경로에 위치한다. 디렉토리명이 스킬 식별자가 된다.

```
# WRONG
.claude/skills/my-skill.md
.claude/my-skill/SKILL.md
skills/my-skill/SKILL.md

# CORRECT
.claude/skills/my-skill/SKILL.md
```

#### `meta-guideline-not-template`
스킬은 코드 템플릿이나 보일러플레이트 생성기가 아니라, 가이드라인과 규칙의 집합이다. 에이전트가 상황에 맞게 판단할 수 있도록 원칙을 서술한다.

```markdown
# WRONG — 코드 템플릿
이 파일을 복사해서 사용하세요:
\`\`\`kotlin
class MyService { ... }
\`\`\`

# CORRECT — 가이드라인
서비스 클래스는 생성자 주입을 사용하고, 인터페이스(Port)에만 의존한다.
\`\`\`kotlin
// WRONG
@Autowired lateinit var repo: UserRepository

// CORRECT
class CreateUserUseCase(
    private val saveUserOutPort: SaveUserOutPort,
) : CreateUserInPort { ... }
\`\`\`
```

---

### HIGH — 규칙 작성법

#### `rule-category-priority`
규칙은 우선순위별 카테고리로 그룹화한다. 카테고리는 H3(`###`), 개별 규칙은 H4(`####`)로 작성한다.

```markdown
### CRITICAL — {카테고리 설명}
### HIGH — {카테고리 설명}
### MEDIUM — {카테고리 설명}
### LOW — {카테고리 설명}
```

모든 카테고리를 사용할 필요는 없다. 스킬에 맞는 카테고리만 포함한다.

#### `rule-id-format`
각 규칙에는 `prefix-name` 형식의 고유 ID를 부여한다. H4 헤딩에 백틱으로 감싸서 표기한다. prefix는 스킬의 도메인을 나타낸다.

```markdown
# WRONG — ID 없음
#### 파일 위치 규칙
...

# WRONG — prefix 없음
#### `file-location`

# CORRECT
#### `structure-convention-plugin`
#### `version-catalog`
#### `meta-frontmatter`
```

#### `rule-example-pairs`
규칙에는 가능한 한 WRONG/CORRECT 쌍의 코드 예시를 포함한다. 에이전트가 안티패턴과 올바른 패턴을 명확히 구분할 수 있도록 한다.

```markdown
#### `my-rule-name`
규칙에 대한 설명을 작성한다.

\`\`\`kotlin
// WRONG
badCode()

// CORRECT
goodCode()
\`\`\`
```

---

### MEDIUM — 문서 구조

#### `doc-header`
frontmatter 직후 H1 제목과 한 줄 설명을 작성한다. 그 아래 "적용 시점" 섹션에서 이 스킬이 활성화되어야 하는 상황을 나열한다.

```markdown
# {스킬 제목}

{스킬이 하는 일에 대한 한 줄 설명}

## 적용 시점

- 상황 1
- 상황 2
```

#### `doc-separator`
카테고리 그룹 사이에 수평선(`---`)을 넣어 시각적으로 구분한다.

#### `doc-concise`
설명은 간결하게 작성한다. 불필요한 배경 설명이나 튜토리얼 형식을 피하고, 에이전트가 즉시 적용할 수 있는 명확한 지시만 포함한다.

---

### LOW — 네이밍

#### `naming-directory`
스킬 디렉토리명은 소문자 kebab-case를 사용한다. 스킬의 핵심 동작이나 도메인을 나타내는 이름을 선택한다.

```
# WRONG
.claude/skills/CreateSkill/SKILL.md
.claude/skills/create_skill/SKILL.md
.claude/skills/my.skill/SKILL.md

# CORRECT
.claude/skills/create-skill/SKILL.md
.claude/skills/setup-gradle/SKILL.md
.claude/skills/frontend-ui-ux/SKILL.md
```

#### `naming-prefix`
규칙 ID의 prefix는 스킬 도메인에서 일관되게 사용한다. 한 스킬 내에서 여러 prefix를 섞지 않는 것이 좋다. 단, 카테고리가 명확히 다른 경우는 허용한다.

```markdown
# WRONG — 무관한 prefix 혼용
#### `api-auth-check`
#### `db-connection-pool`
#### `ui-button-style`

# CORRECT — 도메인 일관성
#### `auth-token-validation`
#### `auth-session-expiry`
#### `auth-role-check`
```
