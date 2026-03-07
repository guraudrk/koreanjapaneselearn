# [T-0005] User Profile & Settings API (GET /me, PATCH /me/settings)

## Goal (Why)
로그인한 사용자가 자신의 프로필을 조회하고 학습 모드(KR/JP/BOTH)를 변경할 수 있어야 한다.
학습 모드 전환 스위치의 백엔드 기반을 만든다.

## Scope (What)
- 포함:
  - GET /me → 현재 유저 정보 + settings 반환
  - PATCH /me/settings → learningMode, notifications 업데이트
  - JwtAuthGuard 적용
- 제외:
  - 비밀번호 변경 (Post-MVP)
  - 프로필 사진 업로드 (Post-MVP)
  - 학습 진도 데이터 (T-0007)

## Inputs
- 참고: `docs/implementation_plan.md` §4 User/Settings API
- 관련 파일: T-0004 완료 후 UsersModule, AuthModule

## Deliverables
- `apps/api/src/modules/users/users.controller.ts`
- `apps/api/src/modules/users/dto/update-settings.dto.ts`
- 검증: JWT 토큰으로 GET /me 호출 → 200

## Acceptance Criteria
- [ ] GET /me → 200 + { id, email, nativeLanguage, settings: { learningMode } }
- [ ] PATCH /me/settings { learningMode: "KR" } → 200 + updated settings
- [ ] 인증 없이 GET /me → 401

## API / DB Changes
- API: GET /me, PATCH /me/settings
- DB: 없음 (기존 user_settings 활용)

## Affected Areas
- Modules: users
- Routes: /me, /me/settings

## Verification Plan
- 수동: curl -H "Authorization: Bearer <token>" GET /me → user 객체 반환

## Dependencies / Risks
- 의존 태스크: T-0004 (Auth 완료 후)

## Status: TODO

## Suggested Model
- Claude: Guard 적용 검증
