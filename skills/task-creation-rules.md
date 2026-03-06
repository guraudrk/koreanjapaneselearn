# Task Creation Rules (Antigravity)

> 이 문서는 PRD와 Implementation Plan을 기반으로, Antigravity 안에서 "좋은 태스크"를 일관되게 생성하기 위한 규칙이다.
>
> 모든 태스크는 `docs/tasks/` 아래에 `T-XXXX-<slug>.md`로 저장한다.
> 예: `docs/tasks/T-0007-dictionary-search-api.md`

---

## 1) 태스크는 "작게, 검증 가능하게" 쪼갠다

- 한 태스크는 **1개의 사용자 가치 (또는 1개의 API/화면/데이터 변경 묶음)** 만 담당
- 한 태스크가 건드리는 영역은 가능하면 **1~2개 모듈**로 제한
- "리팩터링"은 기능 작업과 분리해 별도 태스크로 생성

### 금지 예시

- "전체 아키텍처 개선" (너무 큼)
- "전반적인 UI 정리" (검증 불가)
- "모든 모델/프로바이더 통합" (범위 폭발)

---

## 2) 태스크 템플릿 (필수 필드)

```md
# [T-XXXX] <Task Title>

## Goal (Why)
- 이 태스크가 해결하는 사용자 문제/가치 1~2줄

## Scope (What)
- 포함:
- 제외:

## Inputs
- 참고 문서: PRD, implementation_plan.md, 관련 스펙 링크
- 관련 파일(있다면):

## Deliverables (Artifacts)
- (필수) 코드 변경
- (필수) 검증 방법(테스트/수동 시나리오)
- (선택) API 문서 업데이트, 스크린샷/레코딩, 시퀀스 다이어그램

## Acceptance Criteria (Definition of Done)
- [ ] 조건 1
- [ ] 조건 2
- [ ] 조건 3

## API / DB Changes (if any)
- API:
- DB migration:
- 데이터 seed:

## Affected Areas
- Modules:
- Routes:
- UI Screens:

## Verification Plan
- 자동 테스트:
- 수동 테스트(사용자 시나리오):
- 실패 시 롤백/가드:

## Dependencies / Risks
- 의존 태스크:
- 리스크 & 완화:

## Suggested Model
- Gemini: 아이데이션/대량 초안/문서
- Claude: 설계 검증/리팩터링/디버깅/정확성
```

---

## 3) 태스크 우선순위 (MVP 우선)

1. **Auth / Settings** — 로그인, 학습 모드 저장
2. **Curriculum / Learning Loop** — 레슨/카드/퀴즈/진도
3. **Dictionary** — 검색/상세
4. **Points / Share** — 성장 루프
5. **AI(텍스트) + 일일 제한** — Provider 추상화 포함
6. Post-MVP: STT → 구독 → 이미지 변환

---

## 4) 스토리보드 섹션 (태스크 품질 상승)

각 기능 태스크는 아래 질문에 답하는 스토리보드 섹션을 포함한다:

- 사용자는 어디서 진입?
- 무엇을 입력/클릭?
- 어떤 화면/피드백이 보임?
- DB에는 무엇이 저장?
- 성공/실패/예외 흐름은?

---

## 5) 태스크 분리 기준 (의존성 줄이기)

- **DB 스키마 변경**이 있으면: "스키마/마이그레이션" 태스크를 먼저 분리
- **API 변경**이 크면: "API + 계약(스키마)" 태스크를 먼저 분리
- **UI**는: "API가 준비된 뒤" 붙인다 (단, Mock으로 먼저 UI 만들기는 허용)

---

## 6) 산출물 표준 (저장/추적)

태스크 완료 시 반드시 업데이트:

| 파일 | 업데이트 조건 |
|------|--------------|
| `docs/tasks/T-XXXX-*.md` | Status → DONE, 변경 요약, 검증 결과 |
| `docs/API.md` | 엔드포인트/req/res 변경 시 |
| `docs/ARCHITECTURE.md` | 구조/의사결정 변경 시 |
| `docs/DECISIONS.md` | ADR 형식으로 중요 결정 기록 |
| `progress/PROGRESS.md` | 무엇이 끝났고 다음은 무엇인지 |
| `progress/CHANGELOG.md` | 의사결정 변경 이유 |
| `progress/FAILURES.md` | 막힌 원인/해결 내용 |

**완료 후 반드시**: `git push`로 원격 저장소에 반영

---

## 7) AI 관련 태스크 작성 규칙

AI 관련 태스크는 반드시 아래 항목 포함:
- 일일 제한 정책 (무료/유료)
- 서버 사이드 호출 원칙 (클라이언트 직접 호출 금지)
- 캐싱 전략 (동일 입력 재사용)
- 사용량 집계 테이블/키 설계 (`ai_usage`)

---

## 8) 생성 전 30초 점검 체크리스트

- [ ] Goal이 "사용자 가치"로 표현됐나?
- [ ] Acceptance Criteria가 "검증 가능한 문장"인가?
- [ ] Scope에 "제외"가 적혔나?
- [ ] Verification Plan이 구체적인가?
- [ ] Affected Areas가 현실적인가?
- [ ] GitHub push가 DoD에 포함됐나?
