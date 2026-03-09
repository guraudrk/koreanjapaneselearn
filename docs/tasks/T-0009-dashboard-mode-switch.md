# [T-0009] 대시보드 + 학습 모드 스위치 UI

## Goal (Why)
로그인 후 첫 화면에서 자신의 학습 현황을 한눈에 보고,
학습 언어(한국어만 / 동시학습 / 일본어만)를 즉시 전환할 수 있게 한다.

## Scope (What)
- 포함:
  - 앱 공통 사이드바 레이아웃 (`apps/web/app/(app)/layout.tsx`)
  - 대시보드 페이지 (`/dashboard`) — Bento Grid 레이아웃
  - 스트릭(연속 학습일), 포인트, 학습 모드 현황 카드
  - 커리큘럼 목록 미리보기 (API 연동)
  - ModeSwitch 컴포넌트 (3-way pill toggle: KR / BOTH / JP)
  - 모드 변경 시 PATCH /me/settings 즉시 저장
  - 로그인 안 된 상태로 접근 시 /login 리다이렉트
- 제외:
  - 실제 스트릭/포인트 집계 (DB 연동은 추후 T-0012)
  - 알림 기능 (Post-MVP)

## Inputs
- 참고: `docs/implementation_plan.md` §4 User/Settings API
- 참고: `claude.md` §11 Bento Grid, ModeSwitch 패턴
- 의존 태스크: T-0005 (Settings API), T-0007 (Curriculum API), T-0008 (Auth UI)

## Deliverables (Artifacts)
- `apps/web/app/(app)/layout.tsx` (사이드바 + 인증 가드)
- `apps/web/app/(app)/dashboard/page.tsx` (Bento Grid 대시보드)
- `apps/web/components/ui/ModeSwitch.tsx` (3-way pill toggle)
- 검증: 모드 변경 후 새로고침해도 모드 유지 확인

## Acceptance Criteria (Definition of Done)
- [ ] `/dashboard` 진입 시 Bento Grid 카드 레이아웃 표시
- [ ] ModeSwitch에서 JP 선택 → PATCH /me/settings 호출 → 새로고침 후 JP 유지
- [ ] 로그아웃 후 /login 리다이렉트
- [ ] 커리큘럼 목록 GET /curriculums 연동 표시
- [ ] tsc --noEmit 에러 없음

## API / DB Changes
- API: GET /curriculums, PATCH /me/settings 호출 (기존 API 사용)
- DB: 없음 (user_settings 업데이트)

## Affected Areas
- Modules: web/(app)
- Routes: /dashboard
- UI Screens: 사이드바, 대시보드, ModeSwitch

## Verification Plan
- 수동:
  - Given: 로그인된 상태
  - When: ModeSwitch에서 KR 선택
  - Then: 버튼 색상 변경(#FF4D6D), DB에 learningMode="KR" 저장 확인

## Dependencies / Risks
- 의존 태스크: T-0005, T-0007, T-0008 (완료)
- 리스크: Docker DB 없으면 API 응답 없음 → UI는 확인 가능, 데이터는 mock 필요

## Status: DONE ✓

## Suggested Model
- Claude: 상태 관리 설계, Guard 패턴 검증
