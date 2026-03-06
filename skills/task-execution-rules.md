# Task Execution Rules (Antigravity)

> 목표: "한 번에 크게 바꾸기"가 아니라 **작게, 검증하며, 되돌리기 쉽게** 만드는 것.

---

## 0) 실행 원칙 (절대 규칙)

1. **작은 diff**로 진행한다 (한 번에 많은 파일/대규모 리팩터링 금지)
2. 모든 변경은 **검증(테스트/수동 시나리오)** 후에만 완료로 처리한다
3. 비밀키/토큰/개인정보를 **절대 커밋/로그**에 남기지 않는다
4. 외부 라이브러리 추가는 최소화하고, 추가 시 이유/대안/보안 이슈를 기록한다
5. "추측"이 필요하면 코드보다 먼저 **실험/재현/로그 확인**을 한다

---

## 1) 세션 시작 루틴 (매 세션 동일하게)

1. `claude.md` 읽기
2. **GitHub URL 확인**: `claude.md`의 GitHub 섹션에 주소가 비어 있으면 사용자에게 요청 후 기록
3. **File bootstrap** 수행 — 아래 파일이 없으면 즉시 생성:
   - `progress/PROGRESS.md`
   - `progress/CHANGELOG.md`
   - `progress/FAILURES.md`
   - `docs/`, `docs/tasks/`
4. `progress/PROGRESS.md` 읽기 (현재 태스크/다음 액션/블로커 확인)
5. `docs/tasks/`에서 "지금 태스크 파일" 열기
   - 없다면 `task_creation_rules.md` 기준으로 먼저 만든다

---

## 2) 기본 실행 루프 (반드시 지키기)

| 단계 | 행동 |
|------|------|
| 1. Understand | 태스크 문서를 읽고 5줄로 요약 |
| 2. Plan | 3~7개 마이크로 스텝으로 쪼개기 + 롤백 포인트 명시 |
| 3. Execute | 스텝마다 "작은 diff → 실행/테스트 → 결과 기록" |
| 4. Verify | Acceptance Criteria를 체크박스로 검증 |
| 5. Update | `PROGRESS.md` / `CHANGELOG.md` / `FAILURES.md` 갱신 |
| 6. **Push** | 태스크 완료 시(Status → DONE) 반드시 `git push` 수행 |
| 7. Done | 산출물 정리 (문서/태스크 상태 변경) |

---

## 3) 태스크 실행 3-Step Workflow

### Step 1 — Understand (컨텍스트 정리)

`docs/tasks/T-XXXX...md`를 읽고, 아래를 5줄로 요약:
- Goal / Scope / Acceptance Criteria / Verification Plan / Risks

관련 파일 목록을 만든다 (최대 10개).

### Step 2 — Plan (실행 계획)

- 구현 순서를 **3~7개의 마이크로 스텝**으로 작성
- "실패 시 되돌릴 포인트"를 1개 이상 명시
- 필요하면 먼저 **스키마/계약(API schema)** 부터 만든다

### Step 3 — Execute (구현 + 검증)

각 마이크로 스텝마다:
1. 코드 변경 (최소 범위)
2. 테스트/실행
3. 결과 기록 (성공/실패 + 로그)

마지막에 Acceptance Criteria를 체크박스로 하나씩 검증한다.

---

## 4) 코딩 규칙 (품질/일관성)

- **타입/스키마 우선**: `zod`/DTO/Prisma schema를 먼저 정의하고 구현
- **에러 처리 표준화**: 모든 API는 일관된 오류 포맷 사용 `{ statusCode, message, error }`
- **로깅**: 실패 원인 추적 가능한 수준으로만 (민감정보 제외)
- **API 응답 정규화**: 프론트가 쓰기 좋은 형태로 (불필요한 내부 필드 숨김)

---

## 5) 테스트/검증 규칙 (Done 판정 기준)

### 필수

최소 1개 이상의 검증을 수행해야 DONE 처리 가능:
- 단위 테스트 / 통합 테스트 / 수동 시나리오 (명확한 단계 포함)

### 수동 시나리오 템플릿

```
Given: (사전 조건)
When:  (사용자 행동)
Then:  (예상 결과)
DB 변화:
UI 변화:
```

---

## 6) 변경 범위 제한 가드레일

아래 행동은 태스크 수행 중 자동으로 하지 않는다 (필요 시 별도 승인/별도 태스크):
- 전역 리포 구조 재정비
- lint 규칙/포매터 대규모 변경
- 의존성 대량 업데이트
- 데이터 마이그레이션의 "파괴적 변경" (drop/rename) 단독 실행

---

## 7) AI 기능 (Provider) 실행 규칙

AI 관련 태스크 처리 순서:
1. `packages/ai-core/`에 Provider 인터페이스 정의
2. Mock Provider 먼저 구현 (테스트 가능)
3. Gemini Provider 구현
4. Claude Provider 구현
5. `ai_usage` 집계/일일 제한 적용 (서버 사이드)
6. 캐싱 적용 (동일 입력/옵션)
7. 비용/한도/실패 대응 문서화

### 프롬프트 표준

- 저장 위치: `packages/ai-core/prompts/<feature>.txt`
- 프롬프트에 "입력/출력 스키마"를 명확히 기재 (JSON output 권장)
- 모델별 튜닝 파라미터는 코드가 아니라 설정으로 분리

---

## 8) 완료 루틴 (Artifacts 정리)

태스크 종료 시 반드시 수행:
- `docs/tasks/T-XXXX...md` 업데이트:
  - Status: DONE
  - 변경 요약 5줄
  - 검증 결과 (로그/스크린샷/레코딩 링크)
- `progress/PROGRESS.md` — 무엇이 끝났고 다음은 무엇인지 기록
- `docs/API.md` 업데이트 (해당 시)
- `docs/DECISIONS.md` 업데이트 (의사결정 변경 시)
- `progress/CHANGELOG.md` 업데이트 (의사결정 변경 이유)
- **`git push`** — 모든 변경사항 원격 저장소에 푸쉬

---

## 9) 모델 운영 규칙

- **Gemini**: 초안/대량 생성/문서/리서치/옵션 비교
- **Claude**: 설계 검증/경계조건/디버깅/리팩터링/코드 품질
- 한 태스크의 "메인 실행 모델"은 하나로 정하고, 다른 모델은 리뷰/보완 역할로만 사용

---

## 10) 실패/막힘 대응 (Restart Playbook)

15분 이상 막히면:
1. 재현 단계 최소화
2. 에러 로그/스택트레이스 첨부
3. 변경 diff를 줄이고, 마지막 정상 상태로 롤백
4. "가설 3개 + 검증 실험 1개"로 전환
5. **`progress/FAILURES.md`에 원인/해결 과정 기록** (같은 함정 2번 방지)
