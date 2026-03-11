# [T-0011] 사전 검색 API + 웹 UI

## Goal (Why)
사용자가 영어 단어를 검색하면 한국어·일본어 뜻, 읽기, 예문을 동시에 볼 수 있다.
"백과사전" 기능으로 학습 외 자유 검색 수요를 충족한다.

## Scope (What)
- 포함:
  - NestJS DictionaryModule: GET /dictionary/search?q=&from=en
  - NestJS DictionaryModule: GET /dictionary/:id (상세)
  - 웹 /dictionary 페이지 (검색 입력 + 결과 카드)
  - KR/JP 결과 나란히 표시 (비교 UI)
  - 결과 없을 때 빈 상태 UI
- 제외:
  - 관리자 사전 등록/수정 (Post-MVP)
  - 자동완성 드롭다운 (Post-MVP)
  - 음성 발음 재생 (Post-MVP)

## Inputs
- 참고: `docs/implementation_plan.md` §4 Dictionary API, §5 Milestone 3
- 참고: `claude.md` §11 디자인 시스템
- 의존: T-0006 (DictionaryEntry 테이블), T-0009 (앱 레이아웃)

## Deliverables
- `apps/api/src/modules/dictionary/dictionary.module.ts`
- `apps/api/src/modules/dictionary/dictionary.service.ts`
- `apps/api/src/modules/dictionary/dictionary.controller.ts`
- `apps/web/app/(app)/dictionary/page.tsx`
- 검증: GET /dictionary/search?q=hello → seed 데이터 반환

## Acceptance Criteria
- [ ] GET /dictionary/search?q=water → [{ id, en, ko, ja, koReading, jaReading, tags }]
- [ ] GET /dictionary/:id → 상세 + examples
- [ ] 검색 결과 없으면 빈 상태 UI 표시
- [ ] 인증 없이 접근 → 401
- [ ] tsc --noEmit 에러 없음

## API / DB Changes
- API: GET /dictionary/search, GET /dictionary/:id (신규)
- DB: 없음 (DictionaryEntry 기존 테이블 사용)

## Affected Areas
- Modules: dictionary (new)
- Routes: /dictionary/search, /dictionary/:id
- UI Screens: /dictionary 페이지

## Verification Plan
- 수동: curl GET /dictionary/search?q=water → seed의 water 항목 반환

## Dependencies / Risks
- 의존 태스크: T-0006 (완료)
- 리스크: seed 미실행 시 검색 결과 없음

## Status: DONE ✓

## Suggested Model
- Claude: 검색 쿼리 최적화 (insensitive 검색)
