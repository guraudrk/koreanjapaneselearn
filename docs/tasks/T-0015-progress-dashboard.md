# [T-0015] 학습 진도 대시보드 강화

## Goal
대시보드에 실제 학습 통계(연속 학습일 streak, 정답률, 완료 카드 수)를 표시한다.

## Scope
- GET /learning/progress 연동 → 대시보드 Streak/정답률 카드 실제 데이터
- API: streak 계산 추가 (연속 학습일)
- 대시보드 "오늘의 학습 현황" 섹션 추가

## Deliverables
- `apps/api/src/modules/learning/learning.service.ts` (streak 계산)
- `apps/web/app/(app)/dashboard/page.tsx` (통계 카드 실제 데이터)

## Status: DONE ✓
