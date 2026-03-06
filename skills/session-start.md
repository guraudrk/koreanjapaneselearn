# Session Start Guide — Engineering Harness

> 이 파일은 "대화"가 아니라 "레포의 파일"을 기준으로 개발이 굴러가게 만드는 작업 하네스다.
> 매 세션 시작 시 이 루틴을 그대로 따른다.

---

## 프로젝트 한 줄 요약

전 세계 사용자가 **한국어/일본어를 기초부터(또는 동시에)** 학습하고, 필요하면 **사전 검색 + AI 번역/간단 설명(일일 제한)**까지 할 수 있는 웹/앱 플랫폼.

- **GitHub**: `https://github.com/guraudrk/koreanjapaneselearn.git`
- **핵심 차별점**: KR/JP 동시 학습 + 비교 학습 카드 + (선택) AI 설명

---

## 진실의 원천 (Single Source of Truth)

> 대화는 휘발되고, 모델은 바뀐다. 아래 파일이 항상 기준이다.

| 파일 | 역할 |
|------|------|
| `docs/prd.md` | 제품 요구사항 |
| `docs/implementation_plan.md` | 구현 계획 |
| `docs/task_creation_rules.md` | 태스크 생성 규칙 |
| `docs/task_execution_rules.md` | 태스크 실행 규칙 |
| `progress/PROGRESS.md` | 현재 태스크/다음 액션/블로커 |

---

## 세션 시작 루틴 (주니어도 그대로 따라하기)

### Step 1 — claude.md 읽기
- `claude.md` 전체 내용 확인

### Step 2 — GitHub URL 확인
- `claude.md`의 GitHub 섹션 확인
- 비어 있다면 사용자에게 요청하고 기록

### Step 3 — File Bootstrap (없으면 자동 생성)

아래 파일/폴더가 없으면 **즉시 생성** 후 진행:

```
progress/PROGRESS.md      ← 반드시 존재
progress/CHANGELOG.md     ← 반드시 존재
progress/FAILURES.md      ← 반드시 존재
docs/                     ← 반드시 존재
docs/tasks/               ← 반드시 존재
```

`PROGRESS.md` 생성 직후 최소 3줄 기록:
```
- 지금 태스크: (태스크 ID 또는 설명)
- 다음 액션: (구체적인 다음 단계)
- 블로커: 없음 (또는 이슈 링크/로그 경로)
```

### Step 4 — PROGRESS.md 읽기
- 현재 태스크 / 다음 액션 / 블로커 확인
- 이전 세션에서 멈춘 지점 파악

### Step 5 — 태스크 파일 열기
- `docs/tasks/`에서 현재 태스크 파일 열기
- 태스크 파일이 없다면: `task_creation_rules.md` 기준으로 먼저 생성

---

## 기본 실행 루프

```
1. Understand  →  태스크 문서 5줄 요약
2. Plan        →  3~7개 마이크로 스텝 + 롤백 포인트
3. Execute     →  작은 diff → 실행/테스트 → 결과 기록
4. Verify      →  Acceptance Criteria 체크박스 검증
5. Update      →  PROGRESS / CHANGELOG / FAILURES 갱신
6. Push        →  태스크 완료 시 반드시 git push
7. Done        →  산출물 정리 (문서/태스크 상태 변경)
```

> 목표는 "한 방에 크게"가 아니라 "작게, 검증하며, 되돌리기 쉽게".

---

## Progress 파일 역할 설명

### PROGRESS.md (필수급)

**역할**: 현재 작업 상태 / 다음 한 걸음 / 블로커를 한 파일에 고정
- 매 세션 시작 시 여기부터 읽고 재개

**없으면**: 세션 끊길 때마다 "어디까지 했지?"가 반복됨

**형식 예시**:
```
- 지금 태스크: T-0001 Auth
- 다음 액션: DB 스키마 확정 → API 엔드포인트 작성
- 블로커: 없음
```

### CHANGELOG.md (선택이지만 효과 큼)

**역할**: 결정이 바뀐 이유 기록
- 나중에 흔들릴 때 복구 가능
- "왜 이 결정을 했는가"를 추적

### FAILURES.md (선택이지만 효과 큼)

**역할**: 막힌 원인/해결 기록
- 같은 함정 2번 방지
- 15분 이상 막힌 경우 반드시 기록

---

## 컨텍스트 흔들림 방지 체크리스트

세션 시작 전:
- [ ] `claude.md` 읽었나?
- [ ] GitHub URL 확인했나?
- [ ] File Bootstrap 완료했나?
- [ ] `PROGRESS.md` 읽고 재개 지점 확인했나?
- [ ] 태스크 파일 열었나?
