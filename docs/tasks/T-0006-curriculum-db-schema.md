# [T-0006] Extended DB Schema (Curriculum / Lesson / Card / Progress / Points)

## Goal (Why)
Milestone 2(커리큘럼/학습 루프)를 위한 DB 스키마를 확장한다.
레슨/카드/진도/포인트 원장 테이블을 Prisma로 정의하고 마이그레이션을 실행한다.

## Scope (What)
- 포함:
  - `Curriculum`, `Lesson`, `Card` 모델
  - `UserProgress` (유저별 카드 학습 기록)
  - `PointsLedger` (포인트 적립/차감 원장)
  - `DictionaryEntry` (백과사전 표제어)
  - `prisma migrate dev` 실행
- 제외:
  - API 구현 (T-0007)
  - AI 관련 테이블 (추후)
  - subscriptions 테이블 (Post-MVP)

## Inputs
- 참고: `docs/implementation_plan.md` §3 데이터 모델, §5 Milestone 2-3

## Deliverables
- `apps/api/prisma/schema.prisma` (확장)
- migration 파일 생성
- 검증: `prisma studio`에서 테이블 확인

## Acceptance Criteria
- [ ] `npx prisma migrate dev` 에러 없이 완료
- [ ] curriculums, lessons, cards, user_progress, points_ledger, dictionary_entries 테이블 생성
- [ ] User와 UserProgress 관계 정상

## API / DB Changes
- DB: 6개 테이블 추가
- API: 없음

## Affected Areas
- Modules: prisma schema

## Verification Plan
- `npx prisma migrate dev --name extend-curriculum`
- `npx prisma generate`

## Dependencies / Risks
- 의존 태스크: T-0004 (schema 확장이 필요)
- 리스크: Docker DB 없으면 migrate dev 불가

## Status: DONE ✓

## Suggested Model
- Claude: 스키마 설계 검증
