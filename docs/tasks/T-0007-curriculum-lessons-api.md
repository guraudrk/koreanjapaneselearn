# [T-0007] Curriculum & Lessons API

## Goal (Why)
사용자가 학습할 커리큘럼 목록과 레슨을 조회할 수 있도록 API를 구현한다.
단계별 커리큘럼(기초~중급) + 학습 카드 조회의 기반을 만든다.

## Scope (What)
- 포함:
  - `CurriculumModule`: GET /curriculums, GET /curriculums/:id/lessons
  - `LessonModule`: GET /lessons/:id (카드 포함)
  - Seed 데이터: 커리큘럼 2개, 레슨 4개, 카드 10개 (KR/JP 예시)
  - JwtAuthGuard 적용
- 제외:
  - 퀴즈 제출/채점 (Post-MVP 단계)
  - 학습 진도 저장 (별도 태스크)
  - 관리자 CRUD (Post-MVP)

## Inputs
- 참고: `docs/implementation_plan.md` §4 Curriculum/Learning API, §5 Milestone 2
- 의존: T-0006 (스키마 완료 후)

## Deliverables
- `apps/api/src/modules/curriculum/curriculum.module.ts`
- `apps/api/src/modules/curriculum/curriculum.service.ts`
- `apps/api/src/modules/curriculum/curriculum.controller.ts`
- `apps/api/prisma/seed.ts` (초기 seed 데이터)
- 검증: GET /curriculums → 커리큘럼 목록 반환

## Acceptance Criteria
- [ ] GET /curriculums → 200 + [ { id, title, language, level, lessonCount } ]
- [ ] GET /curriculums/:id/lessons → 200 + lessons[]
- [ ] GET /lessons/:id → 200 + { lesson, cards[] }
- [ ] 인증 없이 호출 → 401
- [ ] Seed 실행 후 최소 2개 커리큘럼 조회 가능

## API / DB Changes
- API: GET /curriculums, /curriculums/:id/lessons, /lessons/:id
- DB: seed 데이터 삽입

## Affected Areas
- Modules: curriculum (new)
- Routes: /curriculums/*, /lessons/*

## Verification Plan
- `npx prisma db seed` 실행
- curl GET /curriculums → 데이터 반환 확인

## Dependencies / Risks
- 의존 태스크: T-0006 (DB 스키마)
- 리스크: seed 실행에 DB 연결 필요

## Status: DONE ✓

## Suggested Model
- Claude: API 설계 / 쿼리 최적화
