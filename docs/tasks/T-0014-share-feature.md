# [T-0014] 공유 기능 (Share Feature)

## Goal (Why)
학습 성과를 소셜 미디어에 공유해 바이럴 루프를 만든다.
고유 공유 링크로 비로그인 사용자도 내 학습 카드를 볼 수 있게 한다.

## Scope (What)
- 포함:
  - API: POST /share (고유 share code 생성)
  - API: GET /share/:code (공개 공유 데이터 조회)
  - OG(Open Graph) meta 태그 (공유 링크 미리보기)
  - 대시보드 공유 버튼 → share link 복사
  - /share/[code] 공개 페이지 (비로그인 접근 가능)
- 제외:
  - 트위터/카카오 SDK 직접 연동 (Post-MVP)
  - 공유 분석 통계 (Post-MVP)

## Inputs
- 참고: `docs/implementation_plan.md` §4 Points/Share API
- 의존: T-0012 (Learning API), T-0013 (Quiz UI)

## Deliverables
- `apps/api/src/modules/share/share.module.ts`
- `apps/api/src/modules/share/share.service.ts`
- `apps/api/src/modules/share/share.controller.ts`
- `apps/web/app/(app)/dashboard/page.tsx` (공유 버튼 추가)
- `apps/web/app/share/[code]/page.tsx` (공개 공유 페이지)
- 검증: POST /share → code 반환 → /share/:code 조회

## Acceptance Criteria
- [ ] POST /share { lessonId } → { code, url }
- [ ] GET /share/:code → lesson + cards 공개 조회 (인증 불필요)
- [ ] /share/[code] 페이지에서 카드 목록 표시
- [ ] OG meta: og:title, og:description 포함
- [ ] 대시보드에 "공유하기" 버튼 → 링크 클립보드 복사 + 토스트 메시지
- [ ] tsc --noEmit 에러 없음

## API / DB Changes
- API: POST /share, GET /share/:code (신규)
- DB: ShareLink 테이블 (id, userId, lessonId, code unique, createdAt)

## Affected Areas
- Modules: share (new)
- Routes: /share/:code
- Web: /share/[code] (공개 라우트)

## Verification Plan
- 수동: 대시보드 공유 버튼 클릭 → URL 복사 → 비로그인 브라우저에서 열기 → 카드 목록 표시

## Dependencies / Risks
- 의존 태스크: T-0012, T-0013 (완료)
- 리스크: share code 충돌 → nanoid/uuid 사용으로 방지

## Status: DONE ✓

## Suggested Model
- Claude: nanoid, OG meta, public route 설계
