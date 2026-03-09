# [T-0010] FlipCard 학습 UI + 레슨 진도 페이지

## Goal (Why)
사용자가 실제로 단어/문장 카드를 학습할 수 있는 핵심 화면을 만든다.
카드를 탭하면 뒤집혀 한국어+일본어가 동시에 나타나는 비교 학습 경험을 제공한다.

## Scope (What)
- 포함:
  - FlipCard 컴포넌트 (3D CSS flip, KR/JP/BOTH 모드 대응)
  - 커리큘럼 레슨 목록 페이지 (`/learn/[curriculumId]`)
  - 레슨 학습 페이지 (`/learn/[curriculumId]/[lessonId]`)
  - 진도 바 (Progress Bar) — 현재 카드 위치 시각화
  - 레슨 완료 화면 (🎉 + 다시 학습 / 다음 레슨 버튼)
  - 이전/다음 카드 네비게이션
- 제외:
  - 퀴즈 채점/정답 판별 (추후 태스크)
  - 학습 진도 DB 저장 (추후 태스크)
  - 포인트 적립 (T-0012)

## Inputs
- 참고: `docs/implementation_plan.md` §4 Curriculum/Learning API
- 참고: `claude.md` §11 FlipCard 패턴, Progress Bar
- 의존 태스크: T-0007 (Curriculum API), T-0009 (Dashboard/레이아웃)

## Deliverables (Artifacts)
- `apps/web/components/ui/FlipCard.tsx` (3D 플립 카드 컴포넌트)
- `apps/web/app/(app)/learn/[curriculumId]/page.tsx` (레슨 목록)
- `apps/web/app/(app)/learn/[curriculumId]/[lessonId]/page.tsx` (카드 학습)
- 검증: 카드 클릭 시 3D 플립 + 한국어/일본어 동시 표시

## Acceptance Criteria (Definition of Done)
- [ ] FlipCard 앞면: 영어 단어 표시
- [ ] FlipCard 뒷면: 학습 모드에 따라 KR만 / JP만 / KR+JP 나란히 표시
- [ ] 진도 바: 카드 넘길 때마다 실시간 업데이트
- [ ] 마지막 카드 → "레슨 완료 🎉" 화면 표시
- [ ] GET /lessons/:id API 연동으로 실제 카드 데이터 출력
- [ ] tsc --noEmit 에러 없음

## API / DB Changes
- API: GET /curriculums/:id/lessons, GET /lessons/:id 호출 (기존 API 사용)
- DB: 없음 (진도 저장은 추후)

## Affected Areas
- Modules: web/(app)/learn
- Routes: /learn/[curriculumId], /learn/[curriculumId]/[lessonId]
- UI Screens: 레슨 목록, 카드 학습 화면, 완료 화면

## Verification Plan
- 수동:
  - Given: seed 데이터 존재 (T-0007의 seed.ts 실행 후)
  - When: /learn/curr-kr-basics/lesson-kr-01 진입
  - Then: "hello" 카드 표시 → 클릭 시 "안녕하세요 / こんにちは" 뒷면 확인

## Dependencies / Risks
- 의존 태스크: T-0007 (완료), T-0009 (완료)
- 리스크: DB seed 미실행 시 카드 데이터 없음 → API 빈 배열 반환

## Status: DONE ✓

## Suggested Model
- Claude: CSS 3D transform 검증, 모드별 렌더링 로직
