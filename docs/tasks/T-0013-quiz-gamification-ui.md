# [T-0013] 퀴즈 UI + 게임화 (정답/오답 + 포인트 애니메이션)

## Goal (Why)
학습 카드에 정답/오답 버튼을 추가해 퀴즈 형식으로 학습한다.
결과에 따라 포인트가 적립되고 애니메이션으로 즉각 피드백을 준다.
대시보드 포인트/스트릭 수치를 실시간으로 반영한다.

## Scope (What)
- 포함:
  - 레슨 페이지: 카드 플립 후 정답/오답 버튼 표시
  - 정답 시: 초록 flash + "+10" 포인트 팝업 + POST /learning/submit
  - 오답 시: 빨간 shake 애니메이션 + POST /learning/submit
  - 레슨 완료 시 +50 보너스 표시
  - 대시보드 포인트/진도 카드 GET /points/balance + GET /learning/progress 연동
  - /points 페이지 (잔액 + 오늘 획득 + 리더보드)
- 제외:
  - 주관식 입력 퀴즈 (Post-MVP)
  - 리더보드 친구 관계 (Post-MVP)

## Inputs
- 참고: `claude.md` §11 마이크로 인터랙션 규칙 (정답 flash, 오답 shake)
- 의존: T-0010 (FlipCard UI), T-0012 (Learning/Points API)

## Deliverables
- `apps/web/app/(app)/learn/[curriculumId]/[lessonId]/page.tsx` (정답/오답 버튼 추가)
- `apps/web/app/(app)/points/page.tsx` (포인트 현황 + 리더보드)
- `apps/web/app/(app)/dashboard/page.tsx` (포인트/진도 실시간 연동)
- 검증: 정답 클릭 → "+10" 팝업 → 포인트 업데이트

## Acceptance Criteria
- [ ] 카드 플립 후 "알아요 ✓" / "몰라요 ✗" 버튼 표시
- [ ] 정답 → 초록 테두리 flash + "+10" 떠오르는 텍스트
- [ ] 오답 → 빨간 shake 애니메이션
- [ ] 레슨 완료 화면에 총 획득 포인트 표시
- [ ] /points 페이지: 내 잔액 + 오늘 획득 + 글로벌 리더보드
- [ ] 대시보드 포인트 카드 실제 API 데이터 반영
- [ ] tsc --noEmit 에러 없음

## API / DB Changes
- API: POST /learning/submit, GET /points/balance, GET /learning/progress 호출
- DB: 없음 (기존 API 활용)

## Affected Areas
- Modules: web/(app)/learn, web/(app)/points, web/(app)/dashboard

## Verification Plan
- 수동: 카드 학습 → 정답 선택 → 포인트 페이지에서 잔액 증가 확인

## Dependencies / Risks
- 의존 태스크: T-0010, T-0012 (완료)
- 리스크: DB 미연결 시 API 에러 → 낙관적 UI로 부분 대응

## Status: DONE ✓

## Suggested Model
- Claude: 애니메이션 타이밍, 낙관적 UI 패턴
