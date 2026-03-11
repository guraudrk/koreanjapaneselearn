# [T-0012] 학습 제출 API + 포인트 API

## Goal (Why)
카드 학습 결과(정답/오답)를 서버에 저장하고 포인트를 적립한다.
학습할수록 포인트가 쌓이는 게임화 루프의 기반을 만든다.

## Scope (What)
- 포함:
  - LearningModule: POST /learning/submit (카드 결과 저장 + 포인트 적립)
  - LearningModule: GET /learning/progress (유저 진도 요약)
  - PointsModule: GET /points/balance (누적 포인트)
  - GET /points/leaderboard (친구/글로벌 랭킹 기초)
  - 포인트 적립 규칙: 정답 +10, 레슨 완료 +50
- 제외:
  - 구독 티어별 포인트 배율 (Post-MVP)
  - 친구 관계 시스템 (Post-MVP)
  - 포인트 차감/사용 (Post-MVP)

## Inputs
- 참고: `docs/implementation_plan.md` §4 Points/Share API, §5 Milestone 2
- 의존: T-0006 (UserProgress, PointsLedger 테이블), T-0004 (Auth)

## Deliverables
- `apps/api/src/modules/learning/learning.module.ts`
- `apps/api/src/modules/learning/learning.service.ts`
- `apps/api/src/modules/learning/learning.controller.ts`
- `apps/api/src/modules/points/points.module.ts`
- `apps/api/src/modules/points/points.service.ts`
- `apps/api/src/modules/points/points.controller.ts`
- 검증: POST /learning/submit → UserProgress 생성 + PointsLedger 적립

## Acceptance Criteria
- [ ] POST /learning/submit { lessonId, cardId, correct, latencyMs } → { correct, pointsAwarded, totalPoints }
- [ ] GET /learning/progress → { completedCards, correctRate, totalPoints }
- [ ] GET /points/balance → { total, todayEarned }
- [ ] 정답 시 +10 포인트, 레슨 완료 시 +50 포인트 적립
- [ ] tsc --noEmit 에러 없음

## API / DB Changes
- API: POST /learning/submit, GET /learning/progress, GET /points/balance (신규)
- DB: user_progress, points_ledger 행 삽입

## Affected Areas
- Modules: learning (new), points (new)
- Routes: /learning/submit, /learning/progress, /points/balance

## Verification Plan
- 수동: POST /learning/submit { correct: true } → pointsAwarded: 10 반환

## Dependencies / Risks
- 의존 태스크: T-0006 (완료)
- 리스크: 동시 요청 시 포인트 중복 적립 → 트랜잭션으로 방지

## Status: DONE ✓

## Suggested Model
- Claude: 트랜잭션 설계, 포인트 원장 무결성
